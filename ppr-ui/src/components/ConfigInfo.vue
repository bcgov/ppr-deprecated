<template lang="pug">
  div
    h2 Application Configuration Information
    dl
      dt PPR API URL
      dd {{ pprApi}}
        div Used to access the PPR API
      dt Authentication API  URL
      dd {{authApiUrl}}
        div Used to get authorizations and business information given a business ID and a valid JWT user token.
        div Also provided to the SBC Common Header in the authURL property, along with the origin return URL
      dt Authentication URL
      dd {{ authUrl}}
        div Used on initial page load to redirect user to authenticate
        div Used to redirect user to their business profile for let them do updates
        div Used to redirect to make a payment
      dt Payment API URL
      dd {{ payApiUrl}}
        div Used to interact with the payment system

</template>

<script>
    import AppData from '@/utils/app-data'
    export default {
        data: function () {
            return {
                appData: AppData,
                pprApi: AppData.config.pprApiUrl,
                authUrl: AppData.config.authUrl,
                authApiUrl: AppData.config.authApiUrl,
                payApiUrl: AppData.config.payApiUrl
            }
        },
    }
</script>
<style lang="scss">
  dt {
    font-width: bold;
  }
  dd {
    margin-left: 1rem;
  }
</style>
