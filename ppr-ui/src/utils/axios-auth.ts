import axios from 'axios'

const instance = axios.create()

instance.interceptors.request.use(
  (config):  object => {
    config.headers.common['Authorization'] = `Bearer ${sessionStorage.getItem('KEYCLOAK_TOKEN')}`
    return config
  },
  (error): Promise<void> => Promise.reject(error)
)

export default instance
