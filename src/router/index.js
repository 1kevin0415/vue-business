import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/products',
    name: 'product-management',
    component: () => import('../views/products/ProductManagementView.vue')
  },
  {
    path: '/products/add',
    name: 'add-product',
    component: () => import('../views/products/AddProductView.vue')
  },
  {
    path: '/products/edit/:id',
    name: 'edit-product',
    component: () => import('../views/products/EditProductView.vue') // 修正路径
  },
  {
    path: '/customers',
    name: 'customer-management',
    component: () => import('../views/customers/CustomerManagementView.vue') // 修正路径
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
