import { supabase } from '@/config/supabase'

/**
 * Servicio para verificación de acceso a vistas
 * Utiliza las funciones RPC optimizadas para el sistema simplificado
 */
export class ViewAccessService {
  /**
   * Verificar si el usuario puede acceder a una vista específica
   * @param {string} userId - ID del usuario
   * @param {string} vistaRuta - Ruta de la vista (ej: "Panel Principal")
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
        console.error('Error verificando acceso a vista:', error)
        return { success: false, error: error.message }
      }

      return { success: true, canAccess: data }
    } catch (error) {
      console.error('Error inesperado verificando acceso:', error)
      return { success: false, error: 'Error inesperado verificando acceso' }
    }
  }

  /**
   * Verificar si el usuario puede realizar una operación en una vista
   * @param {string} userId - ID del usuario
   * @param {string} vistaRuta - Ruta de la vista
   * @param {string} operacion - Operación (crear, leer, editar, eliminar)
   * @returns {Promise<{success: boolean, canPerform?: boolean, error?: string}>}
   */
  static async canPerformOperation(userId, vistaRuta, operacion) {
    try {
      const { data, error } = await supabase
        .rpc('can_perform_operation', {
          p_user_id: userId,
          p_vista_ruta: vistaRuta,
          p_operacion_nombre: operacion
        })

      if (error) {
        console.error('Error verificando operación:', error)
        return { success: false, error: error.message }
      }

      return { success: true, canPerform: data }
    } catch (error) {
      console.error('Error inesperado verificando operación:', error)
      return { success: false, error: 'Error inesperado verificando operación' }
    }
  }

  /**
   * Obtener todas las vistas accesibles para el usuario
   * @param {string} userId - ID del usuario
   * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
   */
  static async getUserAccessibleViews(userId) {
    try {
      const { data, error } = await supabase
        .rpc('get_user_accessible_views', {
          p_user_id: userId
        })

      if (error) {
        console.error('Error obteniendo vistas accesibles:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data: data || [] }
    } catch (error) {
      console.error('Error inesperado obteniendo vistas:', error)
      return { success: false, error: 'Error inesperado obteniendo vistas' }
    }
  }

  /**
   * Obtener resumen completo de permisos del usuario
   * @param {string} userId - ID del usuario
   * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
   */
  static async getUserPermissionsSummary(userId) {
    try {
      const { data, error } = await supabase
        .rpc('get_user_permissions_summary', {
          p_user_id: userId
        })

      if (error) {
        console.error('Error obteniendo resumen de permisos:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data: data?.[0] || null }
    } catch (error) {
      console.error('Error inesperado obteniendo resumen:', error)
      return { success: false, error: 'Error inesperado obteniendo resumen' }
    }
  }

  /**
   * Verificación rápida de acceso (optimizada para el frontend)
   * @param {string} userId - ID del usuario
   * @param {string} vistaRuta - Ruta de la vista
   * @returns {Promise<{success: boolean, canAccess?: boolean, error?: string}>}
   */
  static async checkViewAccess(userId, vistaRuta) {
    try {
      const { data, error } = await supabase
        .rpc('check_view_access', {
          p_user_id: userId,
          p_vista_ruta: vistaRuta
        })

      if (error) {
        console.error('Error en verificación rápida:', error)
        return { success: false, error: error.message }
      }

      return { success: true, canAccess: data }
    } catch (error) {
      console.error('Error inesperado en verificación rápida:', error)
      return { success: false, error: 'Error inesperado en verificación rápida' }
    }
  }

  /**
   * Debug de permisos del usuario (para desarrollo)
   * @param {string} userId - ID del usuario
   * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
   */
  static async debugUserPermissions(userId) {
    try {
      const { data, error } = await supabase
        .rpc('debug_user_permissions', {
          p_user_id: userId
        })

      if (error) {
        console.error('Error en debug de permisos:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data: data || [] }
    } catch (error) {
      console.error('Error inesperado en debug:', error)
      return { success: false, error: 'Error inesperado en debug' }
    }
  }

  /**
   * Verificar múltiples vistas de una vez (batch)
   * @param {string} userId - ID del usuario
   * @param {Array<string>} vistas - Array de rutas de vistas
   * @returns {Promise<{success: boolean, results?: Object, error?: string}>}
   */
  static async checkMultipleViews(userId, vistas) {
    try {
      const results = {}
      
      // Verificar cada vista
      for (const vista of vistas) {
        const result = await this.checkViewAccess(userId, vista)
        if (result.success) {
          results[vista] = result.canAccess
        } else {
          results[vista] = false
        }
      }

      return { success: true, results }
    } catch (error) {
      console.error('Error verificando múltiples vistas:', error)
      return { success: false, error: 'Error verificando múltiples vistas' }
    }
  }
}
