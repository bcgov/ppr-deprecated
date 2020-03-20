<template>
  <legacy-base-address
    :address="value.toJson()"
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
    const addressSchema = {
      streetAddress: {
        required,
        maxLength: maxLength(50)
      },
      streetAddressAdditional: {
        maxLength: maxLength(50)
      },
      addressCity: {
        required,
        maxLength: maxLength(40)
      },
      addressCountry: {
        required,
        // FUTURE: create new validation function isCountry('CA')
        isCanada: (val: string) => Boolean(val === 'CA')
      },
      addressRegion: {
        maxLength: maxLength(2),
        // FUTURE: create new validation function isRegion('BC')
        isBC: (val: string) => Boolean(val === 'BC')
      },
      postalCode: {
        required,
        maxLength: maxLength(15)
      },
      deliveryInstructions: {
        maxLength: maxLength(80)
      }
    }

    function emitUpdate(address: BaseAddressModel) {
      console.log(address, typeof address)

      emit('input', new BaseAddressModel())
      // emit('input', BaseAddressModel.fromJson(address))
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
