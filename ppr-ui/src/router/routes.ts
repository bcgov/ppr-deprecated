import About from '@/views/Dashboard.vue'
import AuthStub from '@/views/AuthStub.vue'
import Dashboard from '@/views/Dashboard.vue'
import Home from '@/views/Home.vue'

// TODO restore lazy load of components. Important when the app gets larger to reduce size of initial js files.
// Disable the lazy load approach until we can determine the TS return type from something like
// () => import(/* webpackChunkName: "about" */ '../views/Home.vue')

export default [
  {
    path: '/',
    name: 'home',
    component: Home, //() => import(/* webpackChunkName: "about" */ '../views/Home.vue'),
    meta: {layout: 'public'}
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: {requiresAuth: true, layout: 'user'}
  },
  {
    path: '/about',
    name: 'about',
    component: About, //() => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: {layout: 'public'}
  },
  {
    path: '/auth',
    name: 'auth',
    component: AuthStub, // () => import(/* webpackChunkName: "auth" */ '../views/AuthStub.vue'),
    meta: {layout: 'public'}
  },
  {
    // default/fallback route
    path: '*',
    redirect: '/'
  }
]
