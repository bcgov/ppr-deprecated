<template>
  <section>
    <header>
      <h2>Results for your search</h2>
    </header>
    <p>
      Search criteria: {{ terms }}
    </p>
    <div>
      <pre>{{ results }}</pre>
    </div>
  </section>
</template>

<script lang="ts">
import { computed, createComponent } from '@vue/composition-api'
import { useSearcherRegNum } from '@/search/search-regnum'

export default createComponent({
  setup() {
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
