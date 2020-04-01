<template lang="pug">
    v-container(class="view-container")
      article
        header
           h1 Search the prototype Personal Property Registry
        p.
          This page demonstrates registration number search for the prototype Personal Property Registry.
        section
          search-input(
            id="searchInput",
            :error-message="searchRegNumUi.errorMessage",
            :label="searchRegNumUi.label",
            :hint="searchRegNumUi.describeValid",
            :rules="searchRegNumUi.validationRules",
            @search="doSearchRegNum"
          )
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'
import SearchInput from '@/search/SearchInput.vue'
import SearchRegNumUi from '@/search/search-regnum-ui'
import SearcherRegNum from '@/search/searcher-reg-num'

export default createComponent({
  components: { SearchInput },

  setup(_, { root }) {
    const searcherRegNum = new SearcherRegNum()
    const searchRegNumUi = new SearchRegNumUi()

    function doSearch(searcher, term: string): Promise<void> {
      return searcher.doSearch(term)
        .then((searchId: string): void => {
          root.$router.push({ name: 'results', query: { searchId: searchId } })
        })
        .catch((errorMessage: string): void => {
          console.error('In search page catch on do search.', errorMessage)
        })
    }

    function doSearchRegNum(term: string) {
      doSearch(searcherRegNum, term)
    }

    return {
      doSearchRegNum,
      searchRegNumUi
    }
  }
})
</script>
