<template lang="pug">
  div
    v-container(class="view-container")
      article(id="dashboardArticle")
        header
          h1 PPR Sample Dashboard

        div(class="page-content")
          div(class="page-content__main")
            section
              header
                h2 Sample content

          aside(class="page-content__aside")
            section
              header
                h2 Sample Aside Section
    v-container
      v-btn(class="form-primary-btn", @click="logOut", color="primary") Let me out!
</template>

<script>
    import AuthHelper from '@/utils/auth-helper'

    export default {
        components: {},

        data() {
            return {}
        },

        methods: {
            logOut: function () {
                AuthHelper.authClear()
            }
        }
    }
</script>

<style lang="scss" scoped>
</style>
