<template>
  <div v-if="warnings.length > 0" class="mt-4 p-4 bg-amber-900/30 border border-amber-500 rounded-lg">
    <div class="flex items-start space-x-3">
      <!-- Warning Icon -->
      <svg
        class="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>

      <div class="flex-1">
        <!-- Title -->
        <h4 class="text-sm font-medium text-amber-400 mb-2">
          Advertencia: Stock Insuficiente
        </h4>

        <!-- Description -->
        <p class="text-xs text-amber-300 mb-3">
          La venta se completó exitosamente, pero algunos insumos NO se descontaron del inventario porque no había suficiente stock disponible:
        </p>

        <!-- Warning List -->
        <ul class="space-y-2">
          <li
            v-for="(warning, index) in warnings"
            :key="index"
            class="text-sm text-gray-300"
          >
            <div v-if="warning.error" class="text-red-400">
              {{ warning.error }}
            </div>
            <div v-else>
              <strong class="text-amber-200">{{ warning.codigo || '' }} - {{ warning.insumo }}</strong>:
              Necesarios
              <span class="text-amber-400 font-semibold">{{ formatNumber(warning.cantidadNecesaria) }} {{ warning.unidad }}</span>,
              disponibles
              <span class="text-red-400 font-semibold">{{ formatNumber(warning.cantidadDisponible) }} {{ warning.unidad }}</span>
              (faltante: <span class="text-red-500 font-bold">{{ formatNumber(warning.diferencia) }} {{ warning.unidad }}</span>)
            </div>
          </li>
        </ul>

        <!-- Action Message -->
        <div class="mt-3 pt-3 border-t border-amber-600/50">
          <p class="text-xs text-amber-400 font-medium flex items-center">
            <svg class="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
            </svg>
            Acción requerida: Revisa el inventario y realiza pedidos a proveedores para reponer estos insumos.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  warnings: {
    type: Array,
    required: true,
    default: () => []
  }
})

const formatNumber = (num) => {
  if (typeof num !== 'number') return num
  return num.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
</script>

<style scoped>
/* Additional styles if needed */
</style>
