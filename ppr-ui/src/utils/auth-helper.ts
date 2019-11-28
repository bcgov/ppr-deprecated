import router from '@/router/router'

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
    try {
      return router.push('home')
    } catch (err) {
      console.log('Error here', err)
    }
  },
  authFake() {
    sessionStorage.setItem('KEYCLOAK_TOKEN', 'Some JWY Token')
    console.log("OK let the user into the app")
    router.push('dashboard')
  }
}
