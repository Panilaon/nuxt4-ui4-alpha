<template>
  <AuthLoginModal />
  <pre>{{ isLoggedIn }}
{{ user }}</pre>
  <AuthLogoutButton />
</template>

<script setup>
const { isLoggedIn, user, isReady, fetchUserData, logout } = useUser()
</script>