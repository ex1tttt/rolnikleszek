# Baza Danych - SQL Schema

**📋 PEŁNY KOD SQL**: Czytaj plik `supabase-full-schema.sql` — skopiuj całą zawartość i uruchom w SQL Editor Supabase Console.

Poniżej uproszczona dokumentacja struktury bazy.

## Tabela: delivery_slots (Terminy dostawy)

```sql
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

CREATE INDEX idx_delivery_slots_active ON delivery_slots(active);
CREATE INDEX idx_delivery_slots_delivery_date ON delivery_slots(delivery_date DESC);
CREATE INDEX idx_delivery_slots_deadline ON delivery_slots(order_deadline DESC);

-- Trigger do aktualizacji updated_at
CREATE OR REPLACE TRIGGER update_delivery_slots_updated_at
BEFORE UPDATE ON delivery_slots
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
```

## Tabela: orders (Zamówienia)

```sql
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

CREATE INDEX idx_orders_slot_id ON orders(slot_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_email ON orders(email);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Trigger do aktualizacji updated_at
CREATE OR REPLACE TRIGGER update_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
```

## Helper Function

```sql
-- Funkcja do automatycznego aktualizowania updated_at
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## Dokumentacja Kolumn

### delivery_slots
| Kolumna | Typ | Opis |
|---------|-----|------|
| id | UUID | Unikalny identyfikator |
| delivery_date | TIMESTAMP | Data dostawy |
| order_deadline | TIMESTAMP | Deadline na złożenie zamówienia |
| egg_limit | INTEGER | Maksymalna ilość jajek |
| eggs_reserved | INTEGER | Ilość zarezerwowanych jajek |
| zone_description | TEXT | Opis strefy dostawy (opcjonalnie) |
| active | BOOLEAN | Czy termin jest aktywny |
| created_at | TIMESTAMP | Data utworzenia |
| updated_at | TIMESTAMP | Ostatnia modyfikacja |

### orders
| Kolumna | Typ | Opis |
|---------|-----|------|
| id | UUID | Unikalny identyfikator |
| slot_id | UUID | Referencja do delivery_slots |
| customer_name | VARCHAR | Imię i nazwisko klienta |
| phone | VARCHAR | Telefon kontaktowy |
| email | VARCHAR | Email do potwierdzenia |
| address | TEXT | Pełny adres dostawy |
| notes | TEXT | Dodatkowe uwagi (opcjonalnie) |
| eggs_quantity | INTEGER | Ilość zamówionych jajek |
| status | VARCHAR | Status: new/confirmed/completed/cancelled |
| created_at | TIMESTAMP | Data złożenia zamówienia |
| updated_at | TIMESTAMP | Ostatnia modyfikacja |

## Włączenie RLS (Row Level Security)

Dla publicznego dostępu (bez autentykacji):

```sql
-- delivery_slots - publiczny dostęp do odczytu
ALTER TABLE delivery_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON delivery_slots
  FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON delivery_slots
  FOR INSERT
  WITH CHECK (true);  -- Zmień na wersję z autentykacją!

-- orders - publiczny dostęp do zapisu
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable insert for all users" ON orders
  FOR INSERT
  USING (true);

CREATE POLICY "Enable read access for admin" ON orders
  FOR SELECT
  USING (true);  -- Zmień na wersję z autentykacją!
```

⚠️ **WAŻNE**: Powyższe polityki RLS są dla development. W produkcji dodaj autentykację!

## Test Danych

```sql
-- Wstaw przykładowy termin dostawy
INSERT INTO delivery_slots (
  delivery_date,
  order_deadline,
  egg_limit,
  zone_description
) VALUES (
  NOW() + INTERVAL '7 days',
  NOW() + INTERVAL '3 days',
  100,
  'Warszawa'
);

-- Sprawdź dane
SELECT * FROM delivery_slots;
SELECT * FROM orders;
```
