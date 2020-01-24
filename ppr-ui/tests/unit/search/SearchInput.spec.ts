import Vue from 'vue'
import VueCompositionApi, { reactive } from '@vue/composition-api'
import { mount, Wrapper } from '@vue/test-utils'
import Vuetify from 'vuetify'

import SearchInput from '@/search/SearchInput.vue'

Vue.use(Vuetify)
Vue.use(VueCompositionApi)

const vuetify = new Vuetify()

describe('SearchInput.vue', (): void => {
  it('handles no props', (): void => {
    const wrapper: Wrapper<Vue> = mount(SearchInput, { vuetify })

    // Just need something to test: should not emit the "search" event unti the button is clicked.
    expect(wrapper.emitted().search).not.toBeDefined()
  })

  describe(':props', (): void => {
    it(':errorMessage - should display the error', (): void => {
      const properties = reactive({ errorMessage: 'ERRORMESSAGE1' })
      const wrapper: Wrapper<SearchInput> = mount(SearchInput, { propsData: properties, vuetify })

      expect(wrapper.text()).toContain('ERRORMESSAGE1')
    })

    it(':errorMessage - should display the changed error', async (): Promise<void> => {
      const properties = reactive({ errorMessage: 'ERRORMESSAGE1' })
      const wrapper: Wrapper<SearchInput> = mount(SearchInput, { propsData: properties, vuetify })

      properties.errorMessage = 'ERRORMESSAGE2'
      await Vue.nextTick()

      expect(wrapper.text()).not.toContain('ERRORMESSAGE1')
      expect(wrapper.text()).toContain('ERRORMESSAGE2')
    })

    it(':label - should display the label', (): void => {
      const properties = reactive({ label: 'LABEL1' })
      const wrapper: Wrapper<SearchInput> = mount(SearchInput, { propsData: properties, vuetify })

      expect(wrapper.text()).toContain('LABEL1')
    })

    it(':label - should display the changed label', async (): Promise<void> => {
      const properties = reactive({ label: 'LABEL1' })
      const wrapper: Wrapper<SearchInput> = mount(SearchInput, { propsData: properties, vuetify })

      properties.label = 'LABEL2'
      await Vue.nextTick()

      expect(wrapper.text()).not.toContain('LABEL1')
      expect(wrapper.text()).toContain('LABEL2')
    })

    // TODO: figure out how to test the 'hint' property: https://github.com/bcgov/ppr/issues/358

    // TODO: figure out how to test the 'rules' property: https://github.com/bcgov/ppr/issues/359
  })

  describe('@events', (): void => {
    // TODO: figure out how to test the 'search' event: https://github.com/bcgov/ppr/issues/360
  })
})
