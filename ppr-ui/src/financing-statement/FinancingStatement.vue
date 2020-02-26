<template>
  <v-card outlined>
    <form-section-header label="Type and duration" />
    <v-container>
      <v-form
        v-if="editing"
        @input="formValid($event)"
      >
        <v-select
          :value="value.type"
          :items="fsTypes"
          label="Type"
          name="typeInput"
          @input="updateType"
        />
        <v-text-field
          :value="value.life"
          :rules="lifeRules"
          label="Life"
          name="lifeInput"
          @input="updateTerm"
        />
      </v-form>
      <div v-else>
        <div>
          Life: {{ value.life }}
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
import { FinancingStatementModel } from '@/financing-statement/financing-statement-model'
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
      required: false,
      type: Boolean
    },
    value: {
      required: true,
      type: FinancingStatementModel
    }
  },

  setup(props, { emit }) {
    const fsTypes = ref<string[]>(FinancingStatementTypesCodeList)
    const life = ref<number>(1)
    const lifeRules = [
      (value): (boolean | string) => {
        return !!value || 'Life is required'
      },
      (value): (boolean | string) => {
        return FinancingStatementModel.isValidLife(value) ? true : 'Life must be a number between 1 and 25'
      }
    ]

    // Callback function for emitting form validity back to the parent.
    function formValid(valid: boolean) {
      emit('valid', valid)
    }

    function updateRegisteringParty(newPerson: PersonModel): void {
      emit('input', new FinancingStatementModel(
        props.value.type,
        props.value.life,
        newPerson // props.value.registeringParty
      ))
    }

    // Callback function for emitting model changes made to the FS life
    function updateTerm(newLife: number): void {
      emit('input', new FinancingStatementModel(
        props.value.type,
        newLife, // props.value.life,
        props.value.registeringParty))
    }

    // Callback function for emitting model changes made to the FS life
    function updateType(newType: FinancingStatementTypes): void {
      emit('input', new FinancingStatementModel(
        newType, //props.value.type,
        props.value.life,
        props.value.registeringParty))
    }

    return {
      formValid,
      fsTypes,
      life,
      lifeRules,
      updateRegisteringParty,
      updateTerm,
      updateType
    }
  }
})
</script>
