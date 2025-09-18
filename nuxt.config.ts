// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  experimental: {
    buildCache: true
  },
  modules: ['@nuxt/ui', 'nuxt-auth-utils', '@nuxtjs/eslint-module'],
  css: [
    '~/assets/css/main.css'
  ]
})