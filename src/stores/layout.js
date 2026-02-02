import { defineStore } from 'pinia'

/**
 * useLayoutStore — estado da interface (menu, sidebar, etc.)
 *
 * Centraliza estado de UI para evitar duplicação entre componentes
 * e manter uma única fonte de verdade (regra Pinia).
 */
export const useLayoutStore = defineStore('layout', {
  state: () => ({
    /** Sidebar/navegação lateral aberta ou fechada */
    sidebarOpen: true,
  }),

  actions: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },
    setSidebarOpen(open) {
      this.sidebarOpen = open
    },
  },
})
