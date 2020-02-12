<template>
  <div>
    <v-container class="view-container">
      <router-link to="home">
        Home
      </router-link>
    </v-container>
    <v-container class="view-container">
      <article id="mockSearchPage">
        <header>
          <h1>Search the Personal Property Registry</h1>
        </header>
        <p>
          This section of the application allow searching the Personal Property Registry.
        </p>
        <section>
          <search-input
            :error-message="searcherRegNum.errorMessage"
            :label="searcherRegNum.label"
            :hint="searcherRegNum.describeValid"
            :rules="searcherRegNum.validationRules"
            @search="doSearchRegNum"
          />
        </section>
      </article>
    </v-container>
  </div>
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'
// import { Data } from '@vue/composition-api/dist/ts-api/component'
import { useLoadIndicator } from '@/load-indicator'
import { useRouter } from '@/router/router'
import SearchInput from '@/search/SearchInput.vue'
import { useSearcherRegNum } from '@/search/search-regnum'

export default createComponent({
  components: { SearchInput },

  setup() {
    const loadIndicator = useLoadIndicator()
    const { router } = useRouter()
    const searcherRegNum = useSearcherRegNum()

    function doSearch(searcher, term: string): Promise<void> {
      loadIndicator.start()

      return searcher.doSearch(term)
        .then((): void => {
          router.push('results')
        })
        .catch((errorMessage: string): void => {
          // Note that Sentry will capture all console.error
          console.error('In search page catch on do search.', errorMessage)
        })
        .finally(() => {
          loadIndicator.stop()
        })
    }

    function doSearchRegNum(term: string) {
      doSearch(searcherRegNum, term)
    }

    return {
      doSearchRegNum,
      searcherRegNum
    }
  }
})
</script>
