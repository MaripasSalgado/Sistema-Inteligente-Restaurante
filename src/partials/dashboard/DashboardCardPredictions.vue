<template>
  <div class="col-span-full xl:col-span-6 bg-zinc-900/80 border border-zinc-700/50 shadow-xs rounded-xl">
    <header class="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex justify-between items-center">
      <h2 class="font-semibold text-gray-800 dark:text-gray-100">Predicciones de Ventas (Próximos Días)</h2>
      <div class="text-xs font-semibold text-violet-500 bg-violet-500/20 px-2 py-1 rounded-full">IA Powered</div>
    </header>
    <div class="p-3">
      <div class="overflow-x-auto">
        <table class="table-auto w-full">
          <thead class="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-zinc-700/50">
            <tr>
              <th class="p-2 whitespace-nowrap">
                <div class="font-semibold text-left">Fecha</div>
              </th>
              <th class="p-2 whitespace-nowrap">
                <div class="font-semibold text-left">Producto</div>
              </th>
              <th class="p-2 whitespace-nowrap">
                <div class="font-semibold text-left">Predicción</div>
              </th>
              <th class="p-2 whitespace-nowrap">
                <div class="font-semibold text-center">Confianza</div>
              </th>
            </tr>
          </thead>
          <tbody class="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
            <tr v-for="pred in predicciones" :key="pred.id">
              <td class="p-2 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="font-medium text-gray-800 dark:text-gray-100">{{ formatDate(pred.fecha_inicio) }}</div>
                </div>
              </td>
              <td class="p-2 whitespace-nowrap">
                <div class="text-left">Ventas Generales</div>
              </td>
              <td class="p-2 whitespace-nowrap">
                <div class="text-left font-medium text-green-500">₡{{ Number(pred.valor_predicho).toLocaleString() }}</div>
              </td>
              <td class="p-2 whitespace-nowrap">
                <div class="text-center">{{ (pred.nivel_confianza * 100).toFixed(0) }}%</div>
              </td>
            </tr>
            <tr v-if="!predicciones || predicciones.length === 0">
              <td colspan="4" class="p-4 text-center text-gray-500">No hay predicciones disponibles</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardCardPredictions',
  props: {
    predicciones: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const formatDate = (dateString) => {
      if (!dateString) return ''
      const options = { weekday: 'short', day: 'numeric', month: 'short' }
      return new Date(dateString).toLocaleDateString('es-ES', options)
    }

    return {
      formatDate
    }
  }
}
</script>
