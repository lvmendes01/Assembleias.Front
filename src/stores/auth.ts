import { defineStore } from 'pinia'
import api from '../services/api'

interface Usuario {
  id: string
  nome: string
  email: string
  papel: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '' as string,
    usuario: null as Usuario | null,
    loading: false,
    erro: ''
  }),
  actions: {
    async login(email: string, senha: string) {
      this.loading = true
      this.erro = ''
      try {
        const { data } = await api.post('/auth/login', { email, senha })
        this.token = data.token
        this.usuario = data.usuario
      } catch (err: any) {
        console.error(err)
        this.erro = 'E-mail ou senha incorretos.'
      } finally {
        this.loading = false
      }
    },
    logout() {
      this.token = ''
      this.usuario = null
    }
  },
  persist: true
})
