<template lang="pug">
  div
    v-container(class="view-container")
      article
        header
          h1 Prototype Admin
        div(class="page-content")
          div(class="page-content__main")
            admin

</template>
<script lang="ts">
  import { createComponent } from '@vue/composition-api'
  import Admin from '@/admin/Admin.vue'

  export default createComponent({
    components: { Admin },
    setup(_, { root }) {
      return {}
    }
  })

</script>
