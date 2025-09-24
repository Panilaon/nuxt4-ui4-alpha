export default defineEventHandler(async (event) => {

  // Protect ONLY API (return on everything not starting with "/api/")
  if (!event.path?.startsWith('/api/')) return

  // Keep API auth open
  if (event.path?.startsWith('/api/auth')) return

  // Keep NUXT dev open
  if (event.path?.startsWith('/api/_nuxt')) return

  // Unsecured endpoints
  const unsecuredEndpoints = [
    '/_nuxt', // Let Nuxt through
    '/api/_auth/session', // Let Nuxt-Auth-Utils through
    '/api/unsecured',
  ]
  if (unsecuredEndpoints.includes(event.path)) return

  // The rest *requires* a session
  try {
    const { user, secure } = await requireUserSession(event)
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'Access denied' })
    }

    // - attach session details to context (simulate old way)
    event.context.user = {
      ...user,
      credentials: { ...secure?.credentials }
    }
  } catch (error) {
    throw createError({ statusCode: 401, statusMessage: 'Access denied' })
  }
})
