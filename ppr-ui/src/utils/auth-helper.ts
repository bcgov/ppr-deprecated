import router from '@/router/router'
import axios from "@/utils/axios-auth";
import AppData from '@/utils/app-data';

export default {
  authRedirect() {
    const redirected = sessionStorage.getItem('REDIRECTED')
    const authUrl: string = sessionStorage.getItem('AUTH_URL') || ''
    // console.log('redirected contains', redirected)
    // console.log('authUrl contains', authUrl)
    if (redirected !== 'true') {
      if (!sessionStorage.getItem('KEYCLOAK_TOKEN')) {
        console.error('auth redirect to authUrl')
        sessionStorage.setItem('REDIRECTED', 'true')
        window.location.href = authUrl
      }
    }
  },
  authClear() {
    console.log("OK let the user out of the app")
    sessionStorage.setItem('REDIRECTED', 'false')
    sessionStorage.removeItem('KEYCLOAK_TOKEN')
    return Promise.resolve()
  },
  authFake(userName: string) {
    const headers = {
      'Accept': 'application/json',
      'ResponseType': 'application/json',
      'Cache-Control': 'no-cache'
    }
    const authUrl = sessionStorage.getItem('AUTH_URL')
    let url = authUrl + userName
    console.log('auth user url ', url)
    return axios
      .get(url, {headers})
      .then(response => {
        const userName = response.data.user_name
        console.log('api response data ', userName)
        sessionStorage.setItem('KEYCLOAK_TOKEN', 'Some JWY Token')
        AppData.user.userName = userName
        return userName
      })
  }
}
