import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persistedstate' // <-- Importa o plugin

// Bootstrap (CSS + JS)
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const pinia = createPinia()
pinia.use(piniaPersist) // <-- Ativa persistência globalmente

const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')