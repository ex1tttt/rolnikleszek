'use client'

import { useState, useEffect } from 'react'
import DeliverySlotManager from '@/components/admin/DeliverySlotManager'
import OrderList from '@/components/admin/OrderList'

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // Sprawdzenie czy już jest zalogowany
  useEffect(() => {
    const auth = localStorage.getItem('admin_auth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Simple password check (zmień to na coś bardziej bezpiecznego!)
    const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
    
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('admin_auth', 'true')
      setIsAuthenticated(true)
      setPassword('')
    } else {
      setError('Nieprawidłowe hasło')
      setPassword('')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_auth')
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#d4e5c4] to-[#eae4dd] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full border-2 border-[#d4c4b8]">
          <h1 className="text-3xl font-bold text-[#2d5016] mb-2 text-center">🔒 Panel Admin</h1>
          <p className="text-[#8b6f47] text-center text-sm mb-8 font-medium">Rolnik Leszek - Zarządzanie zamówieniami</p>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-[#2d5016] mb-2">
                Hasło administratora
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Wpisz hasło"
                className="w-full px-4 py-3 border-2 border-[#d4c4b8] rounded-lg focus:ring-2 focus:ring-[#2d5016] focus:border-[#2d5016] focus:outline-none text-[#2c2c2c]"
              />
            </div>

            {error && (
              <div className="p-3 bg-[#fce4ec] border-2 border-[#c62e1e] text-[#c62e1e] rounded-lg font-bold text-sm">
                ❌ {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#2d5016] hover:bg-[#4a7c2e] text-white font-bold py-3 px-4 rounded-lg transition text-lg"
            >
              Zaloguj
            </button>
          </form>

          <p className="text-xs text-[#8b6f47] text-center mt-8">
            ⚠️ Hasło administratora jest przechowywane w zmiennych środowiskowych.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#faf8f3]">
      {/* Header */}
      <header className="bg-white border-b-2 border-[#d4c4b8] sticky top-0 z-10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#2d5016]">🔧 Panel Admin</h1>
            <p className="text-[#8b6f47] text-sm mt-1 font-medium">Rolnik Leszek - Zarządzanie</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2.5 bg-[#c62e1e] text-white rounded-lg hover:bg-[#a02818] font-bold transition"
          >
            Wyloguj
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col gap-10">
          <div>
            <DeliverySlotManager />
          </div>

          <div>
            <OrderList />
          </div>
        </div>
      </div>
    </div>
  )
}
