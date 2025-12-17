<template>
  <div class="space-y-6">
    <!-- Filtros y búsqueda -->
    <div style="background-color: rgb(24 24 27 / 0.8);" class="border border-zinc-700/50 rounded-lg shadow-sm p-4 sm:p-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Búsqueda por nombre -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Buscar</label>
          <div class="relative">
            <input
              v-model="filtros.busqueda"
              type="text"
              placeholder="Nombre del producto..."
              class="bg-zinc-900/50 w-full pl-10 pr-4 py-2 border border-zinc-700/50 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white placeholder-gray-400"
            />
            <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <!-- Filtro por categoría -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Categoría</label>
          <select
            v-model="filtros.categoria"
            class="bg-zinc-900/50 w-full px-3 py-2 border border-zinc-700/50 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white"
          >
            <option value="">Todas las categorías</option>
            <option v-for="cat in categorias" :key="cat.id" :value="cat.id">
              {{ cat.nombre }}
            </option>
          </select>
        </div>

        <!-- Filtro por estado -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Estado</label>
          <select
            v-model="filtros.estado"
            class="bg-zinc-900/50 w-full px-3 py-2 border border-zinc-700/50 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white"
          >
            <option value="">Todos los estados</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <!-- Filtro por rango de precios -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Precio máximo</label>
          <input
            v-model="filtros.precioMax"
            type="number"
            placeholder="Precio máximo..."
            style="background-color: rgb(39 39 42);"
            class="w-full px-3 py-2 border border-zinc-700/50 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white placeholder-gray-400"
          />
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="mt-4 flex flex-wrap gap-2">
        <button
          @click="limpiarFiltros"
          class="bg-zinc-900/50 inline-flex items-center px-3 py-2 border border-zinc-700/50 text-sm font-medium rounded-lg text-white hover:bg-zinc-900/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Limpiar filtros
        </button>
      </div>
    </div>

    <!-- Grid de productos -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <div
        v-for="producto in productosFiltrados"
        :key="producto.id"
        style="background-color: rgb(24 24 27 / 0.8);"
        class="border border-zinc-700/50 rounded-lg p-4 sm:p-6 hover:border-yellow-400 transition-colors"
      >
        <!-- Header del producto -->
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="text-lg font-medium text-white">{{ producto.nombre }}</h3>
            <p class="text-sm text-gray-400">{{ producto.codigo }}</p>
          </div>
          <div class="flex items-center space-x-2">
            <span
              :class="producto.activo ? 'bg-green-600' : 'bg-red-600'"
              class="px-2 py-1 text-xs font-medium text-white rounded-full"
            >
              {{ producto.activo ? 'Activo' : 'Inactivo' }}
            </span>
          </div>
        </div>

        <!-- Información del producto -->
        <div class="space-y-3 mb-4">
          <p class="text-sm text-gray-300">{{ producto.descripcion }}</p>
          
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-400">Categoría:</span>
            <span class="text-sm text-white">{{ producto.categoria?.nombre || 'Sin categoría' }}</span>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-400">Precio:</span>
            <span class="text-lg font-bold text-yellow-400">₡{{ producto.precio_venta }}</span>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-400">Costo:</span>
            <span class="text-sm text-white">₡{{ producto.costo_total }}</span>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-400">Margen:</span>
            <span class="text-sm text-green-400">{{ producto.margen_ganancia }}%</span>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-400">Recetas:</span>
            <span class="text-sm text-white">{{ producto.recetas?.length || 0 }}</span>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-400">Ventas:</span>
            <span class="text-sm text-white">{{ producto.ventas_registradas || 0 }}</span>
          </div>
        </div>

        <!-- Acciones -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-3 sm:pt-4 border-t border-zinc-700/50 gap-3 sm:gap-0">
          <div class="flex items-center space-x-3 sm:space-x-2">
            <button
              @click="$emit('ver-producto', producto)"
              class="text-gray-300 hover:text-white transition-colors p-1 sm:p-0"
              title="Ver detalles"
            >
              <svg class="w-4 h-4 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button
              @click="$emit('editar-producto', producto)"
              class="text-gray-300 hover:text-yellow-400 transition-colors p-1 sm:p-0"
              title="Editar"
            >
              <svg class="w-4 h-4 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click="$emit('duplicar-producto', producto)"
              class="text-gray-300 hover:text-blue-400 transition-colors p-1 sm:p-0"
              title="Duplicar"
            >
              <svg class="w-4 h-4 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
          <button
            @click="confirmarEliminacion(producto)"
            class="text-gray-300 hover:text-red-400 transition-colors p-1 sm:p-0 self-end sm:self-auto"
            title="Eliminar"
          >
            <svg class="w-4 h-4 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mensaje cuando no hay productos -->
    <div v-if="productosFiltrados.length === 0" class="text-center py-12">
      <div class="text-gray-400">
        <svg class="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 class="text-lg font-medium text-white mb-2">No se encontraron productos</h3>
        <p class="text-gray-400">Intenta ajustar los filtros de búsqueda</p>
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <div v-if="mostrarModalEliminacion" class="fixed inset-0 backdrop-blur-sm bg-zinc-900/95 flex items-center justify-center z-50">
      <div class="modal bg-zinc-900/95 border border-zinc-700/50 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-medium text-white mb-4">Confirmar eliminación</h3>
        <p class="text-gray-300 mb-6">
          ¿Estás seguro de que quieres eliminar el producto "{{ productoAEliminar?.nombre }}"?
          Esta acción no se puede deshacer.
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="cancelarEliminacion"
            class="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="eliminarProductoConfirmado"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-500 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'ProductosList',
  props: {
    productos: {
      type: Array,
      required: true
    },
    categorias: {
      type: Array,
      required: true
    }
  },
  emits: ['editar-producto', 'ver-producto', 'eliminar-producto', 'duplicar-producto'],
  setup(props, { emit }) {
    const filtros = ref({
      busqueda: '',
      categoria: '',
      estado: '',
      precioMax: ''
    })

    const mostrarModalEliminacion = ref(false)
    const productoAEliminar = ref(null)

    const productosFiltrados = computed(() => {
      return props.productos.filter(producto => {
        // Filtro por búsqueda
        if (filtros.value.busqueda && !producto.nombre.toLowerCase().includes(filtros.value.busqueda.toLowerCase())) {
          return false
        }

        // Filtro por categoría
        if (filtros.value.categoria && producto.categoria_id !== filtros.value.categoria) {
          return false
        }

        // Filtro por estado
        if (filtros.value.estado) {
          const estadoActivo = filtros.value.estado === 'Activo'
          if (producto.activo !== estadoActivo) {
            return false
          }
        }

        // Filtro por precio máximo
        if (filtros.value.precioMax && (producto.precio_venta || 0) > parseFloat(filtros.value.precioMax)) {
          return false
        }

        return true
      })
    })

    const confirmarEliminacion = (producto) => {
      if ((producto.ventas_registradas || 0) > 0) {
        alert('No se puede eliminar: producto con ventas registradas')
        return
      }
      productoAEliminar.value = producto
      mostrarModalEliminacion.value = true
    }

    const eliminarProductoConfirmado = () => {
      emit('eliminar-producto', productoAEliminar.value)
      cancelarEliminacion()
    }

    const cancelarEliminacion = () => {
      mostrarModalEliminacion.value = false
      productoAEliminar.value = null
    }

    const limpiarFiltros = () => {
      filtros.value = {
        busqueda: '',
        categoria: '',
        estado: '',
        precioMax: ''
      }
    }

    return {
      filtros,
      productosFiltrados,
      mostrarModalEliminacion,
      productoAEliminar,
      confirmarEliminacion,
      eliminarProductoConfirmado,
      cancelarEliminacion,
      limpiarFiltros
    }
  }
}
</script>

<style scoped>
/* Estilos para inputs */
.input-field {
  background-color: rgb(24 24 27 / 0.8);
  border: 1px solid rgb(63 63 70 / 0.5);
  color: white;
}

.input-field::placeholder {
  color: #9ca3af;
}

.input-field:focus {
  border-color: #9ca3af;
}

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
  background-color: rgb(24 24 27 / 0.5);
}

/* Estilos para modales */
.modal {
  background-color: rgb(24 24 27 / 0.8);
  border: 1px solid rgb(63 63 70 / 0.5);
}

/* Transiciones suaves */
* {
  transition: background-color 150ms ease, border-color 150ms ease, color 150ms ease;
}
</style>
