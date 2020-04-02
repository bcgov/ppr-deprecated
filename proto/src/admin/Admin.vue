<template lang="pug">
  div
    section
      h2 Financing Statements
      v-container
        div
          v-btn(@click="saveFinancingStatements") Save
        div
          label(for="loadFS") Import financing statements as JSON:
          input(type="file", id="loadFS", name="loadFS", accept="application/json", @change="setFile")
    section
      h2 Search Results
      v-container
        div
          v-btn(@click="searchAdminReset") Reset


</template>

<script>
import { createComponent } from '@vue/composition-api'
import { useAdmin } from '@/admin/admin'
import { useSearching } from '@/search/searching'

export default createComponent({
  setup() {
    const { clearLocalStorage, loadFinancingStatements, saveFinancingStatements } = useAdmin()
    const { searchAdminReset } = useSearching()

    function setFile (event) {
      const file = event.target.files[0]
      console.log("File name", file)
      loadFinancingStatements(file)
    }

    return {
      saveFinancingStatements,
      setFile,
      searchAdminReset
    }
  }
})


</script>

<style lang="scss" scoped>

  section {
    margin: 1rem 0;
  }
</style>
