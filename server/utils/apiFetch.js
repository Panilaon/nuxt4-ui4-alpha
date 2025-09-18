export const apiFetch = (user = null) => {
  const runtimeConfig = useRuntimeConfig()

  const api = $fetch.create({
    baseURL: `${runtimeConfig.apiHost}${runtimeConfig.apiPath}`,

    onRequest({ request, options, error }) {
      if (user) {
        // add authorization header
        const encodedCredentials = btoa(`${user.credentials.id}:${user.credentials.secret}`);
        options.headers.set('Authorization', `Basic ${encodedCredentials}`)
        // post json header
        if (['POST', 'PUT', 'DELETE'].includes(options.method)) {
          options.headers['Content-Type'] = 'application/json'
        }
      }
    },
  })

  return api
}