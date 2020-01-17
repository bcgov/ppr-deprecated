import axiosAuth from '@/utils/axios-auth'
import AppData, {Config} from '@/utils/app-data'

// BASE_URL is set from vue.config.js publicPath
export const APP_PATH = process.env.BASE_URL

export default {
  /**
   * fetch config from config map
   */
  async fetchConfig(): Promise<Config> {

    const url = `${APP_PATH}config/configuration.json`
    const headers = {
      'Accept': 'application/json',
      'ResponseType': 'application/json',
      'Cache-Control': 'no-cache'
    }
    // console.log('Retrieve configuration from url:', url)
    const response = await axiosAuth.get(url, {headers})

    const rd: object = response.data
    const cf: object = (typeof rd === 'string') ? JSON.parse(rd) : rd
    AppData.resetConfig(cf)

    return AppData.config
  }
}
