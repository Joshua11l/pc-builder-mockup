-- =====================================================
-- PC BUILDER DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- RLS DISABLED for easier development
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- COMPONENTS TABLE
-- Stores all PC components (CPU, GPU, RAM, etc.)
-- =====================================================
CREATE TABLE IF NOT EXISTS components (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('cpu', 'gpu', 'motherboard', 'ram', 'storage', 'psu', 'case', 'cooler')),
  name TEXT NOT NULL,
  brand TEXT,
  price DECIMAL(10, 2) NOT NULL,
  specs JSONB NOT NULL,
  vendor_links JSONB,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- BUILDS TABLE
-- Stores user-generated PC builds
-- =====================================================
CREATE TABLE IF NOT EXISTS builds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  build_name TEXT NOT NULL,
  components JSONB NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  budget DECIMAL(10, 2),
  compatibility_report JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ACTIVITY_LOG TABLE
-- Logs user actions
-- =====================================================
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES for Performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_components_type ON components(type);
CREATE INDEX IF NOT EXISTS idx_components_price ON components(price);
CREATE INDEX IF NOT EXISTS idx_builds_user_id ON builds(user_id);
CREATE INDEX IF NOT EXISTS idx_builds_created_at ON builds(created_at DESC);

-- =====================================================
-- DISABLE RLS (for easier development)
-- =====================================================
ALTER TABLE components DISABLE ROW LEVEL SECURITY;
ALTER TABLE builds DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Components are viewable by everyone" ON components;
DROP POLICY IF EXISTS "Only admins can manage components" ON components;
DROP POLICY IF EXISTS "Users can view their own builds" ON builds;
DROP POLICY IF EXISTS "Users can create their own builds" ON builds;
DROP POLICY IF EXISTS "Users can update their own builds" ON builds;
DROP POLICY IF EXISTS "Users can delete their own builds" ON builds;
DROP POLICY IF EXISTS "Users can view their own activity" ON activity_log;
DROP POLICY IF EXISTS "Users can create their own activity logs" ON activity_log;

-- =====================================================
-- FUNCTIONS
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
DROP TRIGGER IF EXISTS update_components_updated_at ON components;
CREATE TRIGGER update_components_updated_at
  BEFORE UPDATE ON components
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_builds_updated_at ON builds;
CREATE TRIGGER update_builds_updated_at
  BEFORE UPDATE ON builds
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SAMPLE DATA - 100+ COMPONENTS
-- =====================================================

-- Clear existing data
TRUNCATE TABLE components CASCADE;

-- =====================================================
-- CPUs (20 components)
-- =====================================================
INSERT INTO components (type, name, brand, price, specs, vendor_links, image_url) VALUES
-- AMD Ryzen 7000 Series
('cpu', 'AMD Ryzen 5 7600', 'AMD', 229.99, '{"socket": "AM5", "cores": 6, "threads": 12, "base_clock": "3.8 GHz", "boost_clock": "5.1 GHz", "tdp": 65}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BBHD7Z53"}'::jsonb, 'https://m.media-amazon.com/images/I/51K5M5eqKrL._AC_SL1200_.jpg'),
('cpu', 'AMD Ryzen 5 7600X', 'AMD', 249.99, '{"socket": "AM5", "cores": 6, "threads": 12, "base_clock": "4.7 GHz", "boost_clock": "5.3 GHz", "tdp": 105}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BBJDS62N"}'::jsonb, 'https://m.media-amazon.com/images/I/51K5M5eqKrL._AC_SL1200_.jpg'),
('cpu', 'AMD Ryzen 7 7700', 'AMD', 329.99, '{"socket": "AM5", "cores": 8, "threads": 16, "base_clock": "3.8 GHz", "boost_clock": "5.3 GHz", "tdp": 65}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BQLTRMSS"}'::jsonb, 'https://m.media-amazon.com/images/I/51K5M5eqKrL._AC_SL1200_.jpg'),
('cpu', 'AMD Ryzen 7 7700X', 'AMD', 349.99, '{"socket": "AM5", "cores": 8, "threads": 16, "base_clock": "4.5 GHz", "boost_clock": "5.4 GHz", "tdp": 105}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BBHHT7HJ"}'::jsonb, 'https://m.media-amazon.com/images/I/51K5M5eqKrL._AC_SL1200_.jpg'),
('cpu', 'AMD Ryzen 7 7800X3D', 'AMD', 449.99, '{"socket": "AM5", "cores": 8, "threads": 16, "base_clock": "4.2 GHz", "boost_clock": "5.0 GHz", "tdp": 120}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BTZB7F88"}'::jsonb, 'https://m.media-amazon.com/images/I/51K5M5eqKrL._AC_SL1200_.jpg'),
('cpu', 'AMD Ryzen 9 7900', 'AMD', 429.99, '{"socket": "AM5", "cores": 12, "threads": 24, "base_clock": "3.7 GHz", "boost_clock": "5.4 GHz", "tdp": 65}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BQLTQXYT"}'::jsonb, 'https://m.media-amazon.com/images/I/51K5M5eqKrL._AC_SL1200_.jpg'),
('cpu', 'AMD Ryzen 9 7900X', 'AMD', 449.99, '{"socket": "AM5", "cores": 12, "threads": 24, "base_clock": "4.7 GHz", "boost_clock": "5.6 GHz", "tdp": 170}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BBHD5D8Y"}'::jsonb, 'https://m.media-amazon.com/images/I/51K5M5eqKrL._AC_SL1200_.jpg'),
('cpu', 'AMD Ryzen 9 7950X', 'AMD', 549.99, '{"socket": "AM5", "cores": 16, "threads": 32, "base_clock": "4.5 GHz", "boost_clock": "5.7 GHz", "tdp": 170}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BBHHT9LY"}'::jsonb, 'https://m.media-amazon.com/images/I/51K5M5eqKrL._AC_SL1200_.jpg'),

-- Intel 13th Gen
('cpu', 'Intel Core i5-13400F', 'Intel', 199.99, '{"socket": "LGA1700", "cores": 10, "threads": 16, "base_clock": "2.5 GHz", "boost_clock": "4.6 GHz", "tdp": 65}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BN5Z6LJ7"}'::jsonb, 'https://m.media-amazon.com/images/I/61gYqsRT3aL._AC_SL1200_.jpg'),
('cpu', 'Intel Core i5-13600K', 'Intel', 289.99, '{"socket": "LGA1700", "cores": 14, "threads": 20, "base_clock": "3.5 GHz", "boost_clock": "5.1 GHz", "tdp": 125}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BCF57FL5"}'::jsonb, 'https://m.media-amazon.com/images/I/61gYqsRT3aL._AC_SL1200_.jpg'),
('cpu', 'Intel Core i5-13600KF', 'Intel', 279.99, '{"socket": "LGA1700", "cores": 14, "threads": 20, "base_clock": "3.5 GHz", "boost_clock": "5.1 GHz", "tdp": 125}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BCHBTVXC"}'::jsonb, 'https://m.media-amazon.com/images/I/61gYqsRT3aL._AC_SL1200_.jpg'),
('cpu', 'Intel Core i7-13700K', 'Intel', 389.99, '{"socket": "LGA1700", "cores": 16, "threads": 24, "base_clock": "3.4 GHz", "boost_clock": "5.4 GHz", "tdp": 125}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BCF54SR1"}'::jsonb, 'https://m.media-amazon.com/images/I/61gYqsRT3aL._AC_SL1200_.jpg'),
('cpu', 'Intel Core i7-13700KF', 'Intel', 379.99, '{"socket": "LGA1700", "cores": 16, "threads": 24, "base_clock": "3.4 GHz", "boost_clock": "5.4 GHz", "tdp": 125}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BCHD5VHZ"}'::jsonb, 'https://m.media-amazon.com/images/I/61gYqsRT3aL._AC_SL1200_.jpg'),
('cpu', 'Intel Core i9-13900K', 'Intel', 549.99, '{"socket": "LGA1700", "cores": 24, "threads": 32, "base_clock": "3.0 GHz", "boost_clock": "5.8 GHz", "tdp": 125}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BCF57HL5"}'::jsonb, 'https://m.media-amazon.com/images/I/61gYqsRT3aL._AC_SL1200_.jpg'),
('cpu', 'Intel Core i9-13900KF', 'Intel', 539.99, '{"socket": "LGA1700", "cores": 24, "threads": 32, "base_clock": "3.0 GHz", "boost_clock": "5.8 GHz", "tdp": 125}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BCHD5M5Z"}'::jsonb, 'https://m.media-amazon.com/images/I/61gYqsRT3aL._AC_SL1200_.jpg'),

-- Intel 14th Gen
('cpu', 'Intel Core i5-14600K', 'Intel', 319.99, '{"socket": "LGA1700", "cores": 14, "threads": 20, "base_clock": "3.5 GHz", "boost_clock": "5.3 GHz", "tdp": 125}'::jsonb, '{"amazon": "https://amazon.com/dp/B0CHBR4DDN"}'::jsonb, 'https://m.media-amazon.com/images/I/61gYqsRT3aL._AC_SL1200_.jpg'),
('cpu', 'Intel Core i7-14700K', 'Intel', 419.99, '{"socket": "LGA1700", "cores": 20, "threads": 28, "base_clock": "3.4 GHz", "boost_clock": "5.6 GHz", "tdp": 125}'::jsonb, '{"amazon": "https://amazon.com/dp/B0CHBR2DBT"}'::jsonb, 'https://m.media-amazon.com/images/I/61gYqsRT3aL._AC_SL1200_.jpg'),
('cpu', 'Intel Core i9-14900K', 'Intel', 589.99, '{"socket": "LGA1700", "cores": 24, "threads": 32, "base_clock": "3.2 GHz", "boost_clock": "6.0 GHz", "tdp": 125}'::jsonb, '{"amazon": "https://amazon.com/dp/B0CHBRRJ8J"}'::jsonb, 'https://m.media-amazon.com/images/I/61gYqsRT3aL._AC_SL1200_.jpg'),

-- Budget AMD
('cpu', 'AMD Ryzen 5 5600', 'AMD', 129.99, '{"socket": "AM4", "cores": 6, "threads": 12, "base_clock": "3.5 GHz", "boost_clock": "4.4 GHz", "tdp": 65}'::jsonb, '{"amazon": "https://amazon.com/dp/B09VCHR1VH"}'::jsonb, 'https://m.media-amazon.com/images/I/61vGQNUEsGL._AC_SL1200_.jpg'),
('cpu', 'AMD Ryzen 7 5700X', 'AMD', 179.99, '{"socket": "AM4", "cores": 8, "threads": 16, "base_clock": "3.4 GHz", "boost_clock": "4.6 GHz", "tdp": 65}'::jsonb, '{"amazon": "https://amazon.com/dp/B09VCHQHZ6"}'::jsonb, 'https://m.media-amazon.com/images/I/61vGQNUEsGL._AC_SL1200_.jpg');

-- =====================================================
-- GPUs (25 components)
-- =====================================================
INSERT INTO components (type, name, brand, price, specs, vendor_links, image_url) VALUES
-- NVIDIA RTX 40 Series
('gpu', 'NVIDIA RTX 4060 8GB', 'NVIDIA', 299.99, '{"vram": "8GB GDDR6", "length": "244mm", "tdp": 115, "pcie": "4.0", "width": "2-slot"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0C85JB7SH"}'::jsonb, 'https://m.media-amazon.com/images/I/81SvGNKE9DL._AC_SL1500_.jpg'),
('gpu', 'NVIDIA RTX 4060 Ti 8GB', 'NVIDIA', 399.99, '{"vram": "8GB GDDR6", "length": "244mm", "tdp": 160, "pcie": "4.0", "width": "2-slot"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0C7LLRXQD"}'::jsonb, 'https://m.media-amazon.com/images/I/81SvGNKE9DL._AC_SL1500_.jpg'),
('gpu', 'NVIDIA RTX 4060 Ti 16GB', 'NVIDIA', 499.99, '{"vram": "16GB GDDR6", "length": "244mm", "tdp": 165, "pcie": "4.0", "width": "2-slot"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0C7LLRXQD"}'::jsonb, 'https://m.media-amazon.com/images/I/81SvGNKE9DL._AC_SL1500_.jpg'),
('gpu', 'NVIDIA RTX 4070 12GB', 'NVIDIA', 599.99, '{"vram": "12GB GDDR6X", "length": "304mm", "tdp": 200, "pcie": "4.0", "width": "2.5-slot"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0C85FZCV1"}'::jsonb, 'https://m.media-amazon.com/images/I/81SvGNKE9DL._AC_SL1500_.jpg'),
('gpu', 'NVIDIA RTX 4070 SUPER 12GB', 'NVIDIA', 649.99, '{"vram": "12GB GDDR6X", "length": "304mm", "tdp": 220, "pcie": "4.0", "width": "2.5-slot"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0CS2XNZ64"}'::jsonb, 'https://m.media-amazon.com/images/I/81SvGNKE9DL._AC_SL1500_.jpg'),
('gpu', 'NVIDIA RTX 4070 Ti 12GB', 'NVIDIA', 799.99, '{"vram": "12GB GDDR6X", "length": "304mm", "tdp": 285, "pcie": "4.0", "width": "2.5-slot"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BPWKZW16"}'::jsonb, 'https://m.media-amazon.com/images/I/81SvGNKE9DL._AC_SL1500_.jpg'),
('gpu', 'NVIDIA RTX 4070 Ti SUPER 16GB', 'NVIDIA', 849.99, '{"vram": "16GB GDDR6X", "length": "304mm", "tdp": 285, "pcie": "4.0", "width": "2.5-slot"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0CS2XNZ64"}'::jsonb, 'https://m.media-amazon.com/images/I/81SvGNKE9DL._AC_SL1500_.jpg'),
('gpu', 'NVIDIA RTX 4080 16GB', 'NVIDIA', 1199.99, '{"vram": "16GB GDDR6X", "length": "310mm", "tdp": 320, "pcie": "4.0", "width": "3-slot"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BN7PQK3K"}'::jsonb, 'https://m.media-amazon.com/images/I/81SvGNKE9DL._AC_SL1500_.jpg'),
('gpu', 'NVIDIA RTX 4080 SUPER 16GB', 'NVIDIA', 1099.99, '{"vram": "16GB GDDR6X", "length": "310mm", "tdp": 320, "pcie": "4.0", "width": "3-slot"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0CS2XNZ64"}'::jsonb, 'https://m.media-amazon.com/images/I/81SvGNKE9DL._AC_SL1500_.jpg'),
('gpu', 'NVIDIA RTX 4090 24GB', 'NVIDIA', 1599.99, '{"vram": "24GB GDDR6X", "length": "336mm", "tdp": 450, "pcie": "4.0", "width": "3.5-slot"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BG7QVPZ5"}'::jsonb, 'https://m.media-amazon.com/images/I/81SvGNKE9DL._AC_SL1500_.jpg'),

-- AMD RX 7000 Series
('gpu', 'AMD RX 7600 8GB', 'AMD', 269.99, '{"vram": "8GB GDDR6", "length": "204mm", "tdp": 165, "pcie": "4.0", "width": "2-slot"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0C4XD7WJN"}'::jsonb, 'https://m.media-amazon.com/images/I/71YyYHu+VZL._AC_SL1500_.jpg'),
('gpu', 'AMD RX 7600 XT 16GB', 'AMD', 329.99, '{"vram": "16GB GDDR6", "length": "267mm", "tdp": 190, "pcie": "4.0", "width": "2.5-slot"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0CS9HGZR6"}'::jsonb, 'https://m.media-amazon.com/images/I/71YyYHu+VZL._AC_SL1500_.jpg'),
('gpu', 'AMD RX 7700 XT 12GB', 'AMD', 449.99, '{"vram": "12GB GDDR6", "length": "267mm", "tdp": 245, "pcie": "4.0", "width": "2.5-slot"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0CGVB37VT"}'::jsonb, 'https://m.media-amazon.com/images/I/71YyYHu+VZL._AC_SL1500_.jpg'),
('gpu', 'AMD RX 7800 XT 16GB', 'AMD', 499.99, '{"vram": "16GB GDDR6", "length": "276mm", "tdp": 263, "pcie": "4.0", "width": "2.5-slot"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0CGVFWX4P"}'::jsonb, 'https://m.media-amazon.com/images/I/71YyYHu+VZL._AC_SL1500_.jpg'),
('gpu', 'AMD RX 7900 GRE 16GB', 'AMD', 549.99, '{"vram": "16GB GDDR6", "length": "276mm", "tdp": 260, "pcie": "4.0", "width": "2.5-slot"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0CXP54LXP"}'::jsonb, 'https://m.media-amazon.com/images/I/71YyYHu+VZL._AC_SL1500_.jpg'),
('gpu', 'AMD RX 7900 XT 20GB', 'AMD', 749.99, '{"vram": "20GB GDDR6", "length": "287mm", "tdp": 315, "pcie": "4.0", "width": "2.5-slot"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BQHDZ2JP"}'::jsonb, 'https://m.media-amazon.com/images/I/71YyYHu+VZL._AC_SL1500_.jpg'),
('gpu', 'AMD RX 7900 XTX 24GB', 'AMD', 899.99, '{"vram": "24GB GDDR6", "length": "287mm", "tdp": 355, "pcie": "4.0", "width": "2.5-slot"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BQHDSFPH"}'::jsonb, 'https://m.media-amazon.com/images/I/71YyYHu+VZL._AC_SL1500_.jpg'),

-- NVIDIA RTX 30 Series (Previous Gen)
('gpu', 'NVIDIA RTX 3050 8GB', 'NVIDIA', 249.99, '{"vram": "8GB GDDR6", "length": "232mm", "tdp": 130, "pcie": "4.0", "width": "2-slot"}'::jsonb, '{"amazon": "https://amazon.com/dp/B09RWL7K1T"}'::jsonb, 'https://m.media-amazon.com/images/I/81muLqKW1IL._AC_SL1500_.jpg'),
('gpu', 'NVIDIA RTX 3060 12GB', 'NVIDIA', 329.99, '{"vram": "12GB GDDR6", "length": "242mm", "tdp": 170, "pcie": "4.0", "width": "2-slot"}'::jsonb, '{"amazon": "https://amazon.com/dp/B08W8DGK3X"}'::jsonb, 'https://m.media-amazon.com/images/I/81muLqKW1IL._AC_SL1500_.jpg'),
('gpu', 'NVIDIA RTX 3060 Ti 8GB', 'NVIDIA', 399.99, '{"vram": "8GB GDDR6", "length": "242mm", "tdp": 200, "pcie": "4.0", "width": "2-slot"}'::jsonb, '{"amazon": "https://amazon.com/dp/B08WPRMVWB"}'::jsonb, 'https://m.media-amazon.com/images/I/81muLqKW1IL._AC_SL1500_.jpg'),
('gpu', 'NVIDIA RTX 3070 8GB', 'NVIDIA', 499.99, '{"vram": "8GB GDDR6", "length": "242mm", "tdp": 220, "pcie": "4.0", "width": "2-slot"}'::jsonb, '{"amazon": "https://amazon.com/dp/B08L8KC1J7"}'::jsonb, 'https://m.media-amazon.com/images/I/81muLqKW1IL._AC_SL1500_.jpg'),

-- AMD RX 6000 Series (Previous Gen)
('gpu', 'AMD RX 6600 8GB', 'AMD', 229.99, '{"vram": "8GB GDDR6", "length": "190mm", "tdp": 132, "pcie": "4.0", "width": "2-slot"}'::jsonb, '{"amazon": "https://amazon.com/dp/B098Q4M5J3"}'::jsonb, 'https://m.media-amazon.com/images/I/71qYGxp4TnL._AC_SL1500_.jpg'),
('gpu', 'AMD RX 6650 XT 8GB', 'AMD', 269.99, '{"vram": "8GB GDDR6", "length": "240mm", "tdp": 180, "pcie": "4.0", "width": "2-slot"}'::jsonb, '{"amazon": "https://amazon.com/dp/B09YQCGGW7"}'::jsonb, 'https://m.media-amazon.com/images/I/71qYGxp4TnL._AC_SL1500_.jpg'),
('gpu', 'AMD RX 6700 XT 12GB', 'AMD', 379.99, '{"vram": "12GB GDDR6", "length": "267mm", "tdp": 230, "pcie": "4.0", "width": "2.5-slot"}'::jsonb, '{"amazon": "https://amazon.com/dp/B08XWQ24J1"}'::jsonb, 'https://m.media-amazon.com/images/I/71qYGxp4TnL._AC_SL1500_.jpg');

-- =====================================================
-- Motherboards (15 components)
-- =====================================================
INSERT INTO components (type, name, brand, price, specs, vendor_links, image_url) VALUES
-- AMD AM5 Motherboards
('motherboard', 'ASRock B650M Pro RS', 'ASRock', 139.99, '{"socket": "AM5", "chipset": "B650", "ram_slots": 4, "max_ram": "128GB", "ram_type": "DDR5", "form_factor": "Micro-ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BG6M53DG"}'::jsonb, 'https://m.media-amazon.com/images/I/81vZMz7w7HL._AC_SL1500_.jpg'),
('motherboard', 'MSI B650 Gaming Plus WiFi', 'MSI', 179.99, '{"socket": "AM5", "chipset": "B650", "ram_slots": 4, "max_ram": "128GB", "ram_type": "DDR5", "form_factor": "ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BHWYVYSW"}'::jsonb, 'https://m.media-amazon.com/images/I/81jjvFc5xML._AC_SL1500_.jpg'),
('motherboard', 'ASUS ROG STRIX B650-A', 'ASUS', 229.99, '{"socket": "AM5", "chipset": "B650", "ram_slots": 4, "max_ram": "128GB", "ram_type": "DDR5", "form_factor": "ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BDK62QVY"}'::jsonb, 'https://m.media-amazon.com/images/I/81L8kWJ3IQL._AC_SL1500_.jpg'),
('motherboard', 'GIGABYTE B650 AORUS ELITE AX', 'GIGABYTE', 199.99, '{"socket": "AM5", "chipset": "B650", "ram_slots": 4, "max_ram": "128GB", "ram_type": "DDR5", "form_factor": "ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BH6XND27"}'::jsonb, 'https://m.media-amazon.com/images/I/81fD0sGkXzL._AC_SL1500_.jpg'),
('motherboard', 'MSI X670E Gaming Plus WiFi', 'MSI', 279.99, '{"socket": "AM5", "chipset": "X670E", "ram_slots": 4, "max_ram": "128GB", "ram_type": "DDR5", "form_factor": "ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BHWPR92Y"}'::jsonb, 'https://m.media-amazon.com/images/I/81jjvFc5xML._AC_SL1500_.jpg'),
('motherboard', 'ASUS ROG STRIX X670E-E', 'ASUS', 399.99, '{"socket": "AM5", "chipset": "X670E", "ram_slots": 4, "max_ram": "128GB", "ram_type": "DDR5", "form_factor": "ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BDTN8SNJ"}'::jsonb, 'https://m.media-amazon.com/images/I/81L8kWJ3IQL._AC_SL1500_.jpg'),

-- Intel LGA1700 Motherboards
('motherboard', 'ASRock B760M Pro RS', 'ASRock', 119.99, '{"socket": "LGA1700", "chipset": "B760", "ram_slots": 4, "max_ram": "128GB", "ram_type": "DDR5", "form_factor": "Micro-ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BR6CZS8B"}'::jsonb, 'https://m.media-amazon.com/images/I/81vZMz7w7HL._AC_SL1500_.jpg'),
('motherboard', 'MSI MAG B760 TOMAHAWK WiFi', 'MSI', 199.99, '{"socket": "LGA1700", "chipset": "B760", "ram_slots": 4, "max_ram": "128GB", "ram_type": "DDR5", "form_factor": "ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BQ4TH5VY"}'::jsonb, 'https://m.media-amazon.com/images/I/81jjvFc5xML._AC_SL1500_.jpg'),
('motherboard', 'ASUS TUF Gaming B760-PLUS WiFi', 'ASUS', 179.99, '{"socket": "LGA1700", "chipset": "B760", "ram_slots": 4, "max_ram": "128GB", "ram_type": "DDR5", "form_factor": "ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BQ9RYNMV"}'::jsonb, 'https://m.media-amazon.com/images/I/81L8kWJ3IQL._AC_SL1500_.jpg'),
('motherboard', 'GIGABYTE B760 Gaming X AX', 'GIGABYTE', 189.99, '{"socket": "LGA1700", "chipset": "B760", "ram_slots": 4, "max_ram": "128GB", "ram_type": "DDR5", "form_factor": "ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BQ6XPWCX"}'::jsonb, 'https://m.media-amazon.com/images/I/81fD0sGkXzL._AC_SL1500_.jpg'),
('motherboard', 'MSI MPG Z790 Edge WiFi', 'MSI', 299.99, '{"socket": "LGA1700", "chipset": "Z790", "ram_slots": 4, "max_ram": "128GB", "ram_type": "DDR5", "form_factor": "ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BG6M3GW9"}'::jsonb, 'https://m.media-amazon.com/images/I/81jjvFc5xML._AC_SL1500_.jpg'),
('motherboard', 'ASUS ROG MAXIMUS Z790 HERO', 'ASUS', 599.99, '{"socket": "LGA1700", "chipset": "Z790", "ram_slots": 4, "max_ram": "128GB", "ram_type": "DDR5", "form_factor": "ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BG6HK16F"}'::jsonb, 'https://m.media-amazon.com/images/I/81L8kWJ3IQL._AC_SL1500_.jpg'),

-- Budget AM4
('motherboard', 'MSI B550M PRO-VDH WiFi', 'MSI', 109.99, '{"socket": "AM4", "chipset": "B550", "ram_slots": 4, "max_ram": "128GB", "ram_type": "DDR4", "form_factor": "Micro-ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B089CZSQB4"}'::jsonb, 'https://m.media-amazon.com/images/I/81jjvFc5xML._AC_SL1500_.jpg'),
('motherboard', 'ASUS TUF Gaming B550-PLUS', 'ASUS', 149.99, '{"socket": "AM4", "chipset": "B550", "ram_slots": 4, "max_ram": "128GB", "ram_type": "DDR4", "form_factor": "ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B088W5WD97"}'::jsonb, 'https://m.media-amazon.com/images/I/81L8kWJ3IQL._AC_SL1500_.jpg'),
('motherboard', 'GIGABYTE B550 AORUS ELITE V2', 'GIGABYTE', 159.99, '{"socket": "AM4", "chipset": "B550", "ram_slots": 4, "max_ram": "128GB", "ram_type": "DDR4", "form_factor": "ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B09NBQMJCB"}'::jsonb, 'https://m.media-amazon.com/images/I/81fD0sGkXzL._AC_SL1500_.jpg');

-- =====================================================
-- RAM (12 components)
-- =====================================================
INSERT INTO components (type, name, brand, price, specs, vendor_links, image_url) VALUES
-- DDR5 32GB Kits
('ram', 'Corsair Vengeance DDR5 32GB (2x16GB) 5600MHz', 'Corsair', 99.99, '{"type": "DDR5", "speed": "5600MHz", "capacity": "32GB", "kit": "2x16GB", "cas_latency": "CL36"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0B8R8S1PL"}'::jsonb, 'https://m.media-amazon.com/images/I/61kz-KkJBWL._AC_SL1500_.jpg'),
('ram', 'Corsair Vengeance DDR5 32GB (2x16GB) 6000MHz', 'Corsair', 119.99, '{"type": "DDR5", "speed": "6000MHz", "capacity": "32GB", "kit": "2x16GB", "cas_latency": "CL30"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0B8R8S1PL"}'::jsonb, 'https://m.media-amazon.com/images/I/61kz-KkJBWL._AC_SL1500_.jpg'),
('ram', 'G.Skill Trident Z5 RGB 32GB (2x16GB) 6400MHz', 'G.Skill', 139.99, '{"type": "DDR5", "speed": "6400MHz", "capacity": "32GB", "kit": "2x16GB", "cas_latency": "CL32"}'::jsonb, '{"amazon": "https://amazon.com/dp/B09QVTJZ4N"}'::jsonb, 'https://m.media-amazon.com/images/I/71gC0UjQLKL._AC_SL1500_.jpg'),
('ram', 'Kingston FURY Beast DDR5 32GB (2x16GB) 6000MHz', 'Kingston', 109.99, '{"type": "DDR5", "speed": "6000MHz", "capacity": "32GB", "kit": "2x16GB", "cas_latency": "CL30"}'::jsonb, '{"amazon": "https://amazon.com/dp/B09SNWVRC7"}'::jsonb, 'https://m.media-amazon.com/images/I/61H3DqhL7bL._AC_SL1500_.jpg'),

-- DDR5 16GB Kits
('ram', 'Corsair Vengeance DDR5 16GB (2x8GB) 5600MHz', 'Corsair', 69.99, '{"type": "DDR5", "speed": "5600MHz", "capacity": "16GB", "kit": "2x8GB", "cas_latency": "CL28"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0B8R8S1PL"}'::jsonb, 'https://m.media-amazon.com/images/I/61kz-KkJBWL._AC_SL1500_.jpg'),
('ram', 'G.Skill Ripjaws S5 16GB (2x8GB) 6000MHz', 'G.Skill', 74.99, '{"type": "DDR5", "speed": "6000MHz", "capacity": "16GB", "kit": "2x8GB", "cas_latency": "CL30"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0B8R5RGSZ"}'::jsonb, 'https://m.media-amazon.com/images/I/71gC0UjQLKL._AC_SL1500_.jpg'),

-- DDR4 32GB Kits
('ram', 'Corsair Vengeance LPX DDR4 32GB (2x16GB) 3600MHz', 'Corsair', 79.99, '{"type": "DDR4", "speed": "3600MHz", "capacity": "32GB", "kit": "2x16GB", "cas_latency": "CL18"}'::jsonb, '{"amazon": "https://amazon.com/dp/B07RM39V5F"}'::jsonb, 'https://m.media-amazon.com/images/I/51Y5-SBFmwL._AC_SL1000_.jpg'),
('ram', 'G.Skill Ripjaws V DDR4 32GB (2x16GB) 3600MHz', 'G.Skill', 74.99, '{"type": "DDR4", "speed": "3600MHz", "capacity": "32GB", "kit": "2x16GB", "cas_latency": "CL16"}'::jsonb, '{"amazon": "https://amazon.com/dp/B07X8DVDZZ"}'::jsonb, 'https://m.media-amazon.com/images/I/61R1L2CZb4L._AC_SL1000_.jpg'),
('ram', 'Kingston FURY Beast DDR4 32GB (2x16GB) 3200MHz', 'Kingston', 64.99, '{"type": "DDR4", "speed": "3200MHz", "capacity": "32GB", "kit": "2x16GB", "cas_latency": "CL16"}'::jsonb, '{"amazon": "https://amazon.com/dp/B097K2GX6R"}'::jsonb, 'https://m.media-amazon.com/images/I/61S9w+-HLVL._AC_SL1500_.jpg'),

-- DDR4 16GB Kits
('ram', 'Corsair Vengeance LPX DDR4 16GB (2x8GB) 3200MHz', 'Corsair', 39.99, '{"type": "DDR4", "speed": "3200MHz", "capacity": "16GB", "kit": "2x8GB", "cas_latency": "CL16"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0143UM4TC"}'::jsonb, 'https://m.media-amazon.com/images/I/51Y5-SBFmwL._AC_SL1000_.jpg'),
('ram', 'G.Skill Ripjaws V DDR4 16GB (2x8GB) 3600MHz', 'G.Skill', 44.99, '{"type": "DDR4", "speed": "3600MHz", "capacity": "16GB", "kit": "2x8GB", "cas_latency": "CL16"}'::jsonb, '{"amazon": "https://amazon.com/dp/B07X8DVDZZ"}'::jsonb, 'https://m.media-amazon.com/images/I/61R1L2CZb4L._AC_SL1000_.jpg'),
('ram', 'Crucial Ballistix DDR4 16GB (2x8GB) 3200MHz', 'Crucial', 42.99, '{"type": "DDR4", "speed": "3200MHz", "capacity": "16GB", "kit": "2x8GB", "cas_latency": "CL16"}'::jsonb, '{"amazon": "https://amazon.com/dp/B083TRXZ98"}'::jsonb, 'https://m.media-amazon.com/images/I/71QXedkKNqL._AC_SL1500_.jpg');

-- =====================================================
-- Storage (15 components)
-- =====================================================
INSERT INTO components (type, name, brand, price, specs, vendor_links, image_url) VALUES
-- NVMe SSDs - 2TB
('storage', 'Samsung 990 Pro 2TB NVMe', 'Samsung', 179.99, '{"type": "NVMe SSD", "capacity": "2TB", "interface": "PCIe 4.0", "read_speed": "7450 MB/s", "write_speed": "6900 MB/s"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BHJJ9Y77"}'::jsonb, 'https://m.media-amazon.com/images/I/71qQKWlLkVL._AC_SL1500_.jpg'),
('storage', 'WD Black SN850X 2TB NVMe', 'Western Digital', 149.99, '{"type": "NVMe SSD", "capacity": "2TB", "interface": "PCIe 4.0", "read_speed": "7300 MB/s", "write_speed": "6600 MB/s"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0B7CQ2CHH"}'::jsonb, 'https://m.media-amazon.com/images/I/71lSgwpT6qL._AC_SL1500_.jpg'),
('storage', 'Crucial P5 Plus 2TB NVMe', 'Crucial', 129.99, '{"type": "NVMe SSD", "capacity": "2TB", "interface": "PCIe 4.0", "read_speed": "6600 MB/s", "write_speed": "5000 MB/s"}'::jsonb, '{"amazon": "https://amazon.com/dp/B098WLBR29"}'::jsonb, 'https://m.media-amazon.com/images/I/71qdW4dVyxL._AC_SL1500_.jpg'),
('storage', 'Kingston KC3000 2TB NVMe', 'Kingston', 139.99, '{"type": "NVMe SSD", "capacity": "2TB", "interface": "PCIe 4.0", "read_speed": "7000 MB/s", "write_speed": "7000 MB/s"}'::jsonb, '{"amazon": "https://amazon.com/dp/B09T34WT1H"}'::jsonb, 'https://m.media-amazon.com/images/I/612PeX7wZkL._AC_SL1000_.jpg'),

-- NVMe SSDs - 1TB
('storage', 'Samsung 980 Pro 1TB NVMe', 'Samsung', 89.99, '{"type": "NVMe SSD", "capacity": "1TB", "interface": "PCIe 4.0", "read_speed": "7000 MB/s", "write_speed": "5000 MB/s"}'::jsonb, '{"amazon": "https://amazon.com/dp/B08GLX7TNT"}'::jsonb, 'https://m.media-amazon.com/images/I/71qQKWlLkVL._AC_SL1500_.jpg'),
('storage', 'WD Black SN770 1TB NVMe', 'Western Digital', 79.99, '{"type": "NVMe SSD", "capacity": "1TB", "interface": "PCIe 4.0", "read_speed": "5150 MB/s", "write_speed": "4900 MB/s"}'::jsonb, '{"amazon": "https://amazon.com/dp/B09QVD9V7R"}'::jsonb, 'https://m.media-amazon.com/images/I/71lSgwpT6qL._AC_SL1500_.jpg'),
('storage', 'Crucial P3 Plus 1TB NVMe', 'Crucial', 69.99, '{"type": "NVMe SSD", "capacity": "1TB", "interface": "PCIe 4.0", "read_speed": "5000 MB/s", "write_speed": "3600 MB/s"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0B25LZGGW"}'::jsonb, 'https://m.media-amazon.com/images/I/71qdW4dVyxL._AC_SL1500_.jpg'),
('storage', 'Kingston NV2 1TB NVMe', 'Kingston', 54.99, '{"type": "NVMe SSD", "capacity": "1TB", "interface": "PCIe 4.0", "read_speed": "3500 MB/s", "write_speed": "2100 MB/s"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BBWH1R35"}'::jsonb, 'https://m.media-amazon.com/images/I/612PeX7wZkL._AC_SL1000_.jpg'),

-- NVMe SSDs - 500GB
('storage', 'Samsung 970 EVO Plus 500GB', 'Samsung', 49.99, '{"type": "NVMe SSD", "capacity": "500GB", "interface": "PCIe 3.0", "read_speed": "3500 MB/s", "write_speed": "3200 MB/s"}'::jsonb, '{"amazon": "https://amazon.com/dp/B07MG119KG"}'::jsonb, 'https://m.media-amazon.com/images/I/71qQKWlLkVL._AC_SL1500_.jpg'),
('storage', 'WD Blue SN570 500GB', 'Western Digital', 39.99, '{"type": "NVMe SSD", "capacity": "500GB", "interface": "PCIe 3.0", "read_speed": "3500 MB/s", "write_speed": "2300 MB/s"}'::jsonb, '{"amazon": "https://amazon.com/dp/B09HKG6SDF"}'::jsonb, 'https://m.media-amazon.com/images/I/71lSgwpT6qL._AC_SL1500_.jpg'),
('storage', 'Crucial P3 500GB NVMe', 'Crucial', 34.99, '{"type": "NVMe SSD", "capacity": "500GB", "interface": "PCIe 3.0", "read_speed": "3500 MB/s", "write_speed": "3000 MB/s"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0B25ML2FH"}'::jsonb, 'https://m.media-amazon.com/images/I/71qdW4dVyxL._AC_SL1500_.jpg'),

-- HDD
('storage', 'Seagate BarraCuda 2TB HDD', 'Seagate', 54.99, '{"type": "HDD", "capacity": "2TB", "interface": "SATA", "rpm": "7200 RPM", "cache": "256MB"}'::jsonb, '{"amazon": "https://amazon.com/dp/B07H2RR55Q"}'::jsonb, 'https://m.media-amazon.com/images/I/71ItMeqpN3L._AC_SL1500_.jpg'),
('storage', 'WD Blue 1TB HDD', 'Western Digital', 39.99, '{"type": "HDD", "capacity": "1TB", "interface": "SATA", "rpm": "7200 RPM", "cache": "64MB"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0088PUEPK"}'::jsonb, 'https://m.media-amazon.com/images/I/71rRBbIu6cL._AC_SL1500_.jpg'),
('storage', 'Seagate BarraCuda 4TB HDD', 'Seagate', 84.99, '{"type": "HDD", "capacity": "4TB", "interface": "SATA", "rpm": "5400 RPM", "cache": "256MB"}'::jsonb, '{"amazon": "https://amazon.com/dp/B07H289S79"}'::jsonb, 'https://m.media-amazon.com/images/I/71ItMeqpN3L._AC_SL1500_.jpg'),
('storage', 'Toshiba X300 4TB HDD', 'Toshiba', 99.99, '{"type": "HDD", "capacity": "4TB", "interface": "SATA", "rpm": "7200 RPM", "cache": "256MB"}'::jsonb, '{"amazon": "https://amazon.com/dp/B07G3YNLJB"}'::jsonb, 'https://m.media-amazon.com/images/I/71ZvBxvq0dL._AC_SL1500_.jpg');

-- =====================================================
-- PSUs (12 components)
-- =====================================================
INSERT INTO components (type, name, brand, price, specs, vendor_links, image_url) VALUES
-- 850W+
('psu', 'Corsair RM1000e 1000W 80+ Gold', 'Corsair', 169.99, '{"wattage": 1000, "efficiency": "80+ Gold", "modular": "Fully Modular", "form_factor": "ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0C4488TYZ"}'::jsonb, 'https://m.media-amazon.com/images/I/71ek8OqOECL._AC_SL1500_.jpg'),
('psu', 'EVGA SuperNOVA 850 GT 850W 80+ Gold', 'EVGA', 129.99, '{"wattage": 850, "efficiency": "80+ Gold", "modular": "Fully Modular", "form_factor": "ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B088SSN91V"}'::jsonb, 'https://m.media-amazon.com/images/I/71EEq+FdQwL._AC_SL1500_.jpg'),
('psu', 'Corsair RM850e 850W 80+ Gold', 'Corsair', 119.99, '{"wattage": 850, "efficiency": "80+ Gold", "modular": "Fully Modular", "form_factor": "ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0C4488TYZ"}'::jsonb, 'https://m.media-amazon.com/images/I/71ek8OqOECL._AC_SL1500_.jpg'),
('psu', 'Thermaltake Toughpower GF1 850W 80+ Gold', 'Thermaltake', 114.99, '{"wattage": 850, "efficiency": "80+ Gold", "modular": "Fully Modular", "form_factor": "ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B08JGSL7Y3"}'::jsonb, 'https://m.media-amazon.com/images/I/71wrjxlYiZL._AC_SL1500_.jpg'),

-- 750W
('psu', 'Corsair RM750e 750W 80+ Gold', 'Corsair', 99.99, '{"wattage": 750, "efficiency": "80+ Gold", "modular": "Fully Modular", "form_factor": "ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0C4488TYZ"}'::jsonb, 'https://m.media-amazon.com/images/I/71ek8OqOECL._AC_SL1500_.jpg'),
('psu', 'MSI MAG A750GL 750W 80+ Gold', 'MSI', 89.99, '{"wattage": 750, "efficiency": "80+ Gold", "modular": "Fully Modular", "form_factor": "ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B09ZJLG68R"}'::jsonb, 'https://m.media-amazon.com/images/I/71d7n+XklOL._AC_SL1500_.jpg'),
('psu', 'EVGA SuperNOVA 750 GT 750W 80+ Gold', 'EVGA', 94.99, '{"wattage": 750, "efficiency": "80+ Gold", "modular": "Fully Modular", "form_factor": "ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B08831WWVG"}'::jsonb, 'https://m.media-amazon.com/images/I/71EEq+FdQwL._AC_SL1500_.jpg'),

-- 650W
('psu', 'Corsair CX650M 650W 80+ Bronze', 'Corsair', 69.99, '{"wattage": 650, "efficiency": "80+ Bronze", "modular": "Semi-Modular", "form_factor": "ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B01B72W0A2"}'::jsonb, 'https://m.media-amazon.com/images/I/71ek8OqOECL._AC_SL1500_.jpg'),
('psu', 'EVGA 650 BQ 650W 80+ Bronze', 'EVGA', 59.99, '{"wattage": 650, "efficiency": "80+ Bronze", "modular": "Semi-Modular", "form_factor": "ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B01MTJTO2O"}'::jsonb, 'https://m.media-amazon.com/images/I/71EEq+FdQwL._AC_SL1500_.jpg'),
('psu', 'Thermaltake Smart 650W 80+ Bronze', 'Thermaltake', 54.99, '{"wattage": 650, "efficiency": "80+ Bronze", "modular": "Non-Modular", "form_factor": "ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B01N9X3F8F"}'::jsonb, 'https://m.media-amazon.com/images/I/71wrjxlYiZL._AC_SL1500_.jpg'),

-- 550W
('psu', 'Corsair CX550M 550W 80+ Bronze', 'Corsair', 59.99, '{"wattage": 550, "efficiency": "80+ Bronze", "modular": "Semi-Modular", "form_factor": "ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B01B72VXE6"}'::jsonb, 'https://m.media-amazon.com/images/I/71ek8OqOECL._AC_SL1500_.jpg'),
('psu', 'EVGA 550 N1 550W', 'EVGA', 39.99, '{"wattage": 550, "efficiency": "Standard", "modular": "Non-Modular", "form_factor": "ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B01HQLYIH6"}'::jsonb, 'https://m.media-amazon.com/images/I/71EEq+FdQwL._AC_SL1500_.jpg');

-- =====================================================
-- Cases (10 components)
-- =====================================================
INSERT INTO components (type, name, brand, price, specs, vendor_links, image_url) VALUES
('case', 'NZXT H510 Flow Mid Tower', 'NZXT', 89.99, '{"form_factor": "Mid Tower ATX", "max_gpu_length": "381mm", "color": "Black", "side_panel": "Tempered Glass"}'::jsonb, '{"amazon": "https://amazon.com/dp/B09LGW91C8"}'::jsonb, 'https://m.media-amazon.com/images/I/71pJd8o-H8L._AC_SL1500_.jpg'),
('case', 'Corsair 4000D Airflow', 'Corsair', 94.99, '{"form_factor": "Mid Tower ATX", "max_gpu_length": "360mm", "color": "Black", "side_panel": "Tempered Glass"}'::jsonb, '{"amazon": "https://amazon.com/dp/B08C7BGV3D"}'::jsonb, 'https://m.media-amazon.com/images/I/71j5H8xVEEL._AC_SL1500_.jpg'),
('case', 'Fractal Design Meshify C', 'Fractal Design', 109.99, '{"form_factor": "Mid Tower ATX", "max_gpu_length": "315mm", "color": "Black", "side_panel": "Tempered Glass"}'::jsonb, '{"amazon": "https://amazon.com/dp/B074PGBGHW"}'::jsonb, 'https://m.media-amazon.com/images/I/71HY6KvbqCL._AC_SL1500_.jpg'),
('case', 'Lian Li LANCOOL 216', 'Lian Li', 119.99, '{"form_factor": "Mid Tower ATX", "max_gpu_length": "384mm", "color": "Black", "side_panel": "Tempered Glass"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BQWF35WP"}'::jsonb, 'https://m.media-amazon.com/images/I/71pP2tLfr0L._AC_SL1500_.jpg'),
('case', 'be quiet! Pure Base 500DX', 'be quiet!', 109.99, '{"form_factor": "Mid Tower ATX", "max_gpu_length": "369mm", "color": "Black", "side_panel": "Tempered Glass"}'::jsonb, '{"amazon": "https://amazon.com/dp/B08C7BGV3D"}'::jsonb, 'https://m.media-amazon.com/images/I/71kfE8vHGPL._AC_SL1500_.jpg'),
('case', 'Phanteks Eclipse P400A', 'Phanteks', 89.99, '{"form_factor": "Mid Tower ATX", "max_gpu_length": "420mm", "color": "Black", "side_panel": "Tempered Glass"}'::jsonb, '{"amazon": "https://amazon.com/dp/B07TTDW9KV"}'::jsonb, 'https://m.media-amazon.com/images/I/71JvJjyTQFL._AC_SL1500_.jpg'),
('case', 'Cooler Master H500', 'Cooler Master', 99.99, '{"form_factor": "Mid Tower ATX", "max_gpu_length": "410mm", "color": "Black", "side_panel": "Tempered Glass"}'::jsonb, '{"amazon": "https://amazon.com/dp/B07D5813PC"}'::jsonb, 'https://m.media-amazon.com/images/I/71ZYTT3tgDL._AC_SL1500_.jpg'),
('case', 'NZXT H7 Flow', 'NZXT', 129.99, '{"form_factor": "Mid Tower ATX", "max_gpu_length": "400mm", "color": "White", "side_panel": "Tempered Glass"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BN5ZJCJY"}'::jsonb, 'https://m.media-amazon.com/images/I/71pJd8o-H8L._AC_SL1500_.jpg'),
('case', 'Corsair 5000D Airflow', 'Corsair', 149.99, '{"form_factor": "Mid Tower ATX", "max_gpu_length": "420mm", "color": "Black", "side_panel": "Tempered Glass"}'::jsonb, '{"amazon": "https://amazon.com/dp/B08Q755CQW"}'::jsonb, 'https://m.media-amazon.com/images/I/71j5H8xVEEL._AC_SL1500_.jpg'),
('case', 'Lian Li O11 Dynamic EVO', 'Lian Li', 159.99, '{"form_factor": "Mid Tower ATX", "max_gpu_length": "420mm", "color": "Black", "side_panel": "Tempered Glass"}'::jsonb, '{"amazon": "https://amazon.com/dp/B09XHQGV88"}'::jsonb, 'https://m.media-amazon.com/images/I/71pP2tLfr0L._AC_SL1500_.jpg');

-- =====================================================
-- Coolers (10 components)
-- =====================================================
INSERT INTO components (type, name, brand, price, specs, vendor_links, image_url) VALUES
-- Air Coolers
('cooler', 'Noctua NH-D15', 'Noctua', 109.99, '{"type": "Air Cooler", "height": "165mm", "tdp_rating": 220, "socket_support": ["AM5", "LGA1700", "AM4"]}'::jsonb, '{"amazon": "https://amazon.com/dp/B00L7UZMAK"}'::jsonb, 'https://m.media-amazon.com/images/I/71GHMGbqIzL._AC_SL1500_.jpg'),
('cooler', 'be quiet! Dark Rock Pro 4', 'be quiet!', 89.99, '{"type": "Air Cooler", "height": "163mm", "tdp_rating": 250, "socket_support": ["AM5", "LGA1700", "AM4"]}'::jsonb, '{"amazon": "https://amazon.com/dp/B07BY6F8D9"}'::jsonb, 'https://m.media-amazon.com/images/I/71npHuNBR4L._AC_SL1500_.jpg'),
('cooler', 'be quiet! Dark Rock 4', 'be quiet!', 74.99, '{"type": "Air Cooler", "height": "159mm", "tdp_rating": 200, "socket_support": ["AM5", "LGA1700", "AM4"]}'::jsonb, '{"amazon": "https://amazon.com/dp/B07BYP9S95"}'::jsonb, 'https://m.media-amazon.com/images/I/71npHuNBR4L._AC_SL1500_.jpg'),
('cooler', 'Noctua NH-U12S', 'Noctua', 69.99, '{"type": "Air Cooler", "height": "158mm", "tdp_rating": 180, "socket_support": ["AM5", "LGA1700", "AM4"]}'::jsonb, '{"amazon": "https://amazon.com/dp/B00C9FLSLY"}'::jsonb, 'https://m.media-amazon.com/images/I/71GHMGbqIzL._AC_SL1500_.jpg'),
('cooler', 'Cooler Master Hyper 212 EVO', 'Cooler Master', 39.99, '{"type": "Air Cooler", "height": "159mm", "tdp_rating": 150, "socket_support": ["AM5", "LGA1700", "AM4"]}'::jsonb, '{"amazon": "https://amazon.com/dp/B005O65JXI"}'::jsonb, 'https://m.media-amazon.com/images/I/71PiMDZDJmL._AC_SL1500_.jpg'),

-- AIO Liquid Coolers
('cooler', 'Arctic Liquid Freezer II 360', 'Arctic', 119.99, '{"type": "AIO Liquid Cooler", "radiator_size": "360mm", "tdp_rating": 300, "socket_support": ["AM5", "LGA1700", "AM4"]}'::jsonb, '{"amazon": "https://amazon.com/dp/B07WNJCVNW"}'::jsonb, 'https://m.media-amazon.com/images/I/71E+y8XUHBL._AC_SL1500_.jpg'),
('cooler', 'Arctic Liquid Freezer II 280', 'Arctic', 89.99, '{"type": "AIO Liquid Cooler", "radiator_size": "280mm", "tdp_rating": 250, "socket_support": ["AM5", "LGA1700", "AM4"]}'::jsonb, '{"amazon": "https://amazon.com/dp/B07WNJCVNW"}'::jsonb, 'https://m.media-amazon.com/images/I/71E+y8XUHBL._AC_SL1500_.jpg'),
('cooler', 'Corsair iCUE H150i Elite LCD', 'Corsair', 279.99, '{"type": "AIO Liquid Cooler", "radiator_size": "360mm", "tdp_rating": 300, "socket_support": ["AM5", "LGA1700", "AM4"]}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BTFCFJ1K"}'::jsonb, 'https://m.media-amazon.com/images/I/71hB4H8JqVL._AC_SL1500_.jpg'),
('cooler', 'NZXT Kraken 360 RGB', 'NZXT', 189.99, '{"type": "AIO Liquid Cooler", "radiator_size": "360mm", "tdp_rating": 280, "socket_support": ["AM5", "LGA1700", "AM4"]}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BQLTQYXK"}'::jsonb, 'https://m.media-amazon.com/images/I/71g8WjI+y0L._AC_SL1500_.jpg'),
('cooler', 'Lian Li Galahad II Trinity 240', 'Lian Li', 99.99, '{"type": "AIO Liquid Cooler", "radiator_size": "240mm", "tdp_rating": 220, "socket_support": ["AM5", "LGA1700", "AM4"]}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BQQVPM4N"}'::jsonb, 'https://m.media-amazon.com/images/I/71OUJ2LHYZL._AC_SL1500_.jpg');

-- =====================================================
-- Budget Expansion Inventory (112 components)
-- =====================================================

-- =====================================================
-- Budget CPUs (14 components)
-- =====================================================
INSERT INTO components (type, name, brand, price, specs, vendor_links, image_url) VALUES
('cpu', 'AMD Athlon 3000G', 'AMD', 49.99, '{"socket": "AM4", "cores": 2, "threads": 4, "base_clock": "3.5 GHz", "boost_clock": "3.5 GHz", "tdp": 35}'::jsonb, '{"amazon": "https://amazon.com/dp/B07YWQ6JR7"}'::jsonb, 'https://m.media-amazon.com/images/I/61m0TimZPQL._AC_SL1000_.jpg'),
('cpu', 'AMD Ryzen 3 4100', 'AMD', 79.99, '{"socket": "AM4", "cores": 4, "threads": 8, "base_clock": "3.8 GHz", "boost_clock": "4.0 GHz", "tdp": 65}'::jsonb, '{"amazon": "https://amazon.com/dp/B09R4YVYJ6"}'::jsonb, 'https://m.media-amazon.com/images/I/51uHhBwKsJL._AC_SL1000_.jpg'),
('cpu', 'AMD Ryzen 3 5300G', 'AMD', 109.99, '{"socket": "AM4", "cores": 4, "threads": 8, "base_clock": "4.0 GHz", "boost_clock": "4.2 GHz", "tdp": 65}'::jsonb, '{"amazon": "https://amazon.com/dp/B097B61XFC"}'::jsonb, 'https://m.media-amazon.com/images/I/51M1O7IEHqL._AC_SL1000_.jpg'),
('cpu', 'AMD Ryzen 5 4500', 'AMD', 89.99, '{"socket": "AM4", "cores": 6, "threads": 12, "base_clock": "3.6 GHz", "boost_clock": "4.1 GHz", "tdp": 65}'::jsonb, '{"amazon": "https://amazon.com/dp/B09VCHHVS6"}'::jsonb, 'https://m.media-amazon.com/images/I/5143isO0CNL._AC_SL1000_.jpg'),
('cpu', 'AMD Ryzen 5 5500', 'AMD', 109.99, '{"socket": "AM4", "cores": 6, "threads": 12, "base_clock": "3.6 GHz", "boost_clock": "4.2 GHz", "tdp": 65}'::jsonb, '{"amazon": "https://amazon.com/dp/B09VCM41RB"}'::jsonb, 'https://m.media-amazon.com/images/I/51dV0u28fuL._AC_SL1000_.jpg'),
('cpu', 'AMD Ryzen 5 5600G', 'AMD', 139.99, '{"socket": "AM4", "cores": 6, "threads": 12, "base_clock": "3.9 GHz", "boost_clock": "4.4 GHz", "tdp": 65}'::jsonb, '{"amazon": "https://amazon.com/dp/B091JSNFPZ"}'::jsonb, 'https://m.media-amazon.com/images/I/51xsnRef+OL._AC_SL1000_.jpg'),
('cpu', 'Intel Pentium Gold G6400', 'Intel', 59.99, '{"socket": "LGA1200", "cores": 2, "threads": 4, "base_clock": "4.0 GHz", "boost_clock": "4.0 GHz", "tdp": 58}'::jsonb, '{"amazon": "https://amazon.com/dp/B086MHSH2H"}'::jsonb, 'https://m.media-amazon.com/images/I/51QWUGCjA8L._AC_SL1000_.jpg'),
('cpu', 'Intel Core i3-10100F', 'Intel', 74.99, '{"socket": "LGA1200", "cores": 4, "threads": 8, "base_clock": "3.6 GHz", "boost_clock": "4.3 GHz", "tdp": 65}'::jsonb, '{"amazon": "https://amazon.com/dp/B086MHSH2V"}'::jsonb, 'https://m.media-amazon.com/images/I/5109-by+g8L._AC_SL1000_.jpg'),
('cpu', 'Intel Core i3-12100F', 'Intel', 99.99, '{"socket": "LGA1700", "cores": 4, "threads": 8, "base_clock": "3.3 GHz", "boost_clock": "4.3 GHz", "tdp": 60}'::jsonb, '{"amazon": "https://amazon.com/dp/B09NQNGF5N"}'::jsonb, 'https://m.media-amazon.com/images/I/611loGyZ-TL._AC_SL1200_.jpg'),
('cpu', 'Intel Core i3-13100F', 'Intel', 119.99, '{"socket": "LGA1700", "cores": 4, "threads": 8, "base_clock": "3.4 GHz", "boost_clock": "4.5 GHz", "tdp": 60}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BSHJJQQ1"}'::jsonb, 'https://m.media-amazon.com/images/I/61MWHF1AE1L._AC_SL1200_.jpg'),
('cpu', 'Intel Core i5-10400F', 'Intel', 129.99, '{"socket": "LGA1200", "cores": 6, "threads": 12, "base_clock": "2.9 GHz", "boost_clock": "4.3 GHz", "tdp": 65}'::jsonb, '{"amazon": "https://amazon.com/dp/B086MHYQJJ"}'::jsonb, 'https://m.media-amazon.com/images/I/51kfttD-i9L._AC_SL1000_.jpg'),
('cpu', 'Intel Core i5-11400F', 'Intel', 139.99, '{"socket": "LGA1200", "cores": 6, "threads": 12, "base_clock": "2.6 GHz", "boost_clock": "4.4 GHz", "tdp": 65}'::jsonb, '{"amazon": "https://amazon.com/dp/B08X6PPTTH"}'::jsonb, 'https://m.media-amazon.com/images/I/515OSFtik8L._AC_SL1000_.jpg'),
('cpu', 'Intel Core i5-12400F', 'Intel', 159.99, '{"socket": "LGA1700", "cores": 6, "threads": 12, "base_clock": "2.5 GHz", "boost_clock": "4.4 GHz", "tdp": 65}'::jsonb, '{"amazon": "https://amazon.com/dp/B09NQYY1JT"}'::jsonb, 'https://m.media-amazon.com/images/I/61zMXQ7r5kL._AC_SL1200_.jpg'),
('cpu', 'Intel Core i5-13400F', 'Intel', 189.99, '{"socket": "LGA1700", "cores": 10, "threads": 16, "base_clock": "2.5 GHz", "boost_clock": "4.6 GHz", "tdp": 65}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BN5Z6LJ7"}'::jsonb, 'https://m.media-amazon.com/images/I/61gYqsRT3aL._AC_SL1200_.jpg');

-- =====================================================
-- Budget GPUs (14 components)
-- =====================================================
INSERT INTO components (type, name, brand, price, specs, vendor_links, image_url) VALUES
('gpu', 'NVIDIA GTX 1050 Ti 4GB', 'NVIDIA', 159.99, '{"vram": "4GB GDDR5", "length": "229mm", "tdp": 75, "pcie": "3.0", "width": "2-slot"}'::jsonb, '{"amazon": "https://amazon.com/dp/B01MG0733A"}'::jsonb, 'https://m.media-amazon.com/images/I/81BGwENKneL._AC_SL1500_.jpg'),
('gpu', 'NVIDIA GTX 1630 4GB', 'NVIDIA', 149.99, '{"vram": "4GB GDDR6", "length": "170mm", "tdp": 75, "pcie": "3.0", "width": "2-slot"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0B59FD8M5"}'::jsonb, 'https://m.media-amazon.com/images/I/715eDT6vKcL._AC_SL1500_.jpg'),
('gpu', 'NVIDIA GTX 1650 4GB GDDR6', 'NVIDIA', 179.99, '{"vram": "4GB GDDR6", "length": "229mm", "tdp": 75, "pcie": "3.0", "width": "2-slot"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0876Y8SL3"}'::jsonb, 'https://m.media-amazon.com/images/I/81muLqKW1IL._AC_SL1500_.jpg'),
('gpu', 'NVIDIA GTX 1660 6GB', 'NVIDIA', 209.99, '{"vram": "6GB GDDR5", "length": "229mm", "tdp": 120, "pcie": "3.0", "width": "2-slot"}'::jsonb, '{"amazon": "https://amazon.com/dp/B07P76G428"}'::jsonb, 'https://m.media-amazon.com/images/I/81mMWJAIpoL._AC_SL1500_.jpg'),
('gpu', 'NVIDIA GTX 1660 SUPER 6GB', 'NVIDIA', 229.99, '{"vram": "6GB GDDR6", "length": "229mm", "tdp": 125, "pcie": "3.0", "width": "2-slot"}'::jsonb, '{"amazon": "https://amazon.com/dp/B07ZHZL2JB"}'::jsonb, 'https://m.media-amazon.com/images/I/81mMWJAIpoL._AC_SL1500_.jpg'),
('gpu', 'NVIDIA GTX 1060 6GB', 'NVIDIA', 159.99, '{"vram": "6GB GDDR5", "length": "250mm", "tdp": 120, "pcie": "3.0", "width": "2-slot"}'::jsonb, '{"amazon": "https://amazon.com/dp/B01IO9YREI"}'::jsonb, 'https://m.media-amazon.com/images/I/81muLqKW1IL._AC_SL1500_.jpg'),
('gpu', 'AMD Radeon RX 550 4GB', 'AMD', 129.99, '{"vram": "4GB GDDR5", "length": "158mm", "tdp": 50, "pcie": "3.0", "width": "2-slot"}'::jsonb, '{"amazon": "https://amazon.com/dp/B06ZZ6FMF8"}'::jsonb, 'https://m.media-amazon.com/images/I/71qYGxp4TnL._AC_SL1500_.jpg'),
('gpu', 'AMD Radeon RX 570 4GB', 'AMD', 139.99, '{"vram": "4GB GDDR5", "length": "241mm", "tdp": 150, "pcie": "3.0", "width": "2-slot"}'::jsonb, '{"amazon": "https://amazon.com/dp/B06ZZ6FMF6"}'::jsonb, 'https://m.media-amazon.com/images/I/71qYGxp4TnL._AC_SL1500_.jpg'),
('gpu', 'AMD Radeon RX 580 8GB', 'AMD', 149.99, '{"vram": "8GB GDDR5", "length": "241mm", "tdp": 185, "pcie": "3.0", "width": "2-slot"}'::jsonb, '{"amazon": "https://amazon.com/dp/B06ZZ6FMF8"}'::jsonb, 'https://m.media-amazon.com/images/I/71qYGxp4TnL._AC_SL1500_.jpg'),
('gpu', 'AMD Radeon RX 5500 XT 8GB', 'AMD', 189.99, '{"vram": "8GB GDDR6", "length": "250mm", "tdp": 130, "pcie": "4.0", "width": "2-slot"}'::jsonb, '{"amazon": "https://amazon.com/dp/B082BFQT7V"}'::jsonb, 'https://m.media-amazon.com/images/I/71a5HSanAVL._AC_SL1500_.jpg'),
('gpu', 'AMD Radeon RX 5600 XT 6GB', 'AMD', 229.99, '{"vram": "6GB GDDR6", "length": "267mm", "tdp": 150, "pcie": "4.0", "width": "2.5-slot"}'::jsonb, '{"amazon": "https://amazon.com/dp/B082BFQLZT"}'::jsonb, 'https://m.media-amazon.com/images/I/71a5HSanAVL._AC_SL1500_.jpg'),
('gpu', 'AMD Radeon RX 6400 4GB', 'AMD', 149.99, '{"vram": "4GB GDDR6", "length": "172mm", "tdp": 53, "pcie": "4.0", "width": "1-slot"}'::jsonb, '{"amazon": "https://amazon.com/dp/B09Q9D6B6L"}'::jsonb, 'https://m.media-amazon.com/images/I/71bfu1WD1EL._AC_SL1500_.jpg'),
('gpu', 'AMD Radeon RX 6500 XT 4GB', 'AMD', 169.99, '{"vram": "4GB GDDR6", "length": "190mm", "tdp": 107, "pcie": "4.0", "width": "2-slot"}'::jsonb, '{"amazon": "https://amazon.com/dp/B09QKVNK7Z"}'::jsonb, 'https://m.media-amazon.com/images/I/71bfu1WD1EL._AC_SL1500_.jpg'),
('gpu', 'Intel Arc A380 6GB', 'Intel', 139.99, '{"vram": "6GB GDDR6", "length": "222mm", "tdp": 75, "pcie": "4.0", "width": "2-slot"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0B6GQJXLY"}'::jsonb, 'https://m.media-amazon.com/images/I/71hf5UsVT4L._AC_SL1500_.jpg');

-- =====================================================
-- Budget Motherboards (14 components)
-- =====================================================
INSERT INTO components (type, name, brand, price, specs, vendor_links, image_url) VALUES
('motherboard', 'ASRock A320M-HDV R4.0', 'ASRock', 54.99, '{"socket": "AM4", "chipset": "A320", "ram_slots": 2, "max_ram": "32GB", "ram_type": "DDR4", "form_factor": "Micro-ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B07FVYKFTZ"}'::jsonb, 'https://m.media-amazon.com/images/I/81eezN3MXcL._AC_SL1500_.jpg'),
('motherboard', 'Gigabyte GA-A320M-S2H', 'GIGABYTE', 59.99, '{"socket": "AM4", "chipset": "A320", "ram_slots": 2, "max_ram": "64GB", "ram_type": "DDR4", "form_factor": "Micro-ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B06XJ4V27M"}'::jsonb, 'https://m.media-amazon.com/images/I/81SUkTDS0GL._AC_SL1500_.jpg'),
('motherboard', 'MSI A520M-A PRO', 'MSI', 64.99, '{"socket": "AM4", "chipset": "A520", "ram_slots": 2, "max_ram": "64GB", "ram_type": "DDR4", "form_factor": "Micro-ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B08G9MNQ7X"}'::jsonb, 'https://m.media-amazon.com/images/I/81As4nRJ3SL._AC_SL1500_.jpg'),
('motherboard', 'ASRock B450M Steel Legend', 'ASRock', 89.99, '{"socket": "AM4", "chipset": "B450", "ram_slots": 4, "max_ram": "128GB", "ram_type": "DDR4", "form_factor": "Micro-ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B07MVL2W4H"}'::jsonb, 'https://m.media-amazon.com/images/I/81MYx2QvGcL._AC_SL1500_.jpg'),
('motherboard', 'Gigabyte B450M DS3H WIFI', 'GIGABYTE', 84.99, '{"socket": "AM4", "chipset": "B450", "ram_slots": 4, "max_ram": "128GB", "ram_type": "DDR4", "form_factor": "Micro-ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B082WLTW2J"}'::jsonb, 'https://m.media-amazon.com/images/I/81VpsIs58eL._AC_SL1500_.jpg'),
('motherboard', 'ASUS PRIME A520M-E', 'ASUS', 69.99, '{"socket": "AM4", "chipset": "A520", "ram_slots": 2, "max_ram": "64GB", "ram_type": "DDR4", "form_factor": "Micro-ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B08FXTC7WF"}'::jsonb, 'https://m.media-amazon.com/images/I/81zE0gmtp2L._AC_SL1500_.jpg'),
('motherboard', 'MSI PRO B760M-E DDR4', 'MSI', 109.99, '{"socket": "LGA1700", "chipset": "B760", "ram_slots": 4, "max_ram": "128GB", "ram_type": "DDR4", "form_factor": "Micro-ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BR8T449V"}'::jsonb, 'https://m.media-amazon.com/images/I/81q9x6pRPdL._AC_SL1500_.jpg'),
('motherboard', 'ASUS PRIME H610M-E D4', 'ASUS', 89.99, '{"socket": "LGA1700", "chipset": "H610", "ram_slots": 2, "max_ram": "64GB", "ram_type": "DDR4", "form_factor": "Micro-ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B09XJ6ZXZ1"}'::jsonb, 'https://m.media-amazon.com/images/I/816a4c2x-oL._AC_SL1500_.jpg'),
('motherboard', 'Gigabyte H610M H DDR4', 'GIGABYTE', 94.99, '{"socket": "LGA1700", "chipset": "H610", "ram_slots": 2, "max_ram": "64GB", "ram_type": "DDR4", "form_factor": "Micro-ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B09QXBYYPW"}'::jsonb, 'https://m.media-amazon.com/images/I/81MD2dIhRbL._AC_SL1500_.jpg'),
('motherboard', 'ASRock H510M-HVS R2.0', 'ASRock', 74.99, '{"socket": "LGA1200", "chipset": "H510", "ram_slots": 2, "max_ram": "64GB", "ram_type": "DDR4", "form_factor": "Micro-ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B08YN565Z7"}'::jsonb, 'https://m.media-amazon.com/images/I/81Yj-4YcUIL._AC_SL1500_.jpg'),
('motherboard', 'MSI PRO H610M-B DDR4', 'MSI', 79.99, '{"socket": "LGA1700", "chipset": "H610", "ram_slots": 2, "max_ram": "64GB", "ram_type": "DDR4", "form_factor": "Micro-ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B09QCPHVNF"}'::jsonb, 'https://m.media-amazon.com/images/I/71cR1kNV0DL._AC_SL1500_.jpg'),
('motherboard', 'Biostar B660MX-E PRO', 'Biostar', 99.99, '{"socket": "LGA1700", "chipset": "B660", "ram_slots": 4, "max_ram": "128GB", "ram_type": "DDR4", "form_factor": "Micro-ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B09V59K9RZ"}'::jsonb, 'https://m.media-amazon.com/images/I/7134wqK0eWL._AC_SL1500_.jpg'),
('motherboard', 'ASRock B660M-HDV', 'ASRock', 109.99, '{"socket": "LGA1700", "chipset": "B660", "ram_slots": 4, "max_ram": "128GB", "ram_type": "DDR4", "form_factor": "Micro-ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B09QBCB3Q2"}'::jsonb, 'https://m.media-amazon.com/images/I/81oFqxe50LL._AC_SL1500_.jpg'),
('motherboard', 'Gigabyte B650M DS3H', 'GIGABYTE', 129.99, '{"socket": "AM5", "chipset": "B650", "ram_slots": 4, "max_ram": "128GB", "ram_type": "DDR5", "form_factor": "Micro-ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BHL86XHJ"}'::jsonb, 'https://m.media-amazon.com/images/I/81tJtWy6MBL._AC_SL1500_.jpg');

-- =====================================================
-- Budget RAM Kits (14 components)
-- =====================================================
INSERT INTO components (type, name, brand, price, specs, vendor_links, image_url) VALUES
('ram', 'TEAMGROUP T-Create Classic DDR4 8GB (2x4GB) 3200MHz', 'TEAMGROUP', 32.99, '{"type": "DDR4", "speed": "3200MHz", "capacity": "8GB", "kit": "2x4GB", "cas_latency": "CL22"}'::jsonb, '{"amazon": "https://amazon.com/dp/B08D6TJNGC"}'::jsonb, 'https://m.media-amazon.com/images/I/61OqOFgeCqL._AC_SL1500_.jpg'),
('ram', 'Silicon Power Value DDR4 8GB (1x8GB) 3200MHz', 'Silicon Power', 18.99, '{"type": "DDR4", "speed": "3200MHz", "capacity": "8GB", "kit": "1x8GB", "cas_latency": "CL22"}'::jsonb, '{"amazon": "https://amazon.com/dp/B08L8LGYMN"}'::jsonb, 'https://m.media-amazon.com/images/I/51g5VvzRzCL._AC_SL1000_.jpg'),
('ram', 'Crucial Basics DDR4 8GB (1x8GB) 2666MHz', 'Crucial', 17.99, '{"type": "DDR4", "speed": "2666MHz", "capacity": "8GB", "kit": "1x8GB", "cas_latency": "CL19"}'::jsonb, '{"amazon": "https://amazon.com/dp/B079H4ZRH8"}'::jsonb, 'https://m.media-amazon.com/images/I/61DKR9Wkv+L._AC_SL1500_.jpg'),
('ram', 'Corsair Vengeance LPX DDR4 8GB (2x4GB) 3000MHz', 'Corsair', 34.99, '{"type": "DDR4", "speed": "3000MHz", "capacity": "8GB", "kit": "2x4GB", "cas_latency": "CL16"}'::jsonb, '{"amazon": "https://amazon.com/dp/B07D1XCKWW"}'::jsonb, 'https://m.media-amazon.com/images/I/51Y5-SBFmwL._AC_SL1000_.jpg'),
('ram', 'Patriot Viper Steel DDR4 8GB (2x4GB) 3600MHz', 'Patriot', 36.99, '{"type": "DDR4", "speed": "3600MHz", "capacity": "8GB", "kit": "2x4GB", "cas_latency": "CL17"}'::jsonb, '{"amazon": "https://amazon.com/dp/B07M7PDBJR"}'::jsonb, 'https://m.media-amazon.com/images/I/71U2dOxZ8ZL._AC_SL1500_.jpg'),
('ram', 'TEAMGROUP T-Force Vulcan Z DDR4 16GB (2x8GB) 3200MHz', 'TEAMGROUP', 42.99, '{"type": "DDR4", "speed": "3200MHz", "capacity": "16GB", "kit": "2x8GB", "cas_latency": "CL16"}'::jsonb, '{"amazon": "https://amazon.com/dp/B07PGT7LSR"}'::jsonb, 'https://m.media-amazon.com/images/I/612sLAh3FEL._AC_SL1200_.jpg'),
('ram', 'Patriot Signature DDR4 16GB (2x8GB) 2666MHz', 'Patriot', 38.99, '{"type": "DDR4", "speed": "2666MHz", "capacity": "16GB", "kit": "2x8GB", "cas_latency": "CL19"}'::jsonb, '{"amazon": "https://amazon.com/dp/B01H3ZKXQI"}'::jsonb, 'https://m.media-amazon.com/images/I/71gCMgfHd4L._AC_SL1500_.jpg'),
('ram', 'ADATA XPG Gammix D30 DDR4 16GB (2x8GB) 3200MHz', 'ADATA', 44.99, '{"type": "DDR4", "speed": "3200MHz", "capacity": "16GB", "kit": "2x8GB", "cas_latency": "CL16"}'::jsonb, '{"amazon": "https://amazon.com/dp/B07BQLZSCG"}'::jsonb, 'https://m.media-amazon.com/images/I/61FqYFqy5cL._AC_SL1500_.jpg'),
('ram', 'Crucial DDR4 16GB (2x8GB) 3200MHz', 'Crucial', 39.99, '{"type": "DDR4", "speed": "3200MHz", "capacity": "16GB", "kit": "2x8GB", "cas_latency": "CL22"}'::jsonb, '{"amazon": "https://amazon.com/dp/B07ZLCM82C"}'::jsonb, 'https://m.media-amazon.com/images/I/61QdT1CocML._AC_SL1500_.jpg'),
('ram', 'Corsair Vengeance LPX DDR4 8GB (1x8GB) 3200MHz', 'Corsair', 24.99, '{"type": "DDR4", "speed": "3200MHz", "capacity": "8GB", "kit": "1x8GB", "cas_latency": "CL16"}'::jsonb, '{"amazon": "https://amazon.com/dp/B07RM39V5F"}'::jsonb, 'https://m.media-amazon.com/images/I/51Y5-SBFmwL._AC_SL1000_.jpg'),
('ram', 'G.Skill Aegis DDR4 16GB (1x16GB) 3000MHz', 'G.Skill', 42.99, '{"type": "DDR4", "speed": "3000MHz", "capacity": "16GB", "kit": "1x16GB", "cas_latency": "CL16"}'::jsonb, '{"amazon": "https://amazon.com/dp/B01MSBS1S7"}'::jsonb, 'https://m.media-amazon.com/images/I/61r13V5GTRL._AC_SL1000_.jpg'),
('ram', 'TEAMGROUP Elite DDR5 16GB (1x16GB) 4800MHz', 'TEAMGROUP', 54.99, '{"type": "DDR5", "speed": "4800MHz", "capacity": "16GB", "kit": "1x16GB", "cas_latency": "CL40"}'::jsonb, '{"amazon": "https://amazon.com/dp/B09LYY2MCR"}'::jsonb, 'https://m.media-amazon.com/images/I/61jftCfS1gL._AC_SL1500_.jpg'),
('ram', 'Crucial DDR5 16GB (1x16GB) 5200MHz', 'Crucial', 59.99, '{"type": "DDR5", "speed": "5200MHz", "capacity": "16GB", "kit": "1x16GB", "cas_latency": "CL42"}'::jsonb, '{"amazon": "https://amazon.com/dp/B09QV6T7GL"}'::jsonb, 'https://m.media-amazon.com/images/I/51qC0j6DigL._AC_SL1200_.jpg'),
('ram', 'ADATA Premier DDR5 32GB (2x16GB) 4800MHz', 'ADATA', 89.99, '{"type": "DDR5", "speed": "4800MHz", "capacity": "32GB", "kit": "2x16GB", "cas_latency": "CL40"}'::jsonb, '{"amazon": "https://amazon.com/dp/B09P8C13N7"}'::jsonb, 'https://m.media-amazon.com/images/I/61pqwa9uAML._AC_SL1500_.jpg'),
('ram', 'Kingston FURY Beast DDR5 32GB (2x16GB) 5200MHz', 'Kingston', 99.99, '{"type": "DDR5", "speed": "5200MHz", "capacity": "32GB", "kit": "2x16GB", "cas_latency": "CL40"}'::jsonb, '{"amazon": "https://amazon.com/dp/B09LQH6ZXT"}'::jsonb, 'https://m.media-amazon.com/images/I/61H3DqhL7bL._AC_SL1500_.jpg');

-- =====================================================
-- Budget Storage (14 components)
-- =====================================================
INSERT INTO components (type, name, brand, price, specs, vendor_links, image_url) VALUES
('storage', 'Kingston A400 120GB SATA SSD', 'Kingston', 18.99, '{"type": "SATA SSD", "capacity": "120GB", "interface": "SATA", "read_speed": "500 MB/s", "write_speed": "320 MB/s"}'::jsonb, '{"amazon": "https://amazon.com/dp/B01N5IB20Q"}'::jsonb, 'https://m.media-amazon.com/images/I/81e27+PHv4L._AC_SL1500_.jpg'),
('storage', 'Kingston A400 240GB SATA SSD', 'Kingston', 24.99, '{"type": "SATA SSD", "capacity": "240GB", "interface": "SATA", "read_speed": "500 MB/s", "write_speed": "350 MB/s"}'::jsonb, '{"amazon": "https://amazon.com/dp/B01N5IB20Q"}'::jsonb, 'https://m.media-amazon.com/images/I/81e27+PHv4L._AC_SL1500_.jpg'),
('storage', 'Crucial BX500 480GB SATA SSD', 'Crucial', 34.99, '{"type": "SATA SSD", "capacity": "480GB", "interface": "SATA", "read_speed": "540 MB/s", "write_speed": "500 MB/s"}'::jsonb, '{"amazon": "https://amazon.com/dp/B07YD5799G"}'::jsonb, 'https://m.media-amazon.com/images/I/71Sb1JA1M-L._AC_SL1500_.jpg'),
('storage', 'ADATA SU635 960GB SATA SSD', 'ADATA', 52.99, '{"type": "SATA SSD", "capacity": "960GB", "interface": "SATA", "read_speed": "520 MB/s", "write_speed": "450 MB/s"}'::jsonb, '{"amazon": "https://amazon.com/dp/B07Q3YCV5N"}'::jsonb, 'https://m.media-amazon.com/images/I/71LPrPGs3jL._AC_SL1500_.jpg'),
('storage', 'TEAMGROUP AX2 1TB SATA SSD', 'TEAMGROUP', 49.99, '{"type": "SATA SSD", "capacity": "1TB", "interface": "SATA", "read_speed": "540 MB/s", "write_speed": "490 MB/s"}'::jsonb, '{"amazon": "https://amazon.com/dp/B08L8LGYB9"}'::jsonb, 'https://m.media-amazon.com/images/I/61jQz9vywgL._AC_SL1500_.jpg'),
('storage', 'Silicon Power A60 256GB NVMe', 'Silicon Power', 23.99, '{"type": "NVMe SSD", "capacity": "256GB", "interface": "PCIe 3.0", "read_speed": "2100 MB/s", "write_speed": "1700 MB/s"}'::jsonb, '{"amazon": "https://amazon.com/dp/B07KSLNNZ1"}'::jsonb, 'https://m.media-amazon.com/images/I/81ebfpD7x0L._AC_SL1500_.jpg'),
('storage', 'Silicon Power A60 512GB NVMe', 'Silicon Power', 34.99, '{"type": "NVMe SSD", "capacity": "512GB", "interface": "PCIe 3.0", "read_speed": "2200 MB/s", "write_speed": "1600 MB/s"}'::jsonb, '{"amazon": "https://amazon.com/dp/B07KSLNNZ1"}'::jsonb, 'https://m.media-amazon.com/images/I/81ebfpD7x0L._AC_SL1500_.jpg'),
('storage', 'ADATA Legend 700 1TB NVMe', 'ADATA', 54.99, '{"type": "NVMe SSD", "capacity": "1TB", "interface": "PCIe 3.0", "read_speed": "2000 MB/s", "write_speed": "1600 MB/s"}'::jsonb, '{"amazon": "https://amazon.com/dp/B09G323ZVR"}'::jsonb, 'https://m.media-amazon.com/images/I/61M4MFQD0bL._AC_SL1500_.jpg'),
('storage', 'TEAMGROUP MP33 512GB NVMe', 'TEAMGROUP', 31.99, '{"type": "NVMe SSD", "capacity": "512GB", "interface": "PCIe 3.0", "read_speed": "1700 MB/s", "write_speed": "1400 MB/s"}'::jsonb, '{"amazon": "https://amazon.com/dp/B07P6K9SC6"}'::jsonb, 'https://m.media-amazon.com/images/I/61H9jCZO9pL._AC_SL1500_.jpg'),
('storage', 'TEAMGROUP MP33 1TB NVMe', 'TEAMGROUP', 44.99, '{"type": "NVMe SSD", "capacity": "1TB", "interface": "PCIe 3.0", "read_speed": "1800 MB/s", "write_speed": "1500 MB/s"}'::jsonb, '{"amazon": "https://amazon.com/dp/B07P6K9SC6"}'::jsonb, 'https://m.media-amazon.com/images/I/61H9jCZO9pL._AC_SL1500_.jpg'),
('storage', 'WD Blue SN580 500GB NVMe', 'Western Digital', 38.99, '{"type": "NVMe SSD", "capacity": "500GB", "interface": "PCIe 4.0", "read_speed": "4150 MB/s", "write_speed": "4150 MB/s"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BBWLFJX8"}'::jsonb, 'https://m.media-amazon.com/images/I/61u6gk0D1PL._AC_SL1500_.jpg'),
('storage', 'WD Green SN350 240GB NVMe', 'Western Digital', 22.99, '{"type": "NVMe SSD", "capacity": "240GB", "interface": "PCIe 3.0", "read_speed": "2400 MB/s", "write_speed": "900 MB/s"}'::jsonb, '{"amazon": "https://amazon.com/dp/B08TJ2649W"}'::jsonb, 'https://m.media-amazon.com/images/I/61YbV8oz7nL._AC_SL1500_.jpg'),
('storage', 'Patriot P210 256GB SATA SSD', 'Patriot', 21.99, '{"type": "SATA SSD", "capacity": "256GB", "interface": "SATA", "read_speed": "520 MB/s", "write_speed": "430 MB/s"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0889XXQ7L"}'::jsonb, 'https://m.media-amazon.com/images/I/61kYHTS9oFL._AC_SL1000_.jpg'),
('storage', 'Seagate Barracuda 1TB HDD', 'Seagate', 39.99, '{"type": "HDD", "capacity": "1TB", "interface": "SATA", "rpm": "7200 RPM", "cache": "64MB"}'::jsonb, '{"amazon": "https://amazon.com/dp/B01LY65EVG"}'::jsonb, 'https://m.media-amazon.com/images/I/81aR0Z4+v-L._AC_SL1500_.jpg'),
('storage', 'Toshiba P300 2TB HDD', 'Toshiba', 49.99, '{"type": "HDD", "capacity": "2TB", "interface": "SATA", "rpm": "7200 RPM", "cache": "64MB"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0766Y7RGY"}'::jsonb, 'https://m.media-amazon.com/images/I/61L7YDL9lQL._AC_SL1500_.jpg');

-- =====================================================
-- Budget PSUs (14 components)
-- =====================================================
INSERT INTO components (type, name, brand, price, specs, vendor_links, image_url) VALUES
('psu', 'EVGA 450 BR 450W 80+ Bronze', 'EVGA', 44.99, '{"wattage": 450, "efficiency": "80+ Bronze", "modular": "Non-Modular", "form_factor": "ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B07H28BKJQ"}'::jsonb, 'https://m.media-amazon.com/images/I/81S9e51AemL._AC_SL1500_.jpg'),
('psu', 'Thermaltake Smart 500W 80+ White', 'Thermaltake', 39.99, '{"wattage": 500, "efficiency": "80+", "modular": "Non-Modular", "form_factor": "ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B014W3EAX8"}'::jsonb, 'https://m.media-amazon.com/images/I/81pwAekxV4L._AC_SL1500_.jpg'),
('psu', 'Corsair CV450 450W 80+ Bronze', 'Corsair', 49.99, '{"wattage": 450, "efficiency": "80+ Bronze", "modular": "Non-Modular", "form_factor": "ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B07Y88YN3J"}'::jsonb, 'https://m.media-amazon.com/images/I/81Or5UcGliL._AC_SL1500_.jpg'),
('psu', 'Cooler Master Elite V3 500W', 'Cooler Master', 44.99, '{"wattage": 500, "efficiency": "80+", "modular": "Non-Modular", "form_factor": "ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0B62X7ZH5"}'::jsonb, 'https://m.media-amazon.com/images/I/61u1Y3c6JFL._AC_SL1000_.jpg'),
('psu', 'Montech Century 550W 80+ Gold', 'Montech', 69.99, '{"wattage": 550, "efficiency": "80+ Gold", "modular": "Fully Modular", "form_factor": "ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B09ZVMVQ1J"}'::jsonb, 'https://m.media-amazon.com/images/I/61wwn7gYUZL._AC_SL1500_.jpg'),
('psu', 'MSI MAG A500DN 500W 80+ Bronze', 'MSI', 49.99, '{"wattage": 500, "efficiency": "80+ Bronze", "modular": "Non-Modular", "form_factor": "ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BNXH1ZWS"}'::jsonb, 'https://m.media-amazon.com/images/I/71P2f+qsLML._AC_SL1500_.jpg'),
('psu', 'Gigabyte P450B 450W 80+ Bronze', 'GIGABYTE', 47.99, '{"wattage": 450, "efficiency": "80+ Bronze", "modular": "Non-Modular", "form_factor": "ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0863Y2S9C"}'::jsonb, 'https://m.media-amazon.com/images/I/71vG6HCpzCL._AC_SL1500_.jpg'),
('psu', 'Aresgame AGV 500W 80+ Bronze', 'Aresgame', 39.99, '{"wattage": 500, "efficiency": "80+ Bronze", "modular": "Non-Modular", "form_factor": "ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B07GQ2Y2VP"}'::jsonb, 'https://m.media-amazon.com/images/I/71QEiwRfGhL._AC_SL1500_.jpg'),
('psu', 'Aresgame AGW 550W 80+ Bronze', 'Aresgame', 49.99, '{"wattage": 550, "efficiency": "80+ Bronze", "modular": "Semi-Modular", "form_factor": "ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B095YWNBJ1"}'::jsonb, 'https://m.media-amazon.com/images/I/81+KQ1EnnEL._AC_SL1500_.jpg'),
('psu', 'EVGA 500 W2 500W', 'EVGA', 44.99, '{"wattage": 500, "efficiency": "80+", "modular": "Non-Modular", "form_factor": "ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B01MTJTO2O"}'::jsonb, 'https://m.media-amazon.com/images/I/71pvkM7lO1L._AC_SL1500_.jpg'),
('psu', 'Thermaltake Smart BM2 550W 80+ Bronze', 'Thermaltake', 59.99, '{"wattage": 550, "efficiency": "80+ Bronze", "modular": "Semi-Modular", "form_factor": "ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B087Q2Z8VG"}'::jsonb, 'https://m.media-amazon.com/images/I/81MTVXJJ3oL._AC_SL1500_.jpg'),
('psu', 'FSP Hydro GT PRO 650W 80+ Gold', 'FSP', 89.99, '{"wattage": 650, "efficiency": "80+ Gold", "modular": "Fully Modular", "form_factor": "ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B09X4932TG"}'::jsonb, 'https://m.media-amazon.com/images/I/71VIt7fs1gL._AC_SL1500_.jpg'),
('psu', 'Cooler Master MWE V2 550W 80+ Bronze', 'Cooler Master', 59.99, '{"wattage": 550, "efficiency": "80+ Bronze", "modular": "Non-Modular", "form_factor": "ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B08PC2GVPF"}'::jsonb, 'https://m.media-amazon.com/images/I/61XlV7it9XL._AC_SL1500_.jpg'),
('psu', 'Seasonic S12III 500W 80+ Bronze', 'Seasonic', 64.99, '{"wattage": 500, "efficiency": "80+ Bronze", "modular": "Non-Modular", "form_factor": "ATX"}'::jsonb, '{"amazon": "https://amazon.com/dp/B07MWGWBK6"}'::jsonb, 'https://m.media-amazon.com/images/I/81m5nYeDwkL._AC_SL1500_.jpg');

-- =====================================================
-- Budget Cases (14 components)
-- =====================================================
INSERT INTO components (type, name, brand, price, specs, vendor_links, image_url) VALUES
('case', 'Montech Fighter 600 ATX', 'Montech', 44.99, '{"form_factor": "Mid Tower ATX", "max_gpu_length": "330mm", "color": "Black", "side_panel": "Tempered Glass"}'::jsonb, '{"amazon": "https://amazon.com/dp/B08L9LGNRC"}'::jsonb, 'https://m.media-amazon.com/images/I/71AObzE5WBL._AC_SL1500_.jpg'),
('case', 'Montech X3 Mesh', 'Montech', 69.99, '{"form_factor": "Mid Tower ATX", "max_gpu_length": "355mm", "color": "White", "side_panel": "Tempered Glass"}'::jsonb, '{"amazon": "https://amazon.com/dp/B08V98GQJN"}'::jsonb, 'https://m.media-amazon.com/images/I/81m8H2+aVhL._AC_SL1500_.jpg'),
('case', 'Cooler Master MasterBox Q300L', 'Cooler Master', 49.99, '{"form_factor": "Micro-ATX", "max_gpu_length": "360mm", "color": "Black", "side_panel": "Acrylic"}'::jsonb, '{"amazon": "https://amazon.com/dp/B0785GRMPG"}'::jsonb, 'https://m.media-amazon.com/images/I/81ac2z9SMyL._AC_SL1500_.jpg'),
('case', 'Cooler Master NR200 Mini-ITX', 'Cooler Master', 99.99, '{"form_factor": "Mini-ITX", "max_gpu_length": "330mm", "color": "Black", "side_panel": "Vented Steel"}'::jsonb, '{"amazon": "https://amazon.com/dp/B08CZBZB2K"}'::jsonb, 'https://m.media-amazon.com/images/I/817bK9yCJiL._AC_SL1500_.jpg'),
('case', 'Thermaltake Versa H18', 'Thermaltake', 49.99, '{"form_factor": "Micro-ATX", "max_gpu_length": "350mm", "color": "Black", "side_panel": "Tempered Glass"}'::jsonb, '{"amazon": "https://amazon.com/dp/B079FRBZ21"}'::jsonb, 'https://m.media-amazon.com/images/I/61zgWX7dPCL._AC_SL1500_.jpg'),
('case', 'Thermaltake V250 TG ARGB', 'Thermaltake', 74.99, '{"form_factor": "Mid Tower ATX", "max_gpu_length": "320mm", "color": "Black", "side_panel": "Tempered Glass"}'::jsonb, '{"amazon": "https://amazon.com/dp/B07ZEZL9R2"}'::jsonb, 'https://m.media-amazon.com/images/I/71byLPQbnOL._AC_SL1500_.jpg'),
('case', 'DeepCool Matrexx 30', 'DeepCool', 34.99, '{"form_factor": "Micro-ATX", "max_gpu_length": "250mm", "color": "Black", "side_panel": "Tempered Glass"}'::jsonb, '{"amazon": "https://amazon.com/dp/B07G76QNSV"}'::jsonb, 'https://m.media-amazon.com/images/I/61qDaCIJN9L._AC_SL1500_.jpg'),
('case', 'DeepCool Matrexx 50 ADD-RGB 4F', 'DeepCool', 79.99, '{"form_factor": "Mid Tower ATX", "max_gpu_length": "370mm", "color": "Black", "side_panel": "Tempered Glass"}'::jsonb, '{"amazon": "https://amazon.com/dp/B07T9S8PF2"}'::jsonb, 'https://m.media-amazon.com/images/I/71vcZz3xVTL._AC_SL1500_.jpg'),
('case', 'Fractal Design Focus G Mini', 'Fractal Design', 54.99, '{"form_factor": "Micro-ATX", "max_gpu_length": "380mm", "color": "Black", "side_panel": "Acrylic"}'::jsonb, '{"amazon": "https://amazon.com/dp/B01N2RJR0S"}'::jsonb, 'https://m.media-amazon.com/images/I/71JjAFz2DqL._AC_SL1500_.jpg'),
('case', 'NZXT H210 Mini-ITX', 'NZXT', 79.99, '{"form_factor": "Mini-ITX", "max_gpu_length": "325mm", "color": "White", "side_panel": "Tempered Glass"}'::jsonb, '{"amazon": "https://amazon.com/dp/B07TDKBQBS"}'::jsonb, 'https://m.media-amazon.com/images/I/71eO2-LViGL._AC_SL1500_.jpg'),
('case', 'Phanteks Eclipse P200A', 'Phanteks', 79.99, '{"form_factor": "Mini-ITX", "max_gpu_length": "355mm", "color": "Black", "side_panel": "Tempered Glass"}'::jsonb, '{"amazon": "https://amazon.com/dp/B08R6L6GKR"}'::jsonb, 'https://m.media-amazon.com/images/I/71JvJjyTQFL._AC_SL1500_.jpg'),
('case', 'Lian Li LANCOOL 205M', 'Lian Li', 69.99, '{"form_factor": "Micro-ATX", "max_gpu_length": "350mm", "color": "Black", "side_panel": "Tempered Glass"}'::jsonb, '{"amazon": "https://amazon.com/dp/B08PDR1G6V"}'::jsonb, 'https://m.media-amazon.com/images/I/71P7G7V0EWS._AC_SL1500_.jpg'),
('case', 'Corsair 200R Compact ATX', 'Corsair', 69.99, '{"form_factor": "Mid Tower ATX", "max_gpu_length": "430mm", "color": "Black", "side_panel": "Steel"}'::jsonb, '{"amazon": "https://amazon.com/dp/B009GXZ8MM"}'::jsonb, 'https://m.media-amazon.com/images/I/71Z9-J+7HZL._AC_SL1500_.jpg'),
('case', 'be quiet! Pure Base 600', 'be quiet!', 79.99, '{"form_factor": "Mid Tower ATX", "max_gpu_length": "425mm", "color": "Black", "side_panel": "Steel"}'::jsonb, '{"amazon": "https://amazon.com/dp/B01N7P0JBS"}'::jsonb, 'https://m.media-amazon.com/images/I/71T0cPgS45L._AC_SL1500_.jpg');

-- =====================================================
-- Budget Coolers (14 components)
-- =====================================================
INSERT INTO components (type, name, brand, price, specs, vendor_links, image_url) VALUES
('cooler', 'AMD Wraith Stealth (Standalone)', 'AMD', 19.99, '{"type": "Air Cooler", "height": "54mm", "tdp_rating": 95, "socket_support": ["AM4"]}'::jsonb, '{"amazon": "https://amazon.com/dp/B01LZ3QLVM"}'::jsonb, 'https://m.media-amazon.com/images/I/51kHwz4GmRL._AC_SL1000_.jpg'),
('cooler', 'DeepCool GAMMAXX 400 V2', 'DeepCool', 24.99, '{"type": "Air Cooler", "height": "155mm", "tdp_rating": 150, "socket_support": ["AM5", "AM4", "LGA1700", "LGA1200"]}'::jsonb, '{"amazon": "https://amazon.com/dp/B07SMQ7F9J"}'::jsonb, 'https://m.media-amazon.com/images/I/7123bDBG+7L._AC_SL1500_.jpg'),
('cooler', 'Cooler Master Hyper H410R', 'Cooler Master', 24.99, '{"type": "Air Cooler", "height": "136mm", "tdp_rating": 100, "socket_support": ["AM5", "AM4", "LGA1200", "LGA1700"]}'::jsonb, '{"amazon": "https://amazon.com/dp/B075YSMG19"}'::jsonb, 'https://m.media-amazon.com/images/I/61Fi7kKIJ2L._AC_SL1000_.jpg'),
('cooler', 'Thermaltake UX100 ARGB', 'Thermaltake', 22.99, '{"type": "Air Cooler", "height": "133mm", "tdp_rating": 130, "socket_support": ["AM4", "LGA1200", "LGA115x"]}'::jsonb, '{"amazon": "https://amazon.com/dp/B07TX7ZFHX"}'::jsonb, 'https://m.media-amazon.com/images/I/71wV1xXxCPL._AC_SL1500_.jpg'),
('cooler', 'ID-COOLING SE-224-XT', 'ID-COOLING', 29.99, '{"type": "Air Cooler", "height": "154mm", "tdp_rating": 180, "socket_support": ["AM5", "AM4", "LGA1700", "LGA1200"]}'::jsonb, '{"amazon": "https://amazon.com/dp/B083TB1NDP"}'::jsonb, 'https://m.media-amazon.com/images/I/71hQXK2vV-L._AC_SL1500_.jpg'),
('cooler', 'Vetroo V5 White', 'Vetroo', 29.99, '{"type": "Air Cooler", "height": "157mm", "tdp_rating": 150, "socket_support": ["AM5", "AM4", "LGA1700", "LGA1200"]}'::jsonb, '{"amazon": "https://amazon.com/dp/B08C2QQ9K2"}'::jsonb, 'https://m.media-amazon.com/images/I/61FUqH4H9uL._AC_SL1500_.jpg'),
('cooler', 'ARCTIC Freezer 34 eSports DUO', 'Arctic', 44.99, '{"type": "Air Cooler", "height": "157mm", "tdp_rating": 210, "socket_support": ["AM5", "AM4", "LGA1700", "LGA1200"]}'::jsonb, '{"amazon": "https://amazon.com/dp/B07MBHNRJ8"}'::jsonb, 'https://m.media-amazon.com/images/I/71oeQp6hwIL._AC_SL1500_.jpg'),
('cooler', 'Noctua NH-L9a-AM5', 'Noctua', 54.99, '{"type": "Air Cooler", "height": "37mm", "tdp_rating": 95, "socket_support": ["AM5", "AM4"]}'::jsonb, '{"amazon": "https://amazon.com/dp/B0BGN1M5CB"}'::jsonb, 'https://m.media-amazon.com/images/I/71m7fb3ZeaL._AC_SL1500_.jpg'),
('cooler', 'SilverStone Hydrogon D120 ARGB', 'SilverStone', 49.99, '{"type": "Air Cooler", "height": "154mm", "tdp_rating": 220, "socket_support": ["AM5", "AM4", "LGA1700", "LGA1200"]}'::jsonb, '{"amazon": "https://amazon.com/dp/B09DXR651M"}'::jsonb, 'https://m.media-amazon.com/images/I/71q4MvN8gtL._AC_SL1500_.jpg'),
('cooler', 'be quiet! Pure Rock Slim 2', 'be quiet!', 27.99, '{"type": "Air Cooler", "height": "135mm", "tdp_rating": 130, "socket_support": ["AM5", "AM4", "LGA1700", "LGA1200"]}'::jsonb, '{"amazon": "https://amazon.com/dp/B096TY9MKQ"}'::jsonb, 'https://m.media-amazon.com/images/I/61ZHQwZ0UeS._AC_SL1500_.jpg'),
('cooler', 'Cooler Master MasterLiquid ML120L V2', 'Cooler Master', 64.99, '{"type": "AIO Liquid Cooler", "radiator_size": "120mm", "tdp_rating": 200, "socket_support": ["AM5", "AM4", "LGA1700", "LGA1200"]}'::jsonb, '{"amazon": "https://amazon.com/dp/B089SQ213J"}'::jsonb, 'https://m.media-amazon.com/images/I/71W3P3m-lrL._AC_SL1500_.jpg'),
('cooler', 'Thermaltake TH120 ARGB Sync', 'Thermaltake', 69.99, '{"type": "AIO Liquid Cooler", "radiator_size": "120mm", "tdp_rating": 210, "socket_support": ["AM5", "AM4", "LGA1700", "LGA1200"]}'::jsonb, '{"amazon": "https://amazon.com/dp/B07ZWFBNJG"}'::jsonb, 'https://m.media-amazon.com/images/I/71d9alT7GyL._AC_SL1500_.jpg'),
('cooler', 'ID-COOLING Frostflow X 240', 'ID-COOLING', 74.99, '{"type": "AIO Liquid Cooler", "radiator_size": "240mm", "tdp_rating": 250, "socket_support": ["AM5", "AM4", "LGA1700", "LGA1200"]}'::jsonb, '{"amazon": "https://amazon.com/dp/B08BLLF131"}'::jsonb, 'https://m.media-amazon.com/images/I/612W+7kZVvL._AC_SL1500_.jpg'),
('cooler', 'MSI MAG CoreLiquid 240R V2', 'MSI', 89.99, '{"type": "AIO Liquid Cooler", "radiator_size": "240mm", "tdp_rating": 260, "socket_support": ["AM5", "AM4", "LGA1700", "LGA1200"]}'::jsonb, '{"amazon": "https://amazon.com/dp/B096YL7LJQ"}'::jsonb, 'https://m.media-amazon.com/images/I/61nq6QXB9wL._AC_SL1500_.jpg');

-- =====================================================
-- DONE! Database ready with 231 components
-- =====================================================
