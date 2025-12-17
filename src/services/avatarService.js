import { supabase } from '@/config/supabase'

const BUCKET_NAME = 'fotos_perfil'
const FOLDER_NAME = 'fotos_perfil'

export class AvatarService {
  /**
   * Subir/Actualizar foto de perfil
   * Elimina la anterior automáticamente
   */
  static async uploadAvatar(file, userId, oldAvatarPath = null) {
    try {
      // Validar que sea imagen
      if (!file.type.startsWith('image/')) {
        return { path: null, url: null, error: 'El archivo debe ser una imagen' }
      }

      // Validar tamaño (2MB máximo)
      const maxSize = 2 * 1024 * 1024
      if (file.size > maxSize) {
        return { path: null, url: null, error: 'La imagen no debe superar 2MB' }
      }

      // Generar nombre único
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${FOLDER_NAME}/${userId}/${fileName}`

      // Si hay foto anterior, eliminarla primero
      if (oldAvatarPath) {
        await this.deleteAvatar(oldAvatarPath)
      }

      // Subir nueva foto
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Error subiendo avatar:', error)
        return { path: null, url: null, error: error.message }
      }

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path)

      return { 
        path: data.path, 
        url: urlData.publicUrl, 
        error: null 
      }
    } catch (error) {
      console.error('Error inesperado:', error)
      return { path: null, url: null, error: 'Error al subir foto' }
    }
  }

  /**
   * Eliminar foto de perfil
   */
  static async deleteAvatar(path) {
    try {
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([path])

      if (error) {
        console.error('Error eliminando avatar:', error)
        return { error: error.message }
      }

      return { error: null }
    } catch (error) {
      console.error('Error inesperado eliminando:', error)
      return { error: 'Error al eliminar foto' }
    }
  }

  /**
   * Obtener URL pública de un avatar
   */
  static getPublicUrl(path) {
    if (!path) return null
    
    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(path)
    
    return data.publicUrl
  }

  /**
   * Actualizar avatar en la tabla usuarios
   */
  static async updateUserAvatar(userId, avatarPath) {
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ 
          foto_perfil: avatarPath,
          fecha_modificacion: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) {
        console.error('Error actualizando usuario:', error)
        return { error: error.message }
      }

      return { error: null }
    } catch (error) {
      console.error('Error inesperado:', error)
      return { error: 'Error al actualizar perfil' }
    }
  }
}

export default AvatarService
