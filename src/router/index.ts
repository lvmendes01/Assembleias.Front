// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Importação das views
import Login from '../views/LoginView.vue'
import InicioAdminView from '../views/InicioAdminView.vue'
import CrudAssembleias from '../views/AssembleiasView.vue'
import CrudCondominios from '../views/CondominioView.vue'
import Enquetes from '../views/EnqueteView.vue'
import Votacao from '../views/VotacaoView.vue'
import Usuario from '../views/UsuarioView.vue'
import Unidade from '../views/UnidadeView.vue'
import Aviso from '../views/AvisosView.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/adm', component: InicioAdminView },
  { path: '/assembleias', component: CrudAssembleias, meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/condominios', component: CrudCondominios, meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/enquetes', component: Enquetes, meta: { requiresAuth: true, roles: ['admin','Condômino'] } },
  { path: '/votos', component: Votacao, meta: { requiresAuth: true, roles: ['admin','Condômino'] } },
  { path: '/usuarios', component: Usuario, meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/unidades', component: Unidade, meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/avisos', component: Aviso, meta: { requiresAuth: true, roles: ['admin','Condômino'] } },
  // 404 fallback
  { path: '/:pathMatch(.*)*', redirect: '/login' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Middleware global de autenticação
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  // Se houver token mas usuário não carregado, buscar do backend
  if (auth.token && !auth.usuario) {
    if (auth.fetchUsuario) {
      await auth.fetchUsuario()
    }
  }

  const usuario = auth.usuario
  const token = auth.token
  const papel = usuario?.papel

  // Rotas protegidas
  if (to.meta.requiresAuth) {
    if (!token) return next('/login')
    if (to.meta.roles && !to.meta.roles.includes(papel!)) return next('/login')
  }

  // Redireciona usuário logado tentando acessar /login
  if (to.path === '/login' && token) {
    const redirectMap: Record<string, string> = {
      admin: '/assembleias',
      Condômino: '/avisos'
    }
    return next(redirectMap[papel!] || '/login')
  }

  next()
})

export default router
