export default {
  mode: "spa",

  head: {
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || "",
      },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  loading: { color: "#1890ff" },

  css: ["ant-design-vue/dist/antd.css", "@/assets/css/tailwind.css"],

  plugins: [
    "@/plugins/antd-ui",
    { src: "@/plugins/google.js", mode: "client" },
    "@/plugins/axios",
    { src: "@/plugins/iconify.client.js", mode: "client" },
  ],

  buildModules: ["@nuxtjs/composition-api/module"],

  modules: [
    "@nuxtjs/axios",
    "@nuxtjs/dotenv",
  ],

  axios: {},

  build: {
    transpile: [/unplugin-vue2-script-setup/],

    // ✅ Thêm PostCSS plugin cho Tailwind
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    },

    extend(config, ctx) {},
  },
};
