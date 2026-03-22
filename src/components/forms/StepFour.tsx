'use client'

import { useFormContext } from 'react-hook-form'
import { DeliverySlot } from '@/types'
import { formatDate } from '@/lib/utils'

interface StepFourProps {
  selectedSlot: DeliverySlot
}

export default function StepFour({ selectedSlot }: StepFourProps) {
  const { watch } = useFormContext()

  const customerName = watch('customer_name')
  const email = watch('email')
  const address = watch('address')
  const eggQuantity = watch('eggs_quantity')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-[#2d5016] mb-2">Krok 4: Podsumowanie</h2>
        <p className="text-[#8b6f47]">Sprawdź czy wszystko jest prawidłowo wypełnione</p>
      </div>

      <div className="bg-[#faf8f3] border-2 border-[#d4c4b8] p-6 rounded-xl space-y-5">
        <div className="border-b border-[#d4c4b8] pb-4 last:border-b-0 last:pb-0">
          <p className="text-xs font-bold text-[#8b6f47] uppercase tracking-wide">Data dostawy</p>
          <p className="font-bold text-lg text-[#2d5016] mt-2">{formatDate(selectedSlot.delivery_date)}</p>
        </div>

        <div className="border-b border-[#d4c4b8] pb-4 last:border-b-0 last:pb-0">
          <p className="text-xs font-bold text-[#8b6f47] uppercase tracking-wide">Ilość jajek</p>
          <p className="font-bold text-lg text-[#2d5016] mt-2">{eggQuantity} szt.</p>
        </div>

        <div className="border-b border-[#d4c4b8] pb-4 last:border-b-0 last:pb-0">
          <p className="text-xs font-bold text-[#8b6f47] uppercase tracking-wide">Imię i nazwisko</p>
          <p className="font-bold text-[#2c2c2c] mt-2">{customerName}</p>
        </div>

        <div className="border-b border-[#d4c4b8] pb-4 last:border-b-0 last:pb-0">
          <p className="text-xs font-bold text-[#8b6f47] uppercase tracking-wide">Email</p>
          <p className="font-bold text-[#2c2c2c] mt-2">{email}</p>
        </div>

        <div>
          <p className="text-xs font-bold text-[#8b6f47] uppercase tracking-wide">Adres dostawy</p>
          <p className="font-bold text-[#2c2c2c] whitespace-pre-line mt-2">{address}</p>
        </div>
      </div>

      <div className="bg-[#d4e5c4] border-2 border-[#2d5016] p-6 rounded-xl">
        <p className="font-bold text-[#2d5016] mb-3 flex items-center gap-2 text-lg">
          <span>✓</span> Co dalej?
        </p>
        <ul className="space-y-2 text-[#2c2c2c]">
          <li className="flex gap-3">
            <span className="text-[#2d5016] font-bold">→</span>
            <span>Potwierdzenie zamówienia na email</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#2d5016] font-bold">→</span>
            <span>Kontakt telefoniczny z potwierdzeniem dostawy</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#2d5016] font-bold">→</span>
            <span>Dostawa w wybranym terminie</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
