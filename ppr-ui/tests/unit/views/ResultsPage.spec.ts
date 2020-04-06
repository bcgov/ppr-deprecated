import Vue from 'vue'
import Vuetify from 'vuetify'
import VueCompositionApi from '@vue/composition-api'
import { shallowMount, RouterLinkStub, Wrapper } from '@vue/test-utils'

import router, { RouterSymbol } from '@/router/router'
import ResultsPage from '@/views/ResultsPage.vue'

Vue.use(Vuetify)
Vue.use(VueCompositionApi)

describe('ResultsPage.vue', (): void => {
  let wrapper: Wrapper<Vue>

  beforeEach((): void => {
    wrapper = shallowMount(ResultsPage, {
      provide: {
        [RouterSymbol]: router
      },
      stubs: {
        RouterLink: RouterLinkStub
      }
    })
  })

  afterEach((): void => {
    wrapper.destroy()
  })

  it('Test the search results page', (): void => {
    expect(wrapper.get('#mockSearchResultsPage').text()).toContain('Personal Property Registry')
  })
})
