import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { PermissionsService } from '@/services/permissionsService'

export function usePermissions() {
  const { user } = useAuth()
  
  // Estado reactivo
  const permissions = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Computed properties
  const hasPermission = computed(() => {
    return (vistaRuta, operacionNombre) => {
      if (!user.value || !permissions.value.length) return false
      
      return permissions.value.some(perm => 
        perm.vista_ruta === vistaRuta && 
        perm.operacion_nombre === operacionNombre
      )
    }
  })

  const canRead = computed(() => {
    return (vistaRuta) => hasPermission.value(vistaRuta, 'leer')
  })

  const canCreate = computed(() => {
    return (vistaRuta) => hasPermission.value(vistaRuta, 'crear')
  })

  const canEdit = computed(() => {
    return (vistaRuta) => hasPermission.value(vistaRuta, 'editar')
  })

  const canDelete = computed(() => {
    return (vistaRuta) => hasPermission.value(vistaRuta, 'eliminar')
  })

  // Métodos
  const loadUserPermissions = async () => {
    if (!user.value) return

    loading.value = true
    error.value = null

    try {
      const result = await PermissionsService.getUserPermissions(user.value.id)
      
      if (result.success) {
        permissions.value = result.data || []
      } else {
        error.value = result.error
        permissions.value = []
      }
    } catch (err) {
      error.value = 'Error inesperado al cargar permisos'
      permissions.value = []
    } finally {
      loading.value = false
    }
  }

  const checkPermission = async (vistaRuta, operacionNombre) => {
    if (!user.value) return false

    try {
      const result = await PermissionsService.hasPermission(
        user.value.id, 
        vistaRuta, 
        operacionNombre
      )
      
      return result.success ? result.hasPermission : false
    } catch (err) {
      console.error('Error verificando permiso:', err)
      return false
    }
  }

  const refreshPermissions = async () => {
    await loadUserPermissions()
  }

  // Cargar permisos al montar
  onMounted(() => {
    if (user.value) {
      loadUserPermissions()
    }
  })

  return {
    // Estado
    permissions,
    loading,
    error,
    
    // Computed
    hasPermission,
    canRead,
    canCreate,
    canEdit,
    canDelete,
    
    // Métodos
    loadUserPermissions,
    checkPermission,
    refreshPermissions
  }
}

// Composable para gestión de roles y permisos (solo para administradores)
export function useRoleManagement() {
  const loading = ref(false)
  const error = ref(null)

  // Obtener todos los roles
  const getRoles = async () => {
    loading.value = true
    try {
      const result = await PermissionsService.getRoles()
      return result
    } catch (err) {
      error.value = 'Error inesperado al obtener roles'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Obtener todas las vistas
  const getVistas = async () => {
    loading.value = true
    try {
      const result = await PermissionsService.getVistas()
      return result
    } catch (err) {
      error.value = 'Error inesperado al obtener vistas'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Obtener todas las operaciones
  const getOperaciones = async () => {
    loading.value = true
    try {
      const result = await PermissionsService.getOperaciones()
      return result
    } catch (err) {
      error.value = 'Error inesperado al obtener operaciones'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Crear rol
  const createRol = async (nombre) => {
    loading.value = true
    try {
      const result = await PermissionsService.createRol(nombre)
      return result
    } catch (err) {
      error.value = 'Error inesperado al crear rol'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Actualizar rol
  const updateRol = async (id, nombre) => {
    loading.value = true
    try {
      const result = await PermissionsService.updateRol(id, nombre)
      return result
    } catch (err) {
      error.value = 'Error inesperado al actualizar rol'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Eliminar rol
  const deleteRol = async (id) => {
    loading.value = true
    try {
      const result = await PermissionsService.deleteRol(id)
      return result
    } catch (err) {
      error.value = 'Error inesperado al eliminar rol'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Obtener permisos de un rol
  const getRolPermissions = async (rolId) => {
    loading.value = true
    try {
      const result = await PermissionsService.getRolPermissions(rolId)
      return result
    } catch (err) {
      error.value = 'Error inesperado al obtener permisos del rol'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Asignar permisos a un rol
  const assignRolPermissions = async (rolId, permisos) => {
    loading.value = true
    try {
      const result = await PermissionsService.assignRolPermissions(rolId, permisos)
      return result
    } catch (err) {
      error.value = 'Error inesperado al asignar permisos'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Asignar permisos personalizados a un usuario
  const assignUserPermissions = async (userId, permisos) => {
    loading.value = true
    try {
      const result = await PermissionsService.assignUserPermissions(userId, permisos)
      return result
    } catch (err) {
      error.value = 'Error inesperado al asignar permisos al usuario'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  return {
    // Estado
    loading,
    error,
    
    // Métodos
    getRoles,
    getVistas,
    getOperaciones,
    createRol,
    updateRol,
    deleteRol,
    getRolPermissions,
    assignRolPermissions,
    assignUserPermissions
  }
}