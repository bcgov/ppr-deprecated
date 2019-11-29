<template>
  <div>
    <h2>Application Configuration Information</h2>
    <dl><dt>PPR API URL</dt>
      <dd>{{ configuration.pprApi}}
        <div>Used to access the PPR API</div>
      </dd><dt>Authentication API  URL</dt>
      <dd>{{configuration.authApiUrl}}
        <div>Used to get authorizations and business information given a business ID and a valid JWT user token.</div>
        <div>Also provided to the SBC Common Header in the authURL property, along with the origin return URL</div>
      </dd><dt>Authentication URL</dt>
      <dd>{{ configuration.authUrl}}
        <div>Used on initial page load to redirect user to authenticate</div>
        <div>Used to redirect user to their business profile for let them do updates</div>
        <div>Used to redirect to make a payment</div>
      </dd><dt>Payment API URL</dt>
      <dd>{{ configuration.payApiUrl}}
        <div>Used to interact with the payment system</div>
      </dd>
    </dl>
  </div>
</template>

<script lang="ts">
import {createComponent, inject, reactive} from "@vue/composition-api"
import {Data} from "@vue/composition-api/dist/ts-api/component"

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
