// Load reCAPTCHA script dynamically
let scriptLoaded = false

export function loadRecaptchaScript(): Promise<void> {
  return new Promise((resolve) => {
    if (scriptLoaded || (window as any).grecaptcha) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://www.google.com/recaptcha/api.js'
    script.async = true
    script.onload = () => {
      scriptLoaded = true
      resolve()
    }
    document.head.appendChild(script)
  })
}

export async function getRecaptchaToken(siteKey: string): Promise<string> {
  if (!siteKey || typeof window === 'undefined') {
    return ''
  }

  try {
    await loadRecaptchaScript()
    const token = await (window as any).grecaptcha.execute(siteKey, { action: 'submit_order' })
    return token || ''
  } catch (error) {
    console.warn('reCAPTCHA token generation failed:', error)
    return ''
  }
}
