<template>
  <v-card flat>
    <v-form
      v-if="editing"
      @input="formValid($event)"
    >
      <v-text-field
        data-test-id="PersonName.first"
        label="First Name"
        :rules="firstNameRules"
        :value="value.first"
        required
        @input="updateFirst($event)"
      />
      <v-text-field
        data-test-id="PersonName.middle"
        label="Middle Name"
        :value="value.middle"
        @input="updateMiddle($event)"
      />
      <v-text-field
        data-test-id="PersonName.last"
        label="Last Name"
        :rules="lastNameRules"
        :value="value.last"
        required
        @input="updateLast($event)"
      />
    </v-form>
    <div v-else>
      {{ value.first + ' ' + value.middle + ' ' + value.last }}
    </div>
  </v-card>
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'

import { PersonNameModel } from '@/components/person-name-model'

export default createComponent({
  props: {
    editing: {
      default: false,
      required: false,
      type: Boolean
    },
    value: {
      required: true,
      type: PersonNameModel
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
    function updateFirst(newFirst: string): void {
      emit('input', new PersonNameModel(newFirst, props.value.middle, props.value.last))
    }

    // Callback function for emitting model changes made to the last name.
    function updateLast(newLast: string): void {
      emit('input', new PersonNameModel(props.value.first, props.value.middle, newLast))
    }

    // Callback function for emitting model changes made to the middle name.
    function updateMiddle(newMiddle: string): void {
      emit('input', new PersonNameModel(props.value.first, newMiddle, props.value.last))
    }

    return {
      firstNameRules,
      formValid,
      lastNameRules,
      updateFirst,
      updateLast,
      updateMiddle
    }
  }
})
</script>
