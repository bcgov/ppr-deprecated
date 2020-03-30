<template lang="pug">
  v-card(flat)
    party-code(:value="party")
</template>

<script lang="ts">
import { createComponent, computed } from '@vue/composition-api'
import { RegisteringPartyModel } from '@/registering-party/registering-party-model'
import { usePartyCodes, PartyCodeInterface } from '@/party-code/party-code-model'
import PartyCode from '@/party-code/PartyCode.vue'

export default createComponent({
  components: { PartyCode },
  props: {
    editing: {
      default: false,
      required: false,
      type: Boolean
    },
    value: {
      required: true,
      type: RegisteringPartyModel
    }
  },

  setup(props, { emit }) {

    const { findPartyCodeByCode } = usePartyCodes()

    const party = computed( () => findPartyCodeByCode(props.value.partyCode))

    // Callback function for emitting the model back to the parent.
    function emitModel(person: RegisteringPartyModel) {
      emit('input', person)
    }

    // Callback function for emitting Registering Party validity back to the parent.
    function emitValid(valid: boolean) {
      emit('valid', valid)
    }

    return {
      emitModel,
      emitValid,
      party
    }
  }
})
</script>
