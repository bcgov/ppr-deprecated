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
            <li>poc 1 {{featureOne}}</li>
            <li>poc 2 {{featureTwo}}</li>
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
      <v-btn class="form-primary-btn" @click="login" color="primary">Login</v-btn>
    </v-container>

    <v-container v-if="featureTwo">
      <div>Feature two is active</div>
    </v-container>
  </div>
</template>

<script lang="ts">
import {createComponent, Ref} from "@vue/composition-api"
import {Data} from "@vue/composition-api/dist/ts-api/component"
import {useRouter} from '@/router/router'
import {useFlags} from '@/flags/feature-flags'

export default createComponent({
  setup(): Data {
    const router = useRouter()
    const flags = useFlags()
    const featureOne: Ref = flags.pocFeature1
    const featureTwo: Ref = flags.pocFeature2

    function login(): void {
      router.push('auth')
    }

    return { featureOne, featureTwo, login }
  }
})
</script>
