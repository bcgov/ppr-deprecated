import Vue from 'vue'
import Vuetify from 'vuetify'
import VueCompositionApi from '@vue/composition-api'
import { shallowMount, Wrapper } from '@vue/test-utils'
import FinancingStatementView from '@/views/FinancingStatementView.vue'
import router from '@/router/router'

Vue.use(Vuetify)
Vue.use(VueCompositionApi)

describe('FinancingStatementView.vue', (): void => {
  let wrapper: Wrapper<Vue>

  beforeEach((): void => {
    wrapper = shallowMount(FinancingStatementView, { router })
  })

  afterEach((): void => {
    wrapper.destroy()
  })

  it('Test the financing view', (): void => {
    expect(wrapper.get('#financingStatement').text()).toContain('Financing Statement')
  })
})
