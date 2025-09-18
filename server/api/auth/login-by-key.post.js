export default defineEventHandler(async (event) => {
  
  try {
    const { key } = await readBody(event)
    const runtimeConfig = useRuntimeConfig()
    const api = apiFetch()

    let data

    try {
      // remove any current token
      // deleteCookie(event, runtimeConfig.public.tokenName) // todo ? HOW / WHEN WHAT?
      await clearUserSession(event);

      // decrypt key (somehow - not set in stone)
      const decryptedKey = JSON.parse(decrypt(key))

      // for test we use username/password in key (danger)
      const encodedCredentials = btoa(`${runtimeConfig.apiDashboardKey}:${runtimeConfig.apiDashboardSecret}`)
      data = await api('/v4/dashboard/login', {
        method: 'POST',
        body: {
          login: decryptedKey?.username,
          password: decryptedKey?.password,
          production_unit: 'alfredssons'
        },
        headers: {
          Authorization: `Basic ${encodedCredentials}`
        }
      })
    } catch (e) {
      return createError({
        statusCode: 400,
        statusMessage: "Invalid login-key credentials",
      })
      // return setResponseStatus(event, 500, e.data?.message ?? e.statusMessage)
    }

    // User has successfully logged in
    // - accumulate some data - what we do not know yet
    // - only critical is "user.credentials" which is used in server auth middleware
    
    const user = {
      id: data.user.id,
      login: data.user.login,
      account: data.user.account,
      roles: data.user.roles,
      name: data.user.name,
      company: data.user.company,
      email: data.user.email,
    }

    const credentials = { ...data.apikeys[0] }

    // Set user session
    await setUserSession(event, {
      // Public data accessible on client
      user, // : Object.assign({}, user),
      loggedInAt: new Date(),
      secure: {
        credentials
      },
    })

    return { ok: true }

  } catch (error) {
    console.error(error);
    return createError({
      statusCode: 400,
      statusMessage: "Invalid login-key credentials",
    })
    // return setResponseStatus(event, 500, 'Server error')
  }
})