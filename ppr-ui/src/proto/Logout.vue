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
  import { createComponent,ref } from '@vue/composition-api'
  import { mockStorage } from '@/proto/mock-storage'

  export default createComponent({
    setup(_, { root }) {
      const isAuthed = ref(mockStorage.isAuthed())

      function getButtonText() {
        return (mockStorage.isAuthed() ? 'Log into' : 'Log out of') + ' the PPR prototype'
      }
      const buttonText = ref (getButtonText())

      function proceed(): void {
        mockStorage.setCurrentUser(-1)
        root.$router.push({ name: 'home' })
      }

      return { proceed, buttonText, isAuthed }
    }
  })

</script>
