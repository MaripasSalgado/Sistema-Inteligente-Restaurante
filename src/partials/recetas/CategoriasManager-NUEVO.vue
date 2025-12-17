<template>
  <div class="space-y-6">
    <!-- Header con botón de nueva categoría -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-xl font-bold text-white">Gestión de Categorías</h2>
        <p class="text-gray-400 mt-1">Administra las categorías de recetas</p>
      </div>
      <button
        @click="mostrarFormulario = true; categoriaEditando = null"
        class="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors font-medium"
      >
        Nueva Categoría
      </button>
    </div>

    <!-- Lista de categorías -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="categoria in categorias"
        :key="categoria.id"
        class="bg-zinc-900/95 border border-zinc-700/50 rounded-lg p-4 hover:bg-zinc-800 transition-colors"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-3">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
              :style="{ backgroundColor: categoria.color }"
            >
              {{ categoria.icono }}
            </div>
            <div>
              <h3 class="text-lg font-semibold text-white">{{ categoria.nombre }}</h3>
              <p class="text-sm text-gray-400">{{ categoria.descripcion || 'Sin descripción' }}</p>
            </div>
          </div>
          <div class="flex space-x-2">
            <button
              @click="editarCategoria(categoria)"
              class="text-yellow-400 hover:text-yellow-300"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click="eliminarCategoria(categoria)"
              class="text-red-500 hover:text-red-400"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-400">Estado:</span>
          <span
            class="px-2 py-1 rounded-full text-xs font-medium"
            :class="categoria.activa ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
          >
            {{ categoria.activa ? 'Activa' : 'Inactiva' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Modal de formulario -->
    <div
      v-if="mostrarFormulario"
      class="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50"
      @click.self="cerrarFormulario"
    >
      <div class="bg-zinc-900/95 border border-zinc-700/50 rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold text-white mb-4">
          {{ categoriaEditando ? 'Editar Categoría' : 'Nueva Categoría' }}
        </h3>

        <form @submit.prevent="guardarCategoria" class="space-y-4">
          <!-- Nombre -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Nombre *
            </label>
            <input
              v-model="formulario.nombre"
              type="text"
              required
              class="w-full px-3 py-2 bg-zinc-900/95 border border-zinc-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Nombre de la categoría"
            />
          </div>

          <!-- Descripción -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Descripción
            </label>
            <textarea
              v-model="formulario.descripcion"
              rows="3"
              class="w-full px-3 py-2 bg-zinc-900/95 border border-zinc-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Descripción de la categoría"
            ></textarea>
          </div>

          <!-- Color -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Color
            </label>
            <div class="flex items-center space-x-4">
              <input
                v-model="formulario.color"
                type="color"
                class="w-12 h-10 rounded border border-zinc-700/50 cursor-pointer"
              />
              <input
                v-model="formulario.color"
                type="text"
                class="flex-1 px-3 py-2 bg-zinc-900/95 border border-zinc-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="#3B82F6"
              />
            </div>
          </div>

          <!-- Icono -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Icono
            </label>
            <div class="grid grid-cols-8 gap-2">
              <button
                v-for="icono in iconosDisponibles"
                :key="icono"
                type="button"
                @click="formulario.icono = icono"
                class="w-10 h-10 rounded border border-zinc-600 flex items-center justify-center text-lg hover:bg-zinc-800"
                :class="formulario.icono === icono ? 'bg-yellow-400 border-yellow-400' : 'bg-black'"
              >
                {{ icono }}
              </button>
            </div>
          </div>

          <!-- Estado -->
          <div>
            <label class="flex items-center space-x-3">
              <input
                v-model="formulario.activa"
                type="checkbox"
                class="w-4 h-4 text-yellow-400 bg-black border-zinc-700/50 rounded focus:ring-yellow-400"
              />
              <span class="text-sm text-white">Categoría activa</span>
            </label>
          </div>

          <!-- Botones -->
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="cerrarFormulario"
              class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors font-medium"
            >
              {{ categoriaEditando ? 'Actualizar' : 'Crear' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'CategoriasManager',
  props: {
    categorias: {
      type: Array,
      required: true
    }
  },
  emits: ['guardar-categoria', 'eliminar-categoria'],
  setup(props, { emit }) {
    const mostrarFormulario = ref(false)
    const categoriaEditando = ref(null)

    const formulario = ref({
      nombre: '',
      descripcion: '',
      color: '#3B82F6',
      icono: '🥟',
      activa: true
    })

    const iconosDisponibles = [
      '🥟', '🥤', '🍰', '🥗', '🌶️', '🍕', '🍔', '🍟',
      '🌮', '🍜', '🍚', '🍣', '🍱', '🥘', '🍲', '🥙',
      '🌯', '🥪', '🍖', '🥩', '🍗', '🥓', '🍔', '🌭',
      '🍞', '🥖', '🥐', '🧀', '🥚', '🍳', '🥞', '🧇'
    ]

    const resetearFormulario = () => {
      formulario.value = {
        nombre: '',
        descripcion: '',
        color: '#3B82F6',
        icono: '🥟',
        activa: true
      }
    }

    // Inicializar formulario cuando se edita
    watch(categoriaEditando, (nuevaCategoria) => {
      if (nuevaCategoria) {
        formulario.value = {
          id: nuevaCategoria.id,
          nombre: nuevaCategoria.nombre,
          descripcion: nuevaCategoria.descripcion || '',
          color: nuevaCategoria.color,
          icono: nuevaCategoria.icono || '🥟',
          activa: nuevaCategoria.activa
        }
      } else {
        resetearFormulario()
      }
    })

    const editarCategoria = (categoria) => {
      categoriaEditando.value = categoria
      mostrarFormulario.value = true
    }

    const cerrarFormulario = () => {
      mostrarFormulario.value = false
      categoriaEditando.value = null
      resetearFormulario()
    }

    const guardarCategoria = () => {
      if (!formulario.value.nombre.trim()) {
        alert('El nombre de la categoría es obligatorio')
        return
      }

      emit('guardar-categoria', { ...formulario.value })
      cerrarFormulario()
    }

    const eliminarCategoria = (categoria) => {
      if (confirm(`¿Estás seguro de que quieres eliminar la categoría "${categoria.nombre}"?`)) {
        emit('eliminar-categoria', categoria)
      }
    }

    return {
      mostrarFormulario,
      categoriaEditando,
      formulario,
      iconosDisponibles,
      editarCategoria,
      cerrarFormulario,
      guardarCategoria,
      eliminarCategoria
    }
  }
}
</script>
