<template lang="pug">
  div
    v-container(class="view-container")
      article(id="dashboardArticle")
        header
          h1 PPR Sample Home Page

        div(class="page-content")
          div(class="page-content__main")
            section
              header
                h2 Sample home page content

          aside(class="page-content__aside")
            section
              header
                h2 Sample Aside Section

    v-container(v-if="featureOne")
      v-btn(class="form-primary-btn", @click="login", color="primary") Login

    v-container(v-if="featureTwo")
      div Feature two is active
</template>
<script>
    import AuthHelper from '@/utils/auth-helper'
    import AppData from '@/utils/app-data'

    export default {
        data: function () {
            return {
                appData: AppData,
            }
        },
        computed: {
            featureOne () {
                return this.appData.features.featureOne
            },
            featureTwo () {
                return this.appData.features.featureTwo
            }
        },
        methods: {
            login: function () {
                this.$router.push('auth')
            }
        }
    }
</script>
