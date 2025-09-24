export default defineEventHandler(async (event) => {
  // Get request body
  const body = await readBody(event)
  if (!body) {
    return createError({
      statusCode: 400,
      statusMessage: "Request body is empty or undefined",
    })
  }

  // Check so that username/email and password are defined
  const api = apiFetch()
  const runtimeConfig = useRuntimeConfig()
  const { username, email, password } = body
  let data

  try {
    // Special admin headers when logging in
    // todo: Rewrite API so this is not nessessary?
    const encodedCredentials = btoa(`${runtimeConfig.apiDashboardKey}:${runtimeConfig.apiDashboardSecret}`);
    data = await api('/v4/dashboard/login', {
      method: 'POST',
      body: {
        login: username ? username : email,
        password: password,
        production_unit: 'alfredssons'
      },
      headers: {
        Authorization: `Basic ${encodedCredentials}`
      }
    })
  } catch (error) {
    console.warn(error)
    return createError({
      statusCode: 400,
      statusMessage: "Invalid login credentials",
    });
  }

  // Set user session
  await setUserSession(event, {
    // Public data accessible on client
    user: Object.assign({}, data.user),
    loggedInAt: new Date(),
    secure: {
      // Private data accessible only on server/routes
      credentials: { ...data.apikeys[0] }
    },
  })

  // Return success
  return { success: true }
})