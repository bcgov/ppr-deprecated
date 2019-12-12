import axios from '@/utils/axios-auth'
import AppData, {Config} from '@/utils/app-data'
import {setBaseUrl} from '@/utils/axios-auth'

export default {
  /**
   * fetch config from API
   */
  async fetchConfig(): Promise<Config> {

    const debug = false

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
    if(debug) console.log('Fetch config from ', url)

    const response = await axios.get(url, {headers})

    if(debug) console.log('ConfigHelper url', url)
    if(debug) console.log('ConfigHelper response data ', response.data)
    // with the above to do workaround the response data is a string and needs to be parse.
    // it is expected that once we do the to do above the response data with be an object
    const rd: object = response.data
    if(debug) console.log('ConfigHelper response data ', rd)
    const cf: object = (typeof rd === 'string') ? JSON.parse(rd) : rd
    AppData.resetConfig(cf)

    setBaseUrl(AppData.config.pprApiUrl)

    return AppData.config
  }
}
