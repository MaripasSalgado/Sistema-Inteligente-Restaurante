import { supabase } from '@/config/supabase'

/**
 * Servicio para manejar Storage de Supabase
 */
export class StorageService {
  static BUCKET_NAME = 'fotos_perfil' // Nombre de tu bucket

  /**
   * Subir una foto
   * @param {File} file - Archivo a subir
   * @param {string} folder - Carpeta opcional (ej: 'avatares', 'productos')
   * @returns {Promise<{url: string|null, path: string|null, error: string|null}>}
   */
  static async uploadFoto(file, folder = '') {
    try {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        return { url: null, path: null, error: 'El archivo debe ser una imagen' }
      }

      // Validar tamaño (5MB máximo)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        return { url: null, path: null, error: 'La imagen no debe superar 5MB' }
      }

      // Obtener usuario actual
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { url: null, path: null, error: 'Usuario no autenticado' }
      }

      // Generar nombre único para el archivo
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
      
      // Construir ruta simple: solo fileName (evita problemas con RLS)
      const filePath = fileName

      // Subir archivo
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Error subiendo foto:', error)
        console.error('Detalles del error:', {
          message: error.message,
          statusCode: error.statusCode,
          error: error.error,
          filePath: filePath,
          bucketName: this.BUCKET_NAME,
          userId: user.id
        })
        return { url: null, path: null, error: `Error subiendo foto: ${error.message}` }
      }

      // Obtener URL pública (para bucket público) o signed URL (para privado)
      const url = await this.getPublicUrl(data.path)

      return { url, path: data.path, error: null }
    } catch (error) {
      console.error('Error inesperado subiendo foto:', error)
      return { url: null, path: null, error: 'Error inesperado al subir foto' }
    }
  }

  /**
   * Obtener URL pública o firmada de una foto
   * @param {string} path - Ruta del archivo en el bucket
   * @returns {Promise<string|null>}
   */
  static async getPublicUrl(path) {
    try {
      // Si el bucket es PÚBLICO
      const { data } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(path)
      
      return data.publicUrl

      // Si el bucket es PRIVADO, usa esto en su lugar:
      /*
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .createSignedUrl(path, 60 * 60) // URL válida por 1 hora
      
      if (error) {
        console.error('Error obteniendo URL:', error.message)
        return null
      }
      
      return data.signedUrl
      */
    } catch (error) {
      console.error('Error obteniendo URL:', error)
      return null
    }
  }

  /**
   * Eliminar una foto
   * @param {string} path - Ruta del archivo
   * @returns {Promise<{error: string|null}>}
   */
  static async deleteFoto(path) {
    try {
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([path])

      if (error) {
        console.error('Error eliminando foto:', error.message)
        return { error: error.message }
      }

      return { error: null }
    } catch (error) {
      console.error('Error inesperado eliminando foto:', error)
      return { error: 'Error inesperado al eliminar foto' }
    }
  }

  /**
   * Listar fotos de un usuario
   * @param {string} folder - Carpeta opcional
   * @returns {Promise<{files: array, error: string|null}>}
   */
  static async listFotos(folder = '') {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { files: [], error: 'Usuario no autenticado' }
      }

      const path = folder ? `${folder}/${user.id}` : user.id

      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(path)

      if (error) {
        console.error('Error listando fotos:', error.message)
        return { files: [], error: error.message }
      }

      return { files: data, error: null }
    } catch (error) {
      console.error('Error inesperado listando fotos:', error)
      return { files: [], error: 'Error inesperado al listar fotos' }
    }
  }
}

export default StorageService
