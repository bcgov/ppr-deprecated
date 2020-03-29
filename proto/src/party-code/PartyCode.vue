<template lang="pug">
  v-simple-table
    tbody
      tr
        td Code:
        td {{value.code}}
      tr
        td Business:
        td {{value.business}}
      tr
        td Contact:
        td {{value.contact}}
      tr
        td Address:
        td
          address-segment(:value="value.address")
</template>

<script lang="ts">
  import { createComponent } from '@vue/composition-api'
import AddressSegment from '@/address/AddressSegment.vue'
import { PartyCodeModel } from '../party-code/party-code-model'

export default createComponent({
  components: { AddressSegment },
  props: {
    editing: {
      default: false,
      required: false,
      type: Boolean
    },
    value: {
      required: true,
      type: PartyCodeModel
    }
  },
  setup(_, { emit }) {

    return {
    }
  }
})
</script>

<style lang="scss" scoped>
  @import '../assets/styles/theme.scss';
</style>
