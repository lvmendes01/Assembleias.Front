import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js' // TS precisa de tipagem
import './bootstrap.js'

// Importa CSS do Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'

const app = createApp(App)
app.use(router)
app.mount('#app')
