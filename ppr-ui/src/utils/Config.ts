import axiosAuth from '@/utils/axios-auth'

/**
 * The interface for converting the settings file JSON to string variables.
 */
interface ConfigSettings {
  API_URL: string;
  AUTH_API_URL: string;
  LAUNCH_DARKLY_CLIENT_KEY: string;
  PAY_API_URL: string;
  SENTRY_DSN: string;
  SENTRY_ENVIRONMENT: string;
}

/**
 * Provides environment-specific settings used by the application, for example API URLs.
 */
export default class Config {
  /**
   * Initializes the configuration settings.
   */
  public static async setup(): Promise<void> {
    // BASE_URL is set from vue.config.js setting "publicPath".
    const url = `${process.env.BASE_URL}config/configuration.json`

    const headers = {
      'Accept': 'application/json',
      'Cache-Control': 'no-cache',
      'ResponseType': 'application/json'
    }

    return axiosAuth.get(url, { headers })
      .then((response): void => {
        const settings: ConfigSettings = (typeof response.data === 'string') ? JSON.parse(response.data) : response.data

        this.setStoreValue('API_URL', settings.API_URL)
        this.setStoreValue('AUTH_API_URL', settings.AUTH_API_URL)
        this.setStoreValue('LAUNCH_DARKLY_CLIENT_KEY', settings.LAUNCH_DARKLY_CLIENT_KEY)
        this.setStoreValue('PAY_API_URL', settings.PAY_API_URL)
        this.setStoreValue('SENTRY_DSN', settings.SENTRY_DSN)
        this.setStoreValue('SENTRY_ENVIRONMENT', settings.SENTRY_ENVIRONMENT)
      })
  }

  /**
   * Gets the URL for the main API used by the application.
   */
  public static get apiUrl(): string {
    return this.getStoreValue('API_URL')
  }

  /**
   * Gets the URL for the authentication API.
   */
  public static get authApiUrl(): string {
    return this.getStoreValue('AUTH_API_URL')
  }

  /**
   * Gets the client key used for configuring feature flags.
   */
  public static get launchDarklyClientKey(): string {
    return this.getStoreValue('LAUNCH_DARKLY_CLIENT_KEY')
  }

  /**
   * Gets the URL for the payment API.
   */
  public static get payApiUrl(): string {
    return this.getStoreValue('PAY_API_URL')
  }

  /**
   * Gets the client key used for configuring Sentry error reporting.
   */
  public static get sentryDSN(): string {
    return this.getStoreValue('SENTRY_DSN')
  }

  /**
   * Gets the environment used for configuring Sentry error reporting.
   */
  public static get sentryEnvironment(): string {
    return this.getStoreValue('SENTRY_ENVIRONMENT')
  }

  private static getStoreValue(key: string): string {
    return sessionStorage.getItem(key) || ''
  }

  private static setStoreValue(key: string, value: string): void {
    return sessionStorage.setItem(key, value)
  }
}
