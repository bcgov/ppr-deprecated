<template>
  <v-card outlined>
    <v-form
      :class="getFormClass()"
      data-test-id="FinancingStatement.form"
      @input="emitValid('header', $event)"
    >
      <form-section-header label="Type &amp; Duration" />
      <v-container>
        <div v-if="editing">
          <type-component
            :value="value.type"
            @input="updateType"
          />
          <v-text-field
            :value="value.years"
            :rules="lifeRules"
            label="Life in Years"
            name="lifeInput"
            @input="updateLife"
          />
        </div>
        <div v-else>
          <div>
            Base Registration Number: {{ value.baseRegistrationNumber }}
          </div>
          <div>
            Expiry Date: {{ value.expiryDate }}
          </div>
          <div>
            Type: {{ value.type }}
          </div>
          <div>
            Life in Years: {{ value.years }}
          </div>
        </div>
      </v-container>
      <secured-parties
        :editing="editing"
        :value="value.securedParties"
        @input="updateSecuredParties"
        @valid="emitValid('securedParties', $event)"
      />
      <debtor-parties
        :editing="editing"
        :value="value.debtorParties"
        @input="updateDebtorParties"
        @valid="emitValid('debtorParties', $event)"
      />
      <form-section-header label="Registering Party" />
      <v-container>
        <registering-party
          :value="value.registeringParty"
          :editing="editing"
          @input="updateRegisteringParty"
          @valid="emitValid('registeringParty', $event)"
        />
      </v-container>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { createComponent, ref } from '@vue/composition-api'
import { BasePartyModel } from '@/base-party/base-party-model'
import { FinancingStatementModel } from '@/financing-statement/financing-statement-model'
import { FinancingStatementType } from '@/financing-statement/financing-statement-type'
import { PersonNameModel } from '@/components/person-name-model'
import BaseParty from '@/base-party/BaseParty.vue'
import DebtorParties from '@/financing-statement/DebtorParties.vue'
import TypeComponent from '@/financing-statement/TypeComponent.vue'
import FormSectionHeader from '@/components/FormSectionHeader.vue'
import RegisteringParty from '@/components/RegisteringParty.vue'
import SecuredParties from '@/financing-statement/SecuredParties.vue'

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
      registeringParty: false,
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

    function updateRegisteringParty(newPerson: PersonNameModel): void {
      emit('input', new FinancingStatementModel(
        props.value.type,
        props.value.years,
        newPerson, // props.value.registeringParty
        props.value.securedParties,
        props.value.debtorParties
      ))
    }

    function updateSecuredParties(newSecuredParties: BasePartyModel[]): void {
      emit('input', new FinancingStatementModel(
        props.value.type,
        props.value.years,
        props.value.registeringParty,
        newSecuredParties,
        props.value.debtorParties
      ))
    }

    function updateDebtorParties(newDebtorParties: BasePartyModel[]): void {
      emit('input', new FinancingStatementModel(
        props.value.type,
        props.value.years,
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
        props.value.years,
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
      updateRegisteringParty,
      updateSecuredParties,
      updateType,
      emitValid,
    }
  }
})
</script>

<style lang="scss" scoped>
.formInvalid {
  border: 1px solid blanchedalmond;
}
</style>
