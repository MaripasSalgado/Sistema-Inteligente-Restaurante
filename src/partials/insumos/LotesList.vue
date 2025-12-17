<template>
  <div class="bg-zinc-900/80 border border-zinc-700/50 rounded-lg">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-zinc-700/50">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-white">Lotes de Insumos</h3>
          <p class="text-sm text-gray-300 mt-1">Gestión de lotes y stock por insumo</p>
        </div>
        <div class="flex items-center space-x-4">
          <!-- Filtros -->
          <div class="flex items-center space-x-2">
            <select
              v-model="filtroInsumo"
              class="px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="">Todos los insumos</option>
              <option v-for="insumo in insumos" :key="insumo.id" :value="insumo.id">
                {{ insumo.nombre }}
              </option>
            </select>
            
            <select
              v-model="filtroEstado"
              class="px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="">Todos los estados</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
              <option value="Vencido">Vencido</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-zinc-900 border-b border-zinc-700/50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Lote
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Insumo
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Cantidad
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Precio Unitario
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Proveedor
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Fecha Ingreso
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Fecha Vencimiento
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Estado
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-700/50">
          <tr v-for="lote in lotesFiltrados" :key="lote.id" class="hover:bg-zinc-800/50 transition-colors">
            <!-- Lote -->
            <td class="px-4 py-4">
              <div class="text-sm font-medium text-white">{{ lote.lote }}</div>
            </td>

            <!-- Insumo -->
            <td class="px-4 py-4">
              <div class="text-sm text-white">{{ getInsumoNombre(lote.insumo_id) }}</div>
            </td>

            <!-- Cantidad -->
            <td class="px-4 py-4">
              <div class="text-sm text-white">
                <div class="flex items-center space-x-2">
                  <span class="font-medium">{{ lote.cantidad_actual }}</span>
                  <span class="text-gray-400">/ {{ lote.cantidad_inicial }}</span>
                </div>
                <div class="text-xs text-gray-400">{{ getInsumoUnidad(lote.insumo_id) }}</div>
              </div>
            </td>

            <!-- Precio Unitario -->
            <td class="px-4 py-4">
              <div class="text-sm text-white">₡{{ formatearPrecio(lote.precio_unitario) }}</div>
            </td>

            <!-- Proveedor -->
            <td class="px-4 py-4">
              <div class="text-sm">
                <span v-if="lote.proveedor" class="text-white font-medium">
                  {{ lote.proveedor.nombre }}
                </span>
                <span v-else class="text-gray-400 italic">Sin proveedor</span>
              </div>
            </td>

            <!-- Fecha Ingreso -->
            <td class="px-4 py-4">
              <div class="text-sm text-white">{{ formatearFecha(lote.fecha_ingreso) }}</div>
            </td>

            <!-- Fecha Vencimiento -->
            <td class="px-4 py-4">
              <div class="text-sm">
                <span :class="getVencimientoClass(lote.fecha_vencimiento)">
                  {{ formatearFecha(lote.fecha_vencimiento) }}
                </span>
              </div>
            </td>

            <!-- Estado -->
            <td class="px-4 py-4">
              <span
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                :class="getEstadoClass(lote.estado)"
              >
                {{ lote.estado || 'Activo' }}
              </span>
            </td>

            <!-- Acciones -->
            <td class="px-4 py-4">
              <div class="flex space-x-2">
                <button
                  @click="$emit('ver-lote', lote)"
                  class="px-3 py-1 bg-violet-500 text-white rounded text-sm hover:bg-violet-400 transition-colors"
                >
                  Ver
                </button>
                <button
                  @click="$emit('editar-lote', lote)"
                  class="px-3 py-1 bg-amber-500 text-black rounded text-sm hover:bg-amber-400 transition-colors"
                >
                  Editar
                </button>
                <button
                  @click="$emit('eliminar-lote', lote)"
                  class="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-400 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty state -->
    <div v-if="lotesFiltrados.length === 0" class="text-center py-12">
      <div class="text-gray-400">
        <svg class="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
        </svg>
        <p class="text-lg font-medium text-white mb-2">No hay lotes disponibles</p>
        <p class="text-sm text-gray-400">Los lotes aparecerán aquí cuando se registren</p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'

export default {
  name: 'LotesList',
  props: {
    lotes: {
      type: Array,
      default: () => []
    },
    insumos: {
      type: Array,
      default: () => []
    }
  },
  emits: ['ver-lote', 'editar-lote', 'eliminar-lote'],
  setup(props) {
    console.log('🔍 LotesList setup - Props recibidas:', { 
      lotes: props.lotes?.length || 0, 
      insumos: props.insumos?.length || 0,
      lotesData: props.lotes,
      insumosData: props.insumos
    })

    // Filtros
    const filtroInsumo = ref('')
    const filtroEstado = ref('')

    // Computed properties
    const lotesFiltrados = computed(() => {
      console.log('🔍 LotesList computed - Lotes originales:', props.lotes?.length || 0)
      console.log('🔍 LotesList computed - Props.lotes:', props.lotes)
      
      // Asegurar que props.lotes sea un array
      const lotesArray = Array.isArray(props.lotes) ? props.lotes : []
      console.log('🔍 LotesList computed - Lotes como array:', lotesArray.length)
      
      let filtrados = lotesArray

      // Filtrar por insumo
      if (filtroInsumo.value) {
        filtrados = filtrados.filter(lote => lote.insumo_id === filtroInsumo.value)
      }

      // Filtrar por estado
      if (filtroEstado.value) {
        filtrados = filtrados.filter(lote => lote.estado === filtroEstado.value)
      }

      console.log('🔍 LotesList computed - Lotes filtrados:', filtrados.length)
      return filtrados
    })

    // Funciones de utilidad
    const getInsumoNombre = (insumoId) => {
      const insumo = props.insumos.find(i => i.id === insumoId)
      return insumo?.nombre || 'Insumo no encontrado'
    }

    const getInsumoUnidad = (insumoId) => {
      const insumo = props.insumos.find(i => i.id === insumoId)
      return insumo?.unidad_medida || 'unidades'
    }

    const formatearFecha = (fecha) => {
      if (!fecha) return 'N/A'
      return new Date(fecha).toLocaleDateString('es-ES')
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

    const getEstadoClass = (estado) => {
      switch (estado) {
        case 'Activo':
          return 'bg-green-100 text-green-800'
        case 'Inactivo':
          return 'bg-gray-100 text-gray-800'
        case 'Vencido':
          return 'bg-red-100 text-red-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }

    const formatearPrecio = (precio) => {
      if (!precio) return '0.00'
      return Number(precio).toLocaleString('es-CR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    }

    return {
      filtroInsumo,
      filtroEstado,
      lotesFiltrados,
      getInsumoNombre,
      getInsumoUnidad,
      formatearFecha,
      getVencimientoClass,
      getEstadoClass,
      formatearPrecio
    }
  }
}
</script>
