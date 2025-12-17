<template>
  <Teleport to="body">
    <div v-if="lote">
      <!-- Overlay -->
      <div class="fixed inset-0 z-50 backdrop-blur-sm bg-black/50" @click="cerrar"></div>

      <!-- Modal container -->
      <div class="fixed inset-0 z-50 overflow-y-auto" @click.self="cerrar">
        <div class="flex min-h-full items-center justify-center p-4">
          <div class="relative bg-zinc-900/95 border border-zinc-700/50 rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-zinc-700/50">
          <h3 class="text-lg font-semibold text-white">
            Editar Lote: {{ lote?.lote || '' }}
          </h3>
          <button
            @click="cerrar"
            class="text-gray-400 hover:text-white transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6">
          <form @submit.prevent="guardarCambios" class="space-y-6">
            <!-- Información básica -->
            <div class="bg-zinc-900/80 border border-zinc-700/50 rounded-lg p-6">
              <h4 class="text-lg font-semibold text-white mb-4">Información del Lote</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Insumo (solo lectura) -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Insumo
                  </label>
                  <input
                    :value="getInsumoNombre()"
                    type="text"
                    readonly
                    class="w-full px-3 py-2 bg-gray-800 border border-zinc-600 rounded-lg text-gray-400 cursor-not-allowed"
                  />
                  <p class="text-xs text-gray-500 mt-1">El insumo no se puede modificar</p>
                </div>

                <!-- Número de lote -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Número de lote *
                  </label>
                  <input
                    v-model="formulario.lote"
                    type="text"
                    required
                    class="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Ej: CM-2025-001-A"
                  />
                </div>

                <!-- Cantidad actual -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Cantidad actual *
                  </label>
                  <div class="relative">
                    <input
                      v-model.number="formulario.cantidad_actual"
                      type="number"
                      min="0"
                      :max="formulario.cantidad_inicial"
                      step="0.01"
                      required
                      class="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                      placeholder="0"
                    />
                    <span class="absolute right-3 top-2.5 text-gray-400 text-sm">{{ getInsumoUnidad() }}</span>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">Máximo: {{ formulario.cantidad_inicial }} {{ getInsumoUnidad() }}</p>
                </div>

                <!-- Cantidad inicial (solo lectura) -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Cantidad inicial
                  </label>
                  <div class="relative">
                    <input
                      v-model.number="formulario.cantidad_inicial"
                      type="number"
                      readonly
                      class="w-full px-3 py-2 bg-gray-800 border border-zinc-600 rounded-lg text-gray-400 cursor-not-allowed"
                    />
                    <span class="absolute right-3 top-2.5 text-gray-400 text-sm">{{ getInsumoUnidad() }}</span>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">No se puede modificar después de creado</p>
                </div>

                <!-- Precio unitario -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Precio unitario (₡) *
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-2.5 text-gray-400">₡</span>
                    <input
                      v-model.number="formulario.precio_unitario"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      class="w-full pl-8 pr-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <!-- Proveedor -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Proveedor
                  </label>
                  <select
                    v-model="formulario.proveedor_id"
                    class="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option :value="null">Sin proveedor asignado</option>
                    <option v-for="proveedor in proveedores" :key="proveedor.id" :value="proveedor.id">
                      {{ proveedor.nombre }} - {{ proveedor.tipo }}
                    </option>
                  </select>
                </div>

                <!-- Fecha de ingreso -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Fecha de ingreso *
                  </label>
                  <input
                    v-model="formulario.fecha_ingreso"
                    type="date"
                    required
                    class="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                <!-- Fecha de vencimiento -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Fecha de vencimiento
                  </label>
                  <input
                    v-model="formulario.fecha_vencimiento"
                    type="date"
                    class="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <p v-if="formulario.fecha_vencimiento" class="text-xs mt-1" :class="getVencimientoClass(formulario.fecha_vencimiento)">
                    {{ calcularDiasRestantes() }}
                  </p>
                </div>

                <!-- Estado -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Estado
                  </label>
                  <select
                    v-model="formulario.estado"
                    class="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Agotado">Agotado</option>
                    <option value="Vencido">Vencido</option>
                  </select>
                </div>
              </div>

              <!-- Observaciones -->
              <div class="mt-6">
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Observaciones
                </label>
                <textarea
                  v-model="formulario.observaciones"
                  rows="3"
                  class="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Observaciones del lote..."
                ></textarea>
              </div>
            </div>

            <!-- Información de valor (solo lectura) -->
            <div class="bg-zinc-900/80 border border-zinc-700/50 rounded-lg p-6">
              <h4 class="text-lg font-semibold text-white mb-4">Valor Actual</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-gray-900 rounded-lg p-4">
                  <span class="text-gray-400 text-sm">Valor Inicial</span>
                  <div class="text-white font-bold text-xl mt-1">₡{{ formatearPrecio(calcularValorInicial()) }}</div>
                </div>
                <div class="bg-gray-900 rounded-lg p-4">
                  <span class="text-gray-400 text-sm">Valor Actual</span>
                  <div class="text-amber-400 font-bold text-xl mt-1">₡{{ formatearPrecio(calcularValorActual()) }}</div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-3 p-6 border-t border-zinc-700/50">
          <button
            @click="cerrar"
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            @click="guardarCambios"
            class="px-4 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition-colors font-medium"
          >
            Guardar Cambios
          </button>
        </div>
        </div>
      </div>
    </div>
  </div>
  </Teleport>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'LoteEditModal',
  props: {
    lote: {
      type: Object,
      default: null
    },
    insumos: {
      type: Array,
      default: () => []
    },
    proveedores: {
      type: Array,
      default: () => []
    }
  },
  emits: ['cerrar', 'guardar'],
  setup(props, { emit }) {
    const formulario = ref({
      lote: '',
      cantidad_inicial: 0,
      cantidad_actual: 0,
      precio_unitario: 0,
      proveedor_id: null,
      fecha_ingreso: '',
      fecha_vencimiento: '',
      estado: 'Activo',
      observaciones: ''
    })

    const resetearFormulario = () => {
      formulario.value = {
        lote: '',
        cantidad_inicial: 0,
        cantidad_actual: 0,
        precio_unitario: 0,
        proveedor_id: null,
        fecha_ingreso: '',
        fecha_vencimiento: '',
        estado: 'Activo',
        observaciones: ''
      }
    }

    // Cargar datos del lote cuando se abre el modal
    watch(() => props.lote, (nuevoLote) => {
      if (nuevoLote) {
        formulario.value = {
          id: nuevoLote.id,
          insumo_id: nuevoLote.insumo_id,
          lote: nuevoLote.lote,
          cantidad_inicial: nuevoLote.cantidad_inicial,
          cantidad_actual: nuevoLote.cantidad_actual,
          precio_unitario: nuevoLote.precio_unitario,
          proveedor_id: nuevoLote.proveedor_id || null,
          fecha_ingreso: nuevoLote.fecha_ingreso,
          fecha_vencimiento: nuevoLote.fecha_vencimiento || '',
          estado: nuevoLote.estado,
          observaciones: nuevoLote.observaciones || ''
        }
      } else {
        resetearFormulario()
      }
    }, { immediate: true })

    const getInsumoNombre = () => {
      const insumo = props.insumos.find(i => i.id === formulario.value.insumo_id)
      return insumo?.nombre || 'Insumo no encontrado'
    }

    const getInsumoUnidad = () => {
      const insumo = props.insumos.find(i => i.id === formulario.value.insumo_id)
      return insumo?.unidad_medida || 'unidades'
    }

    const formatearPrecio = (precio) => {
      if (!precio) return '0.00'
      return Number(precio).toLocaleString('es-CR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    }

    const calcularValorInicial = () => {
      return (formulario.value.cantidad_inicial || 0) * (formulario.value.precio_unitario || 0)
    }

    const calcularValorActual = () => {
      return (formulario.value.cantidad_actual || 0) * (formulario.value.precio_unitario || 0)
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
      if (!formulario.value.fecha_vencimiento) return ''
      const hoy = new Date()
      const vencimiento = new Date(formulario.value.fecha_vencimiento)
      const diasRestantes = Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24))
      
      if (diasRestantes < 0) return `Vencido hace ${Math.abs(diasRestantes)} días`
      if (diasRestantes === 0) return 'Vence hoy'
      if (diasRestantes === 1) return 'Vence mañana'
      return `${diasRestantes} días restantes`
    }

    const cerrar = () => {
      emit('cerrar')
    }

    const guardarCambios = () => {
      if (!formulario.value.lote || !formulario.value.cantidad_actual) {
        alert('Por favor completa todos los campos obligatorios')
        return
      }

      if (formulario.value.cantidad_actual > formulario.value.cantidad_inicial) {
        alert('La cantidad actual no puede ser mayor a la cantidad inicial')
        return
      }

      emit('guardar', { ...formulario.value })
    }

    return {
      formulario,
      cerrar,
      guardarCambios,
      getInsumoNombre,
      getInsumoUnidad,
      formatearPrecio,
      calcularValorInicial,
      calcularValorActual,
      getVencimientoClass,
      calcularDiasRestantes
    }
  }
}
</script>
