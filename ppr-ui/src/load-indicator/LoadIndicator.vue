<template>
  <!-- Any loading action can trigger display of spinner -->
  <transition name="fade">
    <div
      v-show="isLoading"
      class="loading-container"
    >
      <div class="loading__content">
        <v-progress-circular
          color="primary"
          size="50"
          indeterminate
        />
        <!-- Suppress message with spinner until we can make the message relate to the action initiated by the user -->
        <!--<div class="loading-msg">-->
        <!--Loading Personal Property Registry-->
        <!--</div>-->
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import {createComponent, computed} from "@vue/composition-api"
import {Data} from "@vue/composition-api/dist/component"
import {useLoadIndicator} from '@/load-indicator'

export default createComponent({
  setup(): Data {

    const loadIndicator = useLoadIndicator()

    const isLoading = computed(() => { return loadIndicator.isLoading()  })

    return {isLoading}
  }
})

</script>

<style scoped>

</style>
