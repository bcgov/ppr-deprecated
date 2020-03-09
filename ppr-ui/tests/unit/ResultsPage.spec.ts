import Vue from 'vue'
import Vuetify from 'vuetify'
import VueCompositionApi from '@vue/composition-api'
import { shallowMount, Wrapper } from '@vue/test-utils'
import ResultsPage from '@/views/ResultsPage.vue'
import { RouterSymbol } from '@/router/router'
import router from '@/router/router'
import { RouterLinkStub } from '@vue/test-utils'

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
