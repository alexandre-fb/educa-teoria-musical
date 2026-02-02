import { defineStore } from 'pinia'

/**
 * useAuthStore — autenticação e tipo de usuário
 *
 * Regras .cursorrules:
 * - Visitante: não logado, sem persistência, vê anúncios
 * - Premium: logado, sem anúncios, dados no backend
 * - Nenhum dado em localStorage; persistência só via backend (futuro Supabase)
 */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    /** null = visitante, objeto = usuário logado */
    user: null,
    /** true se plano pago (dados persistidos, sem anúncios) */
    isPremium: false,
    loading: false,
    error: null,
  }),

  getters: {
    isLoggedIn: (state) => state.user !== null,
    /** Para decisões de UI: mostrar anúncios só para não premium */
    showAds: (state) => !state.isPremium,
  },

  actions: {
    /** Limpa erro (ex.: após exibir mensagem ao usuário) */
    clearError() {
      this.error = null
    },

    /**
     * Placeholder para login futuro (Supabase).
     * Por ora só limpa estado; evita duplicar lógica quando integrar.
     */
    async login(/* email, password */) {
      this.loading = true
      this.error = null
      try {
        // TODO: integrar Supabase auth
        this.user = null
        this.isPremium = false
      } catch (e) {
        this.error = e.message ?? 'Erro ao entrar'
        throw e
      } finally {
        this.loading = false
      }
    },

    /** Logout: volta ao estado visitante (sem persistência) */
    logout() {
      this.user = null
      this.isPremium = false
      this.error = null
    },
  },
})
