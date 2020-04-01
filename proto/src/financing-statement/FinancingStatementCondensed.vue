<template lang="pug">
  v-card(flat)
    v-row
      v-col(cols="12",sm="4")
        v-card(class="pa-2",outlined)
          div Base Registration Number: {{ value.baseRegistrationNumber }}
          div Expiry Date: {{ value.expiryDate }}
          div Registration Date: {{ value.registrationDateTime }}
      v-col(cols="12",sm="4")
        v-card(class="pa-2",outlined)
          div Type: {{ value.type }}
          div Life in Years: {{ value.lifeYears }}
      v-col(cols="12",sm="4")
        v-card(class="pa-2",outlined)
          div Registering party:
            registering-party(:value="value.registeringParty", condensed=true)
      v-col(cols="12",sm="4")
        v-card(class="pa-2",outlined)
          div First secured party:
            secured-party(:value="value.securedParties[0]", condensed=true)
      v-col(cols="12",sm="4")
        v-card(class="pa-2",outlined)
          div First debtor:
            debtor-party(:value="value.debtorParties[0]", condensed=false)
      v-col(cols="12",sm="4")
        v-card(class="pa-2",outlined)
          v-btn(@click="view")  View
          v-btn(@click="view",disabled)  Amend
          v-btn(@click="view",disabled)  Renew
          v-btn(@click="view",disabled)  Discharge
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
.formInvalid {
  border: 1px solid blanchedalmond;
}
  .v-btn {
    margin-right: 10px;
  }
</style>
