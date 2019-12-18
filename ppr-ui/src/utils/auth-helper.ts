import axios from "@/utils/axios-auth"
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
  },
  authClear(): Promise<void> {
    console.debug("AuthHelper OK let the user out of the app")
    sessionStorage.setItem('REDIRECTED', 'false')
    sessionStorage.removeItem('KEYCLOAK_TOKEN')
    return Promise.resolve()
  },
  authFake(userName: string): Promise<string> {
    const headers = {
      'Accept': 'application/json',
      'ResponseType': 'application/json',
      'Cache-Control': 'no-cache'
    }
    const authUrl = AppData.config.authUrl
    let url = authUrl + userName
    console.debug('AuthHelper auth user url ', url)
    return axios
      .get(url, {headers})
      .then((response): string => {
        const userName = response.data.user_name
        console.debug('AuthHelper api response data ', userName)
        sessionStorage.setItem('KEYCLOAK_TOKEN', 'Some JWY Token')
        AppData.user.userName = userName
        return userName
      })
  }
}
