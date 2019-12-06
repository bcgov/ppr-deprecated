import {ref, provide, inject, Ref} from "@vue/composition-api"

// const ldKeys = ['poc-feature-1', 'poc-feature-2']

export class FeatureFlags {
  pocFeature1: Ref<boolean>
  pocFeature2: Ref<boolean>
  userKey: string

  constructor(envKey: string, userKey: string) {
    this.userKey = userKey
    this.pocFeature1 = ref(false)
    this.pocFeature2 = ref(false)
  }
}


const FlagSymbol = Symbol()

export function provideFlags(fflags) {
  provide(FlagSymbol, fflags)
}

export function useFlags() {
  const fflags: void | FeatureFlags = inject(FlagSymbol)
  if (!fflags) {
    throw new Error('No launch darkly flag class provided')
  }
  console.log('Feature Flags - useFlags', fflags)
  return fflags
}

