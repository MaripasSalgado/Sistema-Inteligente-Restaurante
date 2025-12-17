<template>
  <div class="space-y-6">
    <!-- Filtros y búsqueda -->
    <div style="background-color: rgb(24 24 27 / 0.8);" class="border border-zinc-700/50 rounded-lg shadow-sm p-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Búsqueda por nombre -->
        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">Buscar Usuario</label>
          <input
            v-model="filtros.nombre"
            type="text"
            placeholder="Nombre o email..."
            class="input-field w-full px-3 py-2 rounded-lg"
          />
        </div>

        <!-- Filtro por rol -->
        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">Rol</label>
          <select
            v-model="filtros.rol"
            class="input-field w-full px-3 py-2 rounded-lg"
          >
            <option value="">Todos los roles</option>
            <option
              v-for="rol in roles"
              :key="rol.id"
              :value="rol.id"
            >
              {{ rol.nombre }}
            </option>
          </select>
        </div>

        <!-- Filtro por estado -->
        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">Estado</label>
          <select
            v-model="filtros.estado"
            class="input-field w-full px-3 py-2 rounded-lg"
          >
            <option value="">Todos los estados</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <!-- Filtro por departamento -->
        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">Departamento</label>
          <select
            v-model="filtros.departamento"
            class="input-field w-full px-3 py-2 rounded-lg"
          >
            <option value="">Todos los departamentos</option>
            <option value="Administración">Administración</option>
            <option value="Operaciones">Operaciones</option>
            <option value="Ventas">Ventas</option>
            <option value="Cocina">Cocina</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Tabla de usuarios -->
    <div style="background-color: rgb(24 24 27 / 0.8);" class="border border-zinc-700/50 rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-zinc-700/50">
          <thead class="bg-zinc-900 border-b border-zinc-700/50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Usuario
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Contacto
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Rol
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Último Acceso
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-700/50">
            <tr
              v-for="usuario in usuariosFiltrados"
              :key="usuario.id"
              class="hover:bg-zinc-800/50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center mr-3">
                    <span class="text-white font-medium">{{ usuario.nombre.charAt(0) }}{{ usuario.apellido.charAt(0) }}</span>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-white">{{ usuario.nombre }} {{ usuario.apellido }}</div>
                    <div class="text-sm text-gray-400">{{ usuario.departamento }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm text-white">{{ usuario.email }}</div>
                  <div class="text-sm text-gray-400">{{ usuario.telefono }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="getRolClass(usuario.rol_id)">
                  {{ getRolNombre(usuario.rol_id) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="getEstadoClass(usuario.estado)">
                  {{ usuario.estado }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-white">{{ formatUltimoAcceso(usuario.ultimo_acceso) }}</div>
                <div class="text-sm text-gray-400">{{ formatFechaCreacion(usuario.fecha_creacion) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-3">
                  <button
                    @click="$emit('ver-usuario', usuario)"
                    class="text-gray-400 hover:text-white transition-colors"
                    title="Ver detalles"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    @click="$emit('editar-usuario', usuario)"
                    class="text-gray-400 hover:text-white transition-colors"
                    title="Editar"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Mensaje cuando no hay usuarios -->
    <div v-if="usuariosFiltrados.length === 0" class="text-center py-12">
      <div class="text-gray-400">
        <svg class="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
        <h3 class="text-lg font-medium text-white mb-2">No se encontraron usuarios</h3>
        <p class="text-gray-400">Intenta ajustar los filtros de búsqueda</p>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'UsuariosList',
  props: {
    usuarios: {
      type: Array,
      required: true
    },
    roles: {
      type: Array,
      required: true
    }
  },
  emits: ['editar-usuario', 'ver-usuario'],
  setup(props, { emit }) {
    const filtros = ref({
      nombre: '',
      rol: '',
      estado: '',
      departamento: ''
    })


    const usuariosFiltrados = computed(() => {
      return props.usuarios.filter(usuario => {
        // Filtro por nombre/email
        if (filtros.value.nombre && 
            !usuario.nombre.toLowerCase().includes(filtros.value.nombre.toLowerCase()) &&
            !usuario.apellido.toLowerCase().includes(filtros.value.nombre.toLowerCase()) &&
            !usuario.email.toLowerCase().includes(filtros.value.nombre.toLowerCase())) {
          return false
        }

        // Filtro por rol
        if (filtros.value.rol && usuario.rol_id !== filtros.value.rol) {
          return false
        }

        // Filtro por estado
        if (filtros.value.estado && usuario.estado !== filtros.value.estado) {
          return false
        }

        // Filtro por departamento
        if (filtros.value.departamento && usuario.departamento !== filtros.value.departamento) {
          return false
        }

        return true
      })
    })

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

    const getRolNombre = (rolId) => {
      const rol = props.roles.find(r => r.id === rolId)
      return rol?.nombre || 'Sin rol'
    }

    const getEstadoClass = (estado) => {
      switch (estado) {
        case 'Activo':
          return 'bg-green-100 text-green-800'
        case 'Inactivo':
          return 'bg-red-100 text-red-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }

    const formatUltimoAcceso = (ultimoAcceso) => {
      if (!ultimoAcceso) return 'Nunca'
      return new Date(ultimoAcceso).toLocaleString('es-ES')
    }

    const formatFechaCreacion = (fechaCreacion) => {
      if (!fechaCreacion) return 'No disponible'
      return new Date(fechaCreacion).toLocaleDateString('es-ES')
    }


    return {
      filtros,
      usuariosFiltrados,
      getRolClass,
      getRolNombre,
      getEstadoClass,
      formatUltimoAcceso,
      formatFechaCreacion
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
</style> 