<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-zinc-900/80 border border-zinc-700/50 rounded-lg p-4">
      <h2 class="text-xl font-bold text-white">
        {{ loteEdit ? 'Editar Lote' : 'Nuevo Lote' }}
      </h2>
      <p class="text-gray-400 mt-1">
        {{ loteEdit ? 'Modifica la información del lote' : 'Registra un nuevo lote de insumo en el inventario' }}
      </p>
    </div>

    <!-- Formulario -->
    <form @submit.prevent="guardarLote" class="space-y-6">
      <!-- Información del lote -->
      <div class="bg-zinc-900/80 border border-zinc-700/50 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-white mb-4">Información Básica</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Insumo -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Insumo *
            </label>
            <select
              v-model="formulario.insumo_id"
              required
              class="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="">Seleccionar insumo</option>
              <option v-for="insumo in insumos" :key="insumo.id" :value="insumo.id">
                {{ insumo.nombre }} ({{ insumo.codigo }})
              </option>
            </select>
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

          <!-- Cantidad inicial -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Cantidad inicial *
            </label>
            <input
              v-model.number="formulario.cantidad_inicial"
              type="number"
              min="0"
              step="0.01"
              required
              class="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="0"
            />
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

          <!-- Proveedor (Opcional) -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Proveedor <span class="text-gray-500">(Opcional)</span>
            </label>
            <select
              v-model="formulario.proveedor_id"
              @focus="console.log('🎯 [LoteForm] Click en dropdown de proveedores:', proveedores)"
              class="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option :value="null">Sin proveedor asignado</option>
              <option v-for="proveedor in proveedores" :key="proveedor.id" :value="proveedor.id">
                {{ proveedor.nombre }} - {{ proveedor.tipo }}
              </option>
            </select>
            <p class="text-xs text-gray-500 mt-1">Puede asignarse más tarde</p>
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
              style="color-scheme: dark;"
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
              style="color-scheme: dark;"
            />
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

      <!-- Botones de acción -->
      <div class="flex justify-end space-x-4">
        <button
          type="button"
          @click="$emit('cancelar')"
          class="px-6 py-2 border border-zinc-600 rounded-lg text-gray-300 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          class="px-6 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          Guardar Lote
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { toDateLocal } from '@/utils/dateHelper'

export default {
  name: 'LoteForm',
  props: {
    insumos: {
      type: Array,
      required: true
    },
    proveedores: {
      type: Array,
      required: true
    },
    loteEdit: {
      type: Object,
      default: null
    }
  },
  emits: ['guardar-lote', 'cancelar'],
  setup(props, { emit }) {
    const formulario = ref({
      insumo_id: '',
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
        insumo_id: '',
        lote: '',
        cantidad_inicial: 0,
        cantidad_actual: 0,
        precio_unitario: 0,
        proveedor_id: null,
        fecha_ingreso: toDateLocal(), // Usar fecha de Costa Rica
        fecha_vencimiento: '',
        estado: 'Activo',
        observaciones: ''
      }
    }

    // Inicializar formulario si se está editando
    watch(() => props.loteEdit, (nuevoLote) => {
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

    const generarNumeroLote = () => {
      if (!formulario.value.insumo_id) return
      
      const insumo = props.insumos.find(i => i.id === formulario.value.insumo_id)
      if (insumo) {
        const correlativo = String(insumo.lotes?.length + 1 || 1).padStart(2, '0')
        formulario.value.lote = `${insumo.codigo}-${correlativo}`
      }
    }

    const guardarLote = () => {
      // Validaciones
      if (!formulario.value.insumo_id || !formulario.value.lote || !formulario.value.cantidad_inicial) {
        alert('Por favor completa todos los campos obligatorios')
        return
      }

      // No establecer cantidad_actual aquí
      // Se creará el lote con cantidad_actual = 0
      // El movimiento de entrada automático lo actualizará

      // Emitir evento con los datos del formulario
      emit('guardar-lote', { ...formulario.value })
    }

    // Generar número de lote automáticamente cuando se selecciona un insumo
    watch(() => formulario.value.insumo_id, (nuevoInsumoId) => {
      if (nuevoInsumoId && !props.loteEdit) {
        generarNumeroLote()
      }
    })

    return {
      formulario,
      guardarLote
    }
  }
}
</script>
