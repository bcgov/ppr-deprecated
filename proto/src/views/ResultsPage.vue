<template>
  <div>
    <v-container class="view-container">
      <article id="mockSearchResultsPage">
        <header>
          <h1>Personal Property Registry</h1>
        </header>
        <section>
          <p>This is where text will appear about the list of financing statements that have resulted from a search</p>
        </section>
        <search-results />
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
