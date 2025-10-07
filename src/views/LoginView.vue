<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label>Email:</label>
        <input v-model="email" type="email" required />
      </div>
      <div>
        <label>Senha:</label>
        <input v-model="senha" type="password" required />
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Entrando...' : 'Login' }}
      </button>
      <p v-if="erro" class="error">{{ erro }}</p>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth' // importa a store
import api from '../services/api'

export default defineComponent({
  setup() {
    const router = useRouter()
    const auth = useAuthStore()

    const email = ref('')
    const senha = ref('')
    const loading = ref(false)
    const erro = ref('')

    const handleLogin = async () => {
      erro.value = ''
      loading.value = true

      try {
        const res = await api.post('/auth/login', {
          email: email.value,
          senha: senha.value
        })

        const { token, usuario } = res.data

        // Atualiza store
        auth.token = token
        auth.usuario = usuario
        auth.erro = ''
        auth.loading = false

        // Persiste manualmente também (opcional)
        localStorage.setItem('auth.token', token)
        localStorage.setItem('auth.usuario', JSON.stringify(usuario))
        localStorage.setItem('auth.papel', usuario.papel)

        // Redireciona conforme papel
        const redirectMap: Record<string, string> = {
          admin: '/assembleias',
          usuario: '/votos'
        }
        router.push(redirectMap[usuario.papel] || '/login')
      } catch (err: any) {
        erro.value = err.response?.data?.message || 'Erro ao tentar logar. Tente novamente.'
        auth.erro = erro.value
      } finally {
        loading.value = false
      }
    }

    return { email, senha, handleLogin, loading, erro }
  }
})
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}
input {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.25rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}
button {
  width: 100%;
  padding: 0.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}
.error {
  color: red;
  margin-top: 0.5rem;
}
</style>
