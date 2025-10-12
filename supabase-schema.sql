-- Auto Manage Suite Database Schema
-- �������� ������ ��� ������� ���������� ����������

-- ������� cars (����������)
CREATE TABLE cars (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  model VARCHAR(255) NOT NULL,
  year VARCHAR(4) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price_per_day DECIMAL(10,2) NOT NULL,
  fuel_type VARCHAR(50) NOT NULL,
  transmission VARCHAR(50) NOT NULL,
  seats INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'available',
  description TEXT,
  image VARCHAR(500) NOT NULL,
  images TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ������� bookings (������������)
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  
  -- Customer Information
  customer_name VARCHAR(255) NOT NULL,
  customer_country VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  
  -- Car Information
  car_id INTEGER REFERENCES cars(id) ON DELETE CASCADE,
  car_name VARCHAR(255) NOT NULL,
  
  -- Rental Dates
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
  
  -- Additional Details
  pickup_location VARCHAR(255) NOT NULL,
  return_location VARCHAR(255) NOT NULL,
  notes TEXT,
  
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ������� financial_records (���������� ������)
CREATE TABLE financial_records (
  id SERIAL PRIMARY KEY,
  type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
  category VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ������� settings (���������)
CREATE TABLE settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  company_name VARCHAR(255) NOT NULL,
  company_email VARCHAR(255) NOT NULL,
  company_phone VARCHAR(20) NOT NULL,
  company_address TEXT NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT '?',
  timezone VARCHAR(50) NOT NULL DEFAULT 'Asia/Baku',
  language VARCHAR(10) NOT NULL DEFAULT 'ru',
  notifications JSONB NOT NULL DEFAULT '{"email": true, "sms": false, "push": true}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- �������� Row Level Security
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- ������� ��� ���������� ������� (��� ����-������)
CREATE POLICY "Allow all operations on cars" ON cars FOR ALL USING (true);
CREATE POLICY "Allow all operations on bookings" ON bookings FOR ALL USING (true);
CREATE POLICY "Allow all operations on financial_records" ON financial_records FOR ALL USING (true);
CREATE POLICY "Allow all operations on settings" ON settings FOR ALL USING (true);

-- �������� ������
INSERT INTO settings (company_name, company_email, company_phone, company_address) 
VALUES ('Auto Manage Suite', 'info@automanage.az', '+994 12 345 67 89', 'Baku, Azerbaijan');

INSERT INTO cars (name, model, year, category, price_per_day, fuel_type, transmission, seats, image) VALUES
('Toyota Camry', 'Camry', '2023', 'Business', 45.00, 'Petrol', 'Automatic', 5, '/placeholder.svg'),
('BMW X5', 'X5', '2022', 'Premium', 85.00, 'Petrol', 'Automatic', 7, '/placeholder.svg'),
('Mercedes C-Class', 'C-Class', '2023', 'Premium', 75.00, 'Petrol', 'Automatic', 5, '/placeholder.svg'),
('Hyundai Sonata', 'Sonata', '2022', 'Economy', 35.00, 'Petrol', 'Automatic', 5, '/placeholder.svg'),
('Audi Q7', 'Q7', '2023', 'Premium', 95.00, 'Petrol', 'Automatic', 7, '/placeholder.svg'),
('Kia Rio', 'Rio', '2021', 'Economy', 25.00, 'Petrol', 'Manual', 5, '/placeholder.svg');

-- Sample bookings
INSERT INTO bookings (customer_name, customer_country, customer_phone, car_id, car_name, start_date, end_date, rental_days, delivery_to_airport, delivery_to_hotel, full_insurance, total_amount, daily_rate, owner_amount, my_income, pickup_location, return_location, status) VALUES
('John Smith', 'USA', '+1 555 123 4567', 1, 'Toyota Camry', '2024-10-15', '2024-10-25', 10, true, false, true, 2000.00, 200.00, 1500.00, 500.00, 'Airport', 'Airport', 'confirmed'),
('Emma Wilson', 'UK', '+44 20 7946 0958', 2, 'BMW X5', '2024-10-20', '2024-10-27', 7, false, true, true, 3000.00, 428.57, 2200.00, 800.00, 'Hotel', 'Airport', 'active'),
('Mohammed Ali', 'UAE', '+971 50 123 4567', 3, 'Mercedes C-Class', '2024-10-18', '2024-10-23', 5, true, false, false, 1500.00, 300.00, 1100.00, 400.00, 'Office', 'Office', 'confirmed');
