<template>
  <div v-if="show">
    <!-- Overlay -->
    <div class="fixed inset-0 z-50 backdrop-blur-sm bg-black/50 transition-opacity"></div>

    <!-- Modal -->
    <div class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="relative bg-zinc-900/95 border border-zinc-700/50 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-zinc-900/95 border-b border-zinc-700/50 px-6 py-4 flex items-center justify-between rounded-t-xl">
        <h2 class="text-xl font-bold text-white">Editar Proveedor</h2>
        <button @click="cerrar" class="text-gray-400 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="guardar" class="p-6 space-y-6">
        <!-- Información Básica -->
        <div class="bg-zinc-900/50 rounded-lg p-4 border border-zinc-700/50">
          <h3 class="text-lg font-semibold text-white mb-4">Información Básica</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Código (readonly) -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Código</label>
              <input
                v-model="formulario.codigo"
                type="text"
                readonly
                class="w-full px-3 py-2 bg-gray-800 border border-zinc-600 rounded-lg text-gray-400 cursor-not-allowed"
              />
            </div>

            <!-- Nombre -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Nombre *</label>
              <input
                v-model="formulario.nombre"
                type="text"
                required
                class="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                :class="{ 'border-red-500': errores.nombre }"
                placeholder="Nombre del proveedor"
              />
              <p v-if="errores.nombre" class="mt-1 text-sm text-red-400">{{ errores.nombre }}</p>
            </div>

            <!-- Tipo de Proveedor -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Tipo de Proveedor *</label>
              <select
                v-model="formulario.tipo"
                required
                class="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                :class="{ 'border-red-500': errores.tipo }"
              >
                <option value="">Seleccionar tipo</option>
                <option value="Carnes y Embutidos">Carnes y Embutidos</option>
                <option value="Frutas y Verduras">Frutas y Verduras</option>
                <option value="Lácteos y Derivados">Lácteos y Derivados</option>
                <option value="Granos y Harinas">Granos y Harinas</option>
                <option value="Condimentos y Especias">Condimentos y Especias</option>
                <option value="Bebidas">Bebidas</option>
                <option value="Otros">Otros</option>
              </select>
              <p v-if="errores.tipo" class="mt-1 text-sm text-red-400">{{ errores.tipo }}</p>
            </div>

            <!-- Estado -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Estado</label>
              <select
                v-model="formulario.estado"
                class="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
                <option value="Suspendido">Suspendido</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Información de Contacto -->
        <div class="bg-zinc-900/50 rounded-lg p-4 border border-zinc-700/50">
          <h3 class="text-lg font-semibold text-white mb-4">Información de Contacto</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Teléfono -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Teléfono *</label>
              <input
                v-model="formulario.telefono"
                type="tel"
                required
                class="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                :class="{ 'border-red-500': errores.telefono }"
                placeholder="88888888"
              />
              <p v-if="errores.telefono" class="mt-1 text-sm text-red-400">{{ errores.telefono }}</p>
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Email *</label>
              <input
                v-model="formulario.email"
                type="email"
                required
                class="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                :class="{ 'border-red-500': errores.email }"
                placeholder="proveedor@ejemplo.com"
              />
              <p v-if="errores.email" class="mt-1 text-sm text-red-400">{{ errores.email }}</p>
            </div>

            <!-- Contacto Principal -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Contacto Principal</label>
              <input
                v-model="formulario.contacto_principal"
                type="text"
                class="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Nombre del contacto"
              />
            </div>

            <!-- RTN -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">RTN</label>
              <input
                v-model="formulario.rtn"
                type="text"
                class="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Registro Tributario Nacional"
              />
            </div>

            <!-- Dirección -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-300 mb-2">Dirección *</label>
              <textarea
                v-model="formulario.direccion"
                rows="3"
                required
                class="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                :class="{ 'border-red-500': errores.direccion }"
                placeholder="Dirección completa del proveedor"
              ></textarea>
              <p v-if="errores.direccion" class="mt-1 text-sm text-red-400">{{ errores.direccion }}</p>
            </div>
          </div>
        </div>

        <!-- Observaciones -->
        <div class="bg-zinc-900/50 rounded-lg p-4 border border-zinc-700/50">
          <h3 class="text-lg font-semibold text-white mb-4">Observaciones</h3>
          <textarea
            v-model="formulario.observaciones"
            rows="3"
            class="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="Notas adicionales sobre el proveedor"
          ></textarea>
        </div>
      </form>

      <!-- Footer -->
      <div class="sticky bottom-0 bg-zinc-900/95 border-t border-zinc-700/50 px-6 py-4 flex justify-end space-x-3 rounded-b-xl">
        <button
          @click="cerrar"
          type="button"
          class="px-4 py-2 border border-zinc-600 rounded-lg text-gray-300 hover:bg-zinc-900/70 transition-colors"
        >
          Cancelar
        </button>
        <button
          @click="guardar"
          :disabled="guardando"
          type="submit"
          class="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span v-if="guardando">Guardando...</span>
          <span v-else>Guardar Cambios</span>
        </button>
      </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch } from 'vue'

export default {
  name: 'ProveedorEditModal',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    proveedor: {
      type: Object,
      default: null
    }
  },
  emits: ['cerrar', 'guardar'],
  setup(props, { emit }) {
    const guardando = ref(false)
    const errores = reactive({})

    const formulario = reactive({
      codigo: '',
      nombre: '',
      tipo: '',
      telefono: '',
      email: '',
      direccion: '',
      contacto_principal: '',
      rtn: '',
      observaciones: '',
      estado: 'Activo'
    })

    // Cargar datos del proveedor cuando se abre el modal
    watch(() => props.proveedor, (nuevoProveedor) => {
      if (nuevoProveedor) {
        Object.assign(formulario, {
          codigo: nuevoProveedor.codigo,
          nombre: nuevoProveedor.nombre,
          tipo: nuevoProveedor.tipo,
          telefono: nuevoProveedor.telefono,
          email: nuevoProveedor.email,
          direccion: nuevoProveedor.direccion,
          contacto_principal: nuevoProveedor.contacto_principal || '',
          rtn: nuevoProveedor.rtn || '',
          observaciones: nuevoProveedor.observaciones || '',
          estado: nuevoProveedor.estado
        })
      }
    }, { immediate: true })

    const validarFormulario = () => {
      const nuevosErrores = {}

      // Validar nombre
      if (!formulario.nombre.trim()) {
        nuevosErrores.nombre = 'El nombre es obligatorio'
      } else if (formulario.nombre.length < 3) {
        nuevosErrores.nombre = 'El nombre debe tener al menos 3 caracteres'
      }

      // Validar tipo
      if (!formulario.tipo) {
        nuevosErrores.tipo = 'Debe seleccionar un tipo de proveedor'
      }

      // Validar teléfono
      if (!formulario.telefono.trim()) {
        nuevosErrores.telefono = 'El teléfono es obligatorio'
      } else if (!/^\d{8,}$/.test(formulario.telefono.replace(/\s/g, ''))) {
        nuevosErrores.telefono = 'El teléfono debe tener al menos 8 dígitos'
      }

      // Validar email
      if (!formulario.email.trim()) {
        nuevosErrores.email = 'El email es obligatorio'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.email)) {
        nuevosErrores.email = 'El email no tiene un formato válido'
      }

      // Validar dirección
      if (!formulario.direccion.trim()) {
        nuevosErrores.direccion = 'La dirección es obligatoria'
      } else if (formulario.direccion.length < 10) {
        nuevosErrores.direccion = 'La dirección debe tener al menos 10 caracteres'
      }

      // Actualizar errores
      Object.keys(errores).forEach(key => delete errores[key])
      Object.assign(errores, nuevosErrores)

      return Object.keys(nuevosErrores).length === 0
    }

    const guardar = async () => {
      if (!validarFormulario()) {
        return
      }

      guardando.value = true

      try {
        const proveedorData = {
          nombre: formulario.nombre,
          tipo: formulario.tipo,
          telefono: formulario.telefono,
          email: formulario.email,
          direccion: formulario.direccion,
          contacto_principal: formulario.contacto_principal || null,
          rtn: formulario.rtn || null,
          observaciones: formulario.observaciones || null,
          estado: formulario.estado
        }

        emit('guardar', props.proveedor.id, proveedorData)
      } catch (error) {
        console.error('Error al guardar:', error)
      } finally {
        guardando.value = false
      }
    }

    const cerrar = () => {
      // Limpiar errores
      Object.keys(errores).forEach(key => delete errores[key])
      emit('cerrar')
    }

    return {
      formulario,
      errores,
      guardando,
      guardar,
      cerrar
    }
  }
}
</script>

