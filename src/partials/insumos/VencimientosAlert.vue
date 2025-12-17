<template>
  <div class="bg-orange-900 border border-orange-300 rounded-lg p-4 mb-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="flex-shrink-0">
          <svg class="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-orange-200">
            Alertas de Vencimiento
          </h3>
          <p class="text-orange-300 text-sm">
            {{ alertas.length }} insumo(s) próximo(s) a vencer
          </p>
        </div>
      </div>
      <button
        @click="mostrarDetalles = !mostrarDetalles"
        class="text-orange-400 hover:text-orange-300 transition-colors"
      >
        <svg 
          class="w-5 h-5 transform transition-transform"
          :class="{ 'rotate-180': mostrarDetalles }"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>

    <!-- Lista de alertas -->
    <div v-if="mostrarDetalles" class="mt-4 space-y-3">
      <div
        v-for="alerta in alertas"
        :key="alerta.id"
        class="bg-orange-800 border border-orange-200 rounded-lg p-3 flex items-center justify-between"
      >
        <div class="flex items-center space-x-3">
          <div class="flex-shrink-0">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
              :class="getPrioridadClass(alerta.prioridad)"
            >
              {{ alerta.nombre.charAt(0) }}
            </div>
          </div>
          <div>
            <h4 class="text-white font-medium">{{ alerta.nombre }}</h4>
            <p class="text-orange-200 text-sm">
              Lote: {{ alerta.lote }} | 
              Stock: {{ alerta.cantidadActual }} {{ alerta.unidadMedida }}
            </p>
            <p class="text-orange-300 text-xs">
              Vence: {{ formatearFecha(alerta.fechaVencimiento) }}
            </p>
          </div>
        </div>
        
        <div class="flex items-center space-x-2">
          <span
            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
            :class="getPrioridadBadgeClass(alerta.prioridad)"
          >
            {{ getPrioridadTexto(alerta.prioridad) }}
          </span>
          <button
            @click="$emit('ver-insumo', alerta)"
            class="text-orange-400 hover:text-orange-300 text-sm font-medium"
          >
            Ver detalles
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'VencimientosAlert',
  props: {
    alertas: {
      type: Array,
      required: true
    }
  },
  emits: ['ver-insumo'],
  setup() {
    const mostrarDetalles = ref(false)

    const getPrioridadClass = (prioridad) => {
      const clases = {
        'critica': 'bg-red-500',
        'alta': 'bg-orange-500',
        'media': 'bg-yellow-500',
        'baja': 'bg-green-500'
      }
      return clases[prioridad] || 'bg-gray-500'
    }

    const getPrioridadBadgeClass = (prioridad) => {
      const clases = {
        'critica': 'bg-red-100 text-red-800',
        'alta': 'bg-orange-100 text-orange-800',
        'media': 'bg-yellow-100 text-yellow-800',
        'baja': 'bg-green-100 text-green-800'
      }
      return clases[prioridad] || 'bg-gray-100 text-gray-800'
    }

    const getPrioridadTexto = (prioridad) => {
      const textos = {
        'critica': 'Crítica',
        'alta': 'Alta',
        'media': 'Media',
        'baja': 'Baja'
      }
      return textos[prioridad] || 'Normal'
    }

    const formatearFecha = (fecha) => {
      return new Date(fecha).toLocaleDateString('es-ES')
    }

    return {
      mostrarDetalles,
      getPrioridadClass,
      getPrioridadBadgeClass,
      getPrioridadTexto,
      formatearFecha
    }
  }
}
</script>