<template>
  <div class="space-y-6">
    <!-- Filtros y búsqueda -->
    <div class="bg-zinc-900/50 border border-zinc-700/50 rounded-lg shadow-sm p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Búsqueda -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">
            Búsqueda
          </label>
          <div class="relative">
            <input
              v-model="filtros.busqueda"
              type="text"
              placeholder="Buscar por nombre, código..."
              class="w-full pl-10 pr-4 py-2 bg-zinc-900/50 border border-zinc-700/50 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white placeholder-gray-400"
            />
            <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <!-- Filtro por categoría -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">
            Categoría
          </label>
          <select
            v-model="filtros.categoria"
            class="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700/50 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white"
          >
            <option value="">Todas las categorías</option>
            <option v-for="cat in categorias" :key="cat.id" :value="cat.id">
              {{ cat.nombre }}
            </option>
          </select>
        </div>

        <!-- Filtro por estado -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">
            Estado
          </label>
          <select
            v-model="filtros.estado"
            class="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700/50 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white"
          >
            <option value="">Todos los estados</option>
            <option value="Activa">Activa</option>
            <option value="Borrador">Borrador</option>
            <option value="Inactiva">Inactiva</option>
          </select>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="mt-4 flex flex-wrap gap-2">
        <button
          @click="limpiarFiltros"
          class="inline-flex items-center px-3 py-2 bg-zinc-900/50 border border-zinc-700/50 text-sm font-medium rounded-lg text-white hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Limpiar filtros
        </button>
        <!-- <button
          @click="exportarLista"
          class="inline-flex items-center px-3 py-2 border border-zinc-700/50 text-sm font-medium rounded-lg text-white bg-zinc-900/50 hover:bg-zinc-900/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Exportar
        </button> -->
      </div>
    </div>

    <!-- Grid de recetas -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="receta in recetasFiltradas"
        :key="receta.id"
        style="background-color: rgb(24 24 27 / 0.8);"
        class="border border-zinc-700/50 rounded-lg p-6 hover:border-yellow-400 transition-colors"
      >
        <!-- Header de la receta -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center">
            <div class="w-10 h-10 rounded-full flex items-center justify-center mr-3" :style="{ backgroundColor: obtenerColorCategoria(receta.categoria_id) }">
              <span class="text-white font-bold text-sm">{{ obtenerNombreCategoria(receta.categoria_id).substring(0, 2) }}</span>
            </div>
            <div>
              <h3 class="text-lg font-medium text-white">{{ receta.nombre }}</h3>
              <p class="text-sm text-gray-300">{{ receta.codigo }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-2 text-sm">
            <span class="px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-300 border border-yellow-500/30">
              {{ receta.rentabilidad }}% margen
            </span>
          </div>
        </div>

        <!-- Información de la receta -->
        <div class="space-y-3 mb-4">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-300">Categoría:</span>
            <span class="text-white">{{ obtenerNombreCategoria(receta.categoria_id) }}</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-300">Tiempo:</span>
            <span class="text-white">{{ receta.tiempoPreparacion }} min</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-300">Rendimiento:</span>
            <span class="text-white">{{ receta.rendimiento }} porciones</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-300">Costo total:</span>
            <span class="text-white">₡{{ receta.costoTotal.toFixed(2) }}</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-300">Rentabilidad:</span>
            <span class="text-white">{{ receta.rentabilidad }}%</span>
          </div>
        </div>

        <!-- Estado -->
        <div class="mb-4">
          <span
            class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
            :class="obtenerClaseEstado(receta.estado)"
          >
            {{ receta.estado }}
          </span>
        </div>

        <!-- Ingredientes preview -->
        <div v-if="receta.ingredientes && receta.ingredientes.length > 0" class="mb-4">
          <h4 class="text-sm font-medium text-gray-300 mb-2">Ingredientes principales:</h4>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="ingrediente in receta.ingredientes.slice(0, 3)"
              :key="ingrediente.ingredienteId || ingrediente.id"
              class="inline-flex items-center px-2 py-1 text-xs bg-zinc-900/50 text-gray-300 rounded"
            >
              {{ ingrediente.nombre || ingrediente.insumos?.nombre || ingrediente.insumo?.nombre || 'Ingrediente' }}
            </span>
            <span v-if="receta.ingredientes.length > 3" class="text-xs text-gray-400">
              +{{ receta.ingredientes.length - 3 }} más
            </span>
          </div>
        </div>

        <!-- Acciones -->
        <div class="flex items-center justify-between pt-4 border-t border-zinc-700/50">
          <div class="flex items-center space-x-2">
            <button
              @click="$emit('ver-receta', receta)"
              class="text-gray-300 hover:text-white"
              title="Ver detalles"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button
              @click="$emit('editar-receta', receta)"
              class="text-gray-300 hover:text-white"
              title="Editar"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click="$emit('duplicar-receta', receta)"
              class="text-gray-300 hover:text-white"
              title="Duplicar"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
          <button
            @click="abrirEliminacion(receta)"
            class="text-gray-300 hover:text-red-400"
            title="Eliminar"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mensaje cuando no hay recetas -->
    <div v-if="recetasFiltradas.length === 0" class="text-center py-12">
      <div class="w-16 h-16 mx-auto mb-4 bg-zinc-900/50 rounded-full flex items-center justify-center">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-white mb-2">No se encontraron recetas</h3>
      <p class="text-gray-400">Intenta ajustar los filtros de búsqueda.</p>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <div
      v-if="mostrarModalEliminacion"
      class="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/50 z-50"
      @click.self="cancelarEliminacion"
    >
      <div class="bg-zinc-900/95 mx-4 p-5 border border-zinc-700/50 w-full max-w-md shadow-2xl rounded-lg">
        <div class="mt-3 text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-900">
            <svg class="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 class="text-lg leading-6 font-medium text-white mt-4">
            Confirmar eliminación
          </h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-400">
              ¿Está seguro de que desea eliminar la receta <strong>{{ recetaAEliminar?.nombre }}</strong>?
            </p>
            <p class="text-sm text-gray-400 mt-2">
              Esta acción no se puede deshacer.
            </p>
          </div>
          <div class="items-center px-4 py-3">
            <button
              @click="confirmarEliminacion"
              class="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              Eliminar
            </button>
            <button
              @click="cancelarEliminacion"
              class="mt-2 px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'RecetasList',
  props: {
    recetas: {
      type: Array,
      required: true
    },
    categorias: {
      type: Array,
      required: true
    }
  },
  emits: ['editar-receta', 'ver-receta', 'eliminar-receta', 'duplicar-receta'],
  setup(props, { emit }) {
    // Estado
    const filtros = ref({
      busqueda: '',
      categoria: '',
      estado: ''
    })

    const mostrarModalEliminacion = ref(false)
    const recetaAEliminar = ref(null)

    

    // Computed properties
    const recetasFiltradas = computed(() => {
      let filtradas = [...props.recetas]

      // Aplicar filtros
      if (filtros.value.busqueda) {
        const busqueda = filtros.value.busqueda.toLowerCase()
        filtradas = filtradas.filter(r => 
          r.nombre.toLowerCase().includes(busqueda) ||
          r.codigo.toLowerCase().includes(busqueda) ||
          obtenerNombreCategoria(r.categoria_id).toLowerCase().includes(busqueda)
        )
      }

      if (filtros.value.categoria) {
        filtradas = filtradas.filter(r => r.categoria_id === filtros.value.categoria)
      }

      if (filtros.value.estado) {
        filtradas = filtradas.filter(r => r.estado === filtros.value.estado)
      }

      return filtradas
    })

    // Methods
    const obtenerColorCategoria = (categoriaId) => {
      const categoria = props.categorias.find(c => c.id === categoriaId)
      return categoria ? categoria.color : '#6b7280'
    }

    const obtenerNombreCategoria = (categoriaId) => {
      const categoria = props.categorias.find(c => c.id === categoriaId)
      return categoria ? categoria.nombre : 'Sin categoría'
    }

    const obtenerClaseEstado = (estado) => {
      switch (estado) {
        case 'Activa':
          return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        case 'Borrador':
          return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
        case 'Inactiva':
          return 'bg-gray-100 text-gray-800 dark:bg-zinc-900/50 dark:text-gray-200'
        default:
          return 'bg-gray-100 text-gray-800 dark:bg-zinc-900/50 dark:text-gray-200'
      }
    }

    const limpiarFiltros = () => {
      filtros.value = {
        busqueda: '',
        categoria: '',
        estado: ''
      }
    }

    const exportarLista = () => {
      const datos = recetasFiltradas.value.map(receta => ({
        Código: receta.codigo,
        Nombre: receta.nombre,
        Categoría: receta.categoria,
        Estado: receta.estado,
        'Tiempo Preparación': `${receta.tiempoPreparacion} min`,
        Rendimiento: `${receta.rendimiento} porciones`,
        'Costo Total': `₡${receta.costoTotal.toFixed(2)}`,
        'Costo por Porción': `₡${receta.costoPorPorcion.toFixed(2)}`,
        Rentabilidad: `${receta.rentabilidad}%`
      }))

      console.log('Exportando datos:', datos)
      alert('Lista exportada correctamente')
    }

    
// Abrir modal con la receta seleccionada
const abrirEliminacion = (receta) => {
  recetaAEliminar.value = receta
  mostrarModalEliminacion.value = true
}

// Confirmar eliminación (emite al padre y cierra)
const confirmarEliminacion = () => {
  if (!recetaAEliminar.value) return
  emit('eliminar-receta', recetaAEliminar.value) // o recetaAEliminar.value.id si prefieres
  mostrarModalEliminacion.value = false
  recetaAEliminar.value = null
}

// Cancelar (solo cierra modal)
const cancelarEliminacion = () => {
  mostrarModalEliminacion.value = false
  recetaAEliminar.value = null
}


    return {
      filtros,
      mostrarModalEliminacion,
      recetaAEliminar,
      recetasFiltradas,
      obtenerColorCategoria,
      obtenerNombreCategoria,
      obtenerClaseEstado,
      limpiarFiltros,
      exportarLista,
      abrirEliminacion,
      confirmarEliminacion,
      cancelarEliminacion
    }
  }
}
</script> 
