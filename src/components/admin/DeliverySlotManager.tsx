'use client'

import { useState, useEffect } from 'react'
import { DeliverySlot } from '@/types'

export default function DeliverySlotManager() {
  const [slots, setSlots] = useState<DeliverySlot[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    delivery_date: '',
    order_deadline: '',
    egg_limit: 100,
    zone_description: '',
    active: true,
  })

  useEffect(() => {
    fetchSlots()
  }, [])

  const fetchSlots = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/delivery-slots')
      if (!response.ok) throw new Error('Błąd przy pobieraniu terminów')
      const data = await response.json()
      setSlots(data)
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Błąd podczas pobierania terminów')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : name === 'egg_limit' 
          ? parseInt(value) 
          : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId 
        ? `/api/delivery-slots/${editingId}` 
        : '/api/delivery-slots'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Błąd przy zapisywaniu terminu')
      }

      setFormData({
        delivery_date: '',
        order_deadline: '',
        egg_limit: 100,
        zone_description: '',
        active: true,
      })
      setEditingId(null)
      setSuccess(editingId ? 'Termin zaktualizowany' : 'Termin dodany pomyślnie')

      await fetchSlots()
    } catch (err: any) {
      setError(err.message || 'Błąd przy zapisywaniu terminu')
    }
  }

  const handleEdit = (slot: DeliverySlot) => {
    setFormData({
      delivery_date: slot.delivery_date.split('T')[0],
      order_deadline: slot.order_deadline.slice(0, 16),
      egg_limit: slot.egg_limit,
      zone_description: slot.zone_description || '',
      active: slot.active,
    })
    setEditingId(slot.id)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Czy na pewno chcesz usunąć ten termin?')) return

    try {
      const response = await fetch(`/api/delivery-slots/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Błąd przy usuwaniu terminu')
      }

      setSuccess('Termin usunięty pomyślnie')
      await fetchSlots()
    } catch (err: any) {
      setError(err.message || 'Błąd przy usuwaniu terminu')
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-[#2d5016] mb-6">Zarządzanie terminami dostawy</h2>
        
        {error && (
          <div className="mb-4 p-4 bg-[#fce4ec] border-2 border-[#c62e1e] text-[#c62e1e] rounded-lg font-bold">
            ❌ {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-[#d4e5c4] border-2 border-[#2d5016] text-[#2d5016] rounded-lg font-bold">
            ✓ {success}
          </div>
        )}
        
        {/* Add/Edit Slot Form */}
        <form onSubmit={handleSubmit} className="bg-[#faf8f3] border-2 border-[#d4c4b8] p-8 rounded-xl mb-10 space-y-6">
          <h3 className="text-lg font-bold text-[#2d5016]">
            {editingId ? '✏️ Edytuj termin' : '➕ Dodaj nowy termin'}
          </h3>
          
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-bold text-[#2d5016] mb-2">Data dostawy *</label>
              <input
                type="date"
                name="delivery_date"
                value={formData.delivery_date}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-[#d4c4b8] rounded-lg focus:ring-2 focus:ring-[#2d5016] focus:border-[#2d5016] focus:outline-none text-[#2c2c2c]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#2d5016] mb-2">Deadline zamówień *</label>
              <input
                type="datetime-local"
                name="order_deadline"
                value={formData.order_deadline}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-[#d4c4b8] rounded-lg focus:ring-2 focus:ring-[#2d5016] focus:border-[#2d5016] focus:outline-none text-[#2c2c2c]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-bold text-[#2d5016] mb-2">Limit jajek *</label>
              <input
                type="number"
                name="egg_limit"
                value={formData.egg_limit}
                onChange={handleInputChange}
                min="1"
                required
                className="w-full px-4 py-3 border-2 border-[#d4c4b8] rounded-lg focus:ring-2 focus:ring-[#2d5016] focus:border-[#2d5016] focus:outline-none text-[#2c2c2c]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#2d5016] mb-2">Opis strefy dostawy</label>
              <input
                type="text"
                name="zone_description"
                value={formData.zone_description}
                onChange={handleInputChange}
                placeholder="np. Warszawa, Piaseczno"
                className="w-full px-4 py-3 border-2 border-[#d4c4b8] rounded-lg focus:ring-2 focus:ring-[#2d5016] focus:border-[#2d5016] focus:outline-none text-[#2c2c2c]"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 p-3 border-2 border-[#d4c4b8] rounded-lg cursor-pointer hover:bg-[#f5f3ef]">
            <input
              type="checkbox"
              id="active"
              name="active"
              checked={formData.active}
              onChange={handleInputChange}
              className="w-4 h-4"
            />
            <span className="text-sm font-bold text-[#2d5016]">
              Termin aktywny
            </span>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-[#2d5016] text-white py-3 rounded-lg hover:bg-[#4a7c2e] font-bold transition"
            >
              {editingId ? 'Zaktualizuj' : 'Dodaj termin'}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null)
                  setFormData({
                    delivery_date: '',
                    order_deadline: '',
                    egg_limit: 100,
                    zone_description: '',
                    active: true,
                  })
                }}
                className="flex-1 bg-[#8b6f47] text-white py-3 rounded-lg hover:bg-[#6d5a38] font-bold transition"
              >
                Anuluj
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Slots List */}
      <div>
        <h3 className="text-xl font-bold text-[#2d5016] mb-6">Istniejące terminy</h3>
        
        {isLoading ? (
          <p className="text-[#8b6f47]">⏳ Ładowanie...</p>
        ) : slots.length === 0 ? (
          <p className="text-[#8b6f47]">Brak terminów dostawy</p>
        ) : (
          <div className="space-y-4">
            {slots.map((slot) => (
              <div 
                key={slot.id} 
                className={`border-2 rounded-xl p-6 transition ${
                  !slot.active ? 'bg-[#eae4dd] border-[#d4c4b8]' : 'bg-white border-[#d4c4b8] hover:border-[#2d5016]'
                }`}
              >
                <div className="flex flex-col gap-4 mb-5">
                  <div>
                    <p className="text-xs font-bold text-[#8b6f47] uppercase tracking-wide">Data dostawy</p>
                    <p className="font-bold text-[#2d5016] mt-2">{new Date(slot.delivery_date).toLocaleDateString('pl-PL')}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs font-bold text-[#8b6f47] uppercase tracking-wide">Limit / Zarezerwowane</p>
                    <p className="font-bold text-[#2d5016] mt-2">{slot.egg_limit} / {slot.eggs_reserved}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs font-bold text-[#8b6f47] uppercase tracking-wide">Dostępne</p>
                    <p className={`font-bold mt-2 ${
                      slot.egg_limit - slot.eggs_reserved > 0
                        ? 'text-[#2d5016]'
                        : 'text-[#c62e1e]'
                    }`}>
                      {slot.egg_limit - slot.eggs_reserved} szt.
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-[#8b6f47] uppercase tracking-wide">Status</p>
                    <p className={`font-bold mt-2 ${slot.active ? 'text-[#2d5016]' : 'text-[#c62e1e]'}`}>
                      {slot.active ? '✓ Aktywny' : '✗ Nieaktywny'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-[#8b6f47] uppercase tracking-wide">Deadline</p>
                    <p className="font-bold text-[#2c2c2c] text-sm mt-2">{new Date(slot.order_deadline).toLocaleString('pl-PL')}</p>
                  </div>
                </div>

                {slot.zone_description && (
                  <p className="text-sm text-[#8b6f47] mb-5 flex items-center gap-2 font-medium">
                    <span>📍</span> {slot.zone_description}
                  </p>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(slot)}
                    className="px-4 py-2 bg-[#2d5016] text-white rounded-lg hover:bg-[#4a7c2e] text-sm font-bold transition"
                  >
                    Edytuj
                  </button>
                  <button
                    onClick={() => handleDelete(slot.id)}
                    className="px-4 py-2 bg-[#c62e1e] text-white rounded-lg hover:bg-[#a02818] text-sm font-bold transition"
                  >
                    Usuń
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
