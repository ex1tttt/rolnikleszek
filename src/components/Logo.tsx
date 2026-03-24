'use client'

export default function Logo() {
  const handleLogoClick = () => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
    // Reload page after scroll
    setTimeout(() => {
      window.location.reload()
    }, 300)
  }

  return (
    <button
      onClick={handleLogoClick}
      className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
      title="Powróć do góry i odśwież"
    >
      <div className="text-5xl">🌾</div>
      <div>
        <h1 className="text-3xl font-bold text-[#2d5016]">Rolnik Leszek</h1>
        <p className="text-xs text-[#8b6f47] font-medium">NATURALNE PRODUKTY OD GOSPODARSTWA</p>
      </div>
    </button>
  )
}
