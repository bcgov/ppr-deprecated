<template>
  <div>
    <v-container class="view-container">
      <article id="dashboardArticle">
        <header>
          <h1>PPR Sample Home Page</h1>
        </header>

        <div>
          <h4>Feature Flags - proof of concept</h4>
          <ul>
            <li id="fflag1">
              Proof of concept feature flag one is {{ featureOneLabel }}
            </li>
            <li id="fflag2">
              Proof of concept feature flag two is {{ featureTwoLabel }}
            </li>
          </ul>
        </div>

        <div class="page-content">
          <div class="page-content__main">
            <section>
              <header>
                <h2>Sample home page content</h2>
              </header>
              <div>Copy needed here to welcome the user to the PPR application.</div>
            </section>
            <section v-if="userIsAuthed">
              <header>
                <h2>Title needed to welcome authorized user</h2>
              </header>
              <div>Copy needed here to welcome the authorized user to the PPR application.</div>
            </section>
          </div>

          <aside class="page-content__aside">
            <section>
              <header>
                <h2>Sample Aside Section</h2>
              </header>
              <div>
                <ul>
                  <li>
                    <router-link to="home">
                      Home
                    </router-link>
                  </li>
                  <li v-if="flags.feature2">
                    <router-link to="search">
                      Search
                    </router-link>
                  </li>
                  <li v-if="flags.feature2">
                    <router-link to="results">
                      Results
                    </router-link>
                  </li>
                  <li>
                    <router-link to="about">
                      About
                    </router-link>
                  </li>
                </ul>
              </div>
            </section>
          </aside>
        </div>
      </article>
    </v-container>

    <v-container v-if="feature2">
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
    const featureOneLabel = computed((): string => (flags.feature1 ? 'enabled' : 'disabled'))
    const featureTwoLabel = computed((): string => (flags.feature2 ? 'enabled' : 'disabled'))
    const feature2 = computed( (): boolean => flags ? flags.feature2: false)
    const userIsAuthed = computed( (): boolean => !!sessionStorage.getItem('KEYCLOAK_TOKEN'))
    function goSearch(): void {
      router.push('search')
    }

    return { flags, feature2, featureOneLabel, featureTwoLabel, goSearch, userIsAuthed }
  }
})
</script>
