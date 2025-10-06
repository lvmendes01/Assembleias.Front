import { createRouter, createWebHistory } from 'vue-router';
import CrudAssembleias from '../views/Assembleias.vue';
import CrudCondominios from '../views/Condominio.vue';
const routes = [
  { path: '/', redirect: '/assembleias' },
  { path: '/assembleias', component: CrudAssembleias },
  { path: '/condominios', component: CrudCondominios }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;