<template>
  <div class="flex flex-col col-span-full sm:col-span-6 xl:col-span-6 bg-zinc-900/80 border border-zinc-700/50 shadow-xs rounded-xl">
    <header class="px-5 py-4 border-b border-[#CCCCCC]">
      <h2 class="font-semibold text-gray-100">COMPARATIVO VS HISTÓRICO - Ingresos Mensuales</h2>
    </header>
    <div class="p-5">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-red-400 text-sm py-4 text-center">
        {{ error }}
      </div>

      <!-- No Data -->
      <div v-else-if="comparaciones.length === 0" class="text-gray-400 text-center py-8">
        No hay datos históricos suficientes para comparar.
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-700">
              <th class="text-left py-3 px-2 text-gray-400 font-medium">Mes</th>
              <th class="text-center py-3 px-2 text-gray-400 font-medium">Predicción 2025</th>
              <th class="text-center py-3 px-2 text-gray-400 font-medium">Real</th>
              <th class="text-center py-3 px-2 text-gray-400 font-medium">Variación</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            <tr
              v-for="item in comparaciones"
              :key="item.mes"
              class="hover:bg-zinc-800/50"
            >
              <!-- Mes -->
              <td class="py-3 px-2 text-gray-100 font-medium">
                {{ item.mes }}
              </td>

              <!-- Predicción -->
              <td class="py-3 px-2 text-center text-gray-100">
                {{ formatearMoneda(item.prediccion) }}
              </td>

              <!-- Real -->
              <td class="py-3 px-2 text-center text-gray-100">
                {{ item.real ? formatearMoneda(item.real) : '-' }}
              </td>

              <!-- Variación -->
              <td class="py-3 px-2 text-center">
                <span
                  v-if="item.variacion !== null"
                  :class="item.variacion >= 0 ? 'text-green-400' : 'text-red-400'"
                  class="font-medium"
                >
                  {{ formatearPorcentaje(item.variacion) }}
                </span>
                <span v-else class="text-gray-500">-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { PrediccionService } from '@/services/prediccionService'

export default {
  name: 'ComparacionHistorica',
  setup() {
    const comparaciones = ref([])
    const loading = ref(true)
    const error = ref(null)

    const cargarComparaciones = async () => {
      loading.value = true
      error.value = null

      try {
        // Obtener tendencias históricas de ingresos (últimos 12 meses)
        const data = await PrediccionService.getTendenciasHistoricas('ingresos', 12)

        // Procesar datos para la tabla
        comparaciones.value = data.labels.map((label, index) => {
          const prediccion = data.predicciones[index]
          const real = data.valoresReales[index]

          // Calcular variación porcentual
          let variacion = null
          if (real && prediccion) {
            variacion = ((real - prediccion) / prediccion) * 100
          }

          return {
            mes: label,
            prediccion: prediccion,
            real: real,
            variacion: variacion
          }
        }).reverse() // Más reciente primero
        .slice(0, 6) // Solo los últimos 6 meses

      } catch (err) {
        error.value = 'Error al cargar comparaciones'
        console.error(err)
      } finally {
        loading.value = false
      }
    }

    const formatearMoneda = (valor) => {
      if (!valor && valor !== 0) return '-'
      return new Intl.NumberFormat('es-CR', {
        style: 'currency',
        currency: 'CRC',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(valor)
    }

    const formatearPorcentaje = (porcentaje) => {
      if (!porcentaje && porcentaje !== 0) return '-'
      const signo = porcentaje > 0 ? '+' : ''
      return signo + porcentaje.toFixed(1) + '%'
    }

    onMounted(() => {
      cargarComparaciones()
    })

    return {
      comparaciones,
      loading,
      error,
      formatearMoneda,
      formatearPorcentaje
    }
  }
}
</script> 
