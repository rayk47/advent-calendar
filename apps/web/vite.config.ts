/// <reference types='vitest' />
import { CommonServerOptions, defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { join } from 'path';

const proxy: CommonServerOptions["proxy"] = process.env.IS_WEB_LOCAL === 'true' ? {
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
  }
} : {};

console.log(`proxy`, proxy);


export default (config: any) => {
  // Load app-level env vars to node-level env vars.
  process.env = { ...loadEnv(config.mode, join(__dirname, '../')) };

  console.log('env', process.env)
  return defineConfig({
    root: __dirname,
    cacheDir: '../../node_modules/.vite/apps/web',

    server: {
      port: 4200,
      host: 'localhost',
      proxy
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

