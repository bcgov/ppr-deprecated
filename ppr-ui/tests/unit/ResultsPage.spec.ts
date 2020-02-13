import Vue from 'vue'
import Vuetify from 'vuetify'
import VueCompositionApi from '@vue/composition-api'
import { shallowMount, Wrapper } from '@vue/test-utils'
import ResultsPage from '@/views/ResultsPage.vue'
import { FeatureFlags, FeatureFlagSymbol } from '@/flags/feature-flags'
import { RouterSymbol } from '@/router/router'
import router from '@/router/router'

Vue.use(Vuetify)
Vue.use(VueCompositionApi)

const featureFlags = FeatureFlags.Instance

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
