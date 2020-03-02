import JwtDecode from 'jwt-decode'

import Config from '@/utils/config'

export function authRedirect(): void {
  if (!sessionStorage.getItem('KEYCLOAK_TOKEN')) {
    const authUrl = Config.authApiUrl
    window.location.href = authUrl
  }
}

export function getJwtValue(key: string): string {
  const jwt = sessionStorage.getItem('KEYCLOAK_TOKEN')
  if (jwt) {
    interface Dict { [key: string]: string }
    const jwtd: Dict = JwtDecode(jwt)
    return jwtd[key]
  }
  return ''
}

