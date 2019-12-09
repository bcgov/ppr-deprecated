<template>
  <div class="features">
    <v-checkbox
      id="featureOne"
      v-model="pocFeature1"
      class="f-check"
      :label="featureLabel"
    />
  </div>
</template>

<script lang="ts">
import {computed, createComponent, ref, watch} from "@vue/composition-api"
import {Data} from "@vue/composition-api/dist/component"
import {useFeatureFlags} from '@/flags/feature-flags'

export default createComponent({
  setup(): Data {
    const name = 'One'
    const flags = useFeatureFlags()
    const pocFeature1 = ref(flags.feature1)

    const featureLabel = computed((): string => (pocFeature1.value ? 'Disable' : ' Enable') + ' F ' + name)

    watch(pocFeature1, (flag): void => {
      flags.feature1 = flag
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
