'use client'

import { useFormContext } from 'react-hook-form'
import { DeliverySlot } from '@/types'
import { calculateAvailableEggs } from '@/lib/utils'

interface StepTwoProps {
  selectedSlot: DeliverySlot
}

export default function StepTwo({ selectedSlot }: StepTwoProps) {
  const { register, formState: { errors }, watch, setValue } = useFormContext()
  const eggQuantity = watch('eggs_quantity')

  const available = calculateAvailableEggs(
    selectedSlot.egg_limit,
    selectedSlot.eggs_reserved
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value) || 0
    
    // Если значение больше максимума - сбиваем на максимум
    if (value > available) {
      value = available
      e.target.value = String(available)
    }
    
    // Если меньше 1 - сбиваем на 1
    if (value < 1 && value > 0) {
      value = 1
      e.target.value = '1'
    }
    
    // Синхронизируем с react-hook-form
    setValue('eggs_quantity', value, { shouldValidate: true })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-[#2d5016] mb-2">Krok 2: Ile jajek?</h2>
        <p className="text-[#8b6f47]">Wybierz ilość jajek do zamówienia</p>
      </div>

      <div className={`p-5 rounded-lg border-2 ${
        available > 10 
          ? 'bg-[#d4e5c4] border-[#2d5016]' 
          : available > 0 
            ? 'bg-[#fef3c7] border-[#a67c3a]'
            : 'bg-[#fce4ec] border-[#c62e1e]'
      }`}>
        <p className={`text-sm font-bold flex items-center gap-2 ${
          available > 10 
            ? 'text-[#2d5016]' 
            : available > 0 
              ? 'text-[#8b6f47]'
              : 'text-[#c62e1e]'
        }`}>
          <span className="text-lg">
            {available > 10 ? '✓' : available > 0 ? '⚠️' : '❌'}
          </span>
          <span>Dostępne jajka: <strong className="text-lg ml-1">{available} szt.</strong></span>
        </p>
        {available > 0 && available <= 10 && (
          <p className="text-sm text-[#8b6f47] mt-2">
            Zostało mało! Spiesz się z zamówieniem.
          </p>
        )}
      </div>

      <div>
        <label htmlFor="eggs_quantity" className="block text-sm font-bold text-[#2d5016] mb-2">
          Liczba jajek * (max {available} szt.)
        </label>
        <input
          type="number"
          id="eggs_quantity"
          placeholder="np. 30"
          min="1"
          max={available}
          {...register('eggs_quantity', {
            valueAsNumber: true,
            validate: (value) => {
              if (!value) return 'Wybierz ilość'
              if (value < 1) return 'Minimalna ilość to 1 jajko'
              if (value > available) return `Maksimum ${available} jajek dla tego terminu`
              if (value <= 0) return 'Ilość musi być większa niż 0'
              return true
            }
          })}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border-2 border-[#d4c4b8] rounded-lg focus:ring-2 focus:ring-[#2d5016] focus:border-[#2d5016] focus:outline-none transition text-[#2c2c2c]"
        />
        {errors.eggs_quantity && typeof errors.eggs_quantity === 'object' && (
          <p className="text-[#c62e1e] text-sm mt-2 font-bold flex items-center gap-1">
            ❌ {(errors.eggs_quantity as any)?.message || 'Błąd'}
          </p>
        )}
      </div>

      {eggQuantity && (
        <div className="bg-[#d4e5c4] p-4 rounded-lg border-2 border-[#2d5016]">
          <p className="text-sm text-[#2d5016] font-bold">
            📦 Zamawiasz:{' '}
            <span className="text-lg">{eggQuantity}</span> szt. jajek
          </p>
        </div>
      )}
    </div>
  )
}
