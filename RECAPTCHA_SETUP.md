# Konfiguracja reCAPTCHA v3

Aby włączyć zabezpieczenie antyspamowe na formularzu zamówienia, skonfiguruj reCAPTCHA v3 Google.

## Kroki konfiguracji:

### 1. Utwórz projekt w Google Cloud Console
- Przejdź do [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
- Zaloguj się na swoje konto Google

### 2. Utwórz nowy projekt (jeśli nie istnieje)
- Kliknij "+" aby utworzyć nowy projekt

### 3. Skonfiguruj reCAPTCHA v3
Wypełnij formularz:
- **Label**: Rolnik Leszek (lub dowolna nazwa)
- **reCAPTCHA type**: reCAPTCHA v3
- **Domains**: 
  - `localhost:3000` (dla developmentu)
  - `example.com` (twoja domena produkcyjna)

Kliknij "Create" lub "Submit"

### 4. Skopiuj klucze
- **Site key** (klucz publiczny) → `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- **Secret key** (klucz tajny) → `RECAPTCHA_SECRET_KEY`

### 5. Dodaj zmienne do pliku `.env.local`
```
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=twój_klucz_publiczny
RECAPTCHA_SECRET_KEY=twój_klucz_tajny
```

### 6. Uruchom aplikację
```bash
npm run dev
```

Kapcha będzie automatycznie działać na formularzu bez widocznego dla użytkownika UI (reCAPTCHA v3).

## Uwagi:
- reCAPTCHA v3 nie wymaga interakcji użytkownika
- Zwraca wynik (score) od 0 do 1 (1 = prawie pewnie człowiek, 0 = prawie pewnie bot)
- Aplikacja akceptuje score > 0.5
- Jeśli klucze nie są skonfigurowane, kapcha będzie pominięta (logowanie ostrzeżenia)
