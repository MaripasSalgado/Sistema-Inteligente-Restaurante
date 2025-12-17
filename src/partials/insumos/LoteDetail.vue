<template>
  <div class="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/50 z-50" @click.self="$emit('cerrar')">
    <div class="bg-zinc-900/95 border border-zinc-700/50 rounded-lg shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex justify-between items-center p-6 border-b border-zinc-700/50">
        <div>
          <h2 class="text-2xl font-bold text-white">Lote: {{ lote?.lote || 'Sin número' }}</h2>
          <p class="text-gray-300 mt-1">{{ getInsumoNombre() }}</p>
        </div>
        <button
          @click="$emit('cerrar')"
          class="text-gray-400 hover:text-white transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <!-- Información General -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div class="bg-zinc-900/80 border border-zinc-700/50 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-white mb-3">Información del Lote</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-300">Número de Lote:</span>
                <span class="text-white font-mono">{{ lote?.lote || 'N/A' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-300">Proveedor:</span>
                <span class="text-white">{{ lote?.proveedor || 'No especificado' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-300">Estado:</span>
                <span
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  :class="getEstadoClass(lote?.estado)"
                >
                  {{ lote?.estado || 'Activo' }}
                </span>
              </div>
            </div>
          </div>

          <div class="bg-zinc-900/80 border border-zinc-700/50 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-white mb-3">Inventario</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-300">Cantidad Inicial:</span>
                <span class="text-white font-semibold">{{ lote?.cantidad_inicial || 0 }} {{ getInsumoUnidad() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-300">Cantidad Actual:</span>
                <span class="text-amber-400 font-bold text-xl">{{ lote?.cantidad_actual || 0 }} {{ getInsumoUnidad() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-300">Disponibilidad:</span>
                <span class="text-white">{{ calcularPorcentajeDisponible() }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Información Financiera -->
        <div class="bg-zinc-900/80 border border-zinc-700/50 rounded-lg p-4 mb-8">
          <h3 class="text-lg font-semibold text-white mb-3">Información Financiera</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span class="text-gray-300 text-sm">Precio Unitario</span>
              <div class="text-white font-bold text-xl">₡{{ formatearPrecio(lote?.precio_unitario) }}</div>
            </div>
            <div>
              <span class="text-gray-300 text-sm">Valor Inicial</span>
              <div class="text-white font-bold text-xl">₡{{ formatearPrecio(calcularValorInicial()) }}</div>
            </div>
            <div>
              <span class="text-gray-300 text-sm">Valor Actual</span>
              <div class="text-amber-400 font-bold text-xl">₡{{ formatearPrecio(calcularValorActual()) }}</div>
            </div>
          </div>
        </div>

        <!-- Fechas -->
        <div class="bg-zinc-900/80 border border-zinc-700/50 rounded-lg p-4 mb-8">
          <h3 class="text-lg font-semibold text-white mb-3">Fechas Importantes</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span class="text-gray-300 text-sm">Fecha de Ingreso</span>
              <div class="text-white font-medium">{{ formatearFecha(lote?.fecha_ingreso) }}</div>
            </div>
            <div>
              <span class="text-gray-300 text-sm">Fecha de Vencimiento</span>
              <div :class="getVencimientoClass(lote?.fecha_vencimiento)" class="font-medium">
                {{ formatearFecha(lote?.fecha_vencimiento) }}
                <span v-if="lote?.fecha_vencimiento" class="text-xs ml-2">
                  ({{ calcularDiasRestantes() }})
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Observaciones -->
        <div v-if="lote?.observaciones" class="bg-zinc-900/80 border border-zinc-700/50 rounded-lg p-4 mb-8">
          <h3 class="text-lg font-semibold text-white mb-3">Observaciones</h3>
          <p class="text-gray-300">{{ lote.observaciones }}</p>
        </div>

        <!-- Alertas de vencimiento -->
        <div v-if="mostrarAlertaVencimiento()" class="bg-yellow-900 border border-yellow-600 rounded-lg p-4 mb-8">
          <div class="flex items-start">
            <svg class="w-6 h-6 text-yellow-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <div>
              <h4 class="text-yellow-400 font-semibold">Advertencia de Vencimiento</h4>
              <p class="text-yellow-200 text-sm mt-1">{{ getMensajeVencimiento() }}</p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-4">
          <button
            @click="$emit('cerrar')"
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
          >
            Cerrar
          </button>
          <button
            @click="$emit('editar', lote)"
            class="px-4 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition-colors"
          >
            Editar Lote
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoteDetail',
  props: {
    lote: {
      type: Object,
      required: true
    },
    insumos: {
      type: Array,
      default: () => []
    }
  },
  emits: ['cerrar', 'editar'],
  setup(props) {
    // Funciones de utilidad
    const getInsumoNombre = () => {
      const insumo = props.insumos.find(i => i.id === props.lote?.insumo_id)
      return insumo?.nombre || 'Insumo no encontrado'
    }

    const getInsumoUnidad = () => {
      const insumo = props.insumos.find(i => i.id === props.lote?.insumo_id)
      return insumo?.unidad_medida || 'unidades'
    }

    const formatearFecha = (fecha) => {
      if (!fecha) return 'No especificada'
      return new Date(fecha).toLocaleDateString('es-CR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const formatearPrecio = (precio) => {
      if (!precio) return '0.00'
      return Number(precio).toLocaleString('es-CR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    }

    const calcularPorcentajeDisponible = () => {
      if (!props.lote?.cantidad_inicial || !props.lote?.cantidad_actual) return 0
      return Math.round((props.lote.cantidad_actual / props.lote.cantidad_inicial) * 100)
    }

    const calcularValorInicial = () => {
      if (!props.lote?.cantidad_inicial || !props.lote?.precio_unitario) return 0
      return props.lote.cantidad_inicial * props.lote.precio_unitario
    }

    const calcularValorActual = () => {
      if (!props.lote?.cantidad_actual || !props.lote?.precio_unitario) return 0
      return props.lote.cantidad_actual * props.lote.precio_unitario
    }

    const getVencimientoClass = (fecha) => {
      if (!fecha) return 'text-gray-400'
      const hoy = new Date()
      const vencimiento = new Date(fecha)
      const diasRestantes = Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24))
      
      if (diasRestantes < 0) return 'text-red-400'
      if (diasRestantes <= 7) return 'text-yellow-400'
      return 'text-green-400'
    }

    const calcularDiasRestantes = () => {
      if (!props.lote?.fecha_vencimiento) return ''
      const hoy = new Date()
      const vencimiento = new Date(props.lote.fecha_vencimiento)
      const diasRestantes = Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24))
      
      if (diasRestantes < 0) return `Vencido hace ${Math.abs(diasRestantes)} días`
      if (diasRestantes === 0) return 'Vence hoy'
      if (diasRestantes === 1) return 'Vence mañana'
      return `${diasRestantes} días restantes`
    }

    const mostrarAlertaVencimiento = () => {
      if (!props.lote?.fecha_vencimiento) return false
      const hoy = new Date()
      const vencimiento = new Date(props.lote.fecha_vencimiento)
      const diasRestantes = Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24))
      return diasRestantes <= 7 // Mostrar alerta si quedan 7 días o menos
    }

    const getMensajeVencimiento = () => {
      if (!props.lote?.fecha_vencimiento) return ''
      const hoy = new Date()
      const vencimiento = new Date(props.lote.fecha_vencimiento)
      const diasRestantes = Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24))
      
      if (diasRestantes < 0) return 'Este lote ya está vencido. Considera retirarlo del inventario.'
      if (diasRestantes === 0) return 'Este lote vence hoy. Úsalo con prioridad.'
      if (diasRestantes <= 3) return `Este lote vence en ${diasRestantes} días. Prioriza su uso.`
      return `Este lote vence pronto (${diasRestantes} días). Planifica su uso.`
    }

    const getEstadoClass = (estado) => {
      switch (estado) {
        case 'Activo':
          return 'bg-green-100 text-green-800'
        case 'Agotado':
          return 'bg-gray-100 text-gray-800'
        case 'Vencido':
          return 'bg-red-100 text-red-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }

    return {
      getInsumoNombre,
      getInsumoUnidad,
      formatearFecha,
      formatearPrecio,
      calcularPorcentajeDisponible,
      calcularValorInicial,
      calcularValorActual,
      getVencimientoClass,
      calcularDiasRestantes,
      mostrarAlertaVencimiento,
      getMensajeVencimiento,
      getEstadoClass
    }
  }
}
</script>

