<template>
  <section>
    <header>
      <h2>Results for your search</h2>
    </header>
    <p>
      The content on this page is for demonstration purposes only.
    </p>
    <div id="searchCriteria">
      <p>
        <!--Search criteria: {{ criteria }}-->
      </p>
    </div>
    <div id="searchResults">
      <p>
        Search results:
      </p>
      <!--<pre>{{ results }}</pre>-->
    </div>
  </section>
</template>

<script lang="ts">
import { createComponent, ref } from '@vue/composition-api'
// import SearcherRegNum from '@/search/searcher-reg-num'

export default createComponent({
  setup(_, { root }) {
    // const searcherRegNum = new SearcherRegNum()
    // const searchId = root.$route.query['searchId'] as string
    //
    // const criteria = ref({})
    // const results = ref({})
    //
    // searcherRegNum.getSearch(searchId)
    //   .then((response: AxiosResponse) => {
    //     criteria.value = response.data
    //   })
    //
    // searcherRegNum.getResults(searchId)
    //   .then((response: AxiosResponse) => {
    //     results.value = response.data
    //   })

    return {
      // results,
      // criteria
    }
  }
})
</script>
