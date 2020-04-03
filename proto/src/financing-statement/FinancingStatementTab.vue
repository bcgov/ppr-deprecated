<template lang="pug">
  div
    v-tabs(fixed-tabs, class="customDash")
      v-tab Main
      v-tab Secured Parties
      v-tab Debtors
      v-tab Collateral General
      v-tab Collateral Serial
      v-tab-item
        v-card
          financing-statement-main(
            :editing="editing",
            :value="value",
            @input="updateMain",
            @valid="emitValid('main', $event)"
          )
      v-tab-item
        v-card
          secured-parties(
            :editing="editing",
            :value="value.securedParties",
            @input="updateSecuredParties",
            @valid="emitValid('securedParties', $event)"
          )
      v-tab-item
        v-card
          debtor-parties(
            :editing="editing",
            :value="value.debtorParties",
            @input="updateDebtorParties",
            @valid="emitValid('debtorParties', $event)"
          )
      v-tab-item
        v-card
          div Collateral General
      v-tab-item
        v-card
          div Collateral Serial
</template>

<script lang="ts">
import { createComponent, ref } from '@vue/composition-api'
import { DebtorModel } from '@/debtor-parties/debtor-model'
import { FinancingStatementModel } from '@/financing-statement/financing-statement-model'
import { FinancingStatementType } from '@/financing-statement/financing-statement-type'
import { PersonNameModel } from '@/person-name/person-name-model'
import { SecuredPartyModel } from '@/secured-parties/secured-party-model.ts'
import DebtorParties from '@/debtor-parties/DebtorParties.vue'
import FinancingStatementMain from '@/financing-statement/FinancingStatementMain.vue'
import SecuredParties from '@/secured-parties/SecuredParties.vue'

export default createComponent({
  components: {
    DebtorParties,
    FinancingStatementMain,
    SecuredParties
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

    /*  Create a structure to hold the validation state of the various sections of the form.
    */
    const validationState = {
      main: false,
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

    function updateDebtorParties(newDebtorParties: DebtorModel[]): void {
      emit('input', new FinancingStatementModel(
        props.value.type,
        props.value.lifeYears,
        props.value.registeringParty,
        props.value.securedParties,
        newDebtorParties
      ))
    }

    function updateMain(newFinancingStatement: FinancingStatementModel): void {
      // just pass on the new statement to the parent
      emit('input', newFinancingStatement)
    }

    function getFormClass() {
      return {
        formInvalid: props.editing ? !formIsValid.value : false
      }
    }

    return {
      formIsValid,
      getFormClass,
      updateDebtorParties,
      updateMain,
      updateSecuredParties,
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

.v-card {
  padding: 1rem;
}
.customDash {
  .v-item-group {
    background-color: #f1f3f5 !important;
  }
  .v-tab {
    background-color: #38598A !important;
    color: white !important;
    font-size: 1.1rem;
    margin-right: 1rem;
  }
  .v-tab--active {
    background-color: #E6EAF4 !important;
    color: #0d47a1 !important;
  }
}

</style>
