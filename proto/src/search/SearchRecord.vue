<template lang="pug">
  v-row
    v-col(cols="1")
      div Searched for:
      div {{record.term}}
    v-col(cols="1")
      div Search Date:
      div {{ record.date }}
    v-col(cols="1")
      div Liens found:
    v-col
      v-simple-table
        tbody
          tr(v-for="regNum in record.list", key="regNum")
            td
              financing-statement-minimal(:value="getFinancingStatement(regNum)")
              financing-statement-actions(:value="getFinancingStatement(regNum)")


</template>

<script lang="ts">
import { computed, createComponent } from '@vue/composition-api'
import { useFinancingStatements } from '@/financing-statement/financing-statement-store'
import { SearchRecord } from '@/search/searching'
import FinancingStatementActions from '@/financing-statement/FinancingStatementActions.vue'
import FinancingStatementMinimal from '@/financing-statement/FinancingStatementMinimal.vue'

/*
  div
    div(class="part")
      div Searched for:
      div {{record.term}}
    div(class="part")
      div Search Date:
      div {{ record.date }}
    div(class="part")
      div Liens found:
    div(class="part")
      v-simple-table
        tbody
          tr(v-for="regNum in record.list", key="regNum")
            td
              financing-statement-minimal(:value="getFinancingStatement(regNum)")
              financing-statement-actions(:value="getFinancingStatement(regNum)")

 */
export default createComponent({
  components: {
    FinancingStatementActions,
    FinancingStatementMinimal
  },
  props: {
    record: {
      required: true,
      type: SearchRecord
    }
  },
  setup() {
    const {findFinancingStatement} = useFinancingStatements()

    function getFinancingStatement(regNum) {
      return findFinancingStatement(regNum)
    }
    return {
      getFinancingStatement
    }
  }
})
</script>

<style lang="scss" scoped>
  .part {
    display: table-cell;
    padding-right: 1rem;
  }
  tbody td {
      border: none !important;
  }
</style>
