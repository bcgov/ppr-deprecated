import About from '@/views/About.vue'
import Home from '@/views/Home.vue'
import SearchPage from '@/views/SearchPage.vue'
import ResultsPage from '@/views/ResultsPage.vue'
import FinancingStatement from '@/views/FinancingStatementView.vue'

// TODO restore lazy load of components. Important when the app gets larger to reduce size of initial js files.
// Disable the lazy load approach until we can determine the TS return type from something like
// () => import(/* webpackChunkName: "about" */ '../views/Home.vue')

export default [
  {
    path: '/',
    name: 'home',
    component: Home, //() => import(/* webpackChunkName: "about" */ '../views/Home.vue'),
    meta: { layout: 'public' }
  },
  {
    path: '/results',
    name: 'results',
    component: ResultsPage,
    meta: { requiresAuth: true, layout: 'user' },
    props: true
  },
  {
    path: '/financing',
    name: 'financing',
    component: FinancingStatement,
    meta: { requiresAuth: true, layout: 'user' }
  },
  {
    path: '/search',
    name: 'search',
    component: SearchPage,
    meta: { requiresAuth: true, layout: 'user' }
  },
  {
    path: '/about',
    name: 'about',
    component: About, //() => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: { layout: 'public' }
  },
  {
    // default/fallback route
    path: '*',
    redirect: '/'
  }
]
