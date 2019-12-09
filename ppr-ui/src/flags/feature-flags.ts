import {toRefs, Ref, reactive} from "@vue/composition-api"
import {Data} from "@vue/composition-api/dist/component"


let _flags

export function initializeFeatureFlags(): void {
  _flags = reactive ( {
    pocFeature1: false,
    pocFeature2: false
  })
}


/*
export function useFeatureFlags() {
  return toRefs(_flags)
}

If useFeatureFlags() does not have return type the linter produces the warning:

warning: Missing return type on function (@typescript-eslint/explicit-function-return-type)

With the correct return type but without Refs<> being defined any where the definition:

export function useFeatureFlags(): Refs<Data> {
  return toRefs(_flags)
}
Produces the error:

TypeScript diagnostics (customize using `[jest-config].globals.ts-jest.diagnostics` option):
error TS2304: Cannot find name 'Refs'.

To resolve we can copy from  "@vue/composition-api/dist/reactivity/ref" the Refs<> type.
Ideally the composition API would export the Refs<> type.

*/

export declare type Refs<Data> = {
  [K in keyof Data]: Data[K] extends Ref<infer V> ? Ref<V> : Ref<Data[K]>;
}

export function useFeatureFlags(): Refs<Data> {
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

