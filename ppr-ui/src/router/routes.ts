import Dashboard from '@/views/Dashboard.vue'

export default [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue'),
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
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: {layout: 'public'}
  },
  {
    path: '/auth',
    name: 'auth',
    component: () => import(/* webpackChunkName: "auth" */ '../views/AuthStub.vue'),
    meta: {layout: 'public'}
  },
  {
    // default/fallback route
    path: '*',
    redirect: '/'
  }
]
