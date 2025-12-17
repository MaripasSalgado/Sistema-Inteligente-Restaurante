<template>
  <div class="space-y-6">
    <div style="background-color: rgb(24 24 27 / 0.8);" class="border border-zinc-700/50 rounded-lg p-6">
      <h2 class="text-xl font-bold text-white mb-6">
        {{ venta ? 'Editar Venta' : 'Nueva Venta' }}
      </h2>

      <form @submit.prevent="guardarVenta" class="space-y-6">
        <!-- Información del cliente -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Nombre del Cliente *</label>
            <input
              v-model="form.cliente"
              type="text"
              required
              placeholder="Nombre completo del cliente"
              class="w-full px-3 py-2 border border-zinc-700/50 rounded-lg bg-zinc-900/60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Teléfono</label>
            <input
              v-model="form.telefono"
              type="tel"
              placeholder="+503 7123-4567"
              class="w-full px-3 py-2 border border-zinc-700/50 rounded-lg bg-zinc-900/60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Dirección</label>
            <input
              v-model="form.direccion"
              type="text"
              placeholder="Dirección completa"
              class="w-full px-3 py-2 border border-zinc-700/50 rounded-lg bg-zinc-900/60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Tipo de Venta *</label>
            <select
              v-model="form.tipoVenta"
              required
              class="w-full px-3 py-2 border border-zinc-700/50 rounded-lg bg-zinc-900/60 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Seleccionar tipo</option>
              <option value="Local">Local</option>
              <option value="Para Llevar">Para Llevar</option>
              <option value="Domicilio">Domicilio</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Estado *</label>
            <select
              v-model="form.estado"
              required
              class="w-full px-3 py-2 border border-zinc-700/50 rounded-lg bg-zinc-900/60 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="Pendiente">Pendiente</option>
              <option value="En Proceso">En Proceso</option>
              <option value="Completada">Completada</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Método de Pago *</label>
            <select
              v-model="form.metodoPago"
              required
              class="w-full px-3 py-2 border border-zinc-700/50 rounded-lg bg-zinc-900/60 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Seleccionar método</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta">Tarjeta</option>
              <option value="Transferencia">Transferencia</option>
            </select>
          </div>
        </div>

        <!-- Productos -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Productos *</label>
          <div class="space-y-4">
            <!-- Lista de productos seleccionados -->
            <div v-if="form.productos.length > 0" class="space-y-3">
              <div
                v-for="(producto, index) in form.productos"
                :key="index"
                class="flex items-center justify-between p-3 border border-zinc-700/50 rounded-lg"
                style="background-color: rgb(24 24 27 / 0.8);"
              >
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <span class="text-white font-medium">{{ producto.nombre }}</span>
                    <span class="text-gray-400 text-sm">₡{{ producto.precioUnitario }}/unidad</span>
                  </div>
                  <div class="flex items-center mt-2">
                    <label class="text-sm text-gray-300 mr-2">Cantidad:</label>
                    <input
                      v-model.number="producto.cantidad"
                      type="number"
                      min="1"
                      class="w-20 px-2 py-1 border border-zinc-700/50 rounded bg-zinc-900/60 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    <span class="text-sm text-gray-400 ml-2">unidades</span>
                    <span class="text-sm text-yellow-400 ml-4">
                      Subtotal: ₡{{ (producto.precioUnitario * producto.cantidad).toFixed(2) }}
                    </span>
                  </div>
                </div>
                <button
                  @click="eliminarProducto(index)"
                  type="button"
                  class="ml-3 px-2 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-500 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>

            <!-- Selector para agregar productos -->
            <div class="border border-zinc-700/50 rounded-lg p-4" style="background-color: rgb(24 24 27 / 0.8);">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Producto</label>
                  <select
                    v-model="productoSeleccionado"
                    class="w-full px-3 py-2 border border-zinc-700/50 rounded-lg bg-zinc-900/60 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="">Seleccionar producto</option>
                    <option
                      v-for="producto in productosDisponibles"
                      :key="producto.id"
                      :value="producto"
                    >
                      {{ producto.nombre }} - ₡{{ producto.precioVenta }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Cantidad</label>
                  <input
                    v-model.number="cantidadProducto"
                    type="number"
                    min="1"
                    placeholder="1"
                    class="w-full px-3 py-2 border border-zinc-700/50 rounded-lg bg-zinc-900/60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div class="flex items-end">
                  <button
                    @click="agregarProducto"
                    type="button"
                    :disabled="!productoSeleccionado || cantidadProducto < 1"
                    class="w-full px-4 py-2 text-sm font-medium text-white bg-yellow-400 rounded-lg hover:bg-yellow-300 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                  >
                    Agregar Producto
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Resumen de la venta -->
        <div class="border border-zinc-700/50 rounded-lg p-6" style="background-color: rgb(24 24 27 / 0.8);">
          <h3 class="text-lg font-medium text-white mb-4">Resumen de la Venta</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-300">Subtotal:</span>
                <span class="text-white font-medium">₡{{ subtotal.toFixed(2) }}</span>
              </div>

              <div class="flex justify-between">
                <span class="text-gray-300">Impuesto (13%):</span>
                <span class="text-white font-medium">₡{{ impuesto.toFixed(2) }}</span>
              </div>

              <div class="flex justify-between">
                <span class="text-gray-300">Descuento:</span>
                <span class="text-white font-medium">₡{{ form.descuento.toFixed(2) }}</span>
              </div>
            </div>
            
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-300">Total:</span>
                <span class="text-yellow-400 font-bold text-lg">₡{{ total.toFixed(2) }}</span>
              </div>
              
              <div class="flex justify-between">
                <span class="text-gray-300">Productos:</span>
                <span class="text-white">{{ form.productos.length }}</span>
              </div>
              
              <div class="flex justify-between">
                <span class="text-gray-300">Empleado:</span>
                <span class="text-white">{{ form.empleado }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Descuento y empleado -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Descuento (₡)</label>
            <input
              v-model.number="form.descuento"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              class="w-full px-3 py-2 border border-zinc-700/50 rounded-lg bg-zinc-900/60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Empleado</label>
            <input
              v-model="form.empleado"
              type="text"
              placeholder="Nombre del empleado"
              class="w-full px-3 py-2 border border-zinc-700/50 rounded-lg bg-zinc-900/60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        </div>

        <!-- Notas -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Notas</label>
          <textarea
            v-model="form.notas"
            rows="3"
            placeholder="Notas especiales, instrucciones de preparación, etc."
            class="w-full px-3 py-2 border border-zinc-700/50 rounded-lg bg-zinc-900/60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          ></textarea>
        </div>

        <!-- Botones de acción -->
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
            :disabled="!formValido || guardando"
            class="px-4 py-2 text-sm font-medium text-black bg-yellow-400 rounded-lg hover:bg-yellow-500 disabled:bg-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {{ guardando ? 'Guardando…' : (venta ? 'Actualizar Venta' : 'Crear Venta') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'

export default {
  name: 'VentaForm',
  props: {
    venta: {
      type: Object,
      default: null
    },
    productos: {
      type: Array,
      required: true
    },
    guardando: {
      type: Boolean,
      default: false
    }
  },
  emits: ['guardar', 'cancelar'],
  setup(props, { emit }) {
    const crearFormularioBase = () => ({
      id: null,
      cliente: '',
      telefono: '',
      direccion: '',
      tipoVenta: '',
      estado: 'Pendiente',
      metodoPago: '',
      productos: [],
      descuento: 0,
      empleado: '',
      notas: ''
    })

    const form = ref(crearFormularioBase())

    const productoSeleccionado = ref(null)
    const cantidadProducto = ref(1)

    // Computed properties
    const productosDisponibles = computed(() => {
      return props.productos.filter(p => (p.estado || 'Activo') !== 'Inactivo' && p.activo !== false)
    })

    const IVA_COSTA_RICA = 0.13

    const guardando = computed(() => props.guardando)

    const subtotal = computed(() => {
      return form.value.productos.reduce((totalSum, producto) => {
        const precio = Number(producto.precioUnitario) || 0
        const cantidad = Number(producto.cantidad) || 0
        return totalSum + (precio * cantidad)
      }, 0)
    })

    const impuesto = computed(() => {
      return subtotal.value * IVA_COSTA_RICA
    })

    const total = computed(() => {
      const descuento = Number(form.value.descuento) || 0
      const calculo = subtotal.value + impuesto.value - descuento
      return calculo < 0 ? 0 : calculo
    })

    const formValido = computed(() => {
      return form.value.cliente && 
             form.value.tipoVenta && 
             form.value.estado && 
             form.value.metodoPago && 
             form.value.productos.length > 0
    })

    // Methods
    const agregarProducto = () => {
      if (!productoSeleccionado.value || cantidadProducto.value < 1) return

      const precioUnitario = Number(productoSeleccionado.value.precioVenta ?? productoSeleccionado.value.precio_venta) || 0
      const cantidad = Number(cantidadProducto.value) || 1

      const nuevoProducto = {
        id: productoSeleccionado.value.id,
        productoId: productoSeleccionado.value.id,
        nombre: productoSeleccionado.value.nombre,
        cantidad,
        precioUnitario,
        subtotal: precioUnitario * cantidad
      }

      form.value.productos.push(nuevoProducto)
      
      // Reset
      productoSeleccionado.value = null
      cantidadProducto.value = 1
    }

    const eliminarProducto = (index) => {
      form.value.productos.splice(index, 1)
    }

    const guardarVenta = () => {
      if (!formValido.value) return

      const ventaData = {
        ...form.value,
        id: form.value.id,
        subtotal: subtotal.value,
        impuesto: impuesto.value,
        total: total.value
      }

      emit('guardar', ventaData)
    }

    watch(
      () => props.venta,
      (nuevaVenta) => {
        if (nuevaVenta) {
          form.value = {
            id: nuevaVenta.id || null,
            cliente: nuevaVenta.cliente || '',
            telefono: nuevaVenta.telefono || '',
            direccion: nuevaVenta.direccion || '',
            tipoVenta: nuevaVenta.tipoVenta || '',
            estado: nuevaVenta.estado || 'Pendiente',
            metodoPago: nuevaVenta.metodoPago || '',
            productos: (nuevaVenta.productos || []).map(producto => {
              const precioUnitario = Number(producto.precioUnitario ?? producto.precio_unitario ?? producto.precioVenta ?? producto.precio_venta) || 0
              const cantidad = Number(producto.cantidad) || 1
              return {
                id: producto.id || producto.productoId,
                productoId: producto.productoId || producto.id,
                nombre: producto.nombre,
                cantidad,
                precioUnitario,
                subtotal: precioUnitario * cantidad,
                descuento: Number(producto.descuento) || 0,
                observaciones: producto.observaciones || null
              }
            }),
            descuento: Number(nuevaVenta.descuento) || 0,
            empleado: nuevaVenta.empleado || '',
            notas: nuevaVenta.notas || ''
          }
        } else {
          form.value = crearFormularioBase()
        }
        productoSeleccionado.value = null
        cantidadProducto.value = 1
      },
      { immediate: true }
    )

    return {
      form,
      productoSeleccionado,
      cantidadProducto,
      productosDisponibles,
      subtotal,
      impuesto,
      total,
      formValido,
      agregarProducto,
      eliminarProducto,
      guardarVenta,
      guardando
    }
  }
}
</script> 
