<template>
  <div class="space-y-6">
    <!-- Header con botón de nuevo rol -->
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-bold text-white">Gestión de Roles</h2>
      <button
        @click="mostrarFormulario = true"
        class="inline-flex items-center px-4 py-2 border border-zinc-700/50 text-sm font-medium rounded-lg text-white bg-black hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Nuevo Rol
      </button>
    </div>

    <!-- Lista de roles -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="rol in roles"
        :key="rol.id"
        class="bg-zinc-900/95 border border-zinc-700/50 rounded-lg p-6 hover:border-yellow-400 transition-colors"
      >
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="text-lg font-medium text-white">{{ rol.nombre }}</h3>
            <p class="text-sm text-gray-400">{{ rol.descripcion }}</p>
          </div>
          <div class="flex space-x-2">
            <button
              @click="editarRol(rol)"
              class="text-yellow-400 hover:text-yellow-300"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click="confirmarEliminacion(rol)"
              class="text-red-400 hover:text-red-300"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Información del rol -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-300">Nivel:</span>
            <span class="text-sm text-white">{{ rol.nivel }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-300">Estado:</span>
            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="rol.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
              {{ rol.activo ? 'Activo' : 'Inactivo' }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-300">Usuarios:</span>
            <span class="text-sm text-white">{{ rol.usuariosAsignados }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-300">Creado:</span>
            <span class="text-sm text-white">{{ rol.fechaCreacion }}</span>
          </div>
        </div>

        <!-- Permisos del rol -->
        <div class="mt-4">
          <h4 class="text-sm font-medium text-gray-300 mb-2">Permisos:</h4>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="permiso in rol.permisos"
              :key="permiso"
              class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
            >
              {{ getPermisoNombre(permiso) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de formulario de rol -->
    <div v-if="mostrarFormulario" class="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50">
      <div class="bg-zinc-900/95 border border-zinc-700/50 rounded-lg max-w-2xl w-full mx-4">
        <div class="flex items-center justify-between p-6 border-b border-zinc-700/50">
          <h3 class="text-lg font-medium text-white">
            {{ rolSeleccionado ? 'Editar Rol' : 'Nuevo Rol' }}
          </h3>
          <button
            @click="cerrarFormulario"
            class="text-gray-400 hover:text-white transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="guardarRol" class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Nombre del Rol *</label>
              <input
                v-model="form.nombre"
                type="text"
                required
                placeholder="Ej: Administrador"
                class="w-full px-3 py-2 border border-zinc-700/50 rounded-lg bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Nivel *</label>
              <select
                v-model="form.nivel"
                required
                class="w-full px-3 py-2 border border-zinc-700/50 rounded-lg bg-black text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="">Seleccionar nivel</option>
                <option value="1">1 - Máximo</option>
                <option value="2">2 - Alto</option>
                <option value="3">3 - Medio</option>
                <option value="4">4 - Bajo</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
            <textarea
              v-model="form.descripcion"
              rows="3"
              placeholder="Descripción del rol y sus responsabilidades..."
              class="w-full px-3 py-2 border border-zinc-700/50 rounded-lg bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Estado</label>
            <div class="flex items-center">
              <input
                v-model="form.activo"
                type="checkbox"
                class="mr-2 text-yellow-400 focus:ring-yellow-400"
              />
              <span class="text-white text-sm">Rol activo</span>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Permisos</label>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <label class="flex items-center">
                <input
                  v-model="form.permisos"
                  type="checkbox"
                  value="dashboard"
                  class="mr-2 text-yellow-400 focus:ring-yellow-400"
                />
                <span class="text-white text-sm">Dashboard</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="form.permisos"
                  type="checkbox"
                  value="operaciones"
                  class="mr-2 text-yellow-400 focus:ring-yellow-400"
                />
                <span class="text-white text-sm">Operaciones</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="form.permisos"
                  type="checkbox"
                  value="inventario"
                  class="mr-2 text-yellow-400 focus:ring-yellow-400"
                />
                <span class="text-white text-sm">Inventario</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="form.permisos"
                  type="checkbox"
                  value="usuarios"
                  class="mr-2 text-yellow-400 focus:ring-yellow-400"
                />
                <span class="text-white text-sm">Usuarios</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="form.permisos"
                  type="checkbox"
                  value="reportes"
                  class="mr-2 text-yellow-400 focus:ring-yellow-400"
                />
                <span class="text-white text-sm">Reportes</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="form.permisos"
                  type="checkbox"
                  value="recetas"
                  class="mr-2 text-yellow-400 focus:ring-yellow-400"
                />
                <span class="text-white text-sm">Recetas</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="form.permisos"
                  type="checkbox"
                  value="productos"
                  class="mr-2 text-yellow-400 focus:ring-yellow-400"
                />
                <span class="text-white text-sm">Productos</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="form.permisos"
                  type="checkbox"
                  value="configuracion"
                  class="mr-2 text-yellow-400 focus:ring-yellow-400"
                />
                <span class="text-white text-sm">Configuración</span>
              </label>
            </div>
          </div>

          <div class="flex justify-end space-x-3">
            <button
              @click="cerrarFormulario"
              type="button"
              class="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-yellow-400 rounded-lg hover:bg-yellow-300 transition-colors"
            >
              {{ rolSeleccionado ? 'Actualizar Rol' : 'Crear Rol' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <div v-if="mostrarModalEliminacion" class="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50">
      <div class="bg-zinc-900/95 border border-zinc-700/50 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-medium text-white mb-4">Confirmar eliminación</h3>
        <p class="text-gray-300 mb-6">
          ¿Estás seguro de que quieres eliminar el rol "{{ rolAEliminar?.nombre }}"?
          Esta acción no se puede deshacer.
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="cancelarEliminacion"
            class="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="eliminarRolConfirmado"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-500 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'RolesManager',
  props: {
    roles: {
      type: Array,
      required: true
    }
  },
  emits: ['crear-rol', 'editar-rol', 'eliminar-rol'],
  setup(props, { emit }) {
    const mostrarFormulario = ref(false)
    const mostrarModalEliminacion = ref(false)
    const rolSeleccionado = ref(null)
    const rolAEliminar = ref(null)

    const form = ref({
      nombre: '',
      descripcion: '',
      nivel: '',
      activo: true,
      permisos: []
    })

    const getPermisoNombre = (permiso) => {
      const nombres = {
        dashboard: 'Dashboard',
        operaciones: 'Operaciones',
        inventario: 'Inventario',
        usuarios: 'Usuarios',
        reportes: 'Reportes',
        recetas: 'Recetas',
        productos: 'Productos',
        configuracion: 'Configuración'
      }
      return nombres[permiso] || permiso
    }

    const editarRol = (rol) => {
      rolSeleccionado.value = rol
      form.value = {
        nombre: rol.nombre,
        descripcion: rol.descripcion,
        nivel: rol.nivel.toString(),
        activo: rol.activo,
        permisos: [...rol.permisos]
      }
      mostrarFormulario.value = true
    }

    const guardarRol = () => {
      const rolData = {
        ...form.value,
        id: rolSeleccionado.value?.id,
        nivel: parseInt(form.value.nivel),
        fechaCreacion: rolSeleccionado.value?.fechaCreacion || new Date().toISOString().split('T')[0],
        usuariosAsignados: rolSeleccionado.value?.usuariosAsignados || 0
      }

      if (rolSeleccionado.value) {
        emit('editar-rol', rolData)
      } else {
        emit('crear-rol', rolData)
      }

      cerrarFormulario()
    }

    const cerrarFormulario = () => {
      mostrarFormulario.value = false
      rolSeleccionado.value = null
      form.value = {
        nombre: '',
        descripcion: '',
        nivel: '',
        activo: true,
        permisos: []
      }
    }

    const confirmarEliminacion = (rol) => {
      rolAEliminar.value = rol
      mostrarModalEliminacion.value = true
    }

    const eliminarRolConfirmado = () => {
      emit('eliminar-rol', rolAEliminar.value)
      cancelarEliminacion()
    }

    const cancelarEliminacion = () => {
      mostrarModalEliminacion.value = false
      rolAEliminar.value = null
    }

    return {
      mostrarFormulario,
      mostrarModalEliminacion,
      rolSeleccionado,
      rolAEliminar,
      form,
      getPermisoNombre,
      editarRol,
      guardarRol,
      cerrarFormulario,
      confirmarEliminacion,
      eliminarRolConfirmado,
      cancelarEliminacion
    }
  }
}
</script> 