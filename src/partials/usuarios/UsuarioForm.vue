<template>
  <div class="space-y-6">
    <div style="background-color: rgb(24 24 27 / 0.8);" class="border border-zinc-700/50 rounded-lg p-6">
      <h2 class="text-xl font-bold text-white mb-6">
        {{ usuario ? 'Editar Usuario' : 'Nuevo Usuario' }}
      </h2>

      <form @submit.prevent="guardarUsuario" class="space-y-6">
        <!-- Información personal -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">Nombre *</label>
            <input
              v-model="form.nombre"
              type="text"
              required
              placeholder="Nombre del usuario"
              class="input-field w-full px-3 py-2 rounded-lg"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">Apellido *</label>
            <input
              v-model="form.apellido"
              type="text"
              required
              placeholder="Apellido del usuario"
              class="input-field w-full px-3 py-2 rounded-lg"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">Email *</label>
            <input
              v-model="form.email"
              type="email"
              required
              placeholder="usuario@empresa.com"
              class="input-field w-full px-3 py-2 rounded-lg"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">Teléfono</label>
            <input
              v-model="form.telefono"
              type="tel"
              placeholder="+506 1234 5678"
              class="input-field w-full px-3 py-2 rounded-lg"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">Cédula</label>
            <input
              v-model="form.cedula"
              type="text"
              placeholder="00000000-0"
              class="input-field w-full px-3 py-2 rounded-lg"
            />
          </div>
        </div>

        <!-- Información laboral -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">Rol</label>
            <select
              v-model="form.rol_id"
              class="input-field w-full px-3 py-2 rounded-lg"
            >
              <option value="">Seleccionar rol</option>
              <option
                v-for="rol in roles"
                :key="rol.id"
                :value="rol.id"
              >
                {{ rol.nombre }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">Departamento *</label>
            <select
              v-model="form.departamento"
              required
              class="input-field w-full px-3 py-2 rounded-lg"
            >
              <option value="">Seleccionar departamento</option>
              <option value="Administración">Administración</option>
              <option value="Operaciones">Operaciones</option>
              <option value="Ventas">Ventas</option>
              <option value="Cocina">Cocina</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">Estado *</label>
            <select
              v-model="form.estado"
              required
              class="input-field w-full px-3 py-2 rounded-lg"
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
        </div>

        <!-- Contraseña (solo para nuevos usuarios) -->
        <div v-if="!usuario" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">Contraseña *</label>
            <input
              v-model="form.password"
              type="password"
              required
              placeholder="Contraseña segura"
              class="input-field w-full px-3 py-2 rounded-lg"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">Confirmar Contraseña *</label>
            <input
              v-model="form.confirmPassword"
              type="password"
              required
              placeholder="Repetir contraseña"
              class="input-field w-full px-3 py-2 rounded-lg"
            />
          </div>
        </div>

        <!-- Información adicional -->
        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">Puesto</label>
          <input
            v-model="form.puesto"
            type="text"
            placeholder="Puesto de trabajo"
            class="input-field w-full px-3 py-2 rounded-lg"
          />
        </div>

        <!-- Notas -->
        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">Notas</label>
          <textarea
            v-model="form.notas"
            rows="3"
            placeholder="Notas adicionales sobre el usuario..."
            class="input-field w-full px-3 py-2 rounded-lg resize-none"
          ></textarea>
        </div>

        <!-- Validaciones -->
        <div v-if="errores.length > 0" class="bg-red-900 border border-red-300 rounded-lg p-4">
          <h3 class="text-red-400 font-medium mb-2">Errores de validación:</h3>
          <ul class="text-red-300 text-sm space-y-1">
            <li v-for="error in errores" :key="error">{{ error }}</li>
          </ul>
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
            :disabled="!formValido"
            class="px-4 py-2 text-sm font-medium text-white bg-yellow-400 rounded-lg hover:bg-yellow-300 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            {{ usuario ? 'Actualizar Usuario' : 'Crear Usuario' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'UsuarioForm',
  props: {
    usuario: {
      type: Object,
      default: null
    },
    roles: {
      type: Array,
      required: true
    }
  },
  emits: ['guardar', 'cancelar'],
  setup(props, { emit }) {
    const form = ref({
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      cedula: '',
      rol_id: '',
      departamento: '',
      puesto: '',
      estado: 'Activo',
      password: '',
      confirmPassword: '',
      notas: ''
    })

    const errores = ref([])

    // Computed properties
    const formValido = computed(() => {
      return form.value.nombre && 
             form.value.apellido && 
             form.value.email && 
             form.value.departamento &&
             (props.usuario || (form.value.password && form.value.password === form.value.confirmPassword))
    })

    // Methods
    const validarFormulario = () => {
      errores.value = []

      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(form.value.email)) {
        errores.value.push('El email no tiene un formato válido')
      }

      // Validar contraseña (solo para nuevos usuarios)
      if (!props.usuario) {
        if (form.value.password.length < 6) {
          errores.value.push('La contraseña debe tener al menos 6 caracteres')
        }
        if (form.value.password !== form.value.confirmPassword) {
          errores.value.push('Las contraseñas no coinciden')
        }
      }

      return errores.value.length === 0
    }

    const guardarUsuario = () => {
      if (!validarFormulario()) return

      const usuarioData = {
        ...form.value,
        id: props.usuario?.id,
        fechaCreacion: props.usuario?.fechaCreacion || new Date().toISOString().split('T')[0],
        fechaModificacion: props.usuario ? new Date().toISOString().split('T')[0] : null,
        ultimoAcceso: props.usuario?.ultimoAcceso || null
      }

      // Remover campos de contraseña si es edición
      if (props.usuario) {
        delete usuarioData.password
        delete usuarioData.confirmPassword
      }

      emit('guardar', usuarioData)
    }

    // Inicializar formulario si se está editando
    onMounted(() => {
      if (props.usuario) {
        form.value = {
          nombre: props.usuario.nombre || '',
          apellido: props.usuario.apellido || '',
          email: props.usuario.email || '',
          telefono: props.usuario.telefono || '',
          cedula: props.usuario.cedula || '',
          rol_id: props.usuario.rol_id || '',
          departamento: props.usuario.departamento || '',
          puesto: props.usuario.puesto || '',
          estado: props.usuario.estado || 'Activo',
          password: '',
          confirmPassword: '',
          notas: props.usuario.notas || ''
        }
      }
    })

    return {
      form,
      errores,
      formValido,
      guardarUsuario
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
  outline: 2px solid transparent;
  outline-offset: 2px;
  border-color: #9ca3af;
  box-shadow: 0 0 0 3px rgba(156, 163, 175, 0.1);
}

/* Estilos para select */
select.input-field option {
  background-color: rgb(24 24 27);
  color: white;
}

/* Estilos para textarea */
textarea.input-field {
  resize: vertical;
}
</style> 