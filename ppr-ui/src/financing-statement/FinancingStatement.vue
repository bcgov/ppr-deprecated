<template>
  <v-card
    class="mb-12"
    outlined
  >
    <form-section-header label="Type and duration" />
    <v-container>
      <v-form
        v-if="editing"
        @input="formValid($event)"
      >
        <v-text-field
          :value="value.term"
          :rules="termRules"
          label="Term"
          name="termInput"
          @input="updateTerm"
        />
        <v-select
          :value="value.type"
          :items="items"
          label="Type"
          name="typeInput"
          @input="updateType"
        />
      </v-form>
      <div v-else>
        <div>
          Term: {{ value.term }}
        </div>
        <div>
          Type: {{ value.type }}
        </div>
      </div>
    </v-container>
    <form-section-header label="Registering Party" />
    <v-container>
      <registering-party
        :value="value.registeringParty"
        :editing="editing"
        @input="updateRegisteringParty"
        @valid="formValid($event)"
      />
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { createComponent, ref } from '@vue/composition-api'
import FinancingStatementModel from '@/financing-statement/financing-statement-model'
import { FinancingStatementTypes, FinancingStatementTypesCodeList } from '@/financing-statement/financing-statement-types'
import FormSectionHeader from '@/components/FormSectionHeader.vue'
import RegisteringParty from '@/components/RegisteringParty.vue'
import { PersonModel } from '@/components/person-model'

export default createComponent({
  components: {
    FormSectionHeader,
    RegisteringParty
  },
  props: {
    editing: {
      default: false,
      required: true,
      type: Boolean
    },
    value: {
      required: true,
      type: FinancingStatementModel
    }
  },

  setup(props, { emit }) {
    const items = ref<string[]>(FinancingStatementTypesCodeList)
    const term = ref<number>(1)
    const validTermDef = 'Term must be a number between 1 and 25'
    const termRules = [
      (value): (boolean | string) => {
        return !!value || 'Term is required'
      },
      (value): (boolean | string) => {
        return FinancingStatementModel.isValidTerm(value) ? true : validTermDef
      }
    ]

    // Callback function for emitting form validity back to the parent.
    function formValid(valid: boolean) {
      emit('valid', valid)
    }

    function updateRegisteringParty(newPerson: PersonModel): void {
      emit('input', new FinancingStatementModel(
        props.value.type,
        props.value.term,
        newPerson // props.value.registeringParty
      ))
    }

    // Callback function for emitting model changes made to the FS term
    function updateTerm(newTerm: number): void {
      if (props.value) {
        emit('input', new FinancingStatementModel(
          props.value.type,
          newTerm, // props.value.term,
          props.value.registeringParty))
      }
    }

    // Callback function for emitting model changes made to the FS term
    function updateType(newType: FinancingStatementTypes): void {
      if (props.value) {
        emit('input', new FinancingStatementModel(
          newType, //props.value.type,
          props.value.term,
          props.value.registeringParty))
      }
    }

    return {
      formValid,
      items,
      term,
      termRules,
      updateRegisteringParty,
      updateTerm,
      updateType
    }
  }
})
</script>
