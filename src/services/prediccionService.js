import { supabase } from '@/config/supabase'

export class PrediccionService {

    // =====================================================
    // PREDICCIONES DE INSUMOS
    // =====================================================

    /**
     * Obtiene predicciones de demanda de insumos para el próximo mes
     * @param {string} periodo - 'mensual' o 'semanal'
     * @returns {Promise<Array>}
     */
    static async getPrediccionesInsumos(periodo = 'mensual', fechaFiltro = null) {
        const today = new Date().toISOString().split('T')[0]
        if (fechaFiltro) {
        }

        let query = supabase
            .from('predicciones')
            .select(`
                *,
                insumos (
                    id,
                    nombre,
                    codigo,
                    unidad_medida
                )
            `)
            .eq('tipo_prediccion', 'demanda_insumos')
            .eq('periodo', periodo)

        if (fechaFiltro) {
            query = query.eq('fecha_inicio', fechaFiltro)
        } else {
            query = query.gte('fecha_inicio', today)
        }

        const { data, error } = await query
            .order('valor_predicho', { ascending: false })
            .limit(10)

        if (error) {
            console.error('❌ [getPrediccionesInsumos] Error:', error)
            return []
        }
        return data.map(pred => ({
            id: pred.id,
            insumo_id: pred.insumo_id,
            nombre: pred.insumos?.nombre || 'Desconocido',
            codigo: pred.insumos?.codigo,
            unidad_medida: pred.insumos?.unidad_medida || 'kg',
            valor_predicho: pred.valor_predicho,
            margen_error: pred.parametros?.margen_error || 0,
            nivel_confianza: pred.nivel_confianza,
            fecha_inicio: pred.fecha_inicio,
            fecha_fin: pred.fecha_fin,
            algoritmo: pred.algoritmo
        }))
    }

    /**
     * Obtiene predicción semanal de insumos (corto plazo)
     */
    static async getPrediccionesInsumosSemanal(fechaFiltro = null) {
        return await this.getPrediccionesInsumos('semanal', fechaFiltro)
    }

    /**
     * Obtiene predicción mensual de insumos
     */
    static async getPrediccionesInsumosMensual(fechaFiltro = null) {
        return await this.getPrediccionesInsumos('mensual', fechaFiltro)
    }

    // =====================================================
    // PREDICCIONES DE VENTAS
    // =====================================================

    /**
     * Obtiene predicciones de ventas de productos para el próximo mes
     * @returns {Promise<Array>}
     */
    static async getPrediccionesVentas(fechaFiltro = null) {
        const today = new Date().toISOString().split('T')[0]
        if (fechaFiltro) {
        }

        let query = supabase
            .from('predicciones')
            .select(`
                *,
                productos (
                    id,
                    nombre,
                    codigo,
                    precio_venta
                )
            `)
            .eq('tipo_prediccion', 'ventas_productos')
            .eq('periodo', 'mensual')

        if (fechaFiltro) {
            query = query.eq('fecha_inicio', fechaFiltro)
        } else {
            query = query.gte('fecha_inicio', today)
        }

        const { data, error } = await query
            .order('valor_predicho', { ascending: false })
            .limit(8)

        if (error) {
            console.error('❌ [getPrediccionesVentas] Error:', error)
            return []
        }
        return data.map(pred => ({
            id: pred.id,
            producto_id: pred.producto_id,
            nombre: pred.productos?.nombre || 'Desconocido',
            codigo: pred.productos?.codigo,
            precio_unitario: pred.productos?.precio_venta,
            valor_predicho: pred.valor_predicho,
            banda_superior: pred.parametros?.banda_superior || pred.valor_predicho,
            banda_inferior: pred.parametros?.banda_inferior || pred.valor_predicho,
            margen_error: pred.parametros?.margen_error || 0,
            nivel_confianza: pred.nivel_confianza,
            fecha_inicio: pred.fecha_inicio,
            fecha_fin: pred.fecha_fin,
            algoritmo: pred.algoritmo
        }))
    }

    /**
     * Obtiene predicción de ingresos totales del restaurante
     */
    static async getPrediccionIngresos(fechaFiltro = null) {
        const today = new Date().toISOString().split('T')[0]
        if (fechaFiltro) {
        }

        let query = supabase
            .from('predicciones')
            .select('*')
            .eq('tipo_prediccion', 'ingresos')
            .eq('periodo', 'mensual')

        if (fechaFiltro) {
            query = query.eq('fecha_inicio', fechaFiltro)
        } else {
            query = query.gte('fecha_inicio', today)
                .order('fecha_inicio', { ascending: true })
        }

        const { data, error } = await query.limit(1)

        if (error) {
            console.error('❌ [getPrediccionIngresos] Error:', error)
            return null
        }

        const registro = Array.isArray(data) ? data[0] : data

        if (!registro) {
            console.warn('⚠️ [getPrediccionIngresos] Sin registros para los filtros aplicados')
            return null
        }
        return {
            valor_predicho: registro.valor_predicho,
            banda_superior: registro.parametros?.banda_superior,
            banda_inferior: registro.parametros?.banda_inferior,
            nivel_confianza: registro.nivel_confianza,
            fecha_inicio: registro.fecha_inicio,
            fecha_fin: registro.fecha_fin
        }
    }

    // =====================================================
    // TENDENCIAS Y COMPARACIONES HISTÓRICAS
    // =====================================================

    /**
     * Obtiene datos históricos vs predicciones para gráficos de tendencias
     * @param {string} tipoPrediccion - 'demanda_insumos' o 'ventas_productos'
     * @param {number} meses - Cantidad de meses hacia atrás
     */
    static async getTendenciasHistoricas(tipoPrediccion = 'ingresos', meses = 12, fechaFiltro = null) {
        const fechaInicio = new Date()
        fechaInicio.setMonth(fechaInicio.getMonth() - meses)
        if (fechaFiltro) {
        }

        let query = supabase
            .from('predicciones')
            .select('*')
            .eq('tipo_prediccion', tipoPrediccion)

        if (fechaFiltro) {
            query = query.eq('fecha_inicio', fechaFiltro)
        } else {
            query = query.gte('fecha_inicio', fechaInicio.toISOString().split('T')[0])
        }

        const { data, error } = await query.order('fecha_inicio', { ascending: true })

        if (error) {
            console.error('❌ [getTendenciasHistoricas] Error:', error)
            return {
                labels: [],
                predicciones: [],
                valoresReales: [],
                bandasSuperior: [],
                bandasInferior: []
            }
        }
        const labels = []
        const predicciones = []
        const valoresReales = []
        const bandasSuperior = []
        const bandasInferior = []

        data.forEach(pred => {
            const mesLabel = new Date(pred.fecha_inicio).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })
            labels.push(mesLabel)
            predicciones.push(pred.valor_predicho != null ? Number(pred.valor_predicho) : null)
            valoresReales.push(pred.valor_real != null ? Number(pred.valor_real) : null)
            bandasSuperior.push(
                pred.parametros?.banda_superior != null
                    ? Number(pred.parametros?.banda_superior)
                    : (pred.valor_predicho != null ? Number(pred.valor_predicho) : null)
            )
            bandasInferior.push(
                pred.parametros?.banda_inferior != null
                    ? Number(pred.parametros?.banda_inferior)
                    : (pred.valor_predicho != null ? Number(pred.valor_predicho) : null)
            )
        })

        return {
            labels,
            predicciones,
            valoresReales,
            bandasSuperior,
            bandasInferior
        }
    }

    // =====================================================
    // DESVIACIONES Y PRECISIÓN
    // =====================================================

    /**
     * Obtiene desviaciones recientes para análisis de precisión
     */
    static async getDesviacionesRecientes(limite = 20, fechaFiltro = null) {
        if (fechaFiltro) {
        }

        let query = supabase
            .from('vista_desviaciones_recientes')
            .select('*')

        if (fechaFiltro) {
            query = query.eq('fecha_inicio', fechaFiltro)
        }

        const { data, error } = await query.limit(limite)

        if (error) {
            console.error('❌ [getDesviacionesRecientes] Error:', error)
            return []
        }
        return data.map(d => ({
            nombre: d.nombre_item,
            tipo: d.tipo_prediccion,
            periodo: d.periodo,
            fecha_inicio: d.fecha_inicio,
            fecha_fin: d.fecha_fin,
            estimado: d.valor_predicho,
            real: d.valor_real,
            desviacion: d.desviacion,
            porcentaje_desviacion: d.porcentaje_desviacion,
            nivel_confianza: d.nivel_confianza,
            calificacion: d.calificacion_precision,
            algoritmo: d.algoritmo
        }))
    }

    /**
     * Obtiene desviaciones para un tipo específico de predicción
     */
    static async getDesviacionesPorTipo(tipoPrediccion = 'demanda_insumos') {
        const { data, error } = await supabase
            .from('vista_desviaciones_recientes')
            .select('*')
            .eq('tipo_prediccion', tipoPrediccion)
            .limit(10)

        if (error) {
            console.error('Error fetching desviaciones por tipo:', error)
            return []
        }

        return data
    }

    /**
     * Obtiene métricas de precisión del modelo
     */
    static async getMetricasPrecision() {
        const { data, error } = await supabase
            .rpc('obtener_metricas_precision')

        if (error) {
            console.error('Error fetching métricas precisión:', error)
            return []
        }

        return data.map(m => ({
            tipo: m.tipo_prediccion,
            total: m.total_predicciones,
            evaluadas: m.predicciones_evaluadas,
            desviacion_promedio: m.desviacion_promedio,
            desviacion_abs_promedio: m.desviacion_abs_promedio,
            porcentaje_desviacion_promedio: m.porcentaje_desviacion_promedio,
            precision_porcentaje: m.precisión_porcentaje,
            nivel_confianza_promedio: m.nivel_confianza_promedio
        }))
    }

    // =====================================================
    // COMPARACIÓN ESTIMADO VS REAL
    // =====================================================

    /**
     * Obtiene datos para gráfico de barras comparativo (estimado vs real)
     */
    static async getComparacionEstimadoVsReal(tipoPrediccion = 'demanda_insumos', limite = 6, fechaFiltro = null) {
        if (fechaFiltro) {
        }

        let query = supabase
            .from('vista_desviaciones_recientes')
            .select('*')
            .eq('tipo_prediccion', tipoPrediccion)
            .not('valor_real', 'is', null)

        if (fechaFiltro) {
            query = query.eq('fecha_inicio', fechaFiltro)
        }

        const { data, error } = await query
            .order('fecha_fin', { ascending: false })
            .limit(limite)

        if (error) {
            console.error('❌ [getComparacionEstimadoVsReal] Error:', error)
            return {
                labels: [],
                estimado: [],
                real: []
            }
        }
        return {
            labels: data.map(d => d.nombre_item),
            estimado: data.map(d => d.valor_predicho != null ? Number(d.valor_predicho) : null),
            real: data.map(d => d.valor_real != null ? Number(d.valor_real) : null)
        }
    }

    // =====================================================
    // GENERAR PREDICCIONES MANUALMENTE
    // =====================================================

    /**
     * Ejecuta el proceso de generación de predicciones manualmente
     * Útil para botón en el dashboard
     */
    static async generarPredicciones() {
        const { data, error } = await supabase
            .rpc('generar_todas_predicciones')

        if (error) {
            console.error('❌ [generarPredicciones] Error:', error)
            return {
                success: false,
                error: error.message,
                data: null
            }
        }
        return {
            success: true,
            error: null,
            data: data
        }
    }

    /**
     * Actualiza solo las desviaciones (sin generar nuevas predicciones)
     */
    static async actualizarDesviaciones() {
        const { data, error } = await supabase
            .rpc('actualizar_todas_desviaciones')

        if (error) {
            console.error('Error actualizando desviaciones:', error)
            return {
                success: false,
                error: error.message
            }
        }

        return {
            success: true,
            data: data
        }
    }

    /**
     * Verifica el estado actual de las predicciones
     */
    static async verificarEstado() {
        const { data, error } = await supabase
            .rpc('verificar_estado_predicciones')

        if (error) {
            console.error('Error verificando estado:', error)
            return []
        }

        return data
    }

    // =====================================================
    // HELPERS
    // =====================================================

    /**
     * Formatea el periodo de predicción
     */
    static formatearPeriodo(fechaInicio, fechaFin) {
        const inicio = new Date(fechaInicio)
        const fin = new Date(fechaFin)

        const opcionesInicio = { day: 'numeric', month: 'short' }
        const opcionesFin = { day: 'numeric', month: 'short', year: 'numeric' }

        return `${inicio.toLocaleDateString('es-ES', opcionesInicio)} - ${fin.toLocaleDateString('es-ES', opcionesFin)}`
    }

    /**
     * Calcula el estado de la desviación (para colores en UI)
     */
    static getEstadoDesviacion(porcentaje) {
        const abs = Math.abs(porcentaje)
        if (abs <= 10) return { color: 'green', label: '🟢', texto: 'Excelente' }
        if (abs <= 20) return { color: 'yellow', label: '🟡', texto: 'Bueno' }
        if (abs <= 30) return { color: 'orange', label: '🟠', texto: 'Aceptable' }
        return { color: 'red', label: '🔴', texto: 'Necesita Ajuste' }
    }

    /**
     * Formatea valores monetarios
     */
    static formatearMoneda(valor) {
        return new Intl.NumberFormat('es-CR', {
            style: 'currency',
            currency: 'CRC'
        }).format(valor)
    }

    /**
     * Formatea cantidades con unidades
     */
    static formatearCantidad(valor, unidad = 'kg') {
        return `${valor.toFixed(2)}${unidad}`
    }
}
