import { ref, computed, onMounted } from 'vue'
import { useAuth } from './useAuth'
import { ViewAccessService } from '@/services/viewAccessService'

/**
 * Composable para verificación de acceso a vistas
 * Versión optimizada que usa las nuevas funciones RPC
 */
export function useViewAccess() {
  const { user, isAuthenticated } = useAuth()
  
  // Estado
  const loading = ref(false)
  const error = ref(null)
  const accessibleViews = ref([])
  const permissionsSummary = ref(null)
  
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
   * Cargar vistas accesibles del usuario
   */
  const loadAccessibleViews = async () => {
    if (!isAuthenticated.value || !user.value?.id) {
      return
    }

    loading.value = true
    error.value = null

    try {
      const result = await ViewAccessService.getUserAccessibleViews(user.value.id)
      
      if (result.success) {
        accessibleViews.value = result.data || []
        console.log('[useViewAccess] Vistas accesibles cargadas:', accessibleViews.value)
      } else {
        console.error('[useViewAccess] Error cargando vistas:', result.error)
        error.value = result.error
        accessibleViews.value = []
      }
    } catch (err) {
      console.error('[useViewAccess] Error inesperado:', err)
      error.value = 'Error inesperado cargando vistas'
      accessibleViews.value = []
    } finally {
      loading.value = false
    }
  }

  /**
   * Cargar resumen de permisos del usuario
   */
  const loadPermissionsSummary = async () => {
    if (!isAuthenticated.value || !user.value?.id) {
      return
    }

    try {
      const result = await ViewAccessService.getUserPermissionsSummary(user.value.id)
      
      if (result.success) {
        permissionsSummary.value = result.data
        console.log('[useViewAccess] Resumen de permisos cargado:', permissionsSummary.value)
      } else {
        console.error('[useViewAccess] Error cargando resumen:', result.error)
      }
    } catch (err) {
      console.error('[useViewAccess] Error inesperado cargando resumen:', err)
    }
  }

  /**
   * Verificar si el usuario puede acceder a una vista específica
   * @param {string} route - Ruta de la vista
   * @returns {boolean}
   */
  const canViewRoute = (route) => {
    if (!isAuthenticated.value) return false

    const viewName = routeToViewMap[route]
    if (!viewName) {
      console.log(`[useViewAccess] Ruta no mapeada, permitiendo acceso a: ${route}`)
      return true // Si no está en el mapeo, permitir acceso
    }

    // Verificar si la vista está en las vistas accesibles
    const hasAccess = accessibleViews.value.some(view => 
      view.vista_ruta === viewName
    )

    console.log(`[useViewAccess] Acceso a ${route} (${viewName}): ${hasAccess}`)
    return hasAccess
  }

  /**
   * Verificar si el usuario puede realizar una operación en una vista
   * @param {string} route - Ruta de la vista
   * @param {string} operation - Operación (crear, leer, editar, eliminar)
   * @returns {boolean}
   */
  const canPerformOperation = (route, operation) => {
    if (!isAuthenticated.value) return false

    const viewName = routeToViewMap[route]
    if (!viewName) return true // Si no está en el mapeo, permitir acceso

    // Verificar si la operación está disponible para la vista
    const view = accessibleViews.value.find(view => view.vista_ruta === viewName)
    if (!view) return false

    const hasOperation = view.operaciones_disponibles?.includes(operation) || false
    console.log(`[useViewAccess] Operación '${operation}' en '${viewName}': ${hasOperation}`)
    return hasOperation
  }

  /**
   * Verificación rápida de acceso (usa RPC optimizada)
   * @param {string} route - Ruta de la vista
   * @returns {Promise<boolean>}
   */
  const checkViewAccess = async (route) => {
    if (!isAuthenticated.value || !user.value?.id) return false

    const viewName = routeToViewMap[route]
    if (!viewName) return true

    try {
      const result = await ViewAccessService.checkViewAccess(user.value.id, viewName)
      return result.success ? result.canAccess : false
    } catch (error) {
      console.error('[useViewAccess] Error en verificación rápida:', error)
      return false
    }
  }

  /**
   * Verificar múltiples vistas de una vez
   * @param {Array<string>} routes - Array de rutas
   * @returns {Promise<Object>}
   */
  const checkMultipleViews = async (routes) => {
    if (!isAuthenticated.value || !user.value?.id) return {}

    const viewNames = routes.map(route => routeToViewMap[route]).filter(Boolean)
    
    try {
      const result = await ViewAccessService.checkMultipleViews(user.value.id, viewNames)
      return result.success ? result.results : {}
    } catch (error) {
      console.error('[useViewAccess] Error verificando múltiples vistas:', error)
      return {}
    }
  }

  /**
   * Debug de permisos del usuario
   */
  const debugPermissions = async () => {
    if (!isAuthenticated.value || !user.value?.id) return

    try {
      const result = await ViewAccessService.debugUserPermissions(user.value.id)
      if (result.success) {
        console.log('[useViewAccess] Debug de permisos:', result.data)
        return result.data
      }
    } catch (error) {
      console.error('[useViewAccess] Error en debug:', error)
    }
  }

  // Computed properties
  const allowedRoutes = computed(() => {
    return Object.keys(routeToViewMap).filter(route => 
      canViewRoute(route)
    )
  })

  const isAdmin = computed(() => {
    if (!permissionsSummary.value) return false
    return permissionsSummary.value.rol_nombre?.toLowerCase().includes('admin')
  })

  // Cargar datos al montar
  onMounted(() => {
    if (isAuthenticated.value) {
      loadAccessibleViews()
      loadPermissionsSummary()
    }
  })

  return {
    // Estado
    loading,
    error,
    accessibleViews,
    permissionsSummary,
    
    // Métodos
    loadAccessibleViews,
    loadPermissionsSummary,
    canViewRoute,
    canPerformOperation,
    checkViewAccess,
    checkMultipleViews,
    debugPermissions,
    
    // Computed
    allowedRoutes,
    isAdmin
  }
}
