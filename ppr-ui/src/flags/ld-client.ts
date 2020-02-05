import { initialize, LDClient, LDFlagSet, LDUser } from 'launchdarkly-js-client-sdk'
import { anonymousUser, indentifiedUser } from './ld-user'
import { FeatureFlags } from '@/flags/feature-flags'

class VueLdClient {
  private ldClient: LDClient
  private static _instance: VueLdClient

  public constructor(ldClient: LDClient) {
    this.ldClient = ldClient
    try {
      this.updateFlags(this.ldClient.allFlags())

      this.ldClient.on('change', (): void => {
        this.updateFlags(this.ldClient.allFlags())
      })
    } catch (err) {
      console.error('VueLdClient ', err)
    }
  }

  private updateFlags(allFlags: LDFlagSet): void {
    const featureFlags = FeatureFlags.Instance
    const launchDarklyFlags = allFlags as Record<string, boolean>

    for (const key in launchDarklyFlags) {
      featureFlags.setFlag(key, launchDarklyFlags[key])
    }
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function initializeVueLdClient(envKey: string, userKey?: string) {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  return new Promise(resolve => {
    let user: LDUser = userKey ? indentifiedUser(userKey) : anonymousUser()
    let ldClient = initialize(envKey, user)
    ldClient.on('ready', (): void => {
      const client = new VueLdClient(ldClient)
      return resolve(client)
    })
  })
}
