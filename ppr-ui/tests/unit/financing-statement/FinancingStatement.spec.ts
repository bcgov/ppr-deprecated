import Vue from 'vue'
import VueCompositionApi, { ref } from '@vue/composition-api'
import { mount, Wrapper } from '@vue/test-utils'
import Vuetify from 'vuetify'

import FinancingStatement from '@/financing-statement/FinancingStatement.vue'
import { FinancingStatementModel } from '@/financing-statement/financing-statement-model'
import { FinancingStatementType } from '@/financing-statement/financing-statement-type'
import { PersonNameModel } from '@/components/person-name-model'

Vue.use(Vuetify)
Vue.use(VueCompositionApi)

const vuetify = new Vuetify()

describe('FinancingStatmentContainer.vue', (): void => {
  describe(':props', (): void => {
    it(':editing - false contains no inputs', (): void => {
      const properties = ref({ editing: false, value: new FinancingStatementModel() })
      const wrapper: Wrapper<Vue> = mount(FinancingStatement, { propsData: properties.value, vuetify })

      expect(wrapper.findAll('input').exists()).toBeFalsy()
    })

    it(':editing - true contains inputs', (): void => {
      const properties = ref({ editing: true, value: new FinancingStatementModel() })
      const wrapper: Wrapper<Vue> = mount(FinancingStatement, { propsData: properties.value, vuetify })

      expect(wrapper.findAll('input').exists()).toBeTruthy()
    })

    it(':editing - false contains default type', (): void => {
      const properties = ref({ editing: false, value: new FinancingStatementModel() })
      const wrapper: Wrapper<Vue> = mount(FinancingStatement, { propsData: properties.value, vuetify })

      expect(wrapper.text()).toContain(FinancingStatementType.SECURITY_AGREEMENT)
    })

    // Skip until can figure out how to inject value into a vuetify select
    it.skip('@input - type change should be emitted', async (): Promise<void> => {
      const properties = ref({ editing: true, value: new FinancingStatementModel() })
      const wrapper: Wrapper<Vue> = mount(FinancingStatement, { propsData: properties.value, vuetify })

      wrapper.get('input[name="typeInput"]').setValue('REPAIRERS_LIEN')
      await Vue.nextTick()

      expect(wrapper.text()).toContain(FinancingStatementType.REPAIRERS_LIEN)
      // const emitted = wrapper.emitted('input').slice(-1)[0][0]
      // expect(emitted.type).toBe(FinancingStatementType.REPAIRERS_LIEN)
    })

    it('@input - life change should be emitted', async (): Promise<void> => {
      const properties = ref({ editing: true, value: new FinancingStatementModel() })
      const wrapper: Wrapper<Vue> = mount(FinancingStatement, { propsData: properties.value, vuetify })

      wrapper.get('input[name="lifeInput"]').setValue('22')
      await Vue.nextTick()

      const emitted = wrapper.emitted('input').slice(-1)[0][0]
      expect(emitted.years).toBe('22')
    })

    it('@valid - invalid life should be false', async (): Promise<void> => {
      const properties = ref({ editing: true, value: new FinancingStatementModel() })
      const wrapper: Wrapper<Vue> = mount(FinancingStatement, { propsData: properties.value, vuetify })

      wrapper.get('input[name="lifeInput"]').setValue('26')
      await Vue.nextTick()

      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBeFalsy()
    })

    it('@valid - valid data to emit valid true', async (): Promise<void> => {
      const financingStatement = new FinancingStatementModel(FinancingStatementType.SECURITY_AGREEMENT, 13,
        new PersonNameModel('first', 'middle', 'last'))
      const properties = ref({ editing: true, value: financingStatement })
      const wrapper: Wrapper<Vue> = mount(FinancingStatement, { propsData: properties.value, vuetify })

      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBeTruthy()
    })

    it('@valid - missing registering party name to emit valid false', async (): Promise<void> => {
      const financingStatement = new FinancingStatementModel(FinancingStatementType.SECURITY_AGREEMENT, 13,
        new PersonNameModel('first', 'middle', 'last'))
      const properties = ref({ editing: true, value: financingStatement })
      const wrapper: Wrapper<Vue> = mount(FinancingStatement, { propsData: properties.value, vuetify })

      // Needed a double nextTick, probably due to the emits from two components.
      wrapper.get('input[data-test-id="PersonName.first"]').setValue('')
      await Vue.nextTick()
      await Vue.nextTick()

      expect(wrapper.emitted('valid').slice(-1)[0][0]).toBeFalsy()
    })
  })
})
