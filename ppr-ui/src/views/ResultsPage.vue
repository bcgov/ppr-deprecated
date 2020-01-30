<template>
  <div>
    <v-container class="view-container">
      <article id="mockSearchResultsPage">
        <header>
          <h1>Personal Property Registry</h1>
        </header>
        <section>
          <p>This is where text will appear about the list of financing statements that have resulted from a search</p>
          <p>
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
            dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
            deserunt mollit anim id est laborum."
          </p>
        </section>
        <search-results />
      </article>
    </v-container>
  </div>
</template>

<script lang="ts">
import {createComponent} from "@vue/composition-api"
import {Data} from "@vue/composition-api/dist/ts-api/component"
import SearchResults from '@/search/SearchResults.vue'

export default createComponent({
  components: {SearchResults},
  setup(): Data {
    return {
    }
  }
})
</script>

