<template lang="pug">
  v-col(cols="12",sm="12")
    v-btn(@click="view")  View
    v-btn(@click="view",disabled)  Amend
    v-btn(@click="view",disabled)  Renewal
    v-btn(@click="view",disabled)  Discharge
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'
import { FinancingStatementModel } from '@/financing-statement/financing-statement-model'
import { FinancingStatementType } from '@/financing-statement/financing-statement-type'
import { PersonNameModel } from '@/person-name/person-name-model'
import { SecuredPartyModel } from '@/secured-parties/secured-party-model.ts'

export default createComponent({
  props: {
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
  .v-btn {
    margin-right: 10px;
  }
</style>
