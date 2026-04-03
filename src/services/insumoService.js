import { supabase } from '@/config/supabase'

export class InsumoService {
  static normalizarNombre(nombre = '') {
    return String(nombre).trim().replace(/\s+/g, ' ').toLowerCase()
  }

  static async verificarNombreDuplicado(nombre, excludeId = null) {
    const nombreLimpio = String(nombre || '').trim()

    if (!nombreLimpio) {
      return { success: true, existe: false }
    }

    let query = supabase
      .from('insumos')
      .select('id, nombre')
      .ilike('nombre', nombreLimpio)

    if (excludeId) {
      query = query.neq('id', excludeId)
    }

    const { data, error } = await query.limit(10)

    if (error) {
      return { success: false, error: error.message }
    }

    const nombreNormalizado = InsumoService.normalizarNombre(nombreLimpio)
    const duplicadoExacto = (data || []).find(
      insumo => InsumoService.normalizarNombre(insumo.nombre) === nombreNormalizado
    )

    return { success: true, existe: Boolean(duplicadoExacto), insumo: duplicadoExacto || null }
  }

  /**
   * Obtener todos los insumos con sus categorías y lotes
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  static async getAllInsumos() {
    try {
      const { data, error } = await supabase
        .from('insumos')
        .select(`
          *,
          categorias:insumos_categorias(
            categoria:categorias_insumos(*)
          ),
          lotes:lotes_insumos(
            *,
            proveedor:proveedor_id(
              id,
              codigo,
              nombre,
              tipo,
              telefono,
              email,
              estado
            )
          ),
          proveedor_principal:proveedor_principal_id(
            id,
            codigo,
            nombre,
            tipo,
            telefono,
            email,
            estado
          )
        `)
        .order('nombre', { ascending: true })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener insumos' }
    }
  }

  /**
   * Obtener un insumo por ID con sus categorías y lotes
   * @param {string} insumoId - ID del insumo
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async getInsumoById(insumoId) {
    try {
      const { data, error } = await supabase
        .from('insumos')
        .select(`
          *,
          categorias:insumos_categorias(
            categoria:categorias_insumos(*)
          ),
          lotes:lotes_insumos(
            *,
            proveedor:proveedor_id(
              id,
              codigo,
              nombre,
              tipo,
              telefono,
              email,
              estado
            )
          ),
          proveedor_principal:proveedor_principal_id(
            id,
            codigo,
            nombre,
            tipo,
            telefono,
            email,
            estado
          )
        `)
        .eq('id', insumoId)
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener insumo' }
    }
  }

  /**
   * Crear un nuevo insumo
   * @param {object} insumoData - Datos del insumo
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async createInsumo(insumoData) {
    try {
      const validacionNombre = await InsumoService.verificarNombreDuplicado(insumoData.nombre)
      if (!validacionNombre.success) {
        return { success: false, error: validacionNombre.error || 'Error al validar nombre de insumo' }
      }

      if (validacionNombre.existe) {
        return {
          success: false,
          errorCode: 'DUPLICATE_INSUMO_NAME',
          error: 'Insumo ya existe',
          existingInsumo: validacionNombre.insumo
        }
      }

      const { data, error } = await supabase
        .from('insumos')
        .insert([{
          codigo: insumoData.codigo,
          nombre: insumoData.nombre,
          descripcion: insumoData.descripcion || null,
          unidad_medida: insumoData.unidad_medida,
          stock_minimo: insumoData.stock_minimo || 0,
          stock_maximo: insumoData.stock_maximo || null,
          proveedor_principal_id: insumoData.proveedor_principal_id || null,
          estado: 'Activo',
          observaciones: insumoData.observaciones || null,
          creado_por: insumoData.creado_por
        }])
        .select()
        .single()

      if (error) {
        if ((error.code === '23505' || (error.message || '').toLowerCase().includes('duplicate')) &&
            (error.message || '').toLowerCase().includes('nombre')) {
          return {
            success: false,
            errorCode: 'DUPLICATE_INSUMO_NAME',
            error: 'Insumo ya existe'
          }
        }
        return { success: false, error: error.message }
      }

      // Si hay categorías, crear las relaciones
      if (insumoData.categorias && insumoData.categorias.length > 0) {
        const categoriaRelations = insumoData.categorias.map(categoriaId => ({
          insumo_id: data.id,
          categoria_id: categoriaId,
          creado_por: insumoData.creado_por
        }))

        const { error: categoriaError } = await supabase
          .from('insumos_categorias')
          .insert(categoriaRelations)

        if (categoriaError) {
          console.warn('Error al crear relaciones de categorías:', categoriaError.message)
        }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al crear insumo' }
    }
  }

  /**
   * Actualizar un insumo
   * @param {string} insumoId - ID del insumo
   * @param {object} insumoData - Datos actualizados del insumo
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async updateInsumo(insumoId, insumoData) {
    try {
      const validacionNombre = await InsumoService.verificarNombreDuplicado(insumoData.nombre, insumoId)
      if (!validacionNombre.success) {
        return { success: false, error: validacionNombre.error || 'Error al validar nombre de insumo' }
      }

      if (validacionNombre.existe) {
        return {
          success: false,
          errorCode: 'DUPLICATE_INSUMO_NAME',
          error: 'Insumo ya existe',
          existingInsumo: validacionNombre.insumo
        }
      }

      const { data, error } = await supabase
        .from('insumos')
        .update({
          codigo: insumoData.codigo,
          nombre: insumoData.nombre,
          descripcion: insumoData.descripcion || null,
          unidad_medida: insumoData.unidad_medida,
          stock_minimo: insumoData.stock_minimo || 0,
          stock_maximo: insumoData.stock_maximo || null,
          proveedor_principal_id: insumoData.proveedor_principal_id || null,
          observaciones: insumoData.observaciones || null,
          modificado_por: insumoData.modificado_por,
          estado: insumoData.estado,
          fecha_modificacion: new Date().toISOString()
        })
        .eq('id', insumoId)
        .select()
        .single()

      if (error) {
        if ((error.code === '23505' || (error.message || '').toLowerCase().includes('duplicate')) &&
            (error.message || '').toLowerCase().includes('nombre')) {
          return {
            success: false,
            errorCode: 'DUPLICATE_INSUMO_NAME',
            error: 'Insumo ya existe'
          }
        }
        return { success: false, error: error.message }
      }

      // Actualizar categorías si se proporcionaron
      if (insumoData.categorias !== undefined) {
        // Eliminar relaciones existentes
        await supabase
          .from('insumos_categorias')
          .delete()
          .eq('insumo_id', insumoId)

        // Crear nuevas relaciones
        if (insumoData.categorias.length > 0) {
          const categoriaRelations = insumoData.categorias.map(categoriaId => ({
            insumo_id: insumoId,
            categoria_id: categoriaId,
            creado_por: insumoData.modificado_por
          }))

          const { error: categoriaError } = await supabase
            .from('insumos_categorias')
            .insert(categoriaRelations)

          if (categoriaError) {
            console.warn('Error al actualizar relaciones de categorías:', categoriaError.message)
          }
        }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al actualizar insumo' }
    }
  }

  /**
   * Eliminar (desactivar) un insumo
   * @param {string} insumoId - ID del insumo
   * @param {string} modificadoPor - ID del usuario que realiza la acción
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async deleteInsumo(insumoId, modificadoPor) {
    try {
      const { data: insumo, error: insumoError } = await supabase
        .from('insumos')
        .select('id, estado')
        .eq('id', insumoId)
        .single()

      if (insumoError) return { success: false, error: insumoError.message }
      if (!insumo) return { success: false, error: 'Insumo no encontrado' }

      // Verificar si tiene movimientos (usando relación con lotes)
      const { data: lotes, error: lotesError } = await supabase
        .from('lotes_insumos')
        .select('id')
        .eq('insumo_id', insumoId)

      if (lotesError) return { success: false, error: lotesError.message }

      let movimientosCount = 0
      if (lotes && lotes.length > 0) {
        const loteIds = lotes.map(l => l.id)
        const { count, error: movError } = await supabase
          .from('movimientos_inventario')
          .select('*', { count: 'exact', head: true })
          .in('lote_id', loteIds)

        if (movError) return { success: false, error: movError.message }
        movimientosCount = count
      }

      const { count: ingredientesCount, error: ingredientesError } = await supabase
        .from('ingredientes_receta')
        .select('*', { count: 'exact', head: true })
        .eq('insumo_id', insumoId)

      if (ingredientesError) return { success: false, error: ingredientesError.message }

      if (movimientosCount > 0) {
        return {
          success: false,
          blocked: true,
          message: `Insumo tiene ${movimientosCount} movimientos registrados`,
          opciones: ['Desactivar insumo', 'Ver historial completo']
        }
      }

      const tieneLotes = (lotes || []).length > 0
      const tieneIngredientes = (ingredientesCount || 0) > 0

      // Si el insumo ya está inactivo y no tiene dependencias, eliminar físicamente para limpiar duplicados
      if (insumo.estado === 'Inactivo' && !tieneLotes && !tieneIngredientes) {
        const { error: errorCategorias } = await supabase
          .from('insumos_categorias')
          .delete()
          .eq('insumo_id', insumoId)

        if (errorCategorias) return { success: false, error: errorCategorias.message }

        const { error: deleteError } = await supabase
          .from('insumos')
          .delete()
          .eq('id', insumoId)

        if (deleteError) return { success: false, error: deleteError.message }

        return { success: true, message: 'Insumo eliminado permanentemente' }
      }

      if (insumo.estado === 'Inactivo' && (tieneLotes || tieneIngredientes)) {
        return {
          success: false,
          blocked: true,
          message: 'No se puede eliminar permanentemente: el insumo tiene dependencias',
          opciones: ['Ver historial completo']
        }
      }

      // eliminación lógica
      const { error } = await supabase
        .from('insumos')
        .update({
          estado: 'Inactivo',
          modificado_por: modificadoPor,
          fecha_modificacion: new Date().toISOString()
        })
        .eq('id', insumoId)

      if (error) return { success: false, error: error.message }

      return { success: true, message: 'Insumo eliminado lógicamente' }
    } catch (error) {
      return { success: false, error: 'Error inesperado al eliminar insumo' }
    }
  }

  /**
   * Desactivar un insumo verificando dependencias
   * @param {string} insumoId - ID del insumo
   * @param {string} modificadoPor - ID del usuario que realiza la acción
   * @returns {Promise<{success: boolean, error?: string}>}
   */

  static async deactivateInsumo(insumoId, modificadoPor) {
    try {
      // verificar si está en recetas activas
      const { count, error } = await supabase
        .from('ingredientes_receta')
        .select('*', { count: 'exact', head: true })
        .eq('insumo_id', insumoId)

      if (error) return { success: false, error: error.message }

      if (count > 0) {
        return {
          success: false,
          blocked: true,
          message: `⚠️ Usado en ${count} recetas activas`
        }
      }

      const { error: updateError } = await supabase
        .from('insumos')
        .update({
          estado: 'Inactivo',
          modificado_por: modificadoPor,
          fecha_modificacion: new Date().toISOString()
        })
        .eq('id', insumoId)

      if (updateError) return { success: false, error: updateError.message }

      return { success: true, message: 'Insumo desactivado correctamente' }
    } catch (error) {
      return { success: false, error: 'Error inesperado al desactivar insumo' }
    }
  }

  /**
   * Generar código único para insumo
   * Busca todos los códigos existentes con el mismo prefijo/año y encuentra el máximo numérico
   * @param {string} nombre - Nombre del insumo
   * @returns {Promise<{success: boolean, data?: string, error?: string}>}
   */
  static async generateCodigo(nombre) {
    try {
      const prefijo = nombre.substring(0, 2).toUpperCase()
      const año = new Date().getFullYear()

      // Obtener TODOS los códigos del año para encontrar el máximo numérico
      // El orden alfabético no funciona bien con códigos con diferentes longitudes
      const { data, error } = await supabase
        .from('insumos')
        .select('codigo')
        .like('codigo', `${prefijo}-${año}-%`)

      if (error) {
        return { success: false, error: error.message }
      }

      let numeroMaximo = 0
      if (data && data.length > 0) {
        data.forEach(item => {
          if (item.codigo) {
            // Extraer el correlativo (tercer segmento del código)
            const partes = item.codigo.split('-')
            if (partes.length >= 3) {
              const num = parseInt(partes[2], 10)
              if (!isNaN(num) && num > numeroMaximo) {
                numeroMaximo = num
              }
            }
          }
        })
      }

      const correlativo = numeroMaximo + 1
      const codigo = `${prefijo}-${año}-${correlativo.toString().padStart(3, '0')}`

      // Verificar que el código no exista (por si acaso hay race condition)
      const { data: existe } = await supabase
        .from('insumos')
        .select('id')
        .eq('codigo', codigo)
        .limit(1)

      if (existe && existe.length > 0) {
        console.warn('Código de insumo ya existe, usando timestamp:', codigo)
        return { success: true, data: `${prefijo}-${año}-${Date.now().toString().slice(-6)}` }
      }

      return { success: true, data: codigo }
    } catch (error) {
      return { success: false, error: 'Error inesperado al generar código' }
    }
  }

  /**
   * Buscar insumos por nombre o código
   * @param {string} searchTerm - Término de búsqueda
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  static async searchInsumos(searchTerm) {
    try {
      const { data, error } = await supabase
        .from('insumos')
        .select(`
          *,
          categorias:insumos_categorias(
            categoria:categorias_insumos(*)
          ),
          lotes:lotes_insumos(*)
        `)
        .or(`nombre.ilike.%${searchTerm}%,codigo.ilike.%${searchTerm}%`)
        .eq('estado', 'Activo')
        .order('nombre', { ascending: true })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al buscar insumos' }
    }
  }

  /**
   * Obtener insumos por categoría
   * @param {string} categoriaId - ID de la categoría
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  static async getInsumosByCategoria(categoriaId) {
    try {
      const { data, error } = await supabase
        .from('insumos')
        .select(`
          *,
          categorias:insumos_categorias(
            categoria:categorias_insumos(*)
          ),
          lotes:lotes_insumos(*)
        `)
        .eq('categorias.categoria_id', categoriaId)
        .eq('estado', 'Activo')
        .order('nombre', { ascending: true })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener insumos por categoría' }
    }
  }
}
