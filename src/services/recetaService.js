import { supabase } from '@/config/supabase'
import { getTimestampCostaRica } from '@/utils/dateHelper'

export class RecetaService {
  /**
   * Obtener todas las recetas
   * @param {object} filters - Filtros opcionales
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  static async getAllRecetas(filters = {}) {
    try {
      console.log('🔍 getAllRecetas - Iniciando query con filtros:', filters)
      
      let query = supabase
        .from('recetas')
        .select(`
          *,
          categoria:categoria_id(
            id,
            nombre,
            color,
            icono
          ),
          creado_por:creado_por(
            id,
            nombre,
            apellido
          ),
          modificado_por:modificado_por(
            id,
            nombre,
            apellido
          ),
          ingredientes:ingredientes_receta(
            *,
            insumos:insumo_id(
              id,
              nombre,
              unidad_medida
            )
          ),
          pasos:pasos_receta(
            id,
            numero_paso,
            descripcion
          )
        `)
        .order('fecha_creacion', { ascending: false })

      // Aplicar filtros
      if (filters.activa !== undefined) {
        query = query.eq('activa', filters.activa)
      }
      if (filters.categoria_id) {
        query = query.eq('categoria_id', filters.categoria_id)
      }
      if (filters.nombre) {
        query = query.ilike('nombre', `%${filters.nombre}%`)
      }

      const { data, error } = await query

      console.log('🔍 getAllRecetas - Resultado query:', { data, error })

      if (error) {
        console.error('❌ getAllRecetas - Error:', error)
        return { success: false, error: error.message }
      }

      // Ordenar pasos por numero_paso para cada receta
      if (data && Array.isArray(data)) {
        data.forEach(receta => {
          if (receta.pasos && Array.isArray(receta.pasos)) {
            receta.pasos.sort((a, b) => a.numero_paso - b.numero_paso)
          }
        })
      }

      console.log('✅ getAllRecetas - Datos obtenidos:', data?.length || 0, 'recetas')
      return { success: true, data }
    } catch (error) {
      console.error('❌ getAllRecetas - Error inesperado:', error)
      return { success: false, error: 'Error inesperado al obtener recetas' }
    }
  }

  /**
   * Obtener una receta por ID
   * @param {string} recetaId - ID de la receta
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async getRecetaById(recetaId) {
    try {
      const { data, error } = await supabase
        .from('recetas')
        .select(`
          *,
          categoria:categoria_id(
            id,
            nombre,
            color,
            icono
          ),
          ingredientes:ingredientes_receta(
            *,
            insumos:insumo_id(
              id,
              nombre,
              unidad_medida
            )
          ),
          pasos:pasos_receta(
            id,
            numero_paso,
            descripcion
          )
        `)
        .eq('id', recetaId)
        .single()

      if (error) {
        console.error('❌ getRecetaById - Error:', error)
        return { success: false, error: error.message }
      }

      // Ordenar pasos por numero_paso
      if (data.pasos) {
        data.pasos.sort((a, b) => a.numero_paso - b.numero_paso)
      }

      return { success: true, data }
    } catch (error) {
      console.error('❌ getRecetaById - Error inesperado:', error)
      return { success: false, error: 'Error inesperado al obtener receta' }
    }
  }

  /**
   * Crear una nueva receta
   * @param {object} recetaData - Datos de la receta
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async createReceta(recetaData) {
    try {
      console.log('📝 createReceta - Datos recibidos:', recetaData)
      console.log('👤 Usuario (creado_por):', recetaData.creado_por)

      if (!recetaData.creado_por) {
        console.error('❌ No se proporcionó creado_por')
        return { success: false, error: 'Debe estar autenticado para crear recetas' }
      }

      // Generar código único si no se proporciona
      console.log('🔢 Generando código de receta...')
      let codigo = recetaData.codigo
      if (!codigo) {
        const { data: recetasExistentes } = await supabase
          .from('recetas')
          .select('codigo')
          .not('codigo', 'is', null)
          .order('codigo', { ascending: false })
          .limit(1)

        const ultimoCodigo = recetasExistentes?.[0]?.codigo || 'REC-000'
        const numero = parseInt(ultimoCodigo.match(/REC-(\d+)/)?.[1] || '0', 10) + 1
        codigo = `REC-${String(numero).padStart(3, '0')}`
        console.log('🔢 Código generado:', codigo)
      }

      const costoTotal = recetaData.costo_total ?? 0.0
      let precioSugerido = recetaData.precio_sugerido ?? 0.0
      let margenGanancia = recetaData.margen_ganancia ?? 0.0

      if ((!precioSugerido || precioSugerido === 0) && costoTotal > 0) {
        precioSugerido = Number((costoTotal * 1.65).toFixed(2))
      }
      if ((!margenGanancia || margenGanancia === 0) && precioSugerido > 0) {
        margenGanancia = Number((precioSugerido - costoTotal).toFixed(2))
      }

      // Crear la receta
      console.log('💾 Insertando receta en BD...')
      const { data, error } = await supabase
        .from('recetas')
        .insert([{
          codigo: codigo,
          nombre: recetaData.nombre,
          descripcion: recetaData.descripcion || null,
          categoria_id: recetaData.categoria_id,
          tiempo_preparacion: recetaData.tiempo_preparacion,
          rendimiento: recetaData.rendimiento,
          nivel_dificultad: recetaData.nivel_dificultad || 'Intermedio',
          instrucciones: recetaData.instrucciones || '',
          costo_total: costoTotal,
          precio_sugerido: precioSugerido,
          margen_ganancia: margenGanancia,
          activa: recetaData.activa !== undefined ? recetaData.activa : true,
          creado_por: recetaData.creado_por,
          fecha_creacion: getTimestampCostaRica(),
          fecha_modificacion: getTimestampCostaRica()
        }])
        .select()
        .single()

      if (error) {
        console.error('❌ Error al crear receta:', error)
        return { success: false, error: error.message }
      }

      console.log('✅ Receta creada:', data)

      // Si hay ingredientes asociados, crear las relaciones
      if (recetaData.ingredientes && recetaData.ingredientes.length > 0) {
        const ingredientesRelaciones = recetaData.ingredientes.map(ingrediente => ({
          receta_id: data.id,
          insumo_id: ingrediente.insumo_id,
          cantidad: ingrediente.cantidad,
          unidad_medida: ingrediente.unidad_medida,
          costo_unitario: ingrediente.costo_unitario || 0.0,
          costo_total: ingrediente.costo_total || 0.0,
          observaciones: ingrediente.observaciones || null,
          fecha_creacion: getTimestampCostaRica(),
          fecha_modificacion: getTimestampCostaRica()
        }))

        const { error: errorIngredientes } = await supabase
          .from('ingredientes_receta')
          .insert(ingredientesRelaciones)

        if (errorIngredientes) {
          console.error('❌ Error al crear relaciones de ingredientes:', errorIngredientes)
          // No fallamos la creación de la receta, solo registramos el error
        }
      }

      // Si hay pasos de preparación, crear las relaciones
      if (recetaData.pasos && recetaData.pasos.length > 0) {
        const pasosRelaciones = recetaData.pasos.map((descripcion, index) => ({
          receta_id: data.id,
          numero_paso: index + 1,
          descripcion: descripcion,
          fecha_creacion: getTimestampCostaRica(),
          fecha_modificacion: getTimestampCostaRica()
        }))

        const { error: errorPasos } = await supabase
          .from('pasos_receta')
          .insert(pasosRelaciones)

        if (errorPasos) {
          console.error('❌ Error al crear pasos de receta:', errorPasos)
          // No fallamos la creación de la receta, solo registramos el error
        }
      }

      return { success: true, data }
    } catch (error) {
      console.error('❌ Error inesperado al crear receta:', error)
      return { success: false, error: 'Error inesperado al crear receta' }
    }
  }

  /**
   * Actualizar una receta existente
   * @param {string} recetaId - ID de la receta
   * @param {object} recetaData - Datos actualizados de la receta
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async updateReceta(recetaId, recetaData) {
    try {
      console.log('📝 updateReceta - Datos recibidos:', { recetaId, recetaData })
      
      // Actualizar la receta
      const { data, error } = await supabase
        .from('recetas')
        .update({
          nombre: recetaData.nombre,
          descripcion: recetaData.descripcion || null,
          categoria_id: recetaData.categoria_id,
          tiempo_preparacion: recetaData.tiempo_preparacion,
          rendimiento: recetaData.rendimiento,
          nivel_dificultad: recetaData.nivel_dificultad || 'Intermedio',
          instrucciones: recetaData.instrucciones,
          costo_total: recetaData.costo_total || 0.0,
          precio_sugerido: recetaData.precio_sugerido || 0.0,
          margen_ganancia: recetaData.margen_ganancia || 0.0,
          activa: recetaData.activa !== undefined ? recetaData.activa : true,
          modificado_por: recetaData.modificado_por,
          fecha_modificacion: getTimestampCostaRica()
        })
        .eq('id', recetaId)
        .select()
        .single()

      if (error) {
        console.error('❌ Error al actualizar receta:', error)
        return { success: false, error: error.message }
      }

      console.log('✅ Receta actualizada:', data)

      // Actualizar relaciones de ingredientes si se proporcionan
      if (recetaData.ingredientes !== undefined) {
        // Primero eliminar relaciones existentes
        const { error: errorDelete } = await supabase
          .from('ingredientes_receta')
          .delete()
          .eq('receta_id', recetaId)

        if (errorDelete) {
          console.error('❌ Error al eliminar relaciones de ingredientes:', errorDelete)
        }

        // Luego crear las nuevas relaciones
        if (recetaData.ingredientes && recetaData.ingredientes.length > 0) {
          const ingredientesRelaciones = recetaData.ingredientes.map(ingrediente => ({
            receta_id: recetaId,
            insumo_id: ingrediente.insumo_id,
            cantidad: ingrediente.cantidad,
            unidad_medida: ingrediente.unidad_medida,
            costo_unitario: ingrediente.costo_unitario || 0.0,
            costo_total: ingrediente.costo_total || 0.0,
            observaciones: ingrediente.observaciones || null,
            fecha_creacion: getTimestampCostaRica(),
            fecha_modificacion: getTimestampCostaRica()
          }))

          const { error: errorIngredientes } = await supabase
            .from('ingredientes_receta')
            .insert(ingredientesRelaciones)

          if (errorIngredientes) {
            console.error('❌ Error al crear relaciones de ingredientes:', errorIngredientes)
          }
        }
      }

      // Actualizar pasos de preparación si se proporcionan
      if (recetaData.pasos !== undefined) {
        // Primero eliminar pasos existentes
        const { error: errorDeletePasos } = await supabase
          .from('pasos_receta')
          .delete()
          .eq('receta_id', recetaId)

        if (errorDeletePasos) {
          console.error('❌ Error al eliminar pasos de receta:', errorDeletePasos)
        }

        // Luego crear los nuevos pasos
        if (recetaData.pasos && recetaData.pasos.length > 0) {
          const pasosRelaciones = recetaData.pasos.map((descripcion, index) => ({
            receta_id: recetaId,
            numero_paso: index + 1,
            descripcion: descripcion,
            fecha_creacion: getTimestampCostaRica(),
            fecha_modificacion: getTimestampCostaRica()
          }))

          const { error: errorPasos } = await supabase
            .from('pasos_receta')
            .insert(pasosRelaciones)

          if (errorPasos) {
            console.error('❌ Error al crear pasos de receta:', errorPasos)
          }
        }
      }

      return { success: true, data }
    } catch (error) {
      console.error('❌ Error inesperado al actualizar receta:', error)
      return { success: false, error: 'Error inesperado al actualizar receta' }
    }
  }

  /**
   * Eliminar una receta
   * @param {string} recetaId - ID de la receta
   * @param {string} usuarioId - ID del usuario que elimina
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async deleteReceta(recetaId, usuarioId) {
    try {
      console.log('🗑️ deleteReceta - Datos recibidos:', { recetaId, usuarioId })

      // Los pasos se eliminan automáticamente por ON DELETE CASCADE
      // Pero eliminamos explícitamente las otras relaciones

      // Eliminar relaciones con ingredientes
      const { error: errorIngredientes } = await supabase
        .from('ingredientes_receta')
        .delete()
        .eq('receta_id', recetaId)

      if (errorIngredientes) {
        console.error('❌ Error al eliminar relaciones de ingredientes:', errorIngredientes)
        return { success: false, error: errorIngredientes.message }
      }

      // Eliminar pasos de receta
      const { error: errorPasos } = await supabase
        .from('pasos_receta')
        .delete()
        .eq('receta_id', recetaId)

      if (errorPasos) {
        console.error('❌ Error al eliminar pasos de receta:', errorPasos)
        return { success: false, error: errorPasos.message }
      }

      // Eliminar la receta
      const { error } = await supabase
        .from('recetas')
        .delete()
        .eq('id', recetaId)

      if (error) {
        console.error('❌ Error al eliminar receta:', error)
        return { success: false, error: error.message }
      }

      console.log('✅ Receta eliminada exitosamente')
      return { success: true }
    } catch (error) {
      console.error('❌ Error inesperado al eliminar receta:', error)
      return { success: false, error: 'Error inesperado al eliminar receta' }
    }
  }

  /**
   * Obtener estadísticas de recetas
   * @param {object} filters - Filtros opcionales
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async getRecetaStats(filters = {}) {
    try {
      let query = supabase
        .from('recetas')
        .select('costo_total, precio_sugerido, margen_ganancia, categoria_id, veces_preparada')

      // Aplicar filtros
      if (filters.activa !== undefined) {
        query = query.eq('activa', filters.activa)
      }
      if (filters.categoria_id) {
        query = query.eq('categoria_id', filters.categoria_id)
      }

      const { data, error } = await query

      if (error) {
        return { success: false, error: error.message }
      }

      // Calcular estadísticas
      const stats = {
        totalRecetas: data.length,
        recetasActivas: data.filter(r => r.activa).length,
        costoPromedio: data.reduce((sum, r) => sum + parseFloat(r.costo_total || 0), 0) / data.length,
        margenPromedio: data.reduce((sum, r) => sum + parseFloat(r.margen_ganancia || 0), 0) / data.length,
        totalPreparaciones: data.reduce((sum, r) => sum + (r.veces_preparada || 0), 0),
        recetasPorCategoria: {}
      }

      // Agrupar por categoría
      data.forEach(receta => {
        const catId = receta.categoria_id
        if (!stats.recetasPorCategoria[catId]) {
          stats.recetasPorCategoria[catId] = 0
        }
        stats.recetasPorCategoria[catId]++
      })

      return { success: true, data: stats }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener estadísticas' }
    }
  }

  /**
   * Buscar recetas por término
   * @param {string} searchTerm - Término de búsqueda
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  static async searchRecetas(searchTerm) {
    try {
      const { data, error } = await supabase
        .from('recetas')
        .select(`
          *,
          categoria:categoria_id(
            id,
            nombre,
            color,
            icono
          )
        `)
        .or(`nombre.ilike.%${searchTerm}%,codigo.ilike.%${searchTerm}%,descripcion.ilike.%${searchTerm}%`)
        .order('nombre')

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al buscar recetas' }
    }
  }

  /**
   * Actualizar contador de preparaciones de una receta
   * @param {string} recetaId - ID de la receta
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async actualizarPreparacionesReceta(recetaId) {
    try {
      const { data, error } = await supabase
        .from('recetas')
        .select('veces_preparada')
        .eq('id', recetaId)
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      const nuevasPreparaciones = (data.veces_preparada || 0) + 1

      const { error: updateError } = await supabase
        .from('recetas')
        .update({
          veces_preparada: nuevasPreparaciones,
          fecha_modificacion: getTimestampCostaRica()
        })
        .eq('id', recetaId)

      if (updateError) {
        return { success: false, error: updateError.message }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Error inesperado al actualizar preparaciones' }
    }
  }
}
