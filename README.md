# Rolnik Leszek - Wdrożenie

Kompletna aplikacja do zamawiania jajek z panelem administracyjnym.

## Stacke Techniczny

- **Frontend**: Next.js 14+, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Baza danych**: Supabase (PostgreSQL)
- **Email**: SMTP (Gmail, SendGrid, etc.)
- **Hosting**: Vercel

## Wymagania

- Node.js 18+
- npm/yarn/pnpm
- Konto Supabase
- Konto SMTP (Gmail, SendGrid)
- Konto Vercel (opcjonalnie)

## Instalacja

### 1. Klonowanie i setup

```bash
npm install
```

### 2. Skonfigurowanie Supabase

Przejdź do https://supabase.com i utwórz nowy projekt.

#### SQL Schema

Uruchom poniższe komendy w SQL Editor w Supabase. Pełny SQL znajdziesz w `DATABASE.md`:

```sql
-- Tabela terminów dostawy
CREATE TABLE delivery_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_date TIMESTAMP NOT NULL,
  order_deadline TIMESTAMP NOT NULL,
  egg_limit INTEGER NOT NULL,
  eggs_reserved INTEGER DEFAULT 0,
  zone_description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Tabela zamówień
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id UUID NOT NULL REFERENCES delivery_slots(id),
  customer_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  notes TEXT,
  eggs_quantity INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Indeksy
CREATE INDEX idx_delivery_slots_active ON delivery_slots(active);
CREATE INDEX idx_delivery_slots_deadline ON delivery_slots(order_deadline);
CREATE INDEX idx_orders_slot_id ON orders(slot_id);
CREATE INDEX idx_orders_status ON orders(status);
```

### 3. Zmienne Środowiskowe

Edytuj `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# SMTP (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=twoj@gmail.com
SMTP_PASSWORD=app_password_gmail

# Email
NEXT_PUBLIC_ADMIN_EMAIL=rolnikleszek@gmail.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### Konfiguracja Gmail SMTP:
1. Włącz 2FA w Google Account
2. Przejdź do https://myaccount.google.com/apppasswords
3. Wygeneruj hasło dla "Mail" i "Windows"
4. Użyj tego hasła jako `SMTP_PASSWORD`

### 4. Uruchomienie lokalnie

```bash
npm run dev
```

Aplikacja będzie dostępna na http://localhost:3000

## Struktura Projektu

```
src/
├── app/
│   ├── page.tsx              # Strona główna
│   ├── admin/
│   │   └── page.tsx          # Panel administracyjny
│   ├── api/
│   │   ├── orders/           # API do zamówień
│   │   └── delivery-slots/   # API do terminów dostaw
│   └── layout.tsx
├── components/
│   ├── forms/                # Komponenty formularza wieloetapowego
│   │   ├── OrderForm.tsx
│   │   ├── StepOne.tsx
│   │   ├── StepTwo.tsx
│   │   ├── StepThree.tsx
│   │   ├── StepFour.tsx
│   │   └── StepFive.tsx
│   └── admin/                # Komponenty panelu admina
│       ├── DeliverySlotManager.tsx
│       └── OrderList.tsx
├── lib/
│   ├── supabase.ts           # Klient Supabase
│   ├── supabase-server.ts    # Klient Supabase (server)
│   ├── utils.ts              # Utility functions
│   └── email.ts              # Funkcje email
├── types/
│   └── index.ts              # TypeScript typy
```

## Funkcjonalności

### Dla Klientów
- ✅ Strona główna z informacjami
- ✅ Formularz wieloetapowy (5 kroków)
- ✅ Walidacja front-end i back-end
- ✅ Potwierdzenie email
- ✅ Responsywny design

### Dla Administratora
- ✅ Panel administracyjny `/admin`
- ✅ Zarządzanie terminami dostawy
- ✅ Podgląd obłożenia
- ✅ Lista zamówień z filtrowaniem
- ✅ Status zamówień

## API Endpoints

### GET /api/delivery-slots
Pobierz dostępne terminy dostawy.

### POST /api/delivery-slots
Utwórz nowy termin dostawy.

### POST /api/orders
Utwórz nowe zamówienie.

### GET /api/orders
Pobierz listę zamówień (filtrowanie po slot_id).

## Wdrażanie na Vercel

### 1. Push do Git

```bash
git add .
git commit -m "Initial commit: Rolnik Leszek"
git push origin main
```

### 2. Vercel Deployment

1. Przejdź do https://vercel.com
2. Zaloguj się / zarejestruj
3. Kliknij "New Project"
4. Wybierz swoje repo z GitHub
5. Kliknij "Deploy"

### 3. Zmienne Środowiskowe w Vercel

W panelu projektu, przejdź do Settings → Environment Variables i dodaj:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASSWORD=...
NEXT_PUBLIC_ADMIN_EMAIL=...
NEXT_PUBLIC_SITE_URL=https://twoja-domena.vercel.app
```

## Bezpieczeństwo

⚠️ Panel administracyjny (`/admin`) jest bez autentykacji! 

Aby dodać ochronę, wdrożyć:
- Supabase Auth
- NextAuth.js
- Custom middleware

Przykład z Supabase Auth można znaleźć w docs.

## Troubleshooting

### Email się nie wysyła
- Sprawdź zmienne SMTP w `.env.local`
- Dla Gmail: upewnij się że hasło to App Password, nie zwykłe hasło
- Sprawdź logs w Vercel

### Termin dostawy nie pojawia się
- Sprawdź czy data jest w przyszłości
- Sprawdź czy deadline jest większy niż obecna godzina

### Błędy Supabase
- Sprawdź połączenie URL i klucz
- Upewnij się że tabele zostały utworzone
- Sprawdź Row Level Security (RLS) w Supabase

## Licencja

MIT

## Kontakt

- Rolnik Leszek
- 📞 607 80 80 89
- ✉️ rolnikleszek@gmail.com

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
