import { supabase } from '@/config/supabase'

/**
 * Servicio para gestionar planillas, bonos, deducciones y configuraciones relacionadas.
 * La lógica de cálculo puede mantenerse en el frontend; aquí solo se cubren lecturas y escrituras.
 */
export class PlanillaService {
  /**
   * Obtener planillas con joins comunes y filtros opcionales.
   * @param {object} filtros
   * @param {string} [filtros.periodo]
   * @param {string} [filtros.estado]
   * @param {string} [filtros.usuarioId]
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  static async getPlanillas(filtros = {}) {
    try {
      let query = supabase
        .from('planillas')
        .select(`
          *,
          empleado:usuario_id(
            id,
            nombre,
            apellido,
            email,
            telefono,
            puesto,
            salario_base,
            tarifa_hora,
            tipo_contrato,
            cuenta_banco
          ),
          creador:creado_por(id, nombre, apellido),
          modificador:modificado_por(id, nombre, apellido),
          calculador:calculado_por(id, nombre, apellido),
          bonos:bonos(*),
          deducciones:deducciones(*),
          recibo:recibos_pago(
            id,
            numero_recibo,
            fecha_generacion,
            estado,
            fecha_envio,
            fecha_descarga,
            generado_por
          ),
          historial:historial_pagos(
            id,
            fecha_pago,
            monto_pagado,
            estado,
            metodo_pago,
            periodo
          )
        `)
        .order('fecha_creacion', { ascending: false })

      if (filtros.periodo) {
        query = query.eq('periodo', filtros.periodo)
      }
      if (filtros.estado) {
        query = query.eq('estado', filtros.estado)
      }
      if (filtros.usuarioId) {
        query = query.eq('usuario_id', filtros.usuarioId)
      }

      const { data, error } = await query
      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener planillas' }
    }
  }

  /**
   * Obtener historial de pagos con filtros opcionales.
   * @param {object} filtros
   * @param {string} [filtros.usuarioId]
   * @param {string} [filtros.planillaId]
   * @param {string} [filtros.periodo]
   */
  static async getHistorialPagos(filtros = {}) {
    try {
      let query = supabase
        .from('historial_pagos')
        .select(`
          *,
          usuario:usuario_id(id, nombre, apellido, email, telefono),
          planilla:planilla_id(id, periodo, estado, salario_neto)
        `)
        .order('fecha_pago', { ascending: false })

      if (filtros.usuarioId) {
        query = query.eq('usuario_id', filtros.usuarioId)
      }
      if (filtros.planillaId) {
        query = query.eq('planilla_id', filtros.planillaId)
      }
      if (filtros.periodo) {
        query = query.eq('periodo', filtros.periodo)
      }

      const { data, error } = await query

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener historial de pagos' }
    }
  }

  /**
   * Obtener una planilla por ID con relaciones.
   * @param {string} planillaId
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async getPlanillaById(planillaId) {
    try {
      const { data, error } = await supabase
        .from('planillas')
        .select(`
          *,
          empleado:usuario_id(
            id,
            nombre,
            apellido,
            email,
            telefono,
            puesto,
            salario_base,
            tarifa_hora,
            tipo_contrato,
            cuenta_banco
          ),
          creador:creado_por(id, nombre, apellido),
          modificador:modificado_por(id, nombre, apellido),
          calculador:calculado_por(id, nombre, apellido),
          bonos:bonos(*),
          deducciones:deducciones(*),
          recibo:recibos_pago(
            id,
            numero_recibo,
            fecha_generacion,
            estado,
            fecha_envio,
            fecha_descarga,
            generado_por
          ),
          historial:historial_pagos(
            id,
            fecha_pago,
            monto_pagado,
            estado,
            metodo_pago,
            periodo
          )
        `)
        .eq('id', planillaId)
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener planilla' }
    }
  }

  /**
   * Crear una planilla.
   * Los cálculos (salario_bruto, total_deducciones, salario_neto) pueden venir precalculados desde el frontend.
   * @param {object} payload
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async createPlanilla(payload) {
    try {
      const { data, error } = await supabase
        .from('planillas')
        .insert([{
          usuario_id: payload.usuario_id,
          periodo: payload.periodo,
          fecha_inicio: payload.fecha_inicio,
          fecha_fin: payload.fecha_fin,
          estado: payload.estado || 'pendiente',
          horas_programadas: payload.horas_programadas || 0,
          horas_trabajadas: payload.horas_trabajadas || null,
          horas_ausencia: payload.horas_ausencia || 0,
          horas_extra: payload.horas_extra || 0,
          dias_trabajados: payload.dias_trabajados || null,
          dias_ausencias: payload.dias_ausencias || 0,
          salario_base: payload.salario_base || null,
          monto_horas_extra: payload.monto_horas_extra || 0,
          salario_bruto: payload.salario_bruto || null,
          total_bonos: payload.total_bonos || 0,
          total_deducciones: payload.total_deducciones || 0,
          salario_neto: payload.salario_neto || null,
          fecha_calculo: payload.fecha_calculo || null,
          calculado_por: payload.calculado_por || null,
          fecha_pago: payload.fecha_pago || null,
          recibo_generado: payload.recibo_generado || false,
          creado_por: payload.creado_por || null,
          modificado_por: payload.modificado_por || null
        }])
        .select('*')
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al crear planilla' }
    }
  }

  /**
   * Actualizar una planilla existente.
   * @param {string} planillaId
   * @param {object} payload
   */
  static async updatePlanilla(planillaId, payload) {
    try {
      const { data, error } = await supabase
        .from('planillas')
        .update({
          ...payload,
          fecha_modificacion: new Date().toISOString()
        })
        .eq('id', planillaId)
        .select('*')
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al actualizar planilla' }
    }
  }

  /**
   * Eliminar una planilla y sus relaciones dependientes.
   * Considera manejar borrado en cascada en la base de datos si es necesario.
   * @param {string} planillaId
   */
  static async deletePlanilla(planillaId) {
    try {
      const { error } = await supabase.from('planillas').delete().eq('id', planillaId)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Error inesperado al eliminar planilla' }
    }
  }

  /**
   * Agregar un bono a una planilla.
   * @param {string} planillaId
   * @param {object} payload
   */
  static async addBono(planillaId, payload) {
    try {
      const { data, error } = await supabase
        .from('bonos')
        .insert([{
          planilla_id: planillaId,
          concepto: payload.concepto,
          monto: payload.monto,
          tipo: payload.tipo || 'bono',
          aplicado_por: payload.aplicado_por || null,
          observaciones: payload.observaciones || null
        }])
        .select('*')
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al agregar bono' }
    }
  }

  static async removeBono(bonoId) {
    try {
      const { error } = await supabase.from('bonos').delete().eq('id', bonoId)
      if (error) {
        return { success: false, error: error.message }
      }
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Error inesperado al eliminar bono' }
    }
  }

  /**
   * Agregar una deducción a una planilla.
   * @param {string} planillaId
   * @param {object} payload
   */
  static async addDeduccion(planillaId, payload) {
    try {
      const { data, error } = await supabase
        .from('deducciones')
        .insert([{
          planilla_id: planillaId,
          concepto: payload.concepto,
          monto: payload.monto,
          tipo: payload.tipo,
          aplicado_por: payload.aplicado_por || null,
          observaciones: payload.observaciones || null
        }])
        .select('*')
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al agregar deducción' }
    }
  }

  static async removeDeduccion(deduccionId) {
    try {
      const { error } = await supabase.from('deducciones').delete().eq('id', deduccionId)
      if (error) {
        return { success: false, error: error.message }
      }
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Error inesperado al eliminar deducción' }
    }
  }

  /**
   * Registrar un pago y marcar la planilla.
   * @param {string} planillaId
   * @param {object} payload
   */
  static async registrarPago(planillaId, payload) {
    try {
      const { data, error } = await supabase
        .from('historial_pagos')
        .insert([{
          usuario_id: payload.usuario_id,
          planilla_id: planillaId,
          periodo: payload.periodo,
          fecha_pago: payload.fecha_pago,
          monto_pagado: payload.monto_pagado,
          tipo_pago: payload.tipo_pago || 'regular',
          metodo_pago: payload.metodo_pago || 'transferencia',
          estado: payload.estado || 'pagado',
          numero_comprobante: payload.numero_comprobante || null,
          observaciones: payload.observaciones || null,
          procesado_por: payload.procesado_por || null
        }])
        .select('*')
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      // Marcar planilla como pagada
      await supabase
        .from('planillas')
        .update({
          estado: 'pagada',
          fecha_pago: payload.fecha_pago || new Date().toISOString(),
          fecha_modificacion: new Date().toISOString()
        })
        .eq('id', planillaId)

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al registrar pago' }
    }
  }

  /**
   * Crear registro de recibo y marcar planilla.
   * @param {string} planillaId
   * @param {object} payload
   */
  static async generarRecibo(planillaId, payload) {
    try {
      const { data, error } = await supabase
        .from('recibos_pago')
        .insert([{
          planilla_id: planillaId,
          numero_recibo: payload.numero_recibo,
          archivo_pdf: payload.archivo_pdf || null,
          estado: payload.estado || 'generado',
          fecha_envio: payload.fecha_envio || null,
          fecha_descarga: payload.fecha_descarga || null,
          generado_por: payload.generado_por || null,
          observaciones: payload.observaciones || null
        }])
        .select('*')
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      await supabase
        .from('planillas')
        .update({
          recibo_generado: true,
          fecha_modificacion: new Date().toISOString()
        })
        .eq('id', planillaId)

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al generar recibo' }
    }
  }

  /**
   * Obtener configuraciones de aguinaldo (solo la activa).
   */
  static async getConfiguracionAguinaldo() {
    try {
      const { data, error } = await supabase
        .from('configuracion_aguinaldo')
        .select('*')
        .eq('activa', true)
        .order('fecha_creacion', { ascending: false })
        .limit(1)
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener configuración de aguinaldo' }
    }
  }

  /**
   * Guardar configuraciones de deducciones (seguro social, renta y extras).
   * @param {Array} deducciones - lista de objetos {id?, concepto, porcentaje?, monto_fijo?, tipo, aplica_a, tabla_progresiva?, activa}
   * @param {boolean} eliminarNoIncluidas - si true, elimina configuraciones que no estén en la lista enviada
   */
  static async saveConfiguracionDeducciones(deducciones = [], eliminarNoIncluidas = true) {
    try {
      const payload = deducciones.map(d => {
        const row = {
          concepto: d.concepto,
          porcentaje: d.porcentaje ?? null,
          monto_fijo: d.monto_fijo ?? null,
          tipo: d.tipo || 'legal',
          aplica_a: d.aplica_a || 'todos',
          tabla_progresiva: d.tabla_progresiva || null,
          activa: d.activa ?? true
        }

        // Evita enviar id nulo a la columna NOT NULL; si no hay id, que el default genere uno.
        if (d.id) {
          row.id = d.id
        }
        return row
      })

      const { data, error } = await supabase
        .from('configuracion_deducciones')
        .upsert(payload)
        .select('*')

      if (error) {
        return { success: false, error: error.message }
      }

      if (eliminarNoIncluidas) {
        const { data: existentes } = await supabase
          .from('configuracion_deducciones')
          .select('id, concepto')

        const conceptosEnviados = new Set(payload.map(p => p.concepto))
        const aEliminar = (existentes || [])
          .filter(row => !conceptosEnviados.has(row.concepto))
          .map(row => row.id)

        if (aEliminar.length > 0) {
          await supabase.from('configuracion_deducciones').delete().in('id', aEliminar)
        }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al guardar configuración de deducciones' }
    }
  }

  /**
   * Actualizar o crear configuración de aguinaldo.
   * @param {object} payload
   */
  static async upsertConfiguracionAguinaldo(payload) {
    try {
      // Build payload dynamically to avoid sending null id to NOT NULL column
      const row = {
        porcentaje: payload.porcentaje,
        dias_minimos: payload.dias_minimos || 0,
        activa: payload.activa ?? true,
        modificado_por: payload.modificado_por || null
      }

      // Only include id if it exists, letting the database generate one for new records
      if (payload.id) {
        row.id = payload.id
      }

      const { data, error } = await supabase
        .from('configuracion_aguinaldo')
        .upsert([row])
        .select('*')
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al guardar configuración de aguinaldo' }
    }
  }

  /**
   * Obtener catálogo de deducciones configurables.
   */
  static async getConfiguracionDeducciones() {
    try {
      const { data, error } = await supabase
        .from('configuracion_deducciones')
        .select('*')
        .eq('activa', true)
        .order('concepto', { ascending: true })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener configuración de deducciones' }
    }
  }

  /**
   * Obtener empleados activos para construir planillas.
   */
  static async getEmpleadosActivos() {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('id, nombre, apellido, cedula, puesto, email, telefono, salario_base, tarifa_hora, tipo_contrato, cuenta_banco, fecha_ingreso')
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
}
