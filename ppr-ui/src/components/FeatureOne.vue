<template>
  <div class="features">
    <v-checkbox class="f-check" v-model="featureFlag" :label="featureLabel" />
  </div>
</template>

<script lang="ts">
import {computed, createComponent, watch} from "@vue/composition-api"
import {Data} from "@vue/composition-api/dist/component"
import {useFlags} from '@/flags/feature-flags'

export default createComponent({
  setup(): Data {
    const name = 'One'
    const flags = useFlags()
    const featureFlag = flags.pocFeature1
    const featureLabel = computed((): string => (featureFlag.value ? 'Disable' : ' Enable') + ' Feature ' + name)

    watch(featureFlag, (flag): void => { flags.pocFeature1.value = flag })

    return { name, featureFlag, featureLabel}
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
