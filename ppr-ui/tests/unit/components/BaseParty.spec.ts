import Vue from 'vue'
import Vuetify from 'vuetify'
import VueCompositionApi, { ref } from '@vue/composition-api'
import { mount, Wrapper } from '@vue/test-utils'

import BaseParty from '@/components/BaseParty.vue'
import Person from '@/components/person'

Vue.use(Vuetify)
Vue.use(VueCompositionApi)

describe('BaseParty.vue', (): void => {
  describe(':props', (): void => {
    it(':value - setting the first name', (): void => {
      const properties = ref({ value: new Person('Firstname', 'Middlename', 'Lastname') })
      const wrapper: Wrapper<BaseParty> = mount(BaseParty, { propsData: properties.value })

      const input = wrapper.get('input[data-test-id="BaseParty.firstName"]').element as HTMLInputElement
      expect(input.value).toBe('Firstname')
    })

    it(':value - setting the middle name', (): void => {
      const properties = ref({ value: new Person('Firstname', 'Middlename', 'Lastname') })
      const wrapper: Wrapper<BaseParty> = mount(BaseParty, { propsData: properties.value })

      const input = wrapper.get('input[data-test-id="BaseParty.middleName"]').element as HTMLInputElement
      expect(input.value).toBe('Middlename')
    })

    it(':value - setting the last name', (): void => {
      const properties = ref({ value: new Person('Firstname', 'Middlename', 'Lastname') })
      const wrapper: Wrapper<BaseParty> = mount(BaseParty, { propsData: properties.value })

      const input = wrapper.get('input[data-test-id="BaseParty.lastName"]').element as HTMLInputElement
      expect(input.value).toBe('Lastname')
    })

    it(':value - reactivity of the first name', async (): Promise<void> => {
      const person = new Person('Firstname', 'Middlename', 'Lastname')
      const properties = ref({ value: person })
      const wrapper: Wrapper<BaseParty> = mount(BaseParty, { propsData: properties.value })

      person.firstName = 'Newfirstname'
      await Vue.nextTick()

      const input = wrapper.get('input[data-test-id="BaseParty.firstName"]').element as HTMLInputElement
      expect(input.value).toBe('Newfirstname')
    })

    it(':value - reactivity of the middle name', async (): Promise<void> => {
      const person = new Person('Firstname', 'Middlename', 'Lastname')
      const properties = ref({ value: person })
      const wrapper: Wrapper<BaseParty> = mount(BaseParty, { propsData: properties.value })

      person.middleName = 'Newmiddlename'
      await Vue.nextTick()

      const input = wrapper.get('input[data-test-id="BaseParty.middleName"]').element as HTMLInputElement
      expect(input.value).toBe('Newmiddlename')
    })

    it(':value - reactivity of the last name', async (): Promise<void> => {
      const person = new Person('Firstname', 'Middlename', 'Lastname')
      const properties = ref({ value: person })
      const wrapper: Wrapper<BaseParty> = mount(BaseParty, { propsData: properties.value })

      person.lastName = 'Newlastname'
      await Vue.nextTick()

      const input = wrapper.get('input[data-test-id="BaseParty.lastName"]').element as HTMLInputElement
      expect(input.value).toBe('Newlastname')
    })
  })

  describe('@events', (): void => {
    it('@input - first name change should be emitted', async (): Promise<void> => {
      const properties = ref({ value: new Person('Firstname', 'Middlename', 'Lastname') })
      const wrapper: Wrapper<BaseParty> = mount(BaseParty, { propsData: properties.value })

      wrapper.get('input[data-test-id="BaseParty.firstName"]').setValue('Newfirstname')
      await Vue.nextTick()

      const emittedPerson = wrapper.emitted('input').slice(-1)[0][0]
      expect(emittedPerson.firstName).toBe('Newfirstname')
      expect(emittedPerson.middleName).toBe('Middlename')
      expect(emittedPerson.lastName).toBe('Lastname')
    })

    it('@input - middle name change should be emitted', async (): Promise<void> => {
      const properties = ref({ value: new Person('Firstname', 'Middlename', 'Lastname') })
      const wrapper: Wrapper<BaseParty> = mount(BaseParty, { propsData: properties.value })

      wrapper.get('input[data-test-id="BaseParty.middleName"]').setValue('Newmiddlename')
      await Vue.nextTick()

      const emittedPerson = wrapper.emitted('input').slice(-1)[0][0]
      expect(emittedPerson.firstName).toBe('Firstname')
      expect(emittedPerson.middleName).toBe('Newmiddlename')
      expect(emittedPerson.lastName).toBe('Lastname')
    })

    it('@input - last name change should be emitted', async (): Promise<void> => {
      const properties = ref({ value: new Person('Firstname', 'Middlename', 'Lastname') })
      const wrapper: Wrapper<BaseParty> = mount(BaseParty, { propsData: properties.value })

      wrapper.get('input[data-test-id="BaseParty.lastName"]').setValue('Newlastname')
      await Vue.nextTick()

      const emittedPerson = wrapper.emitted('input').slice(-1)[0][0]
      expect(emittedPerson.firstName).toBe('Firstname')
      expect(emittedPerson.middleName).toBe('Middlename')
      expect(emittedPerson.lastName).toBe('Newlastname')
    })

    it('@valid - no names should be false', async (): Promise<void> => {
      const properties = ref({ value: new Person('', '', '') })
      const wrapper: Wrapper<BaseParty> = mount(BaseParty, { propsData: properties.value })

      wrapper.get('input[data-test-id="BaseParty.firstName"]').trigger('input')
      await Vue.nextTick()

      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBeFalsy()
    })

    it('@valid - first and middle names should be false', async (): Promise<void> => {
      const properties = ref({ value: new Person('Firstname', 'Middlename', '') })
      const wrapper: Wrapper<BaseParty> = mount(BaseParty, { propsData: properties.value })

      wrapper.get('input[data-test-id="BaseParty.firstName"]').trigger('input')
      await Vue.nextTick()

      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBeFalsy()
    })

    it('@valid - middle and last names should be false', async (): Promise<void> => {
      const properties = ref({ value: new Person('', 'Middlename', 'Lastname') })
      const wrapper: Wrapper<BaseParty> = mount(BaseParty, { propsData: properties.value })

      wrapper.get('input[data-test-id="BaseParty.firstName"]').trigger('input')
      await Vue.nextTick()

      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBeFalsy()
    })

    it('@valid - first and last names should be true', async (): Promise<void> => {
      const properties = ref({ value: new Person('Firstname', '', 'Lastname') })
      const wrapper: Wrapper<BaseParty> = mount(BaseParty, { propsData: properties.value })

      wrapper.get('input[data-test-id="BaseParty.firstName"]').trigger('input')
      await Vue.nextTick()

      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBeTruthy()
    })
  })
})
