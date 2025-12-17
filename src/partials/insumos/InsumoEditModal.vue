<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Overlay -->
    <div class="fixed inset-0 backdrop-blur-sm bg-black/50 transition-opacity" @click="cerrar"></div>

    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div class="relative bg-zinc-900/95 border border-zinc-700/50 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-zinc-700/50">
          <h3 class="text-lg font-semibold text-white">
            Editar Insumo: {{ insumo?.nombre || '' }}
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
              <h4 class="text-lg font-semibold text-white mb-4">Información Básica</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Nombre -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Nombre *
                  </label>
                  <input
                    v-model="formulario.nombre"
                    type="text"
                    required
                    class="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Nombre del insumo"
                  />
                </div>

                <!-- Código -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Código
                  </label>
                  <input
                    v-model="formulario.codigo"
                    type="text"
                    readonly
                    class="w-full px-3 py-2 bg-gray-800 border border-zinc-600 rounded-lg text-gray-400 cursor-not-allowed"
                    placeholder="Se generará automáticamente"
                  />
                  <p class="text-xs text-gray-500 mt-1">El código no se puede modificar</p>
                </div>
              </div>

              <!-- Descripción -->
              <div class="mt-6">
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Descripción
                </label>
                <textarea
                  v-model="formulario.descripcion"
                  rows="3"
                  class="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Descripción detallada del insumo..."
                ></textarea>
              </div>
            </div>

            <!-- Configuración de inventario -->
            <div class="bg-zinc-900/80 border border-zinc-700/50 rounded-lg p-6">
              <h4 class="text-lg font-semibold text-white mb-4">Configuración de Inventario</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Unidad de medida -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Unidad de medida *
                  </label>
                  <select
                    v-model="formulario.unidad_medida"
                    required
                    class="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="">Seleccionar unidad</option>
                    <option value="kg">Kilogramos (kg)</option>
                    <option value="g">Gramos (g)</option>
                    <option value="L">Litros (L)</option>
                    <option value="ml">Mililitros (ml)</option>
                    <option value="unidad">Unidad</option>
                    <option value="paquete">Paquete</option>
                    <option value="caja">Caja</option>
                    <option value="botella">Botella</option>
                  </select>
                </div>

                <!-- Stock mínimo -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Stock mínimo *
                  </label>
                  <input
                    v-model.number="formulario.stock_minimo"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    class="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="0"
                  />
                </div>

                <!-- Stock máximo -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Stock máximo
                  </label>
                  <input
                    v-model.number="formulario.stock_maximo"
                    type="number"
                    min="0"
                    step="0.01"
                    class="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <!-- Categorías -->
            <div class="bg-zinc-900/80 border border-zinc-700/50 rounded-lg p-6">
              <h4 class="text-lg font-semibold text-white mb-4">Categorías</h4>
              
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                <label
                  v-for="categoria in categorias"
                  :key="categoria.id"
                  class="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    v-model="formulario.categorias"
                    :value="categoria.id"
                    type="checkbox"
                    class="w-4 h-4 text-violet-500 bg-black border-zinc-700/50 rounded focus:ring-violet-500"
                  />
                  <span class="text-white text-sm">{{ categoria.nombre }}</span>
                </label>
              </div>
            </div>

            <!-- Información adicional -->
            <div class="bg-zinc-900/80 border border-zinc-700/50 rounded-lg p-6">
              <h4 class="text-lg font-semibold text-white mb-4">Información Adicional</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Proveedor Principal -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Proveedor Principal <span class="text-gray-500">(Opcional)</span>
                  </label>
                  <select
                    v-model="formulario.proveedor_principal_id"
                    class="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option :value="null">Sin proveedor asignado</option>
                    <option v-for="proveedor in proveedores" :key="proveedor.id" :value="proveedor.id">
                      {{ proveedor.nombre }} - {{ proveedor.tipo }}
                    </option>
                  </select>
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
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>

                <!-- Observaciones -->
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Observaciones
                  </label>
                  <textarea
                    v-model="formulario.observaciones"
                    rows="3"
                    class="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Observaciones adicionales..."
                  ></textarea>
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
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'InsumoEditModal',
  props: {
    insumo: {
      type: Object,
      default: null
    },
    categorias: {
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
      nombre: '',
      codigo: '',
      descripcion: '',
      unidad_medida: '',
      stock_minimo: 0,
      stock_maximo: null,
      categorias: [],
      proveedor_principal_id: null,
      estado: 'Activo',
      observaciones: ''
    })

    const resetearFormulario = () => {
      formulario.value = {
        nombre: '',
        codigo: '',
        descripcion: '',
        unidad_medida: '',
        stock_minimo: 0,
        stock_maximo: null,
        categorias: [],
        proveedor_principal_id: null,
        estado: 'Activo',
        observaciones: ''
      }
    }

    // Cargar datos del insumo cuando se abre el modal
    watch(() => props.insumo, (nuevoInsumo) => {
      if (nuevoInsumo) {
        formulario.value = {
          id: nuevoInsumo.id,
          nombre: nuevoInsumo.nombre,
          codigo: nuevoInsumo.codigo,
          descripcion: nuevoInsumo.descripcion || '',
          unidad_medida: nuevoInsumo.unidad_medida,
          stock_minimo: nuevoInsumo.stock_minimo,
          stock_maximo: nuevoInsumo.stock_maximo,
          categorias: nuevoInsumo.categorias?.map(cat => cat.categoria?.id).filter(Boolean) || [],
          proveedor_principal_id: nuevoInsumo.proveedor_principal_id || null,
          estado: nuevoInsumo.estado,
          observaciones: nuevoInsumo.observaciones || ''
        }
      } else {
        resetearFormulario()
      }
    }, { immediate: true })

    const cerrar = () => {
      emit('cerrar')
    }

    const guardarCambios = () => {
      console.log('🔧 GUARDAR CAMBIOS CLICKED!', formulario.value)
      
      if (!formulario.value.nombre || !formulario.value.unidad_medida) {
        alert('Por favor completa todos los campos obligatorios')
        return
      }

      if (formulario.value.categorias.length === 0) {
        alert('Selecciona al menos una categoría')
        return
      }

      console.log('🔧 Emitiendo evento guardar con datos:', { ...formulario.value })
      emit('guardar', { ...formulario.value })
    }

    return {
      formulario,
      cerrar,
      guardarCambios
    }
  }
}
</script>
