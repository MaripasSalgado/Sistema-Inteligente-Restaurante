<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-zinc-900/80 border border-zinc-700/50 rounded-lg p-4">
      <h2 class="text-xl font-bold text-white">
        {{ insumoEdit ? 'Editar Insumo' : 'Nuevo Insumo' }}
      </h2>
      <p class="text-gray-400 mt-1">
        {{ insumoEdit ? 'Modifica la información del insumo' : 'Registra un nuevo insumo en el inventario' }}
      </p>
    </div>

    <!-- Formulario -->
    <form @submit.prevent="guardarInsumo" class="space-y-6">
      <!-- Información básica -->
      <div class="bg-zinc-900/80 border border-zinc-700/50 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-white mb-4">Información Básica</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Nombre -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Nombre del insumo *
            </label>
            <input
              v-model="formulario.nombre"
              type="text"
              required
              class="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Ej: Carne Molida"
            />
          </div>

          <!-- Código (generado automáticamente) -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Código *
            </label>
            <input
              v-model="formulario.codigo"
              type="text"
              readonly
              class="w-full px-3 py-2 bg-gray-800 border border-zinc-600 rounded-lg text-gray-400 cursor-not-allowed"
              placeholder="Se generará automáticamente"
            />
            <p class="text-xs text-gray-500 mt-1">El código se genera automáticamente basado en el nombre</p>
          </div>

          <!-- Descripción -->
          <div class="md:col-span-2">
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
      </div>

      <!-- Configuración de inventario -->
      <div class="bg-zinc-900/80 border border-zinc-700/50 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-white mb-4">Configuración de Inventario</h3>
        
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
              <option v-for="unidad in unidadesMedida" :key="unidad" :value="unidad">
                {{ unidad }}
              </option>
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
        <h3 class="text-lg font-semibold text-white mb-4">Categorías</h3>
        
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <label
            v-for="categoria in categorias"
            :key="categoria.id"
            class="flex items-center space-x-3 cursor-pointer"
          >
            <input
              v-model="formulario.categorias"
              :value="categoria.id"
              type="checkbox"
              class="w-4 h-4 text-violet-500 bg-black border-zinc-700/50 rounded focus:ring-violet-500"
            />
            <div class="flex items-center space-x-2">
              <div
                class="w-4 h-4 rounded-full"
                :style="{ backgroundColor: categoria.color }"
              ></div>
              <span class="text-sm text-white">{{ categoria.nombre }}</span>
            </div>
          </label>
        </div>
      </div>

      <!-- Proveedor y observaciones -->
      <div class="bg-zinc-900/80 border border-zinc-700/50 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-white mb-4">Información Adicional</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Proveedor principal (Opcional) -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Proveedor principal <span class="text-gray-500">(Opcional)</span>
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
            <p class="text-xs text-gray-500 mt-1">Puede asignarse más tarde</p>
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
          {{ insumoEdit ? 'Actualizar' : 'Guardar' }} Insumo
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue'

export default {
  name: 'InsumoForm',
  props: {
    categorias: {
      type: Array,
      required: true
    },
    proveedores: {
      type: Array,
      required: true
    },
    insumoEdit: {
      type: Object,
      default: null
    }
  },
  emits: ['guardar-insumo', 'cancelar'],
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

    const unidadesMedida = [
      'kg', 'litros', 'unidades', 'gramos', 'mililitros', 'paquetes', 'cajas', 'botellas'
    ]

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

    // Inicializar formulario si se está editando
    watch(() => props.insumoEdit, (nuevoInsumo) => {
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
          proveedor_principal_id: nuevoInsumo.proveedor_principal_id,
          estado: nuevoInsumo.estado,
          observaciones: nuevoInsumo.observaciones || ''
        }
      } else {
        resetearFormulario()
      }
    }, { immediate: true })

    const generarCodigo = () => {
      if (!formulario.value.nombre) return
      
      const prefijo = formulario.value.nombre.substring(0, 2).toUpperCase()
      const año = new Date().getFullYear()
      const correlativo = String(Math.floor(Math.random() * 1000)).padStart(3, '0')
      
      formulario.value.codigo = `${prefijo}-${año}-${correlativo}`
    }

    const guardarInsumo = () => {
      // Validaciones
      if (!formulario.value.nombre || !formulario.value.unidad_medida) {
        alert('Por favor completa todos los campos obligatorios')
        return
      }

      if (formulario.value.categorias.length === 0) {
        alert('Selecciona al menos una categoría')
        return
      }

      // Generar código automáticamente si no existe
      if (!formulario.value.codigo) {
        generarCodigo()
      }

      // Emitir evento con los datos del formulario
      emit('guardar-insumo', { ...formulario.value })
    }

    // Generar código automáticamente cuando se escribe el nombre
    watch(() => formulario.value.nombre, (nuevoNombre) => {
      if (nuevoNombre && !props.insumoEdit) {
        generarCodigo()
      }
    })

    return {
      formulario,
      unidadesMedida,
      guardarInsumo
    }
  }
}
</script>