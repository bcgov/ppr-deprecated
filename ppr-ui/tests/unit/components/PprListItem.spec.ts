import Vue from 'vue'
import VueCompositionApi, { ref } from '@vue/composition-api'
import { mount, Wrapper } from '@vue/test-utils'
import Vuetify from 'vuetify'

import PprListItem from '@/components/PprListItem.vue'

Vue.use(Vuetify)
Vue.use(VueCompositionApi)
const vuetify = new Vuetify()

describe('PprListItem.vue', (): void => {
  describe(':props', (): void => {

    // General form tests.

    it(':editing - true, header exist', (): void => {
      const properties = ref({ editing: true, listLength: 1, index: 0 })
      const wrapper: Wrapper<Vue> = mount(PprListItem, { propsData: properties.value, vuetify })

      expect(wrapper.find('div[data-test-id="ListItem.header.title"]').exists()).toBeTruthy()
    })

    it(':editing - true, list of 0 does not have remove ', (): void => {
      const properties = ref({ editing: true, listLength: 0, index: 0 })
      const wrapper: Wrapper<Vue> = mount(PprListItem, { propsData: properties.value, vuetify })

      expect(wrapper.find('button[data-test-id="ListItem.button.remove"]').exists()).toBeFalsy()
    })

    it(':editing - true, list of 1 does not have remove ', (): void => {
      const properties = ref({ editing: true, listLength: 1, index: 0 })
      const wrapper: Wrapper<Vue> = mount(PprListItem, { propsData: properties.value, vuetify })

      expect(wrapper.find('button[data-test-id="ListItem.button.remove"]').exists()).toBeFalsy()
    })

    it(':editing - true, list of 2 does have remove ', (): void => {
      const properties = ref({ editing: true, listLength: 2, index: 0 })
      const wrapper: Wrapper<Vue> = mount(PprListItem, { propsData: properties.value, vuetify })

      expect(wrapper.find('button[data-test-id="ListItem.button.remove"]').exists()).toBeTruthy()
    })


  })
  describe('@events', (): void => {
    it('@input - business name change should be emitted', async (): Promise<void> => {
      const expected = 2
      const properties = ref({ editing: true, listLength: 5, index: expected })
      const wrapper: Wrapper<Vue> = mount(PprListItem, { propsData: properties.value, vuetify })

      const button = wrapper.get('[data-test-id="ListItem.button.remove"]')
      button.trigger('click')
      await Vue.nextTick()

      const emitted = wrapper.emitted('remove').slice(-1)[0][0]
      expect(emitted).toBe(expected)
    })

  })
})
