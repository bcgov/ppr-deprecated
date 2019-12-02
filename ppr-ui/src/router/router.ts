import Vue from 'vue'
import VueRouter from 'vue-router'
import {PositionResult} from "vue-router/types/router";
import routes from './routes'
import authHelper from '@/utils/auth-helper'
import {inject, provide} from "@vue/composition-api";


Vue.use(VueRouter)

export const RouterSymbol = Symbol();

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(): PositionResult {
    // see https://router.vuejs.org/guide/advanced/scroll-behavior.html
    return {x: 0, y: 0}
  }
})

// if there is no saved Keycloak token, redirect to Auth URL
router.afterEach((to): void => {
  try {
    console.log('Router afterEach', to.matched)
    if (to.matched.some((record): boolean => record.meta.requiresAuth)) {
      authHelper.authRedirect()
    }
  } catch (error) {
    console.error('Router afterEach', error)
  }
})

export function provideRouter() {
  provide(RouterSymbol, router)
}

export function useRouter(): VueRouter {
  const vueRouter: VueRouter = inject(RouterSymbol) as VueRouter
  if (!vueRouter) {
    throw Error("Router cannot be injected, has not been provided");
  }
  return vueRouter
}

export default router
