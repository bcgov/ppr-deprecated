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
              This will be a PPR login page selectedUserIndex {{ currentUserIndex }} currentUser {{currentUser}} userList {{ userList }}
            </p>
            <v-btn
              color="#fcba19"
              class="log-in-btn"
              :disabled="selectedUser < 0"
              @click="proceed()"
            >
              Continue
            </v-btn>
          </div>
          <v-container>
            <v-radio-group
              v-model="selectedUser"
            >
              <v-radio v-for="user in userList" :key="user.index"
                :label="`${user.name}, ${user.company}, ${user.occupation}`"
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
  import { createComponent, reactive, ref } from '@vue/composition-api'
  import { mockStorage } from '@/proto/mock-storage'
  import { useUsers, UserInterface } from '@/proto/users'

  export default createComponent({
    setup(_, { root }) {
      console.log('login 1')
      const {     currentUserIndex, currentUser, userList} = useUsers()
      console.log('login 2')

      // const userList = ref(mockStorage.getUserList())
      // const rStore = reactive(mockStorage)
      //
      // const selectedUser = ref(rStore.getCurrentUserIndex())

      function proceed(): void {
        root.$router.push({ name: 'home' })
      }

      function changeUser(index) {
        currentUserIndex.value = index
        // mockStorage.setCurrentUser(index)
        // console.log(mockStorage.getCurrentUser().index)
      }

      return { changeUser,  proceed, currentUserIndex, currentUser, userList }
    }
  })

</script>
