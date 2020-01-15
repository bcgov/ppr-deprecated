import axiosAuth from '@/utils/axios-auth'
import AppData, {Config} from '@/utils/app-data'

export default {
  /**
   * fetch config from API
   */
  async fetchConfig(): Promise<Config> {

    // TODO -- follow the lear example ...
    // const origin = window.location.origin
    // const vueAppPath = process.env.VUE_APP_PATH
    // const vueAppAuthPath = process.env.VUE_APP_AUTH_PATH
    //
    // if (!vueAppPath || !vueAppAuthPath) {
    //   throw new Error('failed to get env variables')
    // }
    //
    // const baseUrl = `${origin}/${vueAppPath}/`
    // sessionStorage.setItem('BASE_URL', baseUrl)
    //
    // const authUrl = `${origin}/${vueAppAuthPath}/`
    // sessionStorage.setItem('AUTH_URL', authUrl)
    //
    // const url = `/${vueAppPath}/config/configuration.json`
    // end of to do

    // remove next line once above to do is done
    const url = '/config/configuration.json'

    const headers = {
      'Accept': 'application/json',
      'ResponseType': 'application/json',
      'Cache-Control': 'no-cache'
    }
    const response = await axiosAuth.get(url, {headers})

    // with the above to do workaround the response data is a string and needs to be parse.
    // it is expected that once we do the to do above the response data with be an object
    const rd: object = response.data
    const cf: object = (typeof rd === 'string') ? JSON.parse(rd) : rd
    AppData.resetConfig(cf)

    return AppData.config
  }
}
