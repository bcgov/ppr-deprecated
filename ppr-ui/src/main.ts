import Vue, {VNode} from 'vue'
import VueCompositionApi from '@vue/composition-api'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'
import App from '@/App.vue'
// TODO figure out the best way to implement service worker.
//     When service worker is registered FireFox does not see changes on prod.
//     The workarounds are not easy. Is there a better way?
//     https://stackoverflow.com/questions/41636754/how-to-clear-a-service-worker-cache-in-firefox
// import './registerServiceWorker'
import configHelper from '@/utils/config-helper'
import router from '@/router/router'
import store from './store'
import layoutPublic from '@/layouts/LayoutPublic.vue'
import layoutUser from '@/layouts/LayoutUser.vue'

/*
Import the global style sheet
 */
import './assets/styles/styles.scss'
import {Config} from "@/utils/app-data";

const opts = {iconfont: 'mdi'}

Vue.use(VueCompositionApi)
Vue.use(Vuetify)

Vue.config.productionTip = false
Vue.component('public-layout', layoutPublic)
Vue.component('user-layout', layoutUser)

Vue.config.errorHandler = (err, vm, info): void => {
  // err: error trace
  // vm: component in which error occured
  // info: Vue specific error information such as lifecycle hooks, events etc.
  // TODO: Perform any custom logic or log to server
  console.error('Vue main error handler', err, vm, info)
};

configHelper.fetchConfig()
  .then((appConfig: Config): void => {
    try {
      Sentry.init({
        dsn: appConfig.sentryDSN,
        environment: appConfig.sentryEnvironment,
        integrations: [new Integrations.Vue({ Vue, attachProps: true })]
      });
    }
    catch (err) {
      console.warn(`Sentry failed to initialize: ${err.message}`, err)
    }

    new Vue({
      vuetify: new Vuetify(opts),
      router,
      store,
      render: (h): VNode => h(App)
    }).$mount('#app')
  })
  .catch((error): void => {
    console.error('error fetching config -', error)
    alert('Fatal error loading app')
  })
