// import axios from 'axios'
//
// const axiosAuth = axios.create()
//
// axiosAuth.interceptors.request.use(
//   (config): object => {
//     config.headers.common['Authorization'] = `Bearer ${sessionStorage.getItem('KEYCLOAK_TOKEN')}`
//     // TODO ppr#762 Remove the default Account-Id once it is consistently available in session storage
//     config.headers.common['Account-Id'] = sessionStorage.getItem('CURRENT_ACCOUNT') || '137'
//     return config
//   },
//   (error): Promise<void> => Promise.reject(error)
// )
// export default axiosAuth
import {mockStorage} from '@/proto/mock-storage'

class AxiosAuth {
  private static _instance: AxiosAuth
  /**
   * Gets the singleton instance of the class.
   */
  public static get Instance(): AxiosAuth {
    return this._instance || (this._instance = new this())
  }
  private constructor() {
  }

  public post( url: string, json: string): Promise<object> {
    const baseRegistrationNumber = mockStorage.addFS(json)
    const response = {
      data: {
        baseRegistrationNumber: baseRegistrationNumber
      }
    }
    return Promise.resolve(response)
  }

  public get( url: string) {
    const response = {
      data: {

      }
    }
    return Promise.resolve(response)
  }
}

export const axiosAuth = AxiosAuth.Instance
