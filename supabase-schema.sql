-- RentLease Database Schema
-- Clean and optimized schema for car rental management

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS cars CASCADE;
DROP TABLE IF EXISTS monthly_expenses CASCADE;
DROP TABLE IF EXISTS settings CASCADE;

-- Create cars table
CREATE TABLE cars (
  id SERIAL PRIMARY KEY,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  color VARCHAR(50) NOT NULL,
  plate_number VARCHAR(20) UNIQUE NOT NULL,
  daily_rate DECIMAL(10,2) NOT NULL,
  owner_rate DECIMAL(10,2) NOT NULL,
  insurance_price DECIMAL(10,2) DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  -- Customer Information
  customer_name VARCHAR(255) NOT NULL,
  customer_country VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  -- Car Information
  car_id INTEGER REFERENCES cars(id) ON DELETE CASCADE,
  car_name VARCHAR(255) NOT NULL,
  -- Rental Details
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  rental_days INTEGER NOT NULL,
  -- Delivery Options
  delivery_to_airport BOOLEAN DEFAULT false,
  delivery_to_hotel BOOLEAN DEFAULT false,
  delivery_location VARCHAR(255),
  -- Insurance
  full_insurance BOOLEAN DEFAULT false,
  -- Financial Details
  total_amount DECIMAL(10,2) NOT NULL,
  daily_rate DECIMAL(10,2) NOT NULL,
  owner_amount DECIMAL(10,2) NOT NULL,
  my_income DECIMAL(10,2) NOT NULL,
  -- Locations
  pickup_location VARCHAR(255) NOT NULL CHECK (pickup_location IN ('Office', 'Hotel', 'Airport')),
  return_location VARCHAR(255) NOT NULL CHECK (return_location IN ('Office', 'Hotel', 'Airport')),
  -- Additional Info
  notes TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create monthly expenses table
CREATE TABLE monthly_expenses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  is_recurring BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create settings table
CREATE TABLE settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  company_name VARCHAR(255) DEFAULT 'RentLease',
  currency VARCHAR(10) DEFAULT '₼',
  timezone VARCHAR(50) DEFAULT 'Asia/Baku',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_cars_brand_model ON cars(brand, model);
CREATE INDEX idx_cars_plate_number ON cars(plate_number);
CREATE INDEX idx_cars_is_available ON cars(is_available);
CREATE INDEX idx_bookings_car_id ON bookings(car_id);
CREATE INDEX idx_bookings_start_date ON bookings(start_date);
CREATE INDEX idx_bookings_end_date ON bookings(end_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_customer_name ON bookings(customer_name);
CREATE INDEX idx_bookings_customer_phone ON bookings(customer_phone);
CREATE INDEX idx_monthly_expenses_date ON monthly_expenses(date);
CREATE INDEX idx_monthly_expenses_is_recurring ON monthly_expenses(is_recurring);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cars_updated_at BEFORE UPDATE ON cars
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_monthly_expenses_updated_at BEFORE UPDATE ON monthly_expenses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all operations for authenticated users)
CREATE POLICY "Enable all operations for authenticated users on cars" ON cars
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for authenticated users on bookings" ON bookings
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for authenticated users on monthly_expenses" ON monthly_expenses
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for authenticated users on settings" ON settings
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert sample data
INSERT INTO settings (id, company_name, currency, timezone) VALUES (1, 'RentLease', '₼', 'Asia/Baku');

INSERT INTO cars (brand, model, year, color, plate_number, daily_rate, owner_rate, insurance_price, is_available, description) VALUES
('Toyota', 'Camry', 2022, 'White', '10-AB-123', 80.00, 60.00, 10.00, true, 'Comfortable sedan with automatic transmission'),
('BMW', 'X5', 2023, 'Black', '10-CD-456', 120.00, 90.00, 15.00, true, 'Luxury SUV with all-wheel drive'),
('Mercedes', 'C-Class', 2022, 'Silver', '10-EF-789', 100.00, 75.00, 12.00, true, 'Premium sedan with advanced features'),
('Audi', 'A4', 2023, 'Blue', '10-GH-012', 90.00, 70.00, 11.00, true, 'Sporty sedan with quattro system'),
('Hyundai', 'Elantra', 2021, 'Red', '10-IJ-345', 60.00, 45.00, 8.00, true, 'Economical compact car');

INSERT INTO bookings (customer_name, customer_country, customer_phone, car_id, car_name, start_date, end_date, rental_days, delivery_to_airport, delivery_to_hotel, delivery_location, full_insurance, total_amount, daily_rate, owner_amount, my_income, pickup_location, return_location, notes, status) VALUES
('Ahmet Yılmaz', 'Turkey', '+90-555-123-4567', 1, 'Toyota Camry', '2024-01-15', '2024-01-20', 5, false, true, 'Hilton Hotel', true, 400.00, 80.00, 300.00, 100.00, 'Office', 'Hotel', 'Customer prefers morning pickup', 'confirmed'),
('John Smith', 'USA', '+1-555-987-6543', 2, 'BMW X5', '2024-01-18', '2024-01-25', 7, true, false, 'Heydar Aliyev Airport', true, 840.00, 120.00, 630.00, 210.00, 'Airport', 'Office', 'International customer', 'active'),
('Maria Garcia', 'Spain', '+34-666-555-444', 3, 'Mercedes C-Class', '2024-01-22', '2024-01-26', 4, false, false, NULL, false, 400.00, 100.00, 300.00, 100.00, 'Office', 'Office', 'Business trip', 'pending');

INSERT INTO monthly_expenses (name, amount, date, description, is_recurring) VALUES
('Office Rent', 500.00, '2024-01-01', 'Monthly office rent payment', true),
('Insurance Premium', 200.00, '2024-01-01', 'Monthly insurance premium', true),
('Marketing Campaign', 300.00, '2024-01-15', 'Social media advertising', false),
('Car Maintenance', 150.00, '2024-01-20', 'Regular maintenance for fleet', false),
('Utilities', 100.00, '2024-01-01', 'Electricity and water bills', true);

-- Create views for common queries
CREATE VIEW booking_summary AS
SELECT 
    b.id,
    b.customer_name,
    b.customer_country,
    b.car_name,
    b.start_date,
    b.end_date,
    b.rental_days,
    b.total_amount,
    b.my_income,
    b.status,
    c.brand,
    c.model,
    c.color
FROM bookings b
JOIN cars c ON b.car_id = c.id;

CREATE VIEW monthly_financial_summary AS
SELECT 
    DATE_TRUNC('month', b.start_date) as month,
    COUNT(*) as total_bookings,
    SUM(b.total_amount) as total_revenue,
    SUM(b.my_income) as total_profit,
    SUM(e.amount) as total_expenses,
    SUM(b.my_income) - COALESCE(SUM(e.amount), 0) as net_profit
FROM bookings b
LEFT JOIN monthly_expenses e ON DATE_TRUNC('month', e.date) = DATE_TRUNC('month', b.start_date)
WHERE b.status IN ('confirmed', 'active', 'completed')
GROUP BY DATE_TRUNC('month', b.start_date)
ORDER BY month DESC;

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;