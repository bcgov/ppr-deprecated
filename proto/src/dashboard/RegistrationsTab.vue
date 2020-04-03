<template lang="pug">
  v-simple-table
    tbody
      tr(v-for="financingStatement in fsList")
        td
          financing-statement-minimal(:value="financingStatement")
        td
          financing-statement-actions(:value="financingStatement")

</template>
<script lang="ts">
import { computed, createComponent } from '@vue/composition-api'
import { useFinancingStatements } from '@/financing-statement/financing-statement-store'
import { useUsers } from '@/users/users'
import FinancingStatementActions from '@/financing-statement/FinancingStatementActions.vue'
import FinancingStatementMinimal from '@/financing-statement/FinancingStatementMinimal.vue'

export default createComponent({
  components: { FinancingStatementActions, FinancingStatementMinimal },
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
