<template lang="pug">
  div(class="features")
    v-checkbox(id="featureOne", class="f-check", v-model="featureOneFlag", :label="fOneToggleLabel")
</template>

<script lang="ts">
import {computed, createComponent, inject, ref, watch} from "@vue/composition-api"
import {Data} from "@vue/composition-api/dist/component"
import AppData from '@/utils/app-data'

export default createComponent({
  setup(): Data {
    const featureOneFlag = inject("featureOne", ref(false))
    const fOneToggleLabel = computed((): string => featureOneFlag.value ? 'Disable F One' : ' Enable F One')

    watch(featureOneFlag, (flag): void => { AppData.features.featureOne = flag })

    return {featureOneFlag, fOneToggleLabel}
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
