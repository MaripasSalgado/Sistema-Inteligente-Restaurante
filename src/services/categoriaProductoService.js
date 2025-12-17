import { supabase } from '@/config/supabase'
import { getTimestampCostaRica } from '@/utils/dateHelper'

export class CategoriaProductoService {
  /**
   * Obtener todas las categorías de productos
   * @param {object} filters - Filtros opcionales
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  static async getAllCategorias(filters = {}) {
    try {
      console.log('🔍 getAllCategorias - Iniciando query con filtros:', filters)
      
      let query = supabase
        .from('categorias_productos')
        .select(`
          *,
          creado_por:creado_por(
            id,
            nombre,
            apellido
          ),
          modificado_por:modificado_por(
            id,
            nombre,
            apellido
          )
        `)
        .order('nombre')

      // Aplicar filtros
      if (filters.activa !== undefined) {
        query = query.eq('activa', filters.activa)
      }

      const { data, error } = await query

      console.log('🔍 getAllCategorias - Resultado query:', { data, error })

      if (error) {
        console.error('❌ getAllCategorias - Error:', error)
        return { success: false, error: error.message }
      }

      console.log('✅ getAllCategorias - Datos obtenidos:', data?.length || 0, 'categorías')
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
        .from('categorias_productos')
        .select(`
          *,
          creado_por:creado_por(
            id,
            nombre,
            apellido
          ),
          modificado_por:modificado_por(
            id,
            nombre,
            apellido
          )
        `)
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
   * Crear una nueva categoría
   * @param {object} categoriaData - Datos de la categoría
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async createCategoria(categoriaData) {
    try {
      console.log('📝 createCategoria - Datos recibidos:', categoriaData)
      
      // Crear la categoría
      const { data, error } = await supabase
        .from('categorias_productos')
        .insert([{
          nombre: categoriaData.nombre,
          descripcion: categoriaData.descripcion || null,
          color: categoriaData.color || '#3B82F6',
          icono: categoriaData.icono || '📦',
          activa: categoriaData.activa !== undefined ? categoriaData.activa : true,
          creado_por: categoriaData.creado_por,
          fecha_creacion: getTimestampCostaRica(),
          fecha_modificacion: getTimestampCostaRica()
        }])
        .select()
        .single()

      if (error) {
        console.error('❌ Error al crear categoría:', error)
        return { success: false, error: error.message }
      }

      console.log('✅ Categoría creada:', data)
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
      console.log('📝 updateCategoria - Datos recibidos:', { categoriaId, categoriaData })
      
      // Actualizar la categoría
      const { data, error } = await supabase
        .from('categorias_productos')
        .update({
          nombre: categoriaData.nombre,
          descripcion: categoriaData.descripcion || null,
          color: categoriaData.color || '#3B82F6',
          icono: categoriaData.icono || '📦',
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

      console.log('✅ Categoría actualizada:', data)
      return { success: true, data }
    } catch (error) {
      console.error('❌ Error inesperado al actualizar categoría:', error)
      return { success: false, error: 'Error inesperado al actualizar categoría' }
    }
  }

  /**
   * Eliminar una categoría
   * @param {string} categoriaId - ID de la categoría
   * @param {string} usuarioId - ID del usuario que elimina
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async deleteCategoria(categoriaId, usuarioId) {
    try {
      console.log('🗑️ deleteCategoria - Datos recibidos:', { categoriaId, usuarioId })
      
      // Verificar si hay productos asociados
      const { data: productosAsociados, error: errorCheck } = await supabase
        .from('productos')
        .select('id')
        .eq('categoria_id', categoriaId)
        .limit(1)

      if (errorCheck) {
        console.error('❌ Error al verificar productos asociados:', errorCheck)
        return { success: false, error: errorCheck.message }
      }

      if (productosAsociados && productosAsociados.length > 0) {
        return { 
          success: false, 
          error: 'No se puede eliminar la categoría porque tiene productos asociados' 
        }
      }
      
      // Eliminar la categoría
      const { error } = await supabase
        .from('categorias_productos')
        .delete()
        .eq('id', categoriaId)

      if (error) {
        console.error('❌ Error al eliminar categoría:', error)
        return { success: false, error: error.message }
      }

      console.log('✅ Categoría eliminada exitosamente')
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
      // Obtener todas las categorías con conteo de productos
      const { data, error } = await supabase
        .from('categorias_productos')
        .select(`
          *,
          productos:productos(id)
        `)
        .order('nombre')

      if (error) {
        return { success: false, error: error.message }
      }

      // Calcular estadísticas
      const stats = {
        totalCategorias: data.length,
        categoriasActivas: data.filter(c => c.activa).length,
        productosPorCategoria: data.map(cat => ({
          id: cat.id,
          nombre: cat.nombre,
          color: cat.color,
          icono: cat.icono,
          cantidadProductos: cat.productos ? cat.productos.length : 0
        }))
      }

      return { success: true, data: stats }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener estadísticas' }
    }
  }

  /**
   * Buscar categorías por término
   * @param {string} searchTerm - Término de búsqueda
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  static async searchCategorias(searchTerm) {
    try {
      const { data, error } = await supabase
        .from('categorias_productos')
        .select('*')
        .or(`nombre.ilike.%${searchTerm}%,descripcion.ilike.%${searchTerm}%`)
        .order('nombre')

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al buscar categorías' }
    }
  }

  /**
   * Activar o desactivar una categoría
   * @param {string} categoriaId - ID de la categoría
   * @param {boolean} activa - Estado a establecer
   * @param {string} usuarioId - ID del usuario que realiza el cambio
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async toggleCategoria(categoriaId, activa, usuarioId) {
    try {
      const { error } = await supabase
        .from('categorias_productos')
        .update({
          activa: activa,
          modificado_por: usuarioId,
          fecha_modificacion: getTimestampCostaRica()
        })
        .eq('id', categoriaId)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Error inesperado al cambiar estado de categoría' }
    }
  }
}