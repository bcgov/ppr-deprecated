import { initialize, LDClient, LDFlagSet, LDUser } from 'launchdarkly-js-client-sdk'
import { anonymousUser, indentifiedUser } from './ld-user'
import { FeatureFlags } from '@/flags/feature-flags'

class VueLdClient {
  private ldClient: LDClient

  public constructor(envKey: string, user: LDUser) {
    try {
      this.ldClient = initialize(envKey, user)

      this.ldClient.on('ready', (): void => {
        this.updateFlags(this.ldClient.allFlags())
      })

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

let client: VueLdClient

export function initializeVueLdClient(envKey: string, userKey?: string): VueLdClient {
  let user: LDUser = userKey ? indentifiedUser(userKey) : anonymousUser()
  client = new VueLdClient(envKey, user)

  return client
}
