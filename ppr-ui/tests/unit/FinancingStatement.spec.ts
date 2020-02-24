import Vue from 'vue'
import Vuetify from 'vuetify'
import VueCompositionApi from '@vue/composition-api'
import { shallowMount, Wrapper } from '@vue/test-utils'
import FinancingStatement from '@/views/FinancingStatement.vue'

Vue.use(Vuetify)
Vue.use(VueCompositionApi)

describe('FinancingStatement.vue', (): void => {
  let wrapper: Wrapper<Vue>

  beforeEach((): void => {
    wrapper = shallowMount(FinancingStatement, { })
  })

  afterEach((): void => {
    wrapper.destroy()
  })

  it('Test the financing view', (): void => {
    expect(wrapper.get('#financingStatement').text()).toContain('Financing Statement')
  })
})
