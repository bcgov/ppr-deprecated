<template lang="pug">
  div
    div(class="part") Number: {{ value.baseRegistrationNumber }}
    div(class="part") Expires: {{ value.expiryDate }}
    div(class="part fsType") {{ value.type }}
    div(class="part")
      span Base debtor:
        debtor-party(:value="value.debtorParties[0]", layout="minimal")
    div(class="part")
      span Base secured party:
        secured-party(:value="value.securedParties[0]", layout="minimal")
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'
import { BasePartyModel } from '@/base-party/base-party-model'
import { FinancingStatementModel } from '@/financing-statement/financing-statement-model'
import { FinancingStatementType } from '@/financing-statement/financing-statement-type'
import { PersonNameModel } from '@/person-name/person-name-model'
import { SecuredPartyModel } from '@/secured-parties/secured-party-model.ts'
import DebtorParty from '@/debtor-parties/DebtorParty.vue'
import RegisteringParty from '@/registering-party/RegisteringParty.vue'
import SecuredParty from '@/secured-parties/SecuredParty.vue'

export default createComponent({
  components: {
    DebtorParty,
    RegisteringParty,
    SecuredParty
  },
  props: {
    editing: {
      default: false,
      required: false,
      type: Boolean
    },
    value: {
      required: true,
      type: FinancingStatementModel
    }
  },

  setup(props, { root }) {
    function view() {
      const baseRegistrationNumber = props.value.baseRegistrationNumber
      root.$router.push({ name: 'financing-view', query: { regNum: baseRegistrationNumber } })
    }
    return {
      view
    }
  }
})
</script>

<style lang="scss" scoped>
.part {
  display: table-cell;
  padding-right: 1rem;
}
  .fsType {
    min-width: 12rem;
  }
</style>
