import AppData from '@/utils/app-data'

export default {
  authRedirect(): void {
    const redirected = sessionStorage.getItem('REDIRECTED')
    const authUrl = AppData.config.authUrl
    console.debug('AuthHelper redirected contains', redirected)
    console.debug('AuthHelper authUrl contains', authUrl)
    if (redirected !== 'true') {
      if (!sessionStorage.getItem('KEYCLOAK_TOKEN')) {
        console.error('auth redirect to authUrl')
        sessionStorage.setItem('REDIRECTED', 'true')
        window.location.href = authUrl
      }
    }
  }
}
