import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig(() => {
  return {
    resolve: {
      alias: {
        crypto: 'node:crypto', // This ensures the usage of Node.js crypto module
      },
    },
    build: {
      target: 'esnext'
    },
    plugins: [
      nodePolyfills({
        include: ['path', 'buffer'], // Remove 'crypto' from here
      }),
      remixCloudflareDevProxy(),
      remix({
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
        },
      }),
      tsconfigPaths(),
    ],
  }
});
