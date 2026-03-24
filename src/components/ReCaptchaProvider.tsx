'use client'

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

export function ReCaptchaProviderWrapper({ children }: { children: React.ReactNode }) {
  const reCaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

  if (!reCaptchaKey) {
    console.warn('reCAPTCHA site key not configured')
    return <>{children}</>
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={reCaptchaKey}>
      {children}
    </GoogleReCaptchaProvider>
  )
}
