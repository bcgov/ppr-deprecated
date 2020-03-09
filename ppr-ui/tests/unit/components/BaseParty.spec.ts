import Vue from 'vue'
import Vuetify from 'vuetify'
import VueCompositionApi, { ref } from '@vue/composition-api'
import { mount, Wrapper } from '@vue/test-utils'

import BaseParty from '@/base-party/BaseParty.vue'
import { BasePartyModel } from '@/base-party/base-party-model'
// import { BusinessModel } from '@/components/business-model'
// import { PersonNameModel } from '@/components/person-name-model'


Vue.use(Vuetify)
Vue.use(VueCompositionApi)
const vuetify = new Vuetify()


describe('BaseParty.vue', (): void => {
  describe(':props', (): void => {
    // General form tests.

    it(':editing - true, inputs exist', (): void => {
      const properties = ref({ editing: true, value: new BasePartyModel() })
      const wrapper: Wrapper<Vue> = mount(BaseParty, { propsData: properties.value, vuetify })

      expect(wrapper.findAll('input').exists()).toBeTruthy()
    })

    it(':editing - false by default, inputs do not exist', (): void => {
      const properties = ref({ value: new BasePartyModel() })
      const wrapper: Wrapper<Vue> = mount(BaseParty, { propsData: properties.value, vuetify })

      expect(wrapper.findAll('input').exists()).toBeFalsy()
    })

    it(':editing - false contains no inputs', (): void => {
      const properties = ref({ value: new BasePartyModel() })
      const wrapper: Wrapper<Vue> = mount(BaseParty, { propsData: properties.value })

      expect(wrapper.findAll('input').exists()).toBeFalsy()
    })

    it(':editing - false, inputs do not exist', (): void => {
      const properties = ref({ editing: false, value: new BasePartyModel() })
      const wrapper: Wrapper<Vue> = mount(BaseParty, { propsData: properties.value, vuetify })

      expect(wrapper.findAll('input').exists()).toBeFalsy()
    })

    it(':editing - reactivity test', async (): Promise<void> => {
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
      const model = new BasePartyModel()
      const properties = ref({ editing: true, value: model })
      const wrapper: Wrapper<Vue> = mount(BaseParty, { propsData: properties.value, vuetify })

      let element = wrapper.get('[data-test-id="BaseParty.radio.business"]').element as HTMLInputElement
      expect(element).toBeDefined()
      element = wrapper.get('[data-test-id="BaseParty.radio.person"]').element as HTMLInputElement
      expect(element).toBeDefined()
    })

    it(':editing - false, radio controls does not exists', (): void => {
      const model = new BasePartyModel()
      const properties = ref({ editing: false, value: model })
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

      let element
      expect(wrapper.find('[data-test-id="BaseParty.radio.business"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test-id="BaseParty.radio.person"]').exists()).toBeFalsy()

      properties.value.editing = true
      await Vue.nextTick()
      element = wrapper.get('[data-test-id="BaseParty.radio.business"]').element as HTMLInputElement
      expect(element).toBeDefined()
      element = wrapper.get('[data-test-id="BaseParty.radio.person"]').element as HTMLInputElement
      expect(element).toBeDefined()

      properties.value.editing = false
      await Vue.nextTick()
      expect(wrapper.find('[data-test-id="BaseParty.radio.business"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test-id="BaseParty.radio.person"]').exists()).toBeFalsy()
    })

    it(':editing - true, radio controls exists', (): void => {
      const model = new BasePartyModel()
      const properties = ref({ editing: true, value: model })
      const wrapper: Wrapper<Vue> = mount(BaseParty, { propsData: properties.value, vuetify })

      let element = wrapper.get('[data-test-id="BaseParty.radio.business"]').element as HTMLInputElement
      expect(element).toBeDefined()
      element = wrapper.get('[data-test-id="BaseParty.radio.person"]').element as HTMLInputElement
      expect(element).toBeDefined()
    })

  })
  describe('@events', (): void => {
    it('@input - select business show business name not person name', async (): Promise<void> => {
      const properties = ref({ editing: true, value: new BasePartyModel() })
      const wrapper: Wrapper<Vue> = mount(BaseParty, { propsData: properties.value, vuetify })

      wrapper.find('[data-test-id="BaseParty.radio.business"]').trigger('click')
      await Vue.nextTick()

      let component = wrapper.get('[data-test-id="BaseParty.business"]').element
      expect(component).toBeDefined()
      expect(wrapper.find('[data-test-id="BaseParty.person"]').isVisible()).toBeFalsy()
    })

    it('@input - select person show person name not business name', async (): Promise<void> => {
      const properties = ref({ editing: true, value: new BasePartyModel() })
      const wrapper: Wrapper<Vue> = mount(BaseParty, { propsData: properties.value, vuetify })

      wrapper.find('[data-test-id="BaseParty.radio.person"]').trigger('click')
      await Vue.nextTick()

      let component = wrapper.get('[data-test-id="BaseParty.person"]').element
      expect(component).toBeDefined()
      expect(wrapper.find('[data-test-id="BaseParty.business"]').isVisible()).toBeFalsy()
    })

    // because we unit test the inner business components we're done
  })
})
