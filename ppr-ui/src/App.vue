<template lang="pug">
  v-app(class="app-container, theme--light", id="app")
    component(:is="layout")
     router-view
    div(class="ff")
      feature-one
    div(class="ff")
      feature-two
</template>

<script>
    const APP_PATH = process.env.VUE_APP_PATH || 'app-path-foo-bar'
    const DefaultLayout = 'public'
    import FeatureOne from '@/components/FeatureOne'
    import FeatureTwo from '@/components/FeatureTwo'

    export default {
        components: { FeatureOne, FeatureTwo },

        data: function () {
            return {
                dataLoaded: false,
            }
        },
        provide() {
            return {
                originUrl: this.origin,
                authApiUrl: this.authApiUrl
            }
        },
        computed: {
            layout() {
                return (this.$route.meta.layout || DefaultLayout) + '-layout'
            },
            origin() {
                const root = window.location.origin || ''
                const path = APP_PATH
                return `${root}/${path}`
            },
            authApiUrl() {
                return sessionStorage.getItem('AUTH_API_URL')
            },
        },
        methods: {
            setLoaded: function (flag) {
                this.dataLoaded = flag
            }
        },
        errorCaptured(err, vm, info) {
            console.log('App errorCaptured', err)
            // err: error trace
            // vm: component in which error occured
            // info: Vue specific error information such as lifecycle hooks, events etc.
            // TODO: Perform any custom logic or log to server
            // return false to stop the propagation of errors further to parent or global error handler
        }
    }

</script>
<style lang="scss">
  .ff {
    margin-bottom: 1rem;
  }
</style>

