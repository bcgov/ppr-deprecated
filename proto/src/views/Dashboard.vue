<template lang="pug">
  div
    v-container(class="view-container")
      article
        header
          h1 Dashboard
        div(class="page-content")
          div(class="page-content__main")
            dash-board

</template>
<script lang="ts">
  import { createComponent } from '@vue/composition-api'
  import DashBoard from '@/dashboard/Dashboard.vue'

  export default createComponent({
    components: { DashBoard },
    setup() {
      return {}
    }
  })

</script>
