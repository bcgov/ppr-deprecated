<template>
  <div>
    <v-container class="view-container">
      <article id="mockSearchResultsPage">
        <header>
          <h1>Search Results</h1>
        </header>
        <section>
          <p>
          This prototype demonstrations a limited set of what a real PPR search needs to do.
          </p>
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
