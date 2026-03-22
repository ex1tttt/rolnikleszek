'use client'

import { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { DeliverySlot, OrderFormData } from '@/types'
import StepOne from './StepOne'
import StepTwo from './StepTwo'
import StepThree from './StepThree'
import StepFour from './StepFour'
import StepFive from './StepFive'

const orderSchema = z.object({
  slot_id: z.string().min(1, 'Wybierz termin dostawy'),
  eggs_quantity: z.number().min(1, 'Minimalna ilość to 1 jajko').max(1000, 'Maksymalna ilość to 1000 jajek'),
  customer_name: z
    .string()
    .min(3, 'Imię i nazwisko musi mieć co najmniej 3 znaki'),
  phone: z.string().regex(/^\d{7,15}$/, 'Podaj prawidłowy numer telefonu'),
  email: z.string().email('Podaj prawidłowy adres email'),
  address: z.string().min(10, 'Podaj pełny adres dostawy'),
  notes: z.string().optional(),
  rodo_accepted: z.boolean().refine((val) => val === true, {
    message: 'Musisz zaakceptować warunki RODO',
  }),
})

type OrderFormSchema = z.infer<typeof orderSchema>

interface OrderFormProps {
  deliverySlots: DeliverySlot[]
}

export default function OrderForm({ deliverySlots }: OrderFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const methods = useForm<OrderFormSchema>({
    resolver: zodResolver(orderSchema),
    mode: 'onChange',
    defaultValues: {
      slot_id: '',
      eggs_quantity: 1,
      customer_name: '',
      phone: '',
      email: '',
      address: '',
      notes: '',
      rodo_accepted: false,
    }
  })

  const selectedSlotId = methods.watch('slot_id')
  const selectedSlot = deliverySlots.find((s) => s.id === selectedSlotId)

  const handleNextStep = async () => {
    const fieldsToValidate =
      currentStep === 1
        ? ['slot_id']
        : currentStep === 2
          ? ['eggs_quantity']
          : currentStep === 3
            ? ['customer_name', 'phone', 'email']
            : currentStep === 4
              ? ['address', 'rodo_accepted']
              : []

    const isValid = await methods.trigger(fieldsToValidate as any)

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 5))
    }
  }

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const onSubmit = async (data: OrderFormSchema) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Nie udało się złożyć zamówienia')
      }

      setSubmitSuccess(true)
      setCurrentStep(5)
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Błąd podczas żładania zamówienia'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
          {/* Progress bar */}
          <div className="flex gap-2 mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex-1 h-2 rounded-full ${
                  step <= currentStep ? 'bg-[#2d5016]' : 'bg-[#d4c4b8]'
                }`}
              />
            ))}
          </div>

          {/* Steps */}
          {currentStep === 1 && (
            <StepOne deliverySlots={deliverySlots} selectedSlot={selectedSlot} />
          )}
          {currentStep === 2 && selectedSlot && <StepTwo selectedSlot={selectedSlot} />}
          {currentStep === 3 && <StepThree />}
          {currentStep === 4 && selectedSlot && <StepFour selectedSlot={selectedSlot} />}
          {currentStep === 5 && submitSuccess && <StepFive />}

          {/* Error message */}
          {submitError && (
            <div className="p-6 bg-[#fce4ec] border-l-4 border-[#c62e1e] rounded-lg space-y-3">
              <p className="font-bold text-[#c62e1e] text-lg">⚠️ Błąd podczas zamówienia</p>
              <p className="text-[#8b6f47]">{submitError}</p>
              
              {submitError.includes('deadline') && (
                <p className="text-sm mt-3 text-[#8b6f47]">
                  Deadline na ten termin już minął. Wybierz inny termin dostawy.
                </p>
              )}
              
              {submitError.includes('Not enough eggs') && (
                <p className="text-sm mt-3 text-[#8b6f47]">
                  Ta ilość jajek nie jest dostępna. Spróbuj mniejszą ilość lub inny termin.
                </p>
              )}
              
              <button
                type="button"
                onClick={() => {
                  setSubmitError(null)
                  setCurrentStep(1)
                }}
                className="text-sm font-bold text-[#2d5016] hover:underline mt-3"
              >
                ← Powrót do wyboru terminu
              </button>
            </div>
          )}

          {/* Navigation buttons */}
          {currentStep < 4 && (
            <div className="flex gap-4 justify-between pt-4">
              <button
                type="button"
                onClick={handlePreviousStep}
                disabled={currentStep === 1}
                className="px-6 py-3 border-2 border-[#d4c4b8] text-[#2d5016] rounded-lg hover:bg-[#f5f3ef] disabled:opacity-40 font-bold transition"
              >
                ← Wstecz
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-3 bg-[#2d5016] text-white rounded-lg hover:bg-[#4a7c2e] font-bold transition"
              >
                Dalej →
              </button>
            </div>
          )}

          {currentStep === 4 && (
            <div className="flex gap-4 justify-between pt-4">
              <button
                type="button"
                onClick={handlePreviousStep}
                className="px-6 py-3 border-2 border-[#d4c4b8] text-[#2d5016] rounded-lg hover:bg-[#f5f3ef] font-bold transition"
              >
                ← Wstecz
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-[#2d5016] text-white rounded-lg hover:bg-[#4a7c2e] disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg transition"
              >
                {isSubmitting ? '⏳ Przesyłanie...' : '✓ Złóż zamówienie'}
              </button>
            </div>
          )}
        </form>
      </FormProvider>
    </div>
  )
}
