<template lang="pug">
  v-container
    v-row
      v-col(cols="2")
        div(class="part") Number: {{ value.baseRegistrationNumber }}
      v-col(cols="2")
        div(class="part") Expires: {{ value.expiryDate }}
      v-col(cols="4")
        span Base debtor:
          debtor-party(:value="value.debtorParties[0]", layout="minimal")
      v-col(cols="4")
        span Base secured party:
          secured-party(:value="value.securedParties[0]", layout="minimal")
    v-row
      v-col(cols="2")
        div(class="part fsType") {{ value.type }}
      v-col(cols="4")
        general-collateral(:value="value.generalCollateral[0]", layout="minimal")
      v-col(cols="4")
        serial-collateral(:value="value.serialCollateral[0]", layout="minimal")
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'
import { FinancingStatementModel } from '@/financing-statement/financing-statement-model'
import DebtorParty from '@/debtor-parties/DebtorParty.vue'
import RegisteringParty from '@/registering-party/RegisteringParty.vue'
import SecuredParty from '@/secured-parties/SecuredParty.vue'
import GeneralCollateral from '@/general-collateral/GeneralCollateral.vue'
import SerialCollateral from '@/serial-collateral/SerialCollateral.vue'

export default createComponent({
  components: {
    DebtorParty,
    GeneralCollateral,
    RegisteringParty,
    SecuredParty,
    SerialCollateral
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
