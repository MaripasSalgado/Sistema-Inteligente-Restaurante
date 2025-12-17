<template>
  <div class="fixed inset-0 backdrop-blur-sm bg-black/50 overflow-y-auto h-full w-full z-50">
    <div class="modal relative top-20 mx-auto p-5 border border-zinc-700/50 w-96 shadow-lg rounded-md">
      
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-white">Duplicar Producto</h3>
        <button
          @click="$emit('cancelar')"
          class="text-gray-400 hover:text-white"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Información del producto original -->
      <div style="background-color: rgb(39 39 42);" class="mb-4 p-3 border border-zinc-700/50 rounded-lg">
        <p class="text-sm text-gray-300 mb-2">Producto original:</p>
        <p class="text-white font-medium">{{ producto.nombre }}</p>
        <p class="text-xs text-gray-400">{{ producto.codigo }}</p>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="confirmarDuplicacion">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-300 mb-2">Nuevo Nombre *</label>
          <input
            v-model="nuevoNombre"
            type="text"
            required
            placeholder="Nombre del nuevo producto..."
            class="input-field w-full px-3 py-2 border border-zinc-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
          <textarea
            v-model="nuevaDescripcion"
            rows="3"
            placeholder="Descripción del nuevo producto..."
            class="input-field w-full px-3 py-2 border border-zinc-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          ></textarea>
        </div>

        <!-- Información del producto duplicado -->
        <div style="background-color: rgb(39 39 42);" class="mb-4 p-3 border border-zinc-700/50 rounded-lg">
          <h4 class="text-sm font-medium text-white mb-2">El nuevo producto incluirá:</h4>
          <ul class="text-xs text-gray-300 space-y-1">
            <li>• {{ producto.recetas?.length || 0 }} recetas</li>
            <li>• Costo total: ₡{{ producto.costo_total }}</li>
            <li>• Precio sugerido: ₡{{ producto.precio_venta }}</li>
            <li>• Margen: {{ producto.margen_ganancia }}%</li>
          </ul>
        </div>

        <!-- Botones -->
        <div class="flex justify-end space-x-3">
          <button
            @click="$emit('cancelar')"
            type="button"
            class="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="!nuevoNombre.trim()"
            class="px-4 py-2 text-sm font-medium text-black bg-yellow-400 rounded-lg hover:bg-yellow-300 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            Duplicar Producto
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'ProductoDuplicator',
  props: {
    producto: {
      type: Object,
      required: true
    }
  },
  emits: ['duplicar', 'cancelar'],
  setup(props, { emit }) {
    const nuevoNombre = ref('')
    const nuevaDescripcion = ref('')

    const confirmarDuplicacion = () => {
      if (!nuevoNombre.value.trim()) return

      const productoDuplicado = {
        nombre: nuevoNombre.value.trim(),
        descripcion: nuevaDescripcion.value.trim() || props.producto.descripcion,
        categoria_id: props.producto.categoria_id,
        categoria: props.producto.categoria,
        activo: true,
        recetas: [...(props.producto.recetas || [])],
        costo_total: props.producto.costo_total,
        precio_venta: props.producto.precio_venta,
        margen_ganancia: props.producto.margen_ganancia,
        ganancia_unitaria: props.producto.precio_venta - props.producto.costo_total
      }

      emit('duplicar', productoDuplicado)
    }

    onMounted(() => {
      nuevoNombre.value = `${props.producto.nombre} (Copia)`
      nuevaDescripcion.value = props.producto.descripcion
    })

    return {
      nuevoNombre,
      nuevaDescripcion,
      confirmarDuplicacion
    }
  }
}
</script>

<style scoped>
/* Estilos para inputs */
.input-field {
  background-color: rgb(24 24 27 / 0.8);
  border: 1px solid rgb(63 63 70 / 0.5);
  color: white;
}

.input-field::placeholder {
  color: #9ca3af;
}

.input-field:focus {
  border-color: #9ca3af;
}

/* Estilos para botones */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid rgb(63 63 70 / 0.5);
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  transition: all 150ms;
  background-color: black;
  color: white;
}

.btn:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.btn:hover {
  background-color: rgb(39 39 42);
}

/* Estilos para modales */
.modal {
  background-color: rgb(24 24 27 / 0.8);
  border: 1px solid rgb(63 63 70 / 0.5);
}

/* Transiciones suaves */
* {
  transition: background-color 150ms ease, border-color 150ms ease, color 150ms ease;
}
</style>