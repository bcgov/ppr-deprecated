<template lang="pug">
  div
    v-card(flat, v-if="editing")
      v-form(
        v-if="editing"
      )
        v-autocomplete(
          :value="value",
          :items="partyList",
          item-text="business",
          item-value="clientCode",
          placeholder="Start typing to search for a client code",
          prepend-icon="mdi-id-card",
          @input="updateParty($event)",
          return-object=false
        )
    v-simple-table(v-if="partyCode")
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
import { computed, createComponent, ref } from '@vue/composition-api'
import { usePartyCodes } from '../party-code/party-code-model'
import { ClientCodeModel } from '@/client-code/client-code-model'
import AddressSegment from '../address/AddressSegment.vue'

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
      type: String
    }
  },
  setup(props, { emit }) {

    function updateParty(clientCode): void {
      emit('input', clientCode)
    }

    const { partyList, findPartyByCode } = usePartyCodes()

    const partyCode = computed(() => findPartyByCode(props.value))

    return {
      partyList,
      partyCode,
      updateParty
    }
  }
})
</script>


