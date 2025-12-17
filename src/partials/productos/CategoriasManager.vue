<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-white">Categorías de Productos</h2>
        <p class="text-gray-300">Gestiona las categorías para organizar tus productos</p>
      </div>
      <button
        @click="mostrarFormulario = true"
        class="inline-flex items-center px-4 py-2 border-0 text-sm font-medium rounded-lg text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-colors"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Nueva Categoría
      </button>
    </div>

    <!-- Mensaje cuando no hay categorías -->
    <div v-if="categorias.length === 0" class="text-center py-12 border border-zinc-700/50 rounded-lg">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-700/50 mb-4">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-white mb-2">No hay categorías</h3>
      <p class="text-gray-400 mb-6">Crea tu primera categoría para empezar a organizar tus productos</p>
      <button
        @click="mostrarFormulario = true"
        class="inline-flex items-center px-4 py-2 text-sm font-medium text-black bg-yellow-400 hover:bg-yellow-500 rounded-lg transition-colors"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Crear Primera Categoría
      </button>
    </div>

    <!-- Grid de categorías -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="categoria in categorias"
        :key="categoria.id"
        style="background-color: rgb(39 39 42);" class="border border-zinc-700/50 rounded-lg p-6 hover:border-yellow-400 transition-colors"
      >
        <!-- Header de la categoría -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center">
            <div 
              class="w-4 h-4 rounded-full mr-3" 
              :style="{ backgroundColor: categoria.color }"
            ></div>
            <div>
              <h3 class="text-lg font-medium text-white">{{ categoria.nombre }}</h3>
              <p class="text-sm text-gray-400">{{ categoria.descripcion }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <span
              :class="categoria.activa ? 'bg-green-600' : 'bg-red-600'"
              class="px-2 py-1 text-xs font-medium text-white rounded-full"
            >
              {{ categoria.activa ? 'Activa' : 'Inactiva' }}
            </span>
          </div>
        </div>

        <!-- Información de la categoría -->
        <div class="space-y-3 mb-4">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-400">Productos:</span>
            <span class="text-white">{{ productosEnCategoria(categoria.id) }}</span>
          </div>
        </div>

        <!-- Acciones -->
        <div class="flex items-center justify-between pt-4 border-t border-zinc-700/50">
          <button
            @click="editarCategoria(categoria)"
            class="px-3 py-1 text-xs font-medium text-black bg-yellow-400 rounded hover:bg-yellow-500 transition-colors"
          >
            Editar
          </button>
          <button
            @click="confirmarEliminacion(categoria)"
            :disabled="productosEnCategoria(categoria.id) > 0"
            class="px-3 py-1 text-xs font-medium text-white bg-gray-600 rounded hover:bg-gray-500 disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de formulario -->
    <div v-if="mostrarFormulario" class="fixed inset-0 backdrop-blur-sm bg-black/50 overflow-y-auto h-full w-full z-50">
      <div class="modal relative top-10 mx-auto p-5 border border-zinc-700/50 w-full max-w-md shadow-lg rounded-md">
        
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-white">
            {{ categoriaSeleccionada ? 'Editar Categoría' : 'Nueva Categoría' }}
          </h3>
          <button
            @click="cerrarFormulario"
            class="text-gray-400 hover:text-white"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="guardarCategoria" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Nombre *</label>
            <input
              v-model="form.nombre"
              type="text"
              required
              placeholder="Nombre de la categoría..."
              class="input-field w-full px-3 py-2 border border-zinc-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
            <textarea
              v-model="form.descripcion"
              rows="3"
              placeholder="Descripción de la categoría..."
              class="input-field w-full px-3 py-2 border border-zinc-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Color</label>
            <input
              v-model="form.color"
              type="color"
              class="input-field w-full h-10 border border-zinc-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div class="flex items-center">
            <input
              v-model="form.activa"
              type="checkbox"
              class="w-4 h-4 text-yellow-400 bg-zinc-800 border-zinc-700/50 rounded focus:ring-yellow-400 focus:ring-offset-0 accent-yellow-400"
            />
            <label class="ml-2 text-sm text-gray-300">Categoría activa</label>
          </div>

          <!-- Botones -->
          <div class="flex justify-end space-x-3 pt-4">
            <button
              @click="cerrarFormulario"
              type="button"
              class="px-4 py-2 text-sm font-medium text-black bg-yellow-400 rounded-lg hover:bg-yellow-500 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-sm font-medium text-black bg-yellow-400 rounded-lg hover:bg-yellow-500 transition-colors"
            >
              {{ categoriaSeleccionada ? 'Actualizar' : 'Crear' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <div v-if="mostrarModalEliminacion" class="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50">
      <div class="modal border border-zinc-700/50 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-medium text-white mb-4">Confirmar eliminación</h3>
        <p class="text-gray-300 mb-6">
          ¿Estás seguro de que quieres eliminar la categoría "{{ categoriaAEliminar?.nombre }}"?
          Esta acción no se puede deshacer.
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="cancelarEliminacion"
            class="px-4 py-2 text-sm font-medium text-black bg-yellow-400 rounded-lg hover:bg-yellow-500 transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="eliminarCategoriaConfirmado"
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
  name: 'CategoriasManager',
  props: {
    categorias: {
      type: Array,
      required: true
    },
    productos: {
      type: Array,
      default: () => []
    }
  },
  emits: ['crear-categoria', 'editar-categoria', 'eliminar-categoria'],
  setup(props, { emit }) {
    const mostrarFormulario = ref(false)
    const mostrarModalEliminacion = ref(false)
    const categoriaSeleccionada = ref(null)
    const categoriaAEliminar = ref(null)

    const form = ref({
      nombre: '',
      descripcion: '',
      color: '#F4B400',
      activa: true
    })

    const productosEnCategoria = (categoriaId) => {
      // Contar productos reales que tienen esta categoría
      return props.productos.filter(p => p.categoria_id === categoriaId).length
    }

    const editarCategoria = (categoria) => {
      categoriaSeleccionada.value = categoria
      form.value = {
        nombre: categoria.nombre,
        descripcion: categoria.descripcion,
        color: categoria.color,
        activa: categoria.activa
      }
      mostrarFormulario.value = true
    }

    const guardarCategoria = () => {
      const categoriaData = {
        ...form.value,
        id: categoriaSeleccionada.value?.id || Date.now()
      }

      if (categoriaSeleccionada.value) {
        emit('editar-categoria', categoriaData)
      } else {
        emit('crear-categoria', categoriaData)
      }

      cerrarFormulario()
    }

    const confirmarEliminacion = (categoria) => {
      if (productosEnCategoria(categoria.id) > 0) {
        alert('No se puede eliminar: categoría con productos asignados')
        return
      }
      categoriaAEliminar.value = categoria
      mostrarModalEliminacion.value = true
    }

    const eliminarCategoriaConfirmado = () => {
      emit('eliminar-categoria', categoriaAEliminar.value)
      cancelarEliminacion()
    }

    const cancelarEliminacion = () => {
      mostrarModalEliminacion.value = false
      categoriaAEliminar.value = null
    }

    const cerrarFormulario = () => {
      mostrarFormulario.value = false
      categoriaSeleccionada.value = null
      form.value = {
        nombre: '',
        descripcion: '',
        color: '#F4B400',
        activa: true
      }
    }

    return {
      mostrarFormulario,
      mostrarModalEliminacion,
      categoriaSeleccionada,
      categoriaAEliminar,
      form,
      productosEnCategoria,
      editarCategoria,
      guardarCategoria,
      confirmarEliminacion,
      eliminarCategoriaConfirmado,
      cancelarEliminacion,
      cerrarFormulario
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
  background-color: black;
  color: white;
}

.btn:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.btn:hover {
  background-color: rgb(39 39 42);
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