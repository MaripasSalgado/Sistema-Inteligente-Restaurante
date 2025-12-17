import { supabase } from '@/config/supabase'

/**
 * Servicio para gestionar el descuento automático de insumos al crear ventas
 * Implementa algoritmo FEFO (First Expire, First Out) para selección de lotes
 */

/**
 * Obtiene todas las recetas asociadas a un producto
 * @param {string} productoId - UUID del producto
 * @returns {Promise<Array>} Array de recetas con sus ingredientes
 */
export const obtenerRecetasDeProducto = async (productoId) => {
  try {
    const { data, error } = await supabase
      .from('recetas_producto')
      .select(`
        receta_id,
        cantidad,
        receta:receta_id (
          id,
          codigo,
          nombre,
          ingredientes_receta (
            id,
            cantidad,
            unidad_medida,
            insumo:insumo_id (
              id,
              codigo,
              nombre,
              unidad_medida
            )
          )
        )
      `)
      .eq('producto_id', productoId)

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('Error al obtener recetas del producto:', error)
    throw error
  }
}

/**
 * Calcula la cantidad total de cada insumo necesario para producir los productos vendidos
 * @param {Array} recetas - Array de recetas asociadas al producto
 * @param {number} cantidadProducto - Cantidad de producto vendido
 * @returns {Map} Map con insumo_id como key y objeto con datos del insumo
 */
export const calcularInsumosNecesarios = (recetas, cantidadProducto) => {
  const insumosMap = new Map()

  recetas.forEach(recetaProducto => {
    const { receta, cantidad: cantidadRecetaPorProducto } = recetaProducto

    if (!receta || !receta.ingredientes_receta) return

    receta.ingredientes_receta.forEach(ingrediente => {
      const { insumo, cantidad: cantidadIngrediente, unidad_medida } = ingrediente

      if (!insumo) return

      // Calcular cantidad total necesaria:
      // cantidad_ingrediente * cantidad_receta_por_producto * cantidad_producto_vendido
      const cantidadNecesaria = cantidadIngrediente * cantidadRecetaPorProducto * cantidadProducto

      if (insumosMap.has(insumo.id)) {
        // Si el insumo ya existe, acumular la cantidad
        const existente = insumosMap.get(insumo.id)
        existente.cantidad_total += cantidadNecesaria
      } else {
        // Si es nuevo, agregarlo al map
        insumosMap.set(insumo.id, {
          insumo_id: insumo.id,
          codigo: insumo.codigo,
          nombre: insumo.nombre,
          cantidad_total: cantidadNecesaria,
          unidad_medida: unidad_medida || insumo.unidad_medida
        })
      }
    })
  })

  return insumosMap
}

/**
 * Obtiene los lotes disponibles de un insumo ordenados por FEFO
 * (First Expire, First Out - primero expira, primero sale)
 * @param {string} insumoId - UUID del insumo
 * @returns {Promise<Array>} Array de lotes ordenados por fecha de vencimiento
 */
export const obtenerLotesDisponibles = async (insumoId) => {
  try {
    const { data, error } = await supabase
      .from('lotes_insumos')
      .select('*')
      .eq('insumo_id', insumoId)
      .eq('estado', 'Activo')
      .gt('cantidad_actual', 0)
      .order('fecha_vencimiento', { ascending: true, nullsFirst: false })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('Error al obtener lotes disponibles:', error)
    throw error
  }
}

/**
 * Descuenta un insumo de los lotes disponibles usando algoritmo FEFO
 * Crea movimientos de inventario por cada lote afectado
 * NUNCA permite cantidades negativas
 * @param {string} insumoId - UUID del insumo
 * @param {number} cantidadTotal - Cantidad total a descontar
 * @param {Array} lotes - Lotes disponibles ordenados por FEFO
 * @param {string} ventaId - UUID de la venta
 * @param {string} numeroOrden - Número de orden de la venta
 * @param {string} usuarioId - UUID del usuario que creó la venta
 * @returns {Promise<Object>} Resultado del descuento
 */
export const descontarInsumoDeLotes = async (
  insumoId,
  cantidadTotal,
  lotes,
  ventaId,
  numeroOrden,
  usuarioId
) => {
  try {
    console.log(`🔄 Descontando insumo ${insumoId}: ${cantidadTotal} unidades`)

    let cantidadRestante = cantidadTotal
    let cantidadDescontada = 0
    const movimientos = []

    // Calcular total disponible antes de empezar
    const totalDisponible = lotes.reduce((sum, lote) => sum + (lote.cantidad_actual || 0), 0)
    console.log(`📦 Stock disponible: ${totalDisponible}, necesario: ${cantidadTotal}`)

    // Si no hay suficiente stock, NO descontar nada
    if (totalDisponible < cantidadTotal) {
      console.warn(`⚠️ Stock insuficiente para insumo ${insumoId}`)
      return {
        descontado: false,
        cantidad_descontada: 0,
        faltante: cantidadTotal - totalDisponible,
        cantidad_disponible: totalDisponible,
        movimientos: []
      }
    }

    // Iterar lotes ordenados por FEFO
    for (const lote of lotes) {
      if (cantidadRestante <= 0) break

      const cantidadADescontar = Math.min(lote.cantidad_actual, cantidadRestante)
      console.log(`📤 Descontando ${cantidadADescontar} del lote ${lote.lote}`)

      // Actualizar cantidad_actual del lote
      const nuevaCantidad = lote.cantidad_actual - cantidadADescontar

      const { error: errorLote } = await supabase
        .from('lotes_insumos')
        .update({ cantidad_actual: nuevaCantidad })
        .eq('id', lote.id)

      if (errorLote) {
        console.error('❌ Error actualizando lote:', errorLote)
        throw errorLote
      }

      // Crear movimiento de inventario con todos los campos necesarios
      const movimiento = {
        lote_id: lote.id,
        tipo: 'Salida',
        cantidad: cantidadADescontar,
        motivo: 'Venta',
        documento: numeroOrden,
        venta_id: ventaId,
        usuario_id: usuarioId,
        costo_unitario: lote.precio_unitario || 0,
        costo_total: cantidadADescontar * (lote.precio_unitario || 0),
        fecha_movimiento: new Date().toISOString()
      }

      const { data: movimientoCreado, error: errorMovimiento } = await supabase
        .from('movimientos_inventario')
        .insert([movimiento])
        .select()
        .single()

      if (errorMovimiento) {
        console.error('❌ Error creando movimiento:', errorMovimiento)
        throw errorMovimiento
      }

      console.log(`✅ Movimiento creado: ${movimientoCreado.id}`)
      movimientos.push(movimientoCreado)

      cantidadRestante -= cantidadADescontar
      cantidadDescontada += cantidadADescontar
    }

    console.log(`✅ Descuento completado: ${cantidadDescontada} unidades`)
    return {
      descontado: true,
      cantidad_descontada: cantidadDescontada,
      faltante: 0,
      cantidad_disponible: totalDisponible,
      movimientos
    }
  } catch (error) {
    console.error('❌ Error al descontar insumo de lotes:', error)
    throw error
  }
}

/**
 * FUNCIÓN PRINCIPAL
 * Procesa el descuento automático de todos los insumos necesarios para una venta
 * @param {string} ventaId - UUID de la venta
 * @param {string} numeroOrden - Número de orden de la venta
 * @param {Array} detallesVenta - Array de productos con cantidades
 * @param {string} usuarioId - UUID del usuario
 * @returns {Promise<Object>} Resultado del proceso con warnings y movimientos
 */
export const procesarDescuentoDeInsumos = async (
  ventaId,
  numeroOrden,
  detallesVenta,
  usuarioId
) => {
  try {
    const warnings = []
    const todosMovimientos = []

    // Procesar cada producto vendido
    for (const detalle of detallesVenta) {
      const { producto_id, cantidad } = detalle

      // 1. Obtener recetas del producto
      const recetas = await obtenerRecetasDeProducto(producto_id)

      if (!recetas || recetas.length === 0) {
        console.warn(`Producto ${producto_id} no tiene recetas asociadas`)
        continue
      }

      // 2. Calcular insumos necesarios
      const insumosNecesarios = calcularInsumosNecesarios(recetas, cantidad)

      // 3. Por cada insumo necesario, intentar descontar
      for (const [insumoId, insumoData] of insumosNecesarios) {
        // Obtener lotes disponibles (ordenados por FEFO)
        const lotes = await obtenerLotesDisponibles(insumoId)

        // Intentar descontar
        const resultado = await descontarInsumoDeLotes(
          insumoId,
          insumoData.cantidad_total,
          lotes,
          ventaId,
          numeroOrden,
          usuarioId
        )

        // Si no se pudo descontar todo, agregar warning
        if (!resultado.descontado) {
          warnings.push({
            insumo: insumoData.nombre,
            codigo: insumoData.codigo,
            cantidadNecesaria: insumoData.cantidad_total,
            cantidadDisponible: resultado.cantidad_disponible,
            diferencia: resultado.faltante,
            unidad: insumoData.unidad_medida
          })
        } else {
          // Agregar movimientos creados
          todosMovimientos.push(...resultado.movimientos)
        }
      }
    }

    return {
      success: true,
      warnings,
      movimientos: todosMovimientos
    }
  } catch (error) {
    console.error('Error al procesar descuento de insumos:', error)
    throw error
  }
}
