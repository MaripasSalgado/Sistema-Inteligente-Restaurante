<template>
  <Teleport to="body">
    <Transition name="modal" appear>
      <div v-if="mostrar" class="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-[9999] backdrop-blur-sm" @click.self="cerrar">
        <div class="modal-content bg-zinc-900/95 border border-zinc-700/50 rounded-lg p-6 max-w-2xl w-full mx-4 shadow-2xl relative">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-white">Detalles del Usuario</h3>
            <button
              @click="cerrar"
              class="text-gray-400 hover:text-white transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div v-if="usuario" class="space-y-6">
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
                  <label class="block text-sm font-medium text-gray-400">Nombre Completo</label>
                  <p class="text-white">{{ usuario.nombre }} {{ usuario.apellido }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-400">Email</label>
                  <p class="text-white">{{ usuario.email }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-400">Teléfono</label>
                  <p class="text-white">{{ usuario.telefono || 'No asignado' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-400">Cédula</label>
                  <p class="text-white">{{ usuario.cedula || 'No asignado' }}</p>
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
                  <label class="block text-sm font-medium text-gray-400">Rol</label>
                  <span class="inline-flex px-3 py-1 text-sm font-semibold rounded-full"
                        :class="getRolClass(usuario.rol_id)">
                    {{ getRolNombre(usuario.rol_id) }}
                  </span>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-400">Departamento</label>
                  <p class="text-white">{{ usuario.departamento || 'No asignado' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-400">Puesto</label>
                  <p class="text-white">{{ usuario.puesto || 'No asignado' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-400">Estado</label>
                  <span class="inline-flex px-3 py-1 text-sm font-semibold rounded-full"
                        :class="usuario.estado === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                    {{ usuario.estado }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Información de Cuenta -->
            <div style="background-color: rgb(24 24 27 / 0.8);" class="border border-zinc-600 rounded-lg p-4">
              <h4 class="text-lg font-medium text-white mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Información de Cuenta
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-400">Fecha de Registro</label>
                  <p class="text-white">{{ formatDate(usuario.fecha_creacion) }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-400">Último Acceso</label>
                  <p class="text-white">{{ formatDate(usuario.ultimo_acceso) }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-400">Última Modificación</label>
                  <p class="text-white">{{ formatDate(usuario.fecha_modificacion) }}</p>
                </div>
              </div>
            </div>

            <!-- Biografía -->
            <div v-if="usuario.biografia" style="background-color: rgb(24 24 27 / 0.8);" class="border border-zinc-600 rounded-lg p-4">
              <h4 class="text-lg font-medium text-white mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                Biografía
              </h4>
              <p class="text-gray-400">{{ usuario.biografia }}</p>
            </div>
          </div>

          <!-- Botones de Acción -->
          <div class="flex justify-end space-x-3 mt-6 pt-4 border-t border-zinc-600">
            <button
              @click="editar"
              class="px-4 py-2 text-sm font-medium text-black bg-yellow-400 rounded-lg hover:bg-yellow-300 transition-colors flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar Usuario
            </button>
            <button
              @click="cerrar"
              class="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors"
            >
              Cerrar
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
  name: 'UsuarioDetailModal',
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
    }
  },
  emits: ['cerrar', 'editar'],
  setup(props, { emit }) {
    // Manejar tecla Escape
    const handleKeydown = (event) => {
      if (event.key === 'Escape' && props.mostrar) {
        cerrar()
      }
    }

    const cerrar = () => {
      emit('cerrar')
    }

    const editar = () => {
      emit('editar', props.usuario)
    }


    const getRolNombre = (rolId) => {
      // Buscar el rol en la lista de roles cargados
      const rol = props.roles.find(r => r.id === rolId)
      return rol?.nombre || 'Sin rol'
    }

    const getRolClass = (rolId) => {
      // Buscar el rol en la lista de roles cargados
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

    const formatDate = (dateString) => {
      if (!dateString) return 'Nunca'
      return new Date(dateString).toLocaleString('es-ES')
    }

    onMounted(() => {
      document.addEventListener('keydown', handleKeydown)
    })

    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeydown)
    })

    return {
      cerrar,
      editar,
      getRolNombre,
      getRolClass,
      formatDate
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
