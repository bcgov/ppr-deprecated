<template lang="pug">
  v-app(class="app-container, theme--light", id="app")
    component(:is="layout")
     router-view
    div(class="ff")
      feature-one
    div(class="ff")
      feature-two
</template>

<script lang="ts">
  import {computed, createComponent, onErrorCaptured, provide, ref} from "@vue/composition-api";
  import {Data} from "@vue/composition-api/dist/component";
  import {provideRouter, useRouter} from "@/router/router";
  import FeatureOne from '@/components/FeatureOne.vue'
  import FeatureTwo from '@/components/FeatureTwo.vue'
  import AppData from "@/utils/app-data";

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

      provide("originUrl", origin())
      provide("authApiUrl", authAPIURL())
      provide("featureOne", ref(AppData.features.featureOne))
      provide("featureTwo", ref(AppData.features.featureTwo))
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

