import Vue from 'vue'
import Vuetify from 'vuetify'
import VueCompositionApi, { reactive } from '@vue/composition-api'
import { mount, Wrapper } from '@vue/test-utils'

import FormSectionHeader from '@/components/FormSectionHeader.vue'

Vue.use(Vuetify)
Vue.use(VueCompositionApi)

const vuetify = new Vuetify()

describe('FormSectionHeader.vue', (): void => {
  describe(':props', (): void => {
    it(':label - should display the label', (): void => {
      const properties = reactive({ label: 'LABEL1' })
      const wrapper: Wrapper<Vue> = mount(FormSectionHeader, { propsData: properties, vuetify })

      expect(wrapper.text()).toContain('LABEL1')
    })

    it(':label - should display the changed label', async (): Promise<void> => {
      const properties = reactive({ label: 'LABEL1' })
      const wrapper: Wrapper<Vue> = mount(FormSectionHeader, { propsData: properties, vuetify })

      properties.label = 'LABEL2'
      await Vue.nextTick()

      expect(wrapper.text()).not.toContain('LABEL1')
      expect(wrapper.text()).toContain('LABEL2')
    })
  })
})
