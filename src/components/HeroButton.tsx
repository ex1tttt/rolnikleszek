'use client'

export default function HeroButton() {
  const handleClick = () => {
    const orderSection = document.getElementById('order-section')
    if (orderSection) {
      orderSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <button
      onClick={handleClick}
      className="bg-[#8b6f47] hover:bg-[#a68358] text-white font-bold py-4 px-8 rounded-xl text-lg transition-all transform hover:scale-105 shadow-lg"
    >
      Złóż zamówienie teraz
    </button>
  )
}
