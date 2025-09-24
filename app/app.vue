<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>

<script setup>
const { isLoggedIn, isReady, fetchUserData, logout } = useUser()

// Fetch a logged in user details
if (isLoggedIn.value && !isReady.value) {
  try {
    callOnce(async () => await fetchUserData())
  } catch (_) {
    // useUserSession().clear()
  }
  if (!isReady) {
    // useUserSession().clear()
    await logout()
  }
}
</script> 
