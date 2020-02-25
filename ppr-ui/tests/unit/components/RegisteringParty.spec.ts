import Vue from 'vue'
import Vuetify from 'vuetify'
import VueCompositionApi, { ref } from '@vue/composition-api'
import { mount, Wrapper } from '@vue/test-utils'

import RegisteringParty from '@/components/RegisteringParty.vue'
import Person from '@/components/person'

Vue.use(Vuetify)
Vue.use(VueCompositionApi)

describe('RegisteringParty.vue', (): void => {
  describe('@events', (): void => {
    it(':editing - false contains no inputs', (): void => {
      const properties = ref({ value: new Person('', '', '') })
      const wrapper: Wrapper<Vue> = mount(RegisteringParty, { propsData: properties.value })

      expect(wrapper.findAll('input').exists()).toBeFalsy()
    })

    it(':editing - false contains name components', (): void => {
      const properties = ref({ value: new Person('Firstname', 'Middlename', 'Lastname') })
      const wrapper: Wrapper<Vue> = mount(RegisteringParty, { propsData: properties.value })

      expect(wrapper.text()).toContain('Firstname')
      expect(wrapper.text()).toContain('Middlename')
      expect(wrapper.text()).toContain('Lastname')
    })

    it('@input - first name change should be emitted', async (): Promise<void> => {
      const properties = ref({ editing: true, value: new Person('Firstname', 'Middlename', 'Lastname') })
      const wrapper: Wrapper<Vue> = mount(RegisteringParty, { propsData: properties.value })

      wrapper.get('input[data-test-id="BaseParty.firstName"]').setValue('Newfirstname')
      await Vue.nextTick()

      const emittedPerson = wrapper.emitted('input').slice(-1)[0][0]
      expect(emittedPerson.firstName).toBe('Newfirstname')
      expect(emittedPerson.middleName).toBe('Middlename')
      expect(emittedPerson.lastName).toBe('Lastname')
    })

    it('@input - middle name change should be emitted', async (): Promise<void> => {
      const properties = ref({ editing: true, value: new Person('Firstname', 'Middlename', 'Lastname') })
      const wrapper: Wrapper<Vue> = mount(RegisteringParty, { propsData: properties.value })

      wrapper.get('input[data-test-id="BaseParty.middleName"]').setValue('Newmiddlename')
      await Vue.nextTick()

      const emittedPerson = wrapper.emitted('input').slice(-1)[0][0]
      expect(emittedPerson.firstName).toBe('Firstname')
      expect(emittedPerson.middleName).toBe('Newmiddlename')
      expect(emittedPerson.lastName).toBe('Lastname')
    })

    it('@input - last name change should be emitted', async (): Promise<void> => {
      const properties = ref({ editing: true, value: new Person('Firstname', 'Middlename', 'Lastname') })
      const wrapper: Wrapper<Vue> = mount(RegisteringParty, { propsData: properties.value })

      wrapper.get('input[data-test-id="BaseParty.lastName"]').setValue('Newlastname')
      await Vue.nextTick()

      const emittedPerson = wrapper.emitted('input').slice(-1)[0][0]
      expect(emittedPerson.firstName).toBe('Firstname')
      expect(emittedPerson.middleName).toBe('Middlename')
      expect(emittedPerson.lastName).toBe('Newlastname')
    })

    it('@valid - no names should be false', async (): Promise<void> => {
      const properties = ref({ editing: true, value: new Person('', '', '') })
      const wrapper: Wrapper<Vue> = mount(RegisteringParty, { propsData: properties.value })

      wrapper.get('input[data-test-id="BaseParty.firstName"]').trigger('input')
      await Vue.nextTick()

      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBeFalsy()
    })

    it('@valid - first and middle names should be false', async (): Promise<void> => {
      const properties = ref({ editing: true, value: new Person('Firstname', 'Middlename', '') })
      const wrapper: Wrapper<Vue> = mount(RegisteringParty, { propsData: properties.value })

      wrapper.get('input[data-test-id="BaseParty.firstName"]').trigger('input')
      await Vue.nextTick()

      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBeFalsy()
    })

    it('@valid - middle and last names should be false', async (): Promise<void> => {
      const properties = ref({ editing: true, value: new Person('', 'Middlename', 'Lastname') })
      const wrapper: Wrapper<Vue> = mount(RegisteringParty, { propsData: properties.value })

      wrapper.get('input[data-test-id="BaseParty.firstName"]').trigger('input')
      await Vue.nextTick()

      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBeFalsy()
    })

    it('@valid - first and last names should be true', async (): Promise<void> => {
      const properties = ref({ editing: true, value: new Person('Firstname', '', 'Lastname') })
      const wrapper: Wrapper<Vue> = mount(RegisteringParty, { propsData: properties.value })

      wrapper.get('input[data-test-id="BaseParty.firstName"]').trigger('input')
      await Vue.nextTick()

      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBeTruthy()
    })
  })
})
