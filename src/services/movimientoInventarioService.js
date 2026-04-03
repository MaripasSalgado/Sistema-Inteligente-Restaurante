import { supabase } from '@/config/supabase'
import { getTimestampCostaRica, toTimestampCostaRica } from '@/utils/dateHelper'

export class MovimientoInventarioService {
  /**
   * Obtener todos los movimientos de inventario
   * @param {object} filters - Filtros opcionales
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  static async getAllMovimientos(filters = {}) {
    try {
      let query = supabase
        .from('movimientos_inventario')
        .select(`
          *,
          lote:lote_id(
            id,
            lote,
            cantidad_actual,
            insumo_id,
            insumo:insumo_id(
              id,
              nombre,
              codigo,
              unidad_medida
            )
          ),
          usuario:usuario_id(
            id,
            nombre,
            apellido,
            email
          )
        `)
        .order('fecha_movimiento', { ascending: false })

      // Aplicar filtros
      if (filters.tipo) {
        query = query.eq('tipo', filters.tipo)
      }
      if (filters.lote_id) {
        query = query.eq('lote_id', filters.lote_id)
      }
      if (filters.fecha_desde) {
        query = query.gte('fecha_movimiento', filters.fecha_desde)
      }
      if (filters.fecha_hasta) {
        query = query.lte('fecha_movimiento', filters.fecha_hasta)
      }
      if (filters.usuario_id) {
        query = query.eq('usuario_id', filters.usuario_id)
      }

      const { data, error } = await query
      if (error) {
        console.error('❌ getAllMovimientos - Error:', error)
        return { success: false, error: error.message }
      }
      return { success: true, data }
    } catch (error) {
      console.error('❌ getAllMovimientos - Error inesperado:', error)
      return { success: false, error: 'Error inesperado al obtener movimientos' }
    }
  }

  /**
   * Obtener un movimiento por ID
   * @param {string} movimientoId - ID del movimiento
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async getMovimientoById(movimientoId) {
    try {
      const { data, error } = await supabase
        .from('movimientos_inventario')
        .select(`
          *,
          lote:lote_id(
            id,
            lote,
            cantidad_actual,
            insumo_id,
            insumo:insumo_id(
              id,
              nombre,
              codigo,
              unidad_medida
            )
          ),
          usuario:usuario_id(
            id,
            nombre,
            apellido,
            email
          )
        `)
        .eq('id', movimientoId)
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener movimiento' }
    }
  }

  /**
   * Crear un nuevo movimiento
   * @param {object} movimientoData - Datos del movimiento
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
 static async createMovimiento(movimientoData) {
  try {
    const fechaMovimiento = movimientoData.fecha_movimiento 
      ? toTimestampCostaRica(movimientoData.fecha_movimiento)
      : getTimestampCostaRica();

    // 1. Insertar el movimiento
    const { data, error } = await supabase
      .from('movimientos_inventario')
      .insert([{
        lote_id: movimientoData.lote_id,
        tipo: movimientoData.tipo,
        cantidad: movimientoData.cantidad,
        motivo: movimientoData.motivo,
        documento: movimientoData.documento || null,
        usuario_id: movimientoData.usuario_id,
        fecha_movimiento: fechaMovimiento,
        observaciones: movimientoData.observaciones || null,
        fecha_creacion: getTimestampCostaRica(),
        fecha_modificacion: getTimestampCostaRica()
      }])
      .select()
      .single();

    if (error) throw error;

    // 2. Actualizar la cantidad del lote
    // Al hacer este UPDATE, Supabase disparará el Trigger SQL automáticamente.
    const updateResult = await this.actualizarCantidadLote(
      movimientoData.lote_id,
      movimientoData.tipo,
      movimientoData.cantidad
    );

    if (!updateResult.success) throw new Error(updateResult.error);

    // 3. Historia 1: Acumular consumo para el Cron nocturno
    if (movimientoData.tipo === 'Salida') {
      await this.acumularConsumoInsumo(movimientoData.lote_id, movimientoData.cantidad);
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

  /**
   * Actualizar cantidad del lote según el movimiento
   * @param {string} loteId - ID del lote
   * @param {string} tipo - Tipo de movimiento (Entrada, Salida, Ajuste)
   * @param {number} cantidad - Cantidad del movimiento
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async actualizarCantidadLote(loteId, tipo, cantidad) {
    try {
      // Obtener la cantidad actual del lote
      const { data: lote, error: loteError } = await supabase
        .from('lotes_insumos')
        .select('cantidad_actual, lote')
        .eq('id', loteId)
        .single()

      if (loteError) {
        console.error('❌ Error al obtener lote:', loteError)
        return { success: false, error: loteError.message }
      }
      let nuevaCantidad = parseFloat(lote.cantidad_actual || 0)
      const cantidadMovimiento = parseFloat(cantidad)
      switch (tipo) {
        case 'Entrada':
          nuevaCantidad += cantidadMovimiento
          break
        case 'Salida':
          nuevaCantidad -= cantidadMovimiento
          break
        case 'Ajuste':
          // Para ajuste, puede ser positivo o negativo
          nuevaCantidad += cantidadMovimiento
          break
        case 'Transferencia':
          // Para transferencias, la cantidad se maneja en el lote de destino
          nuevaCantidad -= cantidadMovimiento
          break
        default:
          console.error('❌ Tipo de movimiento no válido:', tipo)
          return { success: false, error: 'Tipo de movimiento no válido' }
      }

      // Asegurar que la cantidad no sea negativa
      if (nuevaCantidad < 0) {
        console.error('❌ Cantidad negativa resultante:', nuevaCantidad)
        return { 
          success: false, 
          error: `No hay suficiente stock disponible. Stock actual: ${lote.cantidad_actual}, Cantidad solicitada: ${cantidad}` 
        }
      }

      // Actualizar la cantidad del lote
      const { error: updateError } = await supabase
        .from('lotes_insumos')
        .update({
          cantidad_actual: nuevaCantidad,
          fecha_modificacion: getTimestampCostaRica()
        })
        .eq('id', loteId)

      if (updateError) {
        console.error('❌ Error al actualizar lote:', updateError)
        return { success: false, error: updateError.message }
      }
      return { success: true, nuevaCantidad }
    } catch (error) {
      console.error('❌ Error inesperado al actualizar cantidad del lote:', error)
      return { success: false, error: 'Error inesperado al actualizar cantidad del lote' }
    }
  }

  /**
   * Obtener movimientos por lote
   * @param {string} loteId - ID del lote
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  static async getMovimientosByLote(loteId) {
    try {
      const { data, error } = await supabase
        .from('movimientos_inventario')
        .select(`
          *,
          lote:lote_id(
            id,
            lote,
            cantidad_actual,
            insumo_id,
            insumo:insumo_id(
              id,
              nombre,
              codigo,
              unidad_medida
            )
          ),
          usuario:usuario_id(
            id,
            nombre,
            apellido,
            email
          )
        `)
        .eq('lote_id', loteId)
        .order('fecha_movimiento', { ascending: false })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener movimientos del lote' }
    }
  }

  /**
   * Obtener movimientos por insumo
   * @param {string} insumoId - ID del insumo
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  static async getMovimientosByInsumo(insumoId) {
    try {
      // Primero obtenemos todos los movimientos
      const { data: allMovimientos, error } = await supabase
        .from('movimientos_inventario')
        .select(`
          *,
          lote:lote_id(
            id,
            lote,
            cantidad_actual,
            insumo_id,
            insumo:insumo_id(
              id,
              nombre,
              codigo,
              unidad_medida
            )
          ),
          usuario:usuario_id(
            id,
            nombre,
            apellido,
            email
          )
        `)
        .order('fecha_movimiento', { ascending: false })

      if (error) {
        return { success: false, error: error.message }
      }

      // Filtrar por insumo_id
      const data = allMovimientos.filter(mov => mov.lote?.insumo_id === insumoId)

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener movimientos del insumo' }
    }
  }

  /**
   * Obtener estadísticas de movimientos
   * @param {object} filters - Filtros opcionales
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async getMovimientoStats(filters = {}) {
    try {
      let query = supabase
        .from('movimientos_inventario')
        .select('tipo, cantidad, costo_total, fecha_movimiento')

      // Aplicar filtros
      if (filters.fecha_desde) {
        query = query.gte('fecha_movimiento', filters.fecha_desde)
      }
      if (filters.fecha_hasta) {
        query = query.lte('fecha_movimiento', filters.fecha_hasta)
      }
      if (filters.insumo_id) {
        query = query.eq('lote.insumo_id', filters.insumo_id)
      }

      const { data, error } = await query

      if (error) {
        return { success: false, error: error.message }
      }

      // Calcular estadísticas
      const stats = {
        totalMovimientos: data.length,
        entradas: 0,
        salidas: 0,
        ajustes: 0,
        transferencias: 0,
        valorTotalEntradas: 0,
        valorTotalSalidas: 0,
        cantidadTotalEntradas: 0,
        cantidadTotalSalidas: 0
      }

      data.forEach(movimiento => {
        const cantidad = parseFloat(movimiento.cantidad)
        const valor = parseFloat(movimiento.costo_total || 0)

        switch (movimiento.tipo) {
          case 'Entrada':
            stats.entradas++
            stats.cantidadTotalEntradas += cantidad
            stats.valorTotalEntradas += valor
            break
          case 'Salida':
            stats.salidas++
            stats.cantidadTotalSalidas += cantidad
            stats.valorTotalSalidas += valor
            break
          case 'Ajuste':
            stats.ajustes++
            break
          case 'Transferencia':
            stats.transferencias++
            break
        }
      })

      return { success: true, data: stats }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener estadísticas' }
    }
  }

  /**
   * Obtener movimientos recientes
   * @param {number} limit - Límite de resultados (default: 10)
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  static async getMovimientosRecientes(limit = 10) {
    try {
      const { data, error } = await supabase
        .from('movimientos_inventario')
        .select(`
          *,
          lote:lote_id(
            id,
            lote,
            cantidad_actual,
            insumo_id,
            insumo:insumo_id(
              id,
              nombre,
              codigo,
              unidad_medida
            )
          ),
          usuario:usuario_id(
            id,
            nombre,
            apellido,
            email
          )
        `)
        .order('fecha_movimiento', { ascending: false })
        .limit(limit)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener movimientos recientes' }
    }
  }

  /**
   * Buscar movimientos por motivo o documento
   * @param {string} searchTerm - Término de búsqueda
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  static async searchMovimientos(searchTerm) {
    try {
      const { data, error } = await supabase
        .from('movimientos_inventario')
        .select(`
          *,
          lote:lote_id(
            id,
            lote,
            cantidad_actual,
            insumo_id,
            insumo:insumo_id(
              id,
              nombre,
              codigo,
              unidad_medida
            )
          ),
          usuario:usuario_id(
            id,
            nombre,
            apellido,
            email
          )
        `)
        .or(`motivo.ilike.%${searchTerm}%,documento.ilike.%${searchTerm}%,observaciones.ilike.%${searchTerm}%`)
        .order('fecha_movimiento', { ascending: false })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al buscar movimientos' }
    }
  }

  /**
   * Actualizar un movimiento existente
   * @param {string} movimientoId - ID del movimiento
   * @param {object} movimientoData - Datos actualizados del movimiento
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async updateMovimiento(movimientoId, movimientoData) {
    try {
      // Primero obtener el movimiento original para calcular la diferencia
      const { data: movimientoOriginal, error: errorOriginal } = await supabase
        .from('movimientos_inventario')
        .select('*')
        .eq('id', movimientoId)
        .single()

      if (errorOriginal) {
        console.error('❌ Error al obtener movimiento original:', errorOriginal)
        return { success: false, error: errorOriginal.message }
      }
      // Convertir fecha a timestamp de Costa Rica
      const fechaMovimiento = movimientoData.fecha_movimiento
        ? toTimestampCostaRica(movimientoData.fecha_movimiento)
        : movimientoOriginal.fecha_movimiento
      // Actualizar el movimiento
      const { data, error } = await supabase
        .from('movimientos_inventario')
        .update({
          lote_id: movimientoData.lote_id || movimientoOriginal.lote_id,
          tipo: movimientoData.tipo || movimientoOriginal.tipo,
          cantidad: movimientoData.cantidad || movimientoOriginal.cantidad,
          motivo: movimientoData.motivo || movimientoOriginal.motivo,
          documento: movimientoData.documento || movimientoOriginal.documento,
          lote_origen_id: movimientoData.lote_origen_id || movimientoOriginal.lote_origen_id,
          lote_destino_id: movimientoData.lote_destino_id || movimientoOriginal.lote_destino_id,
          costo_unitario: movimientoData.costo_unitario || movimientoOriginal.costo_unitario,
          costo_total: movimientoData.costo_total || movimientoOriginal.costo_total,
          usuario_id: movimientoData.usuario_id || movimientoOriginal.usuario_id,
          fecha_movimiento: fechaMovimiento,
          observaciones: movimientoData.observaciones || movimientoOriginal.observaciones,
          fecha_modificacion: getTimestampCostaRica()
        })
        .eq('id', movimientoId)
        .select()
        .single()

      if (error) {
        console.error('❌ Error al actualizar movimiento:', error)
        return { success: false, error: error.message }
      }
      // Si cambió el lote, la cantidad o el tipo, necesitamos ajustar las cantidades
      const loteCambiado = movimientoData.lote_id && movimientoData.lote_id !== movimientoOriginal.lote_id
      const cantidadCambiada = movimientoData.cantidad && movimientoData.cantidad !== movimientoOriginal.cantidad
      const tipoCambiado = movimientoData.tipo && movimientoData.tipo !== movimientoOriginal.tipo
      
      if (loteCambiado || cantidadCambiada || tipoCambiado) {
        // Revertir el movimiento original en el lote original
        const revertResult = await this.revertirMovimientoEnLote(movimientoOriginal)
        if (!revertResult.success) {
          console.error('❌ Error al revertir movimiento original:', revertResult.error)
          return { success: false, error: revertResult.error }
        }
        
        // Aplicar el movimiento actualizado en el lote nuevo
        const loteIdActualizado = movimientoData.lote_id || movimientoOriginal.lote_id
        const tipoActualizado = movimientoData.tipo || movimientoOriginal.tipo
        const cantidadActualizada = movimientoData.cantidad || movimientoOriginal.cantidad
        
        const applyResult = await this.actualizarCantidadLote(
          loteIdActualizado,
          tipoActualizado,
          cantidadActualizada
        )
        
        if (!applyResult.success) {
          console.error('❌ Error al aplicar movimiento actualizado:', applyResult.error)
          return { success: false, error: applyResult.error }
        }
      }

      return { success: true, data }
    } catch (error) {
      console.error('❌ Error inesperado al actualizar movimiento:', error)
      return { success: false, error: 'Error inesperado al actualizar movimiento' }
    }
  }

  /**
   * Revertir un movimiento en un lote (operación inversa)
   * @param {object} movimiento - Movimiento a revertir
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async revertirMovimientoEnLote(movimiento) {
    try {
      let tipoInverso = ''
      let cantidad = parseFloat(movimiento.cantidad)
      
      // Determinar el tipo inverso
      switch (movimiento.tipo) {
        case 'Entrada':
          tipoInverso = 'Salida'
          break
        case 'Salida':
          tipoInverso = 'Entrada'
          break
        case 'Ajuste':
          // Para ajuste, invertimos el signo
          tipoInverso = 'Ajuste'
          cantidad = -cantidad
          break
        case 'Transferencia':
          tipoInverso = 'Entrada' // Revertir la salida del lote origen
          break
        default:
          console.error('❌ Tipo de movimiento no válido para revertir:', movimiento.tipo)
          return { success: false, error: 'Tipo de movimiento no válido' }
      }
      
      // Aplicar la operación inversa
      const result = await this.actualizarCantidadLote(
        movimiento.lote_id,
        tipoInverso,
        Math.abs(cantidad)
      )
      
      if (!result.success) {
        console.error('❌ Error al revertir movimiento en lote:', result.error)
        return { success: false, error: result.error }
      }
      return { success: true }
    } catch (error) {
      console.error('❌ Error inesperado al revertir movimiento:', error)
      return { success: false, error: 'Error inesperado al revertir movimiento' }
    }
  }

  /**
   * Eliminar un movimiento
   * @param {string} movimientoId - ID del movimiento
   * @param {string} usuarioId - ID del usuario que elimina
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async deleteMovimiento(movimientoId, usuarioId) {
    try {
      // Primero obtener el movimiento para revertir sus efectos
      const { data: movimiento, error: errorMovimiento } = await supabase
        .from('movimientos_inventario')
        .select('*')
        .eq('id', movimientoId)
        .single()

      if (errorMovimiento) {
        console.error('❌ Error al obtener movimiento:', errorMovimiento)
        return { success: false, error: errorMovimiento.message }
      }
      // Revertir el movimiento en el lote
      const revertResult = await this.revertirMovimientoEnLote(movimiento)
      if (!revertResult.success) {
        console.error('❌ Error al revertir movimiento:', revertResult.error)
        return { success: false, error: revertResult.error }
      }
      
      // Eliminar el movimiento
      const { error } = await supabase
        .from('movimientos_inventario')
        .delete()
        .eq('id', movimientoId)

      if (error) {
        console.error('❌ Error al eliminar movimiento:', error)
        return { success: false, error: error.message }
      }
      return { success: true }
    } catch (error) {
      console.error('❌ Error inesperado al eliminar movimiento:', error)
      return { success: false, error: 'Error inesperado al eliminar movimiento' }
    }
  }

  static async acumularConsumoInsumo(loteId, cantidad) {
  try {
    // Obtenemos el insumo_id desde el lote
    const { data: lote } = await supabase
      .from('lotes_insumos')
      .select('insumo_id')
      .eq('id', loteId)
      .single();

    if (lote) {
      // Sumamos la cantidad al consumo_actual del insumo
      // Nota: En producción es mejor usar una función RPC para evitar condiciones de carrera
      const { data: insumo } = await supabase
        .from('insumos')
        .select('consumo_actual')
        .eq('id', lote.insumo_id)
        .single();

      await supabase
        .from('insumos')
        .update({ consumo_actual: (insumo.consumo_actual || 0) + parseFloat(cantidad) })
        .eq('id', lote.insumo_id);
    }
  } catch (e) {
    console.error("Error acumulando consumo:", e);
  }
}
}
