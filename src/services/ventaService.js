import { supabase } from '@/config/supabase'
import { getTimestampCostaRica, toTimestampCostaRica } from '@/utils/dateHelper'
import { procesarDescuentoDeInsumos } from './ventaInventarioService'

const generarSufijoUnico = () => {
  return Math.random().toString(36).substring(2, 5).toUpperCase()
}

const generarNumeroOrdenFallback = () => {
  const date = new Date()
  const datePart = date.toISOString().replace(/[-:TZ.]/g, '').slice(2, 12)
  return `ORD-${datePart}-${generarSufijoUnico()}`
}

const construirBaseConsecutiva = (consecutivo) => {
  if (!Number.isFinite(consecutivo) || consecutivo <= 0) {
    return null
  }
  return `ORD-${String(consecutivo).padStart(4, '0')}`
}

const esErrorNumeroDuplicado = (error) => {
  return error?.code === '23505' && error?.message?.includes('ventas_numero_orden_key')
}

export class VentaService {
  static baseSelect = `
    *,
    cliente:cliente_id (
      id,
      nombre,
      telefono,
      direccion,
      tipo_cliente
    ),
    vendedor:vendedor_id (
      id,
      nombre,
      apellido
    ),
    creado_por:creado_por (
      id,
      nombre,
      apellido
    ),
    modificado_por:modificado_por (
      id,
      nombre,
      apellido
    ),
    detalles:detalles_venta (
      id,
      producto_id,
      cantidad,
      precio_unitario,
      descuento,
      subtotal,
      observaciones,
      fecha_creacion,
      producto:producto_id (
        id,
        nombre,
        precio_venta,
        margen_ganancia
      )
    )
  `

  /**
   * Genera un número de orden incremental con formato ORD-0001
   * @returns {Promise<string>}
   */
  static async generarNumeroOrden() {
    try {
      const { data, error } = await supabase
        .from('ventas')
        .select('numero_orden')
        .order('fecha_creacion', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) {
        console.error('❌ generarNumeroOrden - Error obteniendo última orden:', error)
        return generarNumeroOrdenFallback()
      }

      const ultimoNumero = data?.numero_orden || null
      const match = ultimoNumero?.match(/ORD-(\d{4})/)
      const consecutivo = match ? parseInt(match[1], 10) + 1 : 1
      const base = construirBaseConsecutiva(consecutivo) || 'ORD-0001'
      return `${base}-${generarSufijoUnico()}`
    } catch (error) {
      console.error('❌ generarNumeroOrden - Error inesperado:', error)
      return generarNumeroOrdenFallback()
    }
  }

  /**
   * Obtener todas las ventas con filtros opcionales
   * @param {object} filters
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  static async getAllVentas(filters = {}) {
    try {
      let query = supabase
        .from('ventas')
        .select(this.baseSelect)
        .order('fecha_venta', { ascending: false })

      if (filters.estado) {
        query = query.eq('estado', filters.estado)
      }
      if (filters.tipo_venta) {
        query = query.eq('tipo_venta', filters.tipo_venta)
      }
      if (filters.desde) {
        query = query.gte('fecha_venta', filters.desde)
      }
      if (filters.hasta) {
        query = query.lte('fecha_venta', filters.hasta)
      }
      if (filters.search) {
        query = query.ilike('cliente_nombre', `%${filters.search}%`)
      }

      const { data, error } = await query

      if (error) {
        console.error('❌ getAllVentas - Error:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      console.error('❌ getAllVentas - Error inesperado:', error)
      return { success: false, error: 'Error inesperado al obtener ventas' }
    }
  }

  /**
   * Obtener una venta específica
   * @param {string} ventaId
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async getVentaById(ventaId) {
    try {
      const { data, error } = await supabase
        .from('ventas')
        .select(this.baseSelect)
        .eq('id', ventaId)
        .single()

      if (error) {
        console.error('❌ getVentaById - Error:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      console.error('❌ getVentaById - Error inesperado:', error)
      return { success: false, error: 'Error inesperado al obtener venta' }
    }
  }

  /**
   * Crear una nueva venta con detalles
   * @param {object} ventaData
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async createVenta(ventaData, { retry = false } = {}) {
    try {
      const numeroOrden = ventaData.numero_orden || await this.generarNumeroOrden()
      const timestamp = getTimestampCostaRica()

      const ventaInsert = {
        numero_orden: numeroOrden,
        cliente_id: ventaData.cliente_id || null,
        cliente_nombre: ventaData.cliente_nombre || null,
        cliente_telefono: ventaData.cliente_telefono || null,
        tipo_venta: ventaData.tipo_venta,
        estado: ventaData.estado,
        metodo_pago: ventaData.metodo_pago,
        subtotal: ventaData.subtotal || 0,
        descuento: ventaData.descuento || 0,
        impuestos: ventaData.impuestos || 0,
        total: ventaData.total || 0,
        fecha_venta: ventaData.fecha_venta ? toTimestampCostaRica(ventaData.fecha_venta) : timestamp,
        fecha_entrega: ventaData.fecha_entrega ? toTimestampCostaRica(ventaData.fecha_entrega) : null,
        direccion_entrega: ventaData.direccion_entrega || null,
        observaciones: ventaData.observaciones || null,
        vendedor_id: ventaData.vendedor_id || null,
        creado_por: ventaData.creado_por || ventaData.vendedor_id || null,
        modificado_por: ventaData.modificado_por || ventaData.creado_por || ventaData.vendedor_id || null,
        fecha_creacion: timestamp,
        fecha_modificacion: timestamp
      }

      const { data: venta, error } = await supabase
        .from('ventas')
        .insert([ventaInsert])
        .select()
        .single()

      if (error) {
        if (esErrorNumeroDuplicado(error) && !retry) {
          console.warn('⚠️ Numero de orden duplicado, intentando nuevamente con un identificador único')
          return this.createVenta({ ...ventaData, numero_orden: generarNumeroOrdenFallback() }, { retry: true })
        }
        console.error('❌ createVenta - Error al crear venta:', error)
        return { success: false, error: error.message }
      }

      if (ventaData.detalles?.length) {
        const detallesResult = await this.insertDetallesVenta(venta.id, ventaData.detalles)
        if (!detallesResult.success) {
          return detallesResult
        }

        // ===== DESCUENTO AUTOMÁTICO DE INSUMOS =====
        try {
          const detallesConVentaId = ventaData.detalles.map(detalle => ({
            venta_id: venta.id,
            producto_id: detalle.producto_id,
            cantidad: detalle.cantidad,
            precio_unitario: detalle.precio_unitario,
            descuento: detalle.descuento || 0,
            subtotal: detalle.subtotal
          }))

          const { warnings, movimientos } = await procesarDescuentoDeInsumos(
            venta.id,
            numeroOrden,
            detallesConVentaId,
            ventaInsert.creado_por
          )

          // Retornar venta con información de warnings y movimientos
          return {
            success: true,
            data: venta,
            warnings: warnings || [],
            movimientos: movimientos || []
          }
        } catch (inventarioError) {
          console.error('⚠️ Error al procesar descuento de insumos:', inventarioError)
          // No fallar la venta, solo retornar con warning
          return {
            success: true,
            data: venta,
            warnings: [{
              insumo: 'Sistema',
              cantidadNecesaria: 0,
              cantidadDisponible: 0,
              diferencia: 0,
              unidad: '',
              error: 'Error al procesar descuento automático de inventario. La venta se creó correctamente pero los insumos no se descontaron.'
            }],
            movimientos: []
          }
        }
      }

      return { success: true, data: venta, warnings: [], movimientos: [] }
    } catch (error) {
      console.error('❌ createVenta - Error inesperado:', error)
      return { success: false, error: 'Error inesperado al crear venta' }
    }
  }

  /**
   * Actualizar una venta existente
   * @param {string} ventaId
   * @param {object} ventaData
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async updateVenta(ventaId, ventaData) {
    try {
      const timestamp = getTimestampCostaRica()
      const ventaUpdate = {
        cliente_id: ventaData.cliente_id || null,
        cliente_nombre: ventaData.cliente_nombre || null,
        cliente_telefono: ventaData.cliente_telefono || null,
        tipo_venta: ventaData.tipo_venta,
        estado: ventaData.estado,
        metodo_pago: ventaData.metodo_pago,
        subtotal: ventaData.subtotal || 0,
        descuento: ventaData.descuento || 0,
        impuestos: ventaData.impuestos || 0,
        total: ventaData.total || 0,
        fecha_entrega: ventaData.fecha_entrega ? toTimestampCostaRica(ventaData.fecha_entrega) : null,
        direccion_entrega: ventaData.direccion_entrega || null,
        observaciones: ventaData.observaciones || null,
        vendedor_id: ventaData.vendedor_id || null,
        modificado_por: ventaData.modificado_por || ventaData.vendedor_id || null,
        fecha_modificacion: timestamp
      }

      // Solo actualizar fecha_venta si se proporciona explícitamente
      if (ventaData.fecha_venta) {
        ventaUpdate.fecha_venta = toTimestampCostaRica(ventaData.fecha_venta)
      }

      const { data: venta, error } = await supabase
        .from('ventas')
        .update(ventaUpdate)
        .eq('id', ventaId)
        .select()
        .single()

      if (error) {
        console.error('❌ updateVenta - Error al actualizar venta:', error)
        return { success: false, error: error.message }
      }

      // Reemplazar detalles
      const { error: deleteError } = await supabase
        .from('detalles_venta')
        .delete()
        .eq('venta_id', ventaId)

      if (deleteError) {
        console.error('❌ updateVenta - Error al limpiar detalles:', deleteError)
        return { success: false, error: deleteError.message }
      }

      if (ventaData.detalles?.length) {
        const detallesResult = await this.insertDetallesVenta(ventaId, ventaData.detalles)
        if (!detallesResult.success) {
          return detallesResult
        }
      }

      return { success: true, data: venta }
    } catch (error) {
      console.error('❌ updateVenta - Error inesperado:', error)
      return { success: false, error: 'Error inesperado al actualizar venta' }
    }
  }

  /**
   * Eliminar venta y sus detalles
   * @param {string} ventaId
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async deleteVenta(ventaId) {
    try {
      const { error: detallesError } = await supabase
        .from('detalles_venta')
        .delete()
        .eq('venta_id', ventaId)

      if (detallesError) {
        console.error('❌ deleteVenta - Error eliminando detalles:', detallesError)
        return { success: false, error: detallesError.message }
      }

      const { error } = await supabase
        .from('ventas')
        .delete()
        .eq('id', ventaId)

      if (error) {
        console.error('❌ deleteVenta - Error eliminando venta:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('❌ deleteVenta - Error inesperado:', error)
      return { success: false, error: 'Error inesperado al eliminar venta' }
    }
  }

  /**
   * Insertar detalles de venta
   * @param {string} ventaId
   * @param {Array} detalles
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async insertDetallesVenta(ventaId, detalles = []) {
    try {
      if (!detalles.length) {
        return { success: true }
      }

      const timestamp = getTimestampCostaRica()
      const rows = detalles.map(detalle => ({
        venta_id: ventaId,
        producto_id: detalle.producto_id,
        cantidad: detalle.cantidad,
        precio_unitario: detalle.precio_unitario,
        descuento: detalle.descuento || 0,
        subtotal: detalle.subtotal,
        observaciones: detalle.observaciones || null,
        fecha_creacion: timestamp,
        fecha_modificacion: timestamp
      }))

      const { error } = await supabase
        .from('detalles_venta')
        .insert(rows)

      if (error) {
        console.error('❌ insertDetallesVenta - Error:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('❌ insertDetallesVenta - Error inesperado:', error)
      return { success: false, error: 'Error inesperado al guardar detalles' }
    }
  }
}

export default VentaService
