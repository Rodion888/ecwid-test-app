import { createApp } from './app';

import type { StateTree } from 'pinia';

const { app, router, pinia } = createApp();

const windowWithPinia = window as Window & {
  __PINIA_STATE__?: Record<string, StateTree>;
};

if (windowWithPinia.__PINIA_STATE__) {
  pinia.state.value = windowWithPinia.__PINIA_STATE__;
}

router.isReady().then(() => {
  app.mount('#app', true);
});
