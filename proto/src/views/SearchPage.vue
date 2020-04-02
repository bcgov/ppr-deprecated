<template lang="pug">
    v-container(class="view-container")
      article
        header
           h1 Search the prototype Personal Property Registry
        p.
          This page demonstrates search for the prototype Personal Property Registry.
        p.
          If any input is disabled that means this prototype has not yet implemented that type of search.
        section
          search
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'
import Search from '@/search/Search.vue'

export default createComponent({
  components: { Search },

  setup() {
    return {
    }
  }
})
</script>
