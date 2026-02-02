<script setup>
import { useAuthStore } from '@/stores/auth'
import { useLayoutStore } from '@/stores/layout'
import AppHeader from '@/components/AppHeader.vue'
import PianoWithSound from '@/components/piano/PianoWithSound.vue'

// Stores como única fonte de verdade; componentes só leem e disparam ações
const authStore = useAuthStore()
const layoutStore = useLayoutStore()
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <main
      class="flex-1 p-4 md:p-6"
      :class="{ 'md:ml-64': layoutStore.sidebarOpen }"
    >
      <!-- Conteúdo principal: visitante e premium acessam o mesmo conteúdo -->
      <div class="max-w-4xl mx-auto">
        <h1 class="text-2xl font-semibold text-gray-800 mb-2">
          Educa Teoria Musical
        </h1>
        <p class="text-gray-600 mb-6">
          {{ authStore.isLoggedIn ? 'Olá, você está logado.' : 'Conteúdo disponível para todos. Faça login para salvar seu progresso.' }}
        </p>
        <!-- Piano com som (Fase 3): integração via PianoWithSound -->
        <section class="mb-8">
          <h2 class="text-lg font-medium text-gray-700 mb-2">Piano com som</h2>
          <PianoWithSound />
        </section>
      </div>
    </main>
  </div>
</template>
