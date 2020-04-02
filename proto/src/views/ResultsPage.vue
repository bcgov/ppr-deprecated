<template>
  <div>
    <v-container class="view-container">
      <article id="mockSearchResultsPage">
        <header>
          <h1>Results for your search</h1>
        </header>
        <section>
          <search-results />
        </section>
      </article>
    </v-container>
  </div>
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'
import SearchResults from '@/search/SearchResults.vue'

export default createComponent({
  components: { SearchResults },
  setup() {
    return {
    }
  }
})
</script>
