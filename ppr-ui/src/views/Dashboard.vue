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
                h2 Sample content for {{userName}}

              div(v-if="featureTwo")
                config-info

          aside(class="page-content__aside")
            section
              header
                h2 Sample Aside Section
              div(class="ff") Feature flags:
                div featureOne {{ featureOne }}
                div featureTwo {{ featureTwo }}

    v-container
      v-btn(class="form-primary-btn", @click="logOut", color="primary") Let me out!
</template>

<script>
    import AuthHelper from '@/utils/auth-helper'
    import AppData from '@/utils/app-data'
    import ConfigInfo from "@/components/ConfigInfo";

    export default {
        components: { ConfigInfo },

        data() {
            return {
                appData: AppData
            }
        },
        computed: {
            featureOne () {
                return this.appData.features.featureOne
            },
            featureTwo () {
                return this.appData.features.featureTwo
            },
            userName () {
                return this.appData.user.userName
            }
        },

        methods: {
            logOut: function () {
                AuthHelper.authClear()
            }
        }
    }
</script>

<style lang="scss" scoped>
  .ff {
    div {
      margin-left: 1rem;
    }
  }
</style>
