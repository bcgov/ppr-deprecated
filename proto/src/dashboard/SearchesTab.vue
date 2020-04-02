<template lang="pug">
  search-records
</template>
<script lang="ts">
import { createComponent } from '@vue/composition-api'
import SearchRecords from '@/search/SearchRecords.vue'

export default createComponent({
  components: { SearchRecords },
  setup() {
    return {}
  }
})
</script>


<style lang="scss" scoped>
</style>
