<template>
  <div class="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/50 z-50" @click.self="$emit('cerrar')">
    <div class="bg-zinc-900/95 border border-zinc-700/50 rounded-lg shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex justify-between items-center p-6 border-b border-zinc-700/50">
        <div>
          <h2 class="text-2xl font-bold text-white">{{ insumo?.nombre || 'Sin nombre' }}</h2>
          <p class="text-gray-300 mt-1">{{ insumo?.descripcion || 'Sin descripción' }}</p>
        </div>
        <button
          @click="$emit('cerrar')"
          class="text-gray-400 hover:text-white transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <!-- Información General -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div class="bg-zinc-900/80 border border-zinc-700/50 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-white mb-3">Información General</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-300">Código:</span>
                <span class="text-white font-mono">{{ insumo?.codigo || 'N/A' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-300">Unidad:</span>
                <span class="text-white">{{ insumo?.unidad_medida || 'N/A' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-300">Stock Mínimo:</span>
                <span class="text-white">{{ insumo?.stock_minimo || 0 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-300">Stock Máximo:</span>
                <span class="text-white">{{ insumo?.stock_maximo || 'No definido' }}</span>
              </div>
            </div>
          </div>

          <div class="bg-zinc-900/80 border border-zinc-700/50 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-white mb-3">Stock Actual</h3>
            <div class="text-center">
              <div class="text-3xl font-bold text-yellow-400 mb-2">{{ getStockTotal() }}</div>
              <div class="text-gray-300">{{ insumo?.unidad_medida || 'unidades' }}</div>
            </div>
          </div>
        </div>

        <!-- Categorías -->
        <div class="mb-8" v-if="insumo?.categorias && insumo.categorias.length > 0">
          <h3 class="text-lg font-semibold text-white mb-4">Categorías</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="categoria in insumo.categorias"
              :key="categoria.id"
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
              :style="{ backgroundColor: (categoria.color || '#f4b400') + '20', color: categoria.color || '#f4b400' }"
            >
              {{ categoria.nombre || categoria.categoria?.nombre || 'Sin nombre' }}
            </span>
          </div>
        </div>

        <!-- Lotes -->
        <div class="mb-8" v-if="insumo?.lotes && insumo.lotes.length > 0">
          <h3 class="text-lg font-semibold text-white mb-4">Lotes</h3>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-zinc-900 border-b border-zinc-700/50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Lote</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Cantidad</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Precio</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Proveedor</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Ingreso</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Vencimiento</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="lote in insumo.lotes" :key="lote.id" class="border-b border-zinc-700/50 hover:bg-zinc-800/50 transition-colors">
                  <td class="py-3 text-sm text-white">{{ lote.lote || 'N/A' }}</td>
                  <td class="py-3 text-sm text-white">
                    {{ lote.cantidad_actual || 0 }} / {{ lote.cantidad_inicial || 0 }} {{ insumo?.unidad_medida || 'unidades' }}
                  </td>
                  <td class="py-3 text-sm text-white">₡{{ formatearPrecio(lote.precio_unitario) }}</td>
                  <td class="py-3 text-sm text-white">{{ lote.proveedor || '-' }}</td>
                  <td class="py-3 text-sm text-white">{{ formatearFecha(lote.fecha_ingreso) }}</td>
                  <td class="py-3 text-sm text-white">
                    <span :class="getVencimientoClass(lote.fecha_vencimiento)">
                      {{ formatearFecha(lote.fecha_vencimiento) }}
                    </span>
                  </td>
                  <td class="py-3">
                    <span
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                      :class="getLoteEstadoClass(lote.estado)"
                    >
                      {{ lote.estado || 'Activo' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-4">
          <button
            @click="$emit('cerrar')"
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
          >
            Cerrar
          </button>
          <button
            @click="$emit('editar', insumo)"
            class="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors"
          >
            Editar Insumo
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'InsumoDetail',
  props: {
    insumo: {
      type: Object,
      required: true
    },
    categorias: {
      type: Array,
      default: () => []
    }
  },
  emits: ['cerrar', 'editar'],
  setup(props) {
    // Computed para stock total
    const getStockTotal = () => {
      if (!props.insumo?.lotes) return 0
      return props.insumo.lotes.reduce((total, lote) => total + (lote.cantidad_actual || 0), 0)
    }

    // Funciones de utilidad
    const formatearFecha = (fecha) => {
      if (!fecha) return 'N/A'
      return new Date(fecha).toLocaleDateString('es-ES')
    }

    const getVencimientoClass = (fecha) => {
      if (!fecha) return 'text-gray-400'
      const hoy = new Date()
      const vencimiento = new Date(fecha)
      const diasRestantes = Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24))
      
      if (diasRestantes < 0) return 'text-red-400'
      if (diasRestantes <= 7) return 'text-yellow-400'
      return 'text-green-400'
    }

    const getLoteEstadoClass = (estado) => {
      switch (estado) {
        case 'Activo':
          return 'bg-green-100 text-green-800'
        case 'Inactivo':
          return 'bg-gray-100 text-gray-800'
        case 'Vencido':
          return 'bg-red-100 text-red-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }

    const formatearPrecio = (precio) => {
      if (!precio) return '0.00'
      return Number(precio).toLocaleString('es-CR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    }

    return {
      getStockTotal,
      formatearFecha,
      getVencimientoClass,
      getLoteEstadoClass,
      formatearPrecio
    }
  }
}
</script>