import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
// import { ref } from '@vue/composition-api'
import { mount, Wrapper } from '@vue/test-utils'
import Vuetify from 'vuetify'

import SearchInput from '@/search/SearchInput.vue'

Vue.use(Vuetify)
Vue.use(VueCompositionApi)

describe('SearchInput', (): void => {
  let vuetify

  beforeEach((): void => {
    vuetify = new Vuetify()
  })

  it('handles no props', (): void => {
    const wrapper: Wrapper<SearchInput> = mount(SearchInput, { vuetify })

    // Should not emit the "search" event unti the button is clicked.
    expect(wrapper.emitted().search).not.toBeDefined()
  })

  /* TODO: finish the unit tests (https://github.com/bcgov/ppr/issues/283)
  it('displays a string label', (): void => {
    const customLabel = 'LABEL1'
    const wrapper: Wrapper<SearchInput> = mount(SearchInput, { propsData: { label: customLabel }, vuetify })

    // Should contain the label.
    expect(wrapper.text()).toContain('LABEL1')
  })

  it('displays a ref label', async (): Promise<void> => {
    const customLabel = ref<string>('LABEL1')
    const wrapper: Wrapper<SearchInput> = mount(SearchInput, { propsData: { label: customLabel }, vuetify })

    // Should contain the label.
    expect(wrapper.text()).toContain('LABEL1')
  })
  */
})
