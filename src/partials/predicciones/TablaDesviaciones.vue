<template>
  <div class="flex flex-col col-span-full sm:col-span-6 xl:col-span-6 bg-zinc-900/80 border border-zinc-700/50 shadow-xs rounded-xl">
    <header class="px-5 py-4 border-b border-[#CCCCCC]">
      <h2 class="font-semibold text-gray-100">Tabla de Desviaciones - Precisión del Modelo</h2>
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
      <div v-else-if="desviaciones.length === 0" class="text-gray-400 text-center py-8">
        No hay datos de desviaciones. Las predicciones aún no han sido evaluadas.
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-700">
              <th class="text-left py-3 px-2 text-gray-400 font-medium">Insumo/Producto</th>
              <th class="text-center py-3 px-2 text-gray-400 font-medium">Estimado</th>
              <th class="text-center py-3 px-2 text-gray-400 font-medium">Real</th>
              <th class="text-center py-3 px-2 text-gray-400 font-medium">Desviación</th>
              <th class="text-center py-3 px-2 text-gray-400 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            <tr
              v-for="item in desviaciones"
              :key="item.nombre + item.fecha_inicio"
              class="hover:bg-zinc-800/50"
            >
              <!-- Nombre -->
              <td class="py-3 px-2 text-gray-100 font-medium">
                {{ item.nombre }}
                <div class="text-xs text-gray-500">{{ formatearFecha(item.fecha_fin) }}</div>
              </td>

              <!-- Estimado -->
              <td class="py-3 px-2 text-center text-gray-100">
                {{ formatearValor(item.estimado, item.tipo) }}
              </td>

              <!-- Real -->
              <td class="py-3 px-2 text-center text-gray-100">
                {{ formatearValor(item.real, item.tipo) }}
              </td>

              <!-- Desviación -->
              <td class="py-3 px-2 text-center">
                <span
                  :class="getColorDesviacion(item.porcentaje_desviacion)"
                  class="font-medium"
                >
                  {{ formatearPorcentaje(item.porcentaje_desviacion) }}
                </span>
              </td>

              <!-- Estado -->
              <td class="py-3 px-2 text-center">
                <span
                  :class="getClaseEstado(item.porcentaje_desviacion)"
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ getEmojiEstado(item.porcentaje_desviacion) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Legend -->
      <div v-if="desviaciones.length > 0" class="mt-4 flex items-center justify-center space-x-6 text-xs">
        <div class="flex items-center space-x-2">
          <div class="w-3 h-3 bg-green-500 rounded-full"></div>
          <span class="text-gray-400">🟢 <10% desviación</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span class="text-gray-400">🟡 10-20% desviación</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-3 h-3 bg-red-500 rounded-full"></div>
          <span class="text-gray-400">🔴 >20% desviación</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { PrediccionService } from '@/services/prediccionService'

export default {
  name: 'TablaDesviaciones',
  setup() {
    const desviaciones = ref([])
    const loading = ref(true)
    const error = ref(null)

    const cargarDesviaciones = async () => {
      loading.value = true
      error.value = null

      try {
        // Obtener las 10 desviaciones más recientes
        const data = await PrediccionService.getDesviacionesRecientes(10)
        desviaciones.value = data
      } catch (err) {
        error.value = 'Error al cargar desviaciones'
        console.error(err)
      } finally {
        loading.value = false
      }
    }

    const formatearValor = (valor, tipo) => {
      if (!valor && valor !== 0) return '-'

      if (tipo === 'ventas_productos' || tipo === 'ingresos') {
        return new Intl.NumberFormat('es-CR', {
          style: 'currency',
          currency: 'CRC',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(valor)
      }

      // Para insumos, asumimos kg
      return Math.round(valor) + 'kg'
    }

    const formatearPorcentaje = (porcentaje) => {
      if (!porcentaje && porcentaje !== 0) return '-'
      const signo = porcentaje > 0 ? '+' : ''
      return signo + Math.round(porcentaje) + '%'
    }

    const formatearFecha = (fecha) => {
      return new Date(fecha).toLocaleDateString('es-ES', {
        month: 'short',
        year: 'numeric'
      })
    }

    const getColorDesviacion = (porcentaje) => {
      const abs = Math.abs(porcentaje || 0)
      if (abs <= 10) return 'text-green-400'
      if (abs <= 20) return 'text-yellow-400'
      return 'text-red-400'
    }

    const getClaseEstado = (porcentaje) => {
      const abs = Math.abs(porcentaje || 0)
      if (abs <= 10) return 'bg-green-900/20 text-green-400 border border-green-500/30'
      if (abs <= 20) return 'bg-yellow-900/20 text-yellow-400 border border-yellow-500/30'
      return 'bg-red-900/20 text-red-400 border border-red-500/30'
    }

    const getEmojiEstado = (porcentaje) => {
      const abs = Math.abs(porcentaje || 0)
      if (abs <= 10) return '🟢'
      if (abs <= 20) return '🟡'
      return '🔴'
    }

    onMounted(() => {
      cargarDesviaciones()
    })

    return {
      desviaciones,
      loading,
      error,
      formatearValor,
      formatearPorcentaje,
      formatearFecha,
      getColorDesviacion,
      getClaseEstado,
      getEmojiEstado
    }
  }
}
</script> 
