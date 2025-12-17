import { supabase } from '@/config/supabase'

export class PermissionsService {
  /**
   * Obtener todos los roles
   * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
   */
  static async getRoles() {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('nombre')

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener roles' }
    }
  }

  /**
   * Obtener todas las vistas
   * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
   */
  static async getVistas() {
    try {
      const { data, error } = await supabase
        .from('vistas')
        .select('*')
        .order('ruta')

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener vistas' }
    }
  }

  /**
   * Obtener todas las operaciones
   * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
   */
  static async getOperaciones() {
    try {
      const { data, error } = await supabase
        .from('operaciones')
        .select('*')
        .order('nombre')

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener operaciones' }
    }
  }

  /**
   * Crear un nuevo rol
   * @param {string} nombre - Nombre del rol
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async createRol(nombre) {
    try {
      const { data, error } = await supabase
        .from('roles')
        .insert({ nombre })
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al crear rol' }
    }
  }

  /**
   * Actualizar un rol
   * @param {string} id - ID del rol
   * @param {string} nombre - Nuevo nombre del rol
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async updateRol(id, nombre) {
    try {
      const { data, error } = await supabase
        .from('roles')
        .update({ 
          nombre,
          fecha_modificacion: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al actualizar rol' }
    }
  }

  /**
   * Eliminar un rol
   * @param {string} id - ID del rol
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async deleteRol(id) {
    try {
      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', id)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Error inesperado al eliminar rol' }
    }
  }

  /**
   * Obtener permisos de un rol
   * @param {string} rolId - ID del rol
   * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
   */
  static async getRolPermissions(rolId) {
    try {
      const { data, error } = await supabase
        .from('roles_vistas_operaciones')
        .select(`
          id,
          vista_id,
          operacion_id,
          vistas (ruta),
          operaciones (nombre)
        `)
        .eq('rol_id', rolId)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener permisos del rol' }
    }
  }

  /**
   * Asignar permisos a un rol
   * @param {string} rolId - ID del rol
   * @param {Array} permisos - Array de {vista_id, operacion_id}
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async assignRolPermissions(rolId, permisos) {
    try {
      // Primero eliminar permisos existentes
      const { error: deleteError } = await supabase
        .from('roles_vistas_operaciones')
        .delete()
        .eq('rol_id', rolId)

      if (deleteError) {
        return { success: false, error: deleteError.message }
      }

      // Luego insertar los nuevos permisos
      if (permisos.length > 0) {
        const permisosToInsert = permisos.map(permiso => ({
          rol_id: rolId,
          vista_id: permiso.vista_id,
          operacion_id: permiso.operacion_id
        }))

        const { error: insertError } = await supabase
          .from('roles_vistas_operaciones')
          .insert(permisosToInsert)

        if (insertError) {
          return { success: false, error: insertError.message }
        }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Error inesperado al asignar permisos' }
    }
  }

  /**
   * Obtener permisos de un usuario (SISTEMA SIMPLIFICADO: No se usa)
   * @param {string} userId - ID del usuario
   * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
   */
  static async getUserPermissions(userId) {
    // SISTEMA SIMPLIFICADO: Solo usamos permisos de rol
    // Esta función retorna un array vacío para mantener compatibilidad
    return { success: true, data: [] }
  }

  /**
   * Obtener permisos del rol de un usuario (FUNCIÓN PRINCIPAL)
   * @param {string} userId - ID del usuario
   * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
   */
  static async getRolePermissions(userId) {
    try {
      const { data, error } = await supabase
        .rpc('get_role_permissions', { p_user_id: userId })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data: data || [] }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener permisos del rol' }
    }
  }

  /**
   * Verificar acceso rápido a una vista (FUNCIÓN RÁPIDA)
   * @param {string} userId - ID del usuario
   * @param {string} vistaRuta - Ruta de la vista
   * @returns {Promise<{success: boolean, canAccess?: boolean, error?: string}>}
   */
  static async canAccessView(userId, vistaRuta) {
    try {
      const { data, error } = await supabase
        .rpc('can_access_view', { 
          p_user_id: userId, 
          p_vista_ruta: vistaRuta 
        })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, canAccess: data }
    } catch (error) {
      return { success: false, error: 'Error inesperado verificando acceso' }
    }
  }

  /**
   * Verificar si un usuario tiene un permiso específico
   * @param {string} userId - ID del usuario
   * @param {string} vistaRuta - Ruta de la vista
   * @param {string} operacionNombre - Nombre de la operación
   * @returns {Promise<{success: boolean, hasPermission?: boolean, error?: string}>}
   */
  static async hasPermission(userId, vistaRuta, operacionNombre) {
    try {
      const { data, error } = await supabase
        .rpc('has_permission', { 
          p_user_id: userId,
          p_vista_ruta: vistaRuta,
          p_operacion_nombre: operacionNombre
        })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, hasPermission: data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al verificar permiso' }
    }
  }

  /**
   * Asignar permisos personalizados a un usuario
   * @param {string} userId - ID del usuario
   * @param {Array} permisos - Array de {vista_id, operacion_id}
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async assignUserPermissions(userId, permisos) {
    try {
      // Primero eliminar permisos existentes
      const { error: deleteError } = await supabase
        .from('usuarios_vistas_operaciones')
        .delete()
        .eq('usuario_id', userId)

      if (deleteError) {
        return { success: false, error: deleteError.message }
      }

      // Luego insertar los nuevos permisos
      if (permisos.length > 0) {
        const permisosToInsert = permisos.map(permiso => ({
          usuario_id: userId,
          vista_id: permiso.vista_id,
          operacion_id: permiso.operacion_id
        }))

        const { error: insertError } = await supabase
          .from('usuarios_vistas_operaciones')
          .insert(permisosToInsert)

        if (insertError) {
          return { success: false, error: insertError.message }
        }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Error inesperado al asignar permisos al usuario' }
    }
  }
}

export default PermissionsService
