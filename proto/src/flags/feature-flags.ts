/**
 * Singleton class for the flag values used to enable and disable application features.
 */
class FeatureFlags {
  private static _instance: FeatureFlags
  private _flags: Map<string, boolean>

  private constructor() {
    this._flags = new Map<string, boolean>()
  }

  /**
   * Gets the singleton instance of the class.
   */
  public static get Instance(): FeatureFlags {
    return this._instance || (this._instance = new this())
  }

  /**
   * Sets whether or not a given feature flag is enabled.
   * 
   * @param flagName the name of the feature flag to set. 
   * @param enabled true if the feature is enabled, false otherwise.
   */
  public setFlag(flagName: string, enabled: boolean): void {
    this._flags.set(flagName, enabled)
  }

  /**
   * Gets whether or not a given feature flag is enabled.
   * 
   * @param flagName the name of the feature flag to get to status of. 
   */
  public getFlag(flagName: string): boolean {
    return !!this._flags.get(flagName)
  }
}

/**
 * The singleton instance of the feature flags class.
 */
export const featureFlags = FeatureFlags.Instance
