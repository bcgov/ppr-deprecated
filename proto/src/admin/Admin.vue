<template lang="pug">
  div
    section
      h2 Financing Statements
      v-container
        div
          v-btn(@click="clearFinancingStatementStash") Reset Financing Statements
        div
          p &nbsp;
        div
          v-btn(@click="saveFinancingStatements") Save Financing Statements as JSON
        div
          p &nbsp;
        div
          input(type="file", id="loadFS", name="loadFS", accept="application/json", @change="setFile")
          label(for="loadFS") Import financing statements as JSON:
    section
      h2 Search Results
      v-container
        div
          v-btn(@click="searchAdminReset") Reset

    section
      h2 Payment
      v-container
        div
          v-btn(@click="paymentAdminReset") Reset


</template>

<script>
import { createComponent } from '@vue/composition-api'
import { useAdmin } from '@/admin/admin'
import { useSearching } from '@/search/searching'
import { usePaymentSystem } from '@/payment/payment-system'

export default createComponent({
  setup() {
    const { clearLocalStorage, clearFinancingStatementStash, loadFinancingStatements, saveFinancingStatements } = useAdmin()
    const { searchAdminReset } = useSearching()
    const { paymentAdminReset } = usePaymentSystem()

    function setFile (event) {
      const file = event.target.files[0]
      console.log("File name", file)
      loadFinancingStatements(file)
    }

    return {
      clearFinancingStatementStash,
      saveFinancingStatements,
      setFile,
      searchAdminReset,
      paymentAdminReset
    }
  }
})


</script>

<style lang="scss" scoped>

  section {
    margin: 1rem 0;
  }
</style>
