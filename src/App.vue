<template>
  <div>
    <!-- Navbar só aparece se não estivermos na página de login -->
    <nav v-if="!isLoginPage" class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div class="container-fluid">
        <router-link class="navbar-brand fw-bold" to="/">Condomínios</router-link>

        <!-- Botão hamburger para mobile -->
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Links -->
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li v-if="auth.usuario?.papel === 'admin'" class="nav-item">
              <router-link class="nav-link" to="/assembleias">Assembleias</router-link>
            </li>
            <li v-if="auth.usuario?.papel === 'admin'" class="nav-item">
              <router-link class="nav-link" to="/condominios">Condomínios</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/enquetes">Enquetes</router-link>
            </li>
            <li v-if="auth.usuario?.papel === 'admin'" class="nav-item">
              <router-link class="nav-link" to="/usuarios">Usuários</router-link>
            </li>
            <li v-if="auth.usuario?.papel === 'admin'" class="nav-item">
              <router-link class="nav-link" to="/unidades">Unidades</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/votos">Votos</router-link>
            </li>
            <li class="nav-item">
              <button class="btn btn-outline-light ms-2" @click="logout">Sair</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Conteúdo das rotas -->
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    const auth = useAuthStore()

    const isLoginPage = computed(() => route.path === '/login')

    const logout = () => {
      auth.logout()
      router.push('/login')
    }

    return { isLoginPage, auth, logout }
  }
})
</script>

<style scoped>
.navbar-nav .nav-link {
  transition: color 0.3s, transform 0.3s;
}
.navbar-nav .nav-link:hover {
  color: #0d6efd;
  transform: scale(1.05);
}
.navbar-brand {
  transition: color 0.3s, text-shadow 0.3s;
}
.navbar-brand:hover {
  color: #0d6efd;
  text-shadow: 0 0 5px #0d6efd88;
}
.collapse.navbar-collapse.show {
  background-color: #343a40;
  border-radius: 0.5rem;
  padding: 0.5rem;
  margin-top: 0.5rem;
}
</style>
