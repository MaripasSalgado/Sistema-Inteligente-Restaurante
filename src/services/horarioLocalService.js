import { supabase } from '@/config/supabase'

export class HorarioLocalService {
  /**
   * Obtener todos los horarios del local
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  static async getAllHorarios() {
    try {
      const { data, error } = await supabase
        .from('horarios_local')
        .select('*')
        .eq('activo', true)
        .order('id', { ascending: true })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener horarios' }
    }
  }

  /**
   * Obtener horario por día de la semana
   * @param {string} diaSemana - Día de la semana (lunes, martes, etc.)
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async getHorarioByDia(diaSemana) {
    try {
      const { data, error } = await supabase
        .from('horarios_local')
        .select('*')
        .eq('dia_semana', diaSemana)
        .eq('activo', true)
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener horario' }
    }
  }

  /**
   * Actualizar horarios del local
   * @param {array} horariosData - Array de horarios a actualizar
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  static async updateHorarios(horariosData) {
    try {
      const promises = horariosData.map(async (horario) => {
        // Primero verificar si existe un registro para este día
        const { data: existingData, error: checkError } = await supabase
          .from('horarios_local')
          .select('id')
          .eq('dia_semana', horario.dia_semana)
          .single()

        if (checkError && checkError.code !== 'PGRST116') {
          // PGRST116 es el código para "no se encontraron filas"
          throw checkError
        }

        // Si existe, actualizar; si no, insertar
        if (existingData) {
          const { data, error } = await supabase
            .from('horarios_local')
            .update({
              abierto: horario.abierto,
              hora_apertura: horario.abierto ? horario.hora_apertura : null,
              hora_cierre: horario.abierto ? horario.hora_cierre : null,
              fecha_modificacion: new Date().toISOString()
            })
            .eq('id', existingData.id)
            .select()
            .single()

          if (error) throw error
          return data
        } else {
          const { data, error } = await supabase
            .from('horarios_local')
            .insert({
              dia_semana: horario.dia_semana,
              abierto: horario.abierto,
              hora_apertura: horario.abierto ? horario.hora_apertura : null,
              hora_cierre: horario.abierto ? horario.hora_cierre : null,
              activo: true
            })
            .select()
            .single()

          if (error) throw error
          return data
        }
      })

      const results = await Promise.all(promises)
      return { success: true, data: results }
    } catch (error) {
      return { success: false, error: error.message || 'Error inesperado al actualizar horarios' }
    }
  }

  /**
   * Verificar si el local está abierto en un día y hora específicos
   * @param {string} diaSemana - Día de la semana
   * @param {string} hora - Hora en formato HH:MM
   * @returns {Promise<{success: boolean, data?: boolean, error?: string}>}
   */
  static async isLocalAbierto(diaSemana, hora) {
    try {
      const { data, error } = await supabase
        .from('horarios_local')
        .select('*')
        .eq('dia_semana', diaSemana)
        .eq('abierto', true)
        .eq('activo', true)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No hay registro o está cerrado
          return { success: true, data: false }
        }
        return { success: false, error: error.message }
      }

      // Verificar si la hora está dentro del rango
      const estaAbierto = data &&
                         hora >= data.hora_apertura &&
                         hora <= data.hora_cierre

      return { success: true, data: estaAbierto }
    } catch (error) {
      return { success: false, error: 'Error inesperado al verificar horario' }
    }
  }
}
