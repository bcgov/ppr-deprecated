import axios from 'axios'
import Config from '@/utils/config-helper'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('Config', (): void => {
  it('has empty string default value for apiUrl', (): void => {
    Config.setup().then((): void => {
      expect(Config.apiUrl).toBe('')
    })
  })

  it('has non-empty string value for apiUrl', (): void => {
    mockedAxios.get.mockResolvedValueOnce({ data: '{ "API_URL": "ABC123" }' })

    Config.setup().then((): void => {
      expect(Config.apiUrl).toBe('ABC123')
    })
  })

  it('has empty string default value for authApiUrl', (): void => {
    Config.setup().then((): void => {
      expect(Config.authApiUrl).toBe('')
    })
  })

  it('has non-empty string value for authApiUrl', (): void => {
    mockedAxios.get.mockResolvedValueOnce({ data: '{ "AUTH_API_URL": "ABC123" }' })

    Config.setup().then((): void => {
      expect(Config.authApiUrl).toBe('ABC123')
    })
  })

  it('has empty string default value for launchDarklyClientKey', (): void => {
    Config.setup().then((): void => {
      expect(Config.launchDarklyClientKey).toBe('')
    })
  })

  it('has non-empty string value for launchDarklyClientKey', (): void => {
    mockedAxios.get.mockResolvedValueOnce({ data: '{ "LAUNCH_DARKLY_CLIENT_KEY": "ABC123" }' })

    Config.setup().then((): void => {
      expect(Config.launchDarklyClientKey).toBe('ABC123')
    })
  })

  it('has empty string default value for payApiUrl', (): void => {
    Config.setup().then((): void => {
      expect(Config.payApiUrl).toBe('')
    })
  })

  it('has non-empty string value for payApiUrl', (): void => {
    mockedAxios.get.mockResolvedValueOnce({ data: '{ "PAY_API_URL": "ABC123" }' })

    Config.setup().then((): void => {
      expect(Config.payApiUrl).toBe('ABC123')
    })
  })

  it('has empty string default value for sentryDSN', (): void => {
    Config.setup().then((): void => {
      expect(Config.sentryDSN).toBe('')
    })
  })

  it('has non-empty string value for sentryDSN', (): void => {
    mockedAxios.get.mockResolvedValueOnce({ data: '{ "SENTRY_DSN": "ABC123" }' })

    Config.setup().then((): void => {
      expect(Config.sentryDSN).toBe('ABC123')
    })
  })

  it('has empty string default value for sentryEnvironment', (): void => {
    Config.setup().then((): void => {
      expect(Config.sentryEnvironment).toBe('')
    })
  })

  it('has non-empty string value for sentryEnvironment', (): void => {
    mockedAxios.get.mockResolvedValueOnce({ data: '{ "SENTRY_ENVIRONMENT": "ABC123" }' })

    Config.setup().then((): void => {
      expect(Config.sentryEnvironment).toBe('ABC123')
    })
  })
})
