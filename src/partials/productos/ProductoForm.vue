<template>
  <!-- Modal overlay -->
  <div class="fixed inset-0 backdrop-blur-sm bg-black/50 overflow-y-auto h-full w-full z-50" @click.self="$emit('cancelar')">
    <div class="relative top-10 mx-auto p-5 border border-zinc-700/50 w-full max-w-4xl shadow-lg rounded-md">
      <!-- Header con botón cerrar -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-white">
          {{ producto ? 'Editar Producto' : 'Crear Nuevo Producto' }}
        </h2>
        <button
          @click="$emit('cancelar')"
          class="text-gray-400 hover:text-white transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="guardarProducto" class="space-y-6">
        <!-- Información básica -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Nombre -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Nombre del Producto *</label>
            <input
              v-model="form.nombre"
              type="text"
              required
              placeholder="Ej: Combo Empanada + Refresco"
              class="input-field w-full px-3 py-2 border border-zinc-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <!-- Categoría -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Categoría *</label>
            <select
              v-model="form.categoriaId"
              required
              class="input-field w-full px-3 py-2 border border-zinc-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Seleccionar categoría</option>
              <option v-for="cat in categorias" :key="cat.id" :value="cat.id">
                {{ cat.nombre }}
              </option>
            </select>
          </div>

          <!-- Precio de venta -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Precio de Venta *</label>
            <input
              v-model="form.precioVenta"
              type="number"
              step="0.01"
              required
              placeholder="0.00"
              class="input-field w-full px-3 py-2 border border-zinc-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <!-- Estado -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Estado *</label>
            <select
              v-model="form.estado"
              required
              class="input-field w-full px-3 py-2 border border-zinc-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
        </div>

        <!-- Descripción -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
          <textarea
            v-model="form.descripcion"
            rows="3"
            placeholder="Descripción del producto..."
            class="input-field w-full px-3 py-2 border border-zinc-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          ></textarea>
        </div>

        <!-- Selector de recetas -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Recetas del Producto *</label>
          <div class="space-y-4">
            <!-- Lista de recetas seleccionadas -->
            <div v-if="form.recetas.length > 0" class="space-y-3">
              <div
                v-for="(receta, index) in form.recetas"
                :key="index"
                class="space-y-4 p-4 border border-zinc-700/50 rounded-lg"
                style="background-color: rgb(39 39 42);"
              >
                <div class="flex flex-wrap items-center gap-4">
                  <span class="text-white font-medium flex-1 min-w-[150px]">{{ receta.nombre }}</span>
                </div>
                <div class="flex flex-wrap items-center gap-4 text-sm">
                  <label class="text-gray-300">Cantidad:</label>
                  <input
                    v-model.number="receta.cantidad"
                    type="number"
                    min="1"
                    class="input-field w-24 px-2 py-1 border border-zinc-700/50 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  <span class="text-gray-400">unidades</span>
                  <div class="flex items-baseline gap-1 text-gray-400">
                    <span class="text-xs uppercase tracking-wide text-gray-500">Costo unidad</span>
                    <span class="text-white font-semibold">₡{{ receta.costoUnitario }}</span>
                  </div>
                  <div class="flex items-baseline gap-1 text-gray-400">
                    <span class="text-xs uppercase tracking-wide text-gray-500">Subtotal</span>
                    <span class="text-yellow-400 font-semibold">₡{{ (receta.costoUnitario * receta.cantidad).toFixed(2) }}</span>
                  </div>
                  <button
                    @click="eliminarReceta(index)"
                    type="button"
                    class="ml-auto px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 transition-colors rounded"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>

            <!-- Selector para agregar recetas -->
            <div style="background-color: rgb(39 39 42);" class="border border-zinc-700/50 rounded-lg p-4">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Receta</label>
                  <select
                    v-model="recetaSeleccionada"
                    class="input-field w-full px-3 py-2 border border-zinc-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="">Seleccionar receta</option>
                    <option
                      v-for="receta in recetasDisponibles"
                      :key="receta.id"
                      :value="receta"
                    >
                      {{ receta.nombre }} - ₡{{ ((receta.costo_total || 0) / (receta.rendimiento || 1)).toFixed(2) }} por porción
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Cantidad</label>
                  <input
                    v-model.number="cantidadReceta"
                    type="number"
                    min="1"
                    placeholder="1"
                    class="input-field w-full px-3 py-2 border border-zinc-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div class="flex items-end">
                  <button
                    @click="agregarReceta"
                    type="button"
                    :disabled="!recetaSeleccionada || cantidadReceta < 1"
                    class="w-full px-4 py-2 text-sm font-medium text-black bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors rounded-lg"
                  >
                    Agregar Receta
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Resumen de costos -->
        <div class="border border-zinc-700/50 rounded-lg p-6">
          <h3 class="text-lg font-medium text-white mb-4">Resumen de Costos</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-300">Costo Total:</span>
                <span class="text-white font-medium">₡{{ costoTotal.toFixed(2) }}</span>
              </div>

              <div class="flex justify-between">
                <span class="text-gray-300">Precio de Venta:</span>
                <span class="text-yellow-400 font-medium">₡{{ form.precioVenta || '0.00' }}</span>
              </div>

              <div class="flex justify-between">
                <span class="text-gray-300">Ganancia Unitaria:</span>
                <span class="text-green-400 font-medium">₡{{ gananciaUnitaria.toFixed(2) }}</span>
              </div>
            </div>
            
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-300">Margen de Ganancia:</span>
                <span class="text-green-400 font-medium">{{ margenGanancia.toFixed(1) }}%</span>
              </div>
              
              <div class="flex justify-between">
                <span class="text-gray-300">Margen Estándar:</span>
                <span class="text-gray-400">{{ margenEstandar }}%</span>
              </div>
              
              <div class="flex justify-between">
                <span class="text-gray-300">Estado del Margen:</span>
                <span :class="estadoMargen.clase" class="font-medium">{{ estadoMargen.texto }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="flex justify-end space-x-3">
          <button
            @click="$emit('cancelar')"
            type="button"
            class="px-4 py-2 text-sm font-medium text-black bg-yellow-400 hover:bg-yellow-500 transition-colors rounded-lg"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="!formValido"
            class="px-4 py-2 text-sm font-medium text-black bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors rounded-lg"
          >
            {{ producto ? 'Actualizar Producto' : 'Crear Producto' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'

export default {
  name: 'ProductoForm',
  props: {
    producto: {
      type: Object,
      default: null
    },
    categorias: {
      type: Array,
      required: true
    },
    recetas: {
      type: Array,
      required: true
    }
  },
  emits: ['guardar', 'cancelar'],
  setup(props, { emit }) {
    const form = ref({
      nombre: '',
      descripcion: '',
      categoriaId: '',
      precioVenta: '',
      estado: 'Activo',
      recetas: []
    })

    const recetaSeleccionada = ref(null)
    const cantidadReceta = ref(1)

    // Computed properties
    const recetasDisponibles = computed(() => {
      const recetasUsadas = form.value.recetas.map(r => r.recetaId)
      return props.recetas.filter(r => !recetasUsadas.includes(r.id))
    })

    const costoTotal = computed(() => {
      return form.value.recetas.reduce((total, receta) => {
        return total + ((receta.costoUnitario || 0) * (receta.cantidad || 1))
      }, 0)
    })

    const gananciaUnitaria = computed(() => {
      const precio = parseFloat(form.value.precioVenta) || 0
      return precio - costoTotal.value
    })

    const margenGanancia = computed(() => {
      const precio = parseFloat(form.value.precioVenta) || 0
      if (precio === 0) return 0
      return (gananciaUnitaria.value / precio) * 100
    })

    const categoriaSeleccionada = computed(() => {
      return props.categorias.find(c => c.id === form.value.categoriaId)
    })

    const margenEstandar = computed(() => {
      return categoriaSeleccionada.value?.margenEstandar || 50
    })

    const estadoMargen = computed(() => {
      const margen = margenGanancia.value
      const estandar = margenEstandar.value
      
      if (margen < estandar - 10) {
        return { texto: 'Bajo', clase: 'text-red-400' }
      } else if (margen > estandar + 10) {
        return { texto: 'Alto', clase: 'text-green-400' }
      } else {
        return { texto: 'Óptimo', clase: 'text-yellow-400' }
      }
    })

    const formValido = computed(() => {
      return form.value.nombre && 
             form.value.categoriaId && 
             form.value.precioVenta && 
             form.value.recetas.length > 0
    })

    // Methods
    const agregarReceta = () => {
      if (!recetaSeleccionada.value || cantidadReceta.value < 1) return

      const nuevaReceta = {
        recetaId: recetaSeleccionada.value.id,
        nombre: recetaSeleccionada.value.nombre,
        cantidad: cantidadReceta.value,
        costoUnitario: (recetaSeleccionada.value.costo_total || 0) / (recetaSeleccionada.value.rendimiento || 1),
        subtotal: ((recetaSeleccionada.value.costo_total || 0) / (recetaSeleccionada.value.rendimiento || 1)) * cantidadReceta.value
      }

      form.value.recetas.push(nuevaReceta)
      
      // Reset
      recetaSeleccionada.value = null
      cantidadReceta.value = 1
    }

    const eliminarReceta = (index) => {
      form.value.recetas.splice(index, 1)
    }

    const guardarProducto = () => {
      if (!formValido.value) return

      // Transformar datos al formato que espera el servicio
      const productoData = {
        id: props.producto?.id || null,
        nombre: form.value.nombre,
        descripcion: form.value.descripcion || null,
        categoria_id: form.value.categoriaId,
        precio_venta: parseFloat(form.value.precioVenta),
        costo_total: costoTotal.value,
        margen_ganancia: margenGanancia.value,
        activo: form.value.estado === 'Activo',
        recetas: form.value.recetas.map(r => ({
          receta_id: r.recetaId,
          cantidad: r.cantidad,
          observaciones: null
        }))
      }

      console.log('📤 ProductoForm - Datos enviados al padre:', productoData)
      emit('guardar', productoData)
    }

    // Inicializar formulario si se está editando
    const inicializarFormulario = () => {
      if (props.producto) {
        console.log('🔧 ProductoForm - Inicializando formulario con producto:', props.producto)
        form.value = {
          nombre: props.producto.nombre || '',
          descripcion: props.producto.descripcion || '',
          categoriaId: props.producto.categoria_id || '',
          precioVenta: props.producto.precio_venta || '',
          estado: props.producto.activo ? 'Activo' : 'Inactivo',
          recetas: props.producto.recetas?.map(r => ({
            recetaId: r.receta?.id || r.receta_id,
            nombre: r.receta?.nombre || 'Receta sin nombre',
            cantidad: r.cantidad || 1,
            costoUnitario: (r.receta?.costo_total || 0) / (r.receta?.rendimiento || 1),
            subtotal: ((r.receta?.costo_total || 0) / (r.receta?.rendimiento || 1)) * (r.cantidad || 1)
          })) || []
        }
      } else {
        // Reset formulario para nuevo producto
        form.value = {
          nombre: '',
          descripcion: '',
          categoriaId: '',
          precioVenta: '',
          estado: 'Activo',
          recetas: []
        }
      }
    }

    // Watch para cambios en el prop producto
    watch(() => props.producto, (nuevoProducto) => {
      console.log('👀 ProductoForm - Cambio detectado en prop producto:', nuevoProducto)
      inicializarFormulario()
    }, { immediate: true })

    onMounted(() => {
      inicializarFormulario()
    })

    return {
      form,
      recetaSeleccionada,
      cantidadReceta,
      recetasDisponibles,
      costoTotal,
      gananciaUnitaria,
      margenGanancia,
      margenEstandar,
      estadoMargen,
      formValido,
      agregarReceta,
      eliminarReceta,
      guardarProducto
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

/* Transiciones suaves */
* {
  transition: background-color 150ms ease, border-color 150ms ease, color 150ms ease;
}
</style>
