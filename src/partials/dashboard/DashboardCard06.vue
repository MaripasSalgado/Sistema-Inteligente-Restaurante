<template>
  <div class="flex flex-col col-span-full sm:col-span-6 xl:col-span-6 bg-zinc-900/80 border border-zinc-700/50 shadow-xs rounded-xl">
    <header class="px-5 py-4 border-b border-zinc-700/50">
      <h2 class="font-semibold text-gray-100">Productos Más Vendidos del Mes</h2>
    </header>
    <div class="p-5">
      <!-- Tabla de productos -->
      <div v-if="productosConDatos.length > 0" class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-zinc-700/50">
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Producto
              </th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Cantidad
              </th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                %
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-700/50">
            <tr 
              v-for="(producto, index) in productosConDatos" 
              :key="index"
              class="hover:bg-zinc-800/50 transition-colors"
            >
              <td class="px-4 py-3">
                <div class="flex items-center">
                  <div class="flex-shrink-0 w-2 h-2 rounded-full mr-3" :style="`background-color: ${getColor(index)}`"></div>
                  <span class="text-sm font-medium text-gray-100">{{ producto.nombre }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-right">
                <span class="text-sm font-bold text-yellow-400">{{ producto.cantidad }}</span>
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end space-x-2">
                  <div class="w-16 bg-zinc-700 rounded-full h-2">
                    <div 
                      class="h-2 rounded-full transition-all duration-300" 
                      :style="`width: ${producto.porcentaje}%; background-color: ${getColor(index)}`"
                    ></div>
                  </div>
                  <span class="text-xs text-gray-400 w-10 text-right">{{ producto.porcentaje }}%</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Estado vacío -->
      <div v-else class="text-center py-8">
        <svg class="mx-auto h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p class="mt-2 text-sm text-gray-400">No hay datos de productos vendidos</p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'DashboardCard06',
  props: {
    data: { 
      type: Object, 
      default: () => ({ labels: [], data: [] }) 
    }
  },
  setup(props) {
    const productosConDatos = computed(() => {
      if (!props.data?.labels || !props.data?.data || props.data.labels.length === 0) {
        return []
      }

      const total = props.data.data.reduce((sum, val) => sum + val, 0)
      
      return props.data.labels.map((nombre, index) => ({
        nombre,
        cantidad: props.data.data[index],
        porcentaje: total > 0 ? Math.round((props.data.data[index] / total) * 100) : 0
      }))
    })

    const getColor = (index) => {
      const colors = [
        '#f4b400', // yellow-500 (mustard)
        '#fbbf24', // amber-400
        '#fcd34d', // amber-300
        '#fde68a', // amber-200
        '#f59e0b', // amber-500
        '#fb923c', // orange-400
        '#fdba74', // orange-300
        '#fed7aa', // orange-200
      ]
      return colors[index % colors.length]
    }

    return {
      productosConDatos,
      getColor
    }
  }
}
</script>