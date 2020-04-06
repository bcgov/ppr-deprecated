import Vue from 'vue'
import Vuetify from 'vuetify'
import VueCompositionApi, { ref } from '@vue/composition-api'
import { mount, Wrapper } from '@vue/test-utils'

import BaseParty from '@/base-party/BaseParty.vue'
import { BasePartyModel } from '@/base-party/base-party-model'
import { BusinessNameModel } from '@/components/business-name-model'
import { PersonNameModel } from '@/components/person-name-model'

Vue.use(Vuetify)
Vue.use(VueCompositionApi)
const vuetify = new Vuetify()

describe('BaseParty.vue', (): void => {
  describe(':props', (): void => {
    // General form tests.

    it(':editing - true, inputs exist', (): void => {
      const properties = ref({ editing: true })
      const wrapper: Wrapper<Vue> = mount(BaseParty, { propsData: properties.value, vuetify })

      expect(wrapper.findAll('input').exists()).toBeTruthy()
    })

    it(':editing - false by default, inputs do not exist', (): void => {
      const wrapper: Wrapper<Vue> = mount(BaseParty, { vuetify })

      expect(wrapper.findAll('input').exists()).toBeFalsy()
    })

    it(':editing - false, inputs do not exist', (): void => {
      const properties = ref({ editing: false })
      const wrapper: Wrapper<Vue> = mount(BaseParty, { propsData: properties.value, vuetify })

      expect(wrapper.findAll('input').exists()).toBeFalsy()
    })

    it(':editing - reactivity test for inputs', async (): Promise<void> => {
      const properties = ref<{ editing: boolean; value: BasePartyModel }>({
        editing: false,
        value: new BasePartyModel()
      })
      const wrapper: Wrapper<Vue> = mount(BaseParty, { propsData: properties.value, vuetify })

      expect(wrapper.findAll('input').exists()).toBeFalsy()
      properties.value.editing = true
      await Vue.nextTick()
      expect(wrapper.findAll('input').exists()).toBeTruthy()
      properties.value.editing = false
      await Vue.nextTick()
      expect(wrapper.findAll('input').exists()).toBeFalsy()
    })

    // :editing Tests for the type selection.
    it(':editing - true, radio controls exists', (): void => {
      const properties = ref({ editing: true })
      const wrapper: Wrapper<Vue> = mount(BaseParty, { propsData: properties.value, vuetify })

      expect(wrapper.find('[data-test-id="BaseParty.radio.business"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test-id="BaseParty.radio.person"]').exists()).toBeTruthy()
    })

    it(':editing - false, radio controls does not exists', (): void => {
      const properties = ref({ editing: false })
      const wrapper: Wrapper<Vue> = mount(BaseParty, { propsData: properties.value, vuetify })

      expect(wrapper.find('[data-test-id="BaseParty.radio.business"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test-id="BaseParty.radio.person"]').exists()).toBeFalsy()
    })

    it(':editing - reactivity test', async (): Promise<void> => {
      const properties = ref<{ editing: boolean; value: BasePartyModel }>({
        editing: false,
        value: new BasePartyModel()
      })
      const wrapper: Wrapper<Vue> = mount(BaseParty, { propsData: properties.value, vuetify })

      // let element
      expect(wrapper.find('[data-test-id="BaseParty.radio.business"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test-id="BaseParty.radio.person"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test-id="BaseParty.form"]').attributes().class).not.toContain('invalid')

      properties.value.editing = true
      await Vue.nextTick()
      expect(wrapper.find('[data-test-id="BaseParty.radio.person"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test-id="BaseParty.form"]').attributes().class).toContain('invalid')

      properties.value.editing = false
      await Vue.nextTick()
      expect(wrapper.find('[data-test-id="BaseParty.radio.business"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test-id="BaseParty.radio.person"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test-id="BaseParty.form"]').attributes().class).not.toContain('invalid')
    })
  })

  describe('@events', (): void => {
    it('@input - select business show business name not person name', async (): Promise<void> => {
      const properties = ref({ editing: true })
      const wrapper: Wrapper<Vue> = mount(BaseParty, { propsData: properties.value, vuetify })

      wrapper.find('[data-test-id="BaseParty.radio.business"]').trigger('click')
      await Vue.nextTick()

      expect(wrapper.find('[data-test-id="BaseParty.business"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test-id="BaseParty.person"]').exists()).toBeFalsy()
    })

    it('@input - select person show person name not business name', async (): Promise<void> => {
      const properties = ref({ editing: true })
      const wrapper: Wrapper<Vue> = mount(BaseParty, { propsData: properties.value, vuetify })

      wrapper.find('[data-test-id="BaseParty.radio.person"]').trigger('click')
      await Vue.nextTick()

      expect(wrapper.find('[data-test-id="BaseParty.business"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test-id="BaseParty.person"]').exists()).toBeTruthy()
    })

    // Valid events
    it('@valid - empty business name should emit invalid', async (): Promise<void> => {
      const model = new BasePartyModel(undefined, undefined)
      const properties = ref({ editing: true, value: model })
      const wrapper: Wrapper<Vue> = mount(BaseParty, { propsData: properties.value, vuetify })

      wrapper.find('[data-test-id="BaseParty.radio.business"]').trigger('click')
      await Vue.nextTick()

      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBe(false)
    })

    it('@valid - empty person name should emit invalid', async (): Promise<void> => {
      const model = new BasePartyModel(undefined, undefined)
      const properties = ref({ editing: true, value: model })
      const wrapper: Wrapper<Vue> = mount(BaseParty, { propsData: properties.value, vuetify })

      wrapper.find('[data-test-id="BaseParty.radio.person"]').trigger('click')
      await Vue.nextTick()

      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBe(false)
    })

    it('@valid - non empty business name should emit valid', async (): Promise<void> => {
      const model = new BasePartyModel(new BusinessNameModel('abusiness'), undefined)
      const properties = ref({ editing: true, value: model })
      const wrapper: Wrapper<Vue> = mount(BaseParty, { propsData: properties.value, vuetify })

      wrapper.find('[data-test-id="BaseParty.radio.business"]').trigger('click')
      await Vue.nextTick()

      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBe(true)
    })

    it('@valid - non empty person name should emit valid', async (): Promise<void> => {
      const model = new BasePartyModel(undefined, new PersonNameModel('a person', 'm', 'last'))
      const properties = ref({ editing: true, value: model })
      const wrapper: Wrapper<Vue> = mount(BaseParty, { propsData: properties.value, vuetify })

      wrapper.find('[data-test-id="BaseParty.radio.person"]').trigger('click')
      await Vue.nextTick()

      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBe(true)
    })

    it('@valid - reactive change to business name should validate', async (): Promise<void> => {
      const model = new BasePartyModel(undefined, undefined)
      const properties = ref({ editing: true, value: model })
      const wrapper: Wrapper<Vue> = mount(BaseParty, { propsData: properties.value, vuetify })

      wrapper.find('[data-test-id="BaseParty.radio.business"]').trigger('click')
      await Vue.nextTick()
      wrapper.get('input[data-test-id="BusinessName.input.name"]').setValue('NewBusinessName')
      await Vue.nextTick()
      await Vue.nextTick()

      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBe(true)
    })

    it('@valid - reactive change to person name should validate', async (): Promise<void> => {
      const model = new BasePartyModel(undefined, undefined)
      const properties = ref({ editing: true, value: model })
      const wrapper: Wrapper<Vue> = mount(BaseParty, { propsData: properties.value, vuetify })

      wrapper.find('[data-test-id="BaseParty.radio.person"]').trigger('click')
      await Vue.nextTick()
      wrapper.get('input[data-test-id="PersonName.first"]').setValue('afirst')
      wrapper.get('input[data-test-id="PersonName.last"]').setValue('alast')
      await Vue.nextTick()
      await Vue.nextTick()

      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBe(true)
    })

    it('@valid - reactive change to business then person name should validate', async (): Promise<void> => {
      const model = new BasePartyModel(undefined, undefined)
      const properties = ref({ editing: true, value: model })
      const wrapper: Wrapper<Vue> = mount(BaseParty, { propsData: properties.value, vuetify })

      wrapper.find('[data-test-id="BaseParty.radio.business"]').trigger('click')
      await Vue.nextTick()
      wrapper.find('[data-test-id="BaseParty.radio.person"]').trigger('click')
      await Vue.nextTick()
      wrapper.get('input[data-test-id="PersonName.first"]').setValue('afirst')
      wrapper.get('input[data-test-id="PersonName.last"]').setValue('alast')
      await Vue.nextTick()
      await Vue.nextTick()

      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBe(true)
    })

    it('@valid - reactive change to person then business name should validate', async (): Promise<void> => {
      const model = new BasePartyModel(undefined, undefined)
      const properties = ref({ editing: true, value: model })
      const wrapper: Wrapper<Vue> = mount(BaseParty, { propsData: properties.value, vuetify })

      wrapper.find('[data-test-id="BaseParty.radio.person"]').trigger('click')
      await Vue.nextTick()
      wrapper.find('[data-test-id="BaseParty.radio.business"]').trigger('click')
      await Vue.nextTick()
      wrapper.get('input[data-test-id="BusinessName.input.name"]').setValue('abusiness')
      await Vue.nextTick()
      await Vue.nextTick()

      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBe(true)
    })
  })

  describe('radio button state', (): void => {
    it('base party with business name should be visible and radio button set', async (): Promise<void> => {
      const model = new BasePartyModel(new BusinessNameModel('abusiness'), undefined)
      const properties = ref({ editing: true, value: model })
      const wrapper: Wrapper<Vue> = mount(BaseParty, { propsData: properties.value, vuetify })

      const radioBusiness = wrapper.get('[data-test-id="BaseParty.radio.business"]').element as HTMLInputElement
      expect(radioBusiness.checked).toBe(true)
      const radioPerson = wrapper.get('[data-test-id="BaseParty.radio.person"]').element as HTMLInputElement
      expect(radioPerson.checked).toBe(false)
    })

    it('base party with person name should be visible and radio button set', async (): Promise<void> => {
      const model = new BasePartyModel(undefined, new PersonNameModel('first', undefined, 'last'))
      const properties = ref({ editing: true, value: model })
      const wrapper: Wrapper<Vue> = mount(BaseParty, { propsData: properties.value, vuetify })

      const radioBusiness = wrapper.get('[data-test-id="BaseParty.radio.business"]').element as HTMLInputElement
      expect(radioBusiness.checked).toBe(false)
      const radioPerson = wrapper.get('[data-test-id="BaseParty.radio.person"]').element as HTMLInputElement
      expect(radioPerson.checked).toBe(true)
    })
  })
})
