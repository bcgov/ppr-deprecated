import axios from 'axios'

const axiosAuth = axios.create()

axiosAuth.interceptors.request.use(
  (config): object => {
    config.headers.common['Authorization'] = `Bearer ${sessionStorage.getItem('KEYCLOAK_TOKEN')}`
    // TODO ppr#762 Remove the default Account-Id once it is consistently available in session storage
    config.headers.common['Account-Id'] = sessionStorage.getItem('CURRENT_ACCOUNT') || '137'
    return config
  },
  (error): Promise<void> => Promise.reject(error)
)

export default axiosAuth
