import Vue from 'vue'
import Vuetify from 'vuetify'
import VueCompositionApi from '@vue/composition-api'
import {shallowMount, Wrapper} from '@vue/test-utils'
import SearchPage from '@/views/SearchPage.vue'
import ResultsPage from '@/views/ResultsPage.vue'
import SearchSerial from '@/search/SearchSerial.vue'
import {FeatureFlags, FeatureFlagSymbol} from "@/flags/feature-flags"
import {RouterSymbol} from '@/router/router'
import router from '@/router/router'

const featureFlags = FeatureFlags.Instance

Vue.use(Vuetify)
Vue.use(VueCompositionApi)

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

  it('Test flagging feature one', (): void => {
    expect(vm.$el.querySelector('#mockSearchPage').textContent).toContain('Personal Property Registry')
  })
})


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

  afterEach( (): void => {
    wrapper.destroy()
  })

  it('Test flagging feature one', (): void => {
    expect(vm.$el.querySelector('#mockSerachResultsPage').textContent).toContain('Personal Property Registry')
  })
})

describe.skip('SearchSerial.vue', (): void => {
  let wrapper: Wrapper<Vue>
  let vm

  beforeEach((): void => {
    wrapper = shallowMount(SearchSerial, {
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

  it('Test flagging feature one', (): void => {
    expect(vm.$el.querySelector('#search-btn').textContent).toContain('Search')
  })
})

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

  afterEach( (): void => {
    wrapper.destroy()
  })

  it('Test flagging feature one', (): void => {
    expect(vm.$el.querySelector('#mockSerachResultsPage').textContent).toContain('Personal Property Registry')
  })
})
