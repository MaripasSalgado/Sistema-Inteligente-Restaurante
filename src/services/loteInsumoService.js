import { supabase } from '@/config/supabase'
import { getTimestampCostaRica, toTimestampCostaRica, toDateLocal } from '@/utils/dateHelper'

export class LoteInsumoService {
  /**
   * Obtener todos los lotes de un insumo
   * @param {string} insumoId - ID del insumo
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  static async getLotesByInsumo(insumoId) {
    try {
      const { data, error } = await supabase
        .from('lotes_insumos')
        .select(`
          *,
          insumo:insumos(*),
          proveedor:proveedor_id(
            id,
            codigo,
            nombre,
            tipo,
            telefono,
            email,
            estado
          )
        `)
        .eq('insumo_id', insumoId)
        .eq('estado', 'Activo')
        .order('fecha_ingreso', { ascending: false })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener lotes' }
    }
  }

  /**
   * Obtener un lote por ID
   * @param {string} loteId - ID del lote
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async getLoteById(loteId) {
    try {
      const { data, error } = await supabase
        .from('lotes_insumos')
        .select(`
          *,
          insumo:insumos(*),
          proveedor:proveedor_id(
            id,
            codigo,
            nombre,
            tipo,
            telefono,
            email,
            estado
          )
        `)
        .eq('id', loteId)
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener lote' }
    }
  }

  /**
   * Crear un nuevo lote
   * @param {object} loteData - Datos del lote
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async createLote(loteData) {
    try {
      console.log('📦 createLote - Datos recibidos:', loteData)
      
      // Convertir fechas a timestamps de Costa Rica
      const fechaIngreso = loteData.fecha_ingreso 
        ? toTimestampCostaRica(loteData.fecha_ingreso)
        : getTimestampCostaRica()
      
      const fechaVencimiento = loteData.fecha_vencimiento 
        ? toTimestampCostaRica(loteData.fecha_vencimiento)
        : null
      
      console.log('🕐 Fechas convertidas (Costa Rica):', { fechaIngreso, fechaVencimiento })
      
      const { data, error } = await supabase
        .from('lotes_insumos')
        .insert([{
          insumo_id: loteData.insumo_id,
          lote: loteData.lote,
          cantidad_inicial: loteData.cantidad_inicial,
          cantidad_actual: loteData.cantidad_actual,
          precio_unitario: loteData.precio_unitario,
          proveedor_id: loteData.proveedor_id || null,
          fecha_ingreso: fechaIngreso,
          fecha_vencimiento: fechaVencimiento,
          estado: 'Activo',
          observaciones: loteData.observaciones || null,
          creado_por: loteData.creado_por,
          fecha_creacion: getTimestampCostaRica(),
          fecha_modificacion: getTimestampCostaRica()
        }])
        .select()
        .single()

      if (error) {
        console.error('❌ Error al crear lote:', error)
        return { success: false, error: error.message }
      }

      console.log('✅ Lote creado exitosamente:', data)
      return { success: true, data }
    } catch (error) {
      console.error('❌ Error inesperado al crear lote:', error)
      return { success: false, error: 'Error inesperado al crear lote' }
    }
  }

  /**
   * Actualizar un lote
   * @param {string} loteId - ID del lote
   * @param {object} loteData - Datos actualizados del lote
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async updateLote(loteId, loteData) {
    try {
      console.log('✏️ updateLote - Datos recibidos:', { loteId, loteData })
      
      // Convertir fechas a timestamps de Costa Rica si se proporcionan
      const fechaIngreso = loteData.fecha_ingreso 
        ? toTimestampCostaRica(loteData.fecha_ingreso)
        : null
      
      const fechaVencimiento = loteData.fecha_vencimiento 
        ? toTimestampCostaRica(loteData.fecha_vencimiento)
        : null
      
      const updateData = {
        lote: loteData.lote,
        cantidad_inicial: loteData.cantidad_inicial,
        cantidad_actual: loteData.cantidad_actual,
        precio_unitario: loteData.precio_unitario,
        proveedor_id: loteData.proveedor_id || null,
        observaciones: loteData.observaciones || null,
        modificado_por: loteData.modificado_por,
        fecha_modificacion: getTimestampCostaRica()
      }
      
      // Solo agregar fechas si se proporcionan
      if (fechaIngreso) updateData.fecha_ingreso = fechaIngreso
      if (fechaVencimiento !== undefined) updateData.fecha_vencimiento = fechaVencimiento
      
      const { data, error } = await supabase
        .from('lotes_insumos')
        .update(updateData)
        .eq('id', loteId)
        .select()
        .single()

      if (error) {
        console.error('❌ Error al actualizar lote:', error)
        return { success: false, error: error.message }
      }

      console.log('✅ Lote actualizado exitosamente:', data)
      return { success: true, data }
    } catch (error) {
      console.error('❌ Error inesperado al actualizar lote:', error)
      return { success: false, error: 'Error inesperado al actualizar lote' }
    }
  }

  /**
   * Eliminar (desactivar) un lote
   * @param {string} loteId - ID del lote
   * @param {string} modificadoPor - ID del usuario que realiza la acción
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async deleteLote(loteId, modificadoPor) {
    try {
      const { error } = await supabase
        .from('lotes_insumos')
        .update({
          estado: 'Inactivo',
          modificado_por: modificadoPor,
          fecha_modificacion: new Date().toISOString()
        })
        .eq('id', loteId)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Error inesperado al eliminar lote' }
    }
  }

  /**
   * Generar código único para lote
   * @param {string} insumoId - ID del insumo
   * @returns {Promise<{success: boolean, data?: string, error?: string}>}
   */
  static async generateLoteCode(insumoId) {
    try {
      // Obtener información del insumo
      const { data: insumo, error: insumoError } = await supabase
        .from('insumos')
        .select('codigo')
        .eq('id', insumoId)
        .single()

      if (insumoError) {
        return { success: false, error: insumoError.message }
      }

      const prefijo = insumo.codigo
      const año = new Date().getFullYear()
      
      // Obtener el último lote del insumo
      const { data, error } = await supabase
        .from('lotes_insumos')
        .select('lote')
        .eq('insumo_id', insumoId)
        .like('lote', `${prefijo}-%`)
        .order('lote', { ascending: false })
        .limit(1)

      if (error) {
        return { success: false, error: error.message }
      }

      let correlativo = 1
      if (data && data.length > 0) {
        const ultimoLote = data[0].lote
        const partes = ultimoLote.split('-')
        if (partes.length >= 3) {
          const ultimoCorrelativo = parseInt(partes[partes.length - 1].replace(/[A-Z]/g, ''))
          correlativo = ultimoCorrelativo + 1
        }
      }

      const codigo = `${prefijo}-${año}-${String.fromCharCode(64 + correlativo)}`
      return { success: true, data: codigo }
    } catch (error) {
      return { success: false, error: 'Error inesperado al generar código de lote' }
    }
  }

  /**
   * Obtener lotes próximos a vencer
   * @param {number} dias - Días de anticipación (default: 7)
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  static async getLotesProximosVencer(dias = 7) {
    try {
      const fechaLimite = new Date()
      fechaLimite.setDate(fechaLimite.getDate() + dias)

      const { data, error } = await supabase
        .from('lotes_insumos')
        .select(`
          *,
          insumo:insumos(*)
        `)
        .eq('estado', 'Activo')
        .not('fecha_vencimiento', 'is', null)
        .lte('fecha_vencimiento', fechaLimite.toISOString().split('T')[0])
        .order('fecha_vencimiento', { ascending: true })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener lotes próximos a vencer' }
    }
  }

  /**
   * Obtener lotes vencidos
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  static async getLotesVencidos() {
    try {
      const hoy = new Date().toISOString().split('T')[0]

      const { data, error } = await supabase
        .from('lotes_insumos')
        .select(`
          *,
          insumo:insumos(*)
        `)
        .eq('estado', 'Activo')
        .not('fecha_vencimiento', 'is', null)
        .lt('fecha_vencimiento', hoy)
        .order('fecha_vencimiento', { ascending: true })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener lotes vencidos' }
    }
  }

  /**
   * Actualizar cantidad actual de un lote
   * @param {string} loteId - ID del lote
   * @param {number} nuevaCantidad - Nueva cantidad actual
   * @param {string} modificadoPor - ID del usuario que realiza la acción
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async updateCantidadActual(loteId, nuevaCantidad, modificadoPor) {
    try {
      const { data, error } = await supabase
        .from('lotes_insumos')
        .update({
          cantidad_actual: nuevaCantidad,
          modificado_por: modificadoPor,
          fecha_modificacion: new Date().toISOString()
        })
        .eq('id', loteId)
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al actualizar cantidad' }
    }
  }

  /**
   * Obtener estadísticas de lotes por insumo
   * @param {string} insumoId - ID del insumo
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async getLoteStats(insumoId) {
    try {
      const { data, error } = await supabase
        .from('lotes_insumos')
        .select('cantidad_actual, cantidad_inicial, precio_unitario, fecha_vencimiento')
        .eq('insumo_id', insumoId)
        .eq('estado', 'Activo')

      if (error) {
        return { success: false, error: error.message }
      }

      const totalStock = data.reduce((sum, lote) => sum + parseFloat(lote.cantidad_actual), 0)
      const totalInicial = data.reduce((sum, lote) => sum + parseFloat(lote.cantidad_inicial), 0)
      const valorTotal = data.reduce((sum, lote) => sum + (parseFloat(lote.cantidad_actual) * parseFloat(lote.precio_unitario)), 0)
      
      const hoy = new Date()
      const lotesProximosVencer = data.filter(lote => {
        if (!lote.fecha_vencimiento) return false
        const fechaVencimiento = new Date(lote.fecha_vencimiento)
        const diasDiferencia = Math.ceil((fechaVencimiento - hoy) / (1000 * 60 * 60 * 24))
        return diasDiferencia <= 7 && diasDiferencia >= 0
      }).length

      const lotesVencidos = data.filter(lote => {
        if (!lote.fecha_vencimiento) return false
        const fechaVencimiento = new Date(lote.fecha_vencimiento)
        return fechaVencimiento < hoy
      }).length

      return { 
        success: true, 
        data: {
          totalStock,
          totalInicial,
          valorTotal,
          lotesProximosVencer,
          lotesVencidos,
          totalLotes: data.length
        }
      }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener estadísticas' }
    }
  }
}
