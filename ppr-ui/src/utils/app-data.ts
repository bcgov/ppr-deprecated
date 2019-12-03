class FeatureFlags {
  private _featureOne: boolean = false
  get featureOne(): boolean {
    return this._featureOne
  }

  set featureOne(flag: boolean) {
    this._featureOne = flag
  }

  private _featureTwo: boolean = sessionStorage.getItem('FEATURE_TWO') === 'true'
  get featureTwo(): boolean {
    return this._featureTwo
  }

  set featureTwo(flag: boolean) {
    // console.log('feature two set flag', flag)
    sessionStorage.setItem('FEATURE_TWO', flag ? 'true' : 'false')
    this._featureTwo = flag
  }
}

/*
Config
Hides the implementation of storing configuration information.
 */
class Config {

  private _authUrl: string = sessionStorage.getItem('AUTH_URL') || ''
  private _authApiUrl: string = sessionStorage.getItem('AUTH_API_URL') || ''
  private _payApiUrl: string = sessionStorage.getItem('PAY_API_URL') || ''
  private _pprApiUrl: string = sessionStorage.getItem('PPR_API_URL') || ''

  get authUrl(): string {
    return this._authUrl
  }

  get authApiUrl() {
    return this._authApiUrl
  }

  get payApiUrl() {
    return this._payApiUrl
  }

  get pprApiUrl(): string {
    return this._pprApiUrl
  }

  set authUrl(url: string) {
    sessionStorage.setItem('AUTH_URL', url)
    this._authUrl = url
  }

  set authApiUrl(url: string) {
    sessionStorage.setItem('AUTH_API_URL', url)
    this._authApiUrl = url
  }

  set payApiUrl(url: string) {
    sessionStorage.setItem('PAY_API_URL', url)
    this._payApiUrl = url
  }

  set pprApiUrl(url: string) {
    sessionStorage.setItem('PPR_API_URL', url)
    this._pprApiUrl = url
  }

}

/*
User
Hides the implementation of storing user information.
 */
class User {

  private _userName: string = sessionStorage.getItem('USER_NAME') || ''

  get userName(): string {
    return this._userName
  }

  set userName(name: string) {
    sessionStorage.setItem('USER_NAME', name)
    this._userName = name
  }


}

class AppDataInternal {
  private _features: FeatureFlags = new FeatureFlags()
  get features(): FeatureFlags {
    return this._features
  }

  private _config: Config = new Config()
  get config(): Config {
    return this._config
  }

  private _user: User = new User()
  get user(): User {
    return this._user
  }

}

const AppData = new AppDataInternal()
export default AppData
