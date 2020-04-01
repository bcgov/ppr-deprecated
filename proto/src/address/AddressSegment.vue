<template lang="pug">
  div
    div {{oneLine}}
</template>

<script lang="ts">
  import { computed, createComponent } from '@vue/composition-api'
import { AddressModel } from '@/address/address-model'

export default createComponent({
  props: {
    editing: {
      default: false,
      required: false,
      type: Boolean
    },
    value: {
      required: true,
      type: AddressModel
    }
  },
  setup(props, { emit }) {
    const oneLine = computed(() => {
      const text = []
      props.value.street ? text.push(props.value.street) : undefined
      props.value.city ? text.push(props.value.city) : undefined
      props.value.province ? text.push(props.value.province) : undefined
      props.value.postal ? text.push(props.value.postal) : undefined
      props.value.country ? text.push(props.value.country) : undefined
      return text.join(', ')
    })
    return {
      oneLine
    }
  }
})
</script>

