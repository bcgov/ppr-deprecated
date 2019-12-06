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
            <li>poc 1 feature flags is {{ featureOneLabel }}</li>
            <li>poc 2 feature flags is {{ featureTwoLabel }}</li>
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

    <v-container v-if="featureOne">
      <v-btn
        class="form-primary-btn"
        color="primary"
        @click="login"
      >
        Login
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
    const router = useRouter()

    // Feature Flags
    const {pocFeature1: featureOne, pocFeature2: featureTwo} = useFeatureFlags()
    const featureOneLabel = computed((): string => (featureOne.value ? 'disabled' : ' enabled'))
    const featureTwoLabel = computed((): string => (featureTwo.value ? 'disabled' : ' enabled'))

    function login(): void {
      router.push('auth')
    }

    return { featureOne, featureOneLabel, featureTwoLabel, login }
  }
})
</script>
