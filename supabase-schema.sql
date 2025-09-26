-- Auto Manage Suite Database Schema
-- Создание таблиц для системы управления автопарком

-- Таблица cars (автомобили)
CREATE TABLE cars (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  model VARCHAR(255) NOT NULL,
  year VARCHAR(4) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price_per_day DECIMAL(10,2) NOT NULL,
  weekly_price DECIMAL(10,2),
  monthly_price DECIMAL(10,2),
  mileage INTEGER NOT NULL,
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

-- Таблица clients (клиенты)
CREATE TABLE clients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  total_bookings INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'new',
  join_date DATE NOT NULL,
  last_booking DATE,
  avatar VARCHAR(500) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица bookings (бронирования)
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
  car_id INTEGER REFERENCES cars(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  pickup_location VARCHAR(255) NOT NULL,
  return_location VARCHAR(255) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица financial_records (финансовые записи)
CREATE TABLE financial_records (
  id SERIAL PRIMARY KEY,
  type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
  category VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица settings (настройки)
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

-- ключение Row Level Security
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- олитики для анонимного доступа (для демо-версии)
CREATE POLICY "Allow all operations on cars" ON cars FOR ALL USING (true);
CREATE POLICY "Allow all operations on clients" ON clients FOR ALL USING (true);
CREATE POLICY "Allow all operations on bookings" ON bookings FOR ALL USING (true);
CREATE POLICY "Allow all operations on financial_records" ON financial_records FOR ALL USING (true);
CREATE POLICY "Allow all operations on settings" ON settings FOR ALL USING (true);

-- ачальные данные
INSERT INTO settings (company_name, company_email, company_phone, company_address) 
VALUES ('Auto Manage Suite', 'info@automanage.az', '+994 12 345 67 89', 'Baku, Azerbaijan');

INSERT INTO cars (name, model, year, category, price_per_day, mileage, fuel_type, transmission, seats, image) VALUES
('Toyota Camry', 'Camry', '2023', 'Business', 45.00, 12500, 'Petrol', 'Automatic', 5, '/placeholder.svg'),
('BMW X5', 'X5', '2022', 'Premium', 85.00, 8500, 'Petrol', 'Automatic', 7, '/placeholder.svg'),
('Mercedes C-Class', 'C-Class', '2023', 'Premium', 75.00, 5200, 'Petrol', 'Automatic', 5, '/placeholder.svg'),
('Hyundai Sonata', 'Sonata', '2022', 'Economy', 35.00, 18000, 'Petrol', 'Automatic', 5, '/placeholder.svg'),
('Audi Q7', 'Q7', '2023', 'Premium', 95.00, 3200, 'Petrol', 'Automatic', 7, '/placeholder.svg'),
('Kia Rio', 'Rio', '2021', 'Economy', 25.00, 32000, 'Petrol', 'Manual', 5, '/placeholder.svg');

INSERT INTO clients (name, email, phone, total_bookings, total_spent, status, join_date, last_booking, avatar) VALUES
('Ali Aliyev', 'ali.aliev@email.com', '+994 55 123 45 67', 12, 2340.00, 'vip', '2023-03-15', '2024-06-10', '/placeholder.svg'),
('Leyla Mamedova', 'leyla.mamedova@email.com', '+994 50 987 65 43', 8, 1250.00, 'regular', '2023-07-22', '2024-06-14', '/placeholder.svg'),
('Rasim Gasanov', 'rasim.gasanov@email.com', '+994 77 555 33 22', 15, 3890.00, 'vip', '2022-11-08', '2024-06-08', '/placeholder.svg'),
('Nigar Ismayilova', 'nigar.ismayilova@email.com', '+994 51 444 77 88', 5, 680.00, 'regular', '2024-01-12', '2024-06-13', '/placeholder.svg'),
('Elchin Kerimov', 'elchin.kerimov@email.com', '+994 70 111 22 33', 3, 420.00, 'new', '2024-05-18', '2024-06-15', '/placeholder.svg'),
('Sabina Ahmadova', 'sabina.ahmadova@email.com', '+994 55 777 88 99', 20, 5200.00, 'vip', '2022-05-03', '2024-06-12', '/placeholder.svg');
