import { supabase } from '@/config/supabase'
import { getTimestampCostaRica, toTimestampCostaRica } from '@/utils/dateHelper'

export class ProductoService {
  /**
   * Obtener todos los productos
   * @param {object} filters - Filtros opcionales
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  static async getAllProductos(filters = {}) {
    try {
      console.log('🔍 getAllProductos - Iniciando query con filtros:', filters)
      
      let query = supabase
        .from('productos')
        .select(`
          *,
          categoria:categoria_id(
            id,
            nombre,
            color,
            icono
          ),
          recetas:recetas_producto(
            id,
            cantidad,
            observaciones,
            receta:receta_id(
              id,
              nombre,
              codigo,
              tiempo_preparacion,
              rendimiento,
              costo_total
            )
          ),
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
        .order('fecha_creacion', { ascending: false })

      // Aplicar filtros
      if (filters.activo !== undefined) {
        query = query.eq('activo', filters.activo)
      }
      if (filters.categoria_id) {
        query = query.eq('categoria_id', filters.categoria_id)
      }
      if (filters.nombre) {
        query = query.ilike('nombre', `%${filters.nombre}%`)
      }

      const { data, error } = await query

      console.log('🔍 getAllProductos - Resultado query:', { data, error })

      if (error) {
        console.error('❌ getAllProductos - Error:', error)
        return { success: false, error: error.message }
      }

      console.log('✅ getAllProductos - Datos obtenidos:', data?.length || 0, 'productos')
      return { success: true, data }
    } catch (error) {
      console.error('❌ getAllProductos - Error inesperado:', error)
      return { success: false, error: 'Error inesperado al obtener productos' }
    }
  }

  /**
   * Obtener un producto por ID
   * @param {string} productoId - ID del producto
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async getProductoById(productoId) {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select(`
          *,
          categoria:categoria_id(
            id,
            nombre,
            color,
            icono
          ),
          recetas:recetas_producto(
            id,
            cantidad,
            observaciones,
            receta:receta_id(
              id,
              nombre,
              codigo,
              tiempo_preparacion,
              rendimiento,
              costo_total
            )
          )
        `)
        .eq('id', productoId)
        .single()

      if (error) {
        console.error('❌ getProductoById - Error:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      console.error('❌ getProductoById - Error inesperado:', error)
      return { success: false, error: 'Error inesperado al obtener producto' }
    }
  }

  /**
   * Crear un nuevo producto
   * @param {object} productoData - Datos del producto
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async createProducto(productoData) {
    try {
      console.log('📝 createProducto - Datos recibidos:', productoData)

      // Generar código único si no se proporciona
      let codigo = productoData.codigo
      if (!codigo) {
        console.log('🔢 Generando código de producto...')
        try {
          const { data: productosExistentes, error: errorCodigo } = await supabase
            .from('productos')
            .select('codigo')
            .order('fecha_creacion', { ascending: false })
            .limit(1)

          if (errorCodigo) {
            console.error('❌ Error al obtener último código:', errorCodigo)
          }

          console.log('📋 Productos existentes:', productosExistentes)
          const ultimoCodigo = productosExistentes?.[0]?.codigo || 'PROD-000'
          console.log('📋 Último código encontrado:', ultimoCodigo)
          const numero = parseInt(ultimoCodigo.split('-')[1]) + 1
          codigo = `PROD-${String(numero).padStart(3, '0')}`
          console.log('✅ Código generado:', codigo)
        } catch (codigoError) {
          console.error('❌ Error al generar código:', codigoError)
          codigo = 'PROD-001' // Código por defecto si falla
        }
      }

      console.log('💾 Insertando producto en la base de datos...')
      const productoInsert = {
        codigo: codigo,
        nombre: productoData.nombre,
        descripcion: productoData.descripcion || null,
        categoria_id: productoData.categoria_id,
        precio_venta: productoData.precio_venta,
        costo_total: productoData.costo_total || 0.0,
        margen_ganancia: productoData.margen_ganancia || 0.0,
        activo: productoData.activo !== undefined ? productoData.activo : true,
        creado_por: productoData.creado_por,
        fecha_creacion: getTimestampCostaRica(),
        fecha_modificacion: getTimestampCostaRica()
      }

      console.log('📤 Datos a insertar:', productoInsert)

      // Crear el producto
      const { data, error } = await supabase
        .from('productos')
        .insert([productoInsert])
        .select()
        .single()

      if (error) {
        console.error('❌ Error al crear producto en BD:', error)
        return { success: false, error: error.message }
      }

      console.log('✅ Producto creado exitosamente:', data)
      
      // Si hay recetas asociadas, crear las relaciones
      if (productoData.recetas && productoData.recetas.length > 0) {
        console.log('🔗 Creando relaciones de recetas...')
        console.log('📋 Recetas a asociar:', productoData.recetas)

        const recetasRelaciones = productoData.recetas.map(receta => ({
          producto_id: data.id,
          receta_id: receta.receta_id,
          cantidad: receta.cantidad || 1,
          observaciones: receta.observaciones || null,
          fecha_creacion: getTimestampCostaRica(),
          fecha_modificacion: getTimestampCostaRica()
        }))

        console.log('📤 Datos de relaciones a insertar:', recetasRelaciones)

        const { error: errorRecetas } = await supabase
          .from('recetas_producto')
          .insert(recetasRelaciones)

        if (errorRecetas) {
          console.error('❌ Error al crear relaciones de recetas:', errorRecetas)
          // No fallamos la creación del producto, solo registramos el error
        } else {
          console.log('✅ Relaciones de recetas creadas exitosamente')
        }
      }

      console.log('🎉 createProducto completado exitosamente')
      return { success: true, data }
    } catch (error) {
      console.error('❌ Error inesperado al crear producto:', error)
      return { success: false, error: 'Error inesperado al crear producto' }
    }
  }

  /**
   * Actualizar un producto existente
   * @param {string} productoId - ID del producto
   * @param {object} productoData - Datos actualizados del producto
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async updateProducto(productoId, productoData) {
    try {
      console.log('📝 updateProducto - Datos recibidos:', { productoId, productoData })
      
      // Actualizar el producto
      const { data, error } = await supabase
        .from('productos')
        .update({
          nombre: productoData.nombre,
          descripcion: productoData.descripcion || null,
          categoria_id: productoData.categoria_id,
          precio_venta: productoData.precio_venta,
          costo_total: productoData.costo_total || 0.0,
          margen_ganancia: productoData.margen_ganancia || 0.0,
          activo: productoData.activo !== undefined ? productoData.activo : true,
          modificado_por: productoData.modificado_por,
          fecha_modificacion: getTimestampCostaRica()
        })
        .eq('id', productoId)
        .select()
        .single()

      if (error) {
        console.error('❌ Error al actualizar producto:', error)
        return { success: false, error: error.message }
      }

      console.log('✅ Producto actualizado:', data)
      
      // Actualizar relaciones de recetas si se proporcionan
      if (productoData.recetas !== undefined) {
        // Primero eliminar relaciones existentes
        const { error: errorDelete } = await supabase
          .from('recetas_producto')
          .delete()
          .eq('producto_id', productoId)

        if (errorDelete) {
          console.error('❌ Error al eliminar relaciones de recetas:', errorDelete)
        }

        // Luego crear las nuevas relaciones
        if (productoData.recetas && productoData.recetas.length > 0) {
          const recetasRelaciones = productoData.recetas.map(receta => ({
            producto_id: productoId,
            receta_id: receta.receta_id,
            cantidad: receta.cantidad || 1,
            observaciones: receta.observaciones || null,
            fecha_creacion: getTimestampCostaRica(),
            fecha_modificacion: getTimestampCostaRica()
          }))

          const { error: errorRecetas } = await supabase
            .from('recetas_producto')
            .insert(recetasRelaciones)

          if (errorRecetas) {
            console.error('❌ Error al crear relaciones de recetas:', errorRecetas)
          }
        }
      }

      return { success: true, data }
    } catch (error) {
      console.error('❌ Error inesperado al actualizar producto:', error)
      return { success: false, error: 'Error inesperado al actualizar producto' }
    }
  }

  /**
   * Eliminar un producto
   * @param {string} productoId - ID del producto
   * @param {string} usuarioId - ID del usuario que elimina
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async deleteProducto(productoId, usuarioId) {
    try {
      console.log('🗑️ deleteProducto - Datos recibidos:', { productoId, usuarioId })
      
      // Primero eliminar relaciones con recetas
      const { error: errorRecetas } = await supabase
        .from('recetas_producto')
        .delete()
        .eq('producto_id', productoId)

      if (errorRecetas) {
        console.error('❌ Error al eliminar relaciones de recetas:', errorRecetas)
        return { success: false, error: errorRecetas.message }
      }
      
      // Eliminar el producto
      const { error } = await supabase
        .from('productos')
        .delete()
        .eq('id', productoId)

      if (error) {
        console.error('❌ Error al eliminar producto:', error)
        return { success: false, error: error.message }
      }

      console.log('✅ Producto eliminado exitosamente')
      return { success: true }
    } catch (error) {
      console.error('❌ Error inesperado al eliminar producto:', error)
      return { success: false, error: 'Error inesperado al eliminar producto' }
    }
  }

  /**
   * Obtener estadísticas de productos
   * @param {object} filters - Filtros opcionales
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async getProductoStats(filters = {}) {
    try {
      let query = supabase
        .from('productos')
        .select('precio_venta, costo_total, margen_ganancia, ventas_registradas, categoria_id')

      // Aplicar filtros
      if (filters.activo !== undefined) {
        query = query.eq('activo', filters.activo)
      }
      if (filters.categoria_id) {
        query = query.eq('categoria_id', filters.categoria_id)
      }

      const { data, error } = await query

      if (error) {
        return { success: false, error: error.message }
      }

      // Calcular estadísticas
      const stats = {
        totalProductos: data.length,
        productosActivos: data.filter(p => p.activo).length,
        precioPromedio: data.reduce((sum, p) => sum + parseFloat(p.precio_venta || 0), 0) / data.length,
        margenPromedio: data.reduce((sum, p) => sum + parseFloat(p.margen_ganancia || 0), 0) / data.length,
        totalVentas: data.reduce((sum, p) => sum + (p.ventas_registradas || 0), 0),
        productosPorCategoria: {}
      }

      // Agrupar por categoría
      data.forEach(producto => {
        const catId = producto.categoria_id
        if (!stats.productosPorCategoria[catId]) {
          stats.productosPorCategoria[catId] = 0
        }
        stats.productosPorCategoria[catId]++
      })

      return { success: true, data: stats }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener estadísticas' }
    }
  }

  /**
   * Buscar productos por término
   * @param {string} searchTerm - Término de búsqueda
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  static async searchProductos(searchTerm) {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select(`
          *,
          categoria:categoria_id(
            id,
            nombre,
            color,
            icono
          )
        `)
        .or(`nombre.ilike.%${searchTerm}%,codigo.ilike.%${searchTerm}%,descripcion.ilike.%${searchTerm}%`)
        .order('nombre')

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al buscar productos' }
    }
  }

  /**
   * Actualizar contador de ventas de un producto
   * @param {string} productoId - ID del producto
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async actualizarVentasProducto(productoId) {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select('ventas_registradas')
        .eq('id', productoId)
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      const nuevasVentas = (data.ventas_registradas || 0) + 1

      const { error: updateError } = await supabase
        .from('productos')
        .update({
          ventas_registradas: nuevasVentas,
          ultima_venta: getTimestampCostaRica(),
          fecha_modificacion: getTimestampCostaRica()
        })
        .eq('id', productoId)

      if (updateError) {
        return { success: false, error: updateError.message }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Error inesperado al actualizar ventas' }
    }
  }
}