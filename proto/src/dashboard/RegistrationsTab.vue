<template lang="pug">
  v-simple-table
    tbody
      tr(v-for="financingStatement in financingStatementsList")
        td
          financing-statement-condensed(:value="financingStatement")

</template>
<script lang="ts">
  import { createComponent } from '@vue/composition-api'
  import { useFinancingStatements } from '@/financing-statement/financing-statement-store'
  import { useUsers } from '@/users/users'
  import FinancingStatementCondensed from '@/financing-statement/FinancingStatementCondensed.vue'
  export default createComponent({
    components: { FinancingStatementCondensed },
    setup(_, { root }) {
      const { financingStatementsList } = useFinancingStatements()

      return {financingStatementsList}
    }
  })

</script>


<style lang="scss" scoped>
  @import '../assets/styles/theme.scss';
  .party-code {
    margin: 1rem 0;
  }
</style>
