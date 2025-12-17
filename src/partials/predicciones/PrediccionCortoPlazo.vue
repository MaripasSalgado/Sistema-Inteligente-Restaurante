<template>
  <div class="flex flex-col col-span-full bg-zinc-900/80 border border-zinc-700/50 shadow-xs rounded-xl">
    <header class="px-5 py-4 border-b border-[#CCCCCC]">
      <h2 class="font-semibold text-gray-100">PREDICCIÓN MENSUAL - PRÓXIMO MES</h2>
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

      <!-- Content -->
      <div v-else>
        <!-- Header Info -->
        <div class="mb-4" v-if="periodo">
          <div class="text-sm text-gray-400 mb-2">Período: {{ periodo }}</div>
          <div class="text-xs text-gray-500">
            📈 Basado en {{ mesesHistoria }} meses de historial | 🎯 Confianza promedio: {{ confianzaPromedio }}%
          </div>
        </div>

        <!-- No Data State -->
        <div v-if="predicciones.length === 0" class="text-gray-400 text-center py-8">
          No hay predicciones disponibles.
          <button @click="generarPredicciones" class="text-blue-400 hover:text-blue-300 underline ml-2">
            Generar ahora
          </button>
        </div>

        <!-- Predictions List -->
        <div v-else class="space-y-4">
          <div
            v-for="pred in predicciones"
            :key="pred.id"
            class="flex items-center justify-between p-3 bg-zinc-800/60 rounded-lg border border-zinc-700/50"
          >
            <div class="flex items-center space-x-3">
              <div class="text-2xl">{{ getEmojiInsumo(pred.nombre) }}</div>
              <div>
                <div class="text-sm font-medium text-gray-100">{{ pred.nombre }}</div>
                <div class="text-xs text-gray-400">{{ pred.codigo || 'Insumo principal' }}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-lg font-bold text-gray-100">
                {{ formatearCantidad(pred.valor_predicho, pred.unidad_medida) }}
              </div>
              <div class="text-xs text-yellow-400">
                ±{{ formatearCantidad(pred.margen_error, pred.unidad_medida) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { PrediccionService } from '@/services/prediccionService'

export default {
  name: 'PrediccionCortoPlazo',
  setup() {
    const predicciones = ref([])
    const loading = ref(true)
    const error = ref(null)
    const mesesHistoria = ref(3)

    const periodo = computed(() => {
      if (predicciones.value.length === 0) return null
      const pred = predicciones.value[0]
      return PrediccionService.formatearPeriodo(pred.fecha_inicio, pred.fecha_fin)
    })

    const confianzaPromedio = computed(() => {
      if (predicciones.value.length === 0) return 0
      const sum = predicciones.value.reduce((acc, p) => acc + (p.nivel_confianza || 0), 0)
      return Math.round((sum / predicciones.value.length) * 100)
    })

    const cargarPredicciones = async () => {
      loading.value = true
      error.value = null

      console.log('🔄 [PrediccionCortoPlazo] Cargando predicciones...')

      try {
        // Sin filtro de fecha, siempre obtiene las predicciones futuras más recientes
        const data = await PrediccionService.getPrediccionesInsumosMensual()
        console.log('✅ [PrediccionCortoPlazo] Predicciones recibidas:', data.length)
        predicciones.value = data
      } catch (err) {
        error.value = 'Error al cargar predicciones'
        console.error('❌ [PrediccionCortoPlazo] Error:', err)
      } finally {
        loading.value = false
      }
    }

    const generarPredicciones = async () => {
      loading.value = true
      const result = await PrediccionService.generarPredicciones()

      if (result.success) {
        await cargarPredicciones()
      } else {
        error.value = 'Error al generar predicciones: ' + result.error
        loading.value = false
      }
    }

    const formatearCantidad = (valor, unidad) => {
      if (!valor) return '0' + unidad
      return Math.round(valor) + unidad
    }

    const getEmojiInsumo = (nombre) => {
      const nombreLower = nombre.toLowerCase()
      if (nombreLower.includes('carne') || nombreLower.includes('res')) return '🥩'
      if (nombreLower.includes('pollo')) return '🍗'
      if (nombreLower.includes('cerdo')) return '🥓'
      if (nombreLower.includes('cebolla')) return '🧅'
      if (nombreLower.includes('tomate')) return '🍅'
      if (nombreLower.includes('leche')) return '🥛'
      if (nombreLower.includes('queso')) return '🧀'
      if (nombreLower.includes('huevo')) return '🥚'
      if (nombreLower.includes('harina')) return '🌾'
      if (nombreLower.includes('aceite')) return '🫒'
      if (nombreLower.includes('arroz')) return '🍚'
      if (nombreLower.includes('frijol')) return '🫘'
      if (nombreLower.includes('papa') || nombreLower.includes('patata')) return '🥔'
      return '📦'
    }

    // Cargar predicciones al montar el componente
    cargarPredicciones()

    return {
      predicciones,
      loading,
      error,
      periodo,
      confianzaPromedio,
      mesesHistoria,
      generarPredicciones,
      formatearCantidad,
      getEmojiInsumo
    }
  }
}
</script>
