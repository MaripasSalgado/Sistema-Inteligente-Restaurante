<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-lg font-semibold text-gray-100">Generador de Recibos</h3>
        <p class="text-sm text-gray-400">Genera y marca recibos básicos para la planilla</p>
      </div>
      
      <div class="flex space-x-3">
        <button 
          @click="generarTodosRecibos"
          :disabled="planillasCalculadas.length === 0"
          class="px-4 py-2 bg-[#F4B400] text-black rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F4B400]/80"
        >
          Generar Todos
        </button>
        <button
          @click="descargarPlanillaGeneral"
          :disabled="planillasCalculadas.length === 0"
          class="px-4 py-2 bg-zinc-900/50 border border-zinc-700/50 text-sm font-medium rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-900/70"
        >
          Planilla General
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
          <label class="block text-sm font-medium text-gray-300 mb-2">Período</label>
          <input 
            v-model="filtroPeriodo"
            type="month"
            class="w-full px-3 py-2 bg-zinc-900/95 border border-zinc-700/50 rounded-lg text-gray-100 focus:border-[#F4B400] focus:ring-1 focus:ring-[#F4B400]"
            style="color-scheme: dark;"
          />
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

    <!-- Lista de Recibos -->
    <div class="rounded-lg border border-zinc-700/50 overflow-hidden" style="background-color: rgb(24 24 27 / 0.8);">
      <div class="p-6 border-b border-zinc-700/50">
        <h4 class="text-md font-semibold text-gray-100">Recibos Disponibles</h4>
        <p class="text-sm text-gray-400">{{ planillasFiltradas.length }} recibos encontrados</p>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-gray-400 uppercase bg-zinc-900">
            <tr>
              <th class="px-4 py-3">Empleado</th>
              <th class="px-4 py-3">Período</th>
              <th class="px-4 py-3">Salario Neto</th>
              <th class="px-4 py-3">Estado</th>
              <th class="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="planilla in planillasFiltradas"
              :key="planilla.id"
              class="border-b border-zinc-700/50 hover:bg-zinc-800/50"
            >
              <td class="px-4 py-3">
                <div>
                  <div class="font-medium text-gray-200">{{ planilla.empleadoNombre }}</div>
                  <div class="text-xs text-gray-400">{{ getEmpleadoInfo(planilla.empleadoId) }}</div>
                </div>
              </td>
              
              <td class="px-4 py-3 text-gray-300">
                {{ formatearPeriodo(planilla.periodo) }}
              </td>
              
              <td class="px-4 py-3">
                <div v-if="planilla.salarioNeto">
                  <div class="text-lg font-bold text-white">
                    ₡{{ formatCurrency(planilla.salarioNeto) }}
                  </div>
                </div>
                <div v-else class="text-red-400 text-xs">Pendiente</div>
              </td>
              
              <td class="px-4 py-3">
                <span 
                  class="px-2 py-1 text-xs rounded-full"
                  :class="getReciboEstadoClass(planilla.recibogenerado)"
                >
                  {{ getReciboEstadoNombre(planilla.recibogenerado) }}
                </span>
              </td>
              
              <td class="px-4 py-3">
                <div class="flex space-x-2">
                  <button
                    @click="generarRecibo(planilla)"
                    :disabled="!planilla.salarioNeto"
                    class="px-3 py-1 text-xs font-medium bg-zinc-900/50 border border-zinc-700/50 text-white rounded hover:bg-zinc-900/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Generar
                  </button>
                  <button
                    @click="verRecibo(planilla)"
                    :disabled="!planilla.recibogenerado"
                    class="px-3 py-1 text-xs font-medium bg-zinc-900/50 border border-zinc-700/50 text-white rounded hover:bg-zinc-900/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Ver
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Vista Previa del Recibo -->
    <div v-if="reciboSeleccionado" class="rounded-lg border border-zinc-700/50 p-6" style="background-color: rgb(24 24 27 / 0.8);">
      <div class="flex justify-between items-center mb-6">
        <h4 class="text-lg font-semibold text-gray-100">Vista Previa del Recibo</h4>
        <button 
          @click="cerrarVistaPrevia"
          class="text-gray-400 hover:text-gray-300"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Template del Recibo -->
      <div class="bg-white text-black p-8 rounded-lg max-w-2xl mx-auto">
        <!-- Header del Recibo -->
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold text-gray-800">EL EMPANADAZO</h1>
          <p class="text-gray-600">Restaurante</p>
          <p class="text-sm text-gray-500">San José, Costa Rica</p>
        </div>
        
        <!-- Información del Empleado -->
        <div class="mb-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4">RECIBO DE PAGO</h2>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-600">Empleado:</p>
              <p class="font-semibold">{{ reciboSeleccionado.empleadoNombre }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Período:</p>
              <p class="font-semibold">{{ formatearPeriodo(reciboSeleccionado.periodo) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Fecha de Pago:</p>
              <p class="font-semibold">{{ formatearFecha(new Date()) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Cédula:</p>
              <p class="font-semibold">{{ getEmpleadoCedula(reciboSeleccionado.empleadoId) }}</p>
            </div>
          </div>
        </div>
        
        <!-- Desglose Salarial -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-3">Desglose Salarial</h3>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">Salario Base:</span>
              <span class="font-semibold">₡{{ formatCurrency(reciboSeleccionado.salarioBase || 0) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Horas Extra:</span>
              <span class="font-semibold">₡{{ formatCurrency(reciboSeleccionado.montoHorasExtra || 0) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Bonos:</span>
              <span class="font-semibold text-green-600">₡{{ formatCurrency(reciboSeleccionado.totalBonos || 0) }}</span>
            </div>
            <hr class="border-zinc-700/50">
            <div class="flex justify-between font-bold">
              <span class="text-gray-800">Total Bruto:</span>
              <span class="text-gray-800">₡{{ formatCurrency(reciboSeleccionado.salarioBruto || 0) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Deducciones -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-3">Deducciones</h3>
          <div class="space-y-2">
            <div v-for="deduccion in reciboSeleccionado.deduccionesDetalle" :key="deduccion.concepto" class="flex justify-between">
              <span class="text-gray-600">{{ deduccion.concepto }}:</span>
              <span class="font-semibold text-red-600">₡{{ formatCurrency(deduccion.monto) }}</span>
            </div>
            <hr class="border-zinc-700/50">
            <div class="flex justify-between font-bold">
              <span class="text-gray-800">Total Deducciones:</span>
              <span class="text-red-600">₡{{ formatCurrency(reciboSeleccionado.totalDeducciones || 0) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Salario Neto -->
        <div class="border-t-2 border-zinc-700/50 pt-4">
          <div class="flex justify-between items-center">
            <span class="text-xl font-bold text-gray-800">SALARIO NETO:</span>
            <span class="text-2xl font-bold text-green-600">₡{{ formatCurrency(reciboSeleccionado.salarioNeto || 0) }}</span>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="mt-8 pt-4 border-t border-zinc-700/50 text-center text-sm text-gray-500">
          <p>Este documento es un comprobante oficial de pago</p>
          <p>Generado el {{ formatearFecha(new Date()) }} por el Sistema de Planilla</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, ref } from 'vue'
import { PlanillaService } from '@/services/planillaService'
import { useToast } from '@/composables/useToast'

export default defineComponent({
  name: 'ReciboGenerator',
  emits: ['refresh-planillas'],
  props: {
    planillas: {
      type: Array,
      default: () => []
    },
    empleados: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { emit }) {
    const toast = useToast()
    const filtroEmpleado = ref('')
    const getPeriodoActual = () => {
      const now = new Date()
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    }

    const filtroPeriodo = ref(getPeriodoActual())
    const reciboSeleccionado = ref(null)
    const deduccionesConfig = ref([])

    const obtenerSalarioBase = (planilla) => planilla.salarioBase ?? planilla.salario_base ?? 0
    const obtenerBonos = (planilla) => planilla.totalBonos ?? planilla.total_bonos ?? 0
    const obtenerHorasExtra = (planilla) => planilla.montoHorasExtra ?? planilla.monto_horas_extra ?? 0
    const obtenerSalarioBruto = (planilla, salarioBase) => planilla.salarioBruto ?? planilla.salario_bruto ?? (salarioBase + obtenerBonos(planilla) + obtenerHorasExtra(planilla))

    const obtenerDeduccionesManuales = (planilla) => {
      if (!planilla || !Array.isArray(planilla.deducciones)) return []
      return planilla.deducciones.map(d => ({
        concepto: d.concepto,
        monto: Number(d.monto || 0)
      })).filter(d => d.monto)
    }

    const calcularDeduccionesConfig = (monto = 0) => {
      if (!monto) return []
      return deduccionesConfig.value
        .filter(d => d.activa !== false)
        .map(d => {
          const porcentaje = d.porcentaje ? Number(d.porcentaje) : null
          const montoFijo = d.monto_fijo ? Number(d.monto_fijo) : null
          const valor = (porcentaje ? monto * (porcentaje / 100) : 0) + (montoFijo || 0)
          return { concepto: d.concepto, monto: valor }
        })
        .filter(d => d.monto)
    }

    const normalizarPlanilla = (planilla) => {
      const salarioBase = obtenerSalarioBase(planilla)
      const salarioBruto = obtenerSalarioBruto(planilla, salarioBase)
      const auto = calcularDeduccionesConfig(salarioBruto)
      const manual = obtenerDeduccionesManuales(planilla)

      const mapa = new Map()
      ;[...manual, ...auto].forEach(d => {
        mapa.set(d.concepto, (mapa.get(d.concepto) || 0) + d.monto)
      })

      const detalle = Array.from(mapa.entries()).map(([concepto, monto]) => ({ concepto, monto }))
      const totalDeducciones = detalle.reduce((sum, d) => sum + d.monto, 0)
      const salarioNeto = Math.max(salarioBruto - totalDeducciones, 0)

      return {
        ...planilla,
        salarioBase,
        salarioBruto,
        montoHorasExtra: obtenerHorasExtra(planilla),
        totalBonos: obtenerBonos(planilla),
        deduccionesDetalle: detalle,
        totalDeducciones,
        salarioNeto
      }
    }

    const planillasNormalizadas = computed(() => props.planillas.map(normalizarPlanilla))

    const planillasCalculadas = computed(() => {
      return planillasNormalizadas.value.filter(p => (p.salarioNeto ?? 0) > 0)
    })

    const planillasFiltradas = computed(() => {
      let filtradas = planillasNormalizadas.value
      if (filtroEmpleado.value) {
        filtradas = filtradas.filter(p => String(p.empleadoId || p.usuario_id) === filtroEmpleado.value)
      }
      if (filtroPeriodo.value) {
        filtradas = filtradas.filter(p => p.periodo === filtroPeriodo.value)
      }
      return filtradas
    })

    const getEmpleadoInfo = (empleadoId) => {
      const empleado = props.empleados.find(emp => emp.id === empleadoId)
      return empleado ? `${empleado.puesto || ''} ${empleado.cedula ? '- ' + empleado.cedula : ''}`.trim() : 'Empleado no encontrado'
    }

    const getEmpleadoCedula = (empleadoId) => {
      const empleado = props.empleados.find(emp => emp.id === empleadoId)
      return empleado ? empleado.cedula : 'N/A'
    }

    const formatearPeriodo = (periodo) => {
      const [año, mes] = periodo.split('-')
      const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ]
      return `${meses[parseInt(mes, 10) - 1]} ${año}`
    }

    const formatearFecha = (fecha) => {
      return fecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('es-CR').format(amount || 0)
    }

    const getReciboEstadoClass = (generado) => {
      return generado 
        ? 'bg-green-900/30 text-green-400 border border-green-500'
        : 'bg-yellow-900/30 text-yellow-400 border border-yellow-500'
    }

    const getReciboEstadoNombre = (generado) => {
      return generado ? 'Generado' : 'Pendiente'
    }

    const aplicarFiltros = () => {
      toast.success('Filtros aplicados')
    }

    const generarRecibo = async (planilla) => {
      if (!planilla.salarioNeto && !planilla.salario_neto) {
        toast.error('La planilla debe estar calculada para generar recibo')
        return
      }

      try {
        const resp = await PlanillaService.generarRecibo(planilla.id, {
          numero_recibo: `REC-${Date.now()}`,
          generado_por: null,
          observaciones: null
        })
        if (resp.success) {
          planilla.recibogenerado = true
          toast.success(`Recibo generado para ${planilla.empleadoNombre || 'empleado'}`)
          emit('refresh-planillas')
        } else {
          toast.error(`No se pudo generar el recibo: ${resp.error}`)
        }
      } catch (error) {
        console.error(error)
        toast.error('Error inesperado al generar recibo')
      }
    }

    const generarTodosRecibos = async () => {
      const pendientes = planillasFiltradas.value.filter(p => !p.recibogenerado)

      if (pendientes.length === 0) {
        toast.error('No hay recibos pendientes de generar')
        return
      }

      toast.info(`Generando ${pendientes.length} recibos...`)

      for (const planilla of pendientes) {
        await generarRecibo(planilla)
      }
    }

    const verRecibo = (planilla) => {
      if (!planilla.recibogenerado) {
        toast.error('El recibo debe estar generado para visualizar')
        return
      }

      reciboSeleccionado.value = planilla
    }

    const cerrarVistaPrevia = () => {
      reciboSeleccionado.value = null
    }

    const descargarPlanillaGeneral = () => {
      const calculadas = planillasCalculadas.value

      if (calculadas.length === 0) {
        toast.error('No hay planillas calculadas para generar planilla general')
        return
      }

      toast.success(`Descargando planilla general con ${calculadas.length} empleados`)
    }

    const cargarDeducciones = async () => {
      const resp = await PlanillaService.getConfiguracionDeducciones()
      if (resp.success && Array.isArray(resp.data)) {
        deduccionesConfig.value = resp.data
      }
    }

    onMounted(cargarDeducciones)

    return {
      filtroEmpleado,
      filtroPeriodo,
      planillasCalculadas,
      planillasFiltradas,
      reciboSeleccionado,
      getEmpleadoInfo,
      getEmpleadoCedula,
      formatearPeriodo,
      formatearFecha,
      formatCurrency,
      getReciboEstadoClass,
      getReciboEstadoNombre,
      aplicarFiltros,
      generarRecibo,
      generarTodosRecibos,
      verRecibo,
      cerrarVistaPrevia,
      descargarPlanillaGeneral
    }
  }
})
</script> 
