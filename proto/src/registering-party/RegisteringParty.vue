<template lang="pug">
  v-card(flat)
    div
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
    value: {
      required: true,
      type: RegisteringPartyModel
    }
  },

  setup(props, { emit }) {

    const { findPartyByCode } = usePartyCodes()

    const party = computed(() => {
      return findPartyByCode(props.value.clientCode)
    })

    return {
      party
    }
  }
})
</script>
