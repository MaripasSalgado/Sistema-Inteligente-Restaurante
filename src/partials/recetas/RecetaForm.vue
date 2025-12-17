<template>
  <div class="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/50 z-50" @click.self="$emit('cancelar')">
    <div class="bg-zinc-900/95 border border-zinc-700/50 rounded-lg shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto p-5">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-white">
          {{ receta ? 'Editar Receta' : 'Nueva Receta' }}
        </h2>
        <button
          @click="$emit('cancelar')"
          class="text-gray-400 hover:text-white"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="guardarReceta" class="space-y-6">
        <!-- Información básica -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Nombre de la receta *
            </label>
            <input
              v-model="formulario.nombre"
              type="text"
              required
              class="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700/50 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white placeholder-gray-400"
              :class="{ 'border-red-500': errores.nombre }"
            />
            <p v-if="errores.nombre" class="mt-1 text-sm text-red-400">{{ errores.nombre }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Categoría *
            </label>
            <select
              v-model="formulario.categoria_id"
              required
              class="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700/50 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white"
              :class="{ 'border-red-500': errores.categoria_id }"
            >
              <option value="">Seleccionar categoría</option>
              <option v-for="cat in categorias" :key="cat.id" :value="cat.id">
                {{ cat.nombre }}
              </option>
            </select>
            <p v-if="errores.categoria_id" class="mt-1 text-sm text-red-400">{{ errores.categoria_id }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Tiempo de preparación (minutos) *
            </label>
            <input
              v-model.number="formulario.tiempoPreparacion"
              type="number"
              min="1"
              required
              class="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700/50 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white"
              :class="{ 'border-red-500': errores.tiempoPreparacion }"
            />
            <p v-if="errores.tiempoPreparacion" class="mt-1 text-sm text-red-400">{{ errores.tiempoPreparacion }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Rendimiento (porciones) *
            </label>
            <input
              v-model.number="formulario.rendimiento"
              type="number"
              min="1"
              required
              class="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700/50 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white"
              :class="{ 'border-red-500': errores.rendimiento }"
            />
            <p v-if="errores.rendimiento" class="mt-1 text-sm text-red-400">{{ errores.rendimiento }}</p>
          </div>
        </div>

        <!-- Ingredientes -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-white">Ingredientes</h3>
            <button
              type="button"
              @click="agregarIngrediente"
              class="inline-flex items-center px-3 py-2 border border-zinc-700/50 text-sm font-medium rounded-lg text-white bg-zinc-900/50 hover:bg-zinc-900/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Agregar ingrediente
            </button>
          </div>

          <div class="space-y-4">
            <div
              v-for="(ingrediente, index) in formulario.ingredientes"
              :key="index"
              class="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-zinc-700/50 rounded-lg"
            >
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Ingrediente *
                </label>
                <select
                  v-model="ingrediente.ingredienteId"
                  required
                  class="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700/50 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white"
                  :class="{ 'border-red-500': errores.ingredientes && errores.ingredientes[index] }"
                  @change="actualizarDatosIngrediente(index)"
                >
                  <option value="">Seleccionar ingrediente</option>
                  <option v-for="ing in ingredientesDisponibles" :key="ing.id" :value="ing.id">
                    {{ ing.nombre }} ({{ ing.stock }} {{ ing.unidad }})
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Cantidad *
                </label>
                <input
                  v-model.number="ingrediente.cantidad"
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  class="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700/50 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white"
                  :class="{ 'border-red-500': errores.ingredientes && errores.ingredientes[index] }"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Unidad
                </label>
                <input
                  v-model="ingrediente.unidad"
                  type="text"
                  readonly
                  class="w-full px-3 py-2 bg-zinc-900/30 border border-zinc-700/50 rounded-lg text-gray-400"
                />
              </div>

              <div class="flex items-end">
                <button
                  type="button"
                  @click="eliminarIngrediente(index)"
                  class="w-full px-3 py-2 border border-red-500 text-sm font-medium rounded-lg text-red-400 hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Resumen de costos -->
        <div class="bg-zinc-900/50 border border-zinc-700/50 rounded-lg p-4">
          <h3 class="text-lg font-medium text-white mb-4">Resumen de Costos</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p class="text-sm text-gray-300">Costo total:</p>
              <p class="text-xl font-bold text-white">₡{{ costoTotal.toFixed(2) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-300">Costo por porción:</p>
              <p class="text-xl font-bold text-white">₡{{ costoPorPorcion.toFixed(2) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-300">Ingredientes:</p>
              <p class="text-xl font-bold text-white">{{ formulario.ingredientes.length }}</p>
            </div>
          </div>
        </div>

        <!-- Pasos de preparación -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-white">Pasos de preparación</h3>
            <button
              type="button"
              @click="agregarPaso"
              class="inline-flex items-center px-3 py-2 border border-zinc-700/50 text-sm font-medium rounded-lg text-white bg-zinc-900/50 hover:bg-zinc-900/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Agregar paso
            </button>
          </div>

          <div class="space-y-3">
            <div
              v-for="(paso, index) in formulario.pasos"
              :key="index"
              class="flex items-start space-x-3"
            >
              <span class="text-sm font-medium text-gray-300 mt-2">{{ index + 1 }}.</span>
              <div class="flex-1">
                <textarea
                  v-model="formulario.pasos[index]"
                  rows="2"
                  class="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700/50 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white placeholder-gray-400"
                  placeholder="Describe el paso de preparación..."
                />
              </div>
              <button
                type="button"
                @click="eliminarPaso(index)"
                class="text-red-400 hover:text-red-300 mt-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="flex items-center justify-between pt-6 border-t border-zinc-700/50">
          <div class="flex space-x-3">
            <button
              type="button"
              @click="guardarComoBorrador"
              class="px-4 py-2 bg-zinc-900/50 border border-zinc-700/50 text-sm font-medium rounded-lg text-white hover:bg-zinc-900/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
            >
              Guardar como borrador
            </button>
            <button
              type="button"
              @click="$emit('cancelar')"
              class="px-4 py-2 bg-zinc-900/50 border border-zinc-700/50 text-sm font-medium rounded-lg text-white hover:bg-zinc-900/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
            >
              Cancelar
            </button>
          </div>
          <button
            type="submit"
            class="px-6 py-2 bg-yellow-400 text-black text-sm font-medium rounded-lg hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
          >
            {{ receta ? 'Actualizar' : 'Crear' }} Receta
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'

export default {
  name: 'RecetaForm',
  props: {
    receta: {
      type: Object,
      default: null
    },
    categorias: {
      type: Array,
      required: true
    },
    ingredientes: {
      type: Array,
      required: true
    }
  },
  emits: ['guardar', 'cancelar'],
  setup(props, { emit }) {
    // Estado del formulario
    const formulario = ref({
      id: null,
      nombre: '',
      categoria_id: '',
      tiempoPreparacion: 30,
      rendimiento: 4,
      ingredientes: [],
      pasos: []
    })

    const errores = ref({})

    // Computed properties
    const ingredientesDisponibles = computed(() => {
      // Mostrar TODOS los insumos (incluso los no disponibles/vencidos)
      // tanto al crear como al editar recetas
      return props.ingredientes
    })

    const costoTotal = computed(() => {
      return formulario.value.ingredientes.reduce((total, ing) => {
        const ingrediente = props.ingredientes.find(i => i.id === ing.ingredienteId)
        return total + (ing.cantidad * (ingrediente?.precioUnitario || 0))
      }, 0)
    })

    const costoPorPorcion = computed(() => {
      return formulario.value.rendimiento > 0 ? costoTotal.value / formulario.value.rendimiento : 0
    })

    // Methods
    const agregarIngrediente = () => {
      formulario.value.ingredientes.push({
        ingredienteId: '',
        nombre: '',
        cantidad: 0,
        unidad: '',
        precioUnitario: 0,
        subtotal: 0
      })
    }

    const eliminarIngrediente = (index) => {
      formulario.value.ingredientes.splice(index, 1)
    }

    const agregarPaso = () => {
      formulario.value.pasos.push('')
    }

    const eliminarPaso = (index) => {
      formulario.value.pasos.splice(index, 1)
    }

    const actualizarDatosIngrediente = (index) => {
      const ingredienteId = formulario.value.ingredientes[index].ingredienteId
      if (ingredienteId) {
        const ingrediente = props.ingredientes.find(i => i.id === ingredienteId)
        if (ingrediente) {
          formulario.value.ingredientes[index].unidad = ingrediente.unidad
          formulario.value.ingredientes[index].precioUnitario = ingrediente.precioUnitario || 0
          formulario.value.ingredientes[index].subtotal = formulario.value.ingredientes[index].cantidad * (ingrediente.precioUnitario || 0)
        }
      } else {
        // Reset values when no ingredient is selected
        formulario.value.ingredientes[index].unidad = ''
        formulario.value.ingredientes[index].precioUnitario = 0
        formulario.value.ingredientes[index].subtotal = 0
      }
    }

    const validarFormulario = () => {
      errores.value = {}

      if (!formulario.value.nombre.trim()) {
        errores.value.nombre = 'El nombre es requerido'
      }

      if (!formulario.value.categoria_id) {
        errores.value.categoria_id = 'La categoría es requerida'
      }

      if (!formulario.value.tiempoPreparacion || formulario.value.tiempoPreparacion <= 0) {
        errores.value.tiempoPreparacion = 'El tiempo debe ser mayor a 0'
      }

      if (!formulario.value.rendimiento || formulario.value.rendimiento <= 0) {
        errores.value.rendimiento = 'El rendimiento debe ser mayor a 0'
      }

      // Validar ingredientes
      if (formulario.value.ingredientes.length === 0) {
        errores.value.ingredientes = 'Debe agregar al menos un ingrediente'
      } else {
        formulario.value.ingredientes.forEach((ing, index) => {
          if (!ing.ingredienteId) {
            if (!errores.value.ingredientes) errores.value.ingredientes = {}
            errores.value.ingredientes[index] = 'Seleccione un ingrediente'
          }
          if (!ing.cantidad || ing.cantidad <= 0) {
            if (!errores.value.ingredientes) errores.value.ingredientes = {}
            errores.value.ingredientes[index] = 'La cantidad debe ser mayor a 0'
          }
        })
      }

      return Object.keys(errores.value).length === 0
    }

    const guardarReceta = () => {
      if (!validarFormulario()) return

      // Calcular subtotales y actualizar ingredientes
      const ingredientesActualizados = formulario.value.ingredientes.map(ing => {
        const ingrediente = props.ingredientes.find(i => i.id === ing.ingredienteId)
        return {
          ...ing,
          nombre: ingrediente?.nombre || '',
          unidad: ingrediente?.unidad || '',
          precioUnitario: ingrediente?.precioUnitario || 0,
          subtotal: (ing.cantidad * (ingrediente?.precioUnitario || 0))
        }
      })

      const recetaCompleta = {     
        id: formulario.value.id ?? props.receta?.id ?? null,
        ...formulario.value,
        ingredientes: ingredientesActualizados,
        costoTotal: costoTotal.value,
        costoPorPorcion: costoPorPorcion.value,
        estado: 'Activa',
        popularidad: props.receta?.popularidad || 3,
        rentabilidad: props.receta?.rentabilidad || 60
      }

      emit('guardar', recetaCompleta)
    }

    
const guardarComoBorrador = () => {
  // Construye ingredientes con subtotales como en guardarReceta
  const ingredientesActualizados = formulario.value.ingredientes.map(ing => {
    const ingrediente = props.ingredientes.find(i => i.id === ing.ingredienteId)
    return {
      ...ing,
      nombre: ingrediente?.nombre ?? '',
      unidad: ingrediente?.unidad ?? '',
      precioUnitario: ingrediente?.precioUnitario ?? 0,
      subtotal: (ing.cantidad ?? 0) * (ingrediente?.precioUnitario ?? 0),
    }
  })

  const recetaBorrador = {
    id: formulario.value.id ?? props.receta?.id ?? null,
    ...formulario.value,
    ingredientes: ingredientesActualizados,
    costoTotal: costoTotal.value,            // puede ser 0 (está bien)
    costoPorPorcion: costoPorPorcion.value,  // puede ser 0 (está bien)
    estado: 'Borrador',
    popularidad: props.receta?.popularidad ?? 1,
    rentabilidad: props.receta?.rentabilidad ?? 50,
  }

  emit('guardar', recetaBorrador)
}


    // Watch para actualizar unidad cuando cambie el ingrediente
    watch(() => formulario.value.ingredientes, (ingredientes) => {
      ingredientes.forEach((ing, index) => {
        if (ing.ingredienteId) {
          const ingrediente = props.ingredientes.find(i => i.id === ing.ingredienteId)
          if (ingrediente) {
            // Update unit and other properties when ingredient changes
            formulario.value.ingredientes[index].unidad = ingrediente.unidad
            formulario.value.ingredientes[index].precioUnitario = ingrediente.precioUnitario || 0
            formulario.value.ingredientes[index].subtotal = ing.cantidad * (ingrediente.precioUnitario || 0)
          }
        } else {
          // Reset values when no ingredient is selected
          formulario.value.ingredientes[index].unidad = ''
          formulario.value.ingredientes[index].precioUnitario = 0
          formulario.value.ingredientes[index].subtotal = 0
        }
      })
    }, { deep: true })

    // Watch específico para actualizar subtotal cuando cambia la cantidad
    watch(() => formulario.value.ingredientes.map(ing => ({ id: ing.ingredienteId, cantidad: ing.cantidad })), (nuevosValores, valoresAnteriores) => {
      nuevosValores.forEach((nuevo, index) => {
        const anterior = valoresAnteriores[index]
        if (nuevo.cantidad !== anterior?.cantidad) {
          const ingrediente = props.ingredientes.find(i => i.id === nuevo.id)
          if (ingrediente && nuevo.cantidad > 0) {
            formulario.value.ingredientes[index].subtotal = nuevo.cantidad * (ingrediente.precioUnitario || 0)
          }
        }
      })
    }, { deep: true })

    // Watch individual para cada ingrediente cuando cambia la cantidad
    watch(() => formulario.value.ingredientes, (ingredientes) => {
      ingredientes.forEach((ing, index) => {
        if (ing.ingredienteId && ing.cantidad > 0) {
          const ingrediente = props.ingredientes.find(i => i.id === ing.ingredienteId)
          if (ingrediente) {
            formulario.value.ingredientes[index].subtotal = ing.cantidad * (ingrediente.precioUnitario || 0)
          }
        }
      })
    }, { deep: true })

    // Inicializar formulario si se está editando
    onMounted(() => {
      if (props.receta) {
        console.log('🔧 Inicializando formulario de edición')
        console.log('📋 Receta recibida:', props.receta)
        console.log('📦 Ingredientes disponibles:', props.ingredientes)

        // Transformar ingredientes del backend al formato del formulario
        const ingredientesTransformados = (props.receta.ingredientes || []).map(ing => {
          // Puede venir como 'insumos' o 'insumo' desde el backend
          const insumoData = ing.insumos || ing.insumo
          const insumoId = ing.insumo_id || insumoData?.id

          console.log('🔍 Transformando ingrediente:', {
            original: ing,
            insumoData,
            insumoId,
            nombreExtraido: insumoData?.nombre
          })

          // Verificar si el insumo existe en la lista de ingredientes disponibles
          const insumoEnLista = props.ingredientes.find(i => i.id === insumoId)
          console.log('✅ Ingrediente encontrado en lista:', insumoEnLista)

          return {
            ingredienteId: insumoId,
            nombre: insumoData?.nombre || ing.nombre || '',
            cantidad: ing.cantidad || 0,
            unidad: ing.unidad_medida || insumoData?.unidad_medida || ing.unidad || '',
            precioUnitario: ing.costo_unitario || ing.precioUnitario || 0,
            subtotal: ing.costo_total || ing.subtotal || 0
          }
        })

        console.log('✨ Ingredientes transformados:', ingredientesTransformados)

        // Transformar pasos del backend al formato del formulario
        const pasosTransformados = (props.receta.pasos || []).map(paso => {
          // Si es un objeto con descripcion, extraer el string
          if (typeof paso === 'object' && paso.descripcion) {
            return paso.descripcion
          }
          // Si ya es un string, devolverlo tal cual
          return paso
        })

        console.log('✨ Pasos transformados:', pasosTransformados)

        formulario.value = {
          id: props.receta.id ?? null,
          nombre: props.receta.nombre,
          categoria_id: props.receta.categoria_id,
          tiempoPreparacion: props.receta.tiempo_preparacion || props.receta.tiempoPreparacion,
          rendimiento: props.receta.rendimiento,
          ingredientes: ingredientesTransformados,
          pasos: pasosTransformados
        }

        console.log('📝 Formulario inicializado:', formulario.value)
      } else {
        // Agregar un ingrediente vacío por defecto
        agregarIngrediente()
        // Agregar un paso vacío por defecto
        agregarPaso()
      }
    })

    return {
      formulario,
      errores,
      ingredientesDisponibles,
      costoTotal,
      costoPorPorcion,
      agregarIngrediente,
      eliminarIngrediente,
      agregarPaso,
      eliminarPaso,
      guardarReceta,
      guardarComoBorrador,
      actualizarDatosIngrediente
    }
  }
}
</script> 
