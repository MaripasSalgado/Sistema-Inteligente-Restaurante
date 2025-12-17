import { supabase } from '../config/supabase'

/**
 * Servicio para gestionar Proveedores
 * Tabla: proveedores
 */

// ============================================
// OBTENER PROVEEDORES
// ============================================

/**
 * Obtener todos los proveedores
 * @param {Object} filtros - Filtros opcionales
 * @returns {Promise<Array>} Lista de proveedores
 */
export const obtenerProveedores = async (filtros = {}) => {
  try {
    let query = supabase
      .from('proveedores')
      .select(`
        *,
        creado_por_usuario:creado_por(id, nombre, apellido),
        modificado_por_usuario:modificado_por(id, nombre, apellido)
      `)
      .order('nombre', { ascending: true })

    // Aplicar filtros
    if (filtros.estado) {
      query = query.eq('estado', filtros.estado)
    }

    if (filtros.tipo) {
      query = query.eq('tipo', filtros.tipo)
    }

    if (filtros.busqueda) {
      query = query.or(`nombre.ilike.%${filtros.busqueda}%,codigo.ilike.%${filtros.busqueda}%,contacto_principal.ilike.%${filtros.busqueda}%`)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error al obtener proveedores:', error)
    throw error
  }
}

/**
 * Obtener un proveedor por ID
 * @param {string} id - ID del proveedor
 * @returns {Promise<Object>} Datos del proveedor
 */
export const obtenerProveedorPorId = async (id) => {
  try {
    const { data, error } = await supabase
      .from('proveedores')
      .select(`
        *,
        creado_por_usuario:creado_por(id, nombre, apellido),
        modificado_por_usuario:modificado_por(id, nombre, apellido),
        evaluaciones:evaluaciones_proveedores(
          id,
          calificacion,
          criterios,
          comentarios,
          fecha_evaluacion,
          usuario:usuario_id(nombre, apellido)
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error al obtener proveedor:', error)
    throw error
  }
}

/**
 * Obtener proveedores activos (para selects)
 * @returns {Promise<Array>} Lista de proveedores activos
 */
export const obtenerProveedoresActivos = async () => {
  try {
    const { data, error } = await supabase
      .from('proveedores')
      .select('id, codigo, nombre, tipo, telefono, email, estado')
      .eq('estado', 'Activo')
      .order('nombre', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error al obtener proveedores activos:', error)
    throw error
  }
}

// ============================================
// CREAR PROVEEDOR
// ============================================

/**
 * Crear un nuevo proveedor
 * @param {Object} proveedor - Datos del proveedor
 * @returns {Promise<Object>} Proveedor creado
 */
export const crearProveedor = async (proveedor) => {
  try {
    // Obtener usuario actual
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuario no autenticado')

    // Generar código si no existe
    if (!proveedor.codigo) {
      const codigo = await generarCodigoProveedor()
      proveedor.codigo = codigo
    }

    // Asegurar que el estado sea 'Activo' si no se especifica
    const nuevoProveedor = {
      ...proveedor,
      estado: proveedor.estado || 'Activo',
      creado_por: user.id,
      modificado_por: user.id,
      fecha_creacion: new Date().toISOString(),
      fecha_modificacion: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('proveedores')
      .insert([nuevoProveedor])
      .select(`
        *,
        creado_por_usuario:creado_por(id, nombre, apellido)
      `)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error al crear proveedor:', error)
    throw error
  }
}

// ============================================
// ACTUALIZAR PROVEEDOR
// ============================================

/**
 * Actualizar un proveedor existente
 * @param {string} id - ID del proveedor
 * @param {Object} cambios - Cambios a aplicar
 * @returns {Promise<Object>} Proveedor actualizado
 */
export const actualizarProveedor = async (id, cambios) => {
  try {
    // Obtener usuario actual
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuario no autenticado')

    const actualizacion = {
      ...cambios,
      modificado_por: user.id,
      fecha_modificacion: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('proveedores')
      .update(actualizacion)
      .eq('id', id)
      .select(`
        *,
        modificado_por_usuario:modificado_por(id, nombre, apellido)
      `)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error al actualizar proveedor:', error)
    throw error
  }
}

// ============================================
// ELIMINAR PROVEEDOR
// ============================================

/**
 * Eliminar un proveedor (cambiar estado a Inactivo)
 * @param {string} id - ID del proveedor
 * @returns {Promise<boolean>} true si se eliminó correctamente
 */
export const eliminarProveedor = async (id) => {
  try {
    // Verificar si tiene insumos o lotes asociados
    const { data: insumos } = await supabase
      .from('insumos')
      .select('id')
      .eq('proveedor_principal_id', id)
      .limit(1)

    if (insumos && insumos.length > 0) {
      throw new Error('No se puede eliminar el proveedor porque tiene insumos asociados')
    }

    // Cambiar estado a Inactivo en lugar de eliminar
    await actualizarProveedor(id, { estado: 'Inactivo' })
    return true
  } catch (error) {
    console.error('Error al eliminar proveedor:', error)
    throw error
  }
}

/**
 * Eliminar permanentemente un proveedor
 * @param {string} id - ID del proveedor
 * @returns {Promise<boolean>} true si se eliminó correctamente
 */
export const eliminarProveedorPermanente = async (id) => {
  try {
    const { error } = await supabase
      .from('proveedores')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error al eliminar proveedor permanentemente:', error)
    throw error
  }
}

// ============================================
// EVALUACIONES DE PROVEEDORES
// ============================================

/**
 * Crear evaluación de proveedor
 * @param {Object} evaluacion - Datos de la evaluación
 * @returns {Promise<Object>} Evaluación creada
 */
export const crearEvaluacionProveedor = async (evaluacion) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuario no autenticado')

    const nuevaEvaluacion = {
      ...evaluacion,
      usuario_id: user.id,
      fecha_evaluacion: new Date().toISOString(),
      fecha_creacion: new Date().toISOString(),
      fecha_modificacion: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('evaluaciones_proveedores')
      .insert([nuevaEvaluacion])
      .select(`
        *,
        usuario:usuario_id(nombre, apellido)
      `)
      .single()

    if (error) throw error

    // Actualizar calificación promedio del proveedor
    await actualizarCalificacionProveedor(evaluacion.proveedor_id)

    return data
  } catch (error) {
    console.error('Error al crear evaluación:', error)
    throw error
  }
}

/**
 * Obtener evaluaciones de un proveedor
 * @param {string} proveedorId - ID del proveedor
 * @returns {Promise<Array>} Lista de evaluaciones
 */
export const obtenerEvaluacionesProveedor = async (proveedorId) => {
  try {
    const { data, error } = await supabase
      .from('evaluaciones_proveedores')
      .select(`
        *,
        usuario:usuario_id(id, nombre, apellido)
      `)
      .eq('proveedor_id', proveedorId)
      .order('fecha_evaluacion', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error al obtener evaluaciones:', error)
    throw error
  }
}

/**
 * Actualizar evaluación existente
 * @param {string} id - ID de la evaluación
 * @param {Object} evaluacionData - Datos actualizados
 * @returns {Promise<Object>} Evaluación actualizada
 */
export const actualizarEvaluacion = async (id, evaluacionData) => {
  try {
    const { data, error } = await supabase
      .from('evaluaciones_proveedores')
      .update({
        calificacion: evaluacionData.calificacion,
        criterios: evaluacionData.criterios,
        comentarios: evaluacionData.comentarios,
        fecha_modificacion: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        usuario:usuario_id(id, nombre, apellido)
      `)
      .single()

    if (error) throw error

    // Actualizar calificación promedio del proveedor
    await actualizarCalificacionProveedor(evaluacionData.proveedor_id)

    return data
  } catch (error) {
    console.error('Error al actualizar evaluación:', error)
    throw error
  }
}

/**
 * Obtener conteo de evaluaciones del mes actual
 * @returns {Promise<number>} Cantidad de evaluaciones este mes
 */
export const obtenerEvaluacionesDelMes = async () => {
  try {
    // Calcular el primer día del mes actual
    const hoy = new Date()
    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
    const primerDiaMesISO = primerDiaMes.toISOString()

    const { data, error, count } = await supabase
      .from('evaluaciones_proveedores')
      .select('*', { count: 'exact', head: true })
      .gte('fecha_evaluacion', primerDiaMesISO)

    if (error) throw error
    return count || 0
  } catch (error) {
    console.error('Error al obtener evaluaciones del mes:', error)
    return 0
  }
}

/**
 * Actualizar calificación promedio del proveedor
 * @param {string} proveedorId - ID del proveedor
 */
const actualizarCalificacionProveedor = async (proveedorId) => {
  try {
    const { data: evaluaciones } = await supabase
      .from('evaluaciones_proveedores')
      .select('calificacion')
      .eq('proveedor_id', proveedorId)

    if (evaluaciones && evaluaciones.length > 0) {
      const promedio = evaluaciones.reduce((sum, ev) => sum + ev.calificacion, 0) / evaluaciones.length

      await supabase
        .from('proveedores')
        .update({ calificacion_promedio: parseFloat(promedio.toFixed(2)) })
        .eq('id', proveedorId)
    }
  } catch (error) {
    console.error('Error al actualizar calificación:', error)
  }
}

// ============================================
// ESTADÍSTICAS Y REPORTES
// ============================================

/**
 * Obtener estadísticas de proveedores
 * @returns {Promise<Object>} Estadísticas
 */
export const obtenerEstadisticasProveedores = async () => {
  try {
    const { data: proveedores, error } = await supabase
      .from('proveedores')
      .select('estado, tipo, calificacion_promedio, total_compras')

    if (error) throw error

    const estadisticas = {
      total: proveedores.length,
      activos: proveedores.filter(p => p.estado === 'Activo').length,
      inactivos: proveedores.filter(p => p.estado === 'Inactivo').length,
      suspendidos: proveedores.filter(p => p.estado === 'Suspendido').length,
      porTipo: {},
      calificacionPromedio: 0,
      totalCompras: 0
    }

    // Agrupar por tipo
    proveedores.forEach(p => {
      if (!estadisticas.porTipo[p.tipo]) {
        estadisticas.porTipo[p.tipo] = 0
      }
      estadisticas.porTipo[p.tipo]++
      estadisticas.totalCompras += parseFloat(p.total_compras || 0)
    })

    // Calcular calificación promedio general
    const proveedoresConCalificacion = proveedores.filter(p => p.calificacion_promedio > 0)
    if (proveedoresConCalificacion.length > 0) {
      estadisticas.calificacionPromedio = (
        proveedoresConCalificacion.reduce((sum, p) => sum + parseFloat(p.calificacion_promedio), 0) /
        proveedoresConCalificacion.length
      ).toFixed(2)
    }

    return estadisticas
  } catch (error) {
    console.error('Error al obtener estadísticas:', error)
    throw error
  }
}

/**
 * Obtener proveedores con más compras
 * @param {number} limite - Número de proveedores a retornar
 * @returns {Promise<Array>} Top proveedores
 */
export const obtenerTopProveedores = async (limite = 10) => {
  try {
    const { data, error } = await supabase
      .from('proveedores')
      .select('id, codigo, nombre, tipo, total_compras, calificacion_promedio')
      .eq('estado', 'Activo')
      .order('total_compras', { ascending: false })
      .limit(limite)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error al obtener top proveedores:', error)
    throw error
  }
}

// ============================================
// UTILIDADES
// ============================================

/**
 * Generar código único para proveedor
 * @returns {Promise<string>} Código generado
 */
const generarCodigoProveedor = async () => {
  try {
    // Obtener el último código
    const { data, error } = await supabase
      .from('proveedores')
      .select('codigo')
      .order('codigo', { ascending: false })
      .limit(1)

    if (error) throw error

    let numeroSiguiente = 1
    if (data && data.length > 0) {
      const ultimoCodigo = data[0].codigo
      const numero = parseInt(ultimoCodigo.replace('PROV-', ''))
      if (!isNaN(numero)) {
        numeroSiguiente = numero + 1
      }
    }

    return `PROV-${numeroSiguiente.toString().padStart(4, '0')}`
  } catch (error) {
    console.error('Error al generar código:', error)
    // En caso de error, generar código con timestamp
    return `PROV-${Date.now().toString().slice(-4)}`
  }
}

/**
 * Verificar si un código ya existe
 * @param {string} codigo - Código a verificar
 * @param {string} idExcluir - ID del proveedor a excluir (para edición)
 * @returns {Promise<boolean>} true si el código existe
 */
export const verificarCodigoExistente = async (codigo, idExcluir = null) => {
  try {
    let query = supabase
      .from('proveedores')
      .select('id')
      .eq('codigo', codigo)

    if (idExcluir) {
      query = query.neq('id', idExcluir)
    }

    const { data, error } = await query

    if (error) throw error
    return data && data.length > 0
  } catch (error) {
    console.error('Error al verificar código:', error)
    return false
  }
}

/**
 * Obtener tipos de proveedores disponibles
 * @returns {Array} Lista de tipos
 */
export const obtenerTiposProveedor = () => {
  return [
    'Carnes y Embutidos',
    'Frutas y Verduras',
    'Lácteos y Derivados',
    'Granos y Harinas',
    'Condimentos y Especias',
    'Bebidas',
    'Otros'
  ]
}

/**
 * Obtener estados de proveedores disponibles
 * @returns {Array} Lista de estados
 */
export const obtenerEstadosProveedor = () => {
  return ['Activo', 'Inactivo', 'Suspendido']
}

// ============================================
// BÚSQUEDA Y FILTROS AVANZADOS
// ============================================

/**
 * Buscar proveedores con filtros avanzados
 * @param {Object} parametros - Parámetros de búsqueda
 * @returns {Promise<Array>} Proveedores encontrados
 */
export const buscarProveedoresAvanzado = async (parametros) => {
  try {
    let query = supabase
      .from('proveedores')
      .select(`
        *,
        creado_por_usuario:creado_por(id, nombre, apellido)
      `)

    // Filtros básicos
    if (parametros.estado) {
      query = query.eq('estado', parametros.estado)
    }

    if (parametros.tipo) {
      query = query.eq('tipo', parametros.tipo)
    }

    // Filtro por calificación
    if (parametros.calificacionMin) {
      query = query.gte('calificacion_promedio', parametros.calificacionMin)
    }

    // Filtro por total de compras
    if (parametros.comprasMin) {
      query = query.gte('total_compras', parametros.comprasMin)
    }

    // Filtro por fecha de última compra
    if (parametros.ultimaCompraDesde) {
      query = query.gte('ultima_compra', parametros.ultimaCompraDesde)
    }

    if (parametros.ultimaCompraHasta) {
      query = query.lte('ultima_compra', parametros.ultimaCompraHasta)
    }

    // Búsqueda de texto
    if (parametros.busqueda) {
      query = query.or(`nombre.ilike.%${parametros.busqueda}%,codigo.ilike.%${parametros.busqueda}%,contacto_principal.ilike.%${parametros.busqueda}%,email.ilike.%${parametros.busqueda}%`)
    }

    // Ordenamiento
    const ordenarPor = parametros.ordenarPor || 'nombre'
    const orden = parametros.orden || 'asc'
    query = query.order(ordenarPor, { ascending: orden === 'asc' })

    const { data, error } = await query

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error en búsqueda avanzada:', error)
    throw error
  }
}

export default {
  obtenerProveedores,
  obtenerProveedorPorId,
  obtenerProveedoresActivos,
  crearProveedor,
  actualizarProveedor,
  eliminarProveedor,
  eliminarProveedorPermanente,
  crearEvaluacionProveedor,
  obtenerEvaluacionesProveedor,
  obtenerEvaluacionesDelMes,
  actualizarEvaluacion,
  obtenerEstadisticasProveedores,
  obtenerTopProveedores,
  verificarCodigoExistente,
  obtenerTiposProveedor,
  obtenerEstadosProveedor,
  buscarProveedoresAvanzado
}

