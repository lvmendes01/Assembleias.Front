import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

const app = createApp(App)


import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js' // JS do Bootstrap (opcional, necessário para dropdowns e navbar)


// Pinia
app.use(createPinia())

// Vue Router
app.use(router)

app.mount('#app')
