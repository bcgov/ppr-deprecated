<template lang="pug">
  v-simple-table
    tbody
      tr(v-for="record in searchList")
        td
          search-record(:record="record")
</template>

<script lang="ts">
import { computed, createComponent } from '@vue/composition-api'
import { useSearching, SearchInterface } from '@/search/searching'
import SearchRecord from '@/search/SearchRecord.vue'

export default createComponent({
  components: {SearchRecord },
  setup() {
    const { searchGetList } = useSearching()
    const searchList = computed(() => searchGetList() )

    return {
      searchList
    }
  }
})
</script>
