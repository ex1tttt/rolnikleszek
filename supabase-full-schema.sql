-- ============================================
-- SUPABASE FULL DATABASE SCHEMA
-- Rolnik Leszek - System zamawiania jajek
-- ============================================

-- ============================================
-- 1. HELPER FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================
-- 2. DELIVERY_SLOTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS delivery_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_date TIMESTAMP WITH TIME ZONE NOT NULL,
  order_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  egg_limit INTEGER NOT NULL CHECK (egg_limit > 0),
  eggs_reserved INTEGER DEFAULT 0 CHECK (eggs_reserved >= 0),
  zone_description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Indexes for delivery_slots
CREATE INDEX IF NOT EXISTS idx_delivery_slots_active 
  ON delivery_slots(active);

CREATE INDEX IF NOT EXISTS idx_delivery_slots_delivery_date 
  ON delivery_slots(delivery_date DESC);

CREATE INDEX IF NOT EXISTS idx_delivery_slots_deadline 
  ON delivery_slots(order_deadline DESC);

-- Create Trigger for delivery_slots
DROP TRIGGER IF EXISTS update_delivery_slots_updated_at ON delivery_slots;

CREATE TRIGGER update_delivery_slots_updated_at
BEFORE UPDATE ON delivery_slots
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();


-- ============================================
-- 3. ORDERS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id UUID NOT NULL REFERENCES delivery_slots(id) ON DELETE RESTRICT,
  customer_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  notes TEXT,
  eggs_quantity INTEGER NOT NULL CHECK (eggs_quantity > 0),
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Indexes for orders
CREATE INDEX IF NOT EXISTS idx_orders_slot_id 
  ON orders(slot_id);

CREATE INDEX IF NOT EXISTS idx_orders_status 
  ON orders(status);

CREATE INDEX IF NOT EXISTS idx_orders_email 
  ON orders(email);

CREATE INDEX IF NOT EXISTS idx_orders_created_at 
  ON orders(created_at DESC);

-- Create Trigger for orders
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();


-- ============================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on delivery_slots
ALTER TABLE delivery_slots ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read active delivery slots
DROP POLICY IF EXISTS "Enable read access for all users" ON delivery_slots;
CREATE POLICY "Enable read access for all users" ON delivery_slots
  FOR SELECT
  USING (active = true);

-- Policy: Only authenticated users can insert delivery slots (admin)
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON delivery_slots;
CREATE POLICY "Enable insert for authenticated users only" ON delivery_slots
  FOR INSERT
  WITH CHECK (true);  -- TODO: Add auth check in production

-- Policy: Only authenticated users can update delivery slots (admin)
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON delivery_slots;
CREATE POLICY "Enable update for authenticated users only" ON delivery_slots
  FOR UPDATE
  USING (true)  -- TODO: Add auth check in production
  WITH CHECK (true);

-- Enable RLS on orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert orders (create new orders)
DROP POLICY IF EXISTS "Enable insert for all users" ON orders;
CREATE POLICY "Enable insert for all users" ON orders
  FOR INSERT
  WITH CHECK (true);

-- Policy: Anyone can read their own orders (based on email)
DROP POLICY IF EXISTS "Enable read access for order owners" ON orders;
CREATE POLICY "Enable read access for order owners" ON orders
  FOR SELECT
  USING (true);  -- TODO: Limit to user's email in production

-- Policy: Admin can update orders
DROP POLICY IF EXISTS "Enable update for authenticated users" ON orders;
CREATE POLICY "Enable update for authenticated users" ON orders
  FOR UPDATE
  USING (true)  -- TODO: Add admin check in production
  WITH CHECK (true);


-- ============================================
-- 5. TEST DATA (Optional - Remove in Production)
-- ============================================

-- Create a sample delivery slot
INSERT INTO delivery_slots (
  delivery_date,
  order_deadline,
  egg_limit,
  eggs_reserved,
  zone_description,
  active
) VALUES (
  NOW() + INTERVAL '7 days',
  NOW() + INTERVAL '3 days',
  150,
  0,
  'Warszawa - Centrum',
  true
);

INSERT INTO delivery_slots (
  delivery_date,
  order_deadline,
  egg_limit,
  eggs_reserved,
  zone_description,
  active
) VALUES (
  NOW() + INTERVAL '14 days',
  NOW() + INTERVAL '10 days',
  200,
  0,
  'Warszawa - Powiśle',
  true
);

-- ============================================
-- 6. VIEWS (Optional - for easier querying)
-- ============================================

-- View: Available slots with remaining eggs
DROP VIEW IF EXISTS available_slots_with_eggs CASCADE;
CREATE VIEW available_slots_with_eggs AS
SELECT 
  id,
  delivery_date,
  order_deadline,
  egg_limit,
  eggs_reserved,
  (egg_limit - eggs_reserved) as eggs_available,
  zone_description,
  active,
  created_at,
  updated_at
FROM delivery_slots
WHERE active = true 
  AND order_deadline > now()
  AND (egg_limit - eggs_reserved) > 0;

-- View: Orders summary
DROP VIEW IF EXISTS orders_summary CASCADE;
CREATE VIEW orders_summary AS
SELECT 
  o.id,
  o.slot_id,
  d.delivery_date,
  d.zone_description,
  o.customer_name,
  o.email,
  o.phone,
  o.address,
  o.eggs_quantity,
  o.status,
  o.created_at,
  o.updated_at
FROM orders o
JOIN delivery_slots d ON o.slot_id = d.id;

-- ============================================
-- 7. HANDY QUERIES
-- ============================================

-- Check available slots
-- SELECT * FROM available_slots_with_eggs;

-- Check all orders for a delivery slot
-- SELECT * FROM orders_summary WHERE slot_id = 'YOUR_SLOT_ID';

-- Get total eggs reserved per slot
-- SELECT slot_id, SUM(eggs_quantity) as total_reserved FROM orders GROUP BY slot_id;

-- Get orders by status
-- SELECT * FROM orders_summary WHERE status = 'new' ORDER BY created_at DESC;

-- Get all orders from last 7 days
-- SELECT * FROM orders_summary WHERE created_at >= NOW() - INTERVAL '7 days' ORDER BY created_at DESC;

-- Check slot capacity
-- SELECT 
--   id,
--   delivery_date,
--   zone_description,
--   egg_limit,
--   eggs_reserved,
--   (egg_limit - eggs_reserved) as available,
--   ROUND(100.0 * eggs_reserved / egg_limit, 2) as reservation_percent
-- FROM delivery_slots
-- WHERE active = true
-- ORDER BY delivery_date ASC;
