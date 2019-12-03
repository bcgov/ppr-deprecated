<template lang="pug">
  div
    v-container
      article
        header
          h1 This is an authorization stub page
      div userName {{userName}}
      v-card(flat)
        div(v-if="hasSuccess")
          div You've been signed in: {{userName}}
          v-btn(class="form-primary-btn", @click="goToDash", color="primary") Go to dashboard.
        div(v-else, class="intro") Try this button return do a 30-second login.
          v-form()
            v-text-field(filled, label="User Name", v-model="userName", required)
            v-btn(class="form-primary-btn", @click="letUserIn", color="primary", v-bind:disabled="saveDisabled") Let me in!

      div(v-show="hasError") Error {{errorMsg}}

</template>

<script lang="ts">
  import {computed, createComponent, ref} from "@vue/composition-api";
  import {Data} from "@vue/composition-api/dist/ts-api/component";
  import AuthHelper from '@/utils/auth-helper'
  import {useRouter} from '@/router/router'

    export default createComponent({
        setup(): Data {
          const router = useRouter()
            const errorMsg = ref<string>('')
            const userName = ref<string>('')
            const loggedInUser = ref<string>('')

            const hasSuccess = computed(() => loggedInUser.value.length > 0)
            const hasError = computed(() => errorMsg.value.length > 0)
            const saveDisabled = computed(() => userName.value.length === 0)

            function letUserIn(): void {
                errorMsg.value = ''
                loggedInUser.value = ''
                AuthHelper.authFake(userName.value)
                    .then(() => {
                        loggedInUser.value = userName.value
                    })
                    .catch(err => {
                        console.log('authFake error', err)
                        errorMsg.value = err.message
                    })
            }
            function goToDash(): void {
                router.push('dashboard')
            }

            function logOut(): void {
                AuthHelper.authClear()
                .then(() => {
                  router.push('home')
                })
            }

            return {
              errorMsg, hasError,
              userName,  saveDisabled,
              loggedInUser, hasSuccess,
              letUserIn,
              logOut,
              goToDash
          }
        }
    })
</script>
