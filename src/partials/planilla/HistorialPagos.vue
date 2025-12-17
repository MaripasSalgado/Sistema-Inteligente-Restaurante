<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-lg font-semibold text-gray-100">Historial de Pagos</h3>
        <p class="text-sm text-gray-400">Consulta el historial completo de pagos por empleado</p>
      </div>
      
      <div class="flex space-x-3">
        <button 
          @click="exportarHistorial"
          :disabled="historialFiltrado.length === 0"
          class="px-4 py-2 bg-[#F4B400] text-black rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F4B400]/80"
        >
          Exportar Historial
        </button>
        <button
          @click="descargarResumen"
          :disabled="historialFiltrado.length === 0"
          class="px-4 py-2 bg-zinc-900/50 border border-zinc-700/50 text-sm font-medium rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-900/70"
        >
          Descargar Resumen
        </button>
      </div>
    </div>

    <!-- Filtros -->
    <div class="rounded-lg border border-zinc-700/50 p-6" style="background-color: rgb(24 24 27 / 0.8);">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Empleado</label>
          <select 
            v-model="filtroEmpleado"
            class="w-full px-3 py-2 bg-zinc-900/95 border border-zinc-700/50 rounded-lg text-gray-100 focus:border-[#F4B400] focus:ring-1 focus:ring-[#F4B400]"
          >
            <option value="">Todos los empleados</option>
            <option 
              v-for="empleado in empleados" 
              :key="empleado.id" 
              :value="empleado.id"
            >
              {{ empleado.nombre }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Año</label>
          <select 
            v-model="filtroAño"
            class="w-full px-3 py-2 bg-zinc-900/95 border border-zinc-700/50 rounded-lg text-gray-100 focus:border-[#F4B400] focus:ring-1 focus:ring-[#F4B400]"
          >
            <option value="">Todos los años</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Tipo de Pago</label>
          <select 
            v-model="filtroTipo"
            class="w-full px-3 py-2 bg-zinc-900/95 border border-zinc-700/50 rounded-lg text-gray-100 focus:border-[#F4B400] focus:ring-1 focus:ring-[#F4B400]"
          >
            <option value="">Todos los tipos</option>
            <option value="regular">Pago Regular</option>
            <option value="aguinaldo">Aguinaldo</option>
            <option value="liquidacion">Liquidación</option>
          </select>
        </div>
        
        <div class="flex items-end">
          <button
            @click="aplicarFiltros"
            class="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700/50 text-sm font-medium rounded-lg text-white transition-colors hover:bg-zinc-900/70"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>

    <!-- Métricas del Historial -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="rounded-lg border border-zinc-700/50 p-4" style="background-color: rgb(24 24 27 / 0.8);">
        <div class="text-sm text-gray-400 mb-1">Total Pagos</div>
        <div class="text-xl font-bold text-white">{{ metricas.totalPagos }}</div>
      </div>

      <div class="rounded-lg border border-zinc-700/50 p-4" style="background-color: rgb(24 24 27 / 0.8);">
        <div class="text-sm text-gray-400 mb-1">Monto Total</div>
        <div class="text-xl font-bold text-white">₡{{ formatCurrency(metricas.montoTotal) }}</div>
      </div>

      <div class="rounded-lg border border-zinc-700/50 p-4" style="background-color: rgb(24 24 27 / 0.8);">
        <div class="text-sm text-gray-400 mb-1">Promedio por Pago</div>
        <div class="text-xl font-bold text-white">₡{{ formatCurrency(metricas.promedioPago) }}</div>
      </div>

      <div class="rounded-lg border border-zinc-700/50 p-4" style="background-color: rgb(24 24 27 / 0.8);">
        <div class="text-sm text-gray-400 mb-1">Último Pago</div>
        <div class="text-xl font-bold text-yellow-400">{{ metricas.ultimoPago }}</div>
      </div>
    </div>

    <!-- Tabla de Historial -->
    <div class="rounded-lg border border-zinc-700/50 overflow-hidden" style="background-color: rgb(24 24 27 / 0.8);">
      <div class="p-6 border-b border-zinc-700/50">
        <h4 class="text-md font-semibold text-gray-100">Historial de Pagos</h4>
        <p class="text-sm text-gray-400">{{ historialFiltrado.length }} registros encontrados</p>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-gray-400 uppercase bg-zinc-900">
            <tr>
              <th class="px-4 py-3">Empleado</th>
              <th class="px-4 py-3">Período</th>
              <th class="px-4 py-3">Tipo</th>
              <th class="px-4 py-3">Fecha Pago</th>
              <th class="px-4 py-3">Monto</th>
              <th class="px-4 py-3">Estado</th>
              <th class="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="pago in historialFiltrado"
              :key="pago.id"
              class="border-b border-zinc-700/50 hover:bg-zinc-800/50"
            >
              <td class="px-4 py-3">
                <div>
                  <div class="font-medium text-gray-200">{{ getEmpleadoNombre(pago.empleadoId) }}</div>
                  <div class="text-xs text-gray-400">{{ getEmpleadoInfo(pago.empleadoId) }}</div>
                </div>
              </td>
              
              <td class="px-4 py-3 text-gray-300">
                {{ formatearPeriodo(pago.periodo) }}
              </td>
              
              <td class="px-4 py-3">
                <span 
                  class="px-2 py-1 text-xs rounded-full"
                  :class="getTipoClass(pago.tipo)"
                >
                  {{ getTipoNombre(pago.tipo) }}
                </span>
              </td>
              
              <td class="px-4 py-3 text-gray-300">
                {{ formatearFecha(pago.fechaPago) }}
              </td>
              
              <td class="px-4 py-3">
                <div class="text-lg font-bold text-white">
                  ₡{{ formatCurrency(pago.salarioNeto) }}
                </div>
              </td>
              
              <td class="px-4 py-3">
                <span 
                  class="px-2 py-1 text-xs rounded-full"
                  :class="getEstadoClass(pago.estado)"
                >
                  {{ getEstadoNombre(pago.estado) }}
                </span>
              </td>
              
              <td class="px-4 py-3">
                <div class="flex space-x-2">
                  <button
                    @click="verDetallePago(pago)"
                    class="px-3 py-1 text-xs font-medium bg-zinc-900/50 border border-zinc-700/50 text-white rounded hover:bg-zinc-900/70 transition-colors"
                  >
                    Ver
                  </button>
                  <button
                    @click="descargarRecibo(pago)"
                    class="px-3 py-1 text-xs font-medium bg-zinc-900/50 border border-zinc-700/50 text-white rounded hover:bg-zinc-900/70 transition-colors"
                  >
                    Recibo
                  </button>
                  <button
                    @click="verHistorialEmpleado(pago.empleadoId)"
                    class="px-3 py-1 text-xs font-medium bg-zinc-900/50 border border-zinc-700/50 text-white rounded hover:bg-zinc-900/70 transition-colors"
                  >
                    Historial
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Paginación -->
    <div v-if="historialFiltrado.length > 0" class="flex justify-between items-center">
      <div class="text-sm text-gray-400">
        Mostrando {{ (paginaActual - 1) * elementosPorPagina + 1 }} - {{ Math.min(paginaActual * elementosPorPagina, historialFiltrado.length) }} de {{ historialFiltrado.length }} registros
      </div>
      
      <div class="flex space-x-2">
        <button
          @click="paginaAnterior"
          :disabled="paginaActual === 1"
          class="px-3 py-1 text-sm font-medium bg-zinc-900/50 border border-zinc-700/50 text-white rounded hover:bg-zinc-900/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        <span class="px-3 py-1 text-sm text-gray-300">
          Página {{ paginaActual }} de {{ totalPaginas }}
        </span>
        <button
          @click="paginaSiguiente"
          :disabled="paginaActual === totalPaginas"
          class="px-3 py-1 text-sm font-medium bg-zinc-900/50 border border-zinc-700/50 text-white rounded hover:bg-zinc-900/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>
    </div>

    <!-- Mensaje cuando no hay datos -->
    <div v-if="historialFiltrado.length === 0" class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-300 mb-2">No hay registros disponibles</h3>
        <p class="text-gray-500">Ajusta los filtros para ver el historial de pagos</p>
      </div>
    </div>

    <!-- Mensaje de estado -->
    <div v-if="mensaje" class="p-4 rounded-lg" :class="mensajeClass">
      <div class="flex items-center">
        <svg v-if="mensajeTipo === 'success'" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg v-else-if="mensajeTipo === 'error'" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <span>{{ mensaje }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { PlanillaService } from '../../services/planillaService'

export default {
  name: 'HistorialPagos',
  props: {
    empleados: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const historial = ref([])
    const filtroEmpleado = ref('')
    const filtroAño = ref('')
    const filtroTipo = ref('')
    const paginaActual = ref(1)
    const elementosPorPagina = ref(10)
    const mensaje = ref('')
    const mensajeTipo = ref('')
    const cargando = ref(false)

    const mapPago = (pago) => ({
      id: pago.id,
      empleadoId: pago.usuario_id,
      periodo: pago.periodo,
      tipo: pago.tipo_pago,
      fechaPago: pago.fecha_pago,
      salarioNeto: pago.monto_pagado,
      estado: pago.estado,
      metodoPago: pago.metodo_pago
    })

    const cargarHistorial = async () => {
      cargando.value = true
      const resp = await PlanillaService.getHistorialPagos()
      if (resp.success) {
        historial.value = resp.data.map(mapPago)
      }
      cargando.value = false
    }

    onMounted(cargarHistorial)

    // Computed properties
    const historialFiltrado = computed(() => {
      let filtrado = historial.value
      
      if (filtroEmpleado.value) {
        filtrado = filtrado.filter(p => String(p.empleadoId) === filtroEmpleado.value)
      }
      
      if (filtroAño.value) {
        filtrado = filtrado.filter(p => p.periodo.includes(filtroAño.value))
      }
      
      if (filtroTipo.value) {
        filtrado = filtrado.filter(p => p.tipo === filtroTipo.value)
      }
      
      return filtrado.sort((a, b) => new Date(b.fechaPago) - new Date(a.fechaPago))
    })

    const historialPaginado = computed(() => {
      const inicio = (paginaActual.value - 1) * elementosPorPagina.value
      const fin = inicio + elementosPorPagina.value
      return historialFiltrado.value.slice(inicio, fin)
    })

    const totalPaginas = computed(() => {
      return Math.ceil(historialFiltrado.value.length / elementosPorPagina.value)
    })

    const metricas = computed(() => {
      const pagos = historialFiltrado.value
      const totalPagos = pagos.length
      const montoTotal = pagos.reduce((sum, p) => sum + p.salarioNeto, 0)
      const promedioPago = totalPagos > 0 ? montoTotal / totalPagos : 0
      const ultimoPago = pagos.length > 0 ? formatearFecha(pagos[0].fechaPago) : 'N/A'

      return {
        totalPagos,
        montoTotal,
        promedioPago,
        ultimoPago
      }
    })

    const mensajeClass = computed(() => {
      switch (mensajeTipo.value) {
        case 'success':
          return 'bg-green-900/20 border border-green-500 text-green-300'
        case 'error':
          return 'bg-red-900/20 border border-red-500 text-red-300'
        default:
          return 'bg-blue-900/20 border border-blue-500 text-blue-300'
      }
    })

    // Methods
    const getEmpleadoNombre = (empleadoId) => {
      const empleado = props.empleados.find(emp => emp.id === empleadoId)
      return empleado ? empleado.nombre : 'Empleado no encontrado'
    }

    const getEmpleadoInfo = (empleadoId) => {
      const empleado = props.empleados.find(emp => emp.id === empleadoId)
      return empleado ? `${empleado.puesto} - ${empleado.cedula}` : 'N/A'
    }

    const formatearPeriodo = (periodo) => {
      if (periodo.includes('aguinaldo')) {
        return 'Aguinaldo 2024'
      }
      const [año, mes] = periodo.split('-')
      const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ]
      return `${meses[parseInt(mes) - 1]} ${año}`
    }

    const formatearFecha = (fecha) => {
      return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('es-CR').format(amount)
    }

    const getTipoClass = (tipo) => {
      switch (tipo) {
        case 'regular':
          return 'bg-gray-900/30 text-white border border-gray-500'
        case 'aguinaldo':
          return 'bg-green-900/30 text-green-400 border border-green-500'
        case 'liquidacion':
          return 'bg-gray-900/30 text-white border border-gray-500'
        default:
          return 'bg-gray-900/30 text-gray-400 border border-gray-500'
      }
    }

    const getTipoNombre = (tipo) => {
      switch (tipo) {
        case 'regular':
          return 'Regular'
        case 'aguinaldo':
          return 'Aguinaldo'
        case 'liquidacion':
          return 'Liquidación'
        default:
          return 'Desconocido'
      }
    }

    const getEstadoClass = (estado) => {
      switch (estado) {
        case 'pagado':
          return 'bg-green-900/30 text-green-400 border border-green-500'
        case 'pendiente':
          return 'bg-yellow-900/30 text-yellow-400 border border-yellow-500'
        case 'cancelado':
          return 'bg-red-900/30 text-red-400 border border-red-500'
        default:
          return 'bg-gray-900/30 text-gray-400 border border-gray-500'
      }
    }

    const getEstadoNombre = (estado) => {
      switch (estado) {
        case 'pagado':
          return 'Pagado'
        case 'pendiente':
          return 'Pendiente'
        case 'cancelado':
          return 'Cancelado'
        default:
          return 'Desconocido'
      }
    }

    const aplicarFiltros = () => {
      paginaActual.value = 1
      mostrarMensaje('Filtros aplicados', 'success')
    }

    const paginaAnterior = () => {
      if (paginaActual.value > 1) {
        paginaActual.value--
      }
    }

    const paginaSiguiente = () => {
      if (paginaActual.value < totalPaginas.value) {
        paginaActual.value++
      }
    }

    const verDetallePago = (pago) => {
      console.log('Ver detalle de pago:', pago)
      mostrarMensaje(`Mostrando detalles del pago de ${getEmpleadoNombre(pago.empleadoId)}`, 'success')
    }

    const descargarRecibo = (pago) => {
      mostrarMensaje(`Descargando recibo de ${getEmpleadoNombre(pago.empleadoId)}`, 'success')
    }

    const verHistorialEmpleado = (empleadoId) => {
      const empleado = props.empleados.find(emp => emp.id === empleadoId)
      mostrarMensaje(`Mostrando historial completo de ${empleado ? empleado.nombre : 'empleado'}`, 'success')
    }

    const exportarHistorial = () => {
      if (historialFiltrado.value.length === 0) {
        mostrarMensaje('No hay datos para exportar', 'error')
        return
      }

      mostrarMensaje(`Exportando historial con ${historialFiltrado.value.length} registros`, 'success')
    }

    const descargarResumen = () => {
      if (historialFiltrado.value.length === 0) {
        mostrarMensaje('No hay datos para generar resumen', 'error')
        return
      }

      mostrarMensaje('Descargando resumen del historial de pagos', 'success')
    }

    const mostrarMensaje = (texto, tipo = 'info') => {
      mensaje.value = texto
      mensajeTipo.value = tipo
      
      setTimeout(() => {
        mensaje.value = ''
        mensajeTipo.value = ''
      }, 5000)
    }

    return {
      historial,
      empleados: props.empleados,
      filtroEmpleado,
      filtroAño,
      filtroTipo,
      paginaActual,
      elementosPorPagina,
      historialFiltrado,
      historialPaginado,
      totalPaginas,
      metricas,
      mensaje,
      mensajeClass,
      getEmpleadoNombre,
      getEmpleadoInfo,
      formatearPeriodo,
      formatearFecha,
      formatCurrency,
      getTipoClass,
      getTipoNombre,
      getEstadoClass,
      getEstadoNombre,
      aplicarFiltros,
      paginaAnterior,
      paginaSiguiente,
      verDetallePago,
      descargarRecibo,
      verHistorialEmpleado,
      exportarHistorial,
      descargarResumen
    }
  }
}
</script> 
