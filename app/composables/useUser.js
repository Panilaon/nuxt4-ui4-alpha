export const useUser = () => {

  const {
    loggedIn,
    // user: sessionUser,
  } = useUserSession()

  // State
  const loading = useState('user.loading', () => false)
  const error = useState('user.error', () => null)
  const errorMessage = computed(() => error.value ? (error.value.response?._data?.statusMessage ?? error.value.statusMessage ?? 'unknown error') : null)

  // Real logged in User
  const user = useState('user.details', () => null)
  const isReady = computed(() => loggedIn.value && !!user.value)

  // Roles
  const isAdmin = computed(() => user.value?.roles?.includes('admin'))
  const hasRole = computed((role) => user.value?.roles?.includes(role))

  /**
   * Clear user details
   */
  function $reset() {
    user.value = null
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
    // 2. Clear session state and user data
    await useUserSession().clear()
    $reset()
    // 3. Navigate somewhere?
    if (redirect) {
      navigateTo(url)
    }
  }

  /**
   * Fetch Logged User Data
   */
  async function fetchUserData() {
    try {
      loading.value = true
      error.value = null

      const appData = await $fetch('/api/app-data', {
        headers: import.meta.server ? useRequestHeaders(['cookie']) : undefined
      })

      // set user
      user.value = appData?.user || {}
    } catch (err) {
      user.value = {}
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
  watch(loggedIn, async (newValue) => {
    if (!newValue) {
      $reset()
    }
  }, { immediate: false })

  return {
    loading,
    error,
    errorMessage,
    user,
    isLoggedIn: loggedIn,
    isReady,
    isAdmin,
    login,
    loginByKey,
    logout,
    fetchUserData,
  }
}
