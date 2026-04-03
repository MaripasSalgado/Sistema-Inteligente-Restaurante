import { supabase } from '@/config/supabase'
import { getTimestampCostaRica } from '@/utils/dateHelper'

export class CategoriaRecetaService {
  /**
   * Obtener todas las categorías de recetas
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  static async getAllCategorias() {
    try {
      const { data, error } = await supabase
        .from('categorias_recetas')
        .select('*')
        .order('nombre', { ascending: true })
      if (error) {
        console.error('❌ getAllCategorias - Error:', error)
        return { success: false, error: error.message }
      }
      return { success: true, data }
    } catch (error) {
      console.error('❌ getAllCategorias - Error inesperado:', error)
      return { success: false, error: 'Error inesperado al obtener categorías' }
    }
  }

  /**
   * Obtener una categoría por ID
   * @param {string} categoriaId - ID de la categoría
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async getCategoriaById(categoriaId) {
    try {
      const { data, error } = await supabase
        .from('categorias_recetas')
        .select('*')
        .eq('id', categoriaId)
        .single()

      if (error) {
        console.error('❌ getCategoriaById - Error:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      console.error('❌ getCategoriaById - Error inesperado:', error)
      return { success: false, error: 'Error inesperado al obtener categoría' }
    }
  }

  /**
   * Crear una nueva categoría de receta
   * @param {object} categoriaData - Datos de la categoría
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async createCategoria(categoriaData) {
    try {
      if (!categoriaData.creado_por) {
        console.error('❌ No se proporcionó creado_por')
        return { success: false, error: 'Debe estar autenticado para crear categorías' }
      }

      const { data, error } = await supabase
        .from('categorias_recetas')
        .insert([{
          nombre: categoriaData.nombre,
          descripcion: categoriaData.descripcion || null,
          color: categoriaData.color || '#3B82F6',
          icono: categoriaData.icono || '🥟',
          activa: categoriaData.activa !== undefined ? categoriaData.activa : true,
          creado_por: categoriaData.creado_por,
          fecha_creacion: getTimestampCostaRica(),
          fecha_modificacion: getTimestampCostaRica()
        }])
        .select()
        .single()

      if (error) {
        console.error('❌ Error al crear categoría:', error)

        // Manejar errores específicos
        let errorMessage = error.message

        if (error.code === '23505') {
          // Unique constraint violation
          errorMessage = `Ya existe una categoría con el nombre "${categoriaData.nombre}". Por favor, usa otro nombre.`
        } else if (error.code === '23503') {
          // Foreign key violation
          errorMessage = 'Error: El usuario no existe en el sistema. Por favor, contacta al administrador.'
        }

        return { success: false, error: errorMessage }
      }
      return { success: true, data }
    } catch (error) {
      console.error('❌ Error inesperado al crear categoría:', error)
      return { success: false, error: 'Error inesperado al crear categoría' }
    }
  }

  /**
   * Actualizar una categoría existente
   * @param {string} categoriaId - ID de la categoría
   * @param {object} categoriaData - Datos actualizados de la categoría
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async updateCategoria(categoriaId, categoriaData) {
    try {
      if (!categoriaData.modificado_por) {
        console.error('❌ No se proporcionó modificado_por')
        return { success: false, error: 'Debe estar autenticado para actualizar categorías' }
      }

      const { data, error } = await supabase
        .from('categorias_recetas')
        .update({
          nombre: categoriaData.nombre,
          descripcion: categoriaData.descripcion || null,
          color: categoriaData.color || '#3B82F6',
          icono: categoriaData.icono || '🥟',
          activa: categoriaData.activa !== undefined ? categoriaData.activa : true,
          modificado_por: categoriaData.modificado_por,
          fecha_modificacion: getTimestampCostaRica()
        })
        .eq('id', categoriaId)
        .select()
        .single()

      if (error) {
        console.error('❌ Error al actualizar categoría:', error)
        return { success: false, error: error.message }
      }
      return { success: true, data }
    } catch (error) {
      console.error('❌ Error inesperado al actualizar categoría:', error)
      return { success: false, error: 'Error inesperado al actualizar categoría' }
    }
  }

  /**
   * Eliminar una categoría
   * @param {string} categoriaId - ID de la categoría
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async deleteCategoria(categoriaId) {
    try {
      // Verificar si hay recetas asociadas
      const { data: recetasAsociadas, error: errorRecetas } = await supabase
        .from('recetas')
        .select('id')
        .eq('categoria_id', categoriaId)
        .limit(1)

      if (errorRecetas) {
        console.error('❌ Error al verificar recetas asociadas:', errorRecetas)
        return { success: false, error: errorRecetas.message }
      }

      if (recetasAsociadas && recetasAsociadas.length > 0) {
        return { 
          success: false, 
          error: 'No se puede eliminar la categoría porque tiene recetas asociadas' 
        }
      }
      
      // Eliminar la categoría
      const { error } = await supabase
        .from('categorias_recetas')
        .delete()
        .eq('id', categoriaId)

      if (error) {
        console.error('❌ Error al eliminar categoría:', error)
        return { success: false, error: error.message }
      }
      return { success: true }
    } catch (error) {
      console.error('❌ Error inesperado al eliminar categoría:', error)
      return { success: false, error: 'Error inesperado al eliminar categoría' }
    }
  }

  /**
   * Obtener estadísticas de categorías
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async getCategoriaStats() {
    try {
      const { data: categorias, error: errorCategorias } = await supabase
        .from('categorias_recetas')
        .select('id, nombre')

      if (errorCategorias) {
        return { success: false, error: errorCategorias.message }
      }

      const stats = {}

      // Para cada categoría, contar recetas
      for (const categoria of categorias) {
        const { data: recetas, error: errorRecetas } = await supabase
          .from('recetas')
          .select('id, activa')
          .eq('categoria_id', categoria.id)

        if (errorRecetas) {
          console.error(`❌ Error al contar recetas para categoría ${categoria.id}:`, errorRecetas)
          continue
        }

        stats[categoria.id] = {
          nombre: categoria.nombre,
          total: recetas.length,
          activas: recetas.filter(r => r.activa).length,
          inactivas: recetas.filter(r => !r.activa).length
        }
      }

      return { success: true, data: stats }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener estadísticas' }
    }
  }
}