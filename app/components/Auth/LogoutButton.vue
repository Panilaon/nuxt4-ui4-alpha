<script setup>
const { logout } = useUser()

const validateLogout = async () => {
  // const confirmed = confirm('Do you want to logout?')
  // if (!confirmed) {
  //   return
  // }
  await logout({ redirect: true })
}
</script>

<template>
  <UButton icon="i-lucide-log-out" size="sm" color="error" variant="soft" label="Logout" :trailing="true"
    @click="validateLogout" />
</template>