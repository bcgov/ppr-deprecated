
/*
Config
Hides the implementation of storing configuration information.
 */
export class Config {

  private _authUrl: string = sessionStorage.getItem('AUTH_URL') || ''
  private _authApiUrl: string = sessionStorage.getItem('AUTH_API_URL') || ''
  private _payApiUrl: string = sessionStorage.getItem('PAY_API_URL') || ''
  private _pprApiUrl: string = sessionStorage.getItem('PPR_API_URL') || ''

  public readonly sentryDSN: string
  public readonly sentryEnvironment: string

  public readonly launchDarklyClientKey: string

  public constructor(data: object) {
    this.sentryDSN = data['SENTRY_DSN']
    this.sentryEnvironment = data['SENTRY_ENVIRONMENT']
    this.launchDarklyClientKey = data['LAUNCH_DARKLY_CLIENT_KEY']
  }

  public get authUrl(): string {
    return this._authUrl
  }

  public set authUrl(url: string) {
    sessionStorage.setItem('AUTH_URL', url)
    this._authUrl = url
  }

  public get authApiUrl(): string {
    return this._authApiUrl
  }

  public set authApiUrl(url: string) {
    sessionStorage.setItem('AUTH_API_URL', url)
    this._authApiUrl = url
  }

  public get payApiUrl(): string {
    return this._payApiUrl
  }

  public set payApiUrl(url: string) {
    sessionStorage.setItem('PAY_API_URL', url)
    this._payApiUrl = url
  }

  public get pprApiUrl(): string {
    return this._pprApiUrl
  }

  public set pprApiUrl(url: string) {
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

  public get userName(): string {
    return this._userName
  }

  public set userName(name: string) {
    sessionStorage.setItem('USER_NAME', name)
    this._userName = name
  }


}

class AppDataInternal {
  private _config: Config = new Config({})
  public get config(): Config {
    return this._config
  }

  private _user: User = new User()
  public get user(): User {
    return this._user
  }

  public resetConfig(data: object): void {
    this._config = new Config(data)
  }
}

const AppData = new AppDataInternal()
export default AppData
