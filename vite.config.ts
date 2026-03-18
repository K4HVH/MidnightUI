import { defineConfig, loadEnv } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';

export default defineConfig(({ mode }) => {
  // Load ALL env vars from .env (empty prefix bypasses VITE_ filter)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      devtools(),
      solidPlugin(),
      {
        name: 'runtime-config',
        apply: 'serve', // Dev server only; production uses serve.ts injection
        transformIndexHtml(html) {
          const apiBaseUrl = env.API_BASE_URL;
          if (apiBaseUrl) {
            const script = `<script>window.__RUNTIME_CONFIG__ = ${JSON.stringify({ apiBaseUrl })};</script>`;
            return html.replace('</head>', `${script}</head>`);
          }
          return html;
        },
      },
    ],
    root: 'src',
    publicDir: '../public',
    server: {
      port: 3000,
    },
    build: {
      target: 'esnext',
      outDir: '../dist',
      emptyOutDir: true,
    },
  };
});
