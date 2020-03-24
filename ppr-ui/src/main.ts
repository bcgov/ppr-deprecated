import Vue, { VNode } from 'vue'
import VueRouter from 'vue-router'
import VueCompositionApi from '@vue/composition-api'
import Vuelidate from 'vuelidate'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import App from '@/App.vue'
import router from '@/router/router'
import store from './store'
import layoutPublic from '@/layouts/LayoutPublic.vue'
import layoutUser from '@/layouts/LayoutUser.vue'
import SentryHelper from '@/utils/sentry-helper'
import './assets/styles/styles.scss'
import Config from '@/utils/config'
import { initializeVueLdClient } from '@/flags/ld-client'
import { getJwtValue } from './utils/auth-helper'

const opts = { iconfont: 'mdi' }

Vue.use(VueCompositionApi)
Vue.use(Vuetify)
Vue.use(Vuelidate)
Vue.use(VueRouter)

Vue.config.productionTip = false
Vue.component('public-layout', layoutPublic)
Vue.component('user-layout', layoutUser)

Config.setup()
  .then((): void => {
    return SentryHelper.setup(Config.sentryDSN, Config.sentryEnvironment)
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  }).then(() => {
    return initializeVueLdClient(Config.launchDarklyClientKey, getJwtValue('username'))
  })
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  .then(() => {
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
