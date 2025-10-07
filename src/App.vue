<template>
  <div class="d-flex flex-column vh-100">
    <!-- Navbar topo -->
    <nav v-if="showNavbar" class="navbar navbar-expand-lg navbar-light bg-light shadow-sm px-3">
      <span class="navbar-brand fw-bold text-primary">Condomínios</span>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarMenu"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Menu links -->
      <div class="collapse navbar-collapse" id="navbarMenu">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li v-if="isAdmin" class="nav-item">
            <router-link class="nav-link" to="/assembleias">Assembleias</router-link>
          </li>
          <li v-if="isAdmin" class="nav-item">
            <router-link class="nav-link" to="/condominios">Condomínios</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/enquetes">Enquetes</router-link>
          </li>
          <li v-if="isAdmin" class="nav-item">
            <router-link class="nav-link" to="/usuarios">Usuários</router-link>
          </li>
          <li v-if="isAdmin" class="nav-item">
            <router-link class="nav-link" to="/unidades">Unidades</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/votos">Votos</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/avisos">Avisos</router-link>
          </li>
        </ul>
      </div>

      <!-- Dropdown do usuário -->
      <div class="ms-auto d-flex align-items-center" v-if="usuario">
        <div class="dropdown">
          <button
            class="btn btn-outline-primary d-flex align-items-center dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
          >
            <i class="bi bi-person-circle me-2"></i>
            {{ usuario.nome }}
          </button>
          <ul class="dropdown-menu dropdown-menu-end shadow-sm p-2">
            <li class="dropdown-item-text fw-semibold">{{ usuario.nome }}</li>
            <li class="dropdown-item-text text-muted">{{ usuario.email }}</li>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <button class="dropdown-item text-danger fw-bold" @click="logout">Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Conteúdo principal -->
    <main class="flex-grow-1 overflow-auto p-3 bg-light">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../src/stores/auth'

export default defineComponent({
  setup() {
    const auth = useAuthStore()
    const router = useRouter()
    const route = useRoute()

    const usuario = computed(() => auth.usuario)
    const isAdmin = computed(() => usuario.value?.papel === 'admin')
    const showNavbar = computed(() => route.path !== '/login')

    const logout = () => {
      auth.logout()
      router.push('/login')
    }

    return { usuario, isAdmin, showNavbar, logout }
  }
})
</script>

<style scoped>
.navbar {
  border-bottom: 1px solid #e0e0e0;
}

.nav-link {
  color: #555;
  font-weight: 500;
  transition: all 0.2s;
}
.nav-link:hover {
  color: #0d6efd;
  text-decoration: none;
}

.dropdown-toggle::after {
  display: none;
}

.dropdown-menu {
  border-radius: 0.35rem;
  min-width: 200px;
}

main {
  background-color: #f8f9fa;
}
</style>
