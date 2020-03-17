import Vue from 'vue'
import VueCompositionApi, { ref } from '@vue/composition-api'
import { mount, Wrapper } from '@vue/test-utils'
import { BasePartyModel } from '@/base-party/base-party-model'
import { BusinessNameModel } from '@/components/business-model'
import Vuetify from 'vuetify'

import SecuredParties from '@/financing-statement/SecuredParties.vue'

Vue.use(Vuetify)
Vue.use(VueCompositionApi)
const vuetify = new Vuetify()

const firstSecuredParty = new BasePartyModel()
firstSecuredParty.listId = 0
const securedParties = [firstSecuredParty]

describe('SecuredParties.vue', (): void => {
  describe(':props', (): void => {

    // General form tests.
    it(':editing - false, add button does not exist', (): void => {
      const properties = ref({ editing: false, value: securedParties })
      const wrapper: Wrapper<Vue> = mount(SecuredParties, { propsData: properties.value, vuetify })

      expect(wrapper.find('button[data-test-id="SecuredParties.button.add"]').exists()).toBeFalsy()
    })
    it(':editing - true, add button does exist', (): void => {
      const properties = ref({ editing: true, value: securedParties })
      const wrapper: Wrapper<Vue> = mount(SecuredParties, { propsData: properties.value, vuetify })

      expect(wrapper.find('button[data-test-id="SecuredParties.button.add"]').exists()).toBeTruthy()
    })

  })
  describe('@events', (): void => {
    it('@input - add button should emit input with new list', async (): Promise<void> => {
      const properties = ref({ editing: true, value: securedParties })
      const wrapper: Wrapper<Vue> = mount(SecuredParties, { propsData: properties.value, vuetify })

      const button = wrapper.get('[data-test-id="SecuredParties.button.add"]')
      button.trigger('click')
      await Vue.nextTick()

      const emitted = wrapper.emitted('input').slice(-1)[0][0]
      expect(emitted).toHaveLength(2)
    })
  })

  describe('white box testing', (): void => {
    it('remove method should emit input shorter list', async (): Promise<void> => {
      const properties = ref({ editing: true, value: securedParties })
      const wrapper: Wrapper<Vue> = mount(SecuredParties, { propsData: properties.value, vuetify })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const vm: any = wrapper.vm
      vm.removeElement()
      await Vue.nextTick()

      const emitted = wrapper.emitted('input').slice(-1)[0][0]
      expect(emitted).toHaveLength(0)
    })

    it('update method should emit input with same list but updated element', async (): Promise<void> => {
      const properties = ref({ editing: true, value: securedParties })
      const wrapper: Wrapper<Vue> = mount(SecuredParties, { propsData: properties.value, vuetify })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const vm: any = wrapper.vm
      const updated = new BasePartyModel(new BusinessNameModel('aBusiness'))
      vm.updateElement(updated, 0)
      await Vue.nextTick()

      const emitted = wrapper.emitted('input').slice(-1)[0][0]
      expect(emitted).toHaveLength(1)
      expect(emitted[0]).toEqual(updated)
    })
  })
})
