<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-lg font-semibold text-gray-100">Detalle de Planilla Individual</h3>
        <p class="text-sm text-gray-400">Gestión de bonos, deducciones y cálculos específicos</p>
      </div>
      
      <div class="flex space-x-3">
        <button
          @click="agregarBono"
          class="px-4 py-2 bg-zinc-900/50 border border-zinc-700/50 text-sm font-medium rounded-lg text-white transition-colors hover:bg-zinc-900/70"
        >
          Agregar Bono
        </button>
        <button
          @click="agregarDeduccion"
          class="px-4 py-2 bg-zinc-900/50 border border-zinc-700/50 text-sm font-medium rounded-lg text-white transition-colors hover:bg-zinc-900/70"
        >
          Agregar Deducción
        </button>
      </div>
    </div>

    <!-- Selector de Empleado -->
    <div class="rounded-lg border border-zinc-700/50 p-6" style="background-color: rgb(24 24 27 / 0.8);">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Seleccionar Empleado</label>
          <select 
            v-model="empleadoSeleccionado"
            @change="cargarPlanilla"
            class="w-full px-3 py-2 bg-zinc-900/95 border border-zinc-700/50 rounded-lg text-gray-100 focus:border-[#F4B400] focus:ring-1 focus:ring-[#F4B400]"
          >
            <option value="">Seleccionar empleado...</option>
            <option 
              v-for="empleado in empleados" 
              :key="empleado.id" 
              :value="empleado.id"
            >
              {{ empleado.nombre }} - {{ empleado.puesto }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Período</label>
          <select 
            v-model="periodoSeleccionado"
            @change="cargarPlanilla"
            class="w-full px-3 py-2 bg-zinc-900/95 border border-zinc-700/50 rounded-lg text-gray-100 focus:border-[#F4B400] focus:ring-1 focus:ring-[#F4B400]"
          >
            <option value="2025-01">Enero 2025</option>
            <option value="2024-12">Diciembre 2024</option>
            <option value="2024-11">Noviembre 2024</option>
          </select>
        </div>
        
        <div class="flex items-end">
          <button 
            @click="cargarPlanilla"
            :disabled="!empleadoSeleccionado"
            class="w-full px-4 py-2 bg-[#F4B400] text-black rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F4B400]/80"
          >
            Cargar Planilla
          </button>
        </div>
      </div>
    </div>

    <!-- Detalle de Planilla -->
    <div v-if="planillaActual" class="space-y-6">
      <!-- Información General -->
      <div class="rounded-lg border border-zinc-700/50 p-6" style="background-color: rgb(24 24 27 / 0.8);">
        <h4 class="text-lg font-semibold text-gray-100 mb-4">Información General</h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div class="text-sm text-gray-400 mb-1">Empleado</div>
            <div class="text-gray-200 font-medium">{{ planillaActual.empleadoNombre }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-400 mb-1">Período</div>
            <div class="text-gray-200">{{ planillaActual.periodo }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-400 mb-1">Estado</div>
            <span 
              class="px-2 py-1 text-xs rounded-full"
              :class="getEstadoClass(planillaActual.estado)"
            >
              {{ getEstadoNombre(planillaActual.estado) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Cálculos Salariales -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Salario Bruto -->
        <div class="rounded-lg border border-zinc-700/50 p-6" style="background-color: rgb(24 24 27 / 0.8);">
          <h5 class="text-md font-semibold text-gray-100 mb-4">Salario Bruto</h5>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-400">Salario Base:</span>
              <span class="text-gray-200">₡{{ formatCurrency(planillaActual.salarioBase || 0) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Horas Extra:</span>
              <span class="text-gray-200">₡{{ formatCurrency(planillaActual.montoHorasExtra || 0) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Bonos:</span>
              <span class="text-white">₡{{ formatCurrency(planillaActual.totalBonos || 0) }}</span>
            </div>
            <hr class="border-zinc-700/50">
            <div class="flex justify-between font-bold">
              <span class="text-gray-200">Total Bruto:</span>
              <span class="text-white">₡{{ formatCurrency(planillaActual.salarioBruto || 0) }}</span>
            </div>
          </div>
        </div>

        <!-- Deducciones -->
        <div class="rounded-lg border border-zinc-700/50 p-6" style="background-color: rgb(24 24 27 / 0.8);">
          <h5 class="text-md font-semibold text-gray-100 mb-4">Deducciones</h5>
          <div class="space-y-3">
            <div v-for="deduccion in planillaActual.deducciones" :key="deduccion.concepto" class="flex justify-between">
              <span class="text-gray-400">{{ deduccion.concepto }}:</span>
              <span class="text-red-400">₡{{ formatCurrency(deduccion.monto) }}</span>
            </div>
            <hr class="border-zinc-700/50">
            <div class="flex justify-between font-bold">
              <span class="text-gray-200">Total Deducciones:</span>
              <span class="text-red-400">₡{{ formatCurrency(planillaActual.totalDeducciones || 0) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Salario Neto -->
      <div class="rounded-lg border border-zinc-700/50 p-6" style="background-color: rgb(24 24 27 / 0.8);">
        <div class="flex justify-between items-center">
          <h5 class="text-lg font-semibold text-gray-100">Salario Neto</h5>
          <div class="text-2xl font-bold text-white">
            ₡{{ formatCurrency(planillaActual.salarioNeto || 0) }}
          </div>
        </div>
      </div>

      <!-- Gestión de Bonos -->
      <div class="rounded-lg border border-zinc-700/50 p-6" style="background-color: rgb(24 24 27 / 0.8);">
        <div class="flex justify-between items-center mb-4">
          <h5 class="text-md font-semibold text-gray-100">Bonos Aplicados</h5>
                      <button
              @click="agregarBono"
              class="px-3 py-1 bg-zinc-900/50 border border-zinc-700/50 text-white text-sm font-medium rounded hover:bg-zinc-900/70 transition-colors"
            >
              + Agregar Bono
            </button>
        </div>
        
        <div v-if="planillaActual.bonos.length > 0" class="space-y-3">
          <div
            v-for="bono in planillaActual.bonos"
            :key="bono.concepto"
            class="flex justify-between items-center p-3 bg-zinc-900 rounded-lg"
          >
            <div>
              <div class="text-gray-200 font-medium">{{ bono.concepto }}</div>
              <div class="text-xs text-gray-400">
                Aplicado por {{ bono.aplicadoPor }} el {{ formatearFecha(bono.fecha) }}
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-white font-medium">₡{{ formatCurrency(bono.monto) }}</span>
              <button 
                @click="solicitarConfirmacion('bono', bono)"
                class="text-red-400 hover:text-red-300"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-6 text-gray-500">
          No hay bonos aplicados
        </div>
      </div>

      <!-- Gestión de Deducciones -->
      <div class="rounded-lg border border-zinc-700/50 p-6" style="background-color: rgb(24 24 27 / 0.8);">
        <div class="flex justify-between items-center mb-4">
          <h5 class="text-md font-semibold text-gray-100">Deducciones Aplicadas</h5>
                      <button
              @click="agregarDeduccion"
              class="px-3 py-1 bg-zinc-900/50 border border-zinc-700/50 text-white text-sm font-medium rounded hover:bg-zinc-900/70 transition-colors"
            >
              + Agregar Deducción
            </button>
        </div>
        
        <div v-if="planillaActual.deducciones.length > 0" class="space-y-3">
          <div
            v-for="deduccion in planillaActual.deducciones"
            :key="deduccion.concepto"
            class="flex justify-between items-center p-3 bg-zinc-900 rounded-lg"
          >
            <div>
              <div class="text-gray-200 font-medium">{{ deduccion.concepto }}</div>
              <div class="text-xs text-gray-400">
                {{ deduccion.tipo === 'legal' ? 'Deducción legal' : 'Deducción personal' }}
                <span v-if="deduccion.aplicadoPor">
                  - Aplicado por {{ deduccion.aplicadoPor }}
                </span>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-red-400 font-medium">₡{{ formatCurrency(deduccion.monto) }}</span>
              <button 
                v-if="deduccion.tipo === 'personal'"
                @click="solicitarConfirmacion('deduccion', deduccion)"
                class="text-red-400 hover:text-red-300"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-6 text-gray-500">
          No hay deducciones aplicadas
        </div>
      </div>
    </div>

    <!-- Mensaje cuando no hay planilla seleccionada -->
    <div v-else-if="empleadoSeleccionado" class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-300 mb-2">No hay planilla disponible</h3>
        <p class="text-gray-500">Selecciona otro empleado o período</p>
      </div>
    </div>

    <!-- Mensaje inicial -->
    <div v-else class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-300 mb-2">Selecciona un Empleado</h3>
        <p class="text-gray-500">Elige un empleado para ver su detalle de planilla</p>
      </div>
    </div>

    <!-- Diálogo de confirmación -->
    <div v-if="confirmDialog.abierto" class="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
      <div class="bg-zinc-900 border border-zinc-700/70 rounded-lg p-6 w-full max-w-md space-y-4">
        <h4 class="text-lg font-semibold text-gray-100">Confirmar</h4>
        <p class="text-gray-300">
          ¿Deseas eliminar esta {{ confirmDialog.tipo === 'bono' ? 'bonificación' : 'deducción' }}?
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="cancelarAccion"
            class="px-4 py-2 bg-zinc-800 border border-zinc-700 text-gray-200 rounded-lg hover:bg-zinc-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="confirmarAccion"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'EmpleadoPlanilla',
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
  setup(props) {
    const empleadoSeleccionado = ref('')
    const periodoSeleccionado = ref('2025-01')
    const planillaActual = ref(null)
    const confirmDialog = ref({ abierto: false, tipo: '', item: null })

    const cargarPlanilla = () => {
      if (!empleadoSeleccionado.value) {
        planillaActual.value = null
        return
      }

      planillaActual.value = props.planillas.find(p => 
        (p.empleadoId || p.usuario_id) === empleadoSeleccionado.value || (p.empleadoId || p.usuario_id) === parseInt(empleadoSeleccionado.value)
      ) || null

      if (planillaActual.value && periodoSeleccionado.value) {
        if (planillaActual.value.periodo !== periodoSeleccionado.value) {
          planillaActual.value = null
        }
      }
    }

    const getEstadoClass = (estado) => {
      switch (estado) {
        case 'calculada':
          return 'bg-green-900/30 text-green-400 border border-green-500'
        case 'pendiente':
          return 'bg-yellow-900/30 text-yellow-400 border border-yellow-500'
        case 'error':
          return 'bg-red-900/30 text-red-400 border border-red-500'
        default:
          return 'bg-gray-900/30 text-gray-400 border border-gray-500'
      }
    }

    const getEstadoNombre = (estado) => {
      switch (estado) {
        case 'calculada':
          return 'Calculada'
        case 'pendiente':
          return 'Pendiente'
        case 'error':
          return 'Error'
        default:
          return 'Desconocido'
      }
    }

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('es-CR').format(amount || 0)
    }

    const formatearFecha = (fecha) => {
      return new Date(fecha).toLocaleDateString('es-ES')
    }

    const agregarBono = () => {
      if (!planillaActual.value) {
        alert('Selecciona una planilla primero')
        return
      }

      const concepto = prompt('Concepto del bono:')
      const monto = parseFloat(prompt('Monto del bono:'))
      
      if (concepto && monto) {
        const nuevoBono = {
          concepto: concepto,
          monto: monto,
          aplicadoPor: 'Admin',
          fecha: new Date().toISOString().split('T')[0]
        }
        
        planillaActual.value.bonos = planillaActual.value.bonos || []
        planillaActual.value.bonos.push(nuevoBono)
        planillaActual.value.totalBonos = (planillaActual.value.totalBonos || planillaActual.value.total_bonos || 0) + monto
        planillaActual.value.salarioBruto = (planillaActual.value.salarioBruto || planillaActual.value.salario_bruto || 0) + monto
        planillaActual.value.salarioNeto = (planillaActual.value.salarioNeto || planillaActual.value.salario_neto || 0) + monto
      }
    }

    const agregarDeduccion = () => {
      if (!planillaActual.value) {
        alert('Selecciona una planilla primero')
        return
      }

      const concepto = prompt('Concepto de la deducción:')
      const monto = parseFloat(prompt('Monto de la deducción:'))
      
      if (concepto && monto) {
        const nuevaDeduccion = {
          concepto: concepto,
          monto: monto,
          tipo: 'personal',
          aplicadoPor: 'Admin',
          fecha: new Date().toISOString().split('T')[0]
        }
        
        planillaActual.value.deducciones = planillaActual.value.deducciones || []
        planillaActual.value.deducciones.push(nuevaDeduccion)
        planillaActual.value.totalDeducciones = (planillaActual.value.totalDeducciones || planillaActual.value.total_deducciones || 0) + monto
        planillaActual.value.salarioNeto = (planillaActual.value.salarioNeto || planillaActual.value.salario_neto || 0) - monto
      }
    }

    const solicitarConfirmacion = (tipo, item) => {
      confirmDialog.value = { abierto: true, tipo, item }
    }

    const confirmarAccion = async () => {
      const { tipo, item } = confirmDialog.value
      if (!planillaActual.value || !item) {
        confirmDialog.value = { abierto: false, tipo: '', item: null }
        return
      }

      if (tipo === 'bono') {
        // Eliminar en backend si tiene id
        if (item.id) {
          await PlanillaService.removeBono(item.id).catch(err => console.error(err))
        }
        const index = planillaActual.value.bonos.indexOf(item)
        if (index > -1) {
          planillaActual.value.bonos.splice(index, 1)
          planillaActual.value.totalBonos -= item.monto
          planillaActual.value.salarioBruto -= item.monto
          planillaActual.value.salarioNeto -= item.monto
        }
      }

      if (tipo === 'deduccion') {
        if (item.id) {
          await PlanillaService.removeDeduccion(item.id).catch(err => console.error(err))
        }
        const index = planillaActual.value.deducciones.indexOf(item)
        if (index > -1) {
          planillaActual.value.deducciones.splice(index, 1)
          planillaActual.value.totalDeducciones -= item.monto
          planillaActual.value.salarioNeto += item.monto
        }
      }

      confirmDialog.value = { abierto: false, tipo: '', item: null }
    }

    const cancelarAccion = () => {
      confirmDialog.value = { abierto: false, tipo: '', item: null }
    }

    return {
      planillas: props.planillas,
      empleados: props.empleados,
      empleadoSeleccionado,
      periodoSeleccionado,
      planillaActual,
      confirmDialog,
      cargarPlanilla,
      getEstadoClass,
      getEstadoNombre,
      formatCurrency,
      formatearFecha,
      agregarBono,
      agregarDeduccion,
      solicitarConfirmacion,
      confirmarAccion,
      cancelarAccion
    }
  }
})
</script> 
