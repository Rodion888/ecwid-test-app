import type { RouteRecordRaw } from 'vue-router';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'catalog',
    component: () => import('../views/CatalogView.vue'),
  },
  {
    path: '/category/:id',
    name: 'category',
    component: () => import('../views/CategoryView.vue'),
  },
  {
    path: '/product/:id',
    name: 'product',
    component: () => import('../views/ProductView.vue'),
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('../views/CartView.vue'),
  },
];
