import axios from 'axios'

const axiosAuth = axios.create()

axiosAuth.interceptors.request.use(
  (config): object => {
    config.headers.common['Authorization'] = `Bearer ${sessionStorage.getItem('KEYCLOAK_TOKEN')}`
    return config
  },
  (error): Promise<void> => Promise.reject(error)
)

export default axiosAuth
