import JwtDecode from 'jwt-decode'

import AppData from '@/utils/app-data'

export function authRedirect(): void {
  if (!sessionStorage.getItem('KEYCLOAK_TOKEN')) {
    const authUrl = AppData.config.authUrl
    console.debug('auth redirect to authUrl', authUrl)
    window.location.href = authUrl
  }
}

export function getJwtValue(key: string): string {
  const jwt = sessionStorage.getItem('KEYCLOAK_TOKEN')
  const json = jwt ? JwtDecode(jwt) : {}

  return json[key]
}
