export default defineEventHandler(async (event) => {

  const user = event.context.user

  try {
    const api = apiFetch(user)

    // load all available users for current user
    const limit = 100
    let offset = 0
    let currentUser = {}
    let users = []
    let gotCount = false
    let initialData = {}

    do {
      const response = await api('/v4/user', { query: { limit, offset } })
      gotCount = response?.items?.length
      if (gotCount) {
        offset += limit
        users.push(...response.items)
      }
    } while (gotCount && gotCount === limit)

    // strip user of properties that should not be available in the frontend
    currentUser = users.find((u) => u.login === user.login)
    if (!currentUser.login) {
      throw createError({ statusCode: 400, statusMessage: 'User not found!' })
    }
    delete (currentUser.credentials)

    // Also fetch all basic app data, such as lists (claims-tags, presets?, and such)
    // initialData = await api('/v4/dashboard/initial-data', {});
    initialData = {}

    return {
      user: currentUser,
      ...initialData || {}
    }
  } catch (error) {
    throw createError(error)
  }
})