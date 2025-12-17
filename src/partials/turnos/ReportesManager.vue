<template>
  <div class="space-y-6">
    <!-- Tipos de Reportes -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="reporte in tiposReportes"
        :key="reporte.id"
        class="bg-zinc-900/50 rounded-lg border border-zinc-700/50 p-6 hover:border-violet-500 transition-colors cursor-pointer"
        @click="seleccionarReporte(reporte)"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-lg flex items-center justify-center" :class="reporte.color">
            <component :is="reporte.icono" class="w-6 h-6 text-white" />
          </div>
          <div class="text-right">
            <div class="text-sm text-gray-400">{{ reporte.frecuencia }}</div>
            <div class="text-xs text-gray-500">{{ reporte.formato }}</div>
          </div>
        </div>
        
        <h3 class="text-lg font-semibold text-gray-100 mb-2">{{ reporte.nombre }}</h3>
        <p class="text-sm text-gray-400 mb-4">{{ reporte.descripcion }}</p>
        
        <div class="flex space-x-2">
          <button
            @click.stop="generarReporte(reporte, 'pdf')"
            class="flex-1 px-3 py-2 bg-zinc-900/50 text-white text-sm rounded-lg hover:bg-zinc-800 transition-colors border border-zinc-700/50"
          >
            PDF
          </button>
          <button
            @click.stop="generarReporte(reporte, 'excel')"
            class="flex-1 px-3 py-2 bg-zinc-900/50 text-white text-sm rounded-lg hover:bg-zinc-800 transition-colors border border-zinc-700/50"
          >
            Excel
          </button>
        </div>
      </div>
    </div>

    <!-- Configuración de Reporte -->
    <div v-if="reporteSeleccionado" class="bg-zinc-900/50 rounded-lg border border-zinc-700/50 p-6">
      <h3 class="text-lg font-semibold text-gray-100 mb-4">
        Configuración: {{ reporteSeleccionado.nombre }}
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Filtros de Fecha -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Período</label>
          <select
            v-model="configuracion.periodo"
            class="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700/50 rounded-lg text-gray-100 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
          >
            <option value="semana">Esta semana</option>
            <option value="mes">Este mes</option>
            <option value="trimestre">Este trimestre</option>
            <option value="personalizado">Personalizado</option>
          </select>
        </div>
        
        <div v-if="configuracion.periodo === 'personalizado'">
          <label class="block text-sm font-medium text-gray-300 mb-2">Fecha desde</label>
          <input
            v-model="configuracion.fechaDesde"
            type="date"
            class="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700/50 rounded-lg text-gray-100 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
          />
        </div>

        <div v-if="configuracion.periodo === 'personalizado'">
          <label class="block text-sm font-medium text-gray-300 mb-2">Fecha hasta</label>
          <input
            v-model="configuracion.fechaHasta"
            type="date"
            class="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700/50 rounded-lg text-gray-100 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Empleados</label>
          <select
            v-model="configuracion.empleados"
            class="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700/50 rounded-lg text-gray-100 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
          >
            <option value="todos">Todos los empleados</option>
            <option value="activos">Solo activos</option>
            <option value="seleccionados">Seleccionar específicos</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Área</label>
          <select
            v-model="configuracion.area"
            class="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700/50 rounded-lg text-gray-100 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
          >
            <option value="todas">Todas las áreas</option>
            <option value="cocina">Cocina</option>
            <option value="servicio">Servicio</option>
            <option value="caja">Caja</option>
            <option value="limpieza">Limpieza</option>
          </select>
        </div>
      </div>
      
      <!-- Opciones adicionales -->
      <div class="mt-6">
        <h4 class="text-md font-medium text-gray-200 mb-3">Opciones adicionales</h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label class="flex items-center">
            <input
              v-model="configuracion.incluirGraficos"
              type="checkbox"
              class="mr-2 w-4 h-4 text-violet-500 bg-black border-zinc-700/50 rounded focus:ring-violet-500 focus:ring-2"
            />
            <span class="text-sm text-gray-300">Incluir gráficos</span>
          </label>

          <label class="flex items-center">
            <input
              v-model="configuracion.incluirMetricas"
              type="checkbox"
              class="mr-2 w-4 h-4 text-violet-500 bg-black border-zinc-700/50 rounded focus:ring-violet-500 focus:ring-2"
            />
            <span class="text-sm text-gray-300">Incluir métricas</span>
          </label>

          <label class="flex items-center">
            <input
              v-model="configuracion.incluirDetalles"
              type="checkbox"
              class="mr-2 w-4 h-4 text-violet-500 bg-black border-zinc-700/50 rounded focus:ring-violet-500 focus:ring-2"
            />
            <span class="text-sm text-gray-300">Incluir detalles</span>
          </label>
        </div>
      </div>
      
      <!-- Botones de acción -->
      <div class="flex justify-end space-x-4 mt-6">
        <button
          @click="cancelarConfiguracion"
          class="px-4 py-2 bg-zinc-900/50 text-gray-300 rounded-lg hover:bg-zinc-800 transition-colors border border-zinc-700/50"
        >
          Cancelar
        </button>
        <button
          @click="generarReporte(reporteSeleccionado, 'pdf')"
          class="px-6 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors border border-violet-500"
        >
          Generar PDF
        </button>
        <button
          @click="generarReporte(reporteSeleccionado, 'excel')"
          class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors border border-green-600"
        >
          Generar Excel
        </button>
      </div>
    </div>

    <!-- Reportes Recientes -->
    <div class="bg-zinc-900/50 rounded-lg border border-zinc-700/50 p-6">
      <h3 class="text-lg font-semibold text-gray-100 mb-4">Reportes Recientes</h3>

      <div class="space-y-3">
        <div
          v-for="reporte in reportesRecientes"
          :key="reporte.id"
          class="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg border border-zinc-700/50"
        >
          <div class="flex items-center space-x-4">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="reporte.color">
              <component :is="reporte.icono" class="w-5 h-5 text-white" />
            </div>
            <div>
              <div class="font-medium text-gray-200">{{ reporte.nombre }}</div>
              <div class="text-sm text-gray-400">{{ reporte.fecha }} - {{ reporte.formato }}</div>
            </div>
          </div>
          
          <div class="flex space-x-2">
            <button
              @click="descargarReporte(reporte)"
              class="px-3 py-1 bg-violet-500 text-white text-sm rounded-lg hover:bg-violet-600 transition-colors"
            >
              Descargar
            </button>
            <button
              @click="eliminarReporte(reporte)"
              class="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors border border-red-600"
            >
              Eliminar
            </button>
          </div>
        </div>
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
import { ref, computed } from 'vue'

export default {
  name: 'ReportesManager',
  setup() {
    const reporteSeleccionado = ref(null)
    const configuracion = ref({
      periodo: 'semana',
      fechaDesde: '',
      fechaHasta: '',
      empleados: 'todos',
      area: 'todas',
      incluirGraficos: true,
      incluirMetricas: true,
      incluirDetalles: false
    })
    const mensaje = ref('')
    const mensajeTipo = ref('')

    // Datos mock
    const tiposReportes = ref([
      {
        id: 1,
        nombre: 'Reporte de Asistencia',
        descripcion: 'Resumen detallado de entrada, salida y puntualidad de empleados',
        frecuencia: 'Diario',
        formato: 'PDF, Excel',
        color: 'bg-blue-600',
        icono: 'ClockIcon'
      },
      {
        id: 2,
        nombre: 'Reporte de Turnos',
        descripcion: 'Programación y cobertura de turnos por área y período',
        frecuencia: 'Semanal',
        formato: 'PDF, Excel',
        color: 'bg-green-600',
        icono: 'CalendarIcon'
      },
      {
        id: 3,
        nombre: 'Reporte de Productividad',
        descripcion: 'Métricas de rendimiento y horas trabajadas por empleado',
        frecuencia: 'Mensual',
        formato: 'PDF, Excel',
        color: 'bg-purple-600',
        icono: 'ChartBarIcon'
      }
    ])

    const reportesRecientes = ref([
      {
        id: 1,
        nombre: 'Reporte de Asistencia',
        fecha: '2025-01-27',
        formato: 'PDF',
        color: 'bg-blue-600',
        icono: 'ClockIcon'
      },
      {
        id: 2,
        nombre: 'Reporte de Turnos',
        fecha: '2025-01-26',
        formato: 'Excel',
        color: 'bg-green-600',
        icono: 'CalendarIcon'
      },
      {
        id: 3,
        nombre: 'Reporte de Productividad',
        fecha: '2025-01-25',
        formato: 'PDF',
        color: 'bg-purple-600',
        icono: 'ChartBarIcon'
      }
    ])

    // Computed properties
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
    const seleccionarReporte = (reporte) => {
      reporteSeleccionado.value = reporte
      // Resetear configuración
      configuracion.value = {
        periodo: 'semana',
        fechaDesde: '',
        fechaHasta: '',
        empleados: 'todos',
        area: 'todas',
        incluirGraficos: true,
        incluirMetricas: true,
        incluirDetalles: false
      }
    }

    const cancelarConfiguracion = () => {
      reporteSeleccionado.value = null
    }

    const generarReporte = (reporte, formato) => {
      // Simular generación de reporte
      console.log('Generando reporte:', reporte.nombre, formato, configuracion.value)
      
      // Simular delay de procesamiento
      setTimeout(() => {
        const nuevoReporte = {
          id: Date.now(),
          nombre: reporte.nombre,
          fecha: new Date().toISOString().split('T')[0],
          formato: formato.toUpperCase(),
          color: reporte.color,
          icono: reporte.icono
        }
        
        reportesRecientes.value.unshift(nuevoReporte)
        mostrarMensaje(`Reporte ${reporte.nombre} generado en ${formato.toUpperCase()}`, 'success')
        reporteSeleccionado.value = null
      }, 2000)
    }

    const descargarReporte = (reporte) => {
      // Simular descarga
      console.log('Descargando reporte:', reporte)
      mostrarMensaje(`Descargando ${reporte.nombre}`, 'success')
    }

    const eliminarReporte = (reporte) => {
      // Simular eliminación
      const index = reportesRecientes.value.findIndex(r => r.id === reporte.id)
      if (index > -1) {
        reportesRecientes.value.splice(index, 1)
        mostrarMensaje('Reporte eliminado', 'success')
      }
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
      reporteSeleccionado,
      configuracion,
      mensaje,
      mensajeTipo,
      tiposReportes,
      reportesRecientes,
      mensajeClass,
      seleccionarReporte,
      cancelarConfiguracion,
      generarReporte,
      descargarReporte,
      eliminarReporte
    }
  }
}
</script> 