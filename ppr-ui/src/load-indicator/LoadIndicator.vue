<template>
  <!-- Any loading action can trigger display of spinner -->
  <transition name="fade">
    <div
      v-if="isLoading"
      class="loading-container"
    >
      <div class="loading__content">
        <v-progress-circular
          color="primary"
          size="150"
          indeterminate
        />
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { createComponent, computed } from '@vue/composition-api'
import { Data } from '@vue/composition-api/dist/component'
import { useLoadIndicator } from '@/load-indicator'

export default createComponent({
  setup(): Data {
    const loadIndicator = useLoadIndicator()
    const isLoading = computed(() => { return loadIndicator.isLoading() })

    return { isLoading }
  }
})

</script>

<style lang="scss" scoped>
.loading-container {
  background-color: rgba(0, 0, 0, 0.25);
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 9999;
}

.loading__content {
  left: 50%;
  margin: 0;
  position: absolute;
  text-align: center;
  top: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
</style>
