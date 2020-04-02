<template lang="pug">
  section
    header
      h2 Results for your search
    p.
      The content on this page is for demonstration purposes only.
    div
      p.
        Searched for: {{ criteria.term }}
    div(id="searchResults")
      p.
        Search results:
      v-simple-table
        tbody
          tr(v-for="financingStatement in fsList")
            td
              financing-statement-minimal(:value="financingStatement")

</template>

<script lang="ts">
import { computed, createComponent, ref } from '@vue/composition-api'
import { useSearching, SearchTypes } from '@/search/searching'
import FinancingStatementMinimal from '@/financing-statement/FinancingStatementMinimal.vue'

export default createComponent({
  components: { FinancingStatementMinimal },
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
