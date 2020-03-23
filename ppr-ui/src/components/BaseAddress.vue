<template>
  <legacy-base-address
    :address="value.toLegacyJson()"
    :editing="editing"
    :schema="addressSchema"
    @update:address="emitUpdate($event)"
    @valid="emitValid($event)"
  />
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'
import BaseAddress from 'sbc-common-components/src/components/BaseAddress.vue'
import { maxLength, required } from 'vuelidate/lib/validators'

import { BaseAddressModel } from '@/components/base-address-model'

export default createComponent({
  components: { LegacyBaseAddress: BaseAddress },

  props: {
    editing: {
      default: false,
      required: false,
      type: Boolean
    },
    value: {
      default: () => new BaseAddressModel(),
      required: false,
      type: BaseAddressModel
    }
  },

  setup(props, { emit }) {
    // The validation rules for the legacy address component.
    const addressSchema = {
      addressCity: {
        maxLength: maxLength(40),
        required
      },
      addressCountry: {
        required
      },
      addressRegion: {
        maxLength: maxLength(2)
      },
      deliveryInstructions: {
        maxLength: maxLength(80)
      },
      postalCode: {
        maxLength: maxLength(15),
        required
      },
      streetAddress: {
        maxLength: maxLength(50),
        required
      },
      streetAddressAdditional: {
        maxLength: maxLength(50)
      }
    }

    function emitUpdate(address: BaseAddressModel) {
      emit('input', BaseAddressModel.fromLegacyJson(address))
    }

    function emitValid(validity: boolean) {
      emit('valid', validity)
    }

    return {
      addressSchema,
      emitUpdate,
      emitValid
    }
  }
})
</script>
