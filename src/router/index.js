import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/user';
import HomeView from '../views/HomeView.vue';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { isPublic: true } // 标记为公开页面
  },
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
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('../views/orders/CheckoutView.vue')
  },
  {
    path: '/orders',
    name: 'order-management',
    component: () => import('../views/orders/OrderManagementView.vue')
  },
  {
    path: '/orders/:id',
    name: 'order-detail',
    component: () => import('../views/orders/OrderDetailView.vue')
  },
  {
    path: '/deliveries',
    name: 'delivery-management',
    component: () => import('../views/deliveries/DeliveryManagementView.vue')
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const token = userStore.token;

  if (token) {
    if (to.path === '/login') {
      // 如果已登录，访问登录页则重定向到首页
      next({ path: '/' });
    } else {
      // 如果已登录，但没有用户信息，则先获取用户信息
      if (!userStore.userInfo.id) {
        try {
          await userStore.getUserInfo();
          next();
        } catch (error) {
          // 获取用户信息失败（例如token过期），清除token并重定向到登录页
          await userStore.logout();
          next('/login');
        }
      } else {
        next(); // 有用户信息，直接放行
      }
    }
  } else {
    // 未登录
    if (to.meta.isPublic) {
      next(); // 如果是公开页面，直接放行
    } else {
      next('/login'); // 否则全部重定向到登录页
    }
  }
});

export default router;