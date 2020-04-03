<template lang="pug">
  div
    div(v-if="layout==='minimal'")
      div Client Code: {{partyCode.clientCode }}, Company Name: {{partyCode.business}}
    div(v-else)
      v-row
        v-col(cols="2")
          div Business:
        v-col(cols="3")
          div {{partyCode.business}}
      v-row
        v-col(cols="2")
          div Contact:
        v-col(cols="3")
          div {{partyCode.contact}}
      v-row
        v-col(cols="2")
          div Address:
        v-col(cols="3")
          address-segment(:value="partyCode.address")
      v-row
        v-col(cols="2")
          div Code:
        v-col(cols="3")
          div {{partyCode.clientCode}}
</template>

<script lang="ts">
import { createComponent, computed } from '@vue/composition-api'
import { RegisteringPartyModel } from '@/registering-party/registering-party-model'
import { usePartyCodes } from '@/party-code/party-code-model'
import AddressSegment from '@/address/AddressSegment.vue'
import PartyCode from '@/party-code/PartyCode.vue'
import ClientCode from '@/client-code/ClientCode.vue'

export default createComponent({
  components: { AddressSegment, ClientCode, PartyCode },
  props: {
    layout: {
      default: 'full',
      required: false,
      type: String
    },
    value: {
      required: true,
      type: RegisteringPartyModel
    }
  },

  setup(props) {

    const { findPartyByCode } = usePartyCodes()

    const partyCode = computed(() => {
      const rval = findPartyByCode(props.value.clientCode)
      return rval
    })

    return {
      partyCode
    }
  }
})
</script>

<style lang="scss" scoped>

  .col {
    padding: 3px !important;
  }
  .row {
    margin: 0 !important;
  }
</style>
