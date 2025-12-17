<template>
  <div class="fixed inset-0 backdrop-blur-sm bg-zinc-900/95 overflow-y-auto h-full w-full z-50">
    <div class="modal bg-zinc-900/95 relative top-10 mx-auto p-5 border border-zinc-700/50 w-full max-w-4xl shadow-2xl rounded-md">
      
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-white">{{ producto.nombre }}</h2>
          <p class="text-gray-400">{{ producto.codigo }}</p>
        </div>
        <div class="flex items-center space-x-3">
          <span
            :class="producto.activo ? 'bg-green-600' : 'bg-red-600'"
            class="px-3 py-1 text-sm font-medium text-white rounded-full"
          >
            {{ producto.activo ? 'Activo' : 'Inactivo' }}
          </span>
          <button
            @click="$emit('cerrar')"
            class="text-gray-400 hover:text-white"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Información básica -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="bg-zinc-900/50 border border-zinc-700/50 rounded-lg p-4">
          <h3 class="text-lg font-medium text-white mb-4">Información General</h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-300">Categoría:</span>
              <span class="text-white">{{ producto.categoria?.nombre || 'Sin categoría' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-300">Fecha de Creación:</span>
              <span class="text-white">{{ formatDate(producto.fecha_creacion) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-300">Ventas Registradas:</span>
              <span class="text-white">{{ producto.ventas_registradas || 0 }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-300">Última Venta:</span>
              <span class="text-white">{{ formatDate(producto.ultima_venta) || 'Sin ventas' }}</span>
            </div>
          </div>
        </div>

        <div class="bg-zinc-900/50 border border-zinc-700/50 rounded-lg p-4">
          <h3 class="text-lg font-medium text-white mb-4">Información Económica</h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-300">Precio de Venta:</span>
              <span class="text-yellow-400 font-bold">₡{{ producto.precio_venta }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-300">Costo Total:</span>
              <span class="text-white">₡{{ producto.costo_total }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-300">Ganancia Unitaria:</span>
              <span class="text-green-400 font-bold">₡{{ (producto.precio_venta - producto.costo_total).toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-300">Margen de Ganancia:</span>
              <span class="text-green-400 font-bold">{{ producto.margen_ganancia }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Descripción -->
      <div class="bg-zinc-900/50 border border-zinc-700/50 rounded-lg p-4 mb-6">
        <h3 class="text-lg font-medium text-white mb-3">Descripción</h3>
        <p class="text-gray-300">{{ producto.descripcion }}</p>
      </div>

      <!-- Recetas incluidas -->
      <div class="bg-zinc-900/50 border border-zinc-700/50 rounded-lg p-4 mb-6">
        <h3 class="text-lg font-medium text-white mb-4">Recetas Incluidas</h3>
        <div class="space-y-3">
          <div
            v-for="receta in producto.recetas"
            :key="receta.receta?.id || receta.receta_id"
            class="flex items-center justify-between p-3 border border-zinc-700/50 rounded-lg bg-zinc-900/30"
          >
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <span class="text-white font-medium">{{ receta.receta?.nombre || 'Receta sin nombre' }}</span>
                <span class="text-gray-400 text-sm">₡{{ ((receta.receta?.costo_total || 0) / (receta.receta?.rendimiento || 1)).toFixed(2) }}/unidad</span>
              </div>
              <div class="flex items-center justify-between mt-2">
                <span class="text-sm text-gray-300">Cantidad: {{ receta.cantidad || 1 }} unidades</span>
                <span class="text-sm text-yellow-400">Subtotal: ₡{{ (((receta.receta?.costo_total || 0) / (receta.receta?.rendimiento || 1)) * (receta.cantidad || 1)).toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Historial de ventas -->
      <div class="bg-zinc-900/50 border border-zinc-700/50 rounded-lg p-4 mb-6">
        <h3 class="text-lg font-medium text-white mb-4">Historial de Ventas</h3>
        <div v-if="historialVentas.length > 0" class="space-y-2">
          <div
            v-for="venta in historialVentas"
            :key="`${venta.fecha}-${venta.cantidad}`"
            class="flex items-center justify-between p-2 border border-zinc-700/50 rounded"
          >
            <span class="text-white">{{ venta.fecha }}</span>
            <span class="text-gray-300">{{ venta.cantidad }} unidades</span>
            <span class="text-yellow-400">₡{{ venta.total }}</span>
          </div>
        </div>
        <div v-else class="text-center py-4">
          <p class="text-gray-400">No hay historial de ventas disponible</p>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="flex justify-end space-x-3">
        <button
          @click="$emit('cerrar')"
          class="px-4 py-2 text-sm font-medium text-white bg-zinc-700/50 rounded-lg hover:bg-zinc-600/50 transition-colors"
        >
          Cerrar
        </button>
        <button
          @click="$emit('editar', producto)"
          class="px-4 py-2 text-sm font-medium text-black bg-yellow-400 rounded-lg hover:bg-yellow-300 transition-colors"
        >
          Editar Producto
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'ProductoDetail',
  props: {
    producto: {
      type: Object,
      required: true
    }
  },
  emits: ['cerrar', 'editar'],
  setup(props) {
    const formatDate = (dateString) => {
      if (!dateString) return null
      const date = new Date(dateString)
      return date.toLocaleDateString('es-CR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    }

    const historialVentas = computed(() => {
      // Por ahora retornamos un array vacío hasta que se implemente el historial real
      return []
    })

    return {
      historialVentas,
      formatDate
    }
  }
}
</script>

<style scoped>
/* Estilos para botones */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid rgb(63 63 70 / 0.5);
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  transition: all 150ms;
  background-color: rgb(24 24 27 / 0.5);
  color: white;
}

.btn:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.btn:hover {
  background-color: rgb(24 24 27 / 0.7);
}

/* Transiciones suaves */
* {
  transition: background-color 150ms ease, border-color 150ms ease, color 150ms ease;
}
</style>