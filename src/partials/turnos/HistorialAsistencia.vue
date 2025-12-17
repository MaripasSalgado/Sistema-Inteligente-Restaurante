<template>
  <div class="bg-zinc-900/50 rounded-lg border border-zinc-700/50 p-6">
    <h3 class="text-lg font-semibold text-gray-100 mb-6">Historial de Asistencia</h3>
    
    <!-- Filtros -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Empleado</label>
        <select
          v-model="filtroEmpleado"
          class="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700/50 rounded-lg text-gray-100 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
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
        <label class="block text-sm font-medium text-gray-300 mb-2">Estado</label>
        <select
          v-model="filtroEstado"
          class="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700/50 rounded-lg text-gray-100 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
        >
          <option value="">Todos los estados</option>
          <option value="a_tiempo">A tiempo</option>
          <option value="tarde">Tarde</option>
          <option value="ausencia">Ausencia</option>
        </select>
      </div>

      <div class="relative">
        <label class="block text-sm font-medium text-gray-300 mb-2">Fecha desde</label>
        <input
          v-model="filtroFechaDesde"
          type="date"
          class="date-input w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700/50 rounded-lg text-gray-100 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
        />
      </div>

      <div class="relative">
        <label class="block text-sm font-medium text-gray-300 mb-2">Fecha hasta</label>
        <input
          v-model="filtroFechaHasta"
          type="date"
          class="date-input w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700/50 rounded-lg text-gray-100 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
        />
      </div>
    </div>

    <!-- Métricas de Resumen -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-zinc-900/50 rounded-lg p-4 border border-zinc-700/50">
        <div class="text-sm text-gray-400 mb-1">Puntualidad</div>
        <div class="text-2xl font-bold text-green-400">{{ puntualidadCalculada }}%</div>
      </div>

      <div class="bg-zinc-900/50 rounded-lg p-4 border border-zinc-700/50">
        <div class="text-sm text-gray-400 mb-1">Promedio Retraso</div>
        <div class="text-2xl font-bold text-yellow-400">{{ promedioRetrasoCalculado }} min</div>
      </div>

      <div class="bg-zinc-900/50 rounded-lg p-4 border border-zinc-700/50">
        <div class="text-sm text-gray-400 mb-1">Total Registros</div>
        <div class="text-2xl font-bold text-blue-400">{{ asistenciaFiltrada.length }}</div>
      </div>
    </div>

    <!-- Tabla de Historial -->
    <div class="overflow-x-auto">
      <table class="w-full text-sm text-left">
        <thead class="text-xs text-gray-400 uppercase bg-zinc-900/50">
          <tr>
            <th class="px-4 py-3">Empleado</th>
            <th class="px-4 py-3">Fecha</th>
            <th class="px-4 py-3">Entrada Real</th>
            <th class="px-4 py-3">Salida Real</th>
            <th class="px-4 py-3">Entrada de turno</th>
            <th class="px-4 py-3">Salida de turno</th>
            <th class="px-4 py-3">Estado</th>
            <th class="px-4 py-3">Retraso</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="registro in asistenciaFiltrada"
            :key="registro.id"
            class="border-b border-zinc-700/50 hover:bg-zinc-800/30"
          >
            <td class="px-4 py-3 text-gray-200">
              {{ getEmpleadoNombre(registro.empleadoId) }}
            </td>
            <td class="px-4 py-3 text-gray-300">
              {{ formatearFecha(registro.fecha) }}
            </td>
            <td class="px-4 py-3 text-gray-300">
              {{ registro.entradaReal || '--:--' }}
            </td>
            <td class="px-4 py-3 text-gray-300">
              {{ registro.salidaReal || '--:--' }}
            </td>
            <td class="px-4 py-3 text-gray-300">
              {{ registro.turnoEntrada || '--:--' }}
            </td>
            <td class="px-4 py-3 text-gray-300">
              {{ registro.turnoSalida || '--:--' }}
            </td>
            <td class="px-4 py-3">
              <span 
                class="px-2 py-1 text-xs rounded-full"
                :class="getEstadoClass(registro.estado)"
              >
                {{ getEstadoNombre(registro.estado) }}
              </span>
            </td>
            <td class="px-4 py-3 text-gray-300">
              {{ registro.retrasoLabel }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div class="flex items-center justify-between mt-6">
      <div class="text-sm text-gray-400">
        Mostrando {{ paginacion.inicio + 1 }} a {{ paginacion.fin }} de {{ asistenciaFiltrada.length }} registros
      </div>
      
      <div class="flex space-x-2">
        <button 
          @click="paginaAnterior"
          :disabled="paginaActual === 1"
          class="px-3 py-1 text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :class="paginaActual === 1 
            ? 'bg-zinc-700 text-gray-500' 
            : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'"
        >
          Anterior
        </button>
        
        <span class="px-3 py-1 text-sm text-gray-300">
          Página {{ paginaActual }} de {{ totalPaginas }}
        </span>
        
        <button 
          @click="paginaSiguiente"
          :disabled="paginaActual === totalPaginas"
          class="px-3 py-1 text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :class="paginaActual === totalPaginas 
            ? 'bg-zinc-700 text-gray-500' 
            : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'"
        >
          Siguiente
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { AsistenciaService } from '../../services/asistenciaService.js'
import { supabase } from '../../config/supabase.js'

export default {
  name: 'HistorialAsistencia',
  setup() {
    const asistencia = ref([])
    const empleados = ref([])
    const filtroEmpleado = ref('')
    const filtroEstado = ref('')
    const hoy = new Date()
    const manana = new Date(hoy)
    manana.setDate(manana.getDate() + 1)
    const formatoIso = (fecha) => fecha.toISOString().split('T')[0]
    const filtroFechaDesde = ref(formatoIso(hoy))
    const filtroFechaHasta = ref(formatoIso(manana))
    const paginaActual = ref(1)
    const registrosPorPagina = 10
    const cargando = ref(false)

    // Cargar empleados
    const cargarEmpleados = async () => {
      const { data, error } = await supabase
        .from('usuarios')
        .select('id, nombre, apellido, puesto')
        .eq('estado', 'Activo')
        .order('nombre', { ascending: true })

      if (!error && data) {
        empleados.value = data.map(emp => ({
          id: emp.id,
          nombre: `${emp.nombre} ${emp.apellido}`,
          puesto: emp.puesto
        }))
      }
    }

    // Cargar historial de asistencia
    const cargarHistorial = async () => {
      cargando.value = true

      const filtros = {}
      if (filtroEmpleado.value) filtros.usuarioId = filtroEmpleado.value
      if (filtroEstado.value) filtros.estado = filtroEstado.value
      if (filtroFechaDesde.value) filtros.fechaInicio = filtroFechaDesde.value
      if (filtroFechaHasta.value) filtros.fechaFin = filtroFechaHasta.value

      const resultado = await AsistenciaService.getHistorialAsistencia(filtros)

      if (resultado.success) {
        asistencia.value = resultado.data.map(reg => {
          const turnoEntrada = reg.turno?.hora_inicio || ''
          const turnoSalida = reg.turno?.hora_fin || ''
          const entradaReal = reg.entrada_real || ''
          const minutosCalculados = calcularRetrasoMinutos(entradaReal, turnoEntrada)
          const minutosRetraso = minutosCalculados ?? reg.minutos_retraso ?? 0

          return {
            id: reg.id,
            empleado: reg.usuario ? `${reg.usuario.nombre} ${reg.usuario.apellido}` : 'Sin asignar',
            empleadoId: reg.usuario_id,
            fecha: reg.fecha,
            entradaReal: entradaReal || '--',
            salidaReal: reg.salida_real || '--',
            turnoEntrada: turnoEntrada || '--',
            turnoSalida: turnoSalida || '--',
            estado: reg.estado,
            minutosRetraso,
            retrasoLabel: formatearRetrasoLabel(minutosRetraso),
            datosCompletos: reg
          }
        })
      }

      cargando.value = false
    }

    // Watch para recargar cuando cambien los filtros
    watch([filtroEmpleado, filtroEstado, filtroFechaDesde, filtroFechaHasta], () => {
      paginaActual.value = 1
      cargarHistorial()
    })

    // Computed properties
    const asistenciaFiltrada = computed(() => {
      return asistencia.value
    })

    const puntualidadCalculada = computed(() => {
      const registros = asistenciaFiltrada.value
      if (!registros.length) return 0
      const puntuales = registros.filter(reg => (reg.minutosRetraso ?? 0) <= 0).length
      return Math.round((puntuales / registros.length) * 100)
    })

    const promedioRetrasoCalculado = computed(() => {
      const retrasos = asistenciaFiltrada.value
        .map(reg => reg.minutosRetraso ?? 0)
        .filter(min => min > 0)
      if (!retrasos.length) return 0
      const total = retrasos.reduce((acc, val) => acc + val, 0)
      return Math.round(total / retrasos.length)
    })

    const totalPaginas = computed(() => {
      return Math.ceil(asistenciaFiltrada.value.length / registrosPorPagina)
    })

    const paginacion = computed(() => {
      const inicio = (paginaActual.value - 1) * registrosPorPagina
      const fin = Math.min(inicio + registrosPorPagina, asistenciaFiltrada.value.length)
      return { inicio, fin }
    })

    // Methods
    const getEmpleadoNombre = (empleadoId) => {
      const empleado = empleados.value.find(emp => emp.id === empleadoId)
      return empleado ? empleado.nombre : 'Empleado no encontrado'
    }

    const formatearFecha = (fecha) => {
      return new Date(fecha).toLocaleDateString('es-ES', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const calcularRetrasoMinutos = (entradaReal, turnoEntrada) => {
      if (!entradaReal || !turnoEntrada || entradaReal === '--') return null
      const [erHoras, erMinutos] = entradaReal.split(':').map(Number)
      const [teHoras, teMinutos] = turnoEntrada.split(':').map(Number)
      if ([erHoras, erMinutos, teHoras, teMinutos].some(Number.isNaN)) return null
      const minutosEntradaReal = erHoras * 60 + erMinutos
      const minutosTurno = teHoras * 60 + teMinutos
      return minutosEntradaReal - minutosTurno
    }

    const formatearRetrasoLabel = (minutos) => {
      if (minutos === null || typeof minutos === 'undefined') return '--'
      if (minutos === 0) return '0 min'
      return minutos > 0 ? `+${minutos} min` : `${minutos} min`
    }

    const getEstadoClass = (estado) => {
      switch (estado) {
        case 'a_tiempo':
          return 'bg-green-900/30 text-green-400 border border-green-500'
        case 'tarde':
          return 'bg-yellow-900/30 text-yellow-400 border border-yellow-500'
        case 'ausencia':
          return 'bg-red-900/30 text-red-400 border border-red-500'
        default:
          return 'bg-gray-900/30 text-gray-400 border border-gray-500'
      }
    }

    const getEstadoNombre = (estado) => {
      switch (estado) {
        case 'a_tiempo':
          return 'A tiempo'
        case 'tarde':
          return 'Tarde'
        case 'ausencia':
          return 'Ausencia'
        default:
          return 'Desconocido'
      }
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

    // Lifecycle
    onMounted(async () => {
      await cargarEmpleados()
      await cargarHistorial()
    })

    return {
      asistencia,
      empleados,
      filtroEmpleado,
      filtroEstado,
      filtroFechaDesde,
      filtroFechaHasta,
      paginaActual,
      asistenciaFiltrada,
      puntualidadCalculada,
      promedioRetrasoCalculado,
      totalPaginas,
      paginacion,
      getEmpleadoNombre,
      formatearFecha,
      getEstadoClass,
      getEstadoNombre,
      paginaAnterior,
      paginaSiguiente
    }
  }
}
</script> 

<style scoped>
.date-input::-webkit-calendar-picker-indicator {
  opacity: 1;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23ffffff' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2'/%3E%3Cline x1='8' y1='2.5' x2='8' y2='6.5'/%3E%3Cline x1='16' y1='2.5' x2='16' y2='6.5'/%3E%3Cline x1='3' y1='10' x2='21' y2='10'/%3E%3C/svg%3E");
  background-position: center;
  background-repeat: no-repeat;
  background-size: 1rem;
  filter: none;
}

.date-input::-moz-calendar-picker-indicator {
  filter: invert(1);
}
</style>
