<template>
  <div class="space-y-6">
    <!-- Header -->
    <div style="background-color: rgb(24 24 27 / 0.8);" class="border border-zinc-700/50 rounded-lg p-6">
      <h2 class="text-xl font-bold text-white mb-4">Gestión de Roles y Permisos</h2>
      <p class="text-gray-400 text-sm">Administra los roles del sistema y sus permisos de acceso</p>
    </div>

    <!-- Tabs -->
    <div class="mb-8">
      <div class="border-b border-gray-700">
        <nav class="-mb-px flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="py-2 px-1 border-b-2 font-medium text-sm"
            :class="activeTab === tab.id ? 'border-violet-500 text-amber-500' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-zinc-700/50'"
          >
            {{ tab.nombre }}
          </button>
        </nav>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="space-y-6">
      <!-- Roles Tab -->
      <div v-if="activeTab === 'roles'" class="space-y-6">
        <!-- Lista de Roles -->
        <div style="background-color: rgb(24 24 27 / 0.8);" class="border border-zinc-700/50 rounded-lg p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-white">Roles del Sistema</h3>
            <button
              @click="mostrarFormularioRol = true; rolEnEdicion = null"
              class="px-4 py-2 text-sm font-medium text-black bg-yellow-400 rounded-lg hover:bg-yellow-300 transition-colors"
            >
              Nuevo Rol
            </button>
          </div>

          <div v-if="loading" class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
            <span class="ml-2 text-gray-400">Cargando...</span>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="rol in roles"
              :key="rol.id"
              class="flex items-center justify-between p-4 border border-zinc-700/50 rounded-lg hover:border-yellow-400 transition-colors"
              style="background-color: rgb(39 39 42);"
            >
              <div>
                <h4 class="text-white font-medium">{{ rol.nombre }}</h4>
                <p class="text-sm text-gray-400">
                  Creado: {{ new Date(rol.fecha_creacion).toLocaleDateString('es-ES') }}
                </p>
              </div>
              <div class="flex space-x-3">
                <button
                  @click="editarRol(rol)"
                  class="text-gray-400 hover:text-white transition-colors"
                  title="Editar"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click="gestionarPermisos(rol)"
                  class="text-gray-400 hover:text-white transition-colors"
                  title="Permisos"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </button>
                <button
                  @click="eliminarRol(rol)"
                  class="text-gray-400 hover:text-white transition-colors"
                  title="Eliminar"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Permisos Tab -->
      <div v-if="activeTab === 'permisos'" class="space-y-6">
        <!-- Seleccionar Rol -->
        <div style="background-color: rgb(24 24 27 / 0.8);" class="border border-zinc-700/50 rounded-lg p-6">
          <h3 class="text-lg font-medium text-white mb-4">Gestionar Permisos por Rol</h3>

          <div class="flex items-center space-x-4 mb-6">
            <label class="text-gray-400">Seleccionar Rol:</label>
            <select
              v-model="rolSeleccionado"
              @change="cargarPermisosRol"
              class="input-field px-3 py-2 rounded-lg"
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

          <!-- Matriz de Permisos -->
          <div v-if="rolSeleccionado" class="space-y-4">
            <h4 class="text-white font-medium">Permisos para: {{ getRolNombre(rolSeleccionado) }}</h4>

            <div class="overflow-x-auto">
              <table class="min-w-full border border-zinc-700/50 rounded-lg">
                <thead style="background-color: rgb(24 24 27 / 0.8);" class="border-b border-zinc-600">
                  <tr>
                    <th class="px-4 py-2 text-left text-white font-medium">Módulo</th>
                    <th class="px-4 py-2 text-center text-white font-medium">Ver</th>
                    <th class="px-4 py-2 text-center text-white font-medium">Crear</th>
                    <th class="px-4 py-2 text-center text-white font-medium">Editar</th>
                    <th class="px-4 py-2 text-center text-white font-medium">Eliminar</th>
                  </tr>
                </thead>
                <tbody style="background-color: rgb(39 39 42);">
                  <tr
                    v-for="vista in vistas"
                    :key="vista.id"
                    class="border-t border-zinc-600 hover:bg-zinc-800 transition-colors"
                  >
                    <td class="px-4 py-2 text-white">{{ vista.ruta }}</td>
                    <td class="px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        :checked="tienePermiso(vista.id, 'leer')"
                        @change="togglePermiso(vista.id, 'leer', $event.target.checked)"
                        class="w-4 h-4 text-yellow-400 bg-black border-gray-500 rounded focus:ring-yellow-400 focus:ring-2"
                      />
                    </td>
                    <td class="px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        :checked="tienePermiso(vista.id, 'crear')"
                        @change="togglePermiso(vista.id, 'crear', $event.target.checked)"
                        class="w-4 h-4 text-yellow-400 bg-black border-gray-500 rounded focus:ring-yellow-400 focus:ring-2"
                      />
                    </td>
                    <td class="px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        :checked="tienePermiso(vista.id, 'editar')"
                        @change="togglePermiso(vista.id, 'editar', $event.target.checked)"
                        class="w-4 h-4 text-yellow-400 bg-black border-gray-500 rounded focus:ring-yellow-400 focus:ring-2"
                      />
                    </td>
                    <td class="px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        :checked="tienePermiso(vista.id, 'eliminar')"
                        @change="togglePermiso(vista.id, 'eliminar', $event.target.checked)"
                        class="w-4 h-4 text-yellow-400 bg-black border-gray-500 rounded focus:ring-yellow-400 focus:ring-2"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="flex justify-end space-x-3">
              <button
                @click="guardarPermisos"
                :disabled="loading"
                class="px-4 py-2 text-sm font-medium text-black bg-yellow-400 rounded-lg hover:bg-yellow-300 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                {{ loading ? 'Guardando...' : 'Guardar Permisos' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Formulario Rol - Se renderiza fuera del flujo normal -->
    <Teleport to="body">
      <Transition name="modal" appear>
        <div v-if="mostrarFormularioRol" class="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-[9999]" @click.self="cerrarFormularioRol">
          <div class="modal-content bg-zinc-900/95 border border-zinc-700/50 rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl relative">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-white">
            {{ rolEnEdicion ? 'Editar Rol' : 'Nuevo Rol' }}
          </h3>
          <button
            @click="cerrarFormularioRol"
            class="text-gray-400 hover:text-white transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="guardarRol" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">Nombre del Rol</label>
            <input
              v-model="formRol.nombre"
              type="text"
              required
              placeholder="Nombre del rol"
              class="input-field w-full px-3 py-2 rounded-lg"
              ref="inputRol"
            />
          </div>
          
          <div class="flex justify-end space-x-3 pt-4">
            <button
              @click="cerrarFormularioRol"
              type="button"
              class="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="loading || !formRol.nombre.trim()"
              class="px-4 py-2 text-sm font-medium text-black bg-yellow-400 rounded-lg hover:bg-yellow-300 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <svg v-if="loading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ loading ? 'Guardando...' : 'Guardar' }}</span>
            </button>
          </div>
        </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue'
import { useRoleManagement } from '@/composables/usePermissions'
import { useToast } from '@/composables/useToast'

export default {
  name: 'RolesPermissionsManager',
  setup() {
    const { success, error, warning, confirm } = useToast()
    const {
      loading,
      getRoles,
      getVistas,
      getOperaciones,
      createRol,
      updateRol,
      deleteRol,
      getRolPermissions,
      assignRolPermissions
    } = useRoleManagement()

    // Estado
    const activeTab = ref('roles')
    const roles = ref([])
    const vistas = ref([])
    const operaciones = ref([])
    const rolSeleccionado = ref('')
    const permisosRol = ref([])
    const mostrarFormularioRol = ref(false)
    const rolEnEdicion = ref(null)

    // Formulario
    const formRol = ref({
      nombre: ''
    })
    const inputRol = ref(null)

    // Tabs
    const tabs = [
      { id: 'roles', nombre: 'Roles' },
      { id: 'permisos', nombre: 'Permisos' }
    ]

    // Computed
    const getRolNombre = (rolId) => {
      const rol = roles.value.find(r => r.id === rolId)
      return rol ? rol.nombre : ''
    }

    const tienePermiso = (vistaId, operacionNombre) => {
      const operacion = operaciones.value.find(o => o.nombre === operacionNombre)
      if (!operacion) return false
      
      return permisosRol.value.some(p => 
        p.vista_id === vistaId && p.operacion_id === operacion.id
      )
    }

    // Métodos
    const cargarDatos = async () => {
      await Promise.all([
        cargarRoles(),
        cargarVistas(),
        cargarOperaciones()
      ])
    }

    const cargarRoles = async () => {
      const result = await getRoles()
      if (result.success) {
        roles.value = result.data
      } else {
        error('Error al cargar roles: ' + result.error)
      }
    }

    const cargarVistas = async () => {
      const result = await getVistas()
      if (result.success) {
        vistas.value = result.data
      } else {
        error('Error al cargar vistas: ' + result.error)
      }
    }

    const cargarOperaciones = async () => {
      const result = await getOperaciones()
      if (result.success) {
        operaciones.value = result.data
      } else {
        error('Error al cargar operaciones: ' + result.error)
      }
    }

    const cargarPermisosRol = async () => {
      if (!rolSeleccionado.value) return

      const result = await getRolPermissions(rolSeleccionado.value)
      if (result.success) {
        permisosRol.value = result.data
      } else {
        error('Error al cargar permisos del rol: ' + result.error)
      }
    }

    const editarRol = (rol) => {
      rolEnEdicion.value = rol
      formRol.value.nombre = rol.nombre
      mostrarFormularioRol.value = true
    }

    const eliminarRol = (rol) => {
      confirm(
        `¿Estás seguro de que quieres eliminar el rol "${rol.nombre}"?`,
        async () => {
          const result = await deleteRol(rol.id)
          if (result.success) {
            success('Rol eliminado exitosamente')
            await cargarRoles()
          } else {
            error('Error al eliminar rol: ' + result.error)
          }
        }
      )
    }

    const gestionarPermisos = (rol) => {
      rolSeleccionado.value = rol.id
      activeTab.value = 'permisos'
      cargarPermisosRol()
    }

    const cerrarFormularioRol = () => {
      mostrarFormularioRol.value = false
      rolEnEdicion.value = null
      formRol.value.nombre = ''
    }

    // Enfocar input cuando se abre el modal
    watch(mostrarFormularioRol, async (nuevoValor) => {
      if (nuevoValor) {
        await nextTick()
        if (inputRol.value) {
          inputRol.value.focus()
        }
      }
    })

    // Manejar tecla Escape
    const handleKeydown = (event) => {
      if (event.key === 'Escape' && mostrarFormularioRol.value) {
        cerrarFormularioRol()
      }
    }

    const guardarRol = async () => {
      if (!formRol.value.nombre.trim()) return

      const result = rolEnEdicion.value
        ? await updateRol(rolEnEdicion.value.id, formRol.value.nombre)
        : await createRol(formRol.value.nombre)

      if (result.success) {
        success(rolEnEdicion.value ? 'Rol actualizado exitosamente' : 'Rol creado exitosamente')
        cerrarFormularioRol()
        await cargarRoles()
      } else {
        error('Error al guardar rol: ' + result.error)
      }
    }

    const togglePermiso = (vistaId, operacionNombre, checked) => {
      const operacion = operaciones.value.find(o => o.nombre === operacionNombre)
      if (!operacion) return

      if (checked) {
        // Agregar permiso
        if (!tienePermiso(vistaId, operacionNombre)) {
          permisosRol.value.push({
            vista_id: vistaId,
            operacion_id: operacion.id
          })
        }
      } else {
        // Remover permiso
        const index = permisosRol.value.findIndex(p => 
          p.vista_id === vistaId && p.operacion_id === operacion.id
        )
        if (index > -1) {
          permisosRol.value.splice(index, 1)
        }
      }
    }

    const guardarPermisos = async () => {
      if (!rolSeleccionado.value) return

      const result = await assignRolPermissions(rolSeleccionado.value, permisosRol.value)
      if (result.success) {
        success('Permisos guardados exitosamente')
      } else {
        error('Error al guardar permisos: ' + result.error)
      }
    }

    // Cargar datos al montar
    onMounted(() => {
      cargarDatos()
      document.addEventListener('keydown', handleKeydown)
    })

    // Limpiar event listeners al desmontar
    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeydown)
    })

    return {
      // Estado
      activeTab,
      roles,
      vistas,
      operaciones,
      rolSeleccionado,
      permisosRol,
      mostrarFormularioRol,
      rolEnEdicion,
      formRol,
      inputRol,
      loading,
      
      // Computed
      getRolNombre,
      tienePermiso,
      
      // Métodos
      cargarDatos,
      cargarPermisosRol,
      editarRol,
      eliminarRol,
      gestionarPermisos,
      cerrarFormularioRol,
      guardarRol,
      togglePermiso,
      guardarPermisos,
      
      // Tabs
      tabs
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

/* Asegurar que el modal se sobreponga correctamente */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  transform: scale(1);
  transition: all 0.3s ease;
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
