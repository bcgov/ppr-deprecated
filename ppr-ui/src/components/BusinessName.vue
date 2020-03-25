<template>
  <v-card flat>
    <v-form
      v-if="editing"
      @input="formValid($event)"
    >
      <v-text-field
        data-test-id="BusinessName.input.name"
        label="Business Name"
        :rules="nameRules"
        :value="value.businessName"
        @input="updateName($event)"
      />
    </v-form>
    <div
      v-else
      data-test-id="BusinessName.display.name"
    >
      {{ value.businessName }}
    </div>
  </v-card>
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'
import { BusinessNameModel } from '@/components/business-name-model'


export default createComponent({
  props: {
    editing: {
      default: false,
      required: false,
      type: Boolean
    },
    value: {
      required: true,
      type: BusinessNameModel
    }
  },
  setup(_, { emit }) {

    const nameRules = [
      (value: string): (boolean | string) => {
        return !!value || 'The Business Name is required'
      }
    ]


    // Callback function for emitting form validity back to the parent.
    function formValid(valid: boolean) {
      emit('valid', valid)
    }

    // Callback function for emitting model changes made to the business name.
    function updateName(newBusinessName: string): void {
      emit('input', new BusinessNameModel(newBusinessName))
    }
    return {
      formValid,
      nameRules,
      updateName
    }
  }
})
</script>
