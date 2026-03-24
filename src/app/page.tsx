import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import OrderForm from '@/components/forms/OrderForm'
import Logo from '@/components/Logo'

export default async function Home() {
  const supabase = await createServerSupabaseClient()

  // Fetch active delivery slots
  const { data: slots } = await supabase
    .from('delivery_slots')
    .select('*')
    .eq('active', true)
    .order('delivery_date', { ascending: true })

  const availableSlots = (slots || []).filter((slot) => {
    const deadline = new Date(slot.order_deadline)
    const now = new Date()
    return deadline > now && slot.eggs_reserved < slot.egg_limit
  })

  return (
    <div className="min-h-screen bg-[#faf8f3]">
      {/* Header */}
      <header className="bg-white border-b border-[#d4c4b8] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo />
          <div className="hidden sm:flex items-center gap-6">
            <a href="tel:607808089" className="text-[#2d5016] font-semibold hover:text-[#8b6f47]">📞 607 80 80 89</a>
          </div>
        </div>
      </header>

      {/* Hero Section - Full Width */}
      <section className="bg-linear-to-br from-[#2d5016] via-[#3d6b1f] to-[#2d5016] text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 text-9xl">🥚</div>
        <div className="absolute bottom-0 left-0 opacity-10 text-9xl">🍯</div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h2 className="text-6xl md:text-7xl font-bold mb-6 leading-tight" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.2)'}}>
              Świeże i naturalne
            </h2>
            <p className="text-xl md:text-2xl text-[#d4e5c4] mb-8 leading-relaxed">
              Prosto z naszego ekologicznego gospodarstwa. Jajka od szczęśliwych kur, naturalny miód i pełna przejrzystość. Bez chemii, bez pośredników.
            </p>
            <a
              href="#order-section"
              className="inline-block bg-[#8b6f47] hover:bg-[#a68358] text-white font-bold py-4 px-8 rounded-xl text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Złóż zamówienie teraz
            </a>
          </div>
        </div>
      </section>

      {/* Three Products - Horizontal Grid */}
      <section className="max-w-7xl mx-auto px-6 -mt-16 relative z-20 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-10 border border-[#d4c4b8] shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-7xl mb-6">🥚</div>
            <h3 className="text-2xl font-bold text-[#2d5016] mb-4">Świeże Jajka</h3>
            <p className="text-[#8b6f47] leading-relaxed mb-6">
              Od kur z wolnego wybiegu, które żyją naturalnie. Bez antybiotyków, bez sztucznych dodatków. Każde jajko to gwarancja świeżości i jakości.
            </p>
            <ul className="space-y-2 text-sm text-[#2c2c2c]">
              <li className="flex gap-2"><span className="text-[#2d5016]">✓</span> Wolne wybiegi</li>
              <li className="flex gap-2"><span className="text-[#2d5016]">✓</span> Bez antybiotyków</li>
              <li className="flex gap-2"><span className="text-[#2d5016]">✓</span> Naturalna dieta</li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-10 border border-[#d4c4b8] shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-7xl mb-6">🍯</div>
            <h3 className="text-2xl font-bold text-[#2d5016] mb-4">Naturalny Miód</h3>
            <p className="text-[#8b6f47] leading-relaxed mb-6">
              Z trzech uli, gdzie pszczoły pracują w naturalnym rytmie. Całkowicie nieprzetworzony, pełen aromatu i właściwości zdrowotnych.
            </p>
            <ul className="space-y-2 text-sm text-[#2c2c2c]">
              <li className="flex gap-2"><span className="text-[#2d5016]">✓</span> Surowy miód</li>
              <li className="flex gap-2"><span className="text-[#2d5016]">✓</span> Pełen aromatów</li>
              <li className="flex gap-2"><span className="text-[#2d5016]">✓</span> Zero dodatków</li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-10 border border-[#d4c4b8] shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-7xl mb-6">♻️</div>
            <h3 className="text-2xl font-bold text-[#2d5016] mb-4">Ekologicznie</h3>
            <p className="text-[#8b6f47] leading-relaxed mb-6">
              Naturalne metody hodowli, pełna przejrzystość, odpowiedzialne podejście do każdego detalu. Bezpośrednio od rolnika.
            </p>
            <ul className="space-y-2 text-sm text-[#2c2c2c]">
              <li className="flex gap-2"><span className="text-[#2d5016]">✓</span> Bez chemii</li>
              <li className="flex gap-2"><span className="text-[#2d5016]">✓</span> Naturalne metody</li>
              <li className="flex gap-2"><span className="text-[#2d5016]">✓</span> Przejrzyste</li>
            </ul>
          </div>
        </div>
      </section>

      {/* About Section - With Two Column Layout */}
      <section className="bg-[#eae4dd] py-20 border-y border-[#d4c4b8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl font-bold text-[#2d5016] mb-8">
                O nas i naszym gospodarstwie
              </h2>
              <div className="space-y-6 text-[#2c2c2c] text-lg leading-relaxed">
                <p>
                  <strong className="text-[#2d5016]">Rolnik Leszek</strong> to małe, rodzinne gospodarstwo, gdzie tradycja spotyka się z odpowiedzialnością. Każdy dzień zaczyna się od opieki nad zwierzętami i ziemią.
                </p>
                <p>
                  Nasze kury mają dostęp do wolnych wybiegów, gdzie mogą żyć naturalnie – dreptać, klować, rozpościerać skrzydła. To długo w warunkach naturalnych – to gwarancja jajek o intensywnym żółtku i autentycznym smaku.
                </p>
                <p>
                  Pszczoły pracują w trzech ulach, bez pospiechu. Miód zbieramy, gdy pszczoły zgromadzą nadwyżkę – nigdy nie przyspieszamy procesu. To czysty dar natury.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl p-10 border-2 border-[#d4c4b8]">
              <h3 className="text-3xl font-bold text-[#2d5016] mb-8">Dlaczego nas wybrać?</h3>
              <div className="space-y-5">
                {[
                  { icon: '🌱', text: 'Naturalne metody – bez antybiotyków i chemii' },
                  { icon: '🚚', text: 'Świeża dostawa – w wybranym przez Ciebie terminie' },
                  { icon: '👨‍🌾', text: 'Bezpośrednio od rolnika – bez pośredników i marż' },
                  { icon: '🔍', text: 'Transparentne – wiesz dokładnie co kupujesz' },
                  { icon: '🏡', text: 'Lokalna produkcja – od rodziny dla rodzin' },
                  { icon: '💚', text: 'Ekologicznie – myślimy o przyszłości' },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start p-4 bg-[#faf8f3] rounded-xl hover:bg-[#f5f3ef] transition-colors">
                    <span className="text-3xl shrink-0">{item.icon}</span>
                    <span className="text-[#2c2c2c] font-semibold">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Order Section - Prominence */}
      {availableSlots.length > 0 ? (
        <section className="py-24" id="order-section">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold text-[#2d5016] mb-6">
                Wyślij nam zamówienie
              </h2>
              <p className="text-xl text-[#8b6f47] max-w-2xl mx-auto">
                Wybierz termin dostawy i ilość produktów. Wyślemy Ci świeże, naturalne towary wprost z naszego gospodarstwa.
              </p>
            </div>
            <div className="bg-white rounded-3xl p-12 border-2 border-[#d4c4b8] shadow-xl">
              <OrderForm deliverySlots={availableSlots} />
            </div>
          </div>
        </section>
      ) : (
        <section className="py-24">
          <div className="max-w-2xl mx-auto px-6">
            <div className="bg-white rounded-3xl p-16 border-3 border-[#2d5016] text-center shadow-2xl">
              <p className="text-4xl font-bold text-[#2c2c2c] mb-4">
                Brak dostępnych terminów
              </p>
              <p className="text-lg text-[#8b6f47] mb-10">
                Skontaktuj się bezpośrednio, aby zarezerwować nasze produkty
              </p>
              <div className="space-y-6">
                <div>
                  <p className="text-5xl font-bold text-[#2d5016] mb-2">📞</p>
                  <p className="text-3xl font-bold text-[#2d5016]">607 80 80 89</p>
                </div>
                <div className="border-t border-[#d4c4b8] pt-6">
                  <p className="text-5xl font-bold text-[#2d5016] mb-2">✉️</p>
                  <p className="text-xl text-[#8b6f47] font-semibold">tkachmaksim2007@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contact / Location Section - Compact & Clear */}
      <section className="bg-[#2d5016] text-white py-16 border-t border-[#d4c4b8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="text-center">
              <p className="text-5xl mb-4">📞</p>
              <p className="text-[#d4e5c4] text-sm font-semibold mb-2">TELEFON</p>
              <a href="tel:607808089" className="text-3xl font-bold hover:text-[#d4e5c4] transition-colors">607 80 80 89</a>
            </div>
            <div className="text-center border-l border-r border-[#4a7c2e] md:border-[#4a7c2e] border-t md:border-t-0 border-b md:border-b-0 py-8 md:py-0">
              <p className="text-5xl mb-4">✉️</p>
              <p className="text-[#d4e5c4] text-sm font-semibold mb-2">EMAIL</p>
              <a href="mailto:tkachmaksim2007@gmail.com" className="text-2xl font-bold hover:text-[#d4e5c4] transition-colors break-all">tkachmaksim2007@gmail.com</a>
            </div>
            <div className="text-center">
              <p className="text-5xl mb-4">📍</p>
              <p className="text-[#d4e5c4] text-sm font-semibold mb-2">LOKALIZACJA</p>
              <p className="text-2xl font-bold">Krzydlina Wielka</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2c2c2c] text-[#d4c4b8] py-12 border-t border-[#d4c4b8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="font-semibold text-lg">Rolnik Leszek</p>
              <p className="text-sm">Naturalne produkty prosto z gospodarstwa © 2026</p>
            </div>
            <p className="text-sm text-center md:text-right">
              Zaufane przez rodziny, wspierane przez naturę
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
