'use client'

import { useFormContext } from 'react-hook-form'
import { DeliverySlot } from '@/types'
import { formatDate, calculateAvailableEggs } from '@/lib/utils'

interface StepOneProps {
  deliverySlots: DeliverySlot[]
  selectedSlot?: DeliverySlot
}

export default function StepOne({
  deliverySlots,
  selectedSlot,
}: StepOneProps) {
  const { register, formState: { errors }, watch } = useFormContext()
  const selectedSlotId = watch('slot_id')

  const isDeadlinePassed = (deadline: string): boolean => {
    return new Date(deadline) < new Date()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-[#2d5016] mb-2">Krok 1: Wybierz termin</h2>
        <p className="text-[#8b6f47]">Dostępne terminy dostawy jajek</p>
      </div>

      <div className="space-y-3">
        {deliverySlots.map((slot) => {
          const available = calculateAvailableEggs(
            slot.egg_limit,
            slot.eggs_reserved
          )
          const isAvailable = available > 0
          const passed = isDeadlinePassed(slot.order_deadline)
          const isLowStock = available > 0 && available <= 10

          return (
            <label 
              key={slot.id} 
              className={`flex items-start gap-4 p-5 border-2 rounded-xl cursor-pointer transition ${
                !isAvailable || passed
                  ? 'opacity-50 bg-[#eae4dd] border-[#d4c4b8] cursor-not-allowed'
                  : 'border-[#d4c4b8] bg-white hover:border-[#2d5016] hover:shadow-md'
              }`}
            >
              <input
                type="radio"
                value={slot.id}
                {...register('slot_id')}
                disabled={!isAvailable || passed}
                className="mt-2"
              />
              <div className="flex-1">
                <p className="font-bold text-[#2d5016] text-lg">
                  {formatDate(slot.delivery_date)}
                </p>
                <p className="text-sm text-[#8b6f47] mt-1">
                  Deadline opłaty: {new Date(slot.order_deadline).toLocaleTimeString('pl-PL', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                {slot.zone_description && (
                  <p className="text-sm text-[#8b6f47] mt-2">📍 {slot.zone_description}</p>
                )}
                
                <div className="mt-3">
                  {passed ? (
                    <p className="text-sm font-bold text-[#c62e1e]">❌ Deadline minął</p>
                  ) : isLowStock ? (
                    <p className="text-sm font-bold text-[#a67c3a]">⚠️ Zostało tylko {available} jajek!</p>
                  ) : (
                    <p className="text-sm font-bold text-[#2d5016]">✓ Dostępne: {available} jajek</p>
                  )}
                </div>
              </div>
            </label>
          )
        })}
      </div>

      {errors.slot_id && typeof errors.slot_id === 'object' && (
        <p className="text-[#c62e1e] text-sm font-bold">❌ {(errors.slot_id as any)?.message || 'Błąd'}</p>
      )}

      {deliverySlots.length === 0 && (
        <div className="bg-[#eae4dd] border-l-4 border-[#a67c3a] p-6 rounded-lg">
          <p className="text-[#2d5016] font-bold mb-2">ℹ️ Brak dostępnych terminów</p>
          <p className="text-[#8b6f47]">
            Zadzwoń na numer <strong>607 80 80 89</strong>
          </p>
        </div>
      )}
    </div>
  )
}
