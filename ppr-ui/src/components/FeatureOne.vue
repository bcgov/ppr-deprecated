<template>
  <div class="features">
    <v-checkbox
      v-model="pocFeature1"
      class="f-check"
      :label="featureLabel"
    />
  </div>
</template>

<script lang="ts">
import {computed, createComponent, watch} from "@vue/composition-api"
import {Data} from "@vue/composition-api/dist/component"
import {useFeatureFlags, setPocFeature1} from '@/flags/feature-flags'

export default createComponent({
  setup(): Data {
    const name = 'One'
    const {pocFeature1} = useFeatureFlags()

    const featureLabel = computed((): string => (pocFeature1.value ? 'Disable' : ' Enable') + ' Feature ' + name)

    watch(pocFeature1, (flag): void => {
      setPocFeature1(flag)
    })

    return { name, pocFeature1, featureLabel}
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

  .features {
    margin: 2rem;
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
