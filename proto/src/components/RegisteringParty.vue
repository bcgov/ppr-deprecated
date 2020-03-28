<template>
  <v-card flat>
    <person-name
      :editing="editing"
      :value="value"
      @input="emitModel($event)"
      @valid="formValid($event)"
    />
  </v-card>
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'
import { PersonNameModel } from '@/components/person-name-model'
import PersonName from '@/components/PersonName.vue'

export default createComponent({
  components: { PersonName },

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

  setup(_, { emit }) {
    // Callback function for emitting the model back to the parent.
    function emitModel(person: PersonNameModel) {
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
