<template>
  <div class="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-zinc-900/80 border border-zinc-700/50 shadow-xs rounded-xl">
    <header class="px-5 py-4 border-b border-zinc-700">
      <div class="flex items-center justify-between">
        <h2 class="font-semibold text-gray-100">Próximos a Vencer</h2>
        <span v-if="insumos?.length > 0" class="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">
          {{ insumos.length }}
        </span>
      </div>
    </header>
    <div class="p-5">
      <div v-if="insumos && insumos.length > 0" class="space-y-3 overflow-y-auto">
        <div v-for="insumo in insumos" :key="insumo.lote"
             class="flex items-start space-x-3 p-3 rounded-lg"
             :class="getAlertClass(insumo.diasRestantes)">
          <div :class="getIconClass(insumo.diasRestantes)" class="mt-0.5">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium text-gray-100 truncate">{{ insumo.nombre }}</div>
            <div class="text-xs text-gray-400 mt-1">
              Lote: {{ insumo.lote }} • {{ insumo.cantidad }} unidades
            </div>
            <div class="text-xs mt-1" :class="getDiasClass(insumo.diasRestantes)">
              <span v-if="insumo.diasRestantes === 0">Vence hoy</span>
              <span v-else-if="insumo.diasRestantes === 1">Vence mañana</span>
              <span v-else>Vence en {{ insumo.diasRestantes }} días</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-8">
        <svg class="mx-auto h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="mt-2 text-sm text-gray-400">No hay insumos próximos a vencer</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardCard08',
  props: {
    insumos: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const getAlertClass = (dias) => {
      if (dias === 0) return 'bg-red-900/20 border border-red-500/30'
      if (dias <= 2) return 'bg-orange-900/20 border border-orange-500/30'
      return 'bg-yellow-900/20 border border-yellow-500/30'
    }

    const getIconClass = (dias) => {
      if (dias === 0) return 'text-red-400'
      if (dias <= 2) return 'text-orange-400'
      return 'text-yellow-400'
    }

    const getDiasClass = (dias) => {
      if (dias === 0) return 'text-red-400 font-medium'
      if (dias <= 2) return 'text-orange-400'
      return 'text-yellow-400'
    }

    return {
      getAlertClass,
      getIconClass,
      getDiasClass
    }
  }
}
</script>