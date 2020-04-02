<template lang="pug">
  div
    div(class="part")
      div Searched for:
      div {{record.term}}
    div(class="part")
      div Date:
      div {{ record.date }}
    div(class="part")
      div Liens:
    div(class="part")
      div(v-for="regNum in record.list", key="regNum")
        financing-statement-minimal(:value="getFinancingStatement(regNum)")

</template>

<script lang="ts">
import { computed, createComponent } from '@vue/composition-api'
import { useFinancingStatements } from '@/financing-statement/financing-statement-store'
import { SearchInterface } from '@/search/searching'
import FinancingStatementMinimal from '@/financing-statement/FinancingStatementMinimal.vue'

export default createComponent({
  components: {
    FinancingStatementMinimal
  },
  props: {
    record: {
      required: true,
      type: SearchInterface
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
</style>
