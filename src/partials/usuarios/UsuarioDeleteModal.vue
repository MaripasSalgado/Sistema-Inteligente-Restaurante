<template>
  <Teleport to="body">
    <Transition name="modal" appear>
      <div v-if="mostrar" class="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/50 z-[9999]" @click.self="cerrar">
        <div class="modal-content bg-zinc-900/95 border border-red-500 rounded-lg shadow-2xl p-6 max-w-md w-full mx-4 relative">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-red-400 flex items-center">
              <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Eliminar Usuario
            </h3>
            <button
              @click="cerrar"
              class="text-gray-400 hover:text-white transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div v-if="usuario" class="space-y-4">
            <!-- Información del usuario a eliminar -->
            <div class="bg-black border border-gray-600 rounded-lg p-4">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                  <span class="text-white font-bold text-lg">
                    {{ usuario.nombre?.charAt(0) }}{{ usuario.apellido?.charAt(0) }}
                  </span>
                </div>
                <div>
                  <h4 class="text-white font-medium">{{ usuario.nombre }} {{ usuario.apellido }}</h4>
                  <p class="text-gray-400 text-sm">{{ usuario.email }}</p>
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1"
                        :class="getRolClass(usuario.rol_id)">
                    {{ getRolNombre(usuario.rol_id) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Advertencia -->
            <div class="bg-red-900 border border-red-500 rounded-lg p-4">
              <div class="flex items-start">
                <svg class="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <h5 class="text-red-300 font-medium mb-2">¡Atención! Esta acción no se puede deshacer</h5>
                  <p class="text-red-200 text-sm">
                    Se eliminará permanentemente:
                  </p>
                  <ul class="text-red-200 text-sm mt-2 list-disc list-inside space-y-1">
                    <li>El usuario de la tabla de usuarios</li>
                    <li>La cuenta de autenticación</li>
                    <li>Todos los datos asociados</li>
                    <li>El historial de acceso</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Confirmación -->
            <div class="bg-black border border-gray-600 rounded-lg p-4">
              <label class="flex items-center">
                <input
                  v-model="confirmarEliminacion"
                  type="checkbox"
                  class="w-4 h-4 text-red-400 bg-black border-gray-500 rounded focus:ring-red-400 focus:ring-2"
                />
                <span class="ml-3 text-white text-sm">
                  Entiendo que esta acción eliminará permanentemente al usuario y no se puede deshacer
                </span>
              </label>
            </div>
          </div>

          <!-- Botones de Acción -->
          <div class="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-600">
            <button
              @click="cerrar"
              type="button"
              class="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="eliminar"
              :disabled="!confirmarEliminacion || loading"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <svg v-if="loading" class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {{ loading ? 'Eliminando...' : 'Eliminar Usuario' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'UsuarioDeleteModal',
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
  emits: ['cerrar', 'eliminar'],
  setup(props, { emit }) {
    const confirmarEliminacion = ref(false)

    // Manejar tecla Escape
    const handleKeydown = (event) => {
      if (event.key === 'Escape' && props.mostrar) {
        cerrar()
      }
    }

    const cerrar = () => {
      confirmarEliminacion.value = false
      emit('cerrar')
    }

    const eliminar = () => {
      if (!confirmarEliminacion.value) return
      emit('eliminar', props.usuario)
    }

    const getRolNombre = (rolId) => {
      const rol = props.roles.find(r => r.id === rolId)
      return rol?.nombre || 'Sin rol'
    }

    const getRolClass = (rolId) => {
      const rol = props.roles.find(r => r.id === rolId)
      const nombreRol = rol?.nombre?.toLowerCase() || ''
      
      switch (nombreRol) {
        case 'administrador':
          return 'bg-red-100 text-red-800'
        case 'gerente':
          return 'bg-blue-100 text-blue-800'
        case 'cajero':
          return 'bg-green-100 text-green-800'
        case 'cocinero':
          return 'bg-yellow-100 text-yellow-800'
        case 'mesero':
          return 'bg-purple-100 text-purple-800'
        case 'limpieza':
          return 'bg-orange-100 text-orange-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }

    onMounted(() => {
      document.addEventListener('keydown', handleKeydown)
    })

    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeydown)
    })

    return {
      confirmarEliminacion,
      cerrar,
      eliminar,
      getRolNombre,
      getRolClass
    }
  }
}
</script>

<style scoped>
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
