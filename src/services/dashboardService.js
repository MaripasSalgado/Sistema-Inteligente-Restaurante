import { supabase } from '@/config/supabase'
import { getMonthStartCR, getMonthEndCR } from '@/utils/timezoneHelper'

export class DashboardService {

    // --- VENTAS ---

    /**
     * Obtiene el total de ventas del mes especificado
     */
    static async getVentasMes(month, year) {
        const startUTC = getMonthStartCR(month, year)
        const endUTC = getMonthEndCR(month, year)

        const { data, error } = await supabase
            .from('ventas')
            .select('total')
            .gte('fecha_venta', startUTC)
            .lte('fecha_venta', endUTC)
            .eq('estado', 'Completada')

        if (error) {
            console.error('Error fetching ventas mes:', error)
            return 0
        }
        return data.reduce((sum, venta) => sum + (venta.total || 0), 0)
    }

    /**
     * Obtiene el total de ventas del día actual (Legacy, kept for reference if needed)
     */
    static async getVentasHoy() {
        const today = new Date().toISOString().split('T')[0]
        const { data, error } = await supabase
            .from('ventas')
            .select('total')
            .gte('fecha_venta', `${today}T00:00:00`)
            .lte('fecha_venta', `${today}T23:59:59`)
            .eq('estado', 'Completada')

        if (error) {
            console.error('Error fetching ventas hoy:', error)
            return 0
        }
        return data.reduce((sum, venta) => sum + (venta.total || 0), 0)
    }

    /**
     * Obtiene el historial de ventas de los últimos 30 días
     */
    static async getHistorialVentas(dias = 30) {
        const date = new Date()
        date.setDate(date.getDate() - dias)
        const startDate = date.toISOString()

        const { data, error } = await supabase
            .from('ventas')
            .select('fecha_venta, total')
            .gte('fecha_venta', startDate)
            .eq('estado', 'Completada')
            .order('fecha_venta', { ascending: true })

        if (error) {
            console.error('Error fetching historial ventas:', error)
            return []
        }

        // Agrupar por día
        const ventasPorDia = {}
        data.forEach(venta => {
            const dia = venta.fecha_venta.split('T')[0]
            ventasPorDia[dia] = (ventasPorDia[dia] || 0) + venta.total
        })

        return Object.entries(ventasPorDia).map(([fecha, total]) => ({ fecha, total }))
    }

    // --- INVENTARIO ---

    /**
     * Obtiene insumos con stock bajo (menor al mínimo)
     */
    static async getInsumosBajoStock() {
        const { data, error } = await supabase
            .from('insumos')
            .select('nombre, stock_minimo, lotes_insumos(cantidad_actual)')

        if (error) {
            console.error('Error fetching insumos:', error)
            return []
        }

        // Calcular stock total actual sumando lotes
        const insumosProcesados = data.map(insumo => {
            const stockTotal = insumo.lotes_insumos.reduce((sum, lote) => sum + Number(lote.cantidad_actual), 0)
            return {
                nombre: insumo.nombre,
                stock_minimo: insumo.stock_minimo,
                stock_actual: stockTotal
            }
        }).filter(insumo => insumo.stock_actual <= insumo.stock_minimo)

        return insumosProcesados
    }

    // --- PERSONAL ---

    /**
     * Obtiene el número de empleados con turno activo en este momento
     */
    static async getPersonalConTurnoHoy() {
        const now = new Date()
        const currentTime = now.toTimeString().split(' ')[0]
        const today = now.toISOString().split('T')[0]

        console.log('🔍 [getPersonalConTurnoHoy] Consultando turnos activos...')
        console.log('📅 Fecha hoy:', today)
        console.log('⏰ Hora actual:', currentTime)

        // Buscar turnos que coincidan con la fecha de hoy y la hora actual
        const { data, count, error } = await supabase
            .from('turnos')
            .select('*', { count: 'exact' })
            .eq('fecha', today)
            .lte('hora_inicio', currentTime)
            .gte('hora_fin', currentTime)
            .neq('estado', 'cancelado')

        console.log('✅ [getPersonalConTurnoHoy] Turnos encontrados:', count || 0)
        console.log('📦 [getPersonalConTurnoHoy] Datos:', data)

        if (error) {
            console.error('❌ [getPersonalConTurnoHoy] Error:', error)
            return 0
        }
        return count || 0
    }

    /**
     * Obtiene el número de empleados activos hoy (Legacy)
     */
    static async getPersonalActivo() {
        const today = new Date().toISOString().split('T')[0]
        const { count, error } = await supabase
            .from('asistencia')
            .select('*', { count: 'exact', head: true })
            .eq('fecha', today)
            .is('salida_real', null) // Aún no han salido
            .not('entrada_real', 'is', null) // Ya entraron

        if (error) {
            console.error('Error fetching personal activo:', error)
            return 0
        }
        return count || 0
    }

    /**
     * Obtiene el total de empleados para calcular porcentaje
     */
    static async getTotalPersonal() {
        console.log('🔍 [getTotalPersonal] Consultando total de empleados...')

        const { count, error } = await supabase
            .from('usuarios')
            .select('*', { count: 'exact', head: true })
            .eq('estado', 'Activo')

        console.log('✅ [getTotalPersonal] Total empleados activos:', count || 0)

        if (error) {
            console.error('❌ [getTotalPersonal] Error:', error)
            return 0
        }
        return count || 0
    }

    // --- ALERTAS ---

    /**
     * Obtiene el número de alertas activas (consumo + vencimiento)
     */
    static async getAlertasActivas() {
        // Alertas de consumo pendientes
        const { count: countConsumo, error: errorConsumo } = await supabase
            .from('alertas_consumo')
            .select('*', { count: 'exact', head: true })
            .eq('estado', 'pendiente')

        // Alertas de vencimiento (no enviadas o recientes)
        const { count: countVencimiento, error: errorVencimiento } = await supabase
            .from('alertas_vencimiento')
            .select('*', { count: 'exact', head: true })
            .eq('notificacion_enviada', false)

        if (errorConsumo || errorVencimiento) {
            console.error('Error fetching alertas:', errorConsumo, errorVencimiento)
            return 0
        }
        return (countConsumo || 0) + (countVencimiento || 0)
    }



    // --- GRÁFICOS ---

    /**
     * Obtiene ventas por día para el mes seleccionado
     */
    static async getVentasPorDiaMes(month, year) {
        const startUTC = getMonthStartCR(month, year)
        const endUTC = getMonthEndCR(month, year)

        const { data, error } = await supabase
            .from('ventas')
            .select('fecha_venta, total')
            .gte('fecha_venta', startUTC)
            .lte('fecha_venta', endUTC)
            .eq('estado', 'Completada')
            .order('fecha_venta', { ascending: true })

        if (error) {
            console.error('Error fetching ventas por día mes:', error)
            return []
        }

        // Inicializar array con todos los días del mes
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        const ventasPorDia = Array(daysInMonth).fill(0)

        data.forEach(venta => {
            const dia = new Date(venta.fecha_venta).getDate()
            ventasPorDia[dia - 1] += venta.total
        })

        return ventasPorDia
    }

    /**
     * Obtiene ventas por hora para el día actual (Legacy)
     */
    static async getVentasPorHora() {
        const today = new Date().toISOString().split('T')[0]
        const { data, error } = await supabase
            .from('ventas')
            .select('fecha_venta, total')
            .gte('fecha_venta', `${today}T00:00:00`)
            .lte('fecha_venta', `${today}T23:59:59`)
            .eq('estado', 'Completada')

        if (error) {
            console.error('Error fetching ventas por hora:', error)
            return []
        }

        // Inicializar array de 24 horas
        const ventasPorHora = Array(24).fill(0)

        data.forEach(venta => {
            const hora = new Date(venta.fecha_venta).getHours()
            ventasPorHora[hora] += venta.total
        })

        return ventasPorHora
    }

    /**
     * Obtiene los productos más vendidos del mes seleccionado
     */
    static async getProductosMasVendidosMes(month, year) {
        const startUTC = getMonthStartCR(month, year)
        const endUTC = getMonthEndCR(month, year)

        const { data, error } = await supabase
            .from('detalles_venta')
            .select('cantidad, productos(nombre), ventas!inner(fecha_venta, estado)')
            .gte('ventas.fecha_venta', startUTC)
            .lte('ventas.fecha_venta', endUTC)
            .eq('ventas.estado', 'Completada')
            .order('cantidad', { ascending: false })

        if (error) {
            console.error('Error fetching productos top mes:', error)
            return { labels: [], data: [] }
        }

        // Agrupar por nombre de producto
        const conteo = {}
        data.forEach(detalle => {
            const nombre = detalle.productos?.nombre || 'Desconocido'
            conteo[nombre] = (conteo[nombre] || 0) + detalle.cantidad
        })

        // Convertir a array y ordenar
        const sorted = Object.entries(conteo)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 8) // Top 8

        return {
            labels: sorted.map(([k]) => k),
            data: sorted.map(([, v]) => v)
        }
    }

    /**
     * Obtiene los productos más vendidos (Legacy)
     */
    static async getProductosMasVendidos() {
        const { data, error } = await supabase
            .from('detalles_venta')
            .select('cantidad, productos(nombre)')
            .order('cantidad', { ascending: false })
            .limit(100) // Traemos los últimos 100 detalles para hacer estadística rápida

        if (error) {
            console.error('Error fetching productos top:', error)
            return { labels: [], data: [] }
        }

        // Agrupar por nombre de producto
        const conteo = {}
        data.forEach(detalle => {
            const nombre = detalle.productos?.nombre || 'Desconocido'
            conteo[nombre] = (conteo[nombre] || 0) + detalle.cantidad
        })

        // Convertir a array y ordenar
        const sorted = Object.entries(conteo)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 8) // Top 8

        return {
            labels: sorted.map(([k]) => k),
            data: sorted.map(([, v]) => v)
        }
    }

    // --- PREDICCIONES ---

    /**
     * Obtiene predicciones de ventas para los próximos días
     */
    static async getPrediccionesVentas() {
        const today = new Date().toISOString().split('T')[0]
        const { data, error } = await supabase
            .from('predicciones')
            .select('*')
            .eq('tipo_prediccion', 'ventas_productos')
            .gte('fecha_inicio', today)
            .order('fecha_inicio', { ascending: true })

        if (error) {
            console.error('Error fetching predicciones:', error)
            return []
        }
        return data
    }

    // --- PEDIDOS/VENTAS ---

    /**
     * Obtiene el estado de las órdenes del mes seleccionado
     */
    static async getEstadoPedidosMes(month, year) {
        const startUTC = getMonthStartCR(month, year)
        const endUTC = getMonthEndCR(month, year)

        const { data, error } = await supabase
            .from('ventas')
            .select('estado')
            .gte('fecha_venta', startUTC)
            .lte('fecha_venta', endUTC)

        if (error) {
            console.error('Error fetching estado pedidos mes:', error)
            return { pendiente: 0, enProceso: 0, completada: 0, cancelada: 0 }
        }

        const estado = {
            pendiente: data.filter(v => v.estado === 'Pendiente').length,
            enProceso: data.filter(v => v.estado === 'En Proceso').length,
            completada: data.filter(v => v.estado === 'Completada').length,
            cancelada: data.filter(v => v.estado === 'Cancelada').length
        }

        return estado
    }

    /**
     * Obtiene el estado de las órdenes del día (Legacy)
     */
    static async getEstadoPedidos() {
        const today = new Date().toISOString().split('T')[0]
        const { data, error } = await supabase
            .from('ventas')
            .select('estado')
            .gte('fecha_venta', `${today}T00:00:00`)
            .lte('fecha_venta', `${today}T23:59:59`)

        if (error) {
            console.error('Error fetching estado pedidos:', error)
            return { pendiente: 0, enProceso: 0, completada: 0, cancelada: 0 }
        }

        const estado = {
            pendiente: data.filter(v => v.estado === 'Pendiente').length,
            enProceso: data.filter(v => v.estado === 'En Proceso').length,
            completada: data.filter(v => v.estado === 'Completada').length,
            cancelada: data.filter(v => v.estado === 'Cancelada').length
        }

        return estado
    }

    /**
     * Obtiene ventas de los últimos 7 días
     */
    static async getVentasUltimos7Dias() {
        const date = new Date()
        date.setDate(date.getDate() - 7)
        const startDate = date.toISOString().split('T')[0]

        const { data, error } = await supabase
            .from('ventas')
            .select('fecha_venta, total')
            .gte('fecha_venta', `${startDate}T00:00:00`)
            .eq('estado', 'Completada')
            .order('fecha_venta', { ascending: true })

        if (error) {
            console.error('Error fetching ventas 7 días:', error)
            return []
        }

        // Agrupar por día
        const ventasPorDia = {}
        for (let i = 6; i >= 0; i--) {
            const d = new Date()
            d.setDate(d.getDate() - i)
            const dia = d.toISOString().split('T')[0]
            ventasPorDia[dia] = 0
        }

        data.forEach(venta => {
            const dia = venta.fecha_venta.split('T')[0]
            if (ventasPorDia.hasOwnProperty(dia)) {
                ventasPorDia[dia] += parseFloat(venta.total)
            }
        })

        const labels = Object.keys(ventasPorDia).map(fecha => {
            const d = new Date(fecha)
            return d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })
        })

        return {
            labels,
            data: Object.values(ventasPorDia)
        }
    }

    /**
     * Obtiene ventas por semana del mes
     * @param {number} month - Mes (0-11)
     * @param {number} year - Año
     * @param {number} weekNumber - Número de semana (1-4)
     * @returns {Promise<{labels: string[], data: number[]}>}
     */
    static async getVentasPorSemanaMes(month, year, weekNumber) {
        // Calcular el rango de días para la semana de forma dinámica
        const startDay = (weekNumber - 1) * 7 + 1
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        const endDay = Math.min(startDay + 6, daysInMonth)

        // Crear fechas de inicio y fin en CR timezone
        const startDate = new Date(Date.UTC(year, month, startDay, 6, 0, 0)) // 00:00 CR = 06:00 UTC
        const endDate = new Date(Date.UTC(year, month, endDay + 1, 5, 59, 59)) // 23:59 CR = 05:59 UTC next day

        const { data, error } = await supabase
            .from('ventas')
            .select('fecha_venta, total')
            .gte('fecha_venta', startDate.toISOString())
            .lte('fecha_venta', endDate.toISOString())
            .eq('estado', 'Completada')
            .order('fecha_venta', { ascending: true })

        if (error) {
            console.error('Error fetching ventas por semana:', error)
            return { labels: [], data: [] }
        }

        // Inicializar array con los días de la semana
        const daysInWeek = endDay - startDay + 1
        const ventasPorDia = Array(daysInWeek).fill(0)
        const labels = []

        for (let i = 0; i < daysInWeek; i++) {
            const day = startDay + i
            labels.push(`${day}`)
        }

        // Agrupar ventas por día usando CR timezone
        data.forEach(venta => {
            const date = new Date(venta.fecha_venta)
            // Convert to CR time
            const crDate = new Date(date.getTime() - (6 * 60 * 60 * 1000))
            const day = crDate.getUTCDate()
            const index = day - startDay
            if (index >= 0 && index < daysInWeek) {
                ventasPorDia[index] += venta.total
            }
        })

        return {
            labels,
            data: ventasPorDia
        }
    }

    // --- INVENTARIO AVANZADO ---

    /**
     * Obtiene insumos próximos a vencer (próximos 7 días)
     */
    static async getInsumosProximosVencer() {
        const today = new Date()
        const nextWeek = new Date()
        nextWeek.setDate(nextWeek.getDate() + 7)

        const { data, error } = await supabase
            .from('lotes_insumos')
            .select('*, insumos(nombre)')
            .gte('fecha_vencimiento', today.toISOString().split('T')[0])
            .lte('fecha_vencimiento', nextWeek.toISOString().split('T')[0])
            .eq('estado', 'Activo')
            .order('fecha_vencimiento', { ascending: true })
            .limit(10)

        if (error) {
            console.error('Error fetching insumos próximos a vencer:', error)
            return []
        }

        return data.map(lote => ({
            nombre: lote.insumos?.nombre || 'Sin nombre',
            lote: lote.lote,
            cantidad: lote.cantidad_actual,
            fechaVencimiento: lote.fecha_vencimiento,
            diasRestantes: Math.ceil((new Date(lote.fecha_vencimiento) - today) / (1000 * 60 * 60 * 24))
        }))
    }

    /**
     * Obtiene estadísticas del estado general del inventario
     */
    static async getEstadoInventario() {
        const { data, error } = await supabase
            .from('insumos')
            .select('stock_minimo, stock_maximo, lotes_insumos(cantidad_actual, estado)')

        if (error) {
            console.error('Error fetching estado inventario:', error)
            return { optimo: 0, bajo: 0, critico: 0, agotado: 0 }
        }

        let optimo = 0, bajo = 0, critico = 0, agotado = 0

        data.forEach(insumo => {
            const stockTotal = insumo.lotes_insumos
                .filter(lote => lote.estado === 'Activo')
                .reduce((sum, lote) => sum + Number(lote.cantidad_actual), 0)

            const stockMin = Number(insumo.stock_minimo)

            if (stockTotal === 0) {
                agotado++
            } else if (stockTotal < stockMin * 0.5) {
                critico++
            } else if (stockTotal < stockMin) {
                bajo++
            } else {
                optimo++
            }
        })

        return { optimo, bajo, critico, agotado }
    }

    // --- MÉTRICAS COMPARATIVAS ---

    /**
     * Obtiene comparación de ventas del mes actual vs mes anterior
     */
    static async getComparacionVentasMes(month, year) {
        // Mes actual (seleccionado)
        const ventasMesActual = await this.getVentasMes(month, year)

        // Mes anterior
        let prevMonth = month - 1
        let prevYear = year
        if (prevMonth < 0) {
            prevMonth = 11
            prevYear = year - 1
        }
        const ventasMesAnterior = await this.getVentasMes(prevMonth, prevYear)

        const cambio = ventasMesAnterior > 0 ? ((ventasMesActual - ventasMesAnterior) / ventasMesAnterior * 100).toFixed(1) : 0

        return {
            hoy: ventasMesActual, // Mantenemos la estructura 'hoy' para compatibilidad, pero representa el mes actual
            ayer: ventasMesAnterior, // Representa mes anterior
            cambio: parseFloat(cambio),
            tendencia: cambio > 0 ? 'alza' : cambio < 0 ? 'baja' : 'estable'
        }
    }

    /**
     * Obtiene comparación de ventas vs día anterior (Legacy)
     */
    static async getComparacionVentas() {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = yesterday.toISOString().split('T')[0]

        const [ventasHoy, ventasAyer] = await Promise.all([
            this.getVentasHoy(),
            this.getVentasDia(yesterdayStr)
        ])

        const cambio = ventasAyer > 0 ? ((ventasHoy - ventasAyer) / ventasAyer * 100).toFixed(1) : 0

        return {
            hoy: ventasHoy,
            ayer: ventasAyer,
            cambio: parseFloat(cambio),
            tendencia: cambio > 0 ? 'alza' : cambio < 0 ? 'baja' : 'estable'
        }
    }

    /**
     * Obtiene ventas de un día específico
     */
    static async getVentasDia(fecha) {
        const { data, error } = await supabase
            .from('ventas')
            .select('total')
            .gte('fecha_venta', `${fecha}T00:00:00`)
            .lte('fecha_venta', `${fecha}T23:59:59`)
            .eq('estado', 'Completada')

        if (error) {
            console.error('Error fetching ventas del día:', error)
            return 0
        }
        return data.reduce((sum, venta) => sum + (venta.total || 0), 0)
    }

    /**
     * Obtiene todos los datos del dashboard en una sola llamada
     */
    static async getDashboardData(month = new Date().getMonth(), year = new Date().getFullYear()) {
        try {
            const [
                comparacionVentas,
                estadoInventario,
                estadoPedidos,
                insumosVencer,
                ventasPorHora,
                productosTop,
                ventas7Dias
            ] = await Promise.all([
                this.getComparacionVentasMes(month, year),
                this.getEstadoInventario(),
                this.getEstadoPedidosMes(month, year),
                this.getInsumosProximosVencer(),
                this.getVentasPorDiaMes(month, year),
                this.getProductosMasVendidosMes(month, year),
                this.getVentasUltimos7Dias()
            ])

            return {
                comparacionVentas,
                estadoInventario,
                estadoPedidos,
                insumosVencer,
                ventasPorHora,
                productosTop,
                ventas7Dias
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
            throw error
        }
    }
}
