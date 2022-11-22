import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'


export default route(function ({ store }/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE),
    routes,
    linkActiveClass: 'current',
    linkExactActiveClass: 'current'
  })

  Router.beforeEach((to, from, next) => {
    const requireAuth = to.meta.auth
    const isAuthorized = store.getters['currentUser/getAuth']
    if (requireAuth && !isAuthorized) {
      return next('/login?message=notautorized')
    } else {
      next()
    }
  })

  return Router
})
