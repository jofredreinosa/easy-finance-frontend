import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: () => import('@/views/dashboard/Index'),
      children: [
        // Dashboard
        {
          name: 'Dashboard',
          path: '',
          component: () => import('@/views/dashboard/Dashboard'),
        },
        // Pages
        {
          name: 'Tipos de Transacción',
          path: 'transactions/types',
          component: () => import('@/views/transactions/transactionTypes/transactionTypes-list'),
        },
        {
          name: 'Movimientos',
          path: 'transactions/create',
          component: () => import('@/views/transactions/movements/movement-list'),
        },
      ],
    },
  ],
})
