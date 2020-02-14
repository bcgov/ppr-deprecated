
<template>
  <sbc-header
    redirect-on-login-success="encoded"
    redirect-on-logout="encode"
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
    const oUrl = inject('originUrl') as string
    const encoded = encodeURIComponent(oUrl)
    return {
      encoded
    }
  }
})

</script>
