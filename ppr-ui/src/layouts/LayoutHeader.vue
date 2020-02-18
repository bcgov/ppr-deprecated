
<template>
  <sbc-header
    :redirect-on-login-success="originUrl"
    :redirect-on-logout="originUrl"
  />
</template>

<script lang="ts">
import { createComponent, inject } from '@vue/composition-api'
import SbcHeader from 'sbc-common-components/src/components/SbcHeader.vue'

export default createComponent({
  components: {
    SbcHeader
  },
  setup() {
    const originUrl = inject('originUrl') as string
    // Need this debug until auth redirects are verified to work on at least Dev if not all the way to Prod. Then can remove.
    console.debug('send this url to header', originUrl)
    return {
      originUrl
    }
  }
})

</script>
