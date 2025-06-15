import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'catalog',
      component: () => import('../views/CatalogView.vue'),
    },
    {
      path: '/category/:id',
      name: 'category',
      component: () => import('../views/CategoryView.vue'),
      props: true
    },
    {
      path: '/product/:id',
      name: 'product',
      component: () => import('../views/ProductView.vue'),
      props: true
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/CartView.vue'),
    },
  ],
});

export default router;
