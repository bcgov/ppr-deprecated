<template>
  <div>
    <v-container class="view-container">
      <article id="dashboardArticle">
        <header>
          <h1>PPR Sample Dashboard</h1>
        </header>

        <div class="page-content">
          <div class="page-content__main">
            <section>
              <header>
                <h2>Sample content</h2>
              </header>
              <v-container v-if="flags.featureTwo">
                <config-info />
              </v-container>
            </section>
          </div>

          <aside class="page-content__aside">
            <section>
              <header>
                <h2>Sample Aside Section</h2>
              </header>
            </section>
          </aside>
        </div>
      </article>
    </v-container>

    <v-container>
      <v-btn
        class="form-primary-btn"
        color="primary"
        @click="logOut"
      >
        Let me out!
      </v-btn>
    </v-container>
  </div>
</template>

<script lang="ts">
import {createComponent} from "@vue/composition-api"
import {Data} from "@vue/composition-api/dist/ts-api/component"
import AuthHelper from '@/utils/auth-helper'
import ConfigInfo from "@/components/ConfigInfo.vue"
import {useRouter} from '@/router/router'
import {useFeatureFlags} from '@/flags/feature-flags'

export default createComponent({
  components: {ConfigInfo},
  setup(): Data {
    const router = useRouter()

    // Feature Flags
    const flags = useFeatureFlags()

    function logOut(): void {
      AuthHelper.authClear()
        .then(() => {
          router.push('home')
        })
    }
    return { flags, logOut }
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
