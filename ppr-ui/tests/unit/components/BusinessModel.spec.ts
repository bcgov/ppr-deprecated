import Vue from 'vue'
import Vuetify from 'vuetify'
import VueCompositionApi, { ref } from '@vue/composition-api'
import { mount, Wrapper } from '@vue/test-utils'

import BusinessName from '@/components/BusinessName.vue'
import { BusinessModel } from '@/components/business-model'

Vue.use(Vuetify)
Vue.use(VueCompositionApi)

describe('BusinessName.vue', (): void => {
  describe('@events', (): void => {
    it(':editing - false contains no inputs', (): void => {
      const properties = ref({ value: new BusinessModel() })
      const wrapper: Wrapper<Vue> = mount(BusinessName, { propsData: properties.value })

      expect(wrapper.findAll('input').exists()).toBeFalsy()
    })

    it(':editing - false contains name components', (): void => {
      const properties = ref({ value: new BusinessModel('BusinessName') })
      const wrapper: Wrapper<Vue> = mount(BusinessName, { propsData: properties.value })

      expect(wrapper.text()).toContain('BusinessName')
    })

    it('@input - business name change should be emitted', async (): Promise<void> => {
      const properties = ref({ editing: true, value: new BusinessModel('BusinessName') })
      const wrapper: Wrapper<Vue> = mount(BusinessName, { propsData: properties.value })

      wrapper.get('input[data-test-id="BusinessName"]').setValue('NewBusinessName')
      await Vue.nextTick()

      const emittedBusiness = wrapper.emitted('input').slice(-1)[0][0]
      expect(emittedBusiness.businessName).toBe('NewBusinessName')
    })

  })
})
