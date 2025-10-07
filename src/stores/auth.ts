import { defineStore } from 'pinia'
import axios from 'axios'

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
    loading: false,
    erro: ''
  }),
  actions: {
    login(usuario: Usuario, token: string) {
      this.usuario = usuario
      this.token = token
      localStorage.setItem('auth.token', token)
      localStorage.setItem('auth.usuario', JSON.stringify(usuario))
    },
    logout() {
      this.usuario = null
      this.token = ''
      localStorage.removeItem('auth.token')
      localStorage.removeItem('auth.usuario')
    },
    async fetchUsuario() {
      if (!this.token) return
      try {
        const { data } = await axios.get('/api/usuario', {
          headers: { Authorization: `Bearer ${this.token}` }
        })
        this.usuario = data
      } catch (err) {
        console.error('Erro ao carregar usuário', err)
        this.logout()
      }
    }
  },
  persist: true
})
