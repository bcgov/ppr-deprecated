<template>
  <section>
    <header>
      <h2>Results for your search of Personal Property Registry</h2>
    </header>
    <p>
      Search terms: {{ terms }}
    </p>
    <div>
      <pre>{{ results }}</pre>
    </div>
  </section>
</template>

<script lang="ts">
import {computed, createComponent} from "@vue/composition-api"
import {Data} from "@vue/composition-api/dist/ts-api/component"
import {useSearcherRegNum} from '@/search/search-regnum'

export default createComponent({
  setup(): Data {
    const searcher = useSearcherRegNum()
    const terms = computed(() => {
      return searcher.term
    })
    const results = computed(() => {
      return searcher.results
    })
    return {
      results,
      terms,
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
