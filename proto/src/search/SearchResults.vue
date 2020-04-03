<template lang="pug">
  section
    p.
      This prototype demonstrations a limited set of what a real PPR search needs to do.
    h3 Search Criteria:
    v-row
      v-col Searched for: '{{ criteria.term }}'
      v-col At time: {{ criteria.date }}
      v-col Search Type: {{criteria.typeAsString }}

    div(id="searchResults")
      h3 Financing statements:
      v-simple-table
        tbody
          tr(v-for="financingStatement in fsList")
            td
              financing-statement-minimal(:value="financingStatement")
            td
              financing-statement-actions(:value="financingStatement")

</template>

<script lang="ts">
import { computed, createComponent, ref } from '@vue/composition-api'
import { useSearching, SearchTypes } from '@/search/searching'
import FinancingStatementActions from '@/financing-statement/FinancingStatementActions.vue'
import FinancingStatementMinimal from '@/financing-statement/FinancingStatementMinimal.vue'

export default createComponent({
  components: { FinancingStatementActions, FinancingStatementMinimal },
  setup(_, { root }) {
    const { searchGet, searchGetResults } = useSearching()
    const searchId = root.$route.query['searchId'] as string

    const criteria = computed(() => searchGet(searchId) )
    const fsList = computed(() => searchGetResults(searchId) )


    return {
      fsList,
      criteria
    }
  }
})
</script>
