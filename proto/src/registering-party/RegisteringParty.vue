<template lang="pug">
  div
    div(v-if="condensed")
      div Client Code: {{partyCode.clientCode }}, Company Name: {{partyCode.business}}
    v-simple-table(v-else)
      tbody
        tr
          td Code:
          td {{partyCode.clientCode}}
        tr
          td Business:
          td {{partyCode.business}}
        tr
          td Contact:
          td {{partyCode.contact}}
        tr
          td Address:
          td
            address-segment(:value="partyCode.address")
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
    condensed: {
      default: false,
      required: false,
      type: Boolean
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
