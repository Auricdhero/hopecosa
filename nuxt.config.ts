// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  ssr: false,

  app: {
    baseURL:
      process.env.NODE_ENV === "production" ? "/student-association-app/" : "/",
    buildAssetsDir: "assets",
  },

  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/supabase"],

  supabase: {
    redirect: false,
    redirectOptions: {
      login: "/auth/login",
      callback: "/auth/confirm",
      exclude: ["/", "/auth/*"],
    },
  },

  css: ["~/assets/css/main.css"],

  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    },
  },
});
