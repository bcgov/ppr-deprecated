import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import authHelper from '@/utils/auth-helper'


Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    // see https://router.vuejs.org/guide/advanced/scroll-behavior.html
    return {x: 0, y: 0}
  }
})

// if there is no saved Keycloak token, redirect to Auth URL
router.afterEach((to, from) => {
  try {
    console.log('Router afterEach', to.matched)
    if (to.matched.some(record => record.meta.requiresAuth)) {
      authHelper.authRedirect()
    }
  } catch (error) {
    console.error('Router afterEach', error)
  }
})

export default router
