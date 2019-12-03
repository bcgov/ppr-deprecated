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

<script lang="ts">
import {createComponent, inject, ref} from "@vue/composition-api"
import {Data} from "@vue/composition-api/dist/ts-api/component"
import AuthHelper from '@/utils/auth-helper'
import ConfigInfo from "@/components/ConfigInfo.vue"
import {useRouter} from '@/router/router'

export default createComponent({
  components: {ConfigInfo},
  setup(): Data {
    const router = useRouter()
    const featureOne = inject("featureOne", ref(false))
    const featureTwo = inject("featureTwo", ref(false))
    function logOut(): void {
      AuthHelper.authClear()
        .then(() => {
          router.push('home')
        })
    }
    return { featureOne, featureTwo, logOut }
  }
})
</script>

<style lang="scss" scoped>
  .ff {
    div {
      margin-left: 1rem;
    }
  }
</style>
