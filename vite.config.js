import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
import vuetify from "vite-plugin-vuetify";

import { prismjsPlugin } from "vite-plugin-prismjs";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
    prismjsPlugin({
      languages: "all",
      plugins: [
        "line-numbers",
        "toolbar",
        "command-line",
        "treeview",
        "keep-markup",
        "diff-highlight",
        "normalize-whitespace",
      ],
      css: true,
      theme: "",
    }),
  ],
  server: {
    watch: {
      usePolling: true,
    },
  },
});
