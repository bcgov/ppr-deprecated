import Vue from 'vue'
import Vuetify from 'vuetify'
import VueCompositionApi, { ref } from '@vue/composition-api'
import { mount, Wrapper } from '@vue/test-utils'

import PersonName from '@/components/PersonName.vue'
import { PersonNameModel } from '@/components/person-name-model'

Vue.use(Vuetify)
Vue.use(VueCompositionApi)

describe('PersonName.vue', (): void => {
  describe(':props', (): void => {
    it(':editing - false contains no inputs', (): void => {
      const properties = ref({ value: new PersonNameModel() })
      const wrapper: Wrapper<Vue> = mount(PersonName, { propsData: properties.value })

      expect(wrapper.findAll('input').exists()).toBeFalsy()
    })

    it(':editing - false contains name components', (): void => {
      const properties = ref({ value: new PersonNameModel('Firstname', 'Middlename', 'Lastname') })
      const wrapper: Wrapper<Vue> = mount(PersonName, { propsData: properties.value })

      expect(wrapper.text()).toContain('Firstname')
      expect(wrapper.text()).toContain('Middlename')
      expect(wrapper.text()).toContain('Lastname')
    })

    it(':value - empty for default constructor', (): void => {
      const properties = ref({ editing: true, value: new PersonNameModel() })
      const wrapper: Wrapper<Vue> = mount(PersonName, { propsData: properties.value })

      let input = wrapper.get('input[data-test-id="PersonName.first"]').element as HTMLInputElement
      expect(input.value).toBe('')
      input = wrapper.get('input[data-test-id="PersonName.middle"]').element as HTMLInputElement
      expect(input.value).toBe('')
      input = wrapper.get('input[data-test-id="PersonName.last"]').element as HTMLInputElement
      expect(input.value).toBe('')
    })

    it(':value - setting the first name', (): void => {
      const properties = ref({ editing: true, value: new PersonNameModel('Firstname', 'Middlename', 'Lastname') })
      const wrapper: Wrapper<Vue> = mount(PersonName, { propsData: properties.value })

      const input = wrapper.get('input[data-test-id="PersonName.first"]').element as HTMLInputElement
      expect(input.value).toBe('Firstname')
    })

    it(':value - setting the middle name', (): void => {
      const properties = ref({ editing: true, value: new PersonNameModel('Firstname', 'Middlename', 'Lastname') })
      const wrapper: Wrapper<Vue> = mount(PersonName, { propsData: properties.value })

      const input = wrapper.get('input[data-test-id="PersonName.middle"]').element as HTMLInputElement
      expect(input.value).toBe('Middlename')
    })

    it(':value - setting the last name', (): void => {
      const properties = ref({ editing: true, value: new PersonNameModel('Firstname', 'Middlename', 'Lastname') })
      const wrapper: Wrapper<Vue> = mount(PersonName, { propsData: properties.value })

      const input = wrapper.get('input[data-test-id="PersonName.last"]').element as HTMLInputElement
      expect(input.value).toBe('Lastname')
    })

    it(':value - reactivity of the first name', async (): Promise<void> => {
      const properties = ref<{ editing: boolean; value: PersonNameModel }>({
        editing: true,
        value: new PersonNameModel('Firstname', 'Middlename', 'Lastname')
      })
      const wrapper: Wrapper<Vue> = mount(PersonName, { propsData: properties.value })

      properties.value.value = new PersonNameModel('Newfirstname', 'Middlename', 'Lastname')
      await Vue.nextTick()

      let input = wrapper.get('input[data-test-id="PersonName.first"]').element as HTMLInputElement
      expect(input.value).toBe('Newfirstname')
      input = wrapper.get('input[data-test-id="PersonName.middle"]').element as HTMLInputElement
      expect(input.value).toBe('Middlename')
      input = wrapper.get('input[data-test-id="PersonName.last"]').element as HTMLInputElement
      expect(input.value).toBe('Lastname')
    })

    it(':value - reactivity of the middle name', async (): Promise<void> => {
      const properties = ref<{ editing: boolean; value: PersonNameModel }>({
        editing: true,
        value: new PersonNameModel('Firstname', 'Middlename', 'Lastname')
      })
      const wrapper: Wrapper<Vue> = mount(PersonName, { propsData: properties.value })

      properties.value.value = new PersonNameModel('Firstname', 'Newmiddlename', 'Lastname')
      await Vue.nextTick()

      let input = wrapper.get('input[data-test-id="PersonName.first"]').element as HTMLInputElement
      expect(input.value).toBe('Firstname')
      input = wrapper.get('input[data-test-id="PersonName.middle"]').element as HTMLInputElement
      expect(input.value).toBe('Newmiddlename')
      input = wrapper.get('input[data-test-id="PersonName.last"]').element as HTMLInputElement
      expect(input.value).toBe('Lastname')
    })

    it(':value - reactivity of the last name', async (): Promise<void> => {
      const properties = ref<{ editing: boolean; value: PersonNameModel }>({
        editing: true,
        value: new PersonNameModel('Firstname', 'Middlename', 'Lastname')
      })
      const wrapper: Wrapper<Vue> = mount(PersonName, { propsData: properties.value })

      properties.value.value = new PersonNameModel('Firstname', 'Middlename', 'Newlastname')
      await Vue.nextTick()

      let input = wrapper.get('input[data-test-id="PersonName.first"]').element as HTMLInputElement
      expect(input.value).toBe('Firstname')
      input = wrapper.get('input[data-test-id="PersonName.middle"]').element as HTMLInputElement
      expect(input.value).toBe('Middlename')
      input = wrapper.get('input[data-test-id="PersonName.last"]').element as HTMLInputElement
      expect(input.value).toBe('Newlastname')
    })
  })

  describe('@events', (): void => {
    it('@input - first name change should be emitted', async (): Promise<void> => {
      const properties = ref({ editing: true, value: new PersonNameModel('Firstname', 'Middlename', 'Lastname') })
      const wrapper: Wrapper<Vue> = mount(PersonName, { propsData: properties.value })

      wrapper.get('input[data-test-id="PersonName.first"]').setValue('Newfirstname')
      await Vue.nextTick()

      const emittedPerson = wrapper.emitted('input').slice(-1)[0][0]
      expect(emittedPerson.first).toBe('Newfirstname')
      expect(emittedPerson.middle).toBe('Middlename')
      expect(emittedPerson.last).toBe('Lastname')
    })

    it('@input - middle name change should be emitted', async (): Promise<void> => {
      const properties = ref({ editing: true, value: new PersonNameModel('Firstname', 'Middlename', 'Lastname') })
      const wrapper: Wrapper<Vue> = mount(PersonName, { propsData: properties.value })

      wrapper.get('input[data-test-id="PersonName.middle"]').setValue('Newmiddlename')
      await Vue.nextTick()

      const emittedPerson = wrapper.emitted('input').slice(-1)[0][0]
      expect(emittedPerson.first).toBe('Firstname')
      expect(emittedPerson.middle).toBe('Newmiddlename')
      expect(emittedPerson.last).toBe('Lastname')
    })

    it('@input - last name change should be emitted', async (): Promise<void> => {
      const properties = ref({ editing: true, value: new PersonNameModel('Firstname', 'Middlename', 'Lastname') })
      const wrapper: Wrapper<Vue> = mount(PersonName, { propsData: properties.value })

      wrapper.get('input[data-test-id="PersonName.last"]').setValue('Newlastname')
      await Vue.nextTick()

      const emittedPerson = wrapper.emitted('input').slice(-1)[0][0]
      expect(emittedPerson.first).toBe('Firstname')
      expect(emittedPerson.middle).toBe('Middlename')
      expect(emittedPerson.last).toBe('Newlastname')
    })

    it('@valid - no names should be false', async (): Promise<void> => {
      const properties = ref({ editing: true, value: new PersonNameModel('', '', '') })
      const wrapper: Wrapper<Vue> = mount(PersonName, { propsData: properties.value })

      wrapper.get('input[data-test-id="PersonName.first"]').trigger('input')
      await Vue.nextTick()

      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBeFalsy()
    })

    it('@valid - first and middle names should be false', async (): Promise<void> => {
      const properties = ref({ editing: true, value: new PersonNameModel('Firstname', 'Middlename', '') })
      const wrapper: Wrapper<Vue> = mount(PersonName, { propsData: properties.value })

      wrapper.get('input[data-test-id="PersonName.first"]').trigger('input')
      await Vue.nextTick()

      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBeFalsy()
    })

    it('@valid - middle and last names should be false', async (): Promise<void> => {
      const properties = ref({ editing: true, value: new PersonNameModel('', 'Middlename', 'Lastname') })
      const wrapper: Wrapper<Vue> = mount(PersonName, { propsData: properties.value })

      wrapper.get('input[data-test-id="PersonName.first"]').trigger('input')
      await Vue.nextTick()

      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBeFalsy()
    })

    it('@valid - first and last names should be true', async (): Promise<void> => {
      const properties = ref({ editing: true, value: new PersonNameModel('Firstname', '', 'Lastname') })
      const wrapper: Wrapper<Vue> = mount(PersonName, { propsData: properties.value })

      wrapper.get('input[data-test-id="PersonName.first"]').trigger('input')
      await Vue.nextTick()

      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBeTruthy()
    })
  })
})
