<template>
  <div class="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-zinc-900/80 border border-zinc-700/50 shadow-lg rounded-xl">
    <div class="px-5 pt-5 pb-5">
      <header class="flex justify-between items-start mb-2">
        <h2 class="text-lg font-semibold text-gray-100 mb-0">Ventas del Mes</h2>
        <div :class="tendenciaClass">
          <svg v-if="comparacion?.tendencia === 'alza'" class="w-5 h-5 fill-current" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414-1.414L15.586 7H12z" clip-rule="evenodd" />
          </svg>
          <svg v-else-if="comparacion?.tendencia === 'baja'" class="w-5 h-5 fill-current" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 1.414L15.586 13H12z" clip-rule="evenodd" />
          </svg>
          <svg v-else class="w-5 h-5 fill-current" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
      </header>
      <div class="text-3xl font-bold text-gray-100 mb-1">₡{{ formatCurrency(comparacion?.hoy || 0) }}</div>
      <div class="flex items-center gap-2 mb-3">
        <span :class="cambioClass" class="text-sm font-medium">
          {{ comparacion?.cambio > 0 ? '+' : '' }}{{ comparacion?.cambio || 0 }}%
        </span>
        <span class="text-xs text-gray-400">vs mes anterior (₡{{ formatCurrency(comparacion?.ayer || 0) }})</span>
      </div>
      <div class="flex items-center">
        <div class="text-xs text-gray-400">Meta: ₡6,000,000</div>
        <div class="flex-1 ml-2">
          <div class="w-full bg-zinc-700 rounded-full h-2">
            <div class="bg-green-500 h-2 rounded-full transition-all duration-500"
                 :style="`width: ${Math.min(((comparacion?.hoy || 0) / 6000000) * 100, 100)}%`"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'DashboardCard01',
  props: {
    comparacion: {
      type: Object,
      default: () => ({ hoy: 0, ayer: 0, cambio: 0, tendencia: 'estable' })
    }
  },
  setup(props) {
    const tendenciaClass = computed(() => {
      if (props.comparacion?.tendencia === 'alza') return 'text-green-400'
      if (props.comparacion?.tendencia === 'baja') return 'text-red-400'
      return 'text-gray-400'
    })

    const cambioClass = computed(() => {
      if (props.comparacion?.cambio > 0) return 'text-green-400'
      if (props.comparacion?.cambio < 0) return 'text-red-400'
      return 'text-gray-400'
    })

    const formatCurrency = (value) => {
      return value.toLocaleString('es-CR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    }

    return {
      tendenciaClass,
      cambioClass,
      formatCurrency
    }
  }
}
</script>