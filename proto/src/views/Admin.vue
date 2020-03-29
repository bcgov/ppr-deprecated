<template lang="pug">
  div
    v-container(class="view-container")
      article
        header
          h1 Dashboard

        div(class="page-content")
          div(class="page-content__main")
            p Placeholder page.
    v-container
      div(style="padding-left: 1rem")
      div {{ currentUser.name }} {{ currentUser.last }},
      div {{ currentUser.company }},
      div {{ currentUser.occupation }}

</template>
<script lang="ts">
  import { createComponent } from '@vue/composition-api'
  import { useUsers } from '../models/users'

  export default createComponent({
    setup(_, { root }) {
      const { authenticated, currentUser} = useUsers()

      return {authenticated, currentUser}
    }
  })

</script>
