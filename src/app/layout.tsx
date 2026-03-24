import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Rolnik Leszek - Świeże jajka i miód',
  description: 'Naturalne jedzenie prosto z gospodarstwa. Świeże jajka od szczęśliwych kur i prawdziwy miód bez chemii.',
  keywords: 'jajka, miód, produkty naturalne, gospodartwo, Krzydlina Wielka',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl">
      <head>
        <Script
          src="https://www.google.com/recaptcha/api.js"
          strategy="lazyOnload"
          async
          defer
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
