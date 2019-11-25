
class FeatureFlags {
  private _featureOne: boolean = false
  get featureOne (): boolean {
    return this._featureOne
  }
  set featureOne (flag: boolean) {
    this._featureOne = flag
  }

  private _featureTwo: boolean = sessionStorage.getItem('FEATURE_TWO') === 'true'
  get featureTwo (): boolean {
    return this._featureTwo
  }
  set featureTwo (flag: boolean) {
    // console.log('feature two set flag', flag)
    sessionStorage.setItem('FEATURE_TWO', flag? 'true' : 'false')
    this._featureTwo = flag
  }
}

class AppDataInternal {
  private _features: FeatureFlags = new FeatureFlags()
  get features (): FeatureFlags {
    return this._features
  }

}

const AppData = new AppDataInternal()
export default AppData
