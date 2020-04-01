<template lang="pug">
  div
    v-card(flat, v-if="editing")
      v-form(
        v-if="editing"
        @input="emitValid($event)"
      )
        v-autocomplete(
          :value="model",
          :items="partyList",
          item-text="business",
          item-value="clientCode",
          label="Clients codes available",
          placeholder="Start typing to search for a client code",
          prepend-icon="mdi-id-card",
          @input="updateParty($event)",
          return-object=true
        )
    v-simple-table
      tbody
        tr
          td Code:
          td {{value.clientCode}}
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
import { createComponent, ref } from '@vue/composition-api'
import AddressSegment from '@/address/AddressSegment.vue'
import { PartyCodeModel, usePartyCodes } from '@/party-code/party-code-model'

export default createComponent({
  components: { AddressSegment },
  props: {
    condensed: {
      default: false,
      required: false,
      type: Boolean
    },
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
  setup(props, { emit }) {

    function emitValid(valid: boolean) {
      emit('valid', valid)
    }

    function updateParty(party: any): void {
      console.log('emit the new party', party)
      emit('input', new PartyCodeModel(party.clientCode))
    }

    const { partyList } = usePartyCodes()

    const model = ref(props.value.clientCode)
    return {
      emitValid,
      partyList,
      model,
      updateParty
    }
  }
})
</script>


