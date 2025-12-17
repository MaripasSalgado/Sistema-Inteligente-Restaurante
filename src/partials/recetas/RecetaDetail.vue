<template>
  <div class="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/50 z-50" @click.self="$emit('cerrar')">
    <div class="bg-zinc-900/95 border border-zinc-700/50 rounded-lg shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto p-5">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-white">{{ receta.nombre }}</h2>
        <div class="flex items-center space-x-3">
          <button
            @click="$emit('editar', receta)"
            style="background-color: rgb(24 24 27 / 0.8);" class="inline-flex items-center px-3 py-2 border border-zinc-700/50 text-sm font-medium rounded-lg text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar
          </button>
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

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Información principal -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Información básica -->
          <div style="background-color: rgb(24 24 27 / 0.8);" class="border border-zinc-700/50 rounded-lg p-6">
            <h3 class="text-lg font-medium text-white mb-4">Información General</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p class="text-sm text-gray-300">Código</p>
                <p class="text-white font-medium">{{ receta.codigo }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-300">Categoría</p>
                <p class="text-white font-medium">{{ obtenerNombreCategoria(receta.categoria_id) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-300">Estado</p>
                <span
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="obtenerClaseEstado(receta.estado)"
                >
                  {{ receta.estado || (receta.activa ? 'Activa' : 'Borrador') }}
                </span>
              </div>
              <div>
                <p class="text-sm text-gray-300">Tiempo</p>
                <p class="text-white font-medium">{{ receta.tiempo_preparacion || receta.tiempoPreparacion }} min</p>
              </div>
              <div>
                <p class="text-sm text-gray-300">Rendimiento</p>
                <p class="text-white font-medium">{{ receta.rendimiento }} porciones</p>
              </div>
              <div>
                <p class="text-sm text-gray-300">Costo total</p>
                <p class="text-white font-medium">₡{{ (receta.costo_total || receta.costoTotal || 0).toFixed(2) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-300">Costo por porción</p>
                <p class="text-white font-medium">₡{{ costoPorPorcion.toFixed(2) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-300">Rentabilidad</p>
                <p class="text-white font-medium">{{ (receta.margen_ganancia || receta.rentabilidad || 0).toFixed(2) }}%</p>
              </div>
            </div>
          </div>

          <!-- Ingredientes -->
          <div style="background-color: rgb(24 24 27 / 0.8);" class="border border-zinc-700/50 rounded-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-white">Ingredientes</h3>
              <span class="text-sm text-gray-400">{{ totalIngredientes }} ingrediente{{ totalIngredientes !== 1 ? 's' : '' }}</span>
            </div>
            <div v-if="ingredientesFormateados.length > 0" class="space-y-3">
              <div
                v-for="(ingrediente, index) in ingredientesFormateados"
                :key="index"
                class="flex items-center justify-between p-3 border border-zinc-700/50 rounded-lg"
              >
                <div class="flex items-center">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center mr-3" style="background-color: rgb(39 39 42);">
                    <span class="text-white text-xs font-bold">{{ obtenerInicialesIngrediente(ingrediente) }}</span>
                  </div>
                  <div>
                    <p class="text-white font-medium">{{ ingrediente.nombre }}</p>
                    <p class="text-sm text-gray-400">{{ ingrediente.cantidad }} {{ ingrediente.unidad }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-white font-medium">₡{{ (ingrediente.costo_total || ingrediente.subtotal || 0).toFixed(2) }}</p>
                  <p class="text-sm text-gray-400">₡{{ (ingrediente.costo_unitario || ingrediente.precioUnitario || 0).toFixed(2) }}/{{ ingrediente.unidad }}</p>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <p class="text-gray-400">No hay ingredientes registrados</p>
            </div>
            <div v-if="ingredientesFormateados.length > 0" class="mt-4 pt-4 border-t border-zinc-700/50">
              <div class="flex justify-between items-center">
                <span class="text-lg font-medium text-white">Total ingredientes</span>
                <span class="text-lg font-bold text-white">₡{{ (receta.costo_total || receta.costoTotal || 0).toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <!-- Pasos de preparación -->
          <div style="background-color: rgb(24 24 27 / 0.8);" class="border border-zinc-700/50 rounded-lg p-6">
            <h3 class="text-lg font-medium text-white mb-4">Pasos de Preparación</h3>
            <div v-if="pasosFormateados.length > 0" class="space-y-4">
              <div
                v-for="(paso, index) in pasosFormateados"
                :key="index"
                class="flex items-start space-x-4"
              >
                <div class="flex-shrink-0 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span class="text-black font-bold text-sm">{{ index + 1 }}</span>
                </div>
                <div class="flex-1">
                  <p class="text-white">{{ paso }}</p>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <p class="text-gray-400">No hay pasos de preparación registrados</p>
            </div>
          </div>
        </div>

        <!-- Sidebar con información adicional -->
        <div class="space-y-6">
          <!-- Estadísticas -->
          <div style="background-color: rgb(24 24 27 / 0.8);" class="border border-zinc-700/50 rounded-lg p-6">
            <h3 class="text-lg font-medium text-white mb-4">Estadísticas</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-gray-300">Margen estimado</span>
                <span class="text-yellow-400 font-semibold">{{ receta.rentabilidad || receta.margen_ganancia || 0 }}%</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-300">Veces preparada</span>
                <span class="text-white font-medium">{{ receta.veces_preparada || receta.vecesPreparada || 0 }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-300">Fecha creación</span>
                <span class="text-white font-medium">{{ formatearFecha(receta.fecha_creacion || receta.fechaCreacion) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-300">Última modificación</span>
                <span class="text-white font-medium">{{ formatearFecha(receta.fecha_modificacion || receta.ultimaModificacion) }}</span>
              </div>
            </div>
          </div>

          <!-- Acciones rápidas -->
          <div style="background-color: rgb(24 24 27 / 0.8);" class="border border-zinc-700/50 rounded-lg p-6">
            <h3 class="text-lg font-medium text-white mb-4">Acciones</h3>
            <div class="space-y-3">
              <button
                @click="duplicarReceta"
                style="background-color: rgb(24 24 27 / 0.8);" class="w-full inline-flex items-center justify-center px-4 py-2 border border-zinc-700/50 text-sm font-medium rounded-lg text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Duplicar receta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'RecetaDetail',
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
  emits: ['cerrar', 'editar', 'duplicar'],
  setup(props, { emit }) {
    // Computed properties
    const ingredientesFormateados = computed(() => {
      if (!props.receta.ingredientes) return []

      // Si ingredientes viene del backend, tiene la estructura con insumos nested
      return props.receta.ingredientes.map(ing => {
        if (ing.insumos || ing.insumo) {
          // Datos del backend (puede ser 'insumos' o 'insumo' dependiendo de la versión)
          const insumoData = ing.insumos || ing.insumo
          return {
            nombre: insumoData.nombre,
            cantidad: ing.cantidad,
            unidad: ing.unidad_medida,
            costo_total: ing.costo_total,
            costo_unitario: ing.costo_unitario
          }
        } else {
          // Datos del frontend (formato transformado)
          return ing
        }
      })
    })

    const pasosFormateados = computed(() => {
      if (!props.receta.pasos) {
        // Si no hay pasos pero hay instrucciones, intentar parsear
        if (props.receta.instrucciones) {
          return props.receta.instrucciones.split('\n\n').filter(p => p.trim())
        }
        return []
      }

      // Si pasos es un array de objetos con descripcion
      if (Array.isArray(props.receta.pasos) && props.receta.pasos.length > 0) {
        if (typeof props.receta.pasos[0] === 'object') {
          return props.receta.pasos.map(p => p.descripcion)
        }
        // Si ya es un array de strings
        return props.receta.pasos
      }

      return []
    })

    const totalIngredientes = computed(() => {
      return ingredientesFormateados.value.length
    })

    const costoPorPorcion = computed(() => {
      const costo = props.receta.costo_total || props.receta.costoTotal || 0
      const porciones = props.receta.rendimiento || 1
      return costo / porciones
    })

    // Methods
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
          return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
        default:
          return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      }
    }

    const formatearFecha = (fecha) => {
      if (!fecha) return 'N/A'

      try {
        return new Date(fecha).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      } catch (error) {
        return 'N/A'
      }
    }

    const obtenerInicialesIngrediente = (ingrediente) => {
      const nombre = ingrediente.nombre || ''
      return nombre.substring(0, 2).toUpperCase()
    }

    const duplicarReceta = () => {
      console.log('🔄 Duplicando receta:', props.receta.nombre)
      emit('duplicar', props.receta)
    }

    return {
      ingredientesFormateados,
      pasosFormateados,
      totalIngredientes,
      costoPorPorcion,
      obtenerNombreCategoria,
      obtenerClaseEstado,
      formatearFecha,
      obtenerInicialesIngrediente,
      duplicarReceta
    }
  }
}
</script>
