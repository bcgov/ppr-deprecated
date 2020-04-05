<template lang="pug">
    v-container(class="view-container")
      article
        header
           h1 Search the prototype Personal Property Registry
        p.
          This page demonstrates search for the prototype Personal Property Registry.
        search-intro
        search
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'
import Search from '@/search/Search.vue'
import SearchIntro from '@/search/SearchIntro.vue'

export default createComponent({
  components: { Search, SearchIntro },

  setup() {
    return {
    }
  }
})
</script>
