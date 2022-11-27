import { createRouter, createWebHistory } from 'vue-router'
import Auth from '@/pages/Auth.vue'
import Home from '@/pages/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/auth',
      name: 'Auth',
      component: Auth,
    },
    {
      path: '/admin',
      name: 'AdminHome',
      component: () => import('@/pages/Admin/AdminWrapper.vue'),
    },
    {
      path: '/admin/:link',
      name: 'Admin',
      component: () => import('@/pages/Admin/AdminWrapper.vue'),
    },
    {
      path: '/admin/product/:link',
      name: 'AdminCreateProducts',
      component: () => import('@/pages/Admin/AdminWrapper.vue'),
    },

    {
      path: '/:id',
      name: 'CategoryProducts',
      component: () => import('@/pages/CategoryProducts.vue'),
    },
  ],
})

export default router
