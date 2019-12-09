<template>
  <div class="features">
    <v-checkbox
      v-model="pocFeature2"
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
    const name = 'Two'
    const flags = useFeatureFlags()
    const pocFeature2 = ref(flags.feature2)

    const featureLabel = computed((): string => (pocFeature2.value ? 'Disable' : ' Enable') + ' Feature ' + name)

    watch(pocFeature2, (flag): void => {
      flags.feature2 = flag
    })

    return { name, pocFeature2, featureLabel}
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
