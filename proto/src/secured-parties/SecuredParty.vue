<template lang="pug">
  div
    v-card(flat)
      client-code(
        :value="partyCode",
        :editing="editing",
        @input="updateClientCode($event)"
        @valid="emitValid($event)"
      )
</template>

<script lang="ts">
import { createComponent, computed } from '@vue/composition-api'
import { usePartyCodes, PartyCodeInterface } from '@/party-code/party-code-model'
import { SecuredPartyModel } from '@/secured-parties/secured-party-model.ts'
import ClientCode from '@/client-code/ClientCode.vue'

export default createComponent({
  components: { ClientCode },
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

    const { findPartyByCode } = usePartyCodes()
    const partyCode = computed(() => {
      const p = findPartyByCode(props.value.clientCode)
      return p ? p.clientCode : ''
    })

    function updateClientCode(clientCode: string) {
      emit('input', new SecuredPartyModel(clientCode))
    }

    function emitValid(formValid: boolean) {
      emit('valid', formValid)
    }
    return {
      emitValid,
      partyCode,
      updateClientCode
    }
  }
})
</script>
