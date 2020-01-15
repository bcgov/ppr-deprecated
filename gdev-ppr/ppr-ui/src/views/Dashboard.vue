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
  </div>
</template>

<script lang="ts">
import {createComponent} from "@vue/composition-api"
import {Data} from "@vue/composition-api/dist/ts-api/component"
import ConfigInfo from "@/components/ConfigInfo.vue"
import {useFeatureFlags} from '@/flags/feature-flags'

export default createComponent({
  components: {ConfigInfo},
  setup(): Data {
    // Feature Flags
    const flags = useFeatureFlags()

    return { flags }
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
