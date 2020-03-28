import VueRouter from 'vue-router'
import { PositionResult, Route } from 'vue-router/types/router'
import routes from './routes'
import { authRedirect } from '@/utils/auth-helper'
import { inject, provide } from '@vue/composition-api'

export const RouterSymbol = Symbol()

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(): PositionResult {
    // see https://router.vuejs.org/guide/advanced/scroll-behavior.html
    return { x: 0, y: 0 }
  }
})

// if there is no saved Keycloak token, redirect to Auth URL
router.afterEach((to): void => {
  try {
    if (to.matched.some((record): boolean => record.meta.requiresAuth)) {
      authRedirect()
    }
  } catch (error) {
    console.error('Router afterEach', error)
  }
})

export function provideRouter(): void {
  provide(RouterSymbol, router)
}

export function useRouter(): { route: Route; router: VueRouter } {
  const router = inject(RouterSymbol) as VueRouter
  if (!router) {
    throw Error('Router cannot be injected, has not been provided')
  }
  const route: Route = router.currentRoute
  return { route, router }
}

export default router
