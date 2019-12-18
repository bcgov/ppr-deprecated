/* eslint-disable no-console */

import {register} from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready(): void {
      console.debug(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered(): void {
      console.debug('Service worker has been registered.')
    },
    cached(): void {
      console.debug('Content has been cached for offline use.')
    },
    updatefound(): void {
      console.debug('New content is downloading.')
    },
    updated(): void {
      console.debug('New content is available; please refresh.')
    },
    offline(): void {
      console.debug('No internet connection found. App is running in offline mode.')
    },
    error(error): void {
      console.error('Error during service worker registration:', error)
    }
  })
}
