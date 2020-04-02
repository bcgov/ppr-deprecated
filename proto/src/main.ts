import Vue, { VNode } from 'vue'
import VueRouter from 'vue-router'
import VueCompositionApi from '@vue/composition-api'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import App from '@/App.vue'
import router from '@/router/router'
import layoutPublic from '@/layouts/LayoutPublic.vue'
import layoutUser from '@/layouts/LayoutUser.vue'
import './assets/styles/styles.scss'

const opts = { iconfont: 'mdi' }

Vue.use(VueCompositionApi)
Vue.use(Vuetify)
Vue.use(VueRouter)

Vue.config.productionTip = false
Vue.component('public-layout', layoutPublic)
Vue.component('user-layout', layoutUser)

Vue.config.errorHandler = (err, vm, info) => {
  console.log('Err', err)
  console.log('Err info', info)
  // err: error trace
  // vm: component in which error occured
  // info: Vue specific error information such as lifecycle hooks, events etc.

  // TODO: Perform any custom logic or log to server

}
const vConfig = {
  vuetify: new Vuetify(opts),
  router,
  render: (h): VNode => h(App)
}

Promise.resolve()
  .then(() => {
    new Vue(vConfig).$mount('#app')
  })
  .catch((error): void => {
    console.error('error fetching config -', error)
    alert('Fatal error loading app')
  })
