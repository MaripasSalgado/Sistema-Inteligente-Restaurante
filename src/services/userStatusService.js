import { supabase } from '@/config/supabase'

export class UserStatusService {
  /**
   * Verifica si un usuario está activo
   * @param {string} userId - ID del usuario
   * @returns {Promise<{isActive: boolean, user: object|null}>}
   */
  static async checkUserStatus(userId) {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('id, estado, nombre, apellido, email')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error verificando estado del usuario:', error)
        return { isActive: false, user: null }
      }

      if (!data) {
        console.warn('Usuario no encontrado en la base de datos')
        return { isActive: false, user: null }
      }

      const isActive = data.estado === 'Activo'
      
      if (!isActive) {
        console.warn(`Usuario ${data.nombre} ${data.apellido} está inactivo`)
      }

      return { isActive, user: data }
    } catch (error) {
      console.error('Error inesperado verificando estado del usuario:', error)
      return { isActive: false, user: null }
    }
  }

  /**
   * Desactiva un usuario (cambia su estado a Inactivo)
   * @param {string} userId - ID del usuario
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async deactivateUser(userId) {
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ 
          estado: 'Inactivo',
          fecha_modificacion: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) {
        console.error('Error desactivando usuario:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Error inesperado desactivando usuario:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Activa un usuario (cambia su estado a Activo)
   * @param {string} userId - ID del usuario
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async activateUser(userId) {
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ 
          estado: 'Activo',
          fecha_modificacion: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) {
        console.error('Error activando usuario:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Error inesperado activando usuario:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Cierra la sesión del usuario actual
   * @returns {Promise<void>}
   */
  static async logoutUser() {
    try {
      await supabase.auth.signOut()
      // Redirigir al login
      window.location.href = '/login'
    } catch (error) {
      console.error('Error cerrando sesión:', error)
      // Forzar redirección
      window.location.href = '/login'
    }
  }
}
