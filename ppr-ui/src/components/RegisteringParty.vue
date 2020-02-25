<template>
  <v-card flat>
    <base-party
      :editing="editing"
      :value="value"
      @input="emitModel($event)"
      @valid="formValid($event)"
    />
  </v-card>
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'

import BaseParty from '@/components/BaseParty.vue'
import { PersonModel } from '@/components/person-model'

export default createComponent({
  components: { BaseParty },

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

  setup(_, { emit }) {
    // Callback function for emitting the model back to the parent.
    function emitModel(person: PersonModel) {
      emit('input', person)
    }

    // Callback function for emitting Person validity back to the parent.
    function formValid(valid: boolean) {
      emit('valid', valid)
    }

    return {
      emitModel,
      formValid
    }
  }
})
</script>
