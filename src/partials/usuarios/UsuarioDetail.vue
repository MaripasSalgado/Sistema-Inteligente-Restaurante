<template>
  <div class="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50">
    <div class="bg-zinc-900/95 border border-zinc-700/50 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-zinc-700/50">
        <h2 class="text-xl font-bold text-white">Detalles del Usuario</h2>
        <button
          @click="$emit('cerrar')"
          class="text-gray-400 hover:text-white transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Contenido -->
      <div class="p-6 space-y-6">
        <!-- Información básica -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-zinc-800 rounded-lg p-4">
            <h3 class="text-lg font-medium text-white mb-4">Información Personal</h3>
            <div class="space-y-3">
              <div class="flex items-center">
                <div class="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mr-4">
                  <span class="text-white font-bold text-lg">{{ usuario.nombre.charAt(0) }}{{ usuario.apellido.charAt(0) }}</span>
                </div>
                <div>
                  <h4 class="text-white font-medium">{{ usuario.nombre }} {{ usuario.apellido }}</h4>
                  <p class="text-gray-400">{{ usuario.email }}</p>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300">Teléfono</label>
                  <p class="text-white">{{ usuario.telefono || 'No especificado' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300">Departamento</label>
                  <p class="text-white">{{ usuario.departamento }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-zinc-800 rounded-lg p-4">
            <h3 class="text-lg font-medium text-white mb-4">Información Laboral</h3>
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-300">Rol</label>
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1"
                      :class="getRolClass(usuario.rol)">
                  {{ usuario.rol }}
                </span>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300">Estado</label>
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1"
                      :class="getEstadoClass(usuario.estado)">
                  {{ usuario.estado }}
                </span>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300">Fecha de Creación</label>
                <p class="text-white">{{ usuario.fechaCreacion }}</p>
              </div>
              <div v-if="usuario.fechaModificacion">
                <label class="block text-sm font-medium text-gray-300">Última Modificación</label>
                <p class="text-white">{{ usuario.fechaModificacion }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Actividad reciente -->
        <div class="bg-zinc-800 rounded-lg p-4">
          <h3 class="text-lg font-medium text-white mb-4">Actividad</h3>
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-300">Último Acceso</label>
              <p class="text-white">{{ usuario.ultimoAcceso || 'Nunca ha accedido' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300">Tiempo en el Sistema</label>
              <p class="text-white">{{ calcularTiempoEnSistema() }}</p>
            </div>
          </div>
        </div>

        <!-- Permisos -->
        <div class="bg-zinc-800 rounded-lg p-4">
          <h3 class="text-lg font-medium text-white mb-4">Permisos Asignados</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div
              v-for="permiso in usuario.permisos"
              :key="permiso"
              class="flex items-center p-2 bg-green-900 border border-green-300 rounded-lg"
            >
              <svg class="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span class="text-white text-sm">{{ getPermisoNombre(permiso) }}</span>
            </div>
          </div>
        </div>

        <!-- Notas -->
        <div v-if="usuario.notas" class="bg-zinc-800 rounded-lg p-4">
          <h3 class="text-lg font-medium text-white mb-4">Notas</h3>
          <p class="text-gray-300">{{ usuario.notas }}</p>
        </div>

        <!-- Estadísticas de uso (simuladas) -->
        <div class="bg-zinc-800 rounded-lg p-4">
          <h3 class="text-lg font-medium text-white mb-4">Estadísticas de Uso</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center">
              <div class="text-2xl font-bold text-yellow-400">{{ getEstadisticas().sesiones }}</div>
              <div class="text-sm text-gray-400">Sesiones este mes</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-green-400">{{ getEstadisticas().actividad }}</div>
              <div class="text-sm text-gray-400">Actividad (horas)</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-400">{{ getEstadisticas().tareas }}</div>
              <div class="text-sm text-gray-400">Tareas completadas</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-end space-x-3 p-6 border-t border-zinc-700/50">
        <button
          @click="$emit('editar', usuario)"
          class="px-4 py-2 text-sm font-medium text-white bg-yellow-400 rounded-lg hover:bg-yellow-300 transition-colors"
        >
          Editar Usuario
        </button>
        <button
          @click="$emit('cerrar')"
          class="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'UsuarioDetail',
  props: {
    usuario: {
      type: Object,
      required: true
    }
  },
  emits: ['cerrar', 'editar'],
  setup(props) {
    const getRolClass = (rol) => {
      switch (rol) {
        case 'Administrador':
          return 'bg-red-100 text-red-800'
        case 'Gerente':
          return 'bg-blue-100 text-blue-800'
        case 'Cajero':
          return 'bg-green-100 text-green-800'
        case 'Cocinero':
          return 'bg-yellow-100 text-yellow-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
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

    const calcularTiempoEnSistema = () => {
      const fechaCreacion = new Date(props.usuario.fechaCreacion)
      const ahora = new Date()
      const diferencia = ahora - fechaCreacion
      const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24))
      
      if (dias === 0) return 'Menos de 1 día'
      if (dias === 1) return '1 día'
      if (dias < 30) return `${dias} días`
      
      const meses = Math.floor(dias / 30)
      if (meses === 1) return '1 mes'
      if (meses < 12) return `${meses} meses`
      
      const años = Math.floor(meses / 12)
      if (años === 1) return '1 año'
      return `${años} años`
    }

    const getEstadisticas = () => {
      // Simular estadísticas basadas en el ID del usuario
      const id = props.usuario.id
      return {
        sesiones: Math.floor(Math.random() * 50) + 10,
        actividad: Math.floor(Math.random() * 160) + 40,
        tareas: Math.floor(Math.random() * 100) + 20
      }
    }

    return {
      getRolClass,
      getEstadoClass,
      getPermisoNombre,
      calcularTiempoEnSistema,
      getEstadisticas
    }
  }
}
</script> 