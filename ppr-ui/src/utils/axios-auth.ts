import axios from 'axios'
import { AxiosResponse } from 'axios'

const instance = axios.create()

instance.interceptors.request.use(
  (config):  object => {
    config.headers.common['Authorization'] = `Bearer ${sessionStorage.getItem('KEYCLOAK_TOKEN')}`
    return config
  },
  (error): Promise<void> => Promise.reject(error)
)

instance.interceptors.response.use(
// : Promise<AxiosResponse<any>>
  (response): AxiosResponse<object> => response,
  (error): Promise<void> => Promise.reject(error)
)


export function setBaseUrl(url: string): void {
  axios.defaults.baseURL = url
}

export default instance
