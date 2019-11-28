<template lang="pug">
  div
    sbc-header(ref="sbcHeader", :brandLink="originUrl", :authURL="authApiUrl")

    div(class="app-body")
        main
            slot Main content for a component will appear here. The component is selected by the router

    sbc-footer
</template>

<script>
    import SbcHeader from 'sbc-common-components/src/components/SbcHeader.vue'
    import SbcFooter from 'sbc-common-components/src/components/SbcFooter.vue'

    export default {
        name: 'LayoutUser',
        components: {
            SbcHeader,
            SbcFooter
        },
        data: function () {
            return {
            }
        },
        inject: ['authApiUrl', 'originUrl'],
    }
</script>
