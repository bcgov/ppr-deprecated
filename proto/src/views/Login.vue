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
              This is a login page for the prototype. In a real system users will authenticate
              via the auth share system.
            </p>
            <v-btn
              color="#fcba19"
              class="log-in-btn"
              :disabled="currentUserIndex < 0"
              @click="proceed()"
            >
              Continue
            </v-btn>
          </div>
          <v-container>
            <v-radio-group
              v-model="currentUserIndex"
            >
              <v-radio v-for="user in userList" :key="user.index"
                :label="`${user.name}, ${user.company}, ${user.occupation}, ${user.role}`"
                :value="user.index"
                @change="changeUser(user.index)"
              >
              </v-radio>

            </v-radio-group>
          </v-container>
        </div>
      </article>
    </v-container>
  </div>
</template>
<script lang="ts">
  import { createComponent } from '@vue/composition-api'
  import { useUsers } from '../users/users'

  export default createComponent({
    setup(_, { root }) {
      const { currentUserIndex, setUser, userList } = useUsers()

      function proceed(): void {
        root.$router.push({ name: 'home' })
      }

      function changeUser(index) {
        setUser(index)
      }

      return { changeUser,  proceed, currentUserIndex, userList }
    }
  })

</script>
