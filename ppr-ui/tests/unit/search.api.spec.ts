import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
import { SearcherSerial } from '@/search/search-serial'
import axios from '@/utils/axios-auth'

Vue.use(VueCompositionApi)

// Need to mock the
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('serial search', (): void => {
  let ss: SearcherSerial

  beforeAll((): void => {
    ss = SearcherSerial.Instance('http://sample.base.url/')
  })

  it('doSearch', (): void => {
    const results = [{ make: 'Toyota', match: 'exact', vin: '1234', year: '2007' }]
    const resp = { data: { results: results } }
    mockedAxios.get.mockResolvedValue(resp)

    ss.doSearch('1234').then((result): void => {
      expect(result === 'success')
      // console.log('search result', result)
      // console.log(ss.results)
      expect(ss.results[0].make === results[0].make)
    }).catch((err): void => {
      console.log(err)
    })
  })
})
