<template>
  <v-card outlined>
    <v-form @input="emitValid('header', $event)">
      <secured-parties
        :editing="editing"
        :value="value.securedParties"
        @input="updateSecuredParties"
        @valid="emitValid('securedParties', $event)"
      />
      <form-section-header label="Type &amp; Duration" />
      <v-container>
        <div v-if="editing">
          <v-select
            :value="value.type"
            :items="fsTypes"
            label="Type"
            name="typeInput"
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
import { FinancingStatementType, FinancingStatementTypeCodeList } from '@/financing-statement/financing-statement-type'
import { PersonNameModel } from '@/components/person-name-model'
import BaseParty from '@/base-party/BaseParty.vue'
import FormSectionHeader from '@/components/FormSectionHeader.vue'
import RegisteringParty from '@/components/RegisteringParty.vue'
import SecuredParties from '@/financing-statement/SecuredParties.vue'

export default createComponent({
  components: {
    BaseParty,
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
    const fsTypes = ref<string[]>(FinancingStatementTypeCodeList)
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
        props.value.securedParties
      ))
    }

    function updateSecuredParties(newSecuredParties: BasePartyModel[]): void {
      console.log('updateSecuredParties', newSecuredParties)
      emit('input', new FinancingStatementModel(
        props.value.type,
        props.value.years,
        props.value.registeringParty,
        newSecuredParties
      ))
    }

    // Callback function for emitting model changes made to the FS life
    function updateLife(newLife: number): void {
      emit('input', new FinancingStatementModel(
        props.value.type,
        newLife, // props.value.life,
        props.value.registeringParty,
        props.value.securedParties
      ))
    }

    // Callback function for emitting model changes made to the FS type
    function updateType(newType: FinancingStatementType): void {
      emit('input', new FinancingStatementModel(
        newType, //props.value.type,
        props.value.years,
        props.value.registeringParty,
        props.value.securedParties
      ))
    }

    return {
      fsTypes,
      formIsValid,
      life,
      lifeRules,
      updateLife,
      updateRegisteringParty,
      updateSecuredParties,
      updateType,
      emitValid,
    }
  }
})
</script>
