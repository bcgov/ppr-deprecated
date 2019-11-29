<template>
  <div>
    <sbc-header ref="sbcHeader" :brandLink="originUrl" :authURL="authApiUrl" />

    <div class="app-body">
      <main>
        <slot>Main content for a component will appear here. The component is selected by the router</slot>
      </main>
    </div>

    <sbc-footer />
  </div>
</template>

<script lang="ts">
  import {createComponent} from "@vue/composition-api";
  import SbcHeader from 'sbc-common-components/src/components/SbcHeader.vue'
  import SbcFooter from 'sbc-common-components/src/components/SbcFooter.vue'

  export default createComponent({
    name: 'LayoutPublic',
    components: {
      SbcHeader,
      SbcFooter,
    },
    inject: ['authApiUrl', 'originUrl']
  })
</script>
