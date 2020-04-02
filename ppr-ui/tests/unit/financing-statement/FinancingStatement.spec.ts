import Vue from 'vue'
import VueCompositionApi, { ref } from '@vue/composition-api'
import { mount, Wrapper } from '@vue/test-utils'
import Vuetify from 'vuetify'

import FinancingStatement from '@/financing-statement/FinancingStatement.vue'
import { BasePartyModel } from '@/base-party/base-party-model'
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

    it(':editing - true form defaults to invalid', async (): Promise<void> => {
      const properties = ref({ editing: true, value: new FinancingStatementModel() })
      const wrapper: Wrapper<Vue> = mount(FinancingStatement, { propsData: properties.value, vuetify })
      expect(wrapper.find('[data-test-id="FinancingStatement.form"]').attributes().class).toContain('formInvalid')
    })

    it(':editing - false form defaults to valid', async (): Promise<void> => {
      const properties = ref({ editing: false, value: new FinancingStatementModel() })
      const wrapper: Wrapper<Vue> = mount(FinancingStatement, { propsData: properties.value, vuetify })
      expect(wrapper.find('[data-test-id="FinancingStatement.form"]').attributes().class).not.toContain('formInvalid')
    })

    it(':editing - false contains default type', (): void => {
      const properties = ref({ editing: false, value: new FinancingStatementModel() })
      const wrapper: Wrapper<Vue> = mount(FinancingStatement, { propsData: properties.value, vuetify })

      expect(wrapper.text()).toContain(FinancingStatementType.SECURITY_AGREEMENT)
    })

    it('@input - type change should be emitted', async (): Promise<void> => {
      const properties = ref({ editing: true, value: new FinancingStatementModel() })
      const wrapper: Wrapper<Vue> = mount(FinancingStatement, { propsData: properties.value, vuetify })
      const sel = wrapper.get('input[data-test-id="FinancingStatement.type.select"]')
      sel.setValue('REPAIRERS_LIEN')
      await Vue.nextTick()
      expect(wrapper.text()).toContain(FinancingStatementType.REPAIRERS_LIEN)
    })

    it('@input - type change should be emitted', async (): Promise<void> => {
      const properties = ref({ editing: true, value: new FinancingStatementModel() })
      const wrapper: Wrapper<Vue> = mount(FinancingStatement, { propsData: properties.value, vuetify })
      const sel = wrapper.get('input[data-test-id="FinancingStatement.type.select"]')
      sel.setValue('MFD_HOME_TAX_LIEN')
      await Vue.nextTick()
      expect(wrapper.text()).toContain(FinancingStatementType.MFD_HOME_TAX_LIEN)
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

  describe('white box testing', (): void => {

    function makeFS(): FinancingStatementModel {
      let aParty
      aParty = new BasePartyModel()
      aParty.listId = 0
      const securedParties = [aParty]
      aParty = new BasePartyModel()
      aParty.listId = 1
      securedParties.push(aParty)

      aParty = new BasePartyModel()
      aParty.listId = 0
      const debtorParties = [aParty]
      aParty = new BasePartyModel()
      aParty.listId = 1
      debtorParties.push(aParty)

      const financingStatement = new FinancingStatementModel(FinancingStatementType.SECURITY_AGREEMENT, 13,
        new PersonNameModel('first', 'middle', 'last'), securedParties, debtorParties)
      return financingStatement
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    function addParty(list: BasePartyModel[]) {
      let sp = [...list]
      const last: BasePartyModel = list[list.length - 1] as BasePartyModel
      const newParty = new BasePartyModel()
      newParty.listId = last.listId + 1
      sp.push(newParty)
      return sp
    }

    it('update type', async (): Promise<void> => {
      const financingStatement = makeFS()
      const properties = ref({ editing: true, value: financingStatement })
      const wrapper: Wrapper<Vue> = mount(FinancingStatement, { propsData: properties.value, vuetify })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const vm: any = wrapper.vm
      vm.updateType(FinancingStatementType.REPAIRERS_LIEN)
      await Vue.nextTick()

      const emitted = wrapper.emitted('input').slice(-1)[0][0]
      expect(emitted).toBeInstanceOf(FinancingStatementModel)
      expect(emitted.type).toEqual(FinancingStatementType.REPAIRERS_LIEN)
    })

    it('update secured parties method should emit longer party list', async (): Promise<void> => {
      const financingStatement = makeFS()
      const properties = ref({ editing: true, value: financingStatement })
      const wrapper: Wrapper<Vue> = mount(FinancingStatement, { propsData: properties.value, vuetify })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const vm: any = wrapper.vm
      const newList = addParty(financingStatement.securedParties)
      vm.updateSecuredParties(newList)
      await Vue.nextTick()

      const emitted = wrapper.emitted('input').slice(-1)[0][0]
      expect(emitted).toBeInstanceOf(FinancingStatementModel)
      expect(emitted.securedParties).toHaveLength(3)
    })

    it('update debtor parties method should emit longer party list', async (): Promise<void> => {
      const financingStatement = makeFS()
      const properties = ref({ editing: true, value: financingStatement })
      const wrapper: Wrapper<Vue> = mount(FinancingStatement, { propsData: properties.value, vuetify })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const vm: any = wrapper.vm
      const newList = addParty(financingStatement.debtorParties)
      vm.updateDebtorParties(newList)
      await Vue.nextTick()

      const emitted = wrapper.emitted('input').slice(-1)[0][0]
      expect(emitted).toBeInstanceOf(FinancingStatementModel)
      expect(emitted.debtorParties).toHaveLength(3)
    })
  })

})
