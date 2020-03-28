import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'

export default class SentryHelper {
  public static setup(dsn: string, environment: string): void {
    try {
      const options: Sentry.BrowserOptions = {
        dsn: dsn,
        environment: environment,
        integrations: [
          /*

            Vue Error Handling
            Please note that if you enable this integration, Vue will not call its logError internally. 
            This means that errors occurring in the Vue renderer will not show up in the developer console.
            If you want to preserve this functionality, make sure to pass the logErrors: true option.

          */
          new Integrations.Vue({
            // Vue, this is optional assuming window.Vue is present
            logErrors: true, // call original Vue logError as well
            attachProps: true // send Vue props to sentry
          }),
          /*
          CaptureConsole
          This integration captures all Console API calls and redirects them to Sentry using 
          captureMessage call. It then retriggers to preserve default native behaviour.
          */
          new Integrations.CaptureConsole({
            levels: ['error']
          })
        ]
      }

      /* Turns debug mode on or off. If debug is enabled SDK will attempt to print out useful debugging information 
      if something goes wrong with sending the event. The default is always false and it’s generally not 
      recommended to turn it on in production but doing so will not cause any safety concerns.
      */
      // options.debug = true

      // Sentry recommends manually setting the release name (string)
      // options.release = app-release-id

      Sentry.init(options)
    }
    catch (err) {
      console.warn(`Sentry failed to initialize: ${err.message}`, err)
    }
  }
}

/*
If capturing too much data and need to filter see
https://docs.sentry.io/error-reporting/configuration/filtering/?platform=browser
and add a filter like this
Sentry.init({
  beforeSend(event) {
    // Modify the event here
    if (event.user) {
      // Don't send user's email address
      delete event.user.email;
    }
    return event;
  }
});

To add context data such as user information, tags, event levels, etc see
https://docs.sentry.io/enriching-error-data/context/?platform=browser
Sentry.configureScope(function(scope) {
  scope.setUser({"email": "john.doe@example.com"});
});
*/

