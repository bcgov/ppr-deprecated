<template lang="pug">
  div
    proto-to-do
      p.
        This tab shows all registrations for the current user. Some todos include:
      ul
        li Include all registrations for the current user's company.  For staff members, show all registrations.
        li Definitely add some means of pagination, filtering, searching, sorting etc.
        li It is very important that the registration date and time is show here.
        li If a registration has "Court Information" or "Additional Description" information then show a snippet of this.
      p.
        Amendments are yet to be prototyped.  See the GitHub readme file for some suggestions.  Note that amendment operations
        only need to include "marked as deleted" and "added" on the Secured Party, Debtors and Serial Collateral. And
        only need "added" for general collateral and (if added) Additional Description (Court Information).
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
import ProtoToDo from '@/components/ProtoToDo.vue'

export default createComponent({
  components: { FinancingStatementActions, FinancingStatementMinimal, ProtoToDo },
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
