<template lang="pug">
  client-code(
    :value="partyCode",
    :layout="layout",
    :editing="editing",
    @input="updateClientCode($event)"
    @valid="emitValid($event)"
  )
</template>

<script lang="ts">
import { createComponent, computed } from '@vue/composition-api'
import { usePartyCodes } from '@/party-code/party-code-model'
import { SecuredPartyModel } from '@/secured-parties/secured-party-model.ts'
import ClientCode from '@/client-code/ClientCode.vue'

export default createComponent({
  components: { ClientCode },
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
