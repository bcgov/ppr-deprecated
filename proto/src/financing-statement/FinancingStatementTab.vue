<template lang="pug">
  div
    v-tabs(fixed-tabs, background-color="white", dark)
      v-tab Main
      v-tab Secured Parties
      v-tab Debtors
      v-tab Collateral
      v-tab Registering Party
      v-tab-item
        div(v-if="editing")
          v-form(@input="emitValid('header', $event)")
            v-container
              type-component(
                :value="value.type",
                @input="updateType"
              )
              v-text-field(
                :value="value.lifeYears",
                :rules="lifeRules",
                label="Life in Years",
                name="lifeInput",
                @input="updateLife",
              )
        div(v-else)
          v-container
            v-card
              v-row
                v-col(cols="12",sm="4")
                  v-card(class="pa-2",outlined)
                    div Base Registration Number: {{ value.baseRegistrationNumber }}
                    div Expiry Date: {{ value.expiryDate }}
                    div Registration Date: {{ value.registrationDateTime }}
                v-col(cols="12",sm="4")
                  v-card(class="pa-2",outlined)
                    div Type: {{ value.type }}
                    div Life in Years: {{ value.lifeYears }}

      v-tab-item
        v-container
          v-card
            secured-parties(
              :editing="editing",
              :value="value.securedParties",
              @input="updateSecuredParties",
              @valid="emitValid('securedParties', $event)"
            )
      v-tab-item
        v-container
          v-card
            debtor-parties(
              :editing="editing",
              :value="value.debtorParties",
              @input="updateDebtorParties",
              @valid="emitValid('debtorParties', $event)"
            )
      v-tab-item
        v-container
          v-card
            div Collateral
      v-tab-item
        registering-party(:value="value.registeringParty")
</template>

<script lang="ts">
import { createComponent, ref } from '@vue/composition-api'
import { BasePartyModel } from '@/base-party/base-party-model'
import { FinancingStatementModel } from '@/financing-statement/financing-statement-model'
import { FinancingStatementType } from '@/financing-statement/financing-statement-type'
import { PersonNameModel } from '@/person-name/person-name-model'
import { SecuredPartyModel } from '@/secured-parties/secured-party-model.ts'
import BaseParty from '@/base-party/BaseParty.vue'
import DebtorParties from '@/debtor-parties/DebtorParties.vue'
import TypeComponent from '@/financing-statement/TypeComponent.vue'
import FormSectionHeader from '@/components/FormSectionHeader.vue'
import RegisteringParty from '@/registering-party/RegisteringParty.vue'
import SecuredParties from '@/secured-parties/SecuredParties.vue'

export default createComponent({
  components: {
    BaseParty,
    DebtorParties,
    TypeComponent,
    FormSectionHeader,
    RegisteringParty,
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

.v-card {
  padding: 1rem;
}

  .v-tab {
    background-color: #0d47a1 !important;
    margin-right: 1rem;
    transition: none !important
  }
  .v-tab--active {
    background-color: #fefefe !important;
    color: #0d47a1 !important;
  }
  .v-data-table {
    th {
      background-color: #38598A;
      color: #F8F9FA  !important;
      font-weight: bolder;
      font-size: 1.5rem;
    }

    th, td {
      padding-bottom: 2rem;
      font-size: 1.0rem;
    }
    tbody tr:nth-of-type(even) {
      background-color: white;
    }
  }
</style>
