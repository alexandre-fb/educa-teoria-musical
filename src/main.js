import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'

// Pinia como única fonte de estado global (regra .cursorrules)
const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.mount('#app')
