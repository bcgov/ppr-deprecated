import Vue from 'vue'
import Vuetify from 'vuetify'
import VueCompositionApi, { ref } from '@vue/composition-api'
import { mount, Wrapper } from '@vue/test-utils'

import CollateralItems from '@/financing-statement/CollateralItems.vue'
import { CollateralItemsModel } from '@/financing-statement/collateral-items-model'

Vue.use(Vuetify)
Vue.use(VueCompositionApi)

const vuetify = new Vuetify()

describe('CollateralItems.vue', (): void => {
  describe(':props', (): void => {
    // General form tests.

    it(':editing - true, form exists', (): void => {
      const properties = ref({ editing: true, value: new CollateralItemsModel() })
      const wrapper: Wrapper<Vue> = mount(CollateralItems, { propsData: properties.value, vuetify })

      expect(wrapper.find('form').exists()).toBeTruthy()
    })

    it(':editing - false by default, form does not exist', (): void => {
      const properties = ref({ value: new CollateralItemsModel() })
      const wrapper: Wrapper<Vue> = mount(CollateralItems, { propsData: properties.value, vuetify })

      expect(wrapper.find('form').exists()).toBeFalsy()
    })

    it(':editing - false, form does not exist', (): void => {
      const properties = ref({ editing: false, value: new CollateralItemsModel() })
      const wrapper: Wrapper<Vue> = mount(CollateralItems, { propsData: properties.value, vuetify })

      expect(wrapper.find('form').exists()).toBeFalsy()
    })

    it(':editing - reactivity test', async (): Promise<void> => {
      const properties = ref<{ editing: boolean; value: CollateralItemsModel }>({
        editing: false,
        value: new CollateralItemsModel()
      })
      const wrapper: Wrapper<Vue> = mount(CollateralItems, { propsData: properties.value, vuetify })

      expect(wrapper.find('form').exists()).toBeFalsy()
      properties.value.editing = true
      await Vue.nextTick()
      expect(wrapper.find('form').exists()).toBeTruthy()
      properties.value.editing = false
      await Vue.nextTick()
      expect(wrapper.find('form').exists()).toBeFalsy()
    })

    // Tests for the general collateral textarea.

    // Scenario:
    //  - editing = true
    // Test:
    //  - general collateral input does not exist
    //  - general collateral readonly text does not exist
    it(':editing - true, general collateral textarea does not exist yet', async (): Promise<void> => {
      const properties = ref({ editing: true, value: new CollateralItemsModel() })
      const wrapper: Wrapper<Vue> = mount(CollateralItems, { propsData: properties.value, vuetify })
      await Vue.nextTick()

      expect(wrapper.find('[data-test-id="CollateralItems.generalCollateral.textarea"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test-id="CollateralItems.generalCollateral.readonly"]').exists()).toBeFalsy()
    })

    // Scenario:
    //  - editing = true
    //  - click the Add General Collateral button
    // Test:
    //  - general collateral input does exist
    //  - general collateral readonly text does not exist
    it(':editing - true, click Add General Collateral shows textarea', async (): Promise<void> => {
      const properties = ref({ editing: true, value: new CollateralItemsModel() })
      const wrapper: Wrapper<Vue> = mount(CollateralItems, { propsData: properties.value, vuetify })

      const button = wrapper.get('[data-test-id="CollateralItems.generalCollateral.button.add"]')
      button.trigger('click')
      await Vue.nextTick()

      expect(wrapper.find('[data-test-id="CollateralItems.generalCollateral.textarea"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test-id="CollateralItems.generalCollateral.readonly"]').exists()).toBeFalsy()
    })

    // Scenario:
    //  - editing = true
    //  - click the Add General Collateral button
    //  - set the value of the general collateral input
    // Test:
    //  - input event is emitted with expected general collateral text
    it(':editing - true, general collateral string emitted as input', async (): Promise<void> => {
      const expected = 'This is some general collateral text'
      const properties = ref({ editing: true, value: new CollateralItemsModel() })
      const wrapper: Wrapper<Vue> = mount(CollateralItems, { propsData: properties.value, vuetify })

      const button = wrapper.get('[data-test-id="CollateralItems.generalCollateral.button.add"]')
      button.trigger('click')
      await Vue.nextTick()
      const textarea = wrapper.get('[data-test-id="CollateralItems.generalCollateral.textarea"]')
      textarea.setValue(expected)

      const emittedCollateralItems = wrapper.emitted('input').slice(-1)[0][0]
      expect(emittedCollateralItems.generalCollateral).toBe(expected)
    })

    // Scenario:
    //  - editing = true
    //  - the general collateral in the model exists
    // Test:
    //  - general collateral input does not exist
    //  - general collateral readonly text exists
    it(':editing - true, general collateral existing displays readonly', async (): Promise<void> => {
      const expected = 'This is some general collateral text'
      const properties = ref({ editing: true, value: new CollateralItemsModel(undefined, expected) })
      const wrapper: Wrapper<Vue> = mount(CollateralItems, { propsData: properties.value, vuetify })

      expect(wrapper.find('[data-test-id="CollateralItems.generalCollateral.textarea"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test-id="CollateralItems.generalCollateral.readonly"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test-id="CollateralItems.generalCollateral.readonly"]').text()).toContain(expected)
    })

    // Scenario:
    //  - editing = true
    //  - the general collateral in the model exists
    //  - click the Add General Collateral button
    //  - blur the general collateral input
    // Test:
    //  - general collateral input no longer exists
    //  - general collateral readonly text exists
    it(':editing - true, general collateral losing focus hides textarea', async (): Promise<void> => {
      const expected = 'This is some general collateral text'
      const properties = ref({ editing: true, value: new CollateralItemsModel(undefined, expected) })
      const wrapper: Wrapper<Vue> = mount(CollateralItems, { propsData: properties.value, vuetify })

      const button = wrapper.get('[data-test-id="CollateralItems.generalCollateral.button.add"]')
      button.trigger('click')
      await Vue.nextTick()
      const textarea = wrapper.get('[data-test-id="CollateralItems.generalCollateral.textarea"]')
      textarea.trigger('blur')
      await Vue.nextTick()

      expect(wrapper.find('[data-test-id="CollateralItems.generalCollateral.textarea"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test-id="CollateralItems.generalCollateral.readonly"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test-id="CollateralItems.generalCollateral.readonly"]').text()).toContain(expected)
    })

    // Scenario:
    //  - editing = true
    //  - the general collateral in the model exists
    //  - click the Add General Collateral button
    //  - click the clear general collateral button
    // Test:
    //  - general collateral input no longer exists
    //  - general collateral readonly text exists but is cleared
    it(':editing - true, general collateral clear button works', async (): Promise<void> => {
      const properties = ref({ editing: true, value: new CollateralItemsModel(undefined, 'sample text') })
      const wrapper: Wrapper<Vue> = mount(CollateralItems, { propsData: properties.value, vuetify })

      const addButton = wrapper.get('[data-test-id="CollateralItems.generalCollateral.button.add"]')
      addButton.trigger('click')
      await Vue.nextTick()
      const clearButton = wrapper.get('[data-test-id="CollateralItems.generalCollateral.button.clear"]')
      clearButton.trigger('click')
      await Vue.nextTick()

      expect(wrapper.find('[data-test-id="CollateralItems.generalCollateral.textarea"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test-id="CollateralItems.generalCollateral.readonly"]').exists()).toBeTruthy()
      const emittedCollateralItems = wrapper.emitted('input').slice(-1)[0][0]
      expect(emittedCollateralItems.generalCollateral).toBe('')
    })
  })
})
