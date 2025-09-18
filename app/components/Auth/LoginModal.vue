<script setup>
const props = defineProps({
  redirectUrl: {
    type: String,
    default: '/app'
  }
})

const emit = defineEmits(['login', 'close'])

// Modal open state
const isOpen = ref(false)

// User
const { login, loading, errorMessage } = useUser()

// login form
const state = ref({
  username: '',
  password: '',
})

// password show/hide text eye icons
const showPassword = ref(false)
const pwFieldType = computed(() => showPassword.value ? 'text' : 'password')
const pwIcon = computed(() => showPassword.value ? 'i-heroicons-eye-slash' : 'i-heroicons-eye')

const onSubmit = async () => {
  try {
    await login({ username: state.value.username, password: state.value.password })
    emit('login')

    navigateTo(props.redirectUrl)
    // modal.close() // needed?
  } catch (err) { }
}
</script>

<template>
  <UModal v-model="isOpen" :ui="{ background: 'bg-slate-100' }">
    <UButton label="Login" color="neutral" variant="subtle" />

    <template #body>
      <!-- logo -->
      <div class="w-auto grid items-center justify-center px-5 pt-10 pb-6">
        <div class="flex justify-center">
          <AppLogo class="text-3xl" />
        </div>
        <div class="mt-3 flex justify-center">
          <p class="font-medium text-xl">Login to your Account</p>
        </div>
        <div class="mt-2 flex justify-center">
          <p class="text-gray-700">Please enter your credentials to continue.</p>
        </div>
      </div>

      <UForm :state="state" @submit="onSubmit">
        <div class="p-4">

          <!-- form: username -->
          <UFormField label="Username" name="username">
            <UInput v-model="state.username" type="text" size="xl" icon="i-heroicons-user-circle-solid" />
          </UFormField>

          <!-- form: password with eye -->
          <UFormField label="Password" name="password" class="mt-4">
            <UInput v-model="state.password" size="xl" icon="i-heroicons-lock-closed" :type="pwFieldType"
              :ui="{ icon: { trailing: { pointer: '' } } }">
              <template #trailing>
                <UButton square color="gray" variant="link" :padded="false" :icon="pwIcon"
                  @click="showPassword = !showPassword" />
              </template>
            </UInput>
          </UFormField>

          <!-- error message if any -->
          <div v-show="errorMessage" class="mt-3 text-red-500">
            {{ errorMessage }}
          </div>

          <!-- submit button -->
          <div class="text-right mt-6 mb-5">
            <UButton square label="Login" color="black" variant="solid" type="submit" size="xl" block :loading="loading"
              class="shadow-xl" />
          </div>

        </div>
      </UForm>
    </template>
  </UModal>
</template>
