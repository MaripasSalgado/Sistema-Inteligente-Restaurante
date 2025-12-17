import { supabase } from '@/config/supabase'

/**
 * Servicio para consultar y actualizar información salarial de usuarios.
 * Incluye escritura en historial_salarios si la tabla existe.
 */
export class UserSalaryService {
  /**
   * Obtener listado básico de empleados para edición salarial.
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  static async getEmpleadosSalario() {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('id, nombre, apellido, puesto, salario_base, tarifa_hora, tipo_contrato, cuenta_banco, estado')
        .eq('estado', 'Activo')
        .order('nombre', { ascending: true })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener empleados' }
    }
  }

  /**
   * Actualizar salario base, tarifa por hora o tipo de contrato.
   * @param {string} userId
   * @param {object} payload
   * @param {number} [payload.salario_base]
   * @param {number} [payload.tarifa_hora]
   * @param {string} [payload.tipo_contrato]
   * @param {string} [payload.cuenta_banco]
   * @param {string} [payload.modificado_por]
   */
  static async updateSalario(userId, payload) {
    try {
      const updateData = {
        salario_base: payload.salario_base ?? null,
        tarifa_hora: payload.tarifa_hora ?? null,
        tipo_contrato: payload.tipo_contrato || null,
        cuenta_banco: payload.cuenta_banco || null,
        fecha_modificacion: new Date().toISOString(),
        modificado_por: payload.modificado_por || null
      }

      const { data, error } = await supabase
        .from('usuarios')
        .update(updateData)
        .eq('id', userId)
        .select('id, nombre, apellido, salario_base, tarifa_hora, tipo_contrato, cuenta_banco')
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      // Registrar historial si la tabla existe
      await supabase.from('historial_salarios').insert([{
        usuario_id: userId,
        salario_anterior: payload.salario_anterior ?? null,
        salario_nuevo: payload.salario_base ?? null,
        tarifa_hora_anterior: payload.tarifa_hora_anterior ?? null,
        tarifa_hora_nueva: payload.tarifa_hora ?? null,
        tipo_contrato_anterior: payload.tipo_contrato_anterior || null,
        tipo_contrato_nuevo: payload.tipo_contrato || null,
        cambiado_por: payload.modificado_por || null,
        motivo: payload.motivo || 'Actualización manual'
      }]).throwOnError()

      return { success: true, data }
    } catch (error) {
      // Si falla el insert al historial pero no el update, igual retornamos success del update
      if (error?.message?.includes('historial_salarios')) {
        return { success: true, warning: 'Salario actualizado, pero no se registró en historial_salarios (tabla inexistente)' }
      }
      return { success: false, error: 'Error inesperado al actualizar salario' }
    }
  }

  /**
   * Obtener historial salarial de un usuario.
   * @param {string} usuarioId
   */
  static async getHistorialSalarios(usuarioId) {
    try {
      const { data, error } = await supabase
        .from('historial_salarios')
        .select('*')
        .eq('usuario_id', usuarioId)
        .order('fecha_cambio', { ascending: false })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener historial salarial' }
    }
  }
}
