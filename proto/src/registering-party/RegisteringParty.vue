<template>
  <v-card flat>
    <base-party
      :value="value"
      :editing="editing"
      @input="emitModel($event)"
      @valid="emitValid($event)"
    />
  </v-card>
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'
import { BasePartyModel } from '@/base-party/base-party-model'
import BaseParty from '@/base-party/BaseParty.vue'

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
      type: BasePartyModel
    }
  },

  setup(_, { emit }) {
    // Callback function for emitting the model back to the parent.
    function emitModel(person: BasePartyModel) {
      emit('input', person)
    }

    // Callback function for emitting Registering Party validity back to the parent.
    function emitValid(valid: boolean) {
      emit('valid', valid)
    }

    return {
      emitModel,
      emitValid
    }
  }
})
</script>
