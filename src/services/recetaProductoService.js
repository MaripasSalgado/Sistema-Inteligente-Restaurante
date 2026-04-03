import { supabase } from '@/config/supabase'
import { getTimestampCostaRica } from '@/utils/dateHelper'

export class RecetaProductoService {
  /**
   * Obtener todas las relaciones receta-producto
   * @param {object} filters - Filtros opcionales
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  static async getAllRecetasProducto(filters = {}) {
    try {
      let query = supabase
        .from('recetas_producto')
        .select(`
          *,
          producto:producto_id(
            id,
            nombre,
            codigo,
            precio_venta
          ),
          receta:receta_id(
            id,
            nombre,
            codigo,
            tiempo_preparacion,
            rendimiento,
            costo_total
          )
        `)
        .order('fecha_creacion', { ascending: false })

      // Aplicar filtros
      if (filters.producto_id) {
        query = query.eq('producto_id', filters.producto_id)
      }
      if (filters.receta_id) {
        query = query.eq('receta_id', filters.receta_id)
      }

      const { data, error } = await query
      if (error) {
        console.error('❌ getAllRecetasProducto - Error:', error)
        return { success: false, error: error.message }
      }
      return { success: true, data }
    } catch (error) {
      console.error('❌ getAllRecetasProducto - Error inesperado:', error)
      return { success: false, error: 'Error inesperado al obtener relaciones receta-producto' }
    }
  }

  /**
   * Obtener recetas asociadas a un producto
   * @param {string} productoId - ID del producto
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  static async getRecetasByProducto(productoId) {
    try {
      const { data, error } = await supabase
        .from('recetas_producto')
        .select(`
          *,
          receta:receta_id(
            id,
            nombre,
            codigo,
            tiempo_preparacion,
            rendimiento,
            costo_total,
            categoria:categoria_id(
              id,
              nombre,
              color,
              icono
            )
          )
        `)
        .eq('producto_id', productoId)
        .order('fecha_creacion', { ascending: false })

      if (error) {
        console.error('❌ getRecetasByProducto - Error:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      console.error('❌ getRecetasByProducto - Error inesperado:', error)
      return { success: false, error: 'Error inesperado al obtener recetas del producto' }
    }
  }

  /**
   * Obtener productos asociados a una receta
   * @param {string} recetaId - ID de la receta
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  static async getProductosByReceta(recetaId) {
    try {
      const { data, error } = await supabase
        .from('recetas_producto')
        .select(`
          *,
          producto:producto_id(
            id,
            nombre,
            codigo,
            precio_venta,
            categoria:categoria_id(
              id,
              nombre,
              color,
              icono
            )
          )
        `)
        .eq('receta_id', recetaId)
        .order('fecha_creacion', { ascending: false })

      if (error) {
        console.error('❌ getProductosByReceta - Error:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      console.error('❌ getProductosByReceta - Error inesperado:', error)
      return { success: false, error: 'Error inesperado al obtener productos de la receta' }
    }
  }

  /**
   * Crear una nueva relación receta-producto
   * @param {object} relacionData - Datos de la relación
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async createRelacion(relacionData) {
    try {
      // Verificar si ya existe la relación
      const { data: existente, error: errorCheck } = await supabase
        .from('recetas_producto')
        .select('id')
        .eq('producto_id', relacionData.producto_id)
        .eq('receta_id', relacionData.receta_id)
        .single()

      if (errorCheck && errorCheck.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('❌ Error al verificar relación existente:', errorCheck)
        return { success: false, error: errorCheck.message }
      }

      if (existente) {
        return { success: false, error: 'Esta receta ya está asociada a este producto' }
      }
      
      // Crear la relación
      const { data, error } = await supabase
        .from('recetas_producto')
        .insert([{
          producto_id: relacionData.producto_id,
          receta_id: relacionData.receta_id,
          cantidad: relacionData.cantidad || 1,
          observaciones: relacionData.observaciones || null,
          fecha_creacion: getTimestampCostaRica(),
          fecha_modificacion: getTimestampCostaRica()
        }])
        .select()
        .single()

      if (error) {
        console.error('❌ Error al crear relación:', error)
        return { success: false, error: error.message }
      }
      return { success: true, data }
    } catch (error) {
      console.error('❌ Error inesperado al crear relación:', error)
      return { success: false, error: 'Error inesperado al crear relación receta-producto' }
    }
  }

  /**
   * Actualizar una relación receta-producto existente
   * @param {string} relacionId - ID de la relación
   * @param {object} relacionData - Datos actualizados de la relación
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async updateRelacion(relacionId, relacionData) {
    try {
      // Actualizar la relación
      const { data, error } = await supabase
        .from('recetas_producto')
        .update({
          cantidad: relacionData.cantidad || 1,
          observaciones: relacionData.observaciones || null,
          fecha_modificacion: getTimestampCostaRica()
        })
        .eq('id', relacionId)
        .select()
        .single()

      if (error) {
        console.error('❌ Error al actualizar relación:', error)
        return { success: false, error: error.message }
      }
      return { success: true, data }
    } catch (error) {
      console.error('❌ Error inesperado al actualizar relación:', error)
      return { success: false, error: 'Error inesperado al actualizar relación receta-producto' }
    }
  }

  /**
   * Eliminar una relación receta-producto
   * @param {string} relacionId - ID de la relación
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async deleteRelacion(relacionId) {
    try {
      // Eliminar la relación
      const { error } = await supabase
        .from('recetas_producto')
        .delete()
        .eq('id', relacionId)

      if (error) {
        console.error('❌ Error al eliminar relación:', error)
        return { success: false, error: error.message }
      }
      return { success: true }
    } catch (error) {
      console.error('❌ Error inesperado al eliminar relación:', error)
      return { success: false, error: 'Error inesperado al eliminar relación receta-producto' }
    }
  }

  /**
   * Eliminar todas las relaciones de un producto
   * @param {string} productoId - ID del producto
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async deleteRelacionesByProducto(productoId) {
    try {
      // Eliminar todas las relaciones del producto
      const { error } = await supabase
        .from('recetas_producto')
        .delete()
        .eq('producto_id', productoId)

      if (error) {
        console.error('❌ Error al eliminar relaciones del producto:', error)
        return { success: false, error: error.message }
      }
      return { success: true }
    } catch (error) {
      console.error('❌ Error inesperado al eliminar relaciones del producto:', error)
      return { success: false, error: 'Error inesperado al eliminar relaciones del producto' }
    }
  }

  /**
   * Eliminar todas las relaciones de una receta
   * @param {string} recetaId - ID de la receta
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async deleteRelacionesByReceta(recetaId) {
    try {
      // Eliminar todas las relaciones de la receta
      const { error } = await supabase
        .from('recetas_producto')
        .delete()
        .eq('receta_id', recetaId)

      if (error) {
        console.error('❌ Error al eliminar relaciones de la receta:', error)
        return { success: false, error: error.message }
      }
      return { success: true }
    } catch (error) {
      console.error('❌ Error inesperado al eliminar relaciones de la receta:', error)
      return { success: false, error: 'Error inesperado al eliminar relaciones de la receta' }
    }
  }

  /**
   * Sincronizar relaciones de un producto (eliminar todas y crear las nuevas)
   * @param {string} productoId - ID del producto
   * @param {array} recetas - Lista de recetas a asociar
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  static async sincronizarRecetasProducto(productoId, recetas) {
    try {
      // Primero eliminar todas las relaciones existentes
      const deleteResult = await this.deleteRelacionesByProducto(productoId)
      if (!deleteResult.success) {
        return { success: false, error: deleteResult.error }
      }
      
      // Si no hay recetas nuevas, terminar aquí
      if (!recetas || recetas.length === 0) {
        return { success: true, data: [] }
      }
      
      // Crear las nuevas relaciones
      const nuevasRelaciones = recetas.map(receta => ({
        producto_id: productoId,
        receta_id: receta.receta_id,
        cantidad: receta.cantidad || 1,
        observaciones: receta.observaciones || null,
        fecha_creacion: getTimestampCostaRica(),
        fecha_modificacion: getTimestampCostaRica()
      }))

      const { data, error } = await supabase
        .from('recetas_producto')
        .insert(nuevasRelaciones)
        .select()

      if (error) {
        console.error('❌ Error al crear nuevas relaciones:', error)
        return { success: false, error: error.message }
      }
      return { success: true, data }
    } catch (error) {
      console.error('❌ Error inesperado al sincronizar relaciones:', error)
      return { success: false, error: 'Error inesperado al sincronizar relaciones receta-producto' }
    }
  }
}