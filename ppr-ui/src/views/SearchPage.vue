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
          <h1>Personal Property Registry</h1>
        </header>
        <section>
          <p>
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
            dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
            deserunt mollit anim id est laborum."
          </p>
        </section>
        <section>
          <header>
            <h2>Search the Personal Property Registry</h2>
          </header>
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
import { Data } from '@vue/composition-api/dist/ts-api/component'
import { useLoadIndicator } from '@/load-indicator'
import { useRouter } from '@/router/router'
import SearchInput from '@/search/SearchInput.vue'
import { useSearcherSerial } from '@/search/search-serial'
import { useSearcherRegNum } from '@/search/search-regnum'

export default createComponent({
  components: { SearchInput },

  setup(): Data {
    const loadIndicator = useLoadIndicator()
    const { router } = useRouter()
    const searcherSerial = useSearcherSerial()
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

    function doSearchSerial(term: string) {
      doSearch(searcherSerial, term)
    }

    return {
      doSearchRegNum,
      searcherRegNum,
      doSearchSerial,
      searcherSerial
    }
  }
})
</script>
