<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold text-gray-100">Salario de Empleados</h3>
        <p class="text-sm text-gray-400">Actualiza salario base, tarifa por hora, tipo de contrato y cuenta bancaria</p>
      </div>
      <div class="flex space-x-3">
        <button
          @click="cargarEmpleados"
          class="px-3 py-2 bg-zinc-900/50 border border-zinc-700/50 text-white text-sm font-medium rounded hover:bg-zinc-900/70 transition-colors"
        >
          Refrescar
        </button>
        <button
          v-if="cargando"
          disabled
          class="px-3 py-2 bg-zinc-800/70 border border-zinc-700/50 text-white text-sm font-medium rounded cursor-wait"
        >
          Cargando...
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-300 mb-2">Empleado</label>
        <select 
          v-model="empleadoSeleccionado"
          @change="cargarSalarioEmpleado"
          class="w-full px-3 py-2 bg-zinc-900/95 border border-zinc-700/50 rounded-lg text-gray-100 focus:border-[#F4B400] focus:ring-1 focus:ring-[#F4B400]"
        >
          <option value="">Selecciona un empleado...</option>
          <option 
            v-for="emp in empleadosSalario" 
            :key="emp.id" 
            :value="emp.id"
          >
            {{ emp.nombre }} {{ emp.apellido }} - {{ emp.puesto || 'Sin puesto' }}
          </option>
        </select>
      </div>
      <div class="flex items-end">
        <button
          @click="guardarSalario"
          :disabled="!empleadoSeleccionado"
          class="w-full px-4 py-2 bg-[#F4B400] text-black rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F4B400]/90"
        >
          Guardar salario
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Salario Base (₡)</label>
        <input
          v-model.number="salarioForm.salario_base"
          type="number"
          min="0"
          step="0.01"
          class="w-full px-3 py-2 bg-zinc-900/95 border border-zinc-700/50 rounded-lg text-gray-100 focus:border-[#F4B400] focus:ring-1 focus:ring-[#F4B400]"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Tarifa Hora (₡)</label>
        <input
          v-model.number="salarioForm.tarifa_hora"
          type="number"
          min="0"
          step="0.01"
          class="w-full px-3 py-2 bg-zinc-900/95 border border-zinc-700/50 rounded-lg text-gray-100 focus:border-[#F4B400] focus:ring-1 focus:ring-[#F4B400]"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Tipo de Contrato</label>
        <select
          v-model="salarioForm.tipo_contrato"
          class="w-full px-3 py-2 bg-zinc-900/95 border border-zinc-700/50 rounded-lg text-gray-100 focus:border-[#F4B400] focus:ring-1 focus:ring-[#F4B400]"
        >
          <option value="">Seleccionar...</option>
          <option value="fijo">Fijo</option>
          <option value="por_hora">Por hora</option>
          <option value="temporal">Temporal</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Cuenta Bancaria</label>
        <input
          v-model="salarioForm.cuenta_banco"
          type="text"
          class="w-full px-3 py-2 bg-zinc-900/95 border border-zinc-700/50 rounded-lg text-gray-100 focus:border-[#F4B400] focus:ring-1 focus:ring-[#F4B400]"
        />
      </div>
    </div>

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

    <div v-if="empleadoSeleccionado" class="rounded-lg border border-zinc-700/50 p-6" style="background-color: rgb(24 24 27 / 0.8);">
      <div class="flex items-center justify-between mb-4">
        <h4 class="text-md font-semibold text-gray-100">Historial salarial</h4>
        <span class="text-sm text-gray-400">
          {{ historialEmpleado.length }} registro(s)
        </span>
      </div>

      <div v-if="historialEmpleado.length > 0" class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-gray-400 uppercase bg-zinc-900">
            <tr>
              <th class="px-4 py-3">Fecha</th>
              <th class="px-4 py-3">Salario</th>
              <th class="px-4 py-3">Tarifa Hora</th>
              <th class="px-4 py-3">Tipo Contrato</th>
              <th class="px-4 py-3">Motivo</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="registro in historialEmpleado"
              :key="registro.id"
              class="border-b border-zinc-700/50"
            >
              <td class="px-4 py-3 text-gray-300">
                {{ formatearFecha(registro.fecha_cambio) }}
              </td>
              <td class="px-4 py-3 text-gray-200">
                ₡{{ formatCurrency(registro.salario_nuevo || 0) }}
              </td>
              <td class="px-4 py-3 text-gray-200">
                ₡{{ formatCurrency(registro.tarifa_hora_nueva || 0) }}
              </td>
              <td class="px-4 py-3 text-gray-300">
                {{ registro.tipo_contrato_nuevo || 'N/A' }}
              </td>
              <td class="px-4 py-3 text-gray-400">
                {{ registro.motivo || 'Sin motivo' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="text-center text-gray-500 py-6">
        Aún no hay historial registrado para este empleado
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue'
import { UserSalaryService } from '../../services/userSalaryService'

export default {
  name: 'SalarioConfig',
  setup() {
    const empleadosSalario = ref([])
    const empleadoSeleccionado = ref('')
    const salarioForm = ref({
      salario_base: null,
      tarifa_hora: null,
      tipo_contrato: '',
      cuenta_banco: ''
    })
    const historialEmpleado = ref([])
    const mensaje = ref('')
    const mensajeTipo = ref('')
    const cargando = ref(false)

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

    const normalizarId = (id) => (id ? id.toString() : '')

    const cargarEmpleados = async () => {
      cargando.value = true
      const resp = await UserSalaryService.getEmpleadosSalario()
      cargando.value = false
      if (resp.success) {
        empleadosSalario.value = resp.data
      } else {
        mostrarMensaje(resp.error || 'Error al cargar empleados', 'error')
      }
    }

    const cargarHistorialEmpleado = async () => {
      historialEmpleado.value = []
      if (!empleadoSeleccionado.value) return
      const resp = await UserSalaryService.getHistorialSalarios(empleadoSeleccionado.value)
      if (resp.success) {
        historialEmpleado.value = resp.data || []
      }
    }

    const cargarSalarioEmpleado = () => {
      const emp = empleadosSalario.value.find(e => normalizarId(e.id) === normalizarId(empleadoSeleccionado.value))
      if (!emp) {
        salarioForm.value = {
          salario_base: null,
          tarifa_hora: null,
          tipo_contrato: '',
          cuenta_banco: ''
        }
        return
      }
      salarioForm.value = {
        salario_base: emp.salario_base || null,
        tarifa_hora: emp.tarifa_hora || null,
        tipo_contrato: emp.tipo_contrato || '',
        cuenta_banco: emp.cuenta_banco || ''
      }
    }

    const guardarSalario = async () => {
      if (!empleadoSeleccionado.value) {
        mostrarMensaje('Selecciona un empleado', 'error')
        return
      }

      const empActual = empleadosSalario.value.find(e => normalizarId(e.id) === normalizarId(empleadoSeleccionado.value))

      const payload = {
        salario_base: salarioForm.value.salario_base || null,
        tarifa_hora: salarioForm.value.tarifa_hora || null,
        tipo_contrato: salarioForm.value.tipo_contrato || null,
        cuenta_banco: salarioForm.value.cuenta_banco || null,
        modificado_por: null,
        salario_anterior: empActual?.salario_base || null,
        tarifa_hora_anterior: empActual?.tarifa_hora || null,
        tipo_contrato_anterior: empActual?.tipo_contrato || null,
        motivo: 'Actualización desde configuración salarial'
      }

      const resp = await UserSalaryService.updateSalario(empleadoSeleccionado.value, payload)
      if (resp.success) {
        mostrarMensaje(resp.warning || 'Salario actualizado', 'success')
        await cargarEmpleados()
        cargarSalarioEmpleado()
      } else {
        mostrarMensaje(resp.error || 'Error al actualizar salario', 'error')
      }
    }

    const formatCurrency = (amount) => new Intl.NumberFormat('es-CR').format(amount || 0)

    const formatearFecha = (fecha) => {
      if (!fecha) return 'Sin fecha'
      return new Date(fecha).toLocaleDateString('es-CR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    }

    const mostrarMensaje = (texto, tipo = 'info') => {
      mensaje.value = texto
      mensajeTipo.value = tipo
      
      setTimeout(() => {
        mensaje.value = ''
        mensajeTipo.value = ''
      }, 5000)
    }

    watch(empleadoSeleccionado, () => {
      cargarSalarioEmpleado()
      cargarHistorialEmpleado()
    })

    onMounted(cargarEmpleados)

    return {
      empleadosSalario,
      empleadoSeleccionado,
      salarioForm,
      historialEmpleado,
      mensaje,
      mensajeTipo,
      mensajeClass,
      cargando,
      cargarEmpleados,
      cargarSalarioEmpleado,
      guardarSalario,
      formatCurrency,
      formatearFecha
    }
  }
}
</script>
