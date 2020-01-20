import AppData from '@/utils/app-data'

export default {
  authRedirect(): void {
    if (!sessionStorage.getItem('KEYCLOAK_TOKEN')) {
      const authUrl = AppData.config.authUrl
      console.debug('auth redirect to authUrl', authUrl)
      window.location.href = authUrl
    }
  }
}
