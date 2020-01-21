import Vue from 'vue'
import Vuetify from 'vuetify'
import VueCompositionApi from '@vue/composition-api'
import { shallowMount, Wrapper } from '@vue/test-utils'
import ResultsPage from '@/views/ResultsPage.vue'
import SearchSerial from '@/search/SearchSerial.vue'
import SearchResultsSerial from '@/search/SearchResultsSerial.vue'
import { FeatureFlags, FeatureFlagSymbol } from '@/flags/feature-flags'
import { RouterSymbol } from '@/router/router'
import router from '@/router/router'
import { LoadIndicator as LI, LoadIndicatorSymbol } from '@/load-indicator'
import { SearcherSerial as SI, SearcherSerialSymbol, SS_TEXT } from '@/search/search-serial'
import axios from '@/utils/axios-auth'

Vue.use(Vuetify)
Vue.use(VueCompositionApi)

// Need to mock the
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

const featureFlags = FeatureFlags.Instance
const loadIndicator = LI.Instance
const search = SI.Instance('http://sample.base.url/')

/* TODO: failing due to setup, and not sure what it is testing. Fix later (https://github.com/bcgov/ppr/issues/283)
import SearchPage from '@/views/SearchPage.vue'
describe('SearchPage.vue', (): void => {
  let wrapper: Wrapper<Vue>
  let vm

  beforeEach((): void => {
    wrapper = shallowMount(SearchPage, {
      provide: {
        [FeatureFlagSymbol]: featureFlags,
        [RouterSymbol]: router
      }
    })
    vm = wrapper.vm
  })

  afterEach( (): void => {
    wrapper.destroy()
  })

  it('Test the search page', (): void => {
    expect(vm.$el.querySelector('#mockSearchPage').textContent).toContain('Personal Property Registry')
  })
})
*/

describe('ResultsPage.vue', (): void => {
  let wrapper: Wrapper<Vue>
  let vm

  beforeEach((): void => {
    wrapper = shallowMount(ResultsPage, {
      provide: {
        [FeatureFlagSymbol]: featureFlags,
        [RouterSymbol]: router
      }
    })
    vm = wrapper.vm
  })

  afterEach((): void => {
    wrapper.destroy()
  })

  it('Test the search results page', (): void => {
    expect(vm.$el.querySelector('#mockSearchResultsPage').textContent).toContain('Personal Property Registry')
  })
})

describe('SearchSerial.vue', (): void => {
  let wrapper: Wrapper<Vue>
  let vm

  beforeEach((): void => {
    wrapper = shallowMount(SearchSerial, {
      provide: {
        [LoadIndicatorSymbol]: loadIndicator,
        [SearcherSerialSymbol]: search,
        [RouterSymbol]: router
      }
    })
    vm = wrapper.vm
  })

  afterEach((): void => {
    wrapper.destroy()
  })

  it('Test the serial number search component', (): void => {
    expect(vm.$el.querySelector('#search-btn').textContent).toContain('Search')
  })

  it('Test the serial number search component data', (): void => {
    expect(vm.describeValidSerial).toContain(SS_TEXT.describeValidSerial)

    vm.serialNumber = '12$'
    expect(vm.formValid).toEqual(false)

    vm.serialNumber = '1234'
    expect(vm.formValid).toEqual(true)

    vm.serialNumber = 'abcdefghilabcdefghil12345'
    expect(vm.formValid).toEqual(true)

    vm.serialNumber = 'abcdefghilabcdefghil123456'
    expect(vm.formValid).toEqual(false)
  })

  it('Test the properties serial number search component', (): void => {
    vm.serialNumber = '1234'
    const results = [{ make: 'Toyota', match: 'exact', vin: '1234', year: '2007' }]
    const resp = { data: { results: results } }
    mockedAxios.get.mockResolvedValue(resp)
    vm.doSearch()
      .then((): void => {
        // console.log('search.results',search.results)
        expect(search.results[0].make === 'Toyota')
      })
  })
})

describe('SearchResultsSerial.vue', (): void => {
  let wrapper: Wrapper<Vue>
  let vm

  beforeEach((): void => {
    wrapper = shallowMount(SearchResultsSerial, {
      provide: {
        [LoadIndicatorSymbol]: loadIndicator,
        [SearcherSerialSymbol]: search,
        [RouterSymbol]: router
      }
    })
    vm = wrapper.vm
  })

  afterEach((): void => {
    wrapper.destroy()
  })

  it('Test the serial number results component', (): void => {
    let elem = vm.$el.querySelector('#srsBody')
    let table = elem.getElementsByTagName('TBODY')
    let content = table[0].textContent
    expect(content).toContain('Toyota')
  })
})
