import Vue, {VNode} from 'vue'
import VueCompositionApi from '@vue/composition-api'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import App from '@/App.vue'
import configHelper from '@/utils/config-helper'
import router from '@/router/router'
import store from './store'
import layoutPublic from '@/layouts/LayoutPublic.vue'
import layoutUser from '@/layouts/LayoutUser.vue'
import SentryHelper from '@/sentry-helper'
/*
Import the global style sheet
 */
import './assets/styles/styles.scss'
import {Config} from "@/utils/app-data"

const opts = {iconfont: 'mdi'}

Vue.use(VueCompositionApi)
Vue.use(Vuetify)

Vue.config.productionTip = false
Vue.component('public-layout', layoutPublic)
Vue.component('user-layout', layoutUser)

configHelper.fetchConfig()
  .then((appConfig: Config): void => {
    SentryHelper.setup(appConfig)
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
