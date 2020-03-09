<template>
  <v-card flat>
    <v-form v-if="editing">
      <v-text-field
        data-test-id="BusinessName.input.name"
        label="Business Name"
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
import { BusinessModel } from '@/components/business-model'


export default createComponent({
  props: {
    editing: {
      default: false,
      required: false,
      type: Boolean
    },
    value: {
      required: true,
      type: BusinessModel
    }
  },
  setup(_, { emit }) {

    // Callback function for emitting model changes made to the business name.
    function updateName(newBusinessName: string): void {
      emit('input', new BusinessModel(newBusinessName))
    }
    return {
      updateName
    }
  }
})
</script>
