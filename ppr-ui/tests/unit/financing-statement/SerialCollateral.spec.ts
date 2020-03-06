import Vue from 'vue'
import VueCompositionApi, { ref } from '@vue/composition-api'
import { mount, Wrapper } from '@vue/test-utils'
import Vuetify from 'vuetify'

import SerialCollateral from '@/financing-statement/SerialCollateral.vue'
import { SerialCollateralModel } from '@/financing-statement/serial-collateral-model'
import { SerialCollateralType } from '@/financing-statement/serial-collateral-type'

Vue.use(Vuetify)
Vue.use(VueCompositionApi)

const vuetify = new Vuetify()

describe('SerialCollateral.vue', (): void => {
  describe(':props', (): void => {
    // General form tests.

    it(':editing - true, inputs exist', (): void => {
      const properties = ref({ editing: true, value: new SerialCollateralModel() })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      expect(wrapper.findAll('input').exists()).toBeTruthy()
    })

    it(':editing - false by default, inputs do not exist', (): void => {
      const properties = ref({ value: new SerialCollateralModel() })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      expect(wrapper.findAll('input').exists()).toBeFalsy()
    })

    it(':editing - false, inputs do not exist', (): void => {
      const properties = ref({ editing: false, value: new SerialCollateralModel() })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      expect(wrapper.findAll('input').exists()).toBeFalsy()
    })

    it(':editing - reactivity test', async (): Promise<void> => {
      const properties = ref<{ editing: boolean; value: SerialCollateralModel }>({
        editing: false,
        value: new SerialCollateralModel()
      })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      expect(wrapper.findAll('input').exists()).toBeFalsy()
      properties.value.editing = true
      await Vue.nextTick()
      expect(wrapper.findAll('input').exists()).toBeTruthy()
      properties.value.editing = false
      await Vue.nextTick()
      expect(wrapper.findAll('input').exists()).toBeFalsy()
    })

    // Tests for the "make" field.

    it(':editing - true, make input exists and contains value', (): void => {
      const serialCollateral = new SerialCollateralModel(undefined, 'Kawasaki')
      const properties = ref({ editing: true, value: serialCollateral })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="SerialCollateral.input.make"]').element as HTMLInputElement
      expect(element.value).toBe('Kawasaki')
    })

    it(':editing - false, make display exists and contains value', (): void => {
      const serialCollateral = new SerialCollateralModel(undefined, 'Kawasaki')
      const properties = ref({ editing: false, value: serialCollateral })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="SerialCollateral.display.make"]')
      expect(element.text()).toBe('Kawasaki')
    })

    it(':value - editing true, make field reactivity test', async (): Promise<void> => {
      const properties = ref<{ editing: boolean; value: SerialCollateralModel }>({
        editing: true,
        value: new SerialCollateralModel()
      })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="SerialCollateral.input.make"]').element as HTMLInputElement
      expect(element.value).toBe('')
      properties.value.value = new SerialCollateralModel(undefined, 'Kawasaki')
      await Vue.nextTick()
      expect(element.value).toBe('Kawasaki')
    })

    it(':value - editing false, make field reactivity test', async (): Promise<void> => {
      const properties = ref<{ editing: boolean; value: SerialCollateralModel }>({
        editing: false,
        value: new SerialCollateralModel()
      })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="SerialCollateral.display.make"]')
      expect(element.text()).toBe('')
      properties.value.value = new SerialCollateralModel(undefined, 'Kawasaki')
      await Vue.nextTick()
      expect(element.text()).toBe('Kawasaki')
    })

    // Tests for the "manufacturedHomeRegNumber" field.

    it(':editing - true, MH# input does not exist when type not MANUFACTURED HOME', (): void => {
      const serialCollateral = new SerialCollateralModel(undefined, SerialCollateralType.BOAT)
      const properties = ref({ editing: true, value: serialCollateral })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.find('[data-test-id="SerialCollateral.input.manufacturedHomeRegNumber"]')
      expect(element.exists()).toBeFalsy()
    })

    it(':editing - false, MH# display does not exist when type not MANUFACTURED HOME', (): void => {
      const serialCollateral = new SerialCollateralModel(undefined, SerialCollateralType.BOAT)
      const properties = ref({ editing: true, value: serialCollateral })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.find('[data-test-id="SerialCollateral.display.manufacturedHomeRegNumber"]')
      expect(element.exists()).toBeFalsy()
    })

    it(':editing - true, MH# input is set when type MANUFACTURED HOME', (): void => {
      const serialCollateral = new SerialCollateralModel(SerialCollateralType.MANUFACTURED_HOME, undefined,
        undefined, undefined, 'ABC123')
      const properties = ref({ editing: true, value: serialCollateral })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="SerialCollateral.input.manufacturedHomeRegNumber"]').element as
        HTMLInputElement
      expect(element.value).toBe('ABC123')
    })

    it(':editing - false, MH# display is set when type MANUFACTURED HOME', (): void => {
      const serialCollateral = new SerialCollateralModel(SerialCollateralType.MANUFACTURED_HOME, undefined,
        undefined, undefined, 'ABC123')
      const properties = ref({ editing: false, value: serialCollateral })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.find('[data-test-id="SerialCollateral.display.manufacturedHomeRegNumber"]')
      expect(element.text()).toBe('ABC123')
    })

    it(':value - editing true, manufacturedHomeRegNumber field reactivity test', async (): Promise<void> => {
      const properties = ref<{ editing: boolean; value: SerialCollateralModel }>({
        editing: true,
        value: new SerialCollateralModel(SerialCollateralType.MANUFACTURED_HOME)
      })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="SerialCollateral.input.manufacturedHomeRegNumber"]').element as
        HTMLInputElement
      expect(element.value).toBe('')
      properties.value.value = new SerialCollateralModel(SerialCollateralType.MANUFACTURED_HOME, undefined, undefined,
        undefined, 'MH12345')
      await Vue.nextTick()
      expect(element.value).toBe('MH12345')
    })

    it(':value - editing false, manufacturedHomeRegNumber field reactivity test', async (): Promise<void> => {
      const properties = ref<{ editing: boolean; value: SerialCollateralModel }>({
        editing: false,
        value: new SerialCollateralModel(SerialCollateralType.MANUFACTURED_HOME)
      })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="SerialCollateral.display.manufacturedHomeRegNumber"]')
      expect(element.text()).toBe('')
      properties.value.value = new SerialCollateralModel(SerialCollateralType.MANUFACTURED_HOME, undefined, undefined,
        undefined, 'MH12345')
      await Vue.nextTick()
      expect(element.text()).toBe('MH12345')
    })

    // Tests for the "model" field.

    it(':editing - true, contains model', (): void => {
      const serialCollateral = new SerialCollateralModel(undefined, undefined, 'KLR650')
      const properties = ref({ editing: true, value: serialCollateral })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="SerialCollateral.input.model"]').element as HTMLInputElement
      expect(element.value).toBe('KLR650')
    })

    it(':editing - false, contains model', (): void => {
      const serialCollateral = new SerialCollateralModel(undefined, undefined, 'KLR650')
      const properties = ref({ editing: false, value: serialCollateral })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="SerialCollateral.display.model"]')
      expect(element.text()).toBe('KLR650')
    })

    it(':value - editing true, model field reactivity test', async (): Promise<void> => {
      const properties = ref<{ editing: boolean; value: SerialCollateralModel }>({
        editing: true,
        value: new SerialCollateralModel()
      })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="SerialCollateral.input.model"]').element as HTMLInputElement
      expect(element.value).toBe('')
      properties.value.value = new SerialCollateralModel(undefined, undefined, 'KLR650')
      await Vue.nextTick()
      expect(element.value).toBe('KLR650')
    })

    it(':value - editing false, model field reactivity test', async (): Promise<void> => {
      const properties = ref<{ editing: boolean; value: SerialCollateralModel }>({
        editing: false,
        value: new SerialCollateralModel()
      })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="SerialCollateral.display.model"]')
      expect(element.text()).toBe('')
      properties.value.value = new SerialCollateralModel(undefined, undefined, 'KLR650')
      await Vue.nextTick()
      expect(element.text()).toBe('KLR650')
    })

    // Tests for the "serial" field.

    it(':editing - true contains serial', (): void => {
      const serialCollateral = new SerialCollateralModel(undefined, undefined, undefined, 'JKAKLEE17DDA58357')
      const properties = ref({ editing: true, value: serialCollateral })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="SerialCollateral.input.serial"]').element as HTMLInputElement
      expect(element.value).toBe('JKAKLEE17DDA58357')
    })

    it(':editing - false contains serial', (): void => {
      const serialCollateral = new SerialCollateralModel(undefined, undefined, undefined, 'JKAKLEE17DDA58357')
      const properties = ref({ editing: false, value: serialCollateral })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="SerialCollateral.display.serial"]')
      expect(element.text()).toBe('JKAKLEE17DDA58357')
    })

    it(':value - editing true, serial field reactivity test', async (): Promise<void> => {
      const properties = ref<{ editing: boolean; value: SerialCollateralModel }>({
        editing: true,
        value: new SerialCollateralModel()
      })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="SerialCollateral.input.serial"]').element as HTMLInputElement
      expect(element.value).toBe('')
      properties.value.value = new SerialCollateralModel(undefined, undefined, undefined, 'JKAKLEE17DDA58357')
      await Vue.nextTick()
      expect(element.value).toBe('JKAKLEE17DDA58357')
    })

    it(':value - editing false, serial field reactivity test', async (): Promise<void> => {
      const properties = ref<{ editing: boolean; value: SerialCollateralModel }>({
        editing: false,
        value: new SerialCollateralModel()
      })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="SerialCollateral.display.serial"]')
      expect(element.text()).toBe('')
      properties.value.value = new SerialCollateralModel(undefined, undefined, undefined, 'JKAKLEE17DDA58357')
      await Vue.nextTick()
      expect(element.text()).toBe('JKAKLEE17DDA58357')
    })

    // Tests for the "type" field.

    it(':editing - true, type is not pre-selected', (): void => {
      const properties = ref({ editing: true, value: new SerialCollateralModel() })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="SerialCollateral.input.type"]').element as HTMLInputElement
      expect(element.value).toBe('')
    })

    it.skip(':editing - true, contains type', (): void => {
      const serialCollateral = new SerialCollateralModel(SerialCollateralType.BOAT)
      const properties = ref({ editing: true, value: serialCollateral })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="SerialCollateral.input.type"]').element as HTMLInputElement
      expect(element.value).toBe('BOAT')
    })

    it(':editing - false, contains type', (): void => {
      const serialCollateral = new SerialCollateralModel(SerialCollateralType.BOAT)
      const properties = ref({ editing: false, value: serialCollateral })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="SerialCollateral.display.type"]')
      expect(element.text()).toContain('BOAT')
    })

    it.skip(':value - editing true, type field reactivity test', async (): Promise<void> => {
      const properties = ref<{ editing: boolean; value: SerialCollateralModel }>({
        editing: true,
        value: new SerialCollateralModel()
      })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="SerialCollateral.input.type"]').element as HTMLInputElement
      expect(element.value).toBe('')
      properties.value.value = new SerialCollateralModel(SerialCollateralType.BOAT)
      await Vue.nextTick()
      expect(element.value).toBe('BOAT')
    })

    it(':value - editing false, type field reactivity test', async (): Promise<void> => {
      const properties = ref<{ editing: boolean; value: SerialCollateralModel }>({
        editing: false,
        value: new SerialCollateralModel()
      })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="SerialCollateral.display.type"]')
      expect(element.text()).toBe('')
      properties.value.value = new SerialCollateralModel(SerialCollateralType.BOAT)
      await Vue.nextTick()
      expect(element.text()).toBe('BOAT')
    })

    // Tests for the "year" field.

    it(':editing - true contains year', (): void => {
      const serialCollateral = new SerialCollateralModel(undefined, undefined, undefined, undefined, undefined, 2013)
      const properties = ref({ editing: true, value: serialCollateral })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="SerialCollateral.input.year"]').element as HTMLInputElement
      expect(element.value).toBe('2013')
    })

    it(':editing - false contains year', (): void => {
      const serialCollateral = new SerialCollateralModel(undefined, undefined, undefined, undefined, undefined, 2013)
      const properties = ref({ editing: false, value: serialCollateral })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value })

      const element = wrapper.get('[data-test-id="SerialCollateral.display.year"]')
      expect(element.text()).toBe('2013')
    })

    it(':value - editing true, year field reactivity test', async (): Promise<void> => {
      const properties = ref<{ editing: boolean; value: SerialCollateralModel }>({
        editing: true,
        value: new SerialCollateralModel()
      })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="SerialCollateral.input.year"]').element as HTMLInputElement
      expect(element.value).toBe('')
      properties.value.value = new SerialCollateralModel(undefined, undefined, undefined, undefined, undefined, 2013)
      await Vue.nextTick()
      expect(element.value).toBe('2013')
    })

    it(':value - editing false, year field reactivity test', async (): Promise<void> => {
      const properties = ref<{ editing: boolean; value: SerialCollateralModel }>({
        editing: false,
        value: new SerialCollateralModel()
      })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="SerialCollateral.display.year"]')
      expect(element.text()).toBe('')
      properties.value.value = new SerialCollateralModel(undefined, undefined, undefined, undefined, undefined, 2013)
      await Vue.nextTick()
      expect(element.text()).toBe('2013')
    })
  })

  describe('@events', (): void => {
    it('@input - make change should be emitted', async (): Promise<void> => {
      const properties = ref({ editing: true, value: new SerialCollateralModel() })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      wrapper.get('[data-test-id="SerialCollateral.input.make"]').setValue('Kawasaki')
      await Vue.nextTick()

      const emittedSerialCollateral = wrapper.emitted('input').slice(-1)[0][0]
      expect(emittedSerialCollateral.make).toBe('Kawasaki')
    })

    it('@input - manufacturedHomeRegNumber change should be emitted', async (): Promise<void> => {
      const properties = ref({
        editing: true, value: new SerialCollateralModel(SerialCollateralType.MANUFACTURED_HOME)
      })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      wrapper.get('[data-test-id="SerialCollateral.input.manufacturedHomeRegNumber"]').setValue('MH12345')
      await Vue.nextTick()

      const emittedSerialCollateral = wrapper.emitted('input').slice(-1)[0][0]
      expect(emittedSerialCollateral.manufacturedHomeRegNumber).toBe('MH12345')
    })

    it('@input - model change should be emitted', async (): Promise<void> => {
      const properties = ref({ editing: true, value: new SerialCollateralModel() })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      wrapper.get('[data-test-id="SerialCollateral.input.model"]').setValue('KLR650')
      await Vue.nextTick()

      const emittedSerialCollateral = wrapper.emitted('input').slice(-1)[0][0]
      expect(emittedSerialCollateral.model).toBe('KLR650')
    })

    it('@input - serial change should be emitted', async (): Promise<void> => {
      const properties = ref({ editing: true, value: new SerialCollateralModel() })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      wrapper.get('[data-test-id="SerialCollateral.input.serial"]').setValue('JKAKLEE17DDA58357')
      await Vue.nextTick()

      const emittedSerialCollateral = wrapper.emitted('input').slice(-1)[0][0]
      expect(emittedSerialCollateral.serial).toBe('JKAKLEE17DDA58357')
    })

    it('@input - type change should be emitted', async (): Promise<void> => {
      const properties = ref({ editing: true, value: new SerialCollateralModel() })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      wrapper.get('[data-test-id="SerialCollateral.input.type"]').setValue('BOAT')
      await Vue.nextTick()

      const emittedSerialCollateral = wrapper.emitted('input').slice(-1)[0][0]
      expect(emittedSerialCollateral.type).toBe('BOAT')
    })

    it('@input - year change should be emitted', async (): Promise<void> => {
      const properties = ref({ editing: true, value: new SerialCollateralModel() })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      wrapper.get('[data-test-id="SerialCollateral.input.year"]').setValue('2013')
      await Vue.nextTick()

      const emittedSerialCollateral = wrapper.emitted('input').slice(-1)[0][0]
      expect(emittedSerialCollateral.year).toBe('2013')
    })
  })
})
