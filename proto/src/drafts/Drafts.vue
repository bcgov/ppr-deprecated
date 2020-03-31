<template lang="pug">
  v-container(class="grey lighten-5")
    div(class="draft-header") This content is purely mockup base on the UX wireframe.  Except it's not a true representation of the wireframes.  For example the UX calls for elements that can filter and sort the list of drafts.
    v-simple-table
      tbody
        tr(v-for="draft in draftList" key="draft.key")
          td
            draft(:draft="draft")

</template>
<script lang="ts">
  import { createComponent, ref } from '@vue/composition-api'
  import Draft from '@/drafts/Draft.vue'

  export default createComponent({
    components: { Draft },
    setup(_, { root }) {

      const draftList = ref([
        {
          key: "1",
          type: "Security Agreement",
          name: "draft for Grand Furniture",
          created: "Jan 21 2020",
          last: "Feb 12 2020"
        },
        {
          key: "2",
          type: "Repairers Lien",
          name: "draft for Auto Repair Victoria",
          created: "Jan 21 2020",
          last: "Feb 12 2020"
        },
        {
          key: "3",
          type: "Repairers Lien",
          name: "draft for Auto Repair Victoria",
          created: "Mar 21 2020",
          last: "Mar 31 2020"
        }
      ])

      return {draftList}
    }
  })

</script>

<style lang="scss" scoped>

  .draft-header {
    height: 5rem;
    width: 60%;
    padding-left: 1rem;
  }
  .v-data-table {
    th {
      background-color: #38598A;
      color: #F8F9FA  !important;
      font-weight: bolder;
      font-size: 1.5rem;
    }
  }
</style>
