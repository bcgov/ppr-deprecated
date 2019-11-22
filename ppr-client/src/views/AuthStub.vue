<template lang="pug">
  div
    v-container
      article
        header
          h1 This is an authorization stub page
      div(class="intro") Try this button return do a fake login and go to dashboard.
      div
        v-btn(class="form-primary-btn", @click="letUserIn", color="primary") Let me in!
</template>
<script>
    import AuthHelper from '@/utils/auth-helper'

    export default {
        components: {},

        data() {
            return {}
        },

        methods: {
            letUserIn: function () {
                AuthHelper.authFake()
            },
            logOut: function () {
                AuthHelper.authClear()
            }
        }
    }
</script>
