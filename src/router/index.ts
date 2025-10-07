import { createRouter, createWebHistory } from 'vue-router';
import CrudAssembleias from '../views/AssembleiasView.vue';
import CrudCondominios from '../views/CondominioView.vue';
import Enquetes from '../views/EnqueteView.vue';
import Votacao from '../views/VotacaoView.vue';
import Usuario from '../views/UsuarioView.vue';
import Unidade from '../views/UnidadeView.vue';
import Login from '../views/LoginView.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/assembleias', component: CrudAssembleias, meta: { requiresAuth: true } },
  { path: '/condominios', component: CrudCondominios, meta: { requiresAuth: true } },
  { path: '/enquetes', component: Enquetes, meta: { requiresAuth: true } },
  { path: '/votos', component: Votacao, meta: { requiresAuth: true } },
  { path: '/usuarios', component: Usuario, meta: { requiresAuth: true } },
  { path: '/unidades', component: Unidade, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Middleware de autenticação
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  // Se a rota exigir autenticação e não houver token, vai para login
  if (to.meta.requiresAuth && !token) {
    next('/login');
  }
  // Se tentar ir pro login mas já estiver logado, vai pra assembleias
  else if (to.path === '/login' && token) {
    next('/assembleias');
  }
  else {
    next();
  }
});

export default router;
