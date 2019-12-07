import {toRefs, reactive} from "@vue/composition-api"

let _flags

export function initializeFeatureFlags(): void {
  _flags = reactive ( {
    pocFeature1: false,
    pocFeature2: false
  })
}

// Return object. Ideally the composition API would export the Refs<> type
export function useFeatureFlags(): any {
  return toRefs(_flags)
}


export function setPocFeature1 (value): void {
  // console.log('set new value into feature flag', 'pocFeature1', value)
  _flags.pocFeature1 = value
}

export function setPocFeature2 (value): void {
  // console.log('set new value into feature flag', 'pocFeature2', value)
  _flags.pocFeature2 = value
}

