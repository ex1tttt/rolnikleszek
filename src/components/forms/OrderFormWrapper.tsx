'use client'

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import OrderForm from './OrderForm'
import { DeliverySlot } from '@/types'

interface OrderFormWrapperProps {
  deliverySlots: DeliverySlot[]
}

export default function OrderFormWrapper({ deliverySlots }: OrderFormWrapperProps) {
  const reCaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

  return (
    <GoogleReCaptchaProvider reCaptchaKey={reCaptchaKey || ''}>
      <OrderForm deliverySlots={deliverySlots} />
    </GoogleReCaptchaProvider>
  )
}
