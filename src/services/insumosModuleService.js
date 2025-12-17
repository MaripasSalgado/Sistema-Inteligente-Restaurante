import { InsumoService } from './insumoService'
import { CategoriaInsumoService } from './categoriaInsumoService'
import { LoteInsumoService } from './loteInsumoService'
import { MovimientoInventarioService } from './movimientoInventarioService'

export class InsumosModuleService {
  /**
   * Obtener dashboard completo del módulo de insumos
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async getDashboard() {
    try {
      // Obtener solo datos básicos para evitar conflictos de relaciones
      const [insumosResult, categoriasResult] = await Promise.all([
        InsumoService.getAllInsumos(),
        CategoriaInsumoService.getAllCategorias()
      ])

      // Verificar errores
      if (!insumosResult.success) return insumosResult
      if (!categoriasResult.success) return categoriasResult

      // Calcular estadísticas generales
      const totalInsumos = insumosResult.data.length
      const totalCategorias = categoriasResult.data.length
      const totalLotes = insumosResult.data.reduce((sum, insumo) => sum + insumo.lotes.length, 0)
      const totalStock = insumosResult.data.reduce((sum, insumo) => {
        return sum + insumo.lotes.reduce((loteSum, lote) => loteSum + parseFloat(lote.cantidad_actual), 0)
      }, 0)

      const valorTotalInventario = insumosResult.data.reduce((sum, insumo) => {
        return sum + insumo.lotes.reduce((loteSum, lote) => {
          return loteSum + (parseFloat(lote.cantidad_actual) * parseFloat(lote.precio_unitario))
        }, 0)
      }, 0)

      return {
        success: true,
        data: {
          insumos: insumosResult.data,
          categorias: categoriasResult.data,
          estadisticas: {
            totalInsumos,
            totalCategorias,
            totalLotes,
            totalStock,
            valorTotalInventario
          }
        }
      }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener dashboard' }
    }
  }

  /**
   * Obtener inventario completo con filtros
   * @param {object} filters - Filtros opcionales
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  static async getInventarioCompleto(filters = {}) {
    try {
      let insumosResult

      if (filters.categoria_id) {
        insumosResult = await InsumoService.getInsumosByCategoria(filters.categoria_id)
      } else if (filters.search) {
        insumosResult = await InsumoService.searchInsumos(filters.search)
      } else {
        insumosResult = await InsumoService.getAllInsumos()
      }

      if (!insumosResult.success) {
        return insumosResult
      }

      // Enriquecer datos con estadísticas de lotes
      const insumosEnriquecidos = await Promise.all(
        insumosResult.data.map(async (insumo) => {
          const statsResult = await LoteInsumoService.getLoteStats(insumo.id)
          return {
            ...insumo,
            estadisticas: statsResult.success ? statsResult.data : null
          }
        })
      )

      return { success: true, data: insumosEnriquecidos }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener inventario completo' }
    }
  }

  /**
   * Crear insumo completo (insumo + categorías + lote inicial)
   * @param {object} insumoData - Datos del insumo
   * @param {object} loteData - Datos del lote inicial
   * @param {object} movimientoData - Datos del movimiento inicial
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async createInsumoCompleto(insumoData, loteData, movimientoData) {
    try {
      // 1. Crear el insumo
      const insumoResult = await InsumoService.createInsumo(insumoData)
      if (!insumoResult.success) {
        return insumoResult
      }

      const insumoId = insumoResult.data.id

      // 2. Crear el lote inicial
      const loteResult = await LoteInsumoService.createLote({
        ...loteData,
        insumo_id: insumoId,
        creado_por: insumoData.creado_por
      })

      if (!loteResult.success) {
        // Si falla el lote, eliminar el insumo creado
        await InsumoService.deleteInsumo(insumoId, insumoData.creado_por)
        return loteResult
      }

      const loteId = loteResult.data.id

      // 3. Crear el movimiento inicial si se proporciona
      if (movimientoData) {
        const movimientoResult = await MovimientoInventarioService.createMovimiento({
          ...movimientoData,
          lote_id: loteId,
          usuario_id: insumoData.creado_por
        })

        if (!movimientoResult.success) {
          console.warn('Error al crear movimiento inicial:', movimientoResult.error)
        }
      }

      // 4. Obtener el insumo completo creado
      const insumoCompletoResult = await InsumoService.getInsumoById(insumoId)
      if (!insumoCompletoResult.success) {
        return insumoCompletoResult
      }

      return { success: true, data: insumoCompletoResult.data }
    } catch (error) {
      return { success: false, error: 'Error inesperado al crear insumo completo' }
    }
  }

  /**
   * Obtener reporte de inventario
   * @param {object} filters - Filtros para el reporte
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async getReporteInventario(filters = {}) {
    try {
      // Obtener inventario completo
      const inventarioResult = await this.getInventarioCompleto(filters)
      if (!inventarioResult.success) {
        return inventarioResult
      }

      // Obtener estadísticas de movimientos
      const movimientosStatsResult = await MovimientoInventarioService.getMovimientoStats(filters)
      if (!movimientosStatsResult.success) {
        return movimientosStatsResult
      }

      // Calcular métricas del reporte
      const insumos = inventarioResult.data
      const stats = movimientosStatsResult.data

      const reporte = {
        fechaGeneracion: new Date().toISOString(),
        filtros,
        resumen: {
          totalInsumos: insumos.length,
          totalCategorias: [...new Set(insumos.flatMap(i => i.categorias?.map(c => c.categoria?.id) || []))].length,
          totalLotes: insumos.reduce((sum, insumo) => sum + insumo.lotes.length, 0),
          valorTotalInventario: insumos.reduce((sum, insumo) => {
            return sum + (insumo.estadisticas?.valorTotal || 0)
          }, 0),
          stockTotal: insumos.reduce((sum, insumo) => {
            return sum + (insumo.estadisticas?.totalStock || 0)
          }, 0)
        },
        estadisticasMovimientos: stats,
        insumos: insumos.map(insumo => ({
          id: insumo.id,
          codigo: insumo.codigo,
          nombre: insumo.nombre,
          categorias: insumo.categorias?.map(c => c.categoria?.nombre) || [],
          stockActual: insumo.estadisticas?.totalStock || 0,
          stockInicial: insumo.estadisticas?.totalInicial || 0,
          valorTotal: insumo.estadisticas?.valorTotal || 0,
          lotesActivos: insumo.lotes?.length || 0,
          lotesProximosVencer: insumo.estadisticas?.lotesProximosVencer || 0,
          lotesVencidos: insumo.estadisticas?.lotesVencidos || 0
        }))
      }

      return { success: true, data: reporte }
    } catch (error) {
      return { success: false, error: 'Error inesperado al generar reporte' }
    }
  }

  /**
   * Obtener alertas del módulo de insumos
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async getAlertas() {
    try {
      const [
        lotesProximosVencerResult,
        lotesVencidosResult,
        insumosBajoStockResult
      ] = await Promise.all([
        LoteInsumoService.getLotesProximosVencer(7),
        LoteInsumoService.getLotesVencidos(),
        this.getInsumosBajoStock()
      ])

      const alertas = {
        lotesProximosVencer: lotesProximosVencerResult.success ? lotesProximosVencerResult.data : [],
        lotesVencidos: lotesVencidosResult.success ? lotesVencidosResult.data : [],
        insumosBajoStock: insumosBajoStockResult.success ? insumosBajoStockResult.data : [],
        totalAlertas: 0
      }

      alertas.totalAlertas = alertas.lotesProximosVencer.length + 
                           alertas.lotesVencidos.length + 
                           alertas.insumosBajoStock.length

      return { success: true, data: alertas }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener alertas' }
    }
  }

  /**
   * Obtener insumos con stock bajo
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  static async getInsumosBajoStock() {
    try {
      const insumosResult = await InsumoService.getAllInsumos()
      if (!insumosResult.success) {
        return insumosResult
      }

      const insumosBajoStock = insumosResult.data.filter(insumo => {
        const stockActual = insumo.lotes.reduce((sum, lote) => sum + parseFloat(lote.cantidad_actual), 0)
        return stockActual <= insumo.stock_minimo
      })

      return { success: true, data: insumosBajoStock }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener insumos bajo stock' }
    }
  }
}

// Exportar también los servicios individuales para uso directo
export {
  InsumoService,
  CategoriaInsumoService,
  LoteInsumoService,
  MovimientoInventarioService
}
