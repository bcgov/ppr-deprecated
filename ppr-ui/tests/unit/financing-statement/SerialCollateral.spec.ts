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

const DOT_NUMBER_LABEL = 'DOT Number'
const SERIAL_NUMBER_LABEL = 'Serial Number'

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

    // Tests for field visibility given type AIRCRAFT.

    it(':editing - true, and type AIRCRAFT has correct fields', (): void => {
      const serialCollateral = new SerialCollateralModel(SerialCollateralType.AIRCRAFT)
      const properties = ref({ editing: true, value: serialCollateral })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      expect(wrapper.find('[data-test-id="SerialCollateral.input.make"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test-id="SerialCollateral.input.model"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test-id="SerialCollateral.input.serial"]').exists()).toBeTruthy()
      expect(wrapper.text()).toContain(DOT_NUMBER_LABEL)
      expect(wrapper.find('[data-test-id="SerialCollateral.input.year"]').exists()).toBeTruthy()

      expect(wrapper.find('[data-test-id="SerialCollateral.input.manufacturedHomeRegNumber"]').exists()).toBeFalsy()
    })

    it(':editing - false, and type AIRCRAFT has correct fields', (): void => {
      const serialCollateral = new SerialCollateralModel(SerialCollateralType.AIRCRAFT)
      const properties = ref({ editing: false, value: serialCollateral })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      expect(wrapper.find('[data-test-id="SerialCollateral.display.make"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test-id="SerialCollateral.display.model"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test-id="SerialCollateral.display.serial"]').exists()).toBeTruthy()
      expect(wrapper.text()).toContain(DOT_NUMBER_LABEL)
      expect(wrapper.find('[data-test-id="SerialCollateral.display.year"]').exists()).toBeTruthy()

      expect(wrapper.find('[data-test-id="SerialCollateral.display.manufacturedHomeRegNumber"]').exists()).toBeFalsy()
    })

    // Tests for field visibility given type AIRCRAFT_FRAME.

    it(':editing - true, and type AIRCRAFT_FRAME has correct fields', (): void => {
      const serialCollateral = new SerialCollateralModel(SerialCollateralType.AIRCRAFT_FRAME)
      const properties = ref({ editing: true, value: serialCollateral })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      expect(wrapper.find('[data-test-id="SerialCollateral.input.make"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test-id="SerialCollateral.input.model"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test-id="SerialCollateral.input.serial"]').exists()).toBeTruthy()
      expect(wrapper.text()).toContain(DOT_NUMBER_LABEL)
      expect(wrapper.find('[data-test-id="SerialCollateral.input.year"]').exists()).toBeTruthy()

      expect(wrapper.find('[data-test-id="SerialCollateral.input.manufacturedHomeRegNumber"]').exists()).toBeFalsy()
    })

    it(':editing - false, and type AIRCRAFT_FRAME has correct fields', (): void => {
      const serialCollateral = new SerialCollateralModel(SerialCollateralType.AIRCRAFT_FRAME)
      const properties = ref({ editing: false, value: serialCollateral })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      expect(wrapper.find('[data-test-id="SerialCollateral.display.make"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test-id="SerialCollateral.display.model"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test-id="SerialCollateral.display.serial"]').exists()).toBeTruthy()
      expect(wrapper.text()).toContain(DOT_NUMBER_LABEL)
      expect(wrapper.find('[data-test-id="SerialCollateral.display.year"]').exists()).toBeTruthy()

      expect(wrapper.find('[data-test-id="SerialCollateral.display.manufacturedHomeRegNumber"]').exists()).toBeFalsy()
    })

    // Tests for field visibility given type BOAT.

    it(':editing - true, and type BOAT has correct fields', (): void => {
      const serialCollateral = new SerialCollateralModel(SerialCollateralType.BOAT)
      const properties = ref({ editing: true, value: serialCollateral })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      expect(wrapper.find('[data-test-id="SerialCollateral.input.make"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test-id="SerialCollateral.input.model"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test-id="SerialCollateral.input.serial"]').exists()).toBeTruthy()
      expect(wrapper.text()).toContain(SERIAL_NUMBER_LABEL)
      expect(wrapper.find('[data-test-id="SerialCollateral.input.year"]').exists()).toBeTruthy()

      expect(wrapper.find('[data-test-id="SerialCollateral.input.manufacturedHomeRegNumber"]').exists()).toBeFalsy()
    })

    it(':editing - false, and type BOAT has correct fields', (): void => {
      const serialCollateral = new SerialCollateralModel(SerialCollateralType.BOAT)
      const properties = ref({ editing: false, value: serialCollateral })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      expect(wrapper.find('[data-test-id="SerialCollateral.display.make"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test-id="SerialCollateral.display.model"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test-id="SerialCollateral.display.serial"]').exists()).toBeTruthy()
      expect(wrapper.text()).toContain(SERIAL_NUMBER_LABEL)
      expect(wrapper.find('[data-test-id="SerialCollateral.display.year"]').exists()).toBeTruthy()

      expect(wrapper.find('[data-test-id="SerialCollateral.display.manufacturedHomeRegNumber"]').exists()).toBeFalsy()
    })

    // Tests for field visibility given type ELECTRIC_VEHICLE.

    it(':editing - true, and type ELECTRIC_VEHICLE has correct fields', (): void => {
      const serialCollateral = new SerialCollateralModel(SerialCollateralType.ELECTRIC_VEHICLE)
      const properties = ref({ editing: true, value: serialCollateral })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      expect(wrapper.find('[data-test-id="SerialCollateral.input.make"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test-id="SerialCollateral.input.model"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test-id="SerialCollateral.input.serial"]').exists()).toBeTruthy()
      expect(wrapper.text()).toContain(SERIAL_NUMBER_LABEL)
      expect(wrapper.find('[data-test-id="SerialCollateral.input.year"]').exists()).toBeTruthy()

      expect(wrapper.find('[data-test-id="SerialCollateral.input.manufacturedHomeRegNumber"]').exists()).toBeFalsy()
    })

    it(':editing - false, and type ELECTRIC_VEHICLE has correct fields', (): void => {
      const serialCollateral = new SerialCollateralModel(SerialCollateralType.ELECTRIC_VEHICLE)
      const properties = ref({ editing: false, value: serialCollateral })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      expect(wrapper.find('[data-test-id="SerialCollateral.display.make"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test-id="SerialCollateral.display.model"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test-id="SerialCollateral.display.serial"]').exists()).toBeTruthy()
      expect(wrapper.text()).toContain(SERIAL_NUMBER_LABEL)
      expect(wrapper.find('[data-test-id="SerialCollateral.display.year"]').exists()).toBeTruthy()

      expect(wrapper.find('[data-test-id="SerialCollateral.display.manufacturedHomeRegNumber"]').exists()).toBeFalsy()
    })

    // Tests for field visibility given type MANUFACTURED_HOME_NOT_REGISTERED.

    it(':editing - true, and type MANUFACTURED_HOME_NOT_REGISTERED has correct fields', (): void => {
      const serialCollateral = new SerialCollateralModel(SerialCollateralType.MANUFACTURED_HOME_NOT_REGISTERED)
      const properties = ref({ editing: true, value: serialCollateral })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      expect(wrapper.find('[data-test-id="SerialCollateral.input.serial"]').exists()).toBeTruthy()
      expect(wrapper.text()).toContain(SERIAL_NUMBER_LABEL)

      expect(wrapper.find('[data-test-id="SerialCollateral.input.make"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test-id="SerialCollateral.input.model"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test-id="SerialCollateral.input.manufacturedHomeRegNumber"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test-id="SerialCollateral.input.year"]').exists()).toBeFalsy()
    })

    it(':editing - false, and type MANUFACTURED_HOME_NOT_REGISTERED has correct fields', (): void => {
      const serialCollateral = new SerialCollateralModel(SerialCollateralType.MANUFACTURED_HOME_NOT_REGISTERED)
      const properties = ref({ editing: false, value: serialCollateral })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      expect(wrapper.find('[data-test-id="SerialCollateral.display.serial"]').exists()).toBeTruthy()
      expect(wrapper.text()).toContain(SERIAL_NUMBER_LABEL)

      expect(wrapper.find('[data-test-id="SerialCollateral.display.make"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test-id="SerialCollateral.display.model"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test-id="SerialCollateral.display.manufacturedHomeRegNumber"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test-id="SerialCollateral.display.year"]').exists()).toBeFalsy()
    })

    // Tests for field visibility given type MANUFACTURED_HOME_REGISTERED.

    it(':editing - true, and type MANUFACTURED_HOME_REGISTERED has correct fields', (): void => {
      const serialCollateral = new SerialCollateralModel(SerialCollateralType.MANUFACTURED_HOME_REGISTERED)
      const properties = ref({ editing: true, value: serialCollateral })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      expect(wrapper.find('[data-test-id="SerialCollateral.input.manufacturedHomeRegNumber"]').exists()).toBeTruthy()

      expect(wrapper.find('[data-test-id="SerialCollateral.input.make"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test-id="SerialCollateral.input.model"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test-id="SerialCollateral.input.serial"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test-id="SerialCollateral.input.year"]').exists()).toBeFalsy()
    })

    it(':editing - false, and type MANUFACTURED_HOME_REGISTERED has correct fields', (): void => {
      const serialCollateral = new SerialCollateralModel(SerialCollateralType.MANUFACTURED_HOME_REGISTERED)
      const properties = ref({ editing: false, value: serialCollateral })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      expect(wrapper.find('[data-test-id="SerialCollateral.display.manufacturedHomeRegNumber"]').exists()).toBeTruthy()

      expect(wrapper.find('[data-test-id="SerialCollateral.display.make"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test-id="SerialCollateral.display.model"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test-id="SerialCollateral.display.serial"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test-id="SerialCollateral.display.year"]').exists()).toBeFalsy()
    })

    // Tests for field visibility given type MOTOR_VEHICLE.

    it(':editing - true, and type MOTOR_VEHICLE has correct fields', (): void => {
      const serialCollateral = new SerialCollateralModel(SerialCollateralType.MOTOR_VEHICLE)
      const properties = ref({ editing: true, value: serialCollateral })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      expect(wrapper.find('[data-test-id="SerialCollateral.input.make"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test-id="SerialCollateral.input.model"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test-id="SerialCollateral.input.serial"]').exists()).toBeTruthy()
      expect(wrapper.text()).toContain(SERIAL_NUMBER_LABEL)
      expect(wrapper.find('[data-test-id="SerialCollateral.input.year"]').exists()).toBeTruthy()

      expect(wrapper.find('[data-test-id="SerialCollateral.input.manufacturedHomeRegNumber"]').exists()).toBeFalsy()
    })

    it(':editing - false, and type MOTOR_VEHICLE has correct fields', (): void => {
      const serialCollateral = new SerialCollateralModel(SerialCollateralType.MOTOR_VEHICLE)
      const properties = ref({ editing: false, value: serialCollateral })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      expect(wrapper.find('[data-test-id="SerialCollateral.display.make"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test-id="SerialCollateral.display.model"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test-id="SerialCollateral.display.serial"]').exists()).toBeTruthy()
      expect(wrapper.text()).toContain(SERIAL_NUMBER_LABEL)
      expect(wrapper.find('[data-test-id="SerialCollateral.display.year"]').exists()).toBeTruthy()

      expect(wrapper.find('[data-test-id="SerialCollateral.display.manufacturedHomeRegNumber"]').exists()).toBeFalsy()
    })

    // Tests for field visibility given type OUTBOARD_MOTOR.

    it(':editing - true, and type OUTBOARD_MOTOR has correct fields', (): void => {
      const serialCollateral = new SerialCollateralModel(SerialCollateralType.OUTBOARD_MOTOR)
      const properties = ref({ editing: true, value: serialCollateral })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      expect(wrapper.find('[data-test-id="SerialCollateral.input.make"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test-id="SerialCollateral.input.model"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test-id="SerialCollateral.input.serial"]').exists()).toBeTruthy()
      expect(wrapper.text()).toContain(SERIAL_NUMBER_LABEL)
      expect(wrapper.find('[data-test-id="SerialCollateral.input.year"]').exists()).toBeTruthy()

      expect(wrapper.find('[data-test-id="SerialCollateral.input.manufacturedHomeRegNumber"]').exists()).toBeFalsy()
    })

    it(':editing - false, and type OUTBOARD_MOTOR has correct fields', (): void => {
      const serialCollateral = new SerialCollateralModel(SerialCollateralType.OUTBOARD_MOTOR)
      const properties = ref({ editing: false, value: serialCollateral })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      expect(wrapper.find('[data-test-id="SerialCollateral.display.make"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test-id="SerialCollateral.display.model"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test-id="SerialCollateral.display.serial"]').exists()).toBeTruthy()
      expect(wrapper.text()).toContain(SERIAL_NUMBER_LABEL)
      expect(wrapper.find('[data-test-id="SerialCollateral.display.year"]').exists()).toBeTruthy()

      expect(wrapper.find('[data-test-id="SerialCollateral.display.manufacturedHomeRegNumber"]').exists()).toBeFalsy()
    })

    // Tests for field visibility given type TRAILER.

    it(':editing - true, and type TRAILER has correct fields', (): void => {
      const serialCollateral = new SerialCollateralModel(SerialCollateralType.TRAILER)
      const properties = ref({ editing: true, value: serialCollateral })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      expect(wrapper.find('[data-test-id="SerialCollateral.input.make"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test-id="SerialCollateral.input.model"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test-id="SerialCollateral.input.serial"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test-id="SerialCollateral.input.serial"]').exists()).toBeTruthy()
      expect(wrapper.text()).toContain(SERIAL_NUMBER_LABEL)
      expect(wrapper.find('[data-test-id="SerialCollateral.input.year"]').exists()).toBeTruthy()

      expect(wrapper.find('[data-test-id="SerialCollateral.input.manufacturedHomeRegNumber"]').exists()).toBeFalsy()
    })

    it(':editing - false, and type TRAILER has correct fields', (): void => {
      const serialCollateral = new SerialCollateralModel(SerialCollateralType.TRAILER)
      const properties = ref({ editing: false, value: serialCollateral })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      expect(wrapper.find('[data-test-id="SerialCollateral.display.make"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test-id="SerialCollateral.display.model"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test-id="SerialCollateral.display.serial"]').exists()).toBeTruthy()
      expect(wrapper.text()).toContain(SERIAL_NUMBER_LABEL)
      expect(wrapper.find('[data-test-id="SerialCollateral.display.year"]').exists()).toBeTruthy()

      expect(wrapper.find('[data-test-id="SerialCollateral.display.manufacturedHomeRegNumber"]').exists()).toBeFalsy()
    })

    // Tests for the "make" field.

    it(':editing - true, and make input exists and contains value', (): void => {
      const expected = 'Kawasaki'
      const serialCollateral = new SerialCollateralModel(undefined, expected)
      const properties = ref({ editing: true, value: serialCollateral })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="SerialCollateral.input.make"]').element as HTMLInputElement
      expect(element.value).toBe(expected)
    })

    it(':editing - false, make display exists and contains value', (): void => {
      const expected = 'Kawasaki'
      const serialCollateral = new SerialCollateralModel(undefined, expected)
      const properties = ref({ editing: false, value: serialCollateral })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="SerialCollateral.display.make"]')
      expect(element.text()).toBe(expected)
    })

    it(':value - editing true, make field reactivity test', async (): Promise<void> => {
      const expected = 'Kawasaki'
      const properties = ref<{ editing: boolean; value: SerialCollateralModel }>({
        editing: true,
        value: new SerialCollateralModel()
      })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="SerialCollateral.input.make"]').element as HTMLInputElement
      expect(element.value).toBe('')
      properties.value.value = new SerialCollateralModel(undefined, expected)
      await Vue.nextTick()
      expect(element.value).toBe(expected)
    })

    it(':value - editing false, make field reactivity test', async (): Promise<void> => {
      const expected = 'Kawasaki'
      const properties = ref<{ editing: boolean; value: SerialCollateralModel }>({
        editing: false,
        value: new SerialCollateralModel()
      })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="SerialCollateral.display.make"]')
      expect(element.text()).toBe('')
      properties.value.value = new SerialCollateralModel(undefined, expected)
      await Vue.nextTick()
      expect(element.text()).toBe(expected)
    })

    // Tests for the "manufacturedHomeRegNumber" field.

    it(':editing - true, MH# input is set when type MANUFACTURED_HOME_REGISTERED', (): void => {
      const expected = 'ABC123'
      const serialCollateral = new SerialCollateralModel(SerialCollateralType.MANUFACTURED_HOME_REGISTERED, undefined,
        undefined, undefined, expected)
      const properties = ref({ editing: true, value: serialCollateral })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="SerialCollateral.input.manufacturedHomeRegNumber"]').element as
        HTMLInputElement
      expect(element.value).toBe(expected)
    })

    it(':editing - false, MH# display is set when type MANUFACTURED_HOME_REGISTERED', (): void => {
      const expected = 'ABC123'
      const serialCollateral = new SerialCollateralModel(SerialCollateralType.MANUFACTURED_HOME_REGISTERED, undefined,
        undefined, undefined, expected)
      const properties = ref({ editing: false, value: serialCollateral })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.find('[data-test-id="SerialCollateral.display.manufacturedHomeRegNumber"]')
      expect(element.text()).toBe(expected)
    })

    it(':value - editing true, manufacturedHomeRegNumber field reactivity test', async (): Promise<void> => {
      const expected = 'MH12345'
      const properties = ref<{ editing: boolean; value: SerialCollateralModel }>({
        editing: true,
        value: new SerialCollateralModel(SerialCollateralType.MANUFACTURED_HOME_REGISTERED)
      })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="SerialCollateral.input.manufacturedHomeRegNumber"]').element as
        HTMLInputElement
      expect(element.value).toBe('')
      properties.value.value = new SerialCollateralModel(SerialCollateralType.MANUFACTURED_HOME_REGISTERED, undefined,
        undefined, undefined, expected)
      await Vue.nextTick()
      expect(element.value).toBe(expected)
    })

    it(':value - editing false, manufacturedHomeRegNumber field reactivity test', async (): Promise<void> => {
      const expected = 'MH12345'
      const properties = ref<{ editing: boolean; value: SerialCollateralModel }>({
        editing: false,
        value: new SerialCollateralModel(SerialCollateralType.MANUFACTURED_HOME_REGISTERED)
      })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="SerialCollateral.display.manufacturedHomeRegNumber"]')
      expect(element.text()).toBe('')
      properties.value.value = new SerialCollateralModel(SerialCollateralType.MANUFACTURED_HOME_REGISTERED, undefined,
        undefined, undefined, expected)
      await Vue.nextTick()
      expect(element.text()).toBe(expected)
    })

    // Tests for the "model" field.

    it(':editing - true, contains model', (): void => {
      const expected = 'KLR650'
      const serialCollateral = new SerialCollateralModel(undefined, undefined, expected)
      const properties = ref({ editing: true, value: serialCollateral })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="SerialCollateral.input.model"]').element as HTMLInputElement
      expect(element.value).toBe(expected)
    })

    it(':editing - false, contains model', (): void => {
      const expected = 'KLR650'
      const serialCollateral = new SerialCollateralModel(undefined, undefined, expected)
      const properties = ref({ editing: false, value: serialCollateral })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="SerialCollateral.display.model"]')
      expect(element.text()).toBe(expected)
    })

    it(':value - editing true, model field reactivity test', async (): Promise<void> => {
      const expected = 'KLR650'
      const properties = ref<{ editing: boolean; value: SerialCollateralModel }>({
        editing: true,
        value: new SerialCollateralModel()
      })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="SerialCollateral.input.model"]').element as HTMLInputElement
      expect(element.value).toBe('')
      properties.value.value = new SerialCollateralModel(undefined, undefined, expected)
      await Vue.nextTick()
      expect(element.value).toBe(expected)
    })

    it(':value - editing false, model field reactivity test', async (): Promise<void> => {
      const expected = 'KLR650'
      const properties = ref<{ editing: boolean; value: SerialCollateralModel }>({
        editing: false,
        value: new SerialCollateralModel()
      })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="SerialCollateral.display.model"]')
      expect(element.text()).toBe('')
      properties.value.value = new SerialCollateralModel(undefined, undefined, expected)
      await Vue.nextTick()
      expect(element.text()).toBe(expected)
    })

    // Tests for the "serial" field.

    it(':editing - true contains serial', (): void => {
      const expected = 'JKAKLEE17DDA58357'
      const serialCollateral = new SerialCollateralModel(undefined, undefined, undefined, expected)
      const properties = ref({ editing: true, value: serialCollateral })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="SerialCollateral.input.serial"]').element as HTMLInputElement
      expect(element.value).toBe(expected)
    })

    it(':editing - false contains serial', (): void => {
      const expected = 'JKAKLEE17DDA58357'
      const serialCollateral = new SerialCollateralModel(undefined, undefined, undefined, expected)
      const properties = ref({ editing: false, value: serialCollateral })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="SerialCollateral.display.serial"]')
      expect(element.text()).toBe(expected)
    })

    it(':value - editing true, serial field reactivity test', async (): Promise<void> => {
      const expected = 'JKAKLEE17DDA58357'
      const properties = ref<{ editing: boolean; value: SerialCollateralModel }>({
        editing: true,
        value: new SerialCollateralModel()
      })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="SerialCollateral.input.serial"]').element as HTMLInputElement
      expect(element.value).toBe('')
      properties.value.value = new SerialCollateralModel(undefined, undefined, undefined, expected)
      await Vue.nextTick()
      expect(element.value).toBe(expected)
    })

    it(':value - editing false, serial field reactivity test', async (): Promise<void> => {
      const expected = 'JKAKLEE17DDA58357'
      const properties = ref<{ editing: boolean; value: SerialCollateralModel }>({
        editing: false,
        value: new SerialCollateralModel()
      })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="SerialCollateral.display.serial"]')
      expect(element.text()).toBe('')
      properties.value.value = new SerialCollateralModel(undefined, undefined, undefined, expected)
      await Vue.nextTick()
      expect(element.text()).toBe(expected)
    })

    // Tests for the "type" field.

    it(':editing - true, type is not pre-selected', (): void => {
      const properties = ref({ editing: true, value: new SerialCollateralModel() })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="SerialCollateral.input.type"]').element as HTMLInputElement
      expect(element.value).toBe('')
    })

    it.skip(':editing - true, contains type', (): void => {
      const expected = SerialCollateralType.BOAT
      const serialCollateral = new SerialCollateralModel(expected)
      const properties = ref({ editing: true, value: serialCollateral })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="SerialCollateral.input.type"]').element as HTMLInputElement
      expect(element.value).toBe(expected)
    })

    it(':editing - false, contains type', (): void => {
      const expected = SerialCollateralType.BOAT
      const serialCollateral = new SerialCollateralModel(expected)
      const properties = ref({ editing: false, value: serialCollateral })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="SerialCollateral.display.type"]')
      expect(element.text()).toContain(expected)
    })

    it.skip(':value - editing true, type field reactivity test', async (): Promise<void> => {
      const expected = SerialCollateralType.BOAT
      const properties = ref<{ editing: boolean; value: SerialCollateralModel }>({
        editing: true,
        value: new SerialCollateralModel()
      })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="SerialCollateral.input.type"]').element as HTMLInputElement
      expect(element.value).toBe('')
      properties.value.value = new SerialCollateralModel(expected)
      await Vue.nextTick()
      expect(element.value).toBe(expected)
    })

    it(':value - editing false, type field reactivity test', async (): Promise<void> => {
      const expected = SerialCollateralType.BOAT
      const properties = ref<{ editing: boolean; value: SerialCollateralModel }>({
        editing: false,
        value: new SerialCollateralModel()
      })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      const element = wrapper.get('[data-test-id="SerialCollateral.display.type"]')
      expect(element.text()).toBe('')
      properties.value.value = new SerialCollateralModel(expected)
      await Vue.nextTick()
      expect(element.text()).toBe(expected)
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
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

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
    // "input" event.

    it('@input - make change should be emitted', async (): Promise<void> => {
      const expected = 'Kawasaki'
      const properties = ref({ editing: true, value: new SerialCollateralModel() })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      wrapper.get('[data-test-id="SerialCollateral.input.make"]').setValue(expected)
      await Vue.nextTick()

      const emittedSerialCollateral = wrapper.emitted('input').slice(-1)[0][0]
      expect(emittedSerialCollateral.make).toBe(expected)
    })

    it('@input - manufacturedHomeRegNumber change should be emitted', async (): Promise<void> => {
      const expected = 'MH12345'
      const properties = ref({
        editing: true, value: new SerialCollateralModel(SerialCollateralType.MANUFACTURED_HOME_REGISTERED)
      })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      wrapper.get('[data-test-id="SerialCollateral.input.manufacturedHomeRegNumber"]').setValue(expected)
      await Vue.nextTick()

      const emittedSerialCollateral = wrapper.emitted('input').slice(-1)[0][0]
      expect(emittedSerialCollateral.manufacturedHomeRegNumber).toBe(expected)
    })

    it('@input - model change should be emitted', async (): Promise<void> => {
      const expected = 'KLR650'
      const properties = ref({ editing: true, value: new SerialCollateralModel() })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      wrapper.get('[data-test-id="SerialCollateral.input.model"]').setValue(expected)
      await Vue.nextTick()

      const emittedSerialCollateral = wrapper.emitted('input').slice(-1)[0][0]
      expect(emittedSerialCollateral.model).toBe(expected)
    })

    it('@input - serial change should be emitted', async (): Promise<void> => {
      const expected = 'JKAKLEE17DDA58357'
      const properties = ref({ editing: true, value: new SerialCollateralModel() })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      wrapper.get('[data-test-id="SerialCollateral.input.serial"]').setValue(expected)
      await Vue.nextTick()

      const emittedSerialCollateral = wrapper.emitted('input').slice(-1)[0][0]
      expect(emittedSerialCollateral.serial).toBe(expected)
    })

    it('@input - type change should be emitted', async (): Promise<void> => {
      const expected = 'BOAT'
      const properties = ref({ editing: true, value: new SerialCollateralModel() })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      wrapper.get('[data-test-id="SerialCollateral.input.type"]').setValue(expected)
      await Vue.nextTick()

      const emittedSerialCollateral = wrapper.emitted('input').slice(-1)[0][0]
      expect(emittedSerialCollateral.type).toBe(expected)
    })

    it('@input - year change should be emitted', async (): Promise<void> => {
      const expected = '2013'
      const properties = ref({ editing: true, value: new SerialCollateralModel() })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      wrapper.get('[data-test-id="SerialCollateral.input.year"]').setValue(expected)
      await Vue.nextTick()

      const emittedSerialCollateral = wrapper.emitted('input').slice(-1)[0][0]
      expect(emittedSerialCollateral.year).toBe(expected)
    })

    it('@input - year change should be emitted', async (): Promise<void> => {
      const expected = '2013'
      const properties = ref({ editing: true, value: new SerialCollateralModel() })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      wrapper.get('[data-test-id="SerialCollateral.input.year"]').setValue(expected)
      await Vue.nextTick()

      const emittedSerialCollateral = wrapper.emitted('input').slice(-1)[0][0]
      expect(emittedSerialCollateral.year).toBe(expected)
    })

    // "valid" event.

    it('@valid - all motor vehicle fields to emit true', async (): Promise<void> => {
      const properties = ref({
        editing: true, value: new SerialCollateralModel(SerialCollateralType.MOTOR_VEHICLE, 'Kawasaki', 'KLR650',
          'JKAKLEE17DDA58357', undefined, 2013)
      })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      wrapper.get('[data-test-id="SerialCollateral.input.make"]').setValue('Kawasaki')
      await Vue.nextTick()

      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBeTruthy()
    })

    it('@valid - missing type field to emit false', async (): Promise<void> => {
      const properties = ref({
        editing: true, value: new SerialCollateralModel(SerialCollateralType.MOTOR_VEHICLE, 'Kawasaki', 'KLR650',
          'JKAKLEE17DDA58357', undefined, 2013)
      })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      await Vue.nextTick()
      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBeTruthy()

      wrapper.get('[data-test-id="SerialCollateral.input.type"]').setValue('')

      await Vue.nextTick()
      await Vue.nextTick()
      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBeFalsy()
    })

    it('@valid - missing make field to emit false', async (): Promise<void> => {
      const properties = ref({
        editing: true, value: new SerialCollateralModel(SerialCollateralType.MOTOR_VEHICLE, 'Kawasaki', 'KLR650',
          'JKAKLEE17DDA58357', undefined, 2013)
      })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      await Vue.nextTick()
      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBeTruthy()

      wrapper.get('[data-test-id="SerialCollateral.input.make"]').setValue('')

      await Vue.nextTick()
      await Vue.nextTick()
      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBeFalsy()
    })

    it('@valid - missing model field to emit false', async (): Promise<void> => {
      const properties = ref({
        editing: true, value: new SerialCollateralModel(SerialCollateralType.MOTOR_VEHICLE, 'Kawasaki', 'KLR650',
          'JKAKLEE17DDA58357', undefined, 2013)
      })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      await Vue.nextTick()
      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBeTruthy()

      wrapper.get('[data-test-id="SerialCollateral.input.model"]').setValue('')

      await Vue.nextTick()
      await Vue.nextTick()
      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBeFalsy()
    })

    it('@valid - missing serial field to emit false', async (): Promise<void> => {
      const properties = ref({
        editing: true, value: new SerialCollateralModel(SerialCollateralType.MOTOR_VEHICLE, 'Kawasaki', 'KLR650',
          'JKAKLEE17DDA58357', undefined, 2013)
      })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      await Vue.nextTick()
      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBeTruthy()

      wrapper.get('[data-test-id="SerialCollateral.input.serial"]').setValue('')

      await Vue.nextTick()
      await Vue.nextTick()
      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBeFalsy()
    })

    it('@valid - too long serial field to emit false', async (): Promise<void> => {
      const properties = ref({
        editing: true, value: new SerialCollateralModel(SerialCollateralType.MOTOR_VEHICLE, 'Kawasaki', 'KLR650',
          '1234567890123456789012345', undefined, 2013)
      })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      await Vue.nextTick()
      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBeTruthy()

      wrapper.get('[data-test-id="SerialCollateral.input.serial"]').setValue('12345678901234567890123456')

      await Vue.nextTick()
      await Vue.nextTick()
      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBeFalsy()
    })

    it('@valid - missing year field to emit false', async (): Promise<void> => {
      const properties = ref({
        editing: true, value: new SerialCollateralModel(SerialCollateralType.MOTOR_VEHICLE, 'Kawasaki', 'KLR650',
          'JKAKLEE17DDA58357', undefined, 2013)
      })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      await Vue.nextTick()
      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBeTruthy()

      wrapper.get('[data-test-id="SerialCollateral.input.year"]').setValue('')

      await Vue.nextTick()
      await Vue.nextTick()
      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBeFalsy()
    })

    it('@valid - string year field to emit false', async (): Promise<void> => {
      const properties = ref({
        editing: true, value: new SerialCollateralModel(SerialCollateralType.MOTOR_VEHICLE, 'Kawasaki', 'KLR650',
          'JKAKLEE17DDA58357', undefined, 2013)
      })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      await Vue.nextTick()
      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBeTruthy()

      wrapper.get('[data-test-id="SerialCollateral.input.year"]').setValue('abcd')

      await Vue.nextTick()
      await Vue.nextTick()
      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBeFalsy()
    })

    it('@valid - non-integer year field to emit false', async (): Promise<void> => {
      const properties = ref({
        editing: true, value: new SerialCollateralModel(SerialCollateralType.MOTOR_VEHICLE, 'Kawasaki', 'KLR650',
          'JKAKLEE17DDA58357', undefined, 2013)
      })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      await Vue.nextTick()
      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBeTruthy()

      wrapper.get('[data-test-id="SerialCollateral.input.year"]').setValue('3.14')

      await Vue.nextTick()
      await Vue.nextTick()
      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBeFalsy()
    })

    it('@valid - too small year field to emit false', async (): Promise<void> => {
      const properties = ref({
        editing: true, value: new SerialCollateralModel(SerialCollateralType.MOTOR_VEHICLE, 'Kawasaki', 'KLR650',
          'JKAKLEE17DDA58357', undefined, 1000)
      })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      await Vue.nextTick()
      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBeTruthy()

      wrapper.get('[data-test-id="SerialCollateral.input.year"]').setValue('999')

      await Vue.nextTick()
      await Vue.nextTick()
      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBeFalsy()
    })

    it('@valid - too big year field to emit false', async (): Promise<void> => {
      const properties = ref({
        editing: true, value: new SerialCollateralModel(SerialCollateralType.MOTOR_VEHICLE, 'Kawasaki', 'KLR650',
          'JKAKLEE17DDA58357', undefined, 9999)
      })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      await Vue.nextTick()
      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBeTruthy()

      wrapper.get('[data-test-id="SerialCollateral.input.year"]').setValue('10000')

      await Vue.nextTick()
      await Vue.nextTick()
      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBeFalsy()
    })

    it('@valid - MANUFACTURED_HOME_NOT_REGISTERED with serial field to emit true', async (): Promise<void> => {
      const properties = ref({
        editing: true, value: new SerialCollateralModel(SerialCollateralType.MANUFACTURED_HOME_NOT_REGISTERED,
          undefined, undefined, '1234567890123456789012345')
      })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      await Vue.nextTick()
      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBeTruthy()
    })

    it('@valid - MANUFACTURED_HOME_NOT_REGISTERED without serial field to emit false', async (): Promise<void> => {
      const properties = ref({
        editing: true, value: new SerialCollateralModel(SerialCollateralType.MANUFACTURED_HOME_NOT_REGISTERED,
          undefined, undefined, '1234567890123456789012345')
      })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      await Vue.nextTick()
      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBeTruthy()

      wrapper.get('[data-test-id="SerialCollateral.input.serial"]').setValue('')

      await Vue.nextTick()
      await Vue.nextTick()
      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBeFalsy()
    })

    it('@valid - MANUFACTURED_HOME_REGISTERED with MH# field to emit true', async (): Promise<void> => {
      const properties = ref({
        editing: true, value: new SerialCollateralModel(SerialCollateralType.MANUFACTURED_HOME_REGISTERED, undefined,
          undefined, undefined, 'MH12345')
      })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      await Vue.nextTick()
      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBeTruthy()
    })

    it('@valid - MANUFACTURED_HOME_REGISTERED with no MH# field to emit false', async (): Promise<void> => {
      const properties = ref({
        editing: true, value: new SerialCollateralModel(SerialCollateralType.MANUFACTURED_HOME_REGISTERED, undefined,
          undefined, undefined, 'MH12345')
      })
      const wrapper: Wrapper<Vue> = mount(SerialCollateral, { propsData: properties.value, vuetify })

      await Vue.nextTick()
      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBeTruthy()

      wrapper.get('[data-test-id="SerialCollateral.input.manufacturedHomeRegNumber"]').setValue('')

      await Vue.nextTick()
      await Vue.nextTick()
      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBeFalsy()
    })
  })
})
