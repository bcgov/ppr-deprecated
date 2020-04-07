<template lang="pug">
  v-container(class="view-container")
    section
      v-row
        v-col(cols="10")
          header
            h1 Search the pre-alpha prototype Personal Property Registry
            p.
              This and the search results pages are very preliminary and incomplete. They are only suitable
              for internal team use at this time.
            search-intro
        v-col(cols="2")
          proto-to-do
            p.
              This and the search results pages are very preliminary and incomplete. They are only suitable
              for internal team use at this time.
            ul
              li.
                Need a verification report. What form this takes is yet to be determined yet it is likely to be a
                generated and signed PDF.
              li.
                This page can not handle long lists of results. It requires the addition of filtering, sorting and
                searching.  Each search result item needs to be presented in a 'one line' format. Perhaps as seen on the
                Registrations tab of the Dashboard?
              li.
                Typical search results pages allow users to select registrations of interest. Usually all 'exact'
                matches are preselected and 'similar' matches are not.  Users can make their selection and then
                generate a report.   It is recommended to look at other PPR systems before deciding on a course of action.
              li.
                As the UI says, we need to implement the Debtor Name search with all of its complexity of nicknames
                similar names, searching business vs business contact, vs person name, etc.

    section
      search
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'
import Search from '@/search/Search.vue'
import SearchIntro from '@/search/SearchIntro.vue'
import ProtoToDo from '@/components/ProtoToDo.vue'

export default createComponent({
  components: { Search, SearchIntro, ProtoToDo },

  setup() {
    return {
    }
  }
})
</script>
