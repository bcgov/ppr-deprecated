<template lang="pug">
  v-card(flat)
    party-code(:value="party")
</template>

<script lang="ts">
import { createComponent, computed } from '@vue/composition-api'
import { usePartyCodes, PartyCodeInterface } from '@/party-code/party-code-model'
import { useSecuredParty, SecuredPartyModel } from '@/secured-parties/secured-party-model.ts'
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
      type: SecuredPartyModel
    }
  },

  setup(props, { emit }) {

    const { findPartyCodeByCode } = usePartyCodes()
    const party = computed( () => findPartyCodeByCode(props.value.partyCode))

    function emitModel(model: SecuredPartyModel) {
      emit('input', model)
    }

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
