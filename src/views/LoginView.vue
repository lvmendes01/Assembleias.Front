<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-bold text-center mb-6 text-gray-800">Login do Sistema</h2>

      <form @submit.prevent="login">
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">E-mail</label>
          <input
            v-model="email"
            type="email"
            class="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="seu@email.com"
            required
          />
        </div>

        <div class="mb-6">
          <label class="block text-gray-700 mb-2">Senha</label>
          <input
            v-model="senha"
            type="password"
            class="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="********"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
          :disabled="loading"
        >
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>

        <p v-if="erro" class="text-red-500 text-center mt-4">{{ erro }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/api'

const email = ref('')
const senha = ref('')
const erro = ref('')
const loading = ref(false)
const router = useRouter()

const login = async () => {
  erro.value = ''
  loading.value = true
  try {
    const response = await api.post('/auth/login', {
      email: email.value,
      senha: senha.value
    })

    const { token, usuario } = response.data

    // ✅ Guarda no localStorage
    localStorage.setItem('token', token)
    localStorage.setItem('usuario', JSON.stringify(usuario))

    // ✅ Redireciona conforme o papel
    switch (usuario.papel?.toLowerCase()) {
      case 'admin':
        router.push('/usuarios')
        break
      case 'sindico':
        router.push('/assembleias')
        break
      case 'morador':
        router.push('/votos')
        break
      default:
        router.push('/login')
        break
    }

  } catch (err) {
    console.error(err)
    erro.value = 'E-mail ou senha incorretos.'
  } finally {
    loading.value = false
  }
}
</script>
