import './styles/main.css';

import { createSSRApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router';
import { routes } from './router/routes';

import App from './App.vue';

export function createApp(isSSR = false) {
  const app = createSSRApp(App);
  const pinia = createPinia();

  const router = createRouter({
    history: isSSR ? createMemoryHistory() : createWebHistory(),
    routes,
  });

  app.use(pinia);
  app.use(router);

  return { app, router, pinia };
}
