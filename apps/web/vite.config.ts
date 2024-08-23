/// <reference types='vitest' />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { join } from 'path';

export default (config: { mode: string; }) => {
  // Load app-level env vars to node-level env vars.
  process.env = { ...loadEnv(config.mode, join(__dirname, '../')), IS_WEB_LOCAL: process.env.IS_WEB_LOCAL, SUBDOMAIN_NAME: process.env.SUBDOMAIN_NAME, DOMAIN_NAME: process.env.DOMAIN_NAME };

  console.log('Warning the following env properties will be available in the bundle', process.env)
  return defineConfig({
    root: __dirname,
    cacheDir: '../../node_modules/.vite/apps/web',

    server: {
      port: 4200,
      host: 'localhost',
      proxy: process.env.IS_WEB_LOCAL === 'true' ? {
        '/api': {
          target: `https://${process.env.SUBDOMAIN_NAME}.${process.env.DOMAIN_NAME}`, changeOrigin: true, configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Sending Request to the Target:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            });
          },
        },
        '/events': {
          target: `https://${process.env.SUBDOMAIN_NAME}.${process.env.DOMAIN_NAME}`, changeOrigin: true, configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Sending Request to the Target:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            });
          },
        }
      } : {}
    },

    preview: {
      port: 4300,
      host: 'localhost',
    },

    plugins: [react(), nxViteTsPaths()],


    build: {
      outDir: '../../dist/apps/web',
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },

    test: {
      globals: true,
      cache: {
        dir: '../../node_modules/.vitest',
      },
      environment: 'jsdom',
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

      reporters: ['default'],
      coverage: {
        reportsDirectory: '../../coverage/apps/web',
        provider: 'v8',
      },
    },
  });

}

