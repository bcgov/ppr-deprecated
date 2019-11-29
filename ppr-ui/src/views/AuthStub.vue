<template lang="pug">
  div
    v-container
      article
        header
          h1 This is an authorization stub page
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
<script>
    import AuthHelper from '@/utils/auth-helper'

    export default {
        components: {},

        data() {
            return {
                errorMsg: '',
                userName: '',
                loggedInUser: ''
            }
        },
        computed: {
            hasError() {
                return this.errorMsg.length > 0
            },
            hasSuccess() {
                return this.loggedInUser.length > 0
            },
            saveDisabled() {
                return this.userName.length === 0
            }
        },

        methods: {
            goToDash: function () {
                this.$router.push('dashboard')
            },
            letUserIn: function () {
                this.errorMsg = ''
                this.loggedInUser = ''
                AuthHelper.authFake(this.userName)
                    .then(() => {
                        this.loggedInUser = this.userName
                    })
                    .catch(err => {
                        console.log('authFake error', err)
                        this.errorMsg = err.message
                    })
            },
            logOut: function () {
                AuthHelper.authClear()
                    .then(() => {
                        this.$router.push('home')
                    })
            }
        }
    }
</script>
