import { renderToString } from 'vue/server-renderer';
import { createApp } from './app';

export async function render(url: string) {
  const { app, router, pinia } = createApp(true);

  await router.push(url);
  await router.isReady();

  const html = await renderToString(app);
  const state = pinia.state.value;

  return { html, state };
}
