import { supabase } from '@/config/supabase'

export class CategoriaInsumoService {
  /**
   * Obtener todas las categorías de insumos
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  static async getAllCategorias() {
    try {
      const { data, error } = await supabase
        .from('categorias_insumos')
        .select('*')
        .eq('activa', true)
        .order('nombre', { ascending: true })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
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
        .from('categorias_insumos')
        .select('*')
        .eq('id', categoriaId)
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener categoría' }
    }
  }

  /**
   * Crear una nueva categoría
   * @param {object} categoriaData - Datos de la categoría
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async createCategoria(categoriaData) {
    try {
      const { data, error } = await supabase
        .from('categorias_insumos')
        .insert([{
          nombre: categoriaData.nombre,
          descripcion: categoriaData.descripcion || null,
          color: categoriaData.color || '#f4b400',
          icono: categoriaData.icono || null,
          activa: true,
          creado_por: categoriaData.creado_por
        }])
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al crear categoría' }
    }
  }

  /**
   * Actualizar una categoría
   * @param {string} categoriaId - ID de la categoría
   * @param {object} categoriaData - Datos actualizados de la categoría
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async updateCategoria(categoriaId, categoriaData) {
    try {
      const { data, error } = await supabase
        .from('categorias_insumos')
        .update({
          nombre: categoriaData.nombre,
          descripcion: categoriaData.descripcion || null,
          color: categoriaData.color || '#f4b400',
          icono: categoriaData.icono || null,
          modificado_por: categoriaData.modificado_por,
          fecha_modificacion: new Date().toISOString()
        })
        .eq('id', categoriaId)
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al actualizar categoría' }
    }
  }

  /**
   * Eliminar (desactivar) una categoría
   * @param {string} categoriaId - ID de la categoría
   * @param {string} modificadoPor - ID del usuario que realiza la acción
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async deleteCategoria(categoriaId, modificadoPor) {
    try {
      // Verificar si hay insumos asociados a esta categoría
      const { data: insumosAsociados, error: checkError } = await supabase
        .from('insumos_categorias')
        .select('id')
        .eq('categoria_id', categoriaId)
        .eq('activa', true)
        .limit(1)

      if (checkError) {
        return { success: false, error: checkError.message }
      }

      if (insumosAsociados && insumosAsociados.length > 0) {
        return { 
          success: false, 
          error: 'No se puede eliminar la categoría porque tiene insumos asociados' 
        }
      }

      const { error } = await supabase
        .from('categorias_insumos')
        .update({
          activa: false,
          modificado_por: modificadoPor,
          fecha_modificacion: new Date().toISOString()
        })
        .eq('id', categoriaId)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Error inesperado al eliminar categoría' }
    }
  }

  /**
   * Buscar categorías por nombre
   * @param {string} searchTerm - Término de búsqueda
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  static async searchCategorias(searchTerm) {
    try {
      const { data, error } = await supabase
        .from('categorias_insumos')
        .select('*')
        .ilike('nombre', `%${searchTerm}%`)
        .eq('activa', true)
        .order('nombre', { ascending: true })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al buscar categorías' }
    }
  }

  /**
   * Obtener estadísticas de una categoría
   * @param {string} categoriaId - ID de la categoría
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async getCategoriaStats(categoriaId) {
    try {
      // Contar insumos asociados
      const { count: totalInsumos, error: insumosError } = await supabase
        .from('insumos_categorias')
        .select('*', { count: 'exact', head: true })
        .eq('categoria_id', categoriaId)
        .eq('activa', true)

      if (insumosError) {
        return { success: false, error: insumosError.message }
      }

      // Contar lotes activos
      const { count: totalLotes, error: lotesError } = await supabase
        .from('lotes_insumos')
        .select(`
          *,
          insumo:insumos!inner(
            categorias:insumos_categorias!inner(
              categoria_id
            )
          )
        `, { count: 'exact', head: true })
        .eq('estado', 'Activo')
        .eq('insumo.categorias.categoria_id', categoriaId)

      if (lotesError) {
        return { success: false, error: lotesError.message }
      }

      return { 
        success: true, 
        data: {
          totalInsumos: totalInsumos || 0,
          totalLotes: totalLotes || 0
        }
      }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener estadísticas' }
    }
  }
}
