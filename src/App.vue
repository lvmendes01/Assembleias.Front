<template>
  <div class="d-flex flex-column vh-100">
    <!-- Navbar topo -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm px-3">
      <span class="navbar-brand fw-bold text-primary">Condomínios</span>

      <!-- Toggle para mobile -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarMenu"
        aria-controls="navbarMenu"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Menu links -->
      <div class="collapse navbar-collapse" id="navbarMenu">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li v-if="isAdmin" class="nav-item">
            <router-link class="nav-link d-flex align-items-center" to="/assembleias">
              <i class="bi bi-file-text me-1"></i> Assembleias
            </router-link>
          </li>
          <li v-if="isAdmin" class="nav-item">
            <router-link class="nav-link d-flex align-items-center" to="/condominios">
              <i class="bi bi-building me-1"></i> Condomínios
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link d-flex align-items-center" to="/enquetes">
              <i class="bi bi-card-checklist me-1"></i> Enquetes
            </router-link>
          </li>
          <li v-if="isAdmin" class="nav-item">
            <router-link class="nav-link d-flex align-items-center" to="/usuarios">
              <i class="bi bi-people me-1"></i> Usuários
            </router-link>
          </li>
          <li v-if="isAdmin" class="nav-item">
            <router-link class="nav-link d-flex align-items-center" to="/unidades">
              <i class="bi bi-house me-1"></i> Unidades
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link d-flex align-items-center" to="/votos">
              <i class="bi bi-check2-square me-1"></i> Votos
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link d-flex align-items-center" to="/avisos">
              <i class="bi bi-bell me-1"></i> Avisos
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Dropdown do usuário -->
      <div class="ms-auto d-flex align-items-center">
        <div class="dropdown">
          <button
            class="btn btn-outline-primary d-flex align-items-center dropdown-toggle"
            type="button"
            id="userDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="bi bi-person-circle me-2"></i>
            {{ auth.usuario?.nome }}
            <span class="text-muted ms-2">({{ auth.usuario?.papel }})</span>
          </button>
          <ul class="dropdown-menu dropdown-menu-end shadow-sm p-2" aria-labelledby="userDropdown">
            <li class="dropdown-item-text fw-semibold">{{ auth.usuario?.nome }}</li>
            <li class="dropdown-item-text text-muted">{{ auth.usuario?.email }}</li>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <button class="dropdown-item text-danger fw-bold" @click="logout">
                Logout
              </button>
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
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

export default defineComponent({
  setup() {
    const auth = useAuthStore()
    const router = useRouter()

    const isAdmin = computed(() => auth.usuario?.papel === 'admin')

    const logout = () => {
      auth.logout()
      router.push('/login')
    }

    return { auth, logout, isAdmin }
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
  display: none; /* remover seta duplicada */
}

.dropdown-menu {
  border-radius: 0.35rem;
  min-width: 200px;
}

main {
  background-color: #f8f9fa;
  height: 100%;
}
</style>
