import axios from '@/utils/axios-auth'
import AppData from '@/utils/app-data'

export default {
  /**
   * fetch config from API
   */
  fetchConfig() {

    // TODO -- follow the lear example ...
    // const origin = window.location.origin
    // const vueAppPath = process.env.VUE_APP_PATH
    // const vueAppAuthPath = process.env.VUE_APP_AUTH_PATH
    //
    // console.log('process env', process.env)
    // if (!vueAppPath || !vueAppAuthPath) {
    //   throw new Error('failed to get env variables')
    // }
    //
    // const baseUrl = `${origin}/${vueAppPath}/`
    // sessionStorage.setItem('BASE_URL', baseUrl)
    // console.log('Set Base URL to: ' + baseUrl)
    //
    // const authUrl = `${origin}/${vueAppAuthPath}/`
    // sessionStorage.setItem('AUTH_URL', authUrl)
    // console.log('Set Auth URL to: ' + authUrl)
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
    console.log('Fetch config from ', url)

    return axios
      .get(url, {headers})
      .then(response => {
        console.log('response data ', response.data)
        // with the above to do workaround the response data is a string and needs to be parse.
        // it is expected that once we do the to do above the response data with be an object
        const rd: any = response.data
        console.log('response data ', rd)
        const cf: object = (typeof rd === 'string') ? JSON.parse(rd) : rd

        const apiUrl: string = cf['API_URL']
        axios.defaults.baseURL = apiUrl
        console.log('Set Base URL to: ' + apiUrl)
        AppData.config.pprApiUrl = apiUrl
        AppData.config.authUrl = cf['AUTH_URL']
        AppData.config.authApiUrl = cf['AUTH_API_URL']
        AppData.config.payApiUrl = cf['PAY_API_URL']
      })
  }
}
