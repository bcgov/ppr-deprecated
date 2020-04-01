
<template lang="pug">
  v-tabs(fixed-tabs, background-color="white", dark)
    v-tab Registrations
    v-tab Searches
    v-tab Client Codes
    v-tab Drafts
    v-tab-item
      v-card
        v-simple-table
          tbody
            tr(v-for="financingStatement in financingStatementsList")
              td
                financing-statement-condensed(:value="financingStatement")
    v-tab-item
      v-card
        div This tab is a placeholder for searches this user has conducted in the past
        div(style="padding-left: 1rem")
          div {{ currentUser.name }} {{ currentUser.last }},
          div {{ currentUser.company }},
          div {{ currentUser.occupation }}
    v-tab-item
      v-card
        party-codes
    v-tab-item
      v-card
        drafts
</template>
<script lang="ts">
  import { createComponent } from '@vue/composition-api'
  import { useFinancingStatements } from '@/financing-statement/financing-statement-store'
  import { useUsers } from '@/users/users'
  import FinancingStatementCondensed from '@/financing-statement/FinancingStatementCondensed.vue'
  import Drafts from '@/drafts/Drafts.vue'
  import PartyCodes from '@/dashboard/PartyCodes.vue'

  export default createComponent({
    components: { Drafts, FinancingStatementCondensed, PartyCodes },
    setup(_, { root }) {
      const { financingStatementsList } = useFinancingStatements()
      const { authenticated, currentUser} = useUsers()

      return {authenticated, currentUser, financingStatementsList}
    }
  })

</script>
<style lang="scss" scoped>
  .v-tab {
    background-color: #0d47a1 !important;
    margin-right: 1rem;
  }
  .v-tab--active {
    background-color: #fefefe !important;
    color: #0d47a1 !important;
  }
  .v-data-table {
    th {
      background-color: #38598A;
      color: #F8F9FA  !important;
      font-weight: bolder;
      font-size: 1.5rem;
    }

    th, td {
      padding-bottom: 2rem;
      font-size: 1.0rem;
    }
    tbody tr:nth-of-type(even) {
      background-color: white;
    }
  }
</style>
