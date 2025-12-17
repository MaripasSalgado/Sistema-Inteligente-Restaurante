<template>
  <div class="flex flex-col col-span-full bg-zinc-900/80 border border-zinc-700/50 shadow-xs rounded-xl">
    <header class="px-5 py-4 border-b border-zinc-700/50">
      <h2 class="font-semibold text-gray-100">Estado de Inventario</h2>
    </header>
    <div class="p-6">
      <div class="space-y-4">
        <!-- Stock Óptimo -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span class="text-sm font-medium text-gray-100">Stock Óptimo</span>
            </div>
            <span class="text-sm font-bold text-green-400">{{ data?.optimo || 0 }}</span>
          </div>
          <div class="w-full bg-zinc-700 rounded-full h-3">
            <div 
              class="bg-green-500 h-3 rounded-full transition-all duration-300" 
              :style="`width: ${getPercentage(data?.optimo || 0)}%`"
            ></div>
          </div>
        </div>

        <!-- Stock Bajo -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <span class="text-sm font-medium text-gray-100">Stock Bajo</span>
            </div>
            <span class="text-sm font-bold text-yellow-400">{{ data?.bajo || 0 }}</span>
          </div>
          <div class="w-full bg-zinc-700 rounded-full h-3">
            <div 
              class="bg-yellow-500 h-3 rounded-full transition-all duration-300" 
              :style="`width: ${getPercentage(data?.bajo || 0)}%`"
            ></div>
          </div>
        </div>

        <!-- Stock Crítico -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span class="text-sm font-medium text-gray-100">Stock Crítico</span>
            </div>
            <span class="text-sm font-bold text-red-400">{{ data?.critico || 0 }}</span>
          </div>
          <div class="w-full bg-zinc-700 rounded-full h-3">
            <div 
              class="bg-red-500 h-3 rounded-full transition-all duration-300" 
              :style="`width: ${getPercentage(data?.critico || 0)}%`"
            ></div>
          </div>
        </div>

        <!-- Agotado -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
              <span class="text-sm font-medium text-gray-100">Agotado</span>
            </div>
            <span class="text-sm font-bold text-gray-400">{{ data?.agotado || 0 }}</span>
          </div>
          <div class="w-full bg-zinc-700 rounded-full h-3">
            <div 
              class="bg-gray-500 h-3 rounded-full transition-all duration-300" 
              :style="`width: ${getPercentage(data?.agotado || 0)}%`"
            ></div>
          </div>
        </div>

        <!-- Total -->
        <div class="pt-3 border-t border-zinc-700">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-400">Total de insumos</span>
            <span class="text-lg font-semibold text-gray-100">{{ total }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'DashboardCard07',
  props: {
    data: {
      type: Object,
      default: () => ({ optimo: 0, bajo: 0, critico: 0, agotado: 0 })
    }
  },
  setup(props) {
    const total = computed(() => {
      return (props.data?.optimo || 0) + 
             (props.data?.bajo || 0) + 
             (props.data?.critico || 0) + 
             (props.data?.agotado || 0)
    })

    const getPercentage = (value) => {
      if (total.value === 0) return 0
      return Math.round((value / total.value) * 100)
    }

    return {
      total,
      getPercentage
    }
  }
}
</script>