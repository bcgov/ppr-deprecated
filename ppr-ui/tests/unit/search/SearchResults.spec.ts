import axios from 'axios'
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueCompositionApi from '@vue/composition-api'
import { mount, Wrapper, createLocalVue } from '@vue/test-utils'

import { LoadIndicator, LoadIndicatorSymbol } from '@/load-indicator'
import SearchResults from '@/search/SearchResults.vue'

jest.mock('@/utils/config')
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

Vue.use(Vuetify)
Vue.use(VueCompositionApi)

const loadIndicator = LoadIndicator.Instance
const localVue = createLocalVue()

const $route = {
  path: '/some/path',
  query: { 'searchId': '123456b' }
}

describe('SearchResults.vue', (): void => {
  let wrapper: Wrapper<Vue>

  beforeEach((): void => {
    mockedAxios.get.mockResolvedValue({ data: 'somedata' })
    wrapper = mount(SearchResults, {
      localVue,
      mocks: {
        $route
      },
      provide: {
        [LoadIndicatorSymbol]: loadIndicator
      }
    })
  })

  it('Test the search results page wrapper', (): void => {
    expect(wrapper).toBeDefined()
  })
})
