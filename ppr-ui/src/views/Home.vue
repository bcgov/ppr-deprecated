<template>
  <div>
    <v-container class="view-container">
      <article id="dashboardArticle">
        <header>
          <h1>Welcome to the Personal Property Registry</h1>
        </header>

        <div class="page-content">
          <div class="page-content__main">
            <p>
              <em>Note: This web site is a work in progress.</em>
            </p>
            <p>
              Protect yourself from loss or legal conflict by registering your interest in personal property (cars,
              boats, trailers or machinery) or searching for existing liens on personal property prior to purchase.
            </p>
            <p>
              The Personal Property Registry records all of the encumbrances (such as liens) created against personal
              property in B.C., whether it belongs to a business or an individual. The Registry provides personal
              property registration and search services for lenders, sellers, garage keepers, taxing authorities,
              government agencies, purchasers and general public.
            </p>
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

import { useFeatureFlags } from '@/flags/feature-flags'
import { useRouter } from '@/router/router'

export default createComponent({
  setup() {
    const features = useFeatureFlags()
    const { router } = useRouter()

    const userIsAuthed = computed((): boolean => !!sessionStorage.getItem('KEYCLOAK_TOKEN'))

    // Feature Flag
    const userCanSearch = computed((): boolean => features.getFlag('search-registration-number') && userIsAuthed.value)

    function goSearch(): void {
      router.push('search')
    }

    return { goSearch, userCanSearch, userIsAuthed }
  }
})

</script>
