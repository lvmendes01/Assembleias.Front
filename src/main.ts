import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './bootstrap.js';
// Importa CSS do Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
// Importa JS do Bootstrap
import * as bootstrap from 'bootstrap'

const app = createApp(App)
app.use(router)
app.mount('#app')