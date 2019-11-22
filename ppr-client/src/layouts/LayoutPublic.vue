<template lang="pug">
  div
    sbc-header(ref="sbcHeader", :brandLink="originUrl", :authURL="authAPIURL")

    div(class="app-body")
        main
            slot Main content for a component will appear here. The component is selected by the router

    sbc-footer

    input(class="checkbox", type="checkbox", v-model="showingSpecial")
    span show special
    div(v-show="showingSpecial") Showing special

</template>

<script>
    import SbcHeader from 'sbc-common-components/src/components/SbcHeader.vue'
    import SbcFooter from 'sbc-common-components/src/components/SbcFooter.vue'

    export default {
        name: 'LayoutPublic',
        components: {
            SbcHeader,
            SbcFooter,
        },
        data: function () {
            return {
                showingSpecial: false
            }
        },
        inject: ['authApiUrl', 'originUrl'],
        computed: {
            authAPIURL() {
                return sessionStorage.getItem('AUTH_API_URL')
            },
        },
        mounted: function () {
            console.log(this.$options.name + ' mounted')
        },
        watch: {
            showingSpecial: function (flag) {
                this.showingSpecial = flag
            }
        }
    }
</script>

