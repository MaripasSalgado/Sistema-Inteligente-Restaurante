<template>
  <div v-if="show">
    <!-- Overlay -->
    <div class="fixed inset-0 z-50 backdrop-blur-sm bg-black/50 transition-opacity"></div>

    <!-- Modal -->
    <div class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="relative bg-zinc-900/95 border border-zinc-700/50 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-zinc-900/95 border-b border-zinc-700/50 px-6 py-4 flex items-center justify-between rounded-t-xl">
        <h2 class="text-xl font-bold text-white">Detalles del Proveedor</h2>
        <button @click="$emit('cerrar')" class="text-gray-400 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div v-if="proveedor" class="p-6 space-y-6">
        <!-- Información Básica -->
        <div class="bg-zinc-900/50 rounded-lg p-4 border border-zinc-700/50">
          <h3 class="text-lg font-semibold text-white mb-4">Información Básica</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-400">Código</p>
              <p class="text-white font-medium">{{ proveedor.codigo }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-400">Nombre</p>
              <p class="text-white font-medium">{{ proveedor.nombre }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-400">Tipo</p>
              <p class="text-white font-medium">{{ proveedor.tipo }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-400">Estado</p>
              <span 
                class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
                :class="proveedor.estado === 'Activo' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'"
              >
                {{ proveedor.estado }}
              </span>
            </div>
          </div>
        </div>

        <!-- Información de Contacto -->
        <div class="bg-zinc-900/50 rounded-lg p-4 border border-zinc-700/50">
          <h3 class="text-lg font-semibold text-white mb-4">Contacto</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-400">Teléfono</p>
              <p class="text-white font-medium">{{ proveedor.telefono }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-400">Email</p>
              <p class="text-white font-medium">{{ proveedor.email }}</p>
            </div>
            <div class="md:col-span-2">
              <p class="text-sm text-gray-400">Dirección</p>
              <p class="text-white font-medium">{{ proveedor.direccion }}</p>
            </div>
            <div v-if="proveedor.contacto_principal">
              <p class="text-sm text-gray-400">Contacto Principal</p>
              <p class="text-white font-medium">{{ proveedor.contacto_principal }}</p>
            </div>
            <div v-if="proveedor.rtn">
              <p class="text-sm text-gray-400">RTN</p>
              <p class="text-white font-medium">{{ proveedor.rtn }}</p>
            </div>
          </div>
        </div>

        <!-- Estadísticas -->
        <div class="bg-zinc-900/50 rounded-lg p-4 border border-zinc-700/50">
          <h3 class="text-lg font-semibold text-white mb-4">Estadísticas</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p class="text-sm text-gray-400">Calificación Promedio</p>
              <div class="flex items-center space-x-2 mt-1">
                <div class="flex text-yellow-400">
                  <svg 
                    v-for="i in 5" 
                    :key="i"
                    class="w-4 h-4"
                    :class="i <= Math.round(proveedor.calificacion_promedio || 0) ? 'fill-current' : 'fill-gray-600'"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span class="text-white font-medium">{{ (proveedor.calificacion_promedio || 0).toFixed(1) }}</span>
              </div>
            </div>
            <div>
              <p class="text-sm text-gray-400">Total Compras</p>
              <p class="text-white font-medium">₡{{ formatearMonto(proveedor.total_compras || 0) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-400">Última Compra</p>
              <p class="text-white font-medium">{{ formatearFecha(proveedor.ultima_compra) }}</p>
            </div>
          </div>
        </div>

        <!-- Observaciones -->
        <div v-if="proveedor.observaciones" class="bg-zinc-900/50 rounded-lg p-4 border border-zinc-700/50">
          <h3 class="text-lg font-semibold text-white mb-2">Observaciones</h3>
          <p class="text-gray-300">{{ proveedor.observaciones }}</p>
        </div>

        <!-- Evaluaciones -->
        <div v-if="evaluaciones.length > 0" class="bg-zinc-900/50 rounded-lg p-4 border border-zinc-700/50">
          <h3 class="text-lg font-semibold text-white mb-4">Evaluaciones Recientes</h3>
          <div class="space-y-3">
            <div 
              v-for="evaluacion in evaluaciones.slice(0, 5)" 
              :key="evaluacion.id"
              class="p-3 bg-zinc-900/60 rounded-lg border border-zinc-700/50"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-gray-400">{{ formatearFecha(evaluacion.fecha_evaluacion) }}</span>
                <div class="flex text-yellow-400">
                  <svg 
                    v-for="i in 5" 
                    :key="i"
                    class="w-3 h-3"
                    :class="i <= evaluacion.calificacion ? 'fill-current' : 'fill-gray-600'"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
              <p v-if="evaluacion.comentarios" class="text-sm text-gray-300">{{ evaluacion.comentarios }}</p>
              <p v-if="evaluacion.usuario" class="text-xs text-gray-500 mt-1">Por: {{ evaluacion.usuario.nombre }} {{ evaluacion.usuario.apellido }}</p>
            </div>
          </div>
        </div>

        <!-- Fechas del Sistema -->
        <div class="bg-zinc-900/50 rounded-lg p-4 border border-zinc-700/50">
          <h3 class="text-lg font-semibold text-white mb-4">Información del Sistema</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p class="text-gray-400">Fecha de Creación</p>
              <p class="text-white">{{ formatearFechaCompleta(proveedor.fecha_creacion) }}</p>
            </div>
            <div>
              <p class="text-gray-400">Última Modificación</p>
              <p class="text-white">{{ formatearFechaCompleta(proveedor.fecha_modificacion) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="sticky bottom-0 bg-zinc-900/95 border-t border-zinc-700/50 px-6 py-4 flex justify-end space-x-3 rounded-b-xl">
        <button
          @click="$emit('cerrar')"
          class="px-4 py-2 border border-zinc-600 rounded-lg text-gray-300 hover:bg-zinc-900/70 transition-colors"
        >
          Cerrar
        </button>
        <button
          @click="$emit('editar', proveedor)"
          class="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors"
        >
          Editar
        </button>
      </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import proveedorService from '../../services/proveedorService'

export default {
  name: 'ProveedorDetailModal',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    proveedorId: {
      type: String,
      default: null
    }
  },
  emits: ['cerrar', 'editar'],
  setup(props) {
    const proveedor = ref(null)
    const evaluaciones = ref([])
    const cargando = ref(false)

    const cargarDetalles = async () => {
      if (!props.proveedorId) return

      try {
        cargando.value = true
        proveedor.value = await proveedorService.obtenerProveedorPorId(props.proveedorId)
        evaluaciones.value = proveedor.value.evaluaciones || []
      } catch (error) {
        console.error('Error al cargar detalles:', error)
      } finally {
        cargando.value = false
      }
    }

    watch(() => props.show, (newVal) => {
      if (newVal && props.proveedorId) {
        cargarDetalles()
      }
    })

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

    const formatearFechaCompleta = (fecha) => {
      if (!fecha) return 'N/A'
      try {
        return new Date(fecha).toLocaleString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      } catch (error) {
        return 'N/A'
      }
    }

    const formatearMonto = (monto) => {
      return new Intl.NumberFormat('es-CR').format(monto)
    }

    return {
      proveedor,
      evaluaciones,
      cargando,
      formatearFecha,
      formatearFechaCompleta,
      formatearMonto
    }
  }
}
</script>

