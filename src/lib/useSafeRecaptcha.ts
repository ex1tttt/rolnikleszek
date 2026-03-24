import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

export function useSafeRecaptcha() {
  try {
    return useGoogleReCaptcha()
  } catch (error) {
    // Return a safe default if outside provider
    return {
      executeRecaptcha: async () => '',
    }
  }
}
