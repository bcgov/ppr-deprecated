import {initialize, LDClient, LDUser} from 'launchdarkly-js-client-sdk'
import {anonymousUser, indentifiedUser} from './ld-user'
import {FeatureFlags} from '@/flags/feature-flags'

class VueLdClient {
  private ldClient: LDClient

  public constructor(envKey: string, user: LDUser) {
    console.debug('VueLdClient constructor ld-env-key, user', envKey, user)

    try {
      this.ldClient = initialize(envKey, user)
      console.debug('VueLdClient constructor ldClient', this.ldClient)
      this.ldClient.on('ready', (): void => {
        const allFlags = this.ldClient.allFlags()
        console.debug('LDFlags on ready flags', allFlags)
        this.updateFlags(allFlags)
      })

      this.ldClient.on('change', (): void => {
        const allFlags = this.ldClient.allFlags()
        console.debug('LDFlags on change flags', allFlags)
        this.updateFlags(allFlags)
      })
    } catch (err) {
      console.error('VueLdClient ', err)
    }
  }

  private updateFlags(allFlags): void {
    const flags = FeatureFlags.Instance
    console.debug('LDFlags on change flags', allFlags)
    flags.feature1 = allFlags['poc-feature-1']
    flags.feature2 = allFlags['poc-feature-2']
  }

  // changeUserContext(userKey: string) {
  //   let user: LDUser = indentifiedUser(userKey)
  //   let hash = null
  //   /**
  //    * Identify
  //    *
  //    * Unlike the server-side SDKs, the client-side JavaScript SDKs maintain a current user state,
  //    * which is set at initialization time. You only need to call `identify()` if the user has changed
  //    * since then.
  //    *
  //    * Changing the current user also causes all feature flag values to be reloaded. Until that has
  //    * finished, calls to [[variation]] will still return flag values for the previous user. You can
  //    * use a callback or a Promise to determine when the new flag values are available.
  //    *
  //    * @param user
  //    *   The user properties. Must contain at least the `key` property.
  //    * @param hash
  //    *   The signed user key for [Secure Mode](http://docs.launchdarkly.com/docs/js-sdk-reference#secure-mode).
  //    * @param onDone
  //    *   A function which will be called as soon as the flag values for the new user are available,
  //    *   with two parameters: an error value (if any), and an [[LDFlagSet]] containing the new values
  //    *   (which can also be obtained by calling [[variation]]). If the callback is omitted, you will
  //    *   receive a Promise instead.
  //    * @returns
  //    *   If you provided a callback, then nothing. Otherwise, a Promise which resolve once the flag
  //    *   values for the new user are available, providing an [[LDFlagSet]] containing the new values
  //    *   (which can also be obtained by calling [[variation]]).
  //    */
  //   this.ldClient.identify(user, hash, function() {
  //     // TODO update flags
  //     console.debug("New user's flags available");
  //   });
  // }

}

let client

export function initializeVueLdClient(envKey: string, userKey?: string): VueLdClient {
  let user: LDUser = userKey ? indentifiedUser(userKey) : anonymousUser()
  client = new VueLdClient(envKey, user)
  return client
}


// export function changeUser(userKey: string) {
//   client.changeUserContext(....
// }
