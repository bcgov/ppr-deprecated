import Vue from 'vue'
import Vuetify from 'vuetify'
import VueCompositionApi, { ref } from '@vue/composition-api'
import { mount, Wrapper } from '@vue/test-utils'

import BaseParty from '@/components/BaseParty.vue'
import Person from '@/components/person'

Vue.use(Vuetify)
Vue.use(VueCompositionApi)

describe('BaseParty.vue', (): void => {
  it('Tests setting the first name', (): void => {
    const properties = ref({ value: new Person('Firstname', 'Middlename', 'Lastname') })
    const wrapper: Wrapper<BaseParty> = mount(BaseParty, { propsData: properties.value })

    const input = wrapper.get('input[data-test-id="BaseParty.firstName"]').element as HTMLInputElement
    expect(input.value).toBe('Firstname')
  })

  it('Tests setting the middle name', (): void => {
    const properties = ref({ value: new Person('Firstname', 'Middlename', 'Lastname') })
    const wrapper: Wrapper<BaseParty> = mount(BaseParty, { propsData: properties.value })

    const input = wrapper.get('input[data-test-id="BaseParty.middleName"]').element as HTMLInputElement
    expect(input.value).toBe('Middlename')
  })

  it('Tests setting the last name', (): void => {
    const properties = ref({ value: new Person('Firstname', 'Middlename', 'Lastname') })
    const wrapper: Wrapper<BaseParty> = mount(BaseParty, { propsData: properties.value })

    const input = wrapper.get('input[data-test-id="BaseParty.lastName"]').element as HTMLInputElement
    expect(input.value).toBe('Lastname')
  })

  it('Tests reactivity of the first name', async (): Promise<void> => {
    const person = new Person('Firstname', 'Middlename', 'Lastname')
    const properties = ref({ value: person })
    const wrapper: Wrapper<BaseParty> = mount(BaseParty, { propsData: properties.value })

    person.firstName = 'Newfirstname'
    await Vue.nextTick()

    const input = wrapper.get('input[data-test-id="BaseParty.firstName"]').element as HTMLInputElement
    expect(input.value).toBe('Newfirstname')
  })

  it('Tests reactivity of the middle name', async (): Promise<void> => {
    const person = new Person('Firstname', 'Middlename', 'Lastname')
    const properties = ref({ value: person })
    const wrapper: Wrapper<BaseParty> = mount(BaseParty, { propsData: properties.value })

    person.middleName = 'Newmiddlename'
    await Vue.nextTick()

    const input = wrapper.get('input[data-test-id="BaseParty.middleName"]').element as HTMLInputElement
    expect(input.value).toBe('Newmiddlename')
  })

  it('Tests reactivity of the last name', async (): Promise<void> => {
    const person = new Person('Firstname', 'Middlename', 'Lastname')
    const properties = ref({ value: person })
    const wrapper: Wrapper<BaseParty> = mount(BaseParty, { propsData: properties.value })

    person.lastName = 'Newlastname'
    await Vue.nextTick()

    const input = wrapper.get('input[data-test-id="BaseParty.lastName"]').element as HTMLInputElement
    expect(input.value).toBe('Newlastname')
  })

  it('Tests emit input on first name change', async (): Promise<void> => {
    const person = new Person('Firstname', 'Middlename', 'Lastname')
    const properties = ref({ value: person })
    const wrapper: Wrapper<BaseParty> = mount(BaseParty, { propsData: properties.value })

    wrapper.get('input[data-test-id="BaseParty.firstName"]').setValue('Newfirstname')
    await Vue.nextTick()

    const length = wrapper.emitted('input').length
    expect(wrapper.emitted('input')[length - 1][0].firstName).toBe('Newfirstname')
    expect(wrapper.emitted('input')[length - 1][0].middleName).toBe('Middlename')
    expect(wrapper.emitted('input')[length - 1][0].lastName).toBe('Lastname')
  })

  it('Tests emit input on middle name change', async (): Promise<void> => {
    const person = new Person('Firstname', 'Middlename', 'Lastname')
    const properties = ref({ value: person })
    const wrapper: Wrapper<BaseParty> = mount(BaseParty, { propsData: properties.value })

    wrapper.get('input[data-test-id="BaseParty.middleName"]').setValue('Newmiddlename')
    await Vue.nextTick()

    const length = wrapper.emitted('input').length
    expect(wrapper.emitted('input')[length - 1][0].firstName).toBe('Firstname')
    expect(wrapper.emitted('input')[length - 1][0].middleName).toBe('Newmiddlename')
    expect(wrapper.emitted('input')[length - 1][0].lastName).toBe('Lastname')
  })

  it('Tests emit input on last name change', async (): Promise<void> => {
    const person = new Person('Firstname', 'Middlename', 'Lastname')
    const properties = ref({ value: person })
    const wrapper: Wrapper<BaseParty> = mount(BaseParty, { propsData: properties.value })

    wrapper.get('input[data-test-id="BaseParty.lastName"]').setValue('Newlastname')
    await Vue.nextTick()

    const length = wrapper.emitted('input').length
    expect(wrapper.emitted('input')[length - 1][0].firstName).toBe('Firstname')
    expect(wrapper.emitted('input')[length - 1][0].middleName).toBe('Middlename')
    expect(wrapper.emitted('input')[length - 1][0].lastName).toBe('Newlastname')
  })

  it('Tests emit valid false on no names', async (): Promise<void> => {
    const person = new Person('', '', '')
    const properties = ref({ value: person })
    const wrapper: Wrapper<BaseParty> = mount(BaseParty, { propsData: properties.value })

    wrapper.get('input[data-test-id="BaseParty.firstName"]').trigger('input')
    await Vue.nextTick()

    const length = wrapper.emitted('valid').length
    expect(wrapper.emitted('valid')[length - 1][0]).toBeFalsy()
  })
})
