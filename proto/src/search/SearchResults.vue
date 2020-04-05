<template lang="pug">
  section
    p.
      This prototype demonstrations a limited set of what a real PPR search needs to do.
    h3 Search Criteria:
    v-row
      v-col Searched for: '{{ record.term }}'
      v-col At time: {{ record.date }}
      v-col Search Type: {{record.typeAsString }}

    div record {{ record }}
    div(id="searchResults")
      h3 Financing statements:

      div(v-if="exactList.length > 0")
        h4 Exact matches
        v-simple-table
          tbody
            tr(v-for="financingStatement in exactList")
              td
                financing-statement-minimal(:value="financingStatement")
              td
                financing-statement-actions(:value="financingStatement")

      div(v-if="similarList.length > 0")
        h4 Similar matches
        v-simple-table
          tbody
            tr(v-for="financingStatement in similarList")
              td
                financing-statement-minimal(:value="financingStatement")
              td
                financing-statement-actions(:value="financingStatement")

</template>

<script lang="ts">
import { computed, createComponent, ref, Ref, Readonly } from '@vue/composition-api'
import { useFinancingStatements, FinancingStatementInterface } from '@/financing-statement/financing-statement-store'
import { useSearching, SearchTypes, SearchInterface } from '@/search/searching'
import FinancingStatementActions from '@/financing-statement/FinancingStatementActions.vue'
import FinancingStatementMinimal from '@/financing-statement/FinancingStatementMinimal.vue'

export default createComponent({
  components: { FinancingStatementActions, FinancingStatementMinimal },
  setup(_, { root }) {
    const { searchGetResults } = useSearching()

    const { getFinancingStatementListForIdList } = useFinancingStatements()
    const searchId = root.$route.query['searchId'] as string

    const record: Ref<SearchInterface> = computed(() => searchGetResults(searchId))
    const exactList:Ref<FinancingStatementInterface[]> = computed(() => {
      return record.value && record.value.exactList ?
        getFinancingStatementListForIdList(record.value.exactList) :
        []
    } )
    const similarList: Ref<FinancingStatementInterface[]> = computed(() => {
      return record.value && record.value.similarList ?
        getFinancingStatementListForIdList(record.value.similarList) :
        []
    } )



    return {
      record,
      exactList,
      similarList
    }
  }
})
</script>
