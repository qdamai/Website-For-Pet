import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from './router'
import 'leaflet/dist/leaflet.css'
import './style.css'
import App from './App.vue'
import { seedDatabase } from './utils/seeder'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

if (import.meta.env.DEV) {
  seedDatabase();
}

app.mount('#app')
