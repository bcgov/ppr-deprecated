<template>
  <div>
    <v-container class="view-container">
      <article id="mockSearchPage">
        <header>
          <h1>Search the Personal Property Registry</h1>
        </header>
        <p>
          This page demonstrates registration number search for the new Personal Property Registry.
          This is a functional layout only.  Future searches will include; serial, MHR, debtor, collateral, etc.
        </p>
        <section>
          <search-input
            id="searchInput"
            :error-message="searchRegNumUi.errorMessage"
            :label="searchRegNumUi.label"
            :hint="searchRegNumUi.describeValid"
            :rules="searchRegNumUi.validationRules"
            @search="doSearchRegNum"
          />
        </section>
        <section>
          <p>
            <strong>FEES</strong> Some part of this page will inform the user about the cost of the search. Here is a functional demonstration
            showing the results of an API call to the payment system, for the current authenticated user. The payment code is from the Cooperatives
            application. We're using it until a PPR code is available.
          </p>
          <p>
            {{ fees }}
          </p>
        </section>
      </article>
    </v-container>
  </div>
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'
import SearchInput from '@/search/SearchInput.vue'
import SearchRegNumUi from '@/search/search-regnum-ui'
import SearcherRegNum from '@/search/searcher-reg-num'

export default createComponent({
  components: { SearchInput },

  setup(_, { root }) {
    // const loadIndicator = useLoadIndicator()
    // const searcherRegNum = new SearcherRegNum()
    // const searchRegNumUi = new SearchRegNumUi()
    // const fees = ref({})

    // searcherRegNum.getSearchFees().then((data) => fees.value = data)
    // function doSearch(searcher, term: string): Promise<void> {
    //   loadIndicator.start()
    //   return searcher.doSearch(term)
    //     .then((searchId: string): void => {
    //       router.push({ name: 'results', query: { searchId: searchId } })
    //     })
    //     .catch((errorMessage: string): void => {
    //       // Note that Sentry will capture all console.error
    //       console.error('In search page catch on do search.', errorMessage)
    //     })
    //     .finally(() => {
    //       loadIndicator.stop()
    //     })
    // }
    //
    // function doSearchRegNum(term: string) {
    //   doSearch(searcherRegNum, term)
    // }

    return {
      // fees,
      // doSearchRegNum,
      // searchRegNumUi
    }
  }
})
</script>
