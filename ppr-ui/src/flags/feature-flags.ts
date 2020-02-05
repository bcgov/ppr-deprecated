import { inject, provide, reactive } from '@vue/composition-api'

export class FeatureFlags {
  private static _instance: FeatureFlags
  private _flags: Map<string, boolean>

  private constructor() {
    this._flags = new Map<string, boolean>()
  }

  public static get Instance(): FeatureFlags {
    return this._instance || (this._instance = new this())
  }

  public setFlag(flagName: string, enabled: boolean): void {
    this._flags.set(flagName, enabled)
  }

  public getFlag(flagName: string): boolean {
    return !!this._flags.get(flagName)
  }
}

export const FeatureFlagSymbol = Symbol()

export function provideFeatureFlags(): void {
  provide(FeatureFlagSymbol, reactive(FeatureFlags.Instance))
}

export function useFeatureFlags(): FeatureFlags {
  const featureFlags: FeatureFlags = inject(FeatureFlagSymbol) as FeatureFlags

  if (!featureFlags) {
    throw Error('FeatureFlags cannot be injected, has not been provided')
  }

  return featureFlags
}
