'use client'

import { useState, useEffect } from 'react'
import { Order } from '@/types'

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterEmail, setFilterEmail] = useState<string>('')
  const [changedOrderId, setChangedOrderId] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [filterStatus, filterEmail])

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      let url = '/api/orders'
      const params = new URLSearchParams()
      
      if (filterStatus !== 'all') params.append('status', filterStatus)
      if (filterEmail) params.append('email', filterEmail)
      
      if (params.toString()) {
        url += '?' + params.toString()
      }

      const response = await fetch(url)
      if (!response.ok) throw new Error('Błąd przy pobieraniu zamówień')
      
      const data = await response.json()
      setOrders(data || [])
    } catch (err: any) {
      setError(err.message || 'Błąd podczas pobierania zamówień')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Błąd przy zmianie statusu')
      }

      setChangedOrderId(orderId)
      setTimeout(() => setChangedOrderId(null), 1000)
      
      await fetchOrders()
    } catch (err: any) {
      setError(err.message || 'Błąd przy zmianie statusu')
    }
  }

  const handleDelete = async (orderId: string) => {
    if (!confirm('Czy pewnie chcesz usunąć to zamówienie?')) return

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Błąd przy usuwaniu zamówienia')
      }

      await fetchOrders()
    } catch (err: any) {
      setError(err.message || 'Błąd przy usuwaniu zamówienia')
    }
  }

  const handleExportCSV = async () => {
    try {
      const params = new URLSearchParams({ format: 'csv' })
      if (filterStatus !== 'all') params.append('status', filterStatus)
      if (filterEmail) params.append('email', filterEmail)

      const url = `/api/orders?${params.toString()}`
      const response = await fetch(url)
      const csv = await response.text()
      
      const blob = new Blob([csv], { type: 'text/csv' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `zamowienia_${new Date().toLocaleDateString('pl-PL')}.csv`
      link.click()
    } catch (err) {
      setError('Błąd przy eksporcie CSV')
    }
  }

  const statusColors: Record<string, string> = {
    new: 'bg-[#d4e5c4] text-[#2d5016]',
    confirmed: 'bg-[#d4e5c4] text-[#2d5016]',
    completed: 'bg-[#eae4dd] text-[#8b6f47]',
    cancelled: 'bg-[#fce4ec] text-[#c62e1e]',
  }

  const statusLabels: Record<string, string> = {
    new: 'Nowe',
    confirmed: 'Potwierdzone',
    completed: 'Zrealizowane',
    cancelled: 'Anulowane',
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-[#2d5016] mb-6">Zamówienia</h2>

        {error && (
          <div className="mb-4 p-4 bg-[#fce4ec] border-2 border-[#c62e1e] text-[#c62e1e] rounded-lg font-bold">
            ❌ {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-[#faf8f3] border-2 border-[#d4c4b8] p-6 rounded-xl mb-8 space-y-5">
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-bold text-[#2d5016] mb-2">Filtr statusu</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#d4c4b8] rounded-lg focus:ring-2 focus:ring-[#2d5016] focus:border-[#2d5016] focus:outline-none text-[#2c2c2c]"
              >
                <option value="all">Wszystkie</option>
                <option value="new">Nowe</option>
                <option value="confirmed">Potwierdzone</option>
                <option value="completed">Zrealizowane</option>
                <option value="cancelled">Anulowane</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#2d5016] mb-2">Szukaj po emailu</label>
              <input
                type="text"
                value={filterEmail}
                onChange={(e) => setFilterEmail(e.target.value)}
                placeholder="np. jan@example.com"
                className="w-full px-4 py-3 border-2 border-[#d4c4b8] rounded-lg focus:ring-2 focus:ring-[#2d5016] focus:border-[#2d5016] focus:outline-none text-[#2c2c2c]"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 bg-[#2d5016] text-white rounded-lg hover:bg-[#4a7c2e] font-bold text-sm transition"
            >
              📥 Eksport CSV
            </button>
            
            <button
              onClick={() => {
                setFilterStatus('all')
                setFilterEmail('')
              }}
              className="px-4 py-2.5 bg-[#8b6f47] text-white rounded-lg hover:bg-[#6d5a38] font-bold text-sm transition"
            >
              Zresetuj filtry
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <p className="text-[#8b6f47]">⏳ Ładowanie...</p>
      ) : orders.length === 0 ? (
        <p className="text-[#8b6f47]">Brak zamówień</p>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-[#8b6f47] font-bold">
            📊 Znaleziono <strong className="text-[#2d5016]">{orders.length}</strong> zamówień
          </p>

          {orders.map((order) => (
            <div 
              key={order.id} 
              className={`border-2 rounded-xl p-6 transition ${
                changedOrderId === order.id 
                  ? 'bg-[#d4e5c4] border-[#2d5016]' 
                  : 'bg-white border-[#d4c4b8] hover:border-[#2d5016]'
              }`}
            >
              <div className="flex flex-col gap-6 mb-5">
                <div>
                  <p className="text-xs font-bold text-[#8b6f47] uppercase tracking-wide">Klient</p>
                  <p className="font-bold text-[#2d5016] mt-2">{order.customer_name}</p>
                  <p className="text-sm text-[#8b6f47] mt-1">{order.email}</p>
                  <p className="text-sm text-[#8b6f47]">{order.phone}</p>
                </div>

                <div>
                  <p className="text-xs font-bold text-[#8b6f47] uppercase tracking-wide">Ilość jajek</p>
                  <p className="font-bold text-lg text-[#2d5016] mt-2">{order.eggs_quantity} szt.</p>
                  <p className="text-sm text-[#8b6f47] mt-2">
                    Zamówieno: {new Date(order.created_at).toLocaleDateString('pl-PL')}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold text-[#8b6f47] uppercase tracking-wide mb-2">Status</p>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg font-bold text-sm border-0 cursor-pointer ${
                      statusColors[order.status]
                    }`}
                  >
                    {['new', 'confirmed', 'completed', 'cancelled'].map((status) => (
                      <option key={status} value={status}>
                        {statusLabels[status]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-5 bg-[#faf8f3] border-2 border-[#d4c4b8] p-4 rounded-lg">
                <p className="text-xs font-bold text-[#8b6f47] uppercase tracking-wide mb-2">Adres dostawy</p>
                <p className="text-sm text-[#2c2c2c] whitespace-pre-line font-medium">{order.address}</p>
              </div>

              {order.notes && (
                <div className="mb-5 p-4 bg-[#fef3c7] border-2 border-[#a67c3a] rounded-lg">
                  <p className="text-sm font-bold text-[#2d5016] mb-2">📝 Uwagi:</p>
                  <p className="text-sm text-[#8b6f47]">{order.notes}</p>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(order.id)}
                  className="px-4 py-2 bg-[#c62e1e] text-white rounded-lg hover:bg-[#a02818] text-sm font-bold transition"
                >
                  ✗ Usuń
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
