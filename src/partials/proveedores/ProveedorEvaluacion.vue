<template>
  <div class="space-y-6">
    <!-- Ranking de Proveedores -->
    <div class="bg-zinc-900/80 border border-zinc-700/50 shadow-xs rounded-xl">
      <header class="px-5 py-4 border-b border-[#CCCCCC]">
        <h2 class="font-semibold text-gray-100">Ranking de Proveedores</h2>
      </header>
      <div class="p-5">
        <div class="space-y-4">
          <div 
            v-for="(proveedor, index) in proveedoresOrdenados" 
            :key="proveedor.id"
            class="flex items-center justify-between p-4 bg-zinc-800/60 rounded-lg border border-zinc-700/50"
          >
            <div class="flex items-center space-x-4">
              <div class="flex items-center justify-center w-8 h-8 rounded-full bg-violet-500 text-white font-bold text-sm">
                {{ index + 1 }}
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-100">{{ proveedor.nombre }}</h3>
                <p class="text-xs text-gray-400">{{ proveedor.tipo }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <div class="flex text-yellow-400">
                <svg
                  v-for="i in 5"
                  :key="i"
                  class="w-4 h-4"
                  :class="i <= Math.round(parseFloat(proveedor.calificacion_promedio) || 0) ? 'fill-current' : 'fill-gray-600'"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span class="text-sm font-medium text-gray-100">{{ (parseFloat(proveedor.calificacion_promedio) || 0).toFixed(1) }}</span>
              <button
                @click="evaluarProveedor(proveedor)"
                class="px-3 py-1 bg-violet-500 text-white text-xs rounded hover:bg-violet-600"
              >
                Evaluar
              </button>
            </div>
          </div>
        </div>
             </div>
     </div>

    <!-- Historial Completo de Evaluaciones -->
    <div class="bg-zinc-900/80 border border-zinc-700/50 shadow-xs rounded-xl">
      <header class="px-5 py-4 border-b border-[#CCCCCC] flex items-center justify-between">
        <h2 class="font-semibold text-gray-100">Historial Completo de Evaluaciones</h2>
        <span class="text-sm text-gray-400">{{ todasEvaluaciones.length }} evaluaciones</span>
      </header>
      <div class="p-5">
        <div v-if="todasEvaluaciones.length === 0" class="text-center py-8 text-gray-400">
          No hay evaluaciones registradas
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-left text-xs text-gray-400 uppercase border-b border-zinc-700/50">
                <th class="pb-3 font-medium">Fecha</th>
                <th class="pb-3 font-medium">Proveedor</th>
                <th class="pb-3 font-medium">Calificación</th>
                <th class="pb-3 font-medium">Calidad</th>
                <th class="pb-3 font-medium">Servicio</th>
                <th class="pb-3 font-medium">Puntualidad</th>
                <th class="pb-3 font-medium">Comentarios</th>
              </tr>
            </thead>
            <tbody class="text-sm">
              <tr
                v-for="evaluacion in evaluacionesPaginadas"
                :key="evaluacion.id"
                class="border-b border-zinc-700/30 hover:bg-zinc-800/40"
              >
                <td class="py-3 text-gray-300">
                  {{ formatearFecha(evaluacion.fecha_evaluacion) }}
                </td>
                <td class="py-3">
                  <div class="text-gray-100 font-medium">{{ obtenerNombreProveedor(evaluacion.proveedor_id) }}</div>
                  <div class="text-xs text-gray-400">{{ obtenerTipoProveedor(evaluacion.proveedor_id) }}</div>
                </td>
                <td class="py-3">
                  <div class="flex items-center space-x-2">
                    <div class="flex text-yellow-400">
                      <svg 
                        v-for="i in 5" 
                        :key="i"
                        class="w-3 h-3"
                        :class="i <= Math.round(evaluacion.calificacion) ? 'fill-current' : 'fill-gray-600'"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <span class="text-gray-100 font-medium">{{ evaluacion.calificacion.toFixed(1) }}</span>
                  </div>
                </td>
                <td class="py-3 text-gray-300">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-zinc-800 border border-zinc-700">
                    {{ evaluacion.criterios?.calidad || 'N/A' }}/5
                  </span>
                </td>
                <td class="py-3 text-gray-300">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-zinc-800 border border-zinc-700">
                    {{ evaluacion.criterios?.servicio || 'N/A' }}/5
                  </span>
                </td>
                <td class="py-3 text-gray-300">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-zinc-800 border border-zinc-700">
                    {{ evaluacion.criterios?.puntualidad || 'N/A' }}/5
                  </span>
                </td>
                <td class="py-3 text-gray-400 max-w-xs truncate">
                  {{ evaluacion.comentarios || '-' }}
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Paginación -->
          <div v-if="totalPaginas > 1" class="mt-4 flex items-center justify-between">
            <div class="text-sm text-gray-400">
              Mostrando {{ ((paginaActual - 1) * 10) + 1 }} - {{ Math.min(paginaActual * 10, todasEvaluaciones.length) }} de {{ todasEvaluaciones.length }} evaluaciones
            </div>
            <div class="flex space-x-2">
              <button
                @click="cambiarPagina(paginaActual - 1)"
                :disabled="paginaActual === 1"
                class="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded text-gray-300 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <div class="flex items-center space-x-1">
                <button
                  v-for="pagina in totalPaginas"
                  :key="pagina"
                  @click="cambiarPagina(pagina)"
                  class="px-3 py-1 rounded"
                  :class="pagina === paginaActual ? 'bg-violet-500 text-white' : 'bg-zinc-800 border border-zinc-700 text-gray-300 hover:bg-zinc-700'"
                >
                  {{ pagina }}
                </button>
              </div>
              <button
                @click="cambiarPagina(paginaActual + 1)"
                :disabled="paginaActual === totalPaginas"
                class="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded text-gray-300 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Estadísticas de Evaluación -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Promedio General -->
      <div class="bg-zinc-900/80 border border-zinc-700/50 shadow-xs rounded-xl p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-medium text-gray-100">Promedio General</h3>
          <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div class="text-2xl font-bold text-gray-100">{{ promedioGeneral.toFixed(1) }}</div>
        <div class="flex text-yellow-400 mt-2">
          <svg 
            v-for="i in 5" 
            :key="i"
            class="w-4 h-4"
            :class="i <= Math.round(promedioGeneral) ? 'fill-current' : 'fill-gray-600'"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      </div>

      <!-- Proveedores Activos -->
      <div class="bg-zinc-900/80 border border-zinc-700/50 shadow-xs rounded-xl p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-medium text-gray-100">Proveedores Activos</h3>
          <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="text-2xl font-bold text-gray-100">{{ proveedoresActivos }}</div>
        <div class="text-sm text-gray-400 mt-1">de {{ proveedores.length }} total</div>
      </div>

      <!-- Evaluaciones Este Mes -->
      <div class="bg-zinc-900/80 border border-zinc-700/50 shadow-xs rounded-xl p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-medium text-gray-100">Historial de Evaluaciones</h3>
          <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div class="text-2xl font-bold text-gray-100">{{ evaluacionesEsteMes }}</div>
        <div class="text-sm text-gray-400 mt-1">evaluaciones totales</div>
      </div>
    </div>

    <!-- Modal de Evaluación -->
    <div v-if="mostrarModal" class="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/50 z-50">
      <div class="bg-zinc-900/95 border border-zinc-700/50 rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-100">
              {{ evaluacion.id ? 'Editar Evaluación' : 'Evaluar Proveedor' }}
            </h3>
            <p v-if="evaluacion.id" class="text-xs text-amber-400 mt-1">
              Ya existe una evaluación este mes. Los cambios actualizarán la evaluación existente.
            </p>
          </div>
          <button @click="cerrarModal" class="text-gray-400 hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div v-if="proveedorSeleccionado" class="space-y-4">
          <div>
            <h4 class="text-sm font-medium text-gray-300 mb-2">{{ proveedorSeleccionado.nombre }}</h4>
            <p class="text-xs text-gray-400">{{ proveedorSeleccionado.tipo }}</p>
          </div>

          <!-- Puntualidad -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Puntualidad</label>
            <div class="flex space-x-1">
              <button
                v-for="i in 5"
                :key="i"
                @click="evaluacion.puntualidad = i"
                class="w-8 h-8 rounded-full border-2 flex items-center justify-center"
                :class="i <= evaluacion.puntualidad ? 'border-yellow-400 bg-yellow-400 text-black' : 'border-zinc-600 text-gray-400'"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Calidad -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Calidad</label>
            <div class="flex space-x-1">
              <button
                v-for="i in 5"
                :key="i"
                @click="evaluacion.calidad = i"
                class="w-8 h-8 rounded-full border-2 flex items-center justify-center"
                :class="i <= evaluacion.calidad ? 'border-yellow-400 bg-yellow-400 text-black' : 'border-zinc-600 text-gray-400'"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Servicio -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Servicio al Cliente</label>
            <div class="flex space-x-1">
              <button
                v-for="i in 5"
                :key="i"
                @click="evaluacion.servicio = i"
                class="w-8 h-8 rounded-full border-2 flex items-center justify-center"
                :class="i <= evaluacion.servicio ? 'border-yellow-400 bg-yellow-400 text-black' : 'border-zinc-600 text-gray-400'"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Comentario -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Comentario (opcional)</label>
            <textarea
              v-model="evaluacion.comentario"
              rows="3"
              class="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Comentarios adicionales..."
            ></textarea>
          </div>

          <!-- Botones -->
          <div class="flex justify-end space-x-3 pt-4">
            <button
              @click="cerrarModal"
              class="px-4 py-2 border border-[#CCCCCC] rounded-lg text-gray-300 hover:bg-zinc-800"
            >
              Cancelar
            </button>
            <button
              @click="guardarEvaluacion"
              :disabled="!evaluacionCompleta"
              class="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ evaluacion.id ? 'Actualizar Evaluación' : 'Guardar Evaluación' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import proveedorService from '../../services/proveedorService'

export default {
  name: 'ProveedorEvaluacion',
  props: {
    proveedores: {
      type: Array,
      required: true
    }
  },
  emits: ['evaluar'],
  setup(props, { emit }) {
    const mostrarModal = ref(false)
    const proveedorSeleccionado = ref(null)
    
    const evaluacion = reactive({
      id: null,
      puntualidad: 0,
      calidad: 0,
      servicio: 0,
      comentario: ''
    })

    // Ordenar proveedores por calificación
    const proveedoresOrdenados = computed(() => {
      return [...props.proveedores].sort((a, b) => {
        const calA = parseFloat(a.calificacion_promedio) || 0
        const calB = parseFloat(b.calificacion_promedio) || 0
        return calB - calA
      })
    })

    // Calcular promedio general
    const promedioGeneral = computed(() => {
      if (props.proveedores.length === 0) return 0
      const proveedoresConCalificacion = props.proveedores.filter(p => {
        const cal = parseFloat(p.calificacion_promedio) || 0
        return cal > 0
      })
      if (proveedoresConCalificacion.length === 0) return 0
      const suma = proveedoresConCalificacion.reduce((acc, prov) => {
        return acc + (parseFloat(prov.calificacion_promedio) || 0)
      }, 0)
      return suma / proveedoresConCalificacion.length
    })

    // Contar proveedores activos
    const proveedoresActivos = computed(() => {
      return props.proveedores.filter(prov => prov.estado === 'Activo').length
    })

    // Contar evaluaciones totales
    const evaluacionesEsteMes = ref(0)
    const todasEvaluaciones = ref([])

    // Paginación
    const paginaActual = ref(1)
    const itemsPorPagina = ref(10)

    // Evaluaciones paginadas
    const evaluacionesPaginadas = computed(() => {
      const inicio = (paginaActual.value - 1) * itemsPorPagina.value
      const fin = inicio + itemsPorPagina.value
      return todasEvaluaciones.value.slice(inicio, fin)
    })

    const totalPaginas = computed(() => {
      return Math.ceil(todasEvaluaciones.value.length / itemsPorPagina.value)
    })

    const cambiarPagina = (pagina) => {
      if (pagina >= 1 && pagina <= totalPaginas.value) {
        paginaActual.value = pagina
      }
    }

    // Cargar evaluaciones totales
    const cargarEvaluacionesDelMes = async () => {
      try {
        const conteo = await proveedorService.obtenerEvaluacionesDelMes()
        evaluacionesEsteMes.value = conteo
      } catch (error) {
        console.error('Error al cargar evaluaciones:', error)
      }
    }

    // Cargar todas las evaluaciones con detalles
    const cargarTodasEvaluaciones = async () => {
      try {
        const evaluaciones = []
        for (const proveedor of props.proveedores) {
          const evals = await proveedorService.obtenerEvaluacionesProveedor(proveedor.id)
          evaluaciones.push(...evals)
        }
        // Ordenar por fecha más reciente primero
        todasEvaluaciones.value = evaluaciones.sort((a, b) => 
          new Date(b.fecha_evaluacion) - new Date(a.fecha_evaluacion)
        )
      } catch (error) {
        console.error('Error al cargar todas las evaluaciones:', error)
      }
    }
    
    // Cargar al montar el componente
    onMounted(() => {
      cargarEvaluacionesDelMes()
      cargarTodasEvaluaciones()
    })

    // Watch para recargar cuando cambien los proveedores
    watch(() => props.proveedores, () => {
      cargarTodasEvaluaciones()
    }, { deep: true })

    // Helpers para obtener info del proveedor
    const obtenerNombreProveedor = (proveedorId) => {
      const prov = props.proveedores.find(p => p.id === proveedorId)
      return prov?.nombre || 'Desconocido'
    }

    const obtenerTipoProveedor = (proveedorId) => {
      const prov = props.proveedores.find(p => p.id === proveedorId)
      return prov?.tipo || ''
    }

    const formatearFecha = (fecha) => {
      if (!fecha) return 'N/A'
      try {
        return new Date(fecha).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      } catch (error) {
        return 'N/A'
      }
    }

    // Verificar si la evaluación está completa
    const evaluacionCompleta = computed(() => {
      return evaluacion.puntualidad > 0 && evaluacion.calidad > 0 && evaluacion.servicio > 0
    })

    const evaluarProveedor = async (proveedor) => {
      proveedorSeleccionado.value = proveedor
      
      // Buscar si ya existe una evaluación este mes para este proveedor
      const hoy = new Date()
      const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
      
      const evaluacionExistente = todasEvaluaciones.value.find(ev => 
        ev.proveedor_id === proveedor.id && 
        new Date(ev.fecha_evaluacion) >= primerDiaMes
      )
      
      if (evaluacionExistente) {
        // Modo edición: pre-llenar con valores existentes
        Object.assign(evaluacion, {
          id: evaluacionExistente.id,
          puntualidad: evaluacionExistente.criterios?.puntualidad || 0,
          calidad: evaluacionExistente.criterios?.calidad || 0,
          servicio: evaluacionExistente.criterios?.servicio || 0,
          comentario: evaluacionExistente.comentarios || ''
        })
      } else {
        // Modo creación: resetear evaluación
        Object.assign(evaluacion, {
          id: null,
          puntualidad: 0,
          calidad: 0,
          servicio: 0,
          comentario: ''
        })
      }
      
      mostrarModal.value = true
    }

    const cerrarModal = () => {
      mostrarModal.value = false
      proveedorSeleccionado.value = null
    }

    const guardarEvaluacion = async () => {
      if (!evaluacionCompleta.value) return

      // Calcular calificación promedio de esta evaluación
      const calificacionPromedio = (evaluacion.puntualidad + evaluacion.calidad + evaluacion.servicio) / 3

      const evaluacionData = {
        proveedor_id: proveedorSeleccionado.value.id,
        calificacion: calificacionPromedio,
        criterios: {
          puntualidad: evaluacion.puntualidad,
          calidad: evaluacion.calidad,
          servicio: evaluacion.servicio
        },
        comentarios: evaluacion.comentario || null
      }

      // Si tiene ID, es una edición
      if (evaluacion.id) {
        evaluacionData.id = evaluacion.id
      }

      // Emitir evento para que el padre maneje el guardado con el backend
      emit('evaluar', evaluacionData)
      cerrarModal()
    }

    // Método para refrescar todas las evaluaciones (expuesto para el padre)
    const refrescarEvaluaciones = async () => {
      await Promise.all([
        cargarEvaluacionesDelMes(),
        cargarTodasEvaluaciones()
      ])
    }

    return {
      mostrarModal,
      proveedorSeleccionado,
      evaluacion,
      proveedoresOrdenados,
      promedioGeneral,
      proveedoresActivos,
      evaluacionesEsteMes,
      todasEvaluaciones,
      evaluacionesPaginadas,
      paginaActual,
      totalPaginas,
      cambiarPagina,
      evaluacionCompleta,
      evaluarProveedor,
      cerrarModal,
      guardarEvaluacion,
      obtenerNombreProveedor,
      obtenerTipoProveedor,
      formatearFecha,
      refrescarEvaluaciones
    }
  }
}
</script> 