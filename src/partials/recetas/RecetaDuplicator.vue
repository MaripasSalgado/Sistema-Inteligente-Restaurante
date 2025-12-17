<template>
  <div class="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/50 z-50" @click.self="$emit('cancelar')">
    <div class="bg-zinc-900/95 mx-4 p-5 border border-zinc-700/50 w-full max-w-md shadow-2xl rounded-lg">
      <div class="mt-3 text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-900">
          <svg class="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 class="text-lg leading-6 font-medium text-white mt-4">
          Duplicar Receta
        </h3>
        <div class="mt-2 px-7 py-3">
          <p class="text-sm text-gray-400">
            ¿Qué nombre desea darle a la nueva receta?
          </p>
          <div class="mt-4">
            <input
              v-model="nuevoNombre"
              type="text"
              placeholder="Nombre de la nueva receta"
              class="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700/50 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white placeholder-gray-400"
            />
          </div>
          <div class="mt-4 text-left">
            <p class="text-sm text-gray-400 mb-2">Receta original: <span class="text-white font-medium">{{ receta.nombre }}</span></p>
            <p class="text-sm text-gray-400">Categoría: <span class="text-white">{{ obtenerNombreCategoria(receta.categoria_id) }}</span></p>
            <p class="text-sm text-gray-400">Ingredientes: <span class="text-white">{{ receta.ingredientes?.length || 0 }}</span></p>
            <p class="text-sm text-gray-400">Pasos: <span class="text-white">{{ receta.pasos?.length || 0 }}</span></p>
          </div>
        </div>
        <div class="items-center px-4 py-3">
          <button
            @click="confirmarDuplicacion"
            :disabled="!nuevoNombre.trim()"
            class="px-4 py-2 bg-yellow-400 text-black text-base font-medium rounded-md w-full shadow-sm hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Duplicar
          </button>
          <button
            @click="$emit('cancelar')"
            class="mt-2 px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'RecetaDuplicator',
  props: {
    receta: {
      type: Object,
      required: true
    },
    categorias: {
      type: Array,
      required: true
    }
  },
  emits: ['duplicar', 'cancelar'],
  setup(props, { emit }) {
    const nuevoNombre = ref('')

    const obtenerNombreCategoria = (categoriaId) => {
      const categoria = props.categorias.find(c => c.id === categoriaId)
      return categoria ? categoria.nombre : 'Sin categoría'
    }

    const confirmarDuplicacion = () => {
      if (nuevoNombre.value.trim()) {
        emit('duplicar', nuevoNombre.value.trim())
      }
    }

    return {
      nuevoNombre,
      obtenerNombreCategoria,
      confirmarDuplicacion
    }
  }
}
</script> 
