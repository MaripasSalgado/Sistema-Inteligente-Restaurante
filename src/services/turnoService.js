import { supabase } from '@/config/supabase'

export class TurnoService {
  /**
   * Obtener todos los turnos con filtros opcionales
   * @param {object} filtros - Filtros opcionales (fechaInicio, fechaFin, usuarioId, area, estado)
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  static async getAllTurnos(filtros = {}) {
    try {
      let query = supabase
        .from('turnos')
        .select(`
          *,
          usuario:usuario_id(
            id,
            nombre,
            apellido,
            puesto,
            email,
            telefono
          ),
          creador:creado_por(
            id,
            nombre,
            apellido
          )
        `)

      // Aplicar filtros
      if (filtros.fechaInicio) {
        query = query.gte('fecha', filtros.fechaInicio)
      }
      if (filtros.fechaFin) {
        query = query.lte('fecha', filtros.fechaFin)
      }
      if (filtros.usuarioId) {
        query = query.eq('usuario_id', filtros.usuarioId)
      }
      if (filtros.area) {
        query = query.eq('area', filtros.area)
      }
      if (filtros.estado) {
        query = query.eq('estado', filtros.estado)
      }

      query = query.order('fecha', { ascending: true })
                   .order('hora_inicio', { ascending: true })

      const { data, error } = await query

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener turnos' }
    }
  }

  /**
   * Obtener un turno por ID
   * @param {string} turnoId - ID del turno
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async getTurnoById(turnoId) {
    try {
      const { data, error } = await supabase
        .from('turnos')
        .select(`
          *,
          usuario:usuario_id(
            id,
            nombre,
            apellido,
            puesto,
            email,
            telefono,
            disponibilidad
          ),
          creador:creado_por(
            id,
            nombre,
            apellido
          )
        `)
        .eq('id', turnoId)
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener turno' }
    }
  }

  /**
   * Crear un nuevo turno
   * @param {object} turnoData - Datos del turno
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async createTurno(turnoData) {
    try {
      // Verificar conflictos de horario
      const conflicto = await this.verificarConflictoTurno(
        turnoData.usuario_id,
        turnoData.fecha,
        turnoData.hora_inicio,
        turnoData.hora_fin
      )

      if (!conflicto.success) {
        return conflicto
      }

      if (conflicto.data.hayConflicto) {
        return {
          success: false,
          error: 'El empleado ya tiene un turno asignado en este horario',
          conflicto: conflicto.data.turnoConflicto
        }
      }

      const { data, error } = await supabase
        .from('turnos')
        .insert([{
          usuario_id: turnoData.usuario_id,
          fecha: turnoData.fecha,
          hora_inicio: turnoData.hora_inicio,
          hora_fin: turnoData.hora_fin,
          area: turnoData.area,
          posicion: turnoData.posicion || null,
          estado: turnoData.estado || 'programado',
          notas: turnoData.notas || null,
          creado_por: turnoData.creado_por,
          serie_id: turnoData.serie_id || null
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
      return { success: false, error: 'Error inesperado al crear turno' }
    }
  }

  /**
   * Actualizar un turno
   * @param {string} turnoId - ID del turno
   * @param {object} turnoData - Datos actualizados del turno
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async updateTurno(turnoId, turnoData) {
    try {
      // Si se actualizan horarios, verificar conflictos
      if (turnoData.hora_inicio || turnoData.hora_fin || turnoData.fecha) {
        const turnoActual = await this.getTurnoById(turnoId)
        if (!turnoActual.success) {
          return turnoActual
        }

        const conflicto = await this.verificarConflictoTurno(
          turnoData.usuario_id || turnoActual.data.usuario_id,
          turnoData.fecha || turnoActual.data.fecha,
          turnoData.hora_inicio || turnoActual.data.hora_inicio,
          turnoData.hora_fin || turnoActual.data.hora_fin,
          turnoId // Excluir el turno actual de la verificación
        )

        if (!conflicto.success) {
          return conflicto
        }

        if (conflicto.data.hayConflicto) {
          return {
            success: false,
            error: 'El empleado ya tiene un turno asignado en este horario',
            conflicto: conflicto.data.turnoConflicto
          }
        }
      }

      const updateData = {
        ...turnoData,
        modificado_por: turnoData.modificado_por,
        fecha_modificacion: new Date().toISOString()
      }

      // Remover campos que no se deben actualizar
      delete updateData.id
      delete updateData.fecha_creacion
      delete updateData.creado_por

      const { data, error } = await supabase
        .from('turnos')
        .update(updateData)
        .eq('id', turnoId)
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
      return { success: false, error: 'Error inesperado al actualizar turno' }
    }
  }

  /**
   * Cancelar un turno
   * @param {string} turnoId - ID del turno
   * @param {string} modificadoPor - ID del usuario que cancela
   * @param {string} motivoCancelacion - Motivo de la cancelación
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async cancelarTurno(turnoId, modificadoPor, motivoCancelacion) {
    try {
      const { data, error } = await supabase
        .from('turnos')
        .update({
          estado: 'cancelado',
          notas: motivoCancelacion || null,
          modificado_por: modificadoPor,
          fecha_modificacion: new Date().toISOString()
        })
        .eq('id', turnoId)
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al cancelar turno' }
    }
  }

  /**
   * Eliminar un turno definitivamente
   * @param {string} turnoId
   */
  static async deleteTurno(turnoId) {
    try {
      const { error } = await supabase
        .from('turnos')
        .delete()
        .eq('id', turnoId)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Error inesperado al eliminar el turno' }
    }
  }

  /**
   * Eliminar turnos similares (usado para series recurrentes)
   * @param {object} filtros
   */
  static async deleteTurnosRecurrentes(serieId) {
    try {
      const { data, error } = await supabase
        .from('turnos')
        .delete()
        .eq('serie_id', serieId)
        .select('id')

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al eliminar turnos' }
    }
  }

  /**
   * Crear una serie de turnos recurrentes
   */
  static async createSerie(serieData) {
    try {
      const { data, error } = await supabase
        .from('turno_series')
        .insert([{
          usuario_id: serieData.usuario_id,
          descripcion: serieData.descripcion || null,
          fecha_inicio: serieData.fecha_inicio,
          fecha_fin: serieData.fecha_fin,
          dias_semana: serieData.dias_semana || null,
          hora_inicio: serieData.hora_inicio,
          hora_fin: serieData.hora_fin,
          area: serieData.area,
          posicion: serieData.posicion || null,
          creado_por: serieData.creado_por
        }])
        .select('*')
        .single()

      if (error) {
        return { success: false, error: error.message }
      }
      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al crear la serie' }
    }
  }

  /**
   * Eliminar registro de serie
   */
  static async deleteSerie(serieId) {
    try {
      const { error } = await supabase
        .from('turno_series')
        .delete()
        .eq('id', serieId)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Error inesperado al eliminar la serie' }
    }
  }

  /**
   * Verificar conflicto de horario para un empleado
   * @param {string} usuarioId - ID del usuario
   * @param {string} fecha - Fecha del turno
   * @param {string} horaInicio - Hora de inicio
   * @param {string} horaFin - Hora de fin
   * @param {string} excludeTurnoId - ID del turno a excluir (para actualizaciones)
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async verificarConflictoTurno(usuarioId, fecha, horaInicio, horaFin, excludeTurnoId = null) {
    try {
      let query = supabase
        .from('turnos')
        .select('*')
        .eq('usuario_id', usuarioId)
        .eq('fecha', fecha)
        .neq('estado', 'cancelado')

      if (excludeTurnoId) {
        query = query.neq('id', excludeTurnoId)
      }

      const { data, error } = await query

      if (error) {
        return { success: false, error: error.message }
      }

      // Verificar solapamiento de horarios
      const hayConflicto = data.some(turno => {
        const inicioNuevo = horaInicio
        const finNuevo = horaFin
        const inicioExistente = turno.hora_inicio
        const finExistente = turno.hora_fin

        // Verificar si hay solapamiento
        return (
          (inicioNuevo >= inicioExistente && inicioNuevo < finExistente) ||
          (finNuevo > inicioExistente && finNuevo <= finExistente) ||
          (inicioNuevo <= inicioExistente && finNuevo >= finExistente)
        )
      })

      return {
        success: true,
        data: {
          hayConflicto,
          turnoConflicto: hayConflicto ? data.find(t => {
            const inicioNuevo = horaInicio
            const finNuevo = horaFin
            const inicioExistente = t.hora_inicio
            const finExistente = t.hora_fin
            return (
              (inicioNuevo >= inicioExistente && inicioNuevo < finExistente) ||
              (finNuevo > inicioExistente && finNuevo <= finExistente) ||
              (inicioNuevo <= inicioExistente && finNuevo >= finExistente)
            )
          }) : null
        }
      }
    } catch (error) {
      return { success: false, error: 'Error inesperado al verificar conflictos' }
    }
  }

  /**
   * Obtener cobertura de turnos por área y fecha
   * @param {string} fecha - Fecha a consultar
   * @param {string} area - Área específica (opcional)
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async getCoberturaByAreaYFecha(fecha, area = null) {
    try {
      let query = supabase
        .from('turnos')
        .select('*')
        .eq('fecha', fecha)
        .in('estado', ['programado', 'confirmado'])

      if (area) {
        query = query.eq('area', area)
      }

      const { data: turnos, error } = await query

      if (error) {
        return { success: false, error: error.message }
      }

      // Agrupar por área
      const coberturaData = turnos.reduce((acc, turno) => {
        if (!acc[turno.area]) {
          acc[turno.area] = {
            area: turno.area,
            totalTurnos: 0,
            confirmados: 0,
            pendientes: 0,
            empleados: []
          }
        }

        acc[turno.area].totalTurnos++
        if (turno.estado === 'confirmado') {
          acc[turno.area].confirmados++
        } else if (turno.estado === 'programado') {
          acc[turno.area].pendientes++
        }
        acc[turno.area].empleados.push(turno.usuario_id)

        return acc
      }, {})

      return { success: true, data: coberturaData }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener cobertura' }
    }
  }

  /**
   * Generar sugerencias de turnos basadas en requerimientos
   * @param {string} fechaInicio - Fecha de inicio
   * @param {string} fechaFin - Fecha de fin
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  static async generarSugerenciasTurnos(fechaInicio, fechaFin) {
    try {
      // Obtener franjas requeridas
      const { data: franjas, error: franjasError } = await supabase
        .from('franjas_requeridas')
        .select('*')
        .eq('activo', true)

      if (franjasError) {
        return { success: false, error: franjasError.message }
      }

      // Obtener empleados activos por área
      const { data: empleados, error: empleadosError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('estado', 'Activo')

      if (empleadosError) {
        return { success: false, error: empleadosError.message }
      }

      // Obtener turnos existentes en el rango
      const { data: turnosExistentes, error: turnosError } = await supabase
        .from('turnos')
        .select('*')
        .gte('fecha', fechaInicio)
        .lte('fecha', fechaFin)
        .neq('estado', 'cancelado')

      if (turnosError) {
        return { success: false, error: turnosError.message }
      }

      const sugerencias = []

      // Generar sugerencias basadas en franjas requeridas
      // (Esta lógica se puede mejorar con algoritmos más sofisticados)
      franjas.forEach(franja => {
        const empleadosArea = empleados.filter(emp => {
          // Filtrar por área/departamento
          return emp.departamento?.toLowerCase() === franja.area.toLowerCase()
        })

        const empleadosDisponibles = empleadosArea.filter(emp => {
          // Verificar disponibilidad en el día
          if (emp.disponibilidad && emp.disponibilidad[franja.dia_semana]) {
            return emp.disponibilidad[franja.dia_semana].disponible
          }
          return true
        })

        if (empleadosDisponibles.length < franja.min_empleados) {
          sugerencias.push({
            tipo: 'falta_cobertura',
            area: franja.area,
            dia: franja.dia_semana,
            horaInicio: franja.hora_inicio,
            horaFin: franja.hora_fin,
            requeridos: franja.min_empleados,
            disponibles: empleadosDisponibles.length,
            empleadosSugeridos: empleadosDisponibles.slice(0, franja.min_empleados)
          })
        }
      })

      return { success: true, data: sugerencias }
    } catch (error) {
      return { success: false, error: 'Error inesperado al generar sugerencias' }
    }
  }
}
