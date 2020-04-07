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
            @input="updateList('secured',$event)",
            @valid="emitValid('securedParties', $event)"
          )
      v-tab-item
        v-card
          debtor-parties(
            :editing="editing",
            :value="value.debtorParties",
            @input="updateList('debtor',$event)",
            @valid="emitValid('debtorParties', $event)"
          )
      v-tab-item
        v-card
          general-collaterals(
            :editing="editing",
            :value="value.generalCollateral",
            @input="updateList('general',$event)",
            @valid="emitValid('generalCollatoral', $event)"
          )
      v-tab-item
        v-card
          serial-collaterals(
          :editing="editing",
          :value="value.serialCollateral",
          @input="updateList('serial',$event)",
          @valid="emitValid('serialCollateral', $event)"
          )
</template>

<script lang="ts">
import { createComponent, ref } from '@vue/composition-api'
import { GeneralCollateralModel } from '@/general-collateral/general-collateral-model'
import { DebtorModel } from '@/debtor-parties/debtor-model'
import { FinancingStatementModel } from '@/financing-statement/financing-statement-model'
import { FinancingStatementType } from '@/financing-statement/financing-statement-type'
import { PersonNameModel } from '@/person-name/person-name-model'
import { SecuredPartyModel } from '@/secured-parties/secured-party-model'
import { SerialCollateralModel } from '@/serial-collateral/serial-collateral-model'
import GeneralCollaterals from '@/general-collateral/GeneralCollaterals.vue'
import SerialCollaterals from '@/serial-collateral/SerialCollaterals.vue'
import DebtorParties from '@/debtor-parties/DebtorParties.vue'
import FinancingStatementMain from '@/financing-statement/FinancingStatementMain.vue'
import SecuredParties from '@/secured-parties/SecuredParties.vue'

export default createComponent({
  components: {
    GeneralCollaterals,
    DebtorParties,
    FinancingStatementMain,
    SerialCollaterals,
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
      securedParties: false,
      generalCollatoral: true,
      serialCollateral: true
    }

    // Callback function for emitting form validity on the header section back to the parent.
    function emitValid(key: string, validElement: boolean) {
      validationState[key] = validElement
      const formValid = Object.values(validationState).reduce((accumulator, elementState) => {
        return accumulator && elementState
      }, true)
      formIsValid.value = formValid
      // console.log('FST emit valid key, validElement, form', key, validElement, formIsValid.value)
      emit('valid', formValid)
    }

    function updateList(key: string, newList: DebtorModel[] | GeneralCollateralModel[] | SecuredPartyModel[] | SerialCollateralModel[]): void {
      let newModel: FinancingStatementModel
      if (key === 'secured') {
        newModel = new FinancingStatementModel(
          props.value.type,
          props.value.lifeYears,
          props.value.registeringParty,
          newList as SecuredPartyModel[],
          props.value.debtorParties,
          props.value.generalCollateral,
          props.value.serialCollateral
        )
      }
      if (key === 'debtor') {
        newModel = new FinancingStatementModel(
          props.value.type,
          props.value.lifeYears,
          props.value.registeringParty,
          props.value.securedParties,
          newList as DebtorModel[],
          props.value.generalCollateral,
          props.value.serialCollateral
        )
      }
      if (key === 'general') {
        newModel = new FinancingStatementModel(
          props.value.type,
          props.value.lifeYears,
          props.value.registeringParty,
          props.value.securedParties,
          props.value.debtorParties,
          newList as GeneralCollateralModel[],
          props.value.serialCollateral
        )
      }
        if (key === 'serial') {
          newModel = new FinancingStatementModel(
            props.value.type,
            props.value.lifeYears,
            props.value.registeringParty,
            props.value.securedParties,
            props.value.debtorParties,
            props.value.generalCollateral,
            newList as SerialCollateralModel[],
          )
        }
        if (!newModel) {
          console.error('Coding error.  Need to creaet a new FS for', key)
        }
        emit('input', newModel)
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
      updateList,
      updateMain,
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
