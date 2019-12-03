import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
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

const opts = {iconfont: 'mdi'}

Vue.use(VueCompositionApi)
Vue.use(Vuetify)

Vue.config.productionTip = false
Vue.component('public-layout', layoutPublic)
Vue.component('user-layout', layoutUser)

Vue.config.errorHandler = (err, vm, info) => {
  // err: error trace
  // vm: component in which error occured
  // info: Vue specific error information such as lifecycle hooks, events etc.
  // TODO: Perform any custom logic or log to server
  console.error('Vue main error handler', err, vm, info)
};

window.onerror = function (message, source, lineno, colno, error) {
  console.error('window.onerror', message, source, lineno, colno, error)
}


configHelper.fetchConfig()
  .then(() => {
    new Vue({
      vuetify: new Vuetify(opts),
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  })
  .catch(error => {
    console.error('error fetching config -', error)
    alert('Fatal error loading app')
  })
