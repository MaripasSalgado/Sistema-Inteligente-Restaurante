import { ref, computed, onMounted, watch } from 'vue'
import { useAuth } from './useAuth'
import { PermissionsService } from '@/services/permissionsService'

/**
 * Composable para verificar permisos de vistas
 * Controla qué vistas puede ver el usuario basado en sus permisos
 */
export function useViewPermissions() {
  const { user, isAuthenticated } = useAuth()
  
  // Estado de permisos
  const userPermissions = ref([])
  const rolePermissions = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Mapeo de rutas URL a nombres de vistas en la base de datos
  const routeToViewMap = {
    '/': 'Panel Principal',
    '/dashboard': 'Panel Principal',
    '/dashboard/mainpanel': 'Panel Principal',
    '/predicciones': 'Predicciones',
    '/insumos': 'Insumos',
    '/proveedores': 'Proveedores',
    '/ordenes-ventas': 'Órdenes y Ventas',
    '/productos': 'Productos',
    '/recetas': 'Recetas',
    '/turnos': 'Turnos y Asistencia',
    '/planilla': 'Planilla',
    '/usuarios-roles': 'Usuarios y Roles',
     '/alertas': 'Alertas'
  }

  /**
   * Cargar permisos del usuario (SISTEMA SIMPLIFICADO: Solo permisos de rol)
   */
  const loadPermissions = async () => {
    if (!isAuthenticated.value || !user.value?.id) {
      return
    }

    loading.value = true
    error.value = null

    try {
      // SISTEMA SIMPLIFICADO: Solo cargar permisos del rol
      // No usamos permisos específicos de usuario
      userPermissions.value = []
      
      // Cargar permisos del rol
      const rolePermsResult = await PermissionsService.getRolePermissions(user.value.id)
      
      if (rolePermsResult.success) {
        rolePermissions.value = rolePermsResult.data || []
      } else {
        rolePermissions.value = []
      }

    } catch (err) {
      error.value = 'Error cargando permisos'
    } finally {
      loading.value = false
    }
  }

  /**
   * Verificar si el usuario puede ver una vista específica
   * @param {string} route - Ruta de la vista
   * @returns {boolean}
   */
  const canViewRoute = (route) => {
    // Si no está autenticado, denegar acceso
    if (!isAuthenticated.value || !user.value?.id) {
      return false
    }

    // Si no hay permisos cargados, permitir acceso temporalmente
    if (rolePermissions.value.length === 0) {
      return true
    }

    const viewName = routeToViewMap[route]
    if (!viewName) {
      return true // Si no está en el mapeo, permitir acceso
    }

    // SISTEMA SIMPLIFICADO: Solo verificar permisos del rol
    const roleHasPermission = rolePermissions.value.some(perm => 
      perm.vista_ruta === viewName && perm.operacion_nombre === 'leer'
    )

    return roleHasPermission
  }

  /**
   * Verificar si el usuario puede realizar una operación en una vista
   * @param {string} route - Ruta de la vista
   * @param {string} operation - Operación (crear, leer, editar, eliminar)
   * @returns {boolean}
   */
  const canPerformOperation = (route, operation) => {
    if (!isAuthenticated.value) return false

    // MODO DESARROLLO: Si no hay permisos cargados, permitir acceso
    if (rolePermissions.value.length === 0) {
      console.log(`[useViewPermissions] MODO DESARROLLO: Permitiendo operación '${operation}' en: ${route}`)
      return true
    }

    const viewName = routeToViewMap[route]
    if (!viewName) return true // Si no está en el mapeo, permitir acceso

    // SISTEMA SIMPLIFICADO: Solo verificar permisos del rol
    const roleHasPermission = rolePermissions.value.some(perm => 
      perm.vista_ruta === viewName && perm.operacion_nombre === operation
    )

    console.log(`[useViewPermissions] Rol puede '${operation}' en '${viewName}': ${roleHasPermission}`)
    return roleHasPermission
  }

  /**
   * Obtener vistas permitidas para el usuario
   * @returns {Array} Lista de rutas permitidas
   */
  const allowedRoutes = computed(() => {
    return Object.keys(routeToViewMap).filter(route => 
      canViewRoute(route)
    )
  })

  /**
   * Verificar si el usuario es administrador
   * @returns {boolean}
   */
  const isAdmin = computed(() => {
    if (!user.value?.profile) return false
    
    const userRole = user.value.profile.rol_id
    return userRole === 'admin' || userRole === 'Administrador'
  })

  // Cargar permisos cuando el usuario se autentica
  onMounted(() => {
    if (isAuthenticated.value) {
      loadPermissions()
    }
  })

  // Cargar permisos cuando cambie el estado de autenticación
  watch(isAuthenticated, async (newValue) => {
    if (newValue) {
      // Pequeño delay para asegurar que el usuario esté completamente cargado
      setTimeout(() => {
        loadPermissions()
      }, 100)
    } else {
      rolePermissions.value = []
      userPermissions.value = []
    }
  })

  return {
    // Estado
    userPermissions,
    rolePermissions,
    loading,
    error,
    
    // Computed
    allowedRoutes,
    isAdmin,
    
    // Métodos
    loadPermissions,
    canViewRoute,
    canPerformOperation
  }
}

export default useViewPermissions
