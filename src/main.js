import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import vPermission from './directives/permission'

import './css/style.css'

const app = createApp(App)

// Usar el router
app.use(router)

// Registrar directiva de permisos
app.directive('permission', vPermission)

// Montar la aplicación
app.mount('#app')
