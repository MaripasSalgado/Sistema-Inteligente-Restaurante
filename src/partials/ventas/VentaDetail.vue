<template>
  <div class="fixed inset-0 backdrop-blur-sm bg-zinc-900/95 overflow-y-auto h-full w-full z-50">
    <div class="relative top-10 mx-auto p-5 border border-zinc-700/50 w-full max-w-4xl shadow-2xl rounded-md bg-zinc-900/95">
      
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-white">Venta {{ venta.numeroOrden }}</h2>
          <p class="text-gray-400">{{ venta.fechaLegible || venta.fecha }} - {{ venta.hora }}</p>
        </div>
        <div class="flex items-center space-x-3">
          <span
            :class="['px-3 py-1 text-sm font-medium rounded-full border', getEstadoClass(venta.estado)]"
          >
            {{ venta.estado }}
          </span>
          <button
            @click="$emit('cerrar')"
            class="text-gray-400 hover:text-white"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Información del cliente -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="bg-zinc-900/50 border border-zinc-700/50 rounded-lg p-4">
          <h3 class="text-lg font-medium text-white mb-4">Información del Cliente</h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-300">Cliente:</span>
              <span class="text-white font-medium">{{ venta.cliente }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-300">Teléfono:</span>
              <span class="text-white">{{ venta.telefono || 'No especificado' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-300">Dirección:</span>
              <span class="text-white">{{ venta.direccion || 'No especificada' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-300">Tipo de Venta:</span>
              <span class="text-white">{{ venta.tipoVenta }}</span>
            </div>
          </div>
        </div>

        <div class="bg-zinc-900/50 border border-zinc-700/50 rounded-lg p-4">
          <h3 class="text-lg font-medium text-white mb-4">Información de Pago</h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-300">Método de Pago:</span>
              <span class="text-white">{{ venta.metodoPago }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-300">Empleado:</span>
              <span class="text-white">{{ venta.empleado }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-300">Subtotal:</span>
              <span class="text-white">₡{{ venta.subtotal }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-300">Impuesto:</span>
              <span class="text-white">₡{{ venta.impuesto }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-300">Descuento:</span>
              <span class="text-white">₡{{ venta.descuento }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-300">Total:</span>
              <span class="text-yellow-400 font-bold text-lg">₡{{ venta.total }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Productos -->
      <div class="bg-zinc-900/50 border border-zinc-700/50 rounded-lg p-4 mb-6">
        <h3 class="text-lg font-medium text-white mb-4">Productos</h3>
        <div class="space-y-3">
          <div
            v-for="producto in venta.productos"
            :key="producto.id"
            class="flex items-center justify-between p-3 border border-zinc-700/50 rounded-lg bg-zinc-900/30"
          >
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <span class="text-white font-medium">{{ producto.nombre }}</span>
                <span class="text-gray-400 text-sm">₡{{ producto.precioUnitario }}/unidad</span>
              </div>
              <div class="flex items-center justify-between mt-2">
                <span class="text-sm text-gray-300">Cantidad: {{ producto.cantidad }} unidades</span>
                <span class="text-sm text-yellow-400">Subtotal: ₡{{ producto.subtotal }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Notas -->
      <div v-if="venta.notas" class="bg-zinc-900/50 border border-zinc-700/50 rounded-lg p-4 mb-6">
        <h3 class="text-lg font-medium text-white mb-3">Notas</h3>
        <p class="text-gray-300">{{ venta.notas }}</p>
      </div>

      <!-- Botones de acción -->
      <div class="flex justify-end space-x-3">
        <button
          @click="$emit('cerrar')"
          class="px-4 py-2 text-sm font-medium text-white bg-zinc-700/50 rounded-lg hover:bg-zinc-600/50 transition-colors"
        >
          Cerrar
        </button>
        <button
          @click="$emit('editar', venta)"
          class="px-4 py-2 text-sm font-medium text-white bg-yellow-400 rounded-lg hover:bg-yellow-300 transition-colors"
        >
          Editar Venta
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VentaDetail',
  props: {
    venta: {
      type: Object,
      required: true
    }
  },
  emits: ['cerrar', 'editar'],
  setup() {
    const getEstadoClass = (estado) => {
      switch (estado) {
        case 'Completada':
          return 'bg-green-500/10 text-green-300 border-green-500/30'
        case 'En Proceso':
          return 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30'
        case 'Pendiente':
          return 'bg-blue-500/10 text-blue-300 border-blue-500/30'
        case 'Cancelada':
          return 'bg-red-500/10 text-red-300 border-red-500/30'
        default:
          return 'bg-gray-500/10 text-gray-300 border-gray-500/30'
      }
    }

    return {
      getEstadoClass
    }
  }
}
</script> 
