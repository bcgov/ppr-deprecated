<template>
  <div>
    <v-container class="view-container">
      <article>
        <header>
          <h1>Log into the prototype Personal Property Registry</h1>
        </header>

        <div class="page-content">
          <div class="page-content__main">
            <p class="intro">
              This is a login page for the prototype. In a real system users will authenticate
              via the auth share system.  Here you can chose a fictional persona that represents
              various types of users of a PPR system.
            </p>
            <v-btn
              color="#fcba19"
              class="log-in-btn"
              :disabled="currentUserIndex === noUserIndex"
              @click="proceed()"
            >
              Continue
            </v-btn>
          </div>
          <v-container>
            <v-radio-group
              v-model="currentUserIndex"
            >
              <v-radio
                v-for="user in userList"
                :key="user.userId"
                :label="userLabel(user)"
                :value="user.userId"
                @change="changeUser(user.userId)"
              />
            </v-radio-group>
          </v-container>
        </div>
      </article>
    </v-container>
  </div>
</template>
<script lang="ts">
import { computed, createComponent } from '@vue/composition-api'
import { useUsers } from '@/users/users'

export default createComponent({
  setup(_, { root }) {
    const { currentUserIndex, noUserIndex, setUser, userList } = useUsers()

    function proceed(): void {
      root.$router.push({ name: 'home' })
    }

    function changeUser(userId) {
      setUser(userId)
    }

    function userLabel(user) {
      const parts = []
      // `${user.name}, ${user.company}, ${user.occupation}, ${user.role}, ${user.party.clientCode}`
      parts.push(user.name)
      parts.push(user.company)
      if (user.party) {
        parts.push('(' + user.party.clientCode +')')
      }
      parts.push(user.occupation)
      parts.push(user.role)
      return parts.join(', ')
    }


    return { changeUser,  proceed, currentUserIndex, noUserIndex, userLabel, userList }
  }
})

</script>
<style lang="scss" scoped>
  @import '../assets/styles/theme.scss';
  .intro {
    padding-top: 2rem;
    max-width: 60rem;
  }
</style>
