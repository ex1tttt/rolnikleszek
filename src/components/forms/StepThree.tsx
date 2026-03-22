'use client'

import { useFormContext } from 'react-hook-form'

export default function StepThree() {
  const { register, formState: { errors } } = useFormContext()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-[#2d5016] mb-2">Krok 3: Dane do kontaktu</h2>
        <p className="text-[#8b6f47]">Podaj swoje dane aby potwierdzić zamówienie</p>
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <label htmlFor="customer_name" className="block text-sm font-bold text-[#2d5016] mb-2">
            Imię i nazwisko *
          </label>
          <input
            type="text"
            id="customer_name"
            placeholder="Jan Kowalski"
            {...register('customer_name')}
            className="w-full px-4 py-3 border-2 border-[#d4c4b8] rounded-lg focus:ring-2 focus:ring-[#2d5016] focus:border-[#2d5016] focus:outline-none transition text-[#2c2c2c]"
          />
          {errors.customer_name && typeof errors.customer_name === 'object' && (
            <p className="text-[#c62e1e] text-sm mt-2 font-bold">
              ❌ {(errors.customer_name as any)?.message || 'Błąd'}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-bold text-[#2d5016] mb-2">
            Telefon *
          </label>
          <input
            type="tel"
            id="phone"
            placeholder="607 80 80 89"
            {...register('phone')}
            className="w-full px-4 py-3 border-2 border-[#d4c4b8] rounded-lg focus:ring-2 focus:ring-[#2d5016] focus:border-[#2d5016] focus:outline-none transition text-[#2c2c2c]"
          />
          {errors.phone && typeof errors.phone === 'object' && (
            <p className="text-[#c62e1e] text-sm mt-2 font-bold">❌ {(errors.phone as any)?.message || 'Błąd'}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-bold text-[#2d5016] mb-2">
          Email *
        </label>
        <input
          type="email"
          id="email"
          placeholder="twoj@email.com"
          {...register('email')}
          className="w-full px-4 py-3 border-2 border-[#d4c4b8] rounded-lg focus:ring-2 focus:ring-[#2d5016] focus:border-[#2d5016] focus:outline-none transition text-[#2c2c2c]"
        />
        {errors.email && typeof errors.email === 'object' && (
          <p className="text-[#c62e1e] text-sm mt-2 font-bold">❌ {(errors.email as any)?.message || 'Błąd'}</p>
        )}
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-bold text-[#2d5016] mb-2">
          Pełny adres dostawy *
        </label>
        <textarea
          id="address"
          placeholder="ul. Przykładowa 123, 12-345 Warszawa"
          rows={3}
          {...register('address')}
          className="w-full px-4 py-3 border-2 border-[#d4c4b8] rounded-lg focus:ring-2 focus:ring-[#2d5016] focus:border-[#2d5016] focus:outline-none transition text-[#2c2c2c] resize-none"
        />
        {errors.address && typeof errors.address === 'object' && (
          <p className="text-[#c62e1e] text-sm mt-2 font-bold">❌ {(errors.address as any)?.message || 'Błąd'}</p>
        )}
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-bold text-[#2d5016] mb-2">
          Uwagi do zamówienia (opcjonalnie)
        </label>
        <textarea
          id="notes"
          placeholder="np. instrukcje dla kuriera"
          rows={2}
          {...register('notes')}
          className="w-full px-4 py-3 border-2 border-[#d4c4b8] rounded-lg focus:ring-2 focus:ring-[#2d5016] focus:border-[#2d5016] focus:outline-none transition text-[#2c2c2c] resize-none"
        />
      </div>

      <label className="flex items-start gap-3 p-4 border-2 border-[#d4c4b8] rounded-lg cursor-pointer hover:bg-[#f5f3ef] transition bg-white">
        <input
          type="checkbox"
          {...register('rodo_accepted')}
          className="mt-1"
        />
        <span className="text-sm text-[#2c2c2c] font-medium">
          Akceptuję przetwarzanie moich danych osobowych i regulamin zamówienia *
        </span>
      </label>
      {errors.rodo_accepted && typeof errors.rodo_accepted === 'object' && (
        <p className="text-[#c62e1e] text-sm font-bold">❌ {(errors.rodo_accepted as any)?.message || 'Błąd'}</p>
      )}
    </div>
  )
}
