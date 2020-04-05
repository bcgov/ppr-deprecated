<template lang="pug">
  article
    section
      h3 Search Criteria:
      v-row
        v-col {{ record.typeAsString }}
        v-col Criteria: '{{ record.term }}'
        v-col Date: {{ record.date }}

    section
      h3 Financing statements:
      div(v-if="record.exactList.length > 0")
        section
          h4 Exact matches
          v-simple-table
            tbody
              tr(v-for="regNum in record.exactList", key="regNum")
                td
                  financing-statement-minimal(:value="getFinancingStatement(regNum)")
                  financing-statement-actions(:value="getFinancingStatement(regNum)")

      div(v-if="record.similarList.length > 0")
        section
          h4 Similar matches
          v-simple-table
            tbody
              tr(v-for="regNum in record.similarList", key="regNum")
                td
                  financing-statement-minimal(:value="getFinancingStatement(regNum)")
                  financing-statement-actions(:value="getFinancingStatement(regNum)")

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

    //  Primary input for this component/page is the search record id.
    const searchId = root.$route.query['searchId'] as string

    const { searchGetResults } = useSearching()
    const {findFinancingStatementByRegNum} = useFinancingStatements()

    const record: Ref<SearchInterface> = computed(() => searchGetResults(searchId))

    function getFinancingStatement(regNum) {
      return findFinancingStatementByRegNum(regNum)
    }
    return {
      getFinancingStatement,
      record
    }
  }
})
</script>
<style lang="scss" scoped>

  section {
    margin: 1rem 0;
  }
</style>
