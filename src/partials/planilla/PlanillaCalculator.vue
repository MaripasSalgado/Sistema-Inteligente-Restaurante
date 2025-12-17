<template>
  <div class="space-y-6">
    <div class="space-y-4 md:space-y-0 md:flex md:items-end md:justify-between">
      <div>
        <h3 class="text-lg font-semibold text-gray-100">Planilla Mensual</h3>
        <p class="text-sm text-gray-400">Control sencillo de planillas y pagos por período</p>
      </div>

      <div class="flex flex-wrap gap-4">
        <div>
          <label class="block text-xs font-medium text-gray-400 mb-1">Período</label>
          <input
            v-model="periodoSeleccionado"
            type="month"
            class="px-3 py-2 bg-zinc-900/95 border border-zinc-700/50 rounded-lg text-gray-100 text-sm focus:border-[#F4B400] focus:ring-1 focus:ring-[#F4B400]"
            style="color-scheme: dark;"
          />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-400 mb-1">Estado</label>
          <select
            v-model="filtroEstado"
            class="px-3 py-2 bg-zinc-900/95 border border-zinc-700/50 rounded-lg text-gray-100 text-sm focus:border-[#F4B400] focus:ring-1 focus:ring-[#F4B400]"
          >
            <option value="todos">Todos</option>
            <option value="pagadas">Pagadas</option>
            <option value="pendientes">Pendientes / sin planilla</option>
          </select>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div style="background-color: rgb(24 24 27 / 0.8);" class="rounded-lg border border-zinc-700/50 p-4">
        <div class="text-sm text-gray-400 mb-1">Empleados</div>
        <div class="text-2xl font-bold text-white">{{ resumen.totalEmpleados }}</div>
      </div>
      <div style="background-color: rgb(24 24 27 / 0.8);" class="rounded-lg border border-zinc-700/50 p-4">
        <div class="text-sm text-gray-400 mb-1">Pagadas</div>
        <div class="text-2xl font-bold text-green-400">{{ resumen.pagadas }}</div>
      </div>
      <div style="background-color: rgb(24 24 27 / 0.8);" class="rounded-lg border border-zinc-700/50 p-4">
        <div class="text-sm text-gray-400 mb-1">Pendientes</div>
        <div class="text-2xl font-bold text-yellow-400">{{ resumen.pendientes }}</div>
      </div>
      <div style="background-color: rgb(24 24 27 / 0.8);" class="rounded-lg border border-zinc-700/50 p-4">
        <div class="text-sm text-gray-400 mb-1">Total Estimado</div>
        <div class="text-2xl font-bold text-white">₡{{ formatCurrency(resumen.totalEstimado) }}</div>
      </div>
    </div>

    <div class="rounded-lg border border-zinc-700/50 overflow-hidden" style="background-color: rgb(24 24 27 / 0.8);">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-gray-400 uppercase bg-zinc-900">
            <tr>
              <th class="px-4 py-3">Empleado</th>
              <th class="px-4 py-3">Salario Base</th>
              <th class="px-4 py-3">Estado Planilla</th>
              <th class="px-4 py-3">Fecha Pago</th>
              <th class="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in filasFiltradas"
              :key="row.empleado.id"
              class="border-b border-zinc-700/50 hover:bg-zinc-800/50"
            >
              <td class="px-4 py-3">
                <div class="font-medium text-gray-200">
                  {{ row.empleado.nombre }} {{ row.empleado.apellido }}
                </div>
                <div class="text-xs text-gray-400">
                  {{ row.empleado.puesto || 'Sin puesto' }}
                </div>
              </td>
              <td class="px-4 py-3 text-gray-200">
                ₡{{ formatCurrency(row.salarioBase) }}
              </td>
              <td class="px-4 py-3">
                <span
                  class="px-2 py-1 text-xs rounded-full border"
                  :class="getEstadoClass(row.estado)"
                >
                  {{ getEstadoNombre(row.estado) }}
                </span>
              </td>
              <td class="px-4 py-3 text-gray-300">
                {{ formatearFecha(row.fechaPago) }}
              </td>
              <td class="px-4 py-3">
                <div class="flex flex-wrap gap-2">
                  <button
                    v-if="!row.planilla"
                    @click="crearPlanilla(row)"
                    :disabled="accionEnFila === row.empleado.id"
                    class="px-3 py-1 text-xs rounded-lg border border-zinc-600 text-white bg-zinc-900/60 hover:bg-zinc-900/80 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ accionEnFila === row.empleado.id ? 'Creando...' : 'Crear planilla' }}
                  </button>

                  <button
                    v-else-if="row.estado === 'pagada'"
                    @click="desmarcarPagada(row)"
                    :disabled="accionEnFila === row.empleado.id"
                    class="px-3 py-1 text-xs rounded-lg border border-green-600 text-green-400 bg-green-900/20 hover:bg-green-900/40 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ accionEnFila === row.empleado.id ? 'Procesando...' : 'Desmarcar pago' }}
                  </button>

                  <button
                    v-else
                    @click="marcarPagada(row)"
                    :disabled="accionEnFila === row.empleado.id"
                    class="px-3 py-1 text-xs rounded-lg bg-[#F4B400] text-black font-semibold hover:bg-[#F4B400]/80 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ accionEnFila === row.empleado.id ? 'Registrando...' : 'Marcar pagada' }}
                  </button>

                  <button
                    v-if="row.planilla"
                    @click="eliminarPlanilla(row)"
                    :disabled="accionEnFila === row.empleado.id"
                    class="px-3 py-1 text-xs rounded-lg border border-red-600 text-red-400 bg-red-900/20 hover:bg-red-900/40 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ accionEnFila === row.empleado.id ? 'Eliminando...' : 'Eliminar' }}
                  </button>
                </div>

                <div v-if="row.planilla" class="mt-2">
                  <button
                    @click="abrirDialogoHorasExtra(row)"
                    :disabled="accionEnFila === row.empleado.id"
                    class="px-3 py-1 text-xs rounded-lg border border-violet-600 text-violet-400 bg-violet-900/20 hover:bg-violet-900/40 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    + Horas extra
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filasFiltradas.length === 0">
              <td colspan="5" class="px-4 py-6 text-center text-sm text-gray-500">
                No hay empleados para el filtro seleccionado
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>


    <!-- Modal de Horas Extra -->
    <div v-if="dialogoHorasExtra.visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div class="bg-zinc-900 border border-zinc-700/70 rounded-lg shadow-xl max-w-lg w-full p-6 space-y-4">
        <div class="flex items-start justify-between">
          <div>
            <h4 class="text-lg font-semibold text-gray-100">Registrar Horas Extra</h4>
            <p class="text-sm text-gray-400 mt-1">
              {{ dialogoHorasExtra.empleadoNombre }} - {{ dialogoHorasExtra.periodo }}
            </p>
          </div>
          <button @click="cerrarDialogoHorasExtra" class="text-gray-400 hover:text-gray-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <!-- Horas Extra -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Horas Extra</label>
            <input
              v-model="dialogoHorasExtra.horas"
              type="number"
              step="0.5"
              min="0"
              placeholder="Ej: 10"
              class="w-full px-3 py-2 bg-zinc-900/95 border border-zinc-700/50 rounded-lg text-gray-100 focus:border-[#F4B400] focus:ring-1 focus:ring-[#F4B400]"
            />
            <p class="text-xs text-gray-500 mt-1">Cantidad de horas extra trabajadas</p>
          </div>

          <!-- Cálculo de Tarifa -->
          <div class="rounded-lg bg-zinc-800/50 p-4 space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-400">Tarifa base por hora:</span>
              <span class="text-gray-200 font-medium">₡{{ formatCurrency(dialogoHorasExtra.tarifaBase) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-400">Multiplicador:</span>
              <span class="text-violet-400 font-medium">{{ dialogoHorasExtra.multiplicador }}x</span>
            </div>
            <div class="border-t border-zinc-700 pt-2 mt-2">
              <div class="flex justify-between">
                <span class="text-gray-300 font-medium">Tarifa hora extra:</span>
                <span class="text-[#F4B400] font-bold">₡{{ formatCurrency(dialogoHorasExtra.tarifaConMultiplicador) }}</span>
              </div>
            </div>
          </div>

          <!-- Tarifa personalizada (opcional) -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Tarifa personalizada (opcional)
            </label>
            <input
              v-model="dialogoHorasExtra.tarifaPersonalizada"
              type="number"
              step="0.01"
              min="0"
              :placeholder="`₡${dialogoHorasExtra.tarifaConMultiplicador.toFixed(2)}`"
              class="w-full px-3 py-2 bg-zinc-900/95 border border-zinc-700/50 rounded-lg text-gray-100 focus:border-[#F4B400] focus:ring-1 focus:ring-[#F4B400]"
            />
            <p class="text-xs text-gray-500 mt-1">Dejar vacío para usar la tarifa calculada automáticamente</p>
          </div>

          <!-- Total a pagar -->
          <div class="rounded-lg bg-violet-900/20 border border-violet-600/50 p-4">
            <div class="flex justify-between items-center">
              <span class="text-gray-300 font-medium">Total horas extra:</span>
              <span class="text-2xl font-bold text-violet-400">
                ₡{{ formatCurrency(calcularMontoHorasExtra) }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3 pt-4 border-t border-zinc-700">
          <button
            @click="cerrarDialogoHorasExtra"
            class="px-4 py-2 bg-zinc-800 border border-zinc-700/70 text-gray-200 rounded-lg hover:bg-zinc-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="confirmarHorasExtra"
            :disabled="!dialogoHorasExtra.horas || dialogoHorasExtra.horas <= 0"
            class="px-4 py-2 bg-[#F4B400] text-black rounded-lg font-medium hover:bg-[#F4B400]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Registrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, ref } from 'vue'
import { PlanillaService } from '@/services/planillaService'
import { useToast } from '@/composables/useToast'

const getPeriodoActual = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

const construirFechaFin = (periodo) => {
  if (!periodo) return null
  const [yearStr, monthStr] = periodo.split('-')
  const year = Number(yearStr)
  const month = Number(monthStr)
  if (!year || !month) return null
  const lastDay = new Date(year, month, 0).getDate()
  return `${periodo}-${String(lastDay).padStart(2, '0')}`
}

export default defineComponent({
  name: 'PlanillaCalculator',
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
    const periodoSeleccionado = ref(getPeriodoActual())
    const filtroEstado = ref('todos')
    const accionEnFila = ref(null)
    const deduccionesConfig = ref([])
    const dialogoHorasExtra = ref({
      visible: false,
      row: null,
      empleadoNombre: '',
      periodo: '',
      horas: null,
      tarifaBase: 0,
      multiplicador: 1.5,
      tarifaConMultiplicador: 0,
      tarifaPersonalizada: null
    })

    const planillasPeriodo = computed(() =>
      props.planillas.filter(p => p.periodo === periodoSeleccionado.value)
    )

    const sumarDeduccionesManuales = (planilla) => {
      if (!planilla || !Array.isArray(planilla.deducciones)) return 0
      return planilla.deducciones.reduce((sum, d) => sum + Number(d.monto || 0), 0)
    }

    const calcularDeduccionesConfig = (monto = 0) => {
      if (!monto) return { detalle: [], total: 0 }
      const detalle = deduccionesConfig.value
        .filter(d => d.activa !== false)
        .map(d => {
          const porcentaje = d.porcentaje ? Number(d.porcentaje) : null
          const montoFijo = d.monto_fijo ? Number(d.monto_fijo) : null
          const valor = (porcentaje ? monto * (porcentaje / 100) : 0) + (montoFijo || 0)
          return { concepto: d.concepto, monto: valor }
        })
        .filter(d => d.monto)
      const total = detalle.reduce((sum, d) => sum + d.monto, 0)
      return { detalle, total }
    }

    const calcularTotalDeducciones = (salarioBase = 0) => {
      return calcularDeduccionesConfig(salarioBase).total
    }

    const calcularResumenPlanilla = (planilla, empleado) => {
      const salarioBase = Number(
        planilla?.salarioBase ??
        planilla?.salario_base ??
        empleado.salario_base ??
        empleado.salarioBase ??
        0
      )
      const bonos = Number(planilla?.totalBonos ?? planilla?.total_bonos ?? 0)
      const montoHorasExtra = Number(planilla?.montoHorasExtra ?? planilla?.monto_horas_extra ?? 0)
      const salarioBruto = Number(planilla?.salarioBruto ?? planilla?.salario_bruto ?? (salarioBase + bonos + montoHorasExtra))
      const auto = calcularDeduccionesConfig(salarioBruto)
      const manual = sumarDeduccionesManuales(planilla)
      const totalDeducciones = auto.total + manual
      const salarioNeto = Math.max(salarioBruto - totalDeducciones, 0)

      return {
        salarioBase,
        bonoTotal: bonos,
        montoHorasExtra,
        salarioBruto,
        totalDeducciones,
        salarioNeto
      }
    }

    const filas = computed(() => {
      return props.empleados.map(emp => {
        const planilla = planillasPeriodo.value.find(
          p => (p.empleadoId || p.usuario_id) === emp.id
        )
        const resumenPlanilla = calcularResumenPlanilla(planilla, emp)

        return {
          empleado: emp,
          planilla,
          estado: planilla?.estado || 'sin_planilla',
          salarioBase: resumenPlanilla.salarioBase,
          salarioBruto: resumenPlanilla.salarioBruto,
          salarioNeto: resumenPlanilla.salarioNeto,
          totalDeducciones: resumenPlanilla.totalDeducciones,
          fechaPago: planilla?.fechaPago || planilla?.fecha_pago || null
        }
      })
    })

    const filasFiltradas = computed(() => {
      if (filtroEstado.value === 'todos') return filas.value
      if (filtroEstado.value === 'pagadas') {
        return filas.value.filter(row => row.estado === 'pagada')
      }
      return filas.value.filter(row => row.estado !== 'pagada')
    })

    const resumen = computed(() => {
      const totalEmpleados = filas.value.length
      const pagadas = filas.value.filter(row => row.estado === 'pagada').length
      const pendientes = totalEmpleados - pagadas
      const totalEstimado = filas.value.reduce((sum, row) => sum + (row.salarioBase || 0), 0)

      return { totalEmpleados, pagadas, pendientes, totalEstimado }
    })

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('es-CR').format(amount || 0)
    }

    const formatearFecha = (fecha) => {
      if (!fecha) return 'Pendiente'
      return new Date(fecha).toLocaleDateString('es-CR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    }

    const getEstadoNombre = (estado) => {
      switch (estado) {
        case 'pagada':
          return 'Pagada'
        case 'calculada':
          return 'Calculada'
        case 'pendiente':
          return 'Pendiente'
        default:
          return 'Sin planilla'
      }
    }

    const getEstadoClass = (estado) => {
      switch (estado) {
        case 'pagada':
          return 'bg-green-900/30 text-green-400 border-green-500'
        case 'calculada':
          return 'bg-sky-900/30 text-sky-300 border-sky-500'
        case 'pendiente':
          return 'bg-yellow-900/30 text-yellow-400 border-yellow-500'
        default:
          return 'bg-gray-900/30 text-gray-400 border-gray-600'
      }
    }

    const calcularMontoHorasExtra = computed(() => {
      const horas = Number(dialogoHorasExtra.value.horas) || 0
      const tarifa = Number(dialogoHorasExtra.value.tarifaPersonalizada) || dialogoHorasExtra.value.tarifaConMultiplicador
      return horas * tarifa
    })

    const crearPlanilla = async (row) => {
      if (!periodoSeleccionado.value) {
        toast.error('Selecciona un período válido')
        return
      }

      accionEnFila.value = row.empleado.id
      try {
        const fechaInicio = `${periodoSeleccionado.value}-01`
        const fechaFin = construirFechaFin(periodoSeleccionado.value)
        const totalDeducciones = calcularTotalDeducciones(row.salarioBase)
        const salarioNeto = Math.max(row.salarioBase - totalDeducciones, 0)
        const resp = await PlanillaService.createPlanilla({
          usuario_id: row.empleado.id,
          periodo: periodoSeleccionado.value,
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          estado: 'pendiente',
          salario_base: row.salarioBase,
          salario_bruto: row.salarioBase,
          salario_neto: salarioNeto,
          total_deducciones: totalDeducciones,
          horas_programadas: row.empleado.horas_semanales || 0,
          horas_trabajadas: 0,
          horas_extra: 0
        })

        if (!resp.success) {
          throw new Error(resp.error || 'No se pudo crear la planilla')
        }

        toast.success(`Planilla creada para ${row.empleado.nombre}`)
        emit('refresh-planillas')
      } catch (error) {
        console.error(error)
        toast.error(error.message || 'Error al crear planilla')
      } finally {
        accionEnFila.value = null
      }
    }

    const marcarPagada = async (row) => {
      if (!row.planilla) {
        toast.error('Primero crea la planilla')
        return
      }

      accionEnFila.value = row.empleado.id
      try {
        const fechaPago = new Date().toISOString().split('T')[0]
        const resp = await PlanillaService.registrarPago(row.planilla.id, {
          usuario_id: row.empleado.id,
          periodo: row.planilla.periodo,
          fecha_pago: fechaPago,
          monto_pagado: row.salarioNeto || row.salarioBase,
          tipo_pago: 'regular'
        })

        if (!resp.success) {
          throw new Error(resp.error || 'No se pudo registrar el pago')
        }

        toast.success(`Pago registrado para ${row.empleado.nombre}`)
        emit('refresh-planillas')
      } catch (error) {
        console.error(error)
        toast.error(error.message || 'Error al registrar pago')
      } finally {
        accionEnFila.value = null
      }
    }

    const desmarcarPagada = async (row) => {
      if (!row.planilla) {
        toast.error('No hay planilla para desmarcar')
        return
      }

      toast.confirm(
        `¿Desmarcar el pago de ${row.empleado.nombre} ${row.empleado.apellido}? Esto cambiará el estado de la planilla a "calculada".`,
        async () => {
          accionEnFila.value = row.empleado.id
          try {
            const resp = await PlanillaService.updatePlanilla(row.planilla.id, {
              estado: 'calculada',
              fecha_pago: null
            })

            if (!resp.success) {
              throw new Error(resp.error || 'No se pudo desmarcar el pago')
            }

            toast.success(`Pago desmarcado para ${row.empleado.nombre}`)
            emit('refresh-planillas')
          } catch (error) {
            console.error(error)
            toast.error(error.message || 'Error al desmarcar pago')
          } finally {
            accionEnFila.value = null
          }
        }
      )
    }

    const eliminarPlanilla = async (row) => {
      if (!row.planilla) {
        toast.error('No hay planilla para eliminar')
        return
      }

      if (row.estado === 'pagada') {
        toast.error('No se puede eliminar una planilla ya pagada. Primero desmarca el pago.')
        return
      }

      toast.confirm(
        `¿Eliminar la planilla de ${row.empleado.nombre} ${row.empleado.apellido}? Período: ${row.planilla.periodo}. Esta acción no se puede deshacer.`,
        async () => {
          accionEnFila.value = row.empleado.id
          try {
            const resp = await PlanillaService.deletePlanilla(row.planilla.id)

            if (!resp.success) {
              throw new Error(resp.error || 'No se pudo eliminar la planilla')
            }

            toast.success(`Planilla eliminada para ${row.empleado.nombre}`)
            emit('refresh-planillas')
          } catch (error) {
            console.error(error)
            toast.error(error.message || 'Error al eliminar planilla')
          } finally {
            accionEnFila.value = null
          }
        }
      )
    }

    const abrirDialogoHorasExtra = (row) => {
      if (!row.planilla) {
        toast.error('Crea la planilla antes de registrar horas extra')
        return
      }

      // Calcular tarifa base por hora
      const salarioBase = row.planilla.salarioBase ?? row.planilla.salario_base ?? row.salarioBase
      const horasSemanales = row.empleado.horas_semanales || 40
      const tarifaBase = row.empleado.tarifa_hora || (horasSemanales ? salarioBase / (horasSemanales * 4) : 0)
      const multiplicador = 1.5
      const tarifaConMultiplicador = tarifaBase * multiplicador

      dialogoHorasExtra.value = {
        visible: true,
        row: row,
        empleadoNombre: `${row.empleado.nombre} ${row.empleado.apellido}`,
        periodo: row.planilla.periodo,
        horas: row.planilla.horasExtra ?? row.planilla.horas_extra ?? null,
        tarifaBase: tarifaBase,
        multiplicador: multiplicador,
        tarifaConMultiplicador: tarifaConMultiplicador,
        tarifaPersonalizada: null
      }
    }

    const cerrarDialogoHorasExtra = () => {
      dialogoHorasExtra.value = {
        visible: false,
        row: null,
        empleadoNombre: '',
        periodo: '',
        horas: null,
        tarifaBase: 0,
        multiplicador: 1.5,
        tarifaConMultiplicador: 0,
        tarifaPersonalizada: null
      }
    }

    const confirmarHorasExtra = async () => {
      const row = dialogoHorasExtra.value.row
      const horas = Number(dialogoHorasExtra.value.horas)
      const tarifa = Number(dialogoHorasExtra.value.tarifaPersonalizada) || dialogoHorasExtra.value.tarifaConMultiplicador

      if (!horas || horas <= 0) {
        toast.error('Ingresa una cantidad válida de horas')
        return
      }

      const montoExtra = horas * tarifa
      const salarioBase = row.planilla.salarioBase ?? row.planilla.salario_base ?? row.salarioBase
      const bonos = row.planilla.totalBonos ?? row.planilla.total_bonos ?? 0
      const salarioBruto = salarioBase + bonos + montoExtra
      const auto = calcularDeduccionesConfig(salarioBruto)
      const manual = sumarDeduccionesManuales(row.planilla)
      const totalDeducciones = auto.total + manual
      const salarioNeto = Math.max(salarioBruto - totalDeducciones, 0)

      accionEnFila.value = row.empleado.id
      cerrarDialogoHorasExtra()

      try {
        const resp = await PlanillaService.updatePlanilla(row.planilla.id, {
          horas_extra: horas,
          monto_horas_extra: montoExtra,
          salario_bruto: salarioBruto,
          total_deducciones: totalDeducciones,
          salario_neto: salarioNeto
        })
        if (!resp.success) {
          throw new Error(resp.error || 'No se pudo registrar horas extra')
        }
        toast.success('Horas extra registradas correctamente')
        emit('refresh-planillas')
      } catch (error) {
        console.error(error)
        toast.error(error.message || 'Error al registrar horas extra')
      } finally {
        accionEnFila.value = null
      }
    }

    const cargarDeducciones = async () => {
      const resp = await PlanillaService.getConfiguracionDeducciones()
      if (resp.success && resp.data) {
        deduccionesConfig.value = resp.data
      }
    }

    onMounted(() => {
      cargarDeducciones()
    })

    return {
      periodoSeleccionado,
      filtroEstado,
      filasFiltradas,
      resumen,
      formatCurrency,
      formatearFecha,
      getEstadoClass,
      getEstadoNombre,
      accionEnFila,
      crearPlanilla,
      marcarPagada,
      desmarcarPagada,
      eliminarPlanilla,
      dialogoHorasExtra,
      calcularMontoHorasExtra,
      abrirDialogoHorasExtra,
      cerrarDialogoHorasExtra,
      confirmarHorasExtra
    }
  }
})
</script>
