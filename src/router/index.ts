import { createRouter, createWebHistory } from 'vue-router';
import CrudAssembleias from '../views/Assembleias.vue';
import CrudCondominios from '../views/Condominio.vue';
import Enquetes from '../views/Enquete.vue';
import Votacao from '../views/Votacao.vue';
import Usuario from '../views/Usuario.vue';
import Unidade from '../views/Unidade.vue';


const routes = [
  { path: '/', redirect: '/assembleias' },
  { path: '/assembleias', component: CrudAssembleias },
  { path: '/condominios', component: CrudCondominios },
  { path: '/enquetes', component: Enquetes },
  { path: '/votos', component: Votacao },
  { path: '/usuarios', component: Usuario },
  { path: '/unidades', component: Unidade }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;