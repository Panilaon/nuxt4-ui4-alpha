<script setup>
const runtimeConfig = useRuntimeConfig();
const logoUrl = runtimeConfig.public?.APP_LOGO?.toString()
</script>

<template>
  <!-- Check if there's a logo URL, use the image - perhaps limit to h-6? -->
  <img v-if="logoUrl" :src="logoUrl" class="object-contain h-[1.2em]" alt="Logo" sune="123" nisse="eed">

  <!-- If no logo URL, display default logotype with text -->
  <div v-else class="flex items-center gap-2">
    <!-- Use relative sizing for SVG to always be slightly larger than text -->
    <AppLogotype class="w-[1.2em] h-[1.2em]" />
    <span>Pala Inc.</span>
  </div>
</template>