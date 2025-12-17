<template>
  <Teleport to="body">
    <Transition name="modal" appear>
      <div v-if="mostrar" class="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/50 z-[9999]" @click.self="cerrar">
        <div class="modal-content bg-zinc-900/95 border border-zinc-700/50 rounded-lg shadow-2xl p-6 max-w-2xl w-full mx-4 relative max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-white">Editar Usuario</h3>
            <button
              @click="cerrar"
              class="text-gray-400 hover:text-white transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="guardar" class="space-y-6">
            <!-- Información Personal -->
            <div style="background-color: rgb(24 24 27 / 0.8);" class="border border-zinc-600 rounded-lg p-4">
              <h4 class="text-lg font-medium text-white mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Información Personal
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            <!-- Información Laboral -->
            <div style="background-color: rgb(24 24 27 / 0.8);" class="border border-zinc-600 rounded-lg p-4">
              <h4 class="text-lg font-medium text-white mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
                Información Laboral
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <label class="block text-sm font-medium text-gray-400 mb-2">Puesto</label>
                  <input
                    v-model="form.puesto"
                    type="text"
                    placeholder="Puesto de trabajo"
                    class="input-field w-full px-3 py-2 rounded-lg"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2">Estado *</label>
                  <div class="flex items-center space-x-4">
                    <select
                      v-model="form.estado"
                      required
                      class="input-field flex-1 px-3 py-2 rounded-lg"
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                    <div class="flex items-center space-x-2">
                      <span class="text-sm text-gray-400">Cambiar estado:</span>
                      <button
                        @click="toggleEstado"
                        type="button"
                        :class="form.estado === 'Activo' 
                          ? 'bg-red-600 hover:bg-red-500 text-white' 
                          : 'bg-green-600 hover:bg-green-500 text-white'"
                        class="px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                      >
                        {{ form.estado === 'Activo' ? 'Desactivar' : 'Activar' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Biografía -->
            <div style="background-color: rgb(24 24 27 / 0.8);" class="border border-zinc-600 rounded-lg p-4">
              <h4 class="text-lg font-medium text-white mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                Información Adicional
              </h4>
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-2">Biografía</label>
                <textarea
                  v-model="form.biografia"
                  rows="3"
                  placeholder="Notas adicionales sobre el usuario..."
                  class="input-field w-full px-3 py-2 rounded-lg resize-none"
                ></textarea>
              </div>
            </div>

            <!-- Botones de Acción -->
            <div class="flex justify-end space-x-3 pt-4 border-t border-zinc-600">
              <button
                @click="cerrar"
                type="button"
                class="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="loading || !formValido"
                class="px-4 py-2 text-sm font-medium text-black bg-yellow-400 rounded-lg hover:bg-yellow-300 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                <svg v-if="loading" class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

export default {
  name: 'UsuarioEditModal',
  props: {
    usuario: {
      type: Object,
      required: true
    },
    roles: {
      type: Array,
      required: true
    },
    mostrar: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['cerrar', 'guardar'],
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
      biografia: ''
    })

    const formValido = computed(() => {
      return form.value.nombre && 
             form.value.apellido && 
             form.value.email && 
             form.value.departamento
    })

    // Manejar tecla Escape
    const handleKeydown = (event) => {
      if (event.key === 'Escape' && props.mostrar) {
        cerrar()
      }
    }

    const cerrar = () => {
      emit('cerrar')
    }

    const guardar = () => {
      if (!formValido.value) return
      emit('guardar', { ...form.value, id: props.usuario.id })
    }

    const toggleEstado = () => {
      form.value.estado = form.value.estado === 'Activo' ? 'Inactivo' : 'Activo'
    }

    // Inicializar formulario cuando cambie el usuario
    watch(() => props.usuario, (nuevoUsuario) => {
      if (nuevoUsuario) {
        form.value = {
          nombre: nuevoUsuario.nombre || '',
          apellido: nuevoUsuario.apellido || '',
          email: nuevoUsuario.email || '',
          telefono: nuevoUsuario.telefono || '',
          cedula: nuevoUsuario.cedula || '',
          rol_id: nuevoUsuario.rol_id || '',
          departamento: nuevoUsuario.departamento || '',
          puesto: nuevoUsuario.puesto || '',
          estado: nuevoUsuario.estado || 'Activo',
          biografia: nuevoUsuario.biografia || ''
        }
      }
    }, { immediate: true })

    onMounted(() => {
      document.addEventListener('keydown', handleKeydown)
    })

    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeydown)
    })

    return {
      form,
      formValido,
      cerrar,
      guardar,
      toggleEstado
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

/* Animaciones del modal */
.modal-enter-active {
  transition: all 0.3s ease;
}

.modal-enter-from {
  opacity: 0;
}

.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-leave-to {
  opacity: 0;
}

/* Animación del contenido del modal */
.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: all 0.3s ease;
}

.modal-enter-from .modal-content {
  transform: scale(0.9);
  opacity: 0;
}

.modal-leave-to .modal-content {
  transform: scale(0.9);
  opacity: 0;
}
</style>
