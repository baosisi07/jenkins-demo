import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 9901,
    proxy: {
      '/api_base': {
        //target: 'http://218.23.56.220:9902/YunWeiNew/app',
	  target: 'http://localhost:9902/YunWeiNew/app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api_base/, ''),
      },
      '/img_pre': {
        //target: 'http://218.23.56.220:9902/data',
	  target: 'http://localhost:9902/data',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/img_pre/, ''),
      },
    },
  },
});
