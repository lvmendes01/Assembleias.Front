import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/LoginView.vue'
import InicioAdminView from '../views/InicioAdminView.vue'
import CrudAssembleias from '../views/AssembleiasView.vue'
import CrudCondominios from '../views/CondominioView.vue'
import Enquetes from '../views/EnqueteView.vue'
import Votacao from '../views/VotacaoView.vue'
import Usuario from '../views/UsuarioView.vue'
import Unidade from '../views/UnidadeView.vue'
import Aviso from '../views/AvisosView.vue'

// Definição das rotas
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/adm', component: InicioAdminView },
  { path: '/assembleias', component: CrudAssembleias, meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/condominios', component: CrudCondominios, meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/enquetes', component: Enquetes, meta: { requiresAuth: true, roles: ['usuario', 'admin'] } },
  { path: '/votos', component: Votacao, meta: { requiresAuth: true, roles: ['usuario', 'admin'] } },
  { path: '/usuarios', component: Usuario, meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/unidades', component: Unidade, meta: { requiresAuth: true, roles: ['admin'] } },
   { path: '/avisos', component: Aviso, meta: { requiresAuth: true, roles: ['usuario', 'admin'] } },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Middleware de autenticação
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('auth.token')
  const papel = localStorage.getItem('auth.papel') // 'admin' ou 'usuario'

  // Rotas que exigem autenticação
  if (to.meta.requiresAuth) {
    if (!token) return next('/login')
    if (to.meta.roles && !to.meta.roles.includes(papel)) {
      // Usuário sem permissão para acessar a rota
      return next('/login')
    }
  }

  // Se já estiver logado, redireciona o usuário para a rota adequada
  if (to.path === '/login' && token) {
    const redirectMap: Record<string, string> = {
      admin: '/assembleias',
      usuario: '/enquetes'
    }
    return next(redirectMap[papel] || '/login')
  }

  next()
})

export default router
