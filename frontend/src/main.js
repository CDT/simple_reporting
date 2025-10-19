import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

// Import pages
import Home from './pages/Home.vue'
import Reports from './pages/Reports.vue'

// Define routes
const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/reports', name: 'Reports', component: Reports }
]

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Create and mount app
const app = createApp(App)
app.use(router)
app.mount('#app')
