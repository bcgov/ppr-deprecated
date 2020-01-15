
/*
Config
Hides the implementation of storing configuration information.
 */
export class Config {

  public readonly authApiUrl: string
  public readonly authUrl: string
  public readonly launchDarklyClientKey: string
  public readonly payApiUrl: string
  public readonly pprApiUrl: string
  public readonly sentryDSN: string
  public readonly sentryEnvironment: string

  public constructor(data: object) {
    this.authApiUrl = data['AUTH_API_URL']
    this.authUrl = data['AUTH_URL']
    this.launchDarklyClientKey = data['LAUNCH_DARKLY_CLIENT_KEY']
    this.payApiUrl = data['PAY_API_URL']
    this.pprApiUrl = data['API_URL']
    this.sentryDSN = data['SENTRY_DSN']
    this.sentryEnvironment = data['SENTRY_ENVIRONMENT']
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
