import './assets/tailwind.css'  // <-- import Tailwind CSS here
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import 'boxicons/css/boxicons.min.css'
import 'leaflet/dist/leaflet.css'





const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
