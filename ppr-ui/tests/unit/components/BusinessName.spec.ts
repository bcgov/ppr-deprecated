import Vue from 'vue'
import VueCompositionApi, { ref } from '@vue/composition-api'
import { mount, Wrapper } from '@vue/test-utils'
import Vuetify from 'vuetify'

import BusinessName from '@/components/BusinessName.vue'
import { BusinessNameModel } from '@/components/business-model'

Vue.use(Vuetify)
Vue.use(VueCompositionApi)
const vuetify = new Vuetify()

describe('BusinessName.vue', (): void => {
  describe(':props', (): void => {

    // General form tests.

    it(':editing - true, inputs exist', (): void => {
      const properties = ref({ editing: true, value: new BusinessNameModel() })
      const wrapper: Wrapper<Vue> = mount(BusinessName, { propsData: properties.value, vuetify })

      expect(wrapper.findAll('input').exists()).toBeTruthy()
    })

    it(':editing - false by default, inputs do not exist', (): void => {
      const properties = ref({ value: new BusinessNameModel() })
      const wrapper: Wrapper<Vue> = mount(BusinessName, { propsData: properties.value, vuetify })

      expect(wrapper.findAll('input').exists()).toBeFalsy()
    })

    it(':editing - false, inputs do not exist', (): void => {
      const properties = ref({ editing: false, value: new BusinessNameModel() })
      const wrapper: Wrapper<Vue> = mount(BusinessName, { propsData: properties.value, vuetify })

      expect(wrapper.findAll('input').exists()).toBeFalsy()
    })

    it(':editing - reactivity test', async (): Promise<void> => {
      const properties = ref<{ editing: boolean; value: BusinessNameModel }>({
        editing: false,
        value: new BusinessNameModel()
      })
      const wrapper: Wrapper<Vue> = mount(BusinessName, { propsData: properties.value, vuetify })

      expect(wrapper.findAll('input').exists()).toBeFalsy()
      properties.value.editing = true
      await Vue.nextTick()
      expect(wrapper.findAll('input').exists()).toBeTruthy()
      properties.value.editing = false
      await Vue.nextTick()
      expect(wrapper.findAll('input').exists()).toBeFalsy()
    })

    // Tests for the business name field.
    it(':editing - true, name input exists and contains value', (): void => {
      const expected = 'business Name'
      const model = new BusinessNameModel(expected)
      const properties = ref({ editing: true, value: model })
      const wrapper: Wrapper<Vue> = mount(BusinessName, { propsData: properties.value, vuetify })

      expect(wrapper.find('[data-test-id="BusinessName.input.name"]').exists()).toBeTruthy()
      const element = wrapper.get('[data-test-id="BusinessName.input.name"]').element as HTMLInputElement
      expect(element.value).toBe(expected)
    })

    it(':editing - false, name display exists and contains value', (): void => {
      const expected = 'business Name'
      const model = new BusinessNameModel(expected)
      const properties = ref({ editing: false, value: model })
      const wrapper: Wrapper<Vue> = mount(BusinessName, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="BusinessName.display.name"]')
      expect(element.text()).toBe(expected)
    })

    it(':value - editing true, name field reactivity test', async (): Promise<void> => {
      const expected = 'business Name'
      const properties = ref<{ editing: boolean; value: BusinessNameModel }>({
        editing: true,
        value: new BusinessNameModel()
      })
      const wrapper: Wrapper<Vue> = mount(BusinessName, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="BusinessName.input.name"]').element as HTMLInputElement
      expect(element.value).toBe('')
      properties.value.value = new BusinessNameModel(expected)
      await Vue.nextTick()
      expect(element.value).toBe(expected)
    })

    it(':value - editing false, name field reactivity test', async (): Promise<void> => {
      const expected = 'business name'
      const properties = ref<{ editing: boolean; value: BusinessNameModel }>({
        editing: false,
        value: new BusinessNameModel()
      })
      const wrapper: Wrapper<Vue> = mount(BusinessName, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="BusinessName.display.name"]')
      expect(element.text()).toBe('')
      properties.value.value = new BusinessNameModel(expected)
      await Vue.nextTick()
      expect(element.text()).toBe(expected)
    })
  })
  describe('@events', (): void => {
    it('@input - business name change should be emitted', async (): Promise<void> => {
      const properties = ref({ editing: true, value: new BusinessNameModel('BusinessName') })
      const wrapper: Wrapper<Vue> = mount(BusinessName, { propsData: properties.value, vuetify })

      wrapper.get('input[data-test-id="BusinessName.input.name"]').setValue('NewBusinessName')
      await Vue.nextTick()

      const emittedBusiness = wrapper.emitted('input').slice(-1)[0][0]
      expect(emittedBusiness.businessName).toBe('NewBusinessName')
    })

    // Valid events
    it('@valid - empty business name should emit invalid', async (): Promise<void> => {
      const properties = ref({ editing: true, value: new BusinessNameModel() })
      const wrapper: Wrapper<Vue> = mount(BusinessName, { propsData: properties.value, vuetify })

      await Vue.nextTick()

      const emitted = wrapper.emitted('valid').slice(-1)[0][0]
      expect(emitted).toBe(false)
    })

    it('@valid - non empty business name should emit valid', async (): Promise<void> => {
      const properties = ref({ editing: true, value: new BusinessNameModel('a business') })
      const wrapper: Wrapper<Vue> = mount(BusinessName, { propsData: properties.value, vuetify })

      await Vue.nextTick()

      const emitted = wrapper.emitted('valid').slice(-1)[0][0]
      expect(emitted).toBe(true)
    })

  })
})
