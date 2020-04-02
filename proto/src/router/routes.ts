import Admin from '@/views/Admin.vue'
import About from '@/views/About.vue'
import Dashboard from '@/views/Dashboard.vue'
import FinancingStatement from '@/views/FinancingStatementViewTab.vue'
import Home from '@/views/Home.vue'
import PartyCodes from '@/views/PartyCodes.vue'
import ResultsPage from '@/views/ResultsPage.vue'
import SearchPage from '@/views/SearchPage.vue'

import Login from '@/views/Login.vue'

export default [
  {
    path: '/',
    name: 'home',
    component: Home, //() => import(/* webpackChunkName: "about" */ '../views/Home.vue'),
    meta: { layout: 'public' }
  },
  {
    path: '/about',
    name: 'about',
    component: About, //() => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: { layout: 'public' }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { layout: 'public' }
  },
  {
    path: '/admin',
    name: 'admin',
    component: Admin,
    meta: { requiresAuth: true, layout: 'user' }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: { requiresAuth: true, layout: 'user' }
  },
  {
    path: '/financing',
    name: 'financing',
    component: FinancingStatement,
    meta: { requiresAuth: true, layout: 'user' }
  },
  {
    path: '/financing-view',
    name: 'financing-view',
    component: FinancingStatement,
    meta: { requiresAuth: true, layout: 'user' }
  },
  {
    path: '/party-codes',
    name: 'partyCodes',
    component: PartyCodes,
    meta: { requiresAuth: true, layout: 'user' }
  },
  {
    path: '/results',
    name: 'results',
    component: ResultsPage,
    meta: { requiresAuth: true, layout: 'user' },
    props: true
  },
  {
    path: '/search',
    name: 'search',
    component: SearchPage,
    meta: { requiresAuth: true, layout: 'user' }
  },
  {
    // default/fallback route
    path: '*',
    redirect: '/'
  }
]
