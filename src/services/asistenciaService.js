import { supabase } from '@/config/supabase'

export class AsistenciaService {
  /**
   * Marcar entrada de un empleado
   * @param {object} asistenciaData - Datos de la asistencia
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async marcarEntrada(asistenciaData) {
    try {
      const horaActual = new Date()
      const horaEntrada = horaActual.toTimeString().split(' ')[0].substring(0, 5) // HH:MM

      // Verificar si ya existe un registro de asistencia para hoy
      const hoy = new Date().toISOString().split('T')[0]
      const { data: registroExistente, error: checkError } = await supabase
        .from('asistencia')
        .select('*')
        .eq('usuario_id', asistenciaData.usuario_id)
        .eq('fecha', hoy)
        .single()

      if (registroExistente) {
        return {
          success: false,
          error: 'Ya existe un registro de entrada para hoy'
        }
      }

      // Obtener información del turno si existe
      let turnoInfo = {}
      if (asistenciaData.turno_id) {
        const { data: turno, error: turnoError } = await supabase
          .from('turnos')
          .select('*')
          .eq('id', asistenciaData.turno_id)
          .single()

        if (!turnoError && turno) {
          turnoInfo = {
            turno_id: turno.id,
            turno_inicio: turno.hora_inicio,
            turno_fin: turno.hora_fin
          }

          // Calcular minutos de retraso
          const inicioTurno = new Date(`1970-01-01T${turno.hora_inicio}:00`)
          const entrada = new Date(`1970-01-01T${horaEntrada}:00`)
          const diferencia = (entrada - inicioTurno) / 1000 / 60 // minutos

          turnoInfo.minutos_retraso = Math.max(0, Math.floor(diferencia))

          // Determinar estado
          if (diferencia <= 5) {
            turnoInfo.estado = 'a_tiempo'
          } else if (diferencia <= 30) {
            turnoInfo.estado = 'tarde'
          } else {
            turnoInfo.estado = 'tarde'
          }
        }
      }

      const { data, error } = await supabase
        .from('asistencia')
        .insert([{
          usuario_id: asistenciaData.usuario_id,
          fecha: hoy,
          entrada_real: horaEntrada,
          estado: turnoInfo.estado || 'a_tiempo',
          minutos_retraso: turnoInfo.minutos_retraso || 0,
          turno_id: turnoInfo.turno_id || null,
          turno_inicio: turnoInfo.turno_inicio || null,
          turno_fin: turnoInfo.turno_fin || null,
          ip_marcaje: asistenciaData.ip_marcaje || null,
          dispositivo: asistenciaData.dispositivo || null,
          creado_por: asistenciaData.usuario_id
        }])
        .select(`
          *,
          usuario:usuario_id(
            id,
            nombre,
            apellido,
            puesto
          ),
          turno:turno_id(
            id,
            hora_inicio,
            hora_fin,
            area
          )
        `)
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al marcar entrada' }
    }
  }

  /**
   * Marcar salida de un empleado
   * @param {string} usuarioId - ID del usuario
   * @param {object} salidaData - Datos adicionales de la salida
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async marcarSalida(usuarioId, salidaData = {}) {
    try {
      const horaActual = new Date()
      const horaSalida = horaActual.toTimeString().split(' ')[0].substring(0, 5) // HH:MM

      // Buscar el registro de asistencia de hoy
      const hoy = new Date().toISOString().split('T')[0]
      const { data: asistencia, error: fetchError } = await supabase
        .from('asistencia')
        .select('*')
        .eq('usuario_id', usuarioId)
        .eq('fecha', hoy)
        .is('salida_real', null)
        .single()

      if (fetchError || !asistencia) {
        return {
          success: false,
          error: 'No se encontró registro de entrada para hoy'
        }
      }

      // Calcular minutos extra si hay turno asignado
      let minutosExtra = 0
      if (asistencia.turno_fin) {
        const finTurno = new Date(`1970-01-01T${asistencia.turno_fin}:00`)
        const salida = new Date(`1970-01-01T${horaSalida}:00`)
        const diferencia = (salida - finTurno) / 1000 / 60 // minutos
        minutosExtra = Math.max(0, Math.floor(diferencia))
      }

      const { data, error } = await supabase
        .from('asistencia')
        .update({
          salida_real: horaSalida,
          minutos_extra: minutosExtra,
          observaciones: salidaData.observaciones || asistencia.observaciones,
          modificado_por: usuarioId,
          fecha_modificacion: new Date().toISOString()
        })
        .eq('id', asistencia.id)
        .select(`
          *,
          usuario:usuario_id(
            id,
            nombre,
            apellido,
            puesto
          ),
          turno:turno_id(
            id,
            hora_inicio,
            hora_fin,
            area
          )
        `)
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al marcar salida' }
    }
  }

  /**
   * Obtener historial de asistencia con filtros
   * @param {object} filtros - Filtros opcionales
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  static async getHistorialAsistencia(filtros = {}) {
    try {
      let query = supabase
        .from('asistencia')
        .select(`
          *,
          usuario:usuario_id(
            id,
            nombre,
            apellido,
            puesto,
            email
          ),
          turno:turno_id(
            id,
            hora_inicio,
            hora_fin,
            area,
            posicion
          )
        `)

      // Aplicar filtros
      if (filtros.usuarioId) {
        query = query.eq('usuario_id', filtros.usuarioId)
      }
      if (filtros.fechaInicio) {
        query = query.gte('fecha', filtros.fechaInicio)
      }
      if (filtros.fechaFin) {
        query = query.lte('fecha', filtros.fechaFin)
      }
      if (filtros.estado) {
        query = query.eq('estado', filtros.estado)
      }

      query = query.order('fecha', { ascending: false })
                   .order('entrada_real', { ascending: false })

      const { data, error } = await query

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener historial' }
    }
  }

  /**
   * Obtener métricas de asistencia
   * @param {object} filtros - Filtros opcionales
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async getMetricasAsistencia(filtros = {}) {
    try {
      let query = supabase
        .from('asistencia')
        .select('*')

      // Aplicar filtros
      if (filtros.usuarioId) {
        query = query.eq('usuario_id', filtros.usuarioId)
      }
      if (filtros.fechaInicio) {
        query = query.gte('fecha', filtros.fechaInicio)
      }
      if (filtros.fechaFin) {
        query = query.lte('fecha', filtros.fechaFin)
      }

      const { data, error } = await query

      if (error) {
        return { success: false, error: error.message }
      }

      // Calcular métricas
      const total = data.length
      const aTiempo = data.filter(a => a.estado === 'a_tiempo').length
      const tarde = data.filter(a => a.estado === 'tarde').length
      const ausencias = data.filter(a => a.estado === 'ausencia').length

      const retrasos = data.filter(a => a.minutos_retraso > 0)
      const totalMinutosRetraso = retrasos.reduce((sum, a) => sum + a.minutos_retraso, 0)
      const promedioRetraso = retrasos.length > 0 ? Math.round(totalMinutosRetraso / retrasos.length) : 0

      const horasExtra = data.reduce((sum, a) => sum + (a.minutos_extra || 0), 0)

      return {
        success: true,
        data: {
          totalRegistros: total,
          puntualidad: total > 0 ? Math.round((aTiempo / total) * 100) : 0,
          aTiempo,
          tarde,
          ausencias,
          promedioRetraso,
          totalMinutosRetraso,
          totalHorasExtra: Math.round(horasExtra / 60 * 10) / 10 // Redondear a 1 decimal
        }
      }
    } catch (error) {
      return { success: false, error: 'Error inesperado al calcular métricas' }
    }
  }

  /**
   * Registrar ausencia justificada
   * @param {object} ausenciaData - Datos de la ausencia
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async registrarAusencia(ausenciaData) {
    try {
      const { data, error } = await supabase
        .from('asistencia')
        .insert([{
          usuario_id: ausenciaData.usuario_id,
          fecha: ausenciaData.fecha,
          turno_id: ausenciaData.turno_id || null,
          estado: ausenciaData.justificada ? 'justificado' : 'ausencia',
          observaciones: ausenciaData.observaciones,
          creado_por: ausenciaData.creado_por
        }])
        .select(`
          *,
          usuario:usuario_id(
            id,
            nombre,
            apellido,
            puesto
          )
        `)
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al registrar ausencia' }
    }
  }

  /**
   * Actualizar observaciones de asistencia
   * @param {string} asistenciaId - ID del registro de asistencia
   * @param {string} observaciones - Nuevas observaciones
   * @param {string} modificadoPor - ID del usuario que modifica
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async updateObservaciones(asistenciaId, observaciones, modificadoPor) {
    try {
      const { data, error } = await supabase
        .from('asistencia')
        .update({
          observaciones,
          modificado_por: modificadoPor,
          fecha_modificacion: new Date().toISOString()
        })
        .eq('id', asistenciaId)
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al actualizar observaciones' }
    }
  }

  /**
   * Obtener asistencia del día para un usuario
   * @param {string} usuarioId - ID del usuario
   * @param {string} fecha - Fecha (opcional, por defecto hoy)
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async getAsistenciaDelDia(usuarioId, fecha = null) {
    try {
      const fechaBusqueda = fecha || new Date().toISOString().split('T')[0]

      const { data, error } = await supabase
        .from('asistencia')
        .select(`
          *,
          turno:turno_id(
            id,
            hora_inicio,
            hora_fin,
            area,
            posicion
          )
        `)
        .eq('usuario_id', usuarioId)
        .eq('fecha', fechaBusqueda)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No hay registro para hoy
          return { success: true, data: null }
        }
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener asistencia del día' }
    }
  }
}
