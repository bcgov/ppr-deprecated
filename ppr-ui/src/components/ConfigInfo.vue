<template lang="pug">
  div
    h2 Application Configuration Information
    dl
      dt PPR API URL
      dd {{ configuration.pprApi}}
        div Used to access the PPR API
      dt Authentication API  URL
      dd {{configuration.authApiUrl}}
        div Used to get authorizations and business information given a business ID and a valid JWT user token.
        div Also provided to the SBC Common Header in the authURL property, along with the origin return URL
      dt Authentication URL
      dd {{ configuration.authUrl}}
        div Used on initial page load to redirect user to authenticate
        div Used to redirect user to their business profile for let them do updates
        div Used to redirect to make a payment
      dt Payment API URL
      dd {{ configuration.payApiUrl}}
        div Used to interact with the payment system

</template>

<script lang="ts">
    import {createComponent, inject, reactive} from "@vue/composition-api";
    import {Data} from "@vue/composition-api/dist/ts-api/component";

    export default createComponent({
        setup(): Data {
            const configuration = inject("configuration", reactive({}))
            return {configuration}
        }
    })
</script>
<style lang="scss">
  dt {
    font-width: bold;
  }

  dd {
    margin-left: 1rem;
  }
</style>
