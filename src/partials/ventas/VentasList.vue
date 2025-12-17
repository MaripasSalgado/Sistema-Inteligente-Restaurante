<template>
  <div class="space-y-6">
    <!-- Filtros y búsqueda -->
    <div style="background-color: rgb(24 24 27 / 0.8);" class="border border-zinc-700/50 rounded-lg shadow-sm p-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Búsqueda por cliente -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Buscar Cliente</label>
          <input
            v-model="filtros.cliente"
            type="text"
            placeholder="Nombre del cliente..."
            class="w-full px-3 py-2 border border-zinc-700/50 rounded-lg bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            style="background-color: rgb(20 20 23 / 0.6);"
          />
        </div>

        <!-- Filtro por estado -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Estado</label>
          <select
            v-model="filtros.estado"
            class="w-full px-3 py-2 border border-zinc-700/50 rounded-lg bg-zinc-900/50 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="">Todos los estados</option>
            <option value="Completada">Completada</option>
            <option value="En Proceso">En Proceso</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>

        <!-- Filtro por tipo de venta -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Tipo de Venta</label>
          <select
            v-model="filtros.tipoVenta"
            class="w-full px-3 py-2 border border-zinc-700/50 rounded-lg bg-zinc-900/50 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="">Todos los tipos</option>
            <option value="Local">Local</option>
            <option value="Para Llevar">Para Llevar</option>
            <option value="Domicilio">Domicilio</option>
          </select>
        </div>

        <!-- Filtro por fecha -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Fecha</label>
          <input
            v-model="filtros.fecha"
            type="date"
            class="w-full px-3 py-2 border border-zinc-700/50 rounded-lg bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            style="background-color: rgb(20 20 23 / 0.6);"
          />
        </div>
      </div>
    </div>

    <!-- Tabla de ventas -->
    <div style="background-color: rgb(24 24 27 / 0.6);" class="border border-zinc-700/50 rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-zinc-700/50">
          <thead class="bg-zinc-900/50 border-b border-zinc-700/50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Orden
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Cliente
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Fecha/Hora
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Tipo
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Total
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-700/50">
            <tr
              v-for="venta in ventasFiltradas"
              :key="venta.id"
              class="hover:border-yellow-400 transition-colors border border-transparent"
              style="background-color: rgb(24 24 27 / 0.8);"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-white">{{ venta.numeroOrden }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-white">{{ venta.cliente }}</div>
                  <div class="text-sm text-gray-400">{{ venta.telefono }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm text-white">{{ venta.fechaLegible || venta.fecha }}</div>
                  <div class="text-sm text-gray-400">{{ venta.hora }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="getTipoVentaClass(venta.tipoVenta)">
                  {{ venta.tipoVenta }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="getEstadoClass(venta.estado)">
                  {{ venta.estado }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-bold text-yellow-400">₡{{ venta.total }}</div>
                <div class="text-xs text-gray-400">{{ venta.productos.length }} productos</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-3 text-gray-300">
                  <button
                    @click="$emit('ver-venta', venta)"
                    class="p-2 rounded-full bg-zinc-900/50 hover:bg-zinc-900/70 text-blue-300 hover:text-blue-200 transition-colors"
                    aria-label="Ver venta"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M1.5 12s3.75-6.75 10.5-6.75S22.5 12 22.5 12s-3.75 6.75-10.5 6.75S1.5 12 1.5 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                  <button
                    @click="$emit('editar-venta', venta)"
                    class="p-2 rounded-full bg-zinc-900/50 hover:bg-zinc-900/70 text-yellow-300 hover:text-yellow-200 transition-colors"
                    aria-label="Editar venta"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L7.5 20.036H4v-3.536L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    @click="confirmarEliminacion(venta)"
                    class="p-2 rounded-full bg-zinc-900/50 hover:bg-zinc-900/70 text-red-300 hover:text-red-200 transition-colors"
                    aria-label="Eliminar venta"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M4 6h16M6 6v14a2 2 0 002 2h8a2 2 0 002-2V6" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M10 11v6M14 11v6" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Mensaje cuando no hay ventas -->
    <div v-if="ventasFiltradas.length === 0" class="bg-zinc-900/50 text-center py-12 border border-dashed border-zinc-700/50 rounded-lg">
      <div class="text-gray-400">
        <svg class="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="text-lg font-medium text-white mb-2">No se encontraron ventas</h3>
        <p class="text-gray-400">Intenta ajustar los filtros de búsqueda</p>
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <div v-if="mostrarModalEliminacion" class="fixed inset-0 backdrop-blur-sm bg-zinc-900/95 flex items-center justify-center z-50">
      <div class="bg-zinc-900/95 border border-zinc-700/50 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-medium text-white mb-4">Confirmar eliminación</h3>
        <p class="text-gray-300 mb-6">
          ¿Estás seguro de que quieres eliminar la venta "{{ ventaAEliminar?.numeroOrden }}"?
          Esta acción no se puede deshacer.
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="cancelarEliminacion"
            class="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="eliminarVentaConfirmado"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-500 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { formatearDolaresAColones } from '@/utils/currencyHelper'

export default {
  name: 'VentasList',
  props: {
    ventas: {
      type: Array,
      required: true
    }
  },
  emits: ['editar-venta', 'ver-venta', 'eliminar-venta'],
  setup(props, { emit }) {
    const filtros = ref({
      cliente: '',
      estado: '',
      tipoVenta: '',
      fecha: ''
    })

    const mostrarModalEliminacion = ref(false)
    const ventaAEliminar = ref(null)

    const ventasFiltradas = computed(() => {
      return props.ventas.filter(venta => {
        // Filtro por cliente
        if (filtros.value.cliente && !venta.cliente.toLowerCase().includes(filtros.value.cliente.toLowerCase())) {
          return false
        }

        // Filtro por estado
        if (filtros.value.estado && venta.estado !== filtros.value.estado) {
          return false
        }

        // Filtro por tipo de venta
        if (filtros.value.tipoVenta && venta.tipoVenta !== filtros.value.tipoVenta) {
          return false
        }

        // Filtro por fecha
        if (filtros.value.fecha && venta.fecha !== filtros.value.fecha) {
          return false
        }

        return true
      })
    })

    const getEstadoClass = (estado) => {
      switch (estado) {
        case 'Completada':
          return 'bg-green-500/10 text-green-300 border border-green-500/30'
        case 'En Proceso':
          return 'bg-yellow-500/10 text-yellow-300 border border-yellow-500/30'
        case 'Pendiente':
          return 'bg-blue-500/10 text-blue-300 border border-blue-500/30'
        case 'Cancelada':
          return 'bg-red-500/10 text-red-300 border border-red-500/30'
        default:
          return 'bg-gray-500/10 text-gray-300 border border-gray-500/30'
      }
    }

    const getTipoVentaClass = (tipo) => {
      switch (tipo) {
        case 'Local':
          return 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30'
        case 'Para Llevar':
          return 'bg-purple-500/10 text-purple-300 border border-purple-500/30'
        case 'Domicilio':
          return 'bg-orange-500/10 text-orange-300 border border-orange-500/30'
        default:
          return 'bg-gray-500/10 text-gray-300 border border-gray-500/30'
      }
    }

    const confirmarEliminacion = (venta) => {
      ventaAEliminar.value = venta
      mostrarModalEliminacion.value = true
    }

    const eliminarVentaConfirmado = () => {
      emit('eliminar-venta', ventaAEliminar.value)
      cancelarEliminacion()
    }

    const cancelarEliminacion = () => {
      mostrarModalEliminacion.value = false
      ventaAEliminar.value = null
    }

    return {
      filtros,
      ventasFiltradas,
      mostrarModalEliminacion,
      ventaAEliminar,
      getEstadoClass,
      getTipoVentaClass,
      confirmarEliminacion,
      eliminarVentaConfirmado,
      cancelarEliminacion
    }
  }
}
</script> 
