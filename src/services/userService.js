import { supabase } from '@/config/supabase'
import { AvatarService } from './avatarService'
import { getTimestampCostaRica } from '@/utils/dateHelper'

export class UserService {
  /**
   * Actualizar perfil del usuario
   * @param {object} profileData - Datos del perfil a actualizar
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async updateProfile(profileData) {
    try {
      const { data, error } = await supabase.rpc('update_user_profile', {
        p_nombre: profileData.nombre,
        p_apellido: profileData.apellido,
        p_departamento: profileData.departamento || null,
        p_telefono: profileData.telefono || null,
        p_biografia: profileData.biografia || null,
        p_cedula: profileData.cedula || null,
        p_puesto: profileData.puesto || null,
        p_rol_id: profileData.rol_id || null
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return data
    } catch (error) {
      return { success: false, error: 'Error inesperado al actualizar perfil' }
    }
  }

  /**
   * Actualizar perfil de cualquier usuario (para administradores)
   * @param {object} profileData - Datos del perfil a actualizar
   * @param {string} userId - ID del usuario a actualizar
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async updateUserProfile(profileData, userId) {
    try {
      const { data, error } = await supabase.rpc('update_user_profile_admin', {
        p_user_id: userId,
        p_nombre: profileData.nombre,
        p_apellido: profileData.apellido,
        p_departamento: profileData.departamento || null,
        p_telefono: profileData.telefono || null,
        p_biografia: profileData.biografia || null,
        p_cedula: profileData.cedula || null,
        p_puesto: profileData.puesto || null,
        p_rol_id: profileData.rol_id || null,
        p_estado: profileData.estado || 'Activo'
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return data
    } catch (error) {
      return { success: false, error: 'Error inesperado al actualizar perfil' }
    }
  }

  /**
   * Obtener perfil del usuario actual
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async getCurrentProfile() {
    try {
      // Obtener el usuario autenticado
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        return { success: false, error: 'Usuario no autenticado' }
      }

      // Obtener el perfil del usuario usando su ID con información del rol
      const { data, error } = await supabase
        .from('usuarios')
        .select(`
          *,
          roles:rol_id (
            id,
            nombre
          )
        `)
        .eq('id', user.id)
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener perfil' }
    }
  }

  /**
   * Obtener todos los usuarios
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  static async getAllUsers() {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('fecha_creacion', { ascending: false })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener usuarios' }
    }
  }

  /**
   * Obtener usuario por ID
   * @param {string} userId - ID del usuario
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async getUserById(userId) {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener usuario' }
    }
  }

  /**
   * Actualizar contraseña del usuario actual (requiere estar logueado)
   * @param {string} currentPassword - Contraseña actual (para verificar)
   * @param {string} newPassword - Nueva contraseña
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async updatePassword(currentPassword, newPassword) {
    try {
      // Primero verificar que la contraseña actual sea correcta
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return { success: false, error: 'No hay usuario autenticado' }
      }

      // Verificar contraseña actual reautenticando
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword
      })

      if (signInError) {
        return { success: false, error: 'La contraseña actual es incorrecta' }
      }

      // Actualizar a la nueva contraseña
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Error inesperado al actualizar contraseña' }
    }
  }

  /**
   * Actualizar contraseña SIN verificar la actual 
   * (solo para uso desde reset password)
   * @param {string} newPassword - Nueva contraseña
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async setNewPassword(newPassword) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Error inesperado al establecer contraseña' }
    }
  }

  /**
   * Enviar email para restablecer contraseña
   * @param {string} email - Email del usuario
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Error inesperado al enviar email de restablecimiento' }
    }
  }

  /**
   * Subir foto de perfil al bucket de Supabase
   * @param {File} file - Archivo de imagen
   * @param {string} oldAvatarPath - Path de la foto anterior (opcional)
   * @returns {Promise<{success: boolean, url?: string, path?: string, error?: string}>}
   */
  static async uploadProfilePhoto(file, oldAvatarPath = null) {
    try {
      // Obtener el usuario actual
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        return { success: false, error: 'Usuario no autenticado' }
      }

      // Usar AvatarService para subir la foto
      const result = await AvatarService.uploadAvatar(file, user.id, oldAvatarPath)
      
      if (result.error) {
        return { success: false, error: result.error }
      }

      // Actualizar en la base de datos
      const updateResult = await AvatarService.updateUserAvatar(user.id, result.path)
      
      if (updateResult.error) {
        return { success: false, error: updateResult.error }
      }

      return { 
        success: true, 
        url: result.url, 
        path: result.path 
      }
    } catch (error) {
      return { success: false, error: 'Error inesperado al subir foto' }
    }
  }

  /**
   * Actualizar foto de perfil en la base de datos
   * @param {string} photoUrl - URL de la foto
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async updateProfilePhoto(photoUrl) {
    try {
      const { data, error } = await supabase.rpc('update_user_profile_photo', {
        p_photo_url: photoUrl
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return data
    } catch (error) {
      return { success: false, error: 'Error inesperado al actualizar foto de perfil' }
    }
  }

  /**
   * Eliminar foto de perfil del bucket y base de datos
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async deleteProfilePhoto() {
    try {
      // Obtener el usuario actual
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        return { success: false, error: 'Usuario no autenticado' }
      }

      // Obtener el path actual de la foto
      const { data: profileData, error: profileError } = await supabase
        .from('usuarios')
        .select('foto_perfil')
        .eq('id', user.id)
        .single()

      if (profileError) {
        return { success: false, error: 'Error al obtener foto actual' }
      }

      // Si hay foto, eliminar del bucket
      if (profileData.foto_perfil) {
        const deleteResult = await AvatarService.deleteAvatar(profileData.foto_perfil)
        
        if (deleteResult.error) {
          console.warn('Error eliminando del bucket:', deleteResult.error)
        }
      }

      // Actualizar en base de datos
      const updateResult = await AvatarService.updateUserAvatar(user.id, null)

      if (updateResult.error) {
        return { success: false, error: updateResult.error }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Error inesperado al eliminar foto de perfil' }
    }
  }

  /**
   * Actualizar último acceso del usuario autenticado
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async updateLastAccess() {
    try {
      // Obtener el usuario autenticado
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        return { success: false, error: 'Usuario no autenticado' }
      }

      // Actualizar último acceso con timestamp de Costa Rica
      const { data, error } = await supabase
        .from('usuarios')
        .update({ 
          ultimo_acceso: getTimestampCostaRica(),
          fecha_modificacion: getTimestampCostaRica()
        })
        .eq('id', user.id)
        .select()

      if (error) {
        console.error('Error al actualizar último acceso:', error)
        return { success: false, error: error.message }
      }

      console.log('✅ Último acceso actualizado (Costa Rica):', data)
      return { success: true, data }
    } catch (error) {
      console.error('Error inesperado al actualizar último acceso:', error)
      return { success: false, error: 'Error inesperado al actualizar último acceso' }
    }
  }
}

export default UserService
