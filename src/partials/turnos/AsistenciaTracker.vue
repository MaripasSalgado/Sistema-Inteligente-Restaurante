<template>
  <div class="bg-zinc-900/50 rounded-lg border border-zinc-700/50 p-6">
    <h3 class="text-lg font-semibold text-gray-100 mb-6">Registro de Asistencia</h3>
    
    <!-- Selector de Empleado -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-300 mb-2">
        Seleccionar Empleado
      </label>
      <select
        v-model="empleadoSeleccionado"
        class="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700/50 rounded-lg text-gray-100 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
      >
        <option value="">Seleccionar empleado...</option>
        <option 
          v-for="empleado in empleadosActivos" 
          :key="empleado.id" 
          :value="empleado.id"
        >
          {{ empleado.nombre }} - {{ empleado.puesto }}
        </option>
      </select>
    </div>

    <!-- Información del Turno Actual -->
    <div v-if="turnoActual" class="mb-6 p-4 bg-zinc-900/50 rounded-lg border border-zinc-700/50">
      <h4 class="text-md font-medium text-gray-200 mb-3">Turno Actual</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <span class="text-gray-400">Horario:</span>
          <span class="text-gray-200 ml-2">{{ turnoActual.horaInicio }} - {{ turnoActual.horaFin }}</span>
        </div>
        <div>
          <span class="text-gray-400">Área:</span>
          <span class="text-gray-200 ml-2">{{ turnoActual.area }}</span>
        </div>
        <div>
          <span class="text-gray-400">Posición:</span>
          <span class="text-gray-200 ml-2">{{ turnoActual.posicion }}</span>
        </div>
      </div>
    </div>

    <!-- Reloj y Botones de Marcaje -->
    <div class="text-center mb-6">
      <div class="text-4xl font-mono text-gray-100 mb-4">
        {{ horaActual }}
      </div>
      
      <div class="flex justify-center space-x-4">
        <button
          @click="marcarEntrada"
          :disabled="!empleadoSeleccionado || entradaMarcada || cargando"
          class="px-6 py-3 bg-violet-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-violet-600 border border-violet-500"
        >
          <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ cargando ? 'Procesando...' : 'Marcar Entrada' }}
        </button>

        <button
          @click="marcarSalida"
          :disabled="!empleadoSeleccionado || !entradaMarcada || salidaMarcada || cargando"
          class="px-6 py-3 bg-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 border border-red-600"
        >
          <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {{ cargando ? 'Procesando...' : 'Marcar Salida' }}
        </button>
      </div>
    </div>

    <!-- Estado del Marcaje -->
    <div v-if="empleadoSeleccionado && turnoActual" class="mb-6">
      <div class="grid grid-cols-3 gap-4 text-center">
        <div class="p-3 rounded-lg" :class="entradaMarcada ? 'bg-amber-900/30 border border-amber-500' : 'bg-zinc-900/50 border border-zinc-700/50'">
          <div class="text-sm text-gray-400 mb-1">Entrada</div>
          <div class="text-lg font-medium" :class="entradaMarcada ? 'text-amber-300' : 'text-gray-500'">
            {{ entradaMarcada ? horaEntrada : '--:--' }}
          </div>
        </div>
        
        <div class="p-3 rounded-lg" :class="salidaMarcada ? 'bg-pink-900/30 border border-pink-500' : 'bg-zinc-900/50 border border-zinc-700/50'">
          <div class="text-sm text-gray-400 mb-1">Salida</div>
          <div class="text-lg font-medium" :class="salidaMarcada ? 'text-pink-300' : 'text-gray-500'">
            {{ salidaMarcada ? horaSalida : '--:--' }}
          </div>
        </div>

        <div class="p-3 rounded-lg bg-zinc-900/50 border border-zinc-700/50">
          <div class="text-sm text-gray-400 mb-1">Estado</div>
          <div class="text-lg font-medium" :class="getEstadoMarcajeClass()">
            {{ getEstadoMarcajeTexto() }}
          </div>
        </div>
      </div>
    </div>

    <!-- Mensajes de Confirmación -->
    <div v-if="mensaje" class="p-4 rounded-lg mb-4" :class="mensajeClass">
      <div class="flex items-center">
        <svg v-if="mensajeTipo === 'success'" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg v-else-if="mensajeTipo === 'error'" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ mensaje }}</span>
      </div>
    </div>

    <!-- Botón de Reinicio -->
    <div class="text-center">
      <button
        @click="reiniciarMarcaje"
        class="px-4 py-2 bg-zinc-900/50 text-gray-300 rounded-lg hover:bg-zinc-800 transition-colors border border-zinc-700/50"
      >
        Reiniciar Marcaje
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { AsistenciaService } from '../../services/asistenciaService.js'
import { TurnoService } from '../../services/turnoService.js'
import { supabase } from '../../config/supabase.js'

export default {
  name: 'AsistenciaTracker',
  setup() {
    const empleadoSeleccionado = ref('')
    const horaActual = ref('')
    const entradaMarcada = ref(false)
    const salidaMarcada = ref(false)
    const horaEntrada = ref('')
    const horaSalida = ref('')
    const mensaje = ref('')
    const mensajeTipo = ref('')
    const empleados = ref([])
    const turnoActual = ref(null)
    const asistenciaActual = ref(null)
    const cargando = ref(false)
    let relojInterval = null

    // Cargar empleados activos desde la BD
    const cargarEmpleados = async () => {
      const { data, error } = await supabase
        .from('usuarios')
        .select('id, nombre, apellido, puesto, departamento, estado')
        .eq('estado', 'Activo')
        .order('nombre', { ascending: true })

      if (!error && data) {
        empleados.value = data.map(emp => ({
          id: emp.id,
          nombre: `${emp.nombre} ${emp.apellido}`,
          puesto: emp.puesto,
          departamento: emp.departamento,
          activo: emp.estado === 'Activo'
        }))
      }
    }

    // Cargar turno del empleado seleccionado
    const cargarTurnoEmpleado = async (usuarioId) => {
      if (!usuarioId) {
        turnoActual.value = null
        return
      }

      cargando.value = true
      const hoy = new Date().toISOString().split('T')[0]

      const resultado = await TurnoService.getAllTurnos({
        usuarioId,
        fechaInicio: hoy,
        fechaFin: hoy
      })

      if (resultado.success && resultado.data.length > 0) {
        const turno = resultado.data[0]
        turnoActual.value = {
          id: turno.id,
          horaInicio: turno.hora_inicio,
          horaFin: turno.hora_fin,
          area: turno.area,
          posicion: turno.posicion || turno.usuario?.puesto,
          estado: turno.estado
        }
      } else {
        turnoActual.value = null
      }

      cargando.value = false
    }

    // Verificar si ya marcó asistencia hoy
    const verificarAsistenciaHoy = async (usuarioId) => {
      if (!usuarioId) return

      const resultado = await AsistenciaService.getAsistenciaDelDia(usuarioId)

      if (resultado.success && resultado.data) {
        asistenciaActual.value = resultado.data
        entradaMarcada.value = !!resultado.data.entrada_real
        salidaMarcada.value = !!resultado.data.salida_real
        horaEntrada.value = resultado.data.entrada_real || ''
        horaSalida.value = resultado.data.salida_real || ''
      } else {
        asistenciaActual.value = null
        entradaMarcada.value = false
        salidaMarcada.value = false
        horaEntrada.value = ''
        horaSalida.value = ''
      }
    }

    // Watch para cuando cambie el empleado seleccionado
    watch(empleadoSeleccionado, async (nuevoId) => {
      if (nuevoId) {
        await cargarTurnoEmpleado(nuevoId)
        await verificarAsistenciaHoy(nuevoId)
      } else {
        turnoActual.value = null
        asistenciaActual.value = null
        entradaMarcada.value = false
        salidaMarcada.value = false
        horaEntrada.value = ''
        horaSalida.value = ''
      }
    })

    // Computed properties
    const empleadosActivos = computed(() => {
      return empleados.value.filter(emp => emp.activo)
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
    const actualizarHora = () => {
      const ahora = new Date()
      horaActual.value = ahora.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      })
    }

    const marcarEntrada = async () => {
      if (!empleadoSeleccionado.value) {
        mostrarMensaje('Selecciona un empleado primero', 'error')
        return
      }

      if (entradaMarcada.value) {
        mostrarMensaje('Ya has marcado entrada hoy', 'error')
        return
      }

      cargando.value = true

      const resultado = await AsistenciaService.marcarEntrada({
        usuario_id: empleadoSeleccionado.value,
        turno_id: turnoActual.value?.id || null, // Permitir null si no hay turno
        dispositivo: 'Web App',
        ip_marcaje: null
      })

      if (resultado.success) {
        asistenciaActual.value = resultado.data
        entradaMarcada.value = true
        horaEntrada.value = resultado.data.entrada_real

        const minutosRetraso = resultado.data.minutos_retraso || 0

        if (minutosRetraso <= 5) {
          mostrarMensaje('Entrada registrada a tiempo ✓', 'success')
        } else {
          mostrarMensaje(`Entrada registrada con ${minutosRetraso} min de retraso`, 'warning')
        }
      } else {
        mostrarMensaje(resultado.error || 'Error al marcar entrada', 'error')
      }

      cargando.value = false
    }

    const marcarSalida = async () => {
      if (!entradaMarcada.value) {
        mostrarMensaje('Debes marcar entrada antes de salida', 'error')
        return
      }

      if (salidaMarcada.value) {
        mostrarMensaje('Ya has marcado salida hoy', 'error')
        return
      }

      cargando.value = true

      const resultado = await AsistenciaService.marcarSalida(empleadoSeleccionado.value)

      if (resultado.success) {
        asistenciaActual.value = resultado.data
        salidaMarcada.value = true
        horaSalida.value = resultado.data.salida_real

        const minutosExtra = resultado.data.minutos_extra || 0
        if (minutosExtra > 0) {
          mostrarMensaje(`Salida registrada. ${minutosExtra} min extra trabajados`, 'success')
        } else {
          mostrarMensaje('Salida registrada correctamente ✓', 'success')
        }
      } else {
        mostrarMensaje(resultado.error || 'Error al marcar salida', 'error')
      }

      cargando.value = false
    }

    const reiniciarMarcaje = () => {
      empleadoSeleccionado.value = ''
      entradaMarcada.value = false
      salidaMarcada.value = false
      horaEntrada.value = ''
      horaSalida.value = ''
      mensaje.value = ''
    }

    const mostrarMensaje = (texto, tipo = 'info') => {
      mensaje.value = texto
      mensajeTipo.value = tipo
      
      setTimeout(() => {
        mensaje.value = ''
        mensajeTipo.value = ''
      }, 5000)
    }

    const getEstadoMarcajeClass = () => {
      if (!entradaMarcada.value) return 'text-gray-500'
      if (!salidaMarcada.value) return 'text-amber-300'
      return 'text-violet-300'
    }

    const getEstadoMarcajeTexto = () => {
      if (!entradaMarcada.value) return 'Sin marcar'
      if (!salidaMarcada.value) return 'Trabajando'
      return 'Completado'
    }

    // Lifecycle
    onMounted(async () => {
      actualizarHora()
      relojInterval = setInterval(actualizarHora, 1000)
      await cargarEmpleados()
    })

    onUnmounted(() => {
      if (relojInterval) {
        clearInterval(relojInterval)
      }
    })

    return {
      empleadoSeleccionado,
      horaActual,
      entradaMarcada,
      salidaMarcada,
      horaEntrada,
      horaSalida,
      mensaje,
      mensajeTipo,
      empleadosActivos,
      turnoActual,
      mensajeClass,
      marcarEntrada,
      marcarSalida,
      reiniciarMarcaje,
      getEstadoMarcajeClass,
      getEstadoMarcajeTexto
    }
  }
}
</script> 
