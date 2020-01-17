<template>
  <v-app
    id="app"
    class="app-container, theme--light"
  >
    <load-indicator />

    <component :is="layout">
      <router-view />
    </component>
  </v-app>
</template>

<script lang="ts">
import {createComponent, computed, onErrorCaptured, provide, ref} from "@vue/composition-api"
import {Data} from "@vue/composition-api/dist/component"
import LoadIndicator from "@/load-indicator/LoadIndicator.vue"
import {provideFeatureFlags} from "@/flags/feature-flags"
import {provideLoadIndicator} from '@/load-indicator'
import {provideRouter, useRouter} from "@/router/router"
import {provideSearcherSerial} from "@/search/search-serial"
import AppData from "@/utils/app-data"
import { initializeVueLdClient } from '@/flags/ld-client'
import uuid from 'uuid'
import { APP_PATH } from '@/utils/config-helper'

const DefaultLayout = 'public'

function origin(): string {
  const root = window.location.origin || ''
  const path = APP_PATH
  return `${root}/${path}`
}

function authAPIURL(): string {
  return sessionStorage.getItem('AUTH_API_URL')
}


/*
  NOTE: the following userKey is TEMPORARY and will disappear when we get auth set up.
  Create one user id per session.
 */
const userKey = sessionStorage.getItem('userKey') ? sessionStorage.getItem('userKey') : uuid.v4()
sessionStorage.setItem('userKey', userKey)

export default createComponent({
  components: {
    LoadIndicator
  },
  setup(): Data {

    // Make the connection to the LD server. We could explore anonymous users if we need to.
    // For now we use a fixed per session user id.
    // Also note that this initialization will need to happen AFTER auth.
    initializeVueLdClient(AppData.config.launchDarklyClientKey, userKey)

    provide("originUrl", origin())
    provide("authApiUrl", authAPIURL())
    provide("configuration", ref(AppData.config))
    provideFeatureFlags()
    provideLoadIndicator()
    provideSearcherSerial(AppData.config.pprApiUrl)
    provideRouter()

    const {router} = useRouter()

    const layout = computed((): string => (router.currentRoute.meta.layout || DefaultLayout) + '-layout')

    onErrorCaptured((err): void => {
      console.error('App errorCaptured', err)
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
</style>

