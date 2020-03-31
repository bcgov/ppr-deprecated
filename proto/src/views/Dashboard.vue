<template lang="pug">
  div
    v-container(class="view-container")
      article
        header
          h1 Dashboard

        div(class="page-content")
          div(class="page-content__main")
            p Placeholder page.
        v-container
          div(style="padding-left: 1rem")
          div {{ currentUser.name }} {{ currentUser.last }},
          div {{ currentUser.company }},
          div {{ currentUser.occupation }}
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
      const { authenticated, currentUser} = useUsers()

      return {authenticated, currentUser, financingStatementsList}
    }
  })

</script>
<style lang="scss" scoped>

  .v-data-table {
    th {
      background-color: #38598A;
      color: #F8F9FA  !important;
      font-weight: bolder;
      font-size: 1.5rem;
    }

    th, td {
      border: 0.5px dotted darkgrey;
      padding-bottom: 2rem;
    }
    tbody tr:nth-of-type(even) {
      background-color: rgba(0, 0, 0, .05);
    }
  }
</style>
