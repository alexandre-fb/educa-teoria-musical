<script setup>
import { useAuthStore } from '@/stores/auth'
import { useLayoutStore } from '@/stores/layout'

const authStore = useAuthStore()
const layoutStore = useLayoutStore()
</script>

<template>
  <header class="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
    <button
      type="button"
      class="p-2 rounded-md text-gray-600 hover:bg-gray-100 md:hidden"
      aria-label="Alternar menu"
      @click="layoutStore.toggleSidebar()"
    >
      <span class="text-xl">☰</span>
    </button>
    <span class="font-semibold text-gray-800">Educa Teoria Musical</span>
    <div class="flex items-center gap-2">
      <span
        v-if="authStore.isLoggedIn"
        class="text-sm text-gray-600"
      >
        Premium
      </span>
      <button
        v-else
        type="button"
        class="text-sm text-indigo-600 hover:underline"
      >
        Entrar
      </button>
    </div>
  </header>
</template>
