'use client'

export default function StepFive() {
  return (
    <div className="text-center space-y-6 py-12">
      <div className="text-6xl mb-6">✅</div>
      <h2 className="text-4xl font-bold text-[#2d5016]">Dziękujemy!</h2>
      <p className="text-xl text-[#8b6f47]">Twoje zamówienie zostało przyjęte</p>
      
      <div className="bg-[#d4e5c4] border-2 border-[#2d5016] p-8 rounded-xl mt-8 text-left max-w-2xl mx-auto">
        <p className="text-[#2c2c2c] mb-6 leading-relaxed font-medium">
          Wkrótce wyślemy Ci potwierdzenie na email i skontaktujemy się telefonicznie w celu ostatecznego potwierdzenia dostawy.
        </p>
        
        <p className="text-[#2d5016] font-bold mb-4 flex items-center gap-2 text-lg">
          <span>📋</span> Nasze dane kontaktowe
        </p>
        
        <div className="space-y-3 text-[#2c2c2c] border-t-2 border-[#2d5016] pt-4">
          <p className="flex items-center gap-3">
            <span className="text-lg">📞</span>
            <span>Telefon: <span className="font-bold text-[#2d5016]">607 80 80 89</span></span>
          </p>
          <p className="flex items-center gap-3">
            <span className="text-lg">✉️</span>
            <span>Email: <span className="font-bold text-[#2d5016]">rolnikleszek@gmail.com</span></span>
          </p>
          <p className="flex items-center gap-3">
            <span className="text-lg">📍</span>
            <span>Lokalizacja: <span className="font-bold text-[#2d5016]">Krzydlina Wielka</span></span>
          </p>
        </div>
      </div>

      <button
        onClick={() => window.location.href = '/'}
        className="mt-8 px-8 py-3 bg-[#2d5016] text-white rounded-lg hover:bg-[#4a7c2e] font-bold transition text-lg"
      >
        Powrót na stronę główną
      </button>
    </div>
  )
}
