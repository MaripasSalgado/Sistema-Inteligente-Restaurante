<template>
  <div class="bg-zinc-900/80 border border-zinc-700/50 shadow-xs rounded-xl">
    <header class="px-5 py-4 border-b border-[#CCCCCC]">
      <h2 class="font-semibold text-gray-100">{{ esEdicion ? 'Editar Proveedor' : 'Registrar Nuevo Proveedor' }}</h2>
    </header>
    
    <div class="p-5">
      <form @submit.prevent="guardarProveedor" class="space-y-6">
        <!-- Información Básica -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Código (solo lectura si es edición) -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Código</label>
            <input
              v-if="!esEdicion"
              type="text"
              readonly
              class="w-full px-3 py-2 bg-zinc-800 border border-[#CCCCCC] rounded-lg text-gray-400 cursor-not-allowed"
              :value="generarCodigo()"
            />
            <input
              v-else
              v-model="form.codigo"
              type="text"
              readonly
              class="w-full px-3 py-2 bg-zinc-800 border border-[#CCCCCC] rounded-lg text-gray-400 cursor-not-allowed"
            />
          </div>

          <!-- Nombre -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Nombre *</label>
            <input
              v-model="form.nombre"
              type="text"
              required
              class="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
              :class="{ 'border-red-500': errores.nombre }"
              placeholder="Nombre del proveedor"
            />
            <p v-if="errores.nombre" class="mt-1 text-sm text-red-400">{{ errores.nombre }}</p>
          </div>

          <!-- Tipo de Proveedor -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Tipo de Proveedor *</label>
            <select
              v-model="form.tipo"
              required
              class="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
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

          <!-- Teléfono -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Teléfono *</label>
            <input
              v-model="form.telefono"
              type="tel"
              required
              class="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
              :class="{ 'border-red-500': errores.telefono }"
              placeholder="88888888"
            />
            <p v-if="errores.telefono" class="mt-1 text-sm text-red-400">{{ errores.telefono }}</p>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Email *</label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
              :class="{ 'border-red-500': errores.email }"
              placeholder="proveedor@ejemplo.com"
            />
            <p v-if="errores.email" class="mt-1 text-sm text-red-400">{{ errores.email }}</p>
          </div>

          <!-- Contacto Principal -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Contacto Principal</label>
            <input
              v-model="form.contacto_principal"
              type="text"
              class="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Nombre del contacto"
            />
          </div>

          <!-- RTN -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">RTN</label>
            <input
              v-model="form.rtn"
              type="text"
              class="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Registro Tributario Nacional"
            />
          </div>
        </div>

        <!-- Dirección -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Dirección *</label>
          <textarea
            v-model="form.direccion"
            rows="3"
            required
            class="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
            :class="{ 'border-red-500': errores.direccion }"
            placeholder="Dirección completa del proveedor"
          ></textarea>
          <p v-if="errores.direccion" class="mt-1 text-sm text-red-400">{{ errores.direccion }}</p>
        </div>

        <!-- Observaciones -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Observaciones</label>
          <textarea
            v-model="form.observaciones"
            rows="3"
            class="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="Notas adicionales sobre el proveedor"
          ></textarea>
        </div>

        <!-- Estado (solo en edición) -->
        <div v-if="esEdicion" class="flex items-center space-x-4">
          <label class="flex items-center">
            <input
              v-model="form.estado"
              type="checkbox"
              class="rounded border-zinc-600 text-amber-500 focus:ring-violet-500 bg-black"
            />
            <span class="ml-2 text-sm text-gray-300">Proveedor Activo</span>
          </label>
        </div>

        <!-- Botones -->
        <div class="flex justify-end space-x-3 pt-6 border-t border-gray-700">
          <button
            type="button"
            @click="$emit('cancelar')"
            class="px-4 py-2 border border-[#CCCCCC] rounded-lg text-gray-300 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="guardando"
            class="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="guardando">Guardando...</span>
            <span v-else>{{ esEdicion ? 'Actualizar' : 'Registrar' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch } from 'vue'

export default {
  name: 'ProveedorForm',
  props: {
    proveedor: {
      type: Object,
      default: null
    }
  },
  emits: ['guardar', 'cancelar'],
  setup(props, { emit }) {
    const guardando = ref(false)
    const errores = reactive({})

    const esEdicion = computed(() => !!props.proveedor)

    const form = reactive({
      codigo: '',
      nombre: '',
      tipo: '',
      telefono: '',
      email: '',
      direccion: '',
      contacto_principal: '',
      rtn: '',
      observaciones: '',
      estado: true
    })

    // Generar código único
    const generarCodigo = () => {
      const timestamp = Date.now()
      const random = Math.floor(Math.random() * 1000)
      return `PROV-${String(timestamp).slice(-3)}${String(random).padStart(3, '0')}`
    }

    // Cargar datos si es edición
    watch(() => props.proveedor, (nuevoProveedor) => {
      if (nuevoProveedor) {
        Object.assign(form, {
          codigo: nuevoProveedor.codigo,
          nombre: nuevoProveedor.nombre,
          tipo: nuevoProveedor.tipo,
          telefono: nuevoProveedor.telefono,
          email: nuevoProveedor.email,
          direccion: nuevoProveedor.direccion,
          contacto_principal: nuevoProveedor.contacto_principal || '',
          rtn: nuevoProveedor.rtn || '',
          observaciones: nuevoProveedor.observaciones || '',
          estado: nuevoProveedor.estado === 'Activo'
        })
      } else {
        // Resetear formulario
        Object.assign(form, {
          codigo: generarCodigo(),
          nombre: '',
          tipo: '',
          telefono: '',
          email: '',
          direccion: '',
          contacto_principal: '',
          rtn: '',
          observaciones: '',
          estado: true
        })
      }
      // Limpiar errores
      Object.keys(errores).forEach(key => delete errores[key])
    }, { immediate: true })

    // Validaciones
    const validarFormulario = () => {
      const nuevosErrores = {}

      // Validar nombre
      if (!form.nombre.trim()) {
        nuevosErrores.nombre = 'El nombre es obligatorio'
      } else if (form.nombre.length < 3) {
        nuevosErrores.nombre = 'El nombre debe tener al menos 3 caracteres'
      }

      // Validar tipo
      if (!form.tipo) {
        nuevosErrores.tipo = 'Debe seleccionar un tipo de proveedor'
      }

      // Validar teléfono
      if (!form.telefono.trim()) {
        nuevosErrores.telefono = 'El teléfono es obligatorio'
      } else if (!/^\d{8,}$/.test(form.telefono.replace(/\s/g, ''))) {
        nuevosErrores.telefono = 'El teléfono debe tener al menos 8 dígitos'
      }

      // Validar email
      if (!form.email.trim()) {
        nuevosErrores.email = 'El email es obligatorio'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        nuevosErrores.email = 'El email no tiene un formato válido'
      }

      // Validar dirección
      if (!form.direccion.trim()) {
        nuevosErrores.direccion = 'La dirección es obligatoria'
      } else if (form.direccion.length < 10) {
        nuevosErrores.direccion = 'La dirección debe tener al menos 10 caracteres'
      }

      // Actualizar errores
      Object.keys(errores).forEach(key => delete errores[key])
      Object.assign(errores, nuevosErrores)

      return Object.keys(nuevosErrores).length === 0
    }

    const guardarProveedor = async () => {
      if (!validarFormulario()) {
        return
      }

      guardando.value = true

      try {
        const proveedorData = {
          nombre: form.nombre,
          tipo: form.tipo,
          telefono: form.telefono,
          email: form.email,
          direccion: form.direccion,
          contacto_principal: form.contacto_principal || null,
          rtn: form.rtn || null,
          observaciones: form.observaciones || null,
          estado: form.estado ? 'Activo' : 'Inactivo'
        }

        // Solo incluir código si es edición
        if (esEdicion.value) {
          proveedorData.codigo = form.codigo
        }

        emit('guardar', proveedorData)
      } catch (error) {
        console.error('Error al guardar:', error)
      } finally {
        guardando.value = false
      }
    }

    return {
      form,
      errores,
      guardando,
      esEdicion,
      generarCodigo,
      guardarProveedor
    }
  }
}
</script> 