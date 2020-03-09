<template>
  <div>
    <layout-header />

    <div class="app-body">
      <main>
        <slot>Main content for a component will appear here. The component is selected by the router</slot>
      </main>
    </div>

    <sbc-footer />
  </div>
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'
import LayoutHeader from '@/layouts/LayoutHeader.vue'
import SbcFooter from 'sbc-common-components/src/components/SbcFooter.vue'

export default createComponent({
  name: 'LayoutUser',
  components: {
    LayoutHeader,
    SbcFooter
  },
  inject: ['authApiUrl', 'originUrl']
})
</script>
