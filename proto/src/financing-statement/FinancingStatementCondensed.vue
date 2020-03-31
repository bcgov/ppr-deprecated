<template lang="pug">
  v-card(flat)
    div Base Registration Number: {{ value.baseRegistrationNumber }}
    div Expiry Date: {{ value.expiryDate }}
    div Type: {{ value.type }}
    div Life in Years: {{ value.lifeYears }}
    div First secured party
      secured-party(:value="value.securedParties[0]", condensed="true")
    div First debtor
      debtor-party(:value="value.debtorParties[0]", condensed="false")
    div Registering party
      registering-party(:value="value.registeringParty", condensed="true")
</template>

<script lang="ts">
import { createComponent, ref } from '@vue/composition-api'
import { BasePartyModel } from '@/base-party/base-party-model'
import { FinancingStatementModel } from '@/financing-statement/financing-statement-model'
import { FinancingStatementType } from '@/financing-statement/financing-statement-type'
import { PersonNameModel } from '@/person-name/person-name-model'
import { SecuredPartyModel } from '@/secured-parties/secured-party-model.ts'
import DebtorParty from '@/debtor-parties/DebtorParty.vue'
import RegisteringParty from '@/registering-party/RegisteringParty.vue'
import SecuredParty from '@/secured-parties/SecuredParty.vue'

export default createComponent({
  components: {
    DebtorParty,
    RegisteringParty,
    SecuredParty
  },
  props: {
    editing: {
      default: false,
      required: false,
      type: Boolean
    },
    value: {
      required: true,
      type: FinancingStatementModel
    }
  },

  setup(props, { emit }) {
    const formIsValid = ref<boolean>(false)

    const life = ref<number>(1)
    const lifeRules = [
      (value: string): (boolean | string) => {
        return !!value || 'Life is required'
      },
      (value: string): (boolean | string) => {
        return FinancingStatementModel.isValidYears(value) ? true : 'Life must be a number between 1 and 25'
      }
    ]

    /*  Create a structure to hold the validation state of the various sections of the form.
    */
    const validationState = {
      header: false,
      debtorParties: false,
      securedParties: false
    }

    // Callback function for emitting form validity on the header section back to the parent.
    function emitValid(key: string, validElement: boolean) {
      validationState[key] = validElement
      const formValid = Object.values(validationState).reduce((accumulator, elementState) => {
        return accumulator && elementState
      }, true)
      formIsValid.value = formValid
      emit('valid', formValid)
    }

    function updateSecuredParties(newSecuredParties: SecuredPartyModel[]): void {
      emit('input', new FinancingStatementModel(
        props.value.type,
        props.value.lifeYears,
        props.value.registeringParty,
        newSecuredParties,
        props.value.debtorParties
      ))
    }

    function updateDebtorParties(newDebtorParties: BasePartyModel[]): void {
      emit('input', new FinancingStatementModel(
        props.value.type,
        props.value.lifeYears,
        props.value.registeringParty,
        props.value.securedParties,
        newDebtorParties
      ))
    }

    // Callback function for emitting model changes made to the FS life
    function updateLife(newLife: number): void {
      emit('input', new FinancingStatementModel(
        props.value.type,
        newLife, // props.value.life,
        props.value.registeringParty,
        props.value.securedParties,
        props.value.debtorParties
      ))
    }

    // Callback function for emitting model changes made to the FS type
    function updateType(newType: FinancingStatementType): void {
      emit('input', new FinancingStatementModel(
        newType, //props.value.type,
        props.value.lifeYears,
        props.value.registeringParty,
        props.value.securedParties,
        props.value.debtorParties
      ))
    }

    function getFormClass() {
      return {
        formInvalid: props.editing ? !formIsValid.value : false
      }
    }

    return {
      formIsValid,
      life,
      lifeRules,
      getFormClass,
      updateLife,
      updateDebtorParties,
      updateSecuredParties,
      updateType,
      emitValid,
      validationState
    }
  }
})
</script>

<style lang="scss" scoped>
.formInvalid {
  border: 1px solid blanchedalmond;
}
</style>
