import ip from 'ip'
import { UAParser } from 'ua-parser-js'
import { LDUser } from 'launchdarkly-js-client-sdk'

const userAgentParser = new UAParser()

function baseUser(): LDUser {
  // return a LDUser ... defined in https://github.com/launchdarkly/js-sdk-common/blob/master/typings.d.ts
  return {
    // key: key,
    // name: ''
    // firstName
    // lastName
    // email
    // avatar
    // country
    // anonymous
    ip: ip.address(),
    // custom?: {[key: string]: string | boolean | number | Array<string | boolean | number>;}
    custom: {
      ua: userAgentParser.getResult().ua
    }
    /**
     * Specifies a list of attribute names (either built-in or custom) which should be
     * marked as private, and not sent to LaunchDarkly in analytics events. This is in
     * addition to any private attributes designated in the global configuration
     * with [[LDOptions.privateAttributeNames]] or [[LDOptions.allAttributesPrivate]].
     */
    // privateAttributeNames?: Array<string>;
  }
}

export function anonymousUser(): LDUser {
  let user = baseUser()
  user.anonymous = true
  return user
}

// https://docs.launchdarkly.com/docs/js-sdk-reference#section-changing-the-user-context
// Change the user context after sign in
/*
ldclient.identify(newUser, hash, function() {
  console.debug("New user's flags available");
});
 */
export function indentifiedUser(key: string): LDUser {
  let user = baseUser()
  user.key = key
  return user
}
