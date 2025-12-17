<template>
  <div class="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/50 z-50">
    <div class="bg-zinc-900/95 border border-zinc-700/50 rounded-lg shadow-2xl max-w-md w-full mx-4">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-zinc-700/50">
        <h3 class="text-lg font-medium text-white">Cambiar Rol de Usuario</h3>
        <button
          @click="$emit('cancelar')"
          class="text-gray-400 hover:text-white transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Contenido -->
      <div class="p-6 space-y-6">
        <!-- Información del usuario -->
        <div class="bg-zinc-800 rounded-lg p-4">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mr-3">
              <span class="text-white font-bold">{{ usuario.nombre.charAt(0) }}{{ usuario.apellido.charAt(0) }}</span>
            </div>
            <div>
              <h4 class="text-white font-medium">{{ usuario.nombre }} {{ usuario.apellido }}</h4>
              <p class="text-gray-400 text-sm">{{ usuario.email }}</p>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-300">Rol actual:</span>
              <span class="text-white ml-2">{{ usuario.rol }}</span>
            </div>
            <div>
              <span class="text-gray-300">Departamento:</span>
              <span class="text-white ml-2">{{ usuario.departamento }}</span>
            </div>
          </div>
        </div>

        <!-- Selección de nuevo rol -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-3">Nuevo Rol</label>
          <div class="space-y-3">
            <div
              v-for="rol in roles"
              :key="rol.id"
              @click="seleccionarRol(rol)"
              :class="rolSeleccionado?.id === rol.id ? 'border-yellow-400 bg-zinc-800' : 'border-zinc-700/50'"
              class="border rounded-lg p-3 cursor-pointer transition-colors hover:border-yellow-400"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h5 class="text-white font-medium">{{ rol.nombre }}</h5>
                  <p class="text-gray-400 text-sm">{{ rol.descripcion }}</p>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-xs text-gray-400">Nivel {{ rol.nivel }}</span>
                  <span
                    v-if="rolSeleccionado?.id === rol.id"
                    class="text-yellow-400"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                </div>
              </div>
              
              <!-- Permisos del rol -->
              <div class="mt-2">
                <span class="text-xs text-gray-400">Permisos:</span>
                <div class="flex flex-wrap gap-1 mt-1">
                  <span
                    v-for="permiso in rol.permisos.slice(0, 3)"
                    :key="permiso"
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                  >
                    {{ getPermisoNombre(permiso) }}
                  </span>
                  <span
                    v-if="rol.permisos.length > 3"
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800"
                  >
                    +{{ rol.permisos.length - 3 }} más
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Advertencia si es el mismo rol -->
        <div v-if="rolSeleccionado?.nombre === usuario.rol" class="bg-yellow-900 border border-yellow-300 rounded-lg p-3">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span class="text-yellow-300 text-sm">El usuario ya tiene este rol asignado</span>
          </div>
        </div>

        <!-- Información del cambio -->
        <div v-if="rolSeleccionado && rolSeleccionado.nombre !== usuario.rol" class="bg-blue-900 border border-blue-300 rounded-lg p-3">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-blue-300 text-sm">
              El usuario cambiará de "{{ usuario.rol }}" a "{{ rolSeleccionado.nombre }}"
            </span>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-end space-x-3 p-6 border-t border-zinc-700/50">
        <button
          @click="$emit('cancelar')"
          class="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors"
        >
          Cancelar
        </button>
        <button
          @click="confirmarCambio"
          :disabled="!rolSeleccionado || rolSeleccionado.nombre === usuario.rol"
          class="px-4 py-2 text-sm font-medium text-white bg-yellow-400 rounded-lg hover:bg-yellow-300 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          Confirmar Cambio
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'CambioRolModal',
  props: {
    usuario: {
      type: Object,
      required: true
    },
    roles: {
      type: Array,
      required: true
    }
  },
  emits: ['cambiar', 'cancelar'],
  setup(props, { emit }) {
    const rolSeleccionado = ref(null)

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

    const seleccionarRol = (rol) => {
      rolSeleccionado.value = rol
    }

    const confirmarCambio = () => {
      if (rolSeleccionado.value && rolSeleccionado.value.nombre !== props.usuario.rol) {
        emit('cambiar', rolSeleccionado.value.nombre)
      }
    }

    return {
      rolSeleccionado,
      getPermisoNombre,
      seleccionarRol,
      confirmarCambio
    }
  }
}
</script> 