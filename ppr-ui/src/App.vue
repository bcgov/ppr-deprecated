<template>
  <v-app
    id="app"
    class="app-container, theme--light"
  >
    <component :is="layout">
      <router-view />
    </component>
    <div class="ff">
      <feature-one />
    </div>
    <div class="ff">
      <feature-two />
    </div>
  </v-app>
</template>

<script lang="ts">
import {createComponent, computed, onErrorCaptured, provide, ref} from "@vue/composition-api"
import {Data} from "@vue/composition-api/dist/component"
import {provideRouter, useRouter} from "@/router/router"
import {provideFeatureFlags} from "@/flags/feature-flags"
import FeatureOne from '@/components/FeatureOne.vue'
import FeatureTwo from '@/components/FeatureTwo.vue'
import AppData from "@/utils/app-data"

const APP_PATH = process.env.VUE_APP_PATH || 'app-path-foo-bar'
const DefaultLayout = 'public'

function origin(): string {
  const root = window.location.origin || ''
  const path = APP_PATH
  return `${root}/${path}`
}

function authAPIURL(): string {
  return sessionStorage.getItem('AUTH_API_URL')
}

export default createComponent({
  components: { FeatureOne, FeatureTwo },
  setup(): Data {

    provideRouter()
    const router = useRouter()

    provideFeatureFlags()

    provide("originUrl", origin())
    provide("authApiUrl", authAPIURL())
    provide("configuration", ref(AppData.config))

    const layout = computed((): string => (router.currentRoute.meta.layout || DefaultLayout) + '-layout')

    onErrorCaptured((err): void => {
      console.log('App errorCaptured', err)
      // err: error trace
      // The method has 2 additional parameters, which are unused in this case
      //   vm: component in which error occured
      //   info: Vue specific error information such as lifecycle hooks, events etc.
      // TODO: Perform any custom logic or log to server
      // return false to stop the propagation of errors further to parent or global error handler
    })

    return { layout }
  }
})

</script>
<style lang="scss">
  .ff {
    margin-bottom: 1rem;
  }
</style>

