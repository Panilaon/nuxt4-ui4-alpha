export const useUser = () => {

  const {
    loggedIn,
    user: sessionUser,
  } = useUserSession()

  // State
  const loading = useState('user.loading', () => false)
  const error = useState('user.error', () => null)
  const errorMessage = computed(() => error.value ? (error.value.response?._data?.statusMessage ?? error.value.statusMessage ?? 'unknown error') : null)

  // Real logged in User
  const logged = useState('user.logged', () => null)
  const isReady = computed(() => loggedIn.value && !!logged.value)

  // List of known/all users (nothing here yet - is it even possible since we can change?)
  const users = useState('user.users', () => [])
  const getUsers = computed(() => (users.value ?? []))
  const getUserById = (id) => users.value.find((x) => x.id === id) ?? null

  // Roles
  const isAdmin = computed(() => logged.value?.roles?.includes('admin'))
  const hasRole = computed((role) => logged.value?.roles?.includes(role))

  // Misc Lists (linked to stores)
  const claimTags = useState('claim.tags', () => [])
  const claimReasons = useState('claim.reasons', () => [])

  // todo: Move to helper?
  const presets = useState('lists.presets', () => [])
  const getPresets = computed(() => presets.value)
  const getPresetById = computed((id) => presets.value.find((x) => x.id === id))

  /**
   * Clear user and lists
   */
  function $reset() {
    logged.value = null
    users.value = []
    presets.value = [];
    claimTags.value = []
    claimReasons.value = []
  }

  /**
   * Attempt to log in and fetch application data on success.
   * 
   * @param {string} username - The user's username.
   * @param {string} password - The user's password.
   * @returns {Promise} - A promise that resolves when navigation is complete.
   */
  async function login({ username, password } = {}) {
    try {
      // 1. Try to login
      await $fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { username, password },
      })

      // 2. Refresh session state + fetch user data
      await useUserSession().fetch()
      await fetchUserData()

    } catch (e) {
      error.value = e
      throw e
    }
  }

  async function loginByKey(key) {
    try {
      // 1. Try to login by key
      await $fetch(`/api/auth/login-by-key`, {
        method: "POST",
        body: { key }
      })

      // 2. Refresh session state + fetch user data
      await useUserSession().fetch()
      await fetchUserData()
    } catch (e) {
      error.value = e
      throw e
    }
  }

  /**
   * Logout
   * - clear user and redirect
   * 
   * @returns 
   */
  async function logout({ redirect = false, url = '/' } = {}) {
    // 1. Send login request
    await $fetch('/api/auth/logout')
    // 2. Refresh session state
    await useUserSession().fetch()
    // 3. Reset user data
    $reset()
    // 4. Navigate somewhere
    if (redirect) {
      navigateTo(url)
    }
  }

  /**
   * Fetch Logged User Data
   */
  async function fetchUserData({ server = false } = {}) {
    try {
      loading.value = true
      error.value = null

      const fetchOptions = server ? { headers: useRequestHeaders(['cookie']) } : {}

      const [appData] = await Promise.all([
        server
          ? useFetch('/api/app-data', fetchOptions).then(res => res.data.value)
          : $fetch('/api/app-data'),
      ])
      const { user, users, ...extraData } = appData ?? {}

      // set user details
      logged.value = user
      users.value = users
      // misc app lists
      presets.value = extraData.presets ?? []
      claimTags.value = extraData.claim?.tags ?? []
      claimReasons.value = extraData.claim?.reasons ?? []
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to load user data')
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Watcher for logged-in state (with immediate trigger)
   * - Fetches user data when loggedIn state changes to true
   * - Resets user data when loggedIn state changes to false
   */
  watch(loggedIn, async (isLoggedIn, oldValue) => {
    if (isLoggedIn) {
      if (oldValue !== isLoggedIn) {
        // await fetchUserData()
        // done in app.vue or when logging in
      }
    } else {
      $reset()
    }
  }, { immediate: false })

  return {
    error,
    errorMessage,
    loading,
    logged, // Current user
    sessionUser,
    isLoggedIn: loggedIn,
    isReady,
    isAdmin,
    login,
    loginByKey,
    logout,
    fetchUserData,
    // user lists
    users,
    getUsers,
    getUserById,
    getPresets,
    getPresetById,
    // getClaimTags,
    // getClaimTagById,
    // getClaimReasons,
    // getClaimReasonById,
  }
}
