<template>
  <div>
    <v-container class="view-container">
      <article>
        <header>
          <h1>Log into the Personal Property Registry prototype</h1>
        </header>

        <div class="page-content">
          <div class="page-content__main">
            <p>
              This will be a PPR logout page
            </p>
            <v-btn color="#fcba19" class="log-in-btn" @click="proceed()">Continue to log out</v-btn>
          </div>
        </div>
      </article>
    </v-container>
  </div>
</template>
<script lang="ts">
  import { createComponent } from '@vue/composition-api'
  import { useUsers } from '@/models/users'

  export default createComponent({
    setup(_, { root }) {
      const { logout } = useUsers()

      function proceed(): void {
        logout()
        root.$router.push({ name: 'home' })
      }
      return { proceed }
    }
  })

</script>
