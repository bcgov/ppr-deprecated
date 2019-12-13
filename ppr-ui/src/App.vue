<template>
  <v-app
    id="app"
    class="app-container, theme--light"
  >
    <!-- Any loading action can trigger display of spinner -->
    <transition name="fade">
      <div
        v-show="isLoading"
        class="loading-container"
      >
        <div class="loading__content">
          <v-progress-circular
            color="primary"
            size="50"
            indeterminate
          />
          <!-- Suppress message with spinner until we can make the message relate to the action initiated by the user ->
          <!--<div class="loading-msg">-->
            <!--Loading Personal Property Registry-->
          <!--</div>-->
        </div>
      </div>
    </transition>

    <component :is="layout">
      <router-view />
    </component>
  </v-app>
</template>

<script lang="ts">
import {createComponent, computed, onErrorCaptured, provide, ref} from "@vue/composition-api"
import {Data} from "@vue/composition-api/dist/component"
import {provideFeatureFlags} from "@/flags/feature-flags"
import {provideRouter, useRouter} from "@/router/router"
import {provideStore, useStore} from "@/store"
import AppData from "@/utils/app-data"
import { initializeVueLdClient } from '@/flags/ld-client'
import uuid from 'uuid'

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


/*
  NOTE: the following userKey is TEMPORARY and will disappear when we get auth set up.
  Create one user id per session.
 */
const userKey = sessionStorage.getItem('userKey') ? sessionStorage.getItem('userKey') : uuid.v4()
sessionStorage.setItem('userKey', userKey)

export default createComponent({
  setup(): Data {

    // Make the connection to the LD server. We could explore anonymous users if we need to.
    // For now we use a fixed per session user id.
    // Also note that this initialization will need to happen AFTER auth.
    initializeVueLdClient(AppData.config.launchDarklyClientKey, userKey)

    provide("originUrl", origin())
    provide("authApiUrl", authAPIURL())
    provide("configuration", ref(AppData.config))
    provideFeatureFlags()
    provideStore()
    provideRouter()

    const {router} = useRouter()
    const {store} = useStore()

    const isLoading = computed(() => { return store.state.isLoading } )

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

    return { isLoading, layout }
  }
})

</script>
<style lang="scss">
  .ff {
    margin-bottom: 1rem;
  }
</style>

