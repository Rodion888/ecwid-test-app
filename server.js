import express from 'express';
import fs from 'node:fs';
import path from 'node:path';

import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function initServer() {
  const app = express();

  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  app.use(vite.middlewares);

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl;

      let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');

      template = await vite.transformIndexHtml(url, template);

      const { render } = await vite.ssrLoadModule('/src/entry-server.ts');

      const { html: appHtml, state } = await render(url);

      const html = template
        .replace('<!--ssr-outlet-->', appHtml)
        .replace(
          '<!--pinia-state-->',
          `<script>window.__PINIA_STATE__=${JSON.stringify(state)}</script>`
        );

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      res.status(500).end(e.stack);
    }
  });

  return app;
}

initServer().then(app => app.listen(3000, () => {}));
