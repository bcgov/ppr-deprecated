import {inject, provide, reactive} from "@vue/composition-api"

export class FeatureFlags {
  private _feature1: boolean
  private _feature2: boolean

  private static _instance: FeatureFlags

  private constructor(feature1: boolean = false, feature2: boolean = false) {
    this._feature1 = feature1
    this._feature2 = feature2
  }

  public static get Instance(): FeatureFlags {
    return this._instance || (this._instance = new this())
  }

  public get feature1(): boolean {
    return this._feature1
  }

  public set feature1(feature1) {
    this._feature1 = feature1
  }

  public get feature2(): boolean {
    return this._feature2
  }

  public set feature2(feature2) {
    this._feature2 = feature2
  }
}

export const FeatureFlagSymbol = Symbol()


export function provideFeatureFlags(): void {
  provide(FeatureFlagSymbol, reactive(FeatureFlags.Instance))
}

export function useFeatureFlags(): FeatureFlags {
  const featureFlags: FeatureFlags = inject(FeatureFlagSymbol) as FeatureFlags
  if (!featureFlags) {
    throw Error("FeatureFlags cannot be injected, has not been provided")
  }
  return featureFlags
}
