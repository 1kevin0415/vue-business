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
    component: () => import('../views/products/EditProductView.vue')
  },
  {
    path: '/customers',
    name: 'customer-management',
    component: () => import('../views/customers/CustomerManagementView.vue')
  },
  // --- 以下是为您新增的路由 ---
  {
    path: '/checkout',
    name: 'checkout',
    // 这会加载我们刚刚创建的 CheckoutView.vue 文件
    component: () => import('../views/orders/CheckoutView.vue')
  },
  {
  path: '/orders',
  name: 'order-management',
  component: () => import('../views/orders/OrderManagementView.vue')
  },
  {
  path: '/orders/:id', // :id 是一个动态参数
  name: 'order-detail',
  component: () => import('../views/orders/OrderDetailView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
