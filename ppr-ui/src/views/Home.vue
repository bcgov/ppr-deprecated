<template>
  <div>
    <v-container class="view-container">
      <article id="dashboardArticle">
        <header>
          <h1>PPR Sample Home Page</h1>
        </header>

        <div>
          <h4>Feature Flags</h4>
          <ul>
            <li id="fflag1">
              poc 1 feature flags is {{ featureOneLabel }}
            </li>
            <li id="fflag2">
              poc 2 feature flags is {{ featureTwoLabel }}
            </li>
          </ul>
        </div>

        <div class="page-content">
          <div class="page-content__main">
            <section>
              <header>
                <h2>Sample home page content</h2>
              </header>
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

    <v-container v-if="flags.feature2">
      <v-btn
        class="form-primary-btn"
        color="primary"
        @click="goSearch"
      >
        Go to search
      </v-btn>
    </v-container>
  </div>
</template>

<script lang="ts">
import {createComponent, computed} from "@vue/composition-api"
import {Data} from "@vue/composition-api/dist/ts-api/component"
import {useRouter} from '@/router/router'
import {useFeatureFlags} from '@/flags/feature-flags'

export default createComponent({
  setup(): Data {
    const {router} = useRouter()
    // Feature Flags
    const flags = useFeatureFlags()
    const featureOneLabel = computed((): string => (flags.feature1 ? 'enabled' : ' disabled'))
    const featureTwoLabel = computed((): string => (flags.feature2 ? 'enabled' : 'disabled'))

    function goSearch(): void {
      router.push('search')
    }

    return { flags, featureOneLabel, featureTwoLabel, goSearch }
  }
})
</script>
