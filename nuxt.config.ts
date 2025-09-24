// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  experimental: {
    buildCache: true
  },
  modules: ['@nuxt/ui', 'nuxt-auth-utils'],
  css: [
    '~/assets/css/main.css'
  ],
  runtimeConfig: {
    public: {
      apiPath: '/api',
      NODE_ENV: process.env.NODE_ENV || 'development',
      APP_LOGO: process.env.NUXP_PUBLIC_APP_LOGO,
      productThumbnailBase: process.env.PUBLIC_PRODUCT_THUMBNAIL_BASEURL,
    },
    auth: {
      secret: process.env.NUXT_AUTH_SECRET || 'default-32-char-secret-for-developer',
      session: {
        name: 'nuxt-session',
        maxAge: 60 * 60 * 24 // 1 day
      }
    },
    apiHost: process.env.API_HOST,
    apiPath: process.env.API_PATH,
    apiDashboardKey: process.env.API_DASHBOARD_KEY,
    apiDashboardSecret: process.env.API_DASHBOARD_SECRET,
    tokenSecret: process.env.TOKEN_SECRET,
    tokenExpiration: process.env.TOKEN_EXPIRATION,
    loginKeySecret: process.env.LOGIN_KEY_SECRET,
    // redisHost: process.env.REDIS_HOST || '127.0.0.1',
    // redisPort: process.env.REDIS_PORT || '6379',
    // redisPassword: process.env.REDIS_PASSWORD || '',
  },

})