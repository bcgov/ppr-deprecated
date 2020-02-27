<template>
  <v-card flat>
    <v-form
      v-if="editing"
      @input="formValid($event)"
    >
      <v-text-field
        data-test-id="BaseParty.firstName"
        label="First Name"
        :rules="firstNameRules"
        :value="value.firstName"
        required
        @input="updateFirstName($event)"
      />
      <v-text-field
        data-test-id="BaseParty.middleName"
        label="Middle Name"
        :value="value.middleName"
        @input="updateMiddleName($event)"
      />
      <v-text-field
        data-test-id="BaseParty.lastName"
        label="Last Name"
        :rules="lastNameRules"
        :value="value.lastName"
        required
        @input="updateLastName($event)"
      />
    </v-form>
    <div v-else>
      {{ value.firstName + ' ' + value.middleName + ' ' + value.lastName }}
    </div>
  </v-card>
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'

import { PersonModel } from './person-model'

export default createComponent({
  props: {
    editing: {
      default: false,
      required: false,
      type: Boolean
    },
    value: {
      required: true,
      type: PersonModel
    }
  },

  setup(props, { emit }) {
    const firstNameRules = [
      (value: string): (boolean | string) => {
        return !!value || 'The First Name is required'
      }
    ]

    const lastNameRules = [
      (value: string): (boolean | string) => {
        return !!value || 'The Last Name is required'
      }
    ]

    // Callback function for emitting form validity back to the parent.
    function formValid(valid: boolean) {
      emit('valid', valid)
    }

    // Callback function for emitting model changes made to the first name.
    function updateFirstName(newFirstName: string): void {
      emit('input', new PersonModel(newFirstName, props.value.middleName, props.value.lastName))
    }

    // Callback function for emitting model changes made to the last name.
    function updateLastName(newLastName: string): void {
      emit('input', new PersonModel(props.value.firstName, props.value.middleName, newLastName))
    }

    // Callback function for emitting model changes made to the middle name.
    function updateMiddleName(newMiddleName: string): void {
      emit('input', new PersonModel(props.value.firstName, newMiddleName, props.value.lastName))
    }

    return {
      firstNameRules,
      formValid,
      lastNameRules,
      updateFirstName,
      updateLastName,
      updateMiddleName
    }
  }
})
</script>
