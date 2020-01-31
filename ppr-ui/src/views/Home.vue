<template>
  <div>
    <v-container class="view-container">
      <article id="dashboardArticle">
        <header>
          <h1>PPR Sample Home Page</h1>
        </header>

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
                  <li v-if="userCanSearch">
                    <router-link to="search">
                      Search
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

    <v-container v-if="userCanSearch">
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
import { computed, createComponent } from '@vue/composition-api'
import { Data } from '@vue/composition-api/dist/ts-api/component'

import { useFeatureFlags } from '@/flags/feature-flags'
import { useRouter } from '@/router/router'

export default createComponent({
  setup(): Data {
    const features = useFeatureFlags()
    const { router } = useRouter()

    const userIsAuthed = computed((): boolean => !!sessionStorage.getItem('KEYCLOAK_TOKEN'))

    // Feature Flag
    const userCanSearch = computed((): boolean => (features.getFlag('search-registration-number') ||
      features.getFlag('search-serial-number')) && userIsAuthed.value)

    function goSearch(): void {
      router.push('search')
    }

    return { goSearch, userCanSearch, userIsAuthed }
  }
})

</script>
