<template>
  <div class="features">
    <v-checkbox
      v-model="featureTwoFlag"
      class="f-check"
      :label="fOneToggleLabel"
    />
  </div>
</template>

<script lang="ts">
import {computed, createComponent, inject, ref, watch} from "@vue/composition-api"
import {Data} from "@vue/composition-api/dist/component"
import AppData from '@/utils/app-data'

export default createComponent({
  setup(): Data {
    const featureTwoFlag = inject("featureTwo", ref(false))
    const fOneToggleLabel = computed((): string => featureTwoFlag.value ? 'Disable F Two' : ' Enable F Two')

    watch(featureTwoFlag, (flag): void => { AppData.features.featureTwo = flag })

    return { featureTwoFlag, fOneToggleLabel }
  }
})
</script>

<style lang="scss">
@import '@/assets/styles/theme.scss';

  .features {
    margin-left: 2rem;
    label {
      color: $gray3 !important;
      font-size: 16px;
    }
    i {
      color: $gray3 !important;
      /*font-size: 16px !important;*/
    }
  }
  .f-check {
    height: 5px;
  }
</style>
