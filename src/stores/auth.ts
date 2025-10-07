import { defineStore } from 'pinia'

interface Usuario {
  id: string
  nome: string
  email: string
  papel: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '',
    usuario: null as Usuario | null,
  }),
  actions: {
    login(usuario: Usuario, token: string) {
      this.usuario = usuario
      this.token = token
    },
    logout() {
      this.usuario = null
      this.token = ''
    }
  },
  persist: true // <-- Salva automaticamente no localStorage
})
