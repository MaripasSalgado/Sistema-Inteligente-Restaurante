import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from './composables/useAuth'
import Predicciones from './pages/Predicciones.vue'
import MainPanel from './pages/MainPanel.vue'
import Dashboard from './pages/Dashboard.vue'
import Proveedores from './pages/Proveedores.vue'
import Insumos from './pages/Insumos.vue'
import Recetas from './pages/Recetas.vue'
import Productos from './pages/Productos.vue'
import OrdenesVentas from './pages/OrdenesVentas.vue'
import UsuariosRoles from './pages/UsuariosRoles.vue'
import EditarCuenta from './pages/EditarCuenta.vue'
import Login from './pages/Login.vue'
import ResetPassword from './pages/ResetPassword.vue'
import TestAuth from './pages/TestAuth.vue'
import TestQueries from './pages/TestQueries.vue'
import Turnos from './pages/Turnos.vue'
import Planilla from './pages/Planilla.vue'
import ChangePassword from './pages/ChangePassword.vue'
import Alertas from './pages/Alertas.vue'

const routes = [
  // Rutas públicas
  { 
    path: '/login', 
    component: Login,
    meta: { 
      requiresAuth: false,
      title: 'Iniciar Sesión'
    }
  },
  {
    path: '/change-password',
    component: ChangePassword,
    meta: {
    requiresAuth: false,
    title: 'Cambiar contraseña',
    }
    },
  { 
    path: '/reset-password', 
    component: ResetPassword,
    meta: { 
      requiresAuth: false,
      title: 'Recuperar Contraseña'
    }
  },
  { 
    path: '/test', 
    component: TestAuth,
    meta: { 
      requiresAuth: false,
      title: 'Prueba de Autenticación'
    }
  },
  { 
    path: '/test-queries', 
    component: TestQueries,
    meta: { 
      requiresAuth: false,
      title: 'Prueba de Queries'
    }
  },
  
  // Rutas protegidas
  { 
    path: '/', 
    component: MainPanel,
    meta: { 
      requiresAuth: true,
      title: 'Dashboard'
    }
  },
  { 
    path: '/dashboard', 
    component: Dashboard,
    meta: { 
      requiresAuth: true,
      title: 'Dashboard',
      viewPermission: 'Panel Principal'
    }
  },
  { 
    path: '/predicciones', 
    component: Predicciones,
    meta: { 
      requiresAuth: true,
      title: 'Predicciones',
      viewPermission: 'Predicciones'
    }
  },
  
  // Rutas de inventario
  { 
    path: '/proveedores', 
    component: Proveedores,
    meta: { 
      requiresAuth: true,
      title: 'Proveedores',
      viewPermission: 'Proveedores'
    }
  },
  { 
    path: '/insumos', 
    component: Insumos,
    meta: { 
      requiresAuth: true,
      title: 'Insumos',
      viewPermission: 'Insumos'
    }
  },
  
  // Rutas de operaciones
  { 
    path: '/ordenes-ventas', 
    component: OrdenesVentas,
    meta: { 
      requiresAuth: true,
      title: 'Órdenes de Venta',
      viewPermission: 'Órdenes y Ventas'
    }
  },
  { 
    path: '/recetas', 
    component: Recetas,
    meta: { 
      requiresAuth: true,
      title: 'Recetas',
      viewPermission: 'Recetas'
    }
  },
  { 
    path: '/productos', 
    component: Productos,
    meta: { 
      requiresAuth: true,
      title: 'Productos',
      viewPermission: 'Productos'
    }
  },
  
  // Rutas administrativas
  { 
    path: '/usuarios-roles', 
    component: UsuariosRoles,
    meta: { 
      requiresAuth: true,
      title: 'Usuarios y Roles',
      viewPermission: 'Usuarios y Roles'
    }
  },
    { 
    path: '/alertas', 
    component: Alertas,
    meta: { 
      requiresAuth: true,
      title: 'Alertas',
      viewPermission: 'Alertas'
    }
  },
  
  // Rutas de personal
  { 
    path: '/turnos', 
    component: Turnos,
    meta: { 
      requiresAuth: true,
      title: 'Turnos y Asistencia',
      viewPermission: 'Turnos y Asistencia'
    }
  },
  { 
    path: '/planilla', 
    component: Planilla,
    meta: { 
      requiresAuth: true,
      title: 'Planilla',
      viewPermission: 'Planilla'
    }
  },
  
  // Rutas de cuenta
  { 
    path: '/account', 
    component: EditarCuenta,
    meta: { 
      requiresAuth: true,
      title: 'Mi Cuenta'
    }
  },
  
  // Ruta de redirección para rutas no encontradas
  { 
    path: '/:pathMatch(.*)*', 
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Guard de navegación para autenticación
router.beforeEach(async (to, from, next) => {
  try {
    const { AuthService } = await import('@/services/authService')
    const { user } = await AuthService.getCurrentUser()
    
    // Si el usuario está autenticado
    if (user) {
      // Si intenta ir al login, redirigir al dashboard
      if (to.path === '/login') {
        next('/')
        return
      }
      // Si intenta ir a reset-password, redirigir al dashboard
      if (to.path === '/reset-password') {
        next('/')
        return
      }
      
      // Verificar permisos de vista si la ruta los requiere
      if (to.meta.viewPermission) {
        try {
          // Mapeo de rutas a nombres de vistas
          const routeToViewMap = {
            '/': 'Panel Principal',
            '/dashboard': 'Panel Principal',
            '/predicciones': 'Predicciones',
            '/insumos': 'Insumos',
            '/proveedores': 'Proveedores',
            '/ordenes-ventas': 'Órdenes y Ventas',
            '/productos': 'Productos',
            '/recetas': 'Recetas',
            '/turnos': 'Turnos y Asistencia',
            '/planilla': 'Planilla',
            '/usuarios-roles': 'Usuarios y Roles'
          }
          
          const viewName = routeToViewMap[to.path]
          if (viewName) {
            // Importar el servicio dinámicamente
            const { PermissionsService } = await import('@/services/permissionsService')
            
            // Verificar acceso usando el servicio
            const result = await PermissionsService.canAccessView(user.id, viewName)
            
            if (!result.success || !result.canAccess) {
              console.warn(`Usuario sin permisos para acceder a: ${to.path}`)
              next('/')
              return
            }
          }
        } catch (error) {
          console.error('Error verificando permisos:', error)
          // En caso de error, permitir acceso
        }
      }
      
      // Para cualquier otra ruta, permitir acceso
      next()
      return
    }
    
    // Si el usuario NO está autenticado
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    
    if (!requiresAuth) {
      // Si no requiere autenticación, continuar
      next()
      return
    }
    
    // Si requiere autenticación pero no está loggeado, redirigir al login
    next('/login')
    
  } catch (error) {
    console.error('Error en router guard:', error)
    // Error al verificar autenticación
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    
    if (requiresAuth) {
      next('/login')
    } else {
      next()
    }
  }
})

export default router
