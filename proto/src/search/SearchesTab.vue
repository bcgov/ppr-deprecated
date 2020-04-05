<template lang="pug">
  v-simple-table
    tbody
      tr(v-for="record in searchList")
        td
          v-row
            v-col(cols="3")
              div {{record.typeAsString}}
            v-col(cols="2")
              div Criteria:
              div {{record.term}}
            v-col(cols="2")
              div Date:
              div {{ record.date }}
            v-col(cols="2")
              div Exact Matches: {{record.exactList.length}}
            v-col(cols="2")
              div Similar Matches: {{record.similarList.length}}
            v-col(cols="1")
              v-btn(@click="view(record.id)") View

</template>
<script lang="ts">
  import { computed, createComponent } from '@vue/composition-api'
  import { useSearching, SearchInterface } from '@/search/searching'

export default createComponent({
  components: {
  },
  setup(_, {root}) {
    const { searchGetUserList } = useSearching()

    const searchList = computed(() => searchGetUserList() )


    function view(searchId) {
      root.$router.push({ name: 'results', query: { searchId: searchId } })
    }

    return {
      searchList, view
    }
  }
})
</script>


<style lang="scss" scoped>
</style>
