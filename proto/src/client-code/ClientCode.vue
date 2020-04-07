<template lang="pug">
  div(style="display:inline")
    v-form(
      v-if="editing",
      @input="formValid($event)"
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
    div(v-if="layout === 'minimal' && partyCode && !editing")
      span {{partyCode.business}} ({{partyCode.clientCode }})
    div(v-if="layout !== 'minimal' && partyCode && !editing")
      v-simple-table
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
import { computed, createComponent } from '@vue/composition-api'
import { usePartyCodes } from '../party-code/party-code-model'
import AddressSegment from '../address/AddressSegment.vue'

export default createComponent({
  components: { AddressSegment },
  props: {
    layout: {
      default: 'full',
      required: false,
      type: String
    },
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

    // Callback function for emitting form validity back to the parent.
    function formValid(valid: boolean) {
      emit('valid', valid)
    }

    return {
      formValid,
      partyList,
      partyCode,
      updateParty
    }
  }
})
</script>


