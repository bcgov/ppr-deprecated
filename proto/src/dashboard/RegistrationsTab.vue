<template lang="pug">
  v-simple-table
    tbody
      tr(v-for="financingStatement in fsList")
        td
          financing-statement-minimal(:value="financingStatement")

</template>
<script lang="ts">
import { computed, createComponent } from '@vue/composition-api'
import { useFinancingStatements } from '@/financing-statement/financing-statement-store'
import { useUsers } from '@/users/users'
import FinancingStatementMinimal from '@/financing-statement/FinancingStatementMinimal.vue'
import FinancingStatementCondensed from '@/financing-statement/FinancingStatementCondensed.vue'
export default createComponent({
  components: { FinancingStatementCondensed, FinancingStatementMinimal },
  setup() {
    const { getUsersFinancingStatementList } = useFinancingStatements()

    const fsList = computed(() => getUsersFinancingStatementList() )

    return { fsList }
  }
})

</script>


<style lang="scss" scoped>
  @import '../assets/styles/theme.scss';
</style>
