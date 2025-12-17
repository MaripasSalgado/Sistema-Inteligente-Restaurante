<template>
  <div class="flex h-screen overflow-hidden usuarios-roles-page">

    <!-- Sidebar -->
    <Sidebar :sidebarOpen="sidebarOpen" @close-sidebar="sidebarOpen = false" />

    <!-- Content area -->
    <div class="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
      
      <!-- Site header -->
      <Header :sidebarOpen="sidebarOpen" @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <main class="grow">
        <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

          <!-- Header -->
          <div class="sm:flex sm:justify-between sm:items-center mb-8">
            <div class="mb-4 sm:mb-0">
              <h1 class="text-2xl md:text-3xl text-gray-100 font-bold">Usuarios y Roles</h1>
              <p class="text-gray-400 mt-1">Gestión de usuarios y permisos del sistema</p>
            </div>
          </div>

          <!-- Tabs -->
          <div class="mb-8">
            <div class="border-b border-gray-700">
              <nav class="-mb-px flex space-x-8">
                <button
                  v-for="tab in tabs"
                  :key="tab.id"
                  @click="tabActivo = tab.id"
                  class="py-2 px-1 border-b-2 font-medium text-sm"
                  :class="tabActivo === tab.id ? 'border-violet-500 text-amber-500' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-zinc-700/50'"
                >
                  {{ tab.nombre }}
                </button>
              </nav>
            </div>
          </div>

          <!-- Dashboard -->
          <div v-if="tabActivo === 'dashboard'" class="space-y-6">
            <!-- Loading indicator -->
            <div v-if="loading" class="flex justify-center items-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
              <span class="ml-2 text-gray-400">Cargando usuarios...</span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div style="background-color: rgb(24 24 27 / 0.8);" class="border border-zinc-700/50 rounded-lg p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span class="text-black font-bold">👥</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-300">Total Usuarios</p>
                    <p class="text-2xl font-bold text-white">{{ estadisticas.totalUsuarios }}</p>
                  </div>
                </div>
              </div>

              <div style="background-color: rgb(24 24 27 / 0.8);" class="border border-zinc-700/50 rounded-lg p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span class="text-black font-bold">🔐</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-300">Usuarios Activos</p>
                    <p class="text-2xl font-bold text-white">{{ estadisticas.usuariosActivos }}</p>
                  </div>
                </div>
              </div>

              <div style="background-color: rgb(24 24 27 / 0.8);" class="border border-zinc-700/50 rounded-lg p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span class="text-black font-bold">👑</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-300">Administradores</p>
                    <p class="text-2xl font-bold text-white">{{ estadisticas.administradores }}</p>
                  </div>
                </div>
              </div>

              <div style="background-color: rgb(24 24 27 / 0.8);" class="border border-zinc-700/50 rounded-lg p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span class="text-black font-bold">📊</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-300">Roles Únicos</p>
                    <p class="text-2xl font-bold text-white">{{ estadisticas.rolesUnicos }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Usuarios Recientes -->
            <div style="background-color: rgb(24 24 27 / 0.8);" class="border border-zinc-700/50 rounded-lg p-6">
              <h3 class="text-lg font-medium text-white mb-4">Usuarios Recientes</h3>
              <div class="space-y-3">
                <div
                  v-for="usuario in usuariosRecientes"
                  :key="usuario.id"
                  class="flex items-center justify-between p-3 border border-zinc-700/50 rounded-lg hover:border-yellow-400 transition-colors cursor-pointer"
                  style="background-color: rgb(39 39 42);"
                  @click="verUsuario(usuario)"
                >
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center mr-3">
                      <span class="text-white font-medium">{{ usuario.nombre.charAt(0) }}{{ usuario.apellido.charAt(0) }}</span>
                    </div>
                    <div>
                      <p class="text-white font-medium">{{ usuario.nombre }} {{ usuario.apellido }}</p>
                      <p class="text-sm text-gray-400">{{ usuario.email }}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                          :class="getRolClass(usuario.rol)">
                      {{ usuario.rol }}
                    </span>
                    <p class="text-sm text-gray-400 mt-1">{{ usuario.ultimoAcceso }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Lista de Usuarios -->
          <div v-if="tabActivo === 'lista'" class="space-y-6">
            <UsuariosList 
              :usuarios="usuarios"
              :roles="roles"
              @editar-usuario="editarUsuario"
              @ver-usuario="verUsuario"
            />
          </div>

          <!-- Nuevo Usuario -->
          <div v-if="tabActivo === 'nuevo'" class="space-y-6">
            <UsuarioForm 
              :usuario="usuarioSeleccionado"
              :roles="roles"
              @guardar="guardarUsuario"
              @cancelar="cerrarFormulario"
            />
          </div>

                  <!-- Roles -->
                  <div v-if="tabActivo === 'roles'" class="space-y-6">
                    <RolesPermissionsManager />
                  </div>


        </div>
      </main>

    </div>

    <!-- Modal de Detalle -->
    <UsuarioDetailModal
      v-if="mostrarDetalle"
      :usuario="usuarioSeleccionado"
      :roles="roles"
      :mostrar="mostrarDetalle"
      @cerrar="cerrarDetalle"
      @editar="editarUsuario"
    />

    <!-- Modal de Editar -->
    <UsuarioEditModal
      v-show="mostrarEditar"
      :usuario="usuarioSeleccionado"
      :roles="roles"
      :mostrar="mostrarEditar"
      :loading="loading"
      @cerrar="cerrarEditar"
      @guardar="guardarUsuario"
    />

  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import Sidebar from '../partials/Sidebar.vue'
import Header from '../partials/Header.vue'
import UsuariosList from '../partials/usuarios/UsuariosList.vue'
import UsuarioForm from '../partials/usuarios/UsuarioForm.vue'
import UsuarioDetailModal from '../partials/usuarios/UsuarioDetailModal.vue'
import UsuarioEditModal from '../partials/usuarios/UsuarioEditModal.vue'
import RolesPermissionsManager from '../partials/usuarios/RolesPermissionsManager.vue'
import { UserService } from '@/services/userService'
import { PermissionsService } from '@/services/permissionsService'
import { useToast } from '@/composables/useToast'

export default {
  name: 'UsuariosRoles',
  components: {
    Sidebar,
    Header,
    UsuariosList,
    UsuarioForm,
    UsuarioDetailModal,
    UsuarioEditModal,
    RolesPermissionsManager
  },
  setup() {
    // Toast
    const { success, error, warning, confirm } = useToast()
    
    // Estado
    const sidebarOpen = ref(false)
    const tabActivo = ref('dashboard')
    const mostrarDetalle = ref(false)
    const mostrarEditar = ref(false)
    const usuarioSeleccionado = ref(null)
    const loading = ref(false)

    // Datos reales
    const usuarios = ref([])
    const roles = ref([])

    // Tabs
    const tabs = [
      { id: 'dashboard', nombre: 'Dashboard' },
      { id: 'lista', nombre: 'Usuarios' },
      { id: 'nuevo', nombre: 'Nuevo Usuario' },
      { id: 'roles', nombre: 'Roles' }
    ]


    // Computed properties
    const estadisticas = computed(() => {
      const totalUsuarios = usuarios.value.length
      const usuariosActivos = usuarios.value.filter(u => u.estado === 'Activo').length
      const administradores = usuarios.value.filter(u => u.rol_id === 'Administrador' || u.rol_id === 'admin').length
      const rolesUnicos = new Set(usuarios.value.map(u => u.rol_id).filter(Boolean)).size

      return {
        totalUsuarios,
        usuariosActivos,
        administradores,
        rolesUnicos
      }
    })

    const usuariosRecientes = computed(() => {
      return usuarios.value
        .sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion))
        .slice(0, 5)
        .map(usuario => {
          const rol = roles.value.find(r => r.id === usuario.rol_id)
          return {
            ...usuario,
            fechaCreacion: new Date(usuario.fecha_creacion).toLocaleDateString('es-ES'),
            rol: rol?.nombre || 'Sin rol',
            ultimoAcceso: usuario.ultimo_acceso ? new Date(usuario.ultimo_acceso).toLocaleString('es-ES') : 'Nunca'
          }
        })
    })

    // Cargar datos de usuarios
    const cargarUsuarios = async () => {
      loading.value = true
      try {
        const result = await UserService.getAllUsers()
        
        if (result.data) {
          usuarios.value = result.data
        } else {
          console.error('Error cargando usuarios:', result.error)
          usuarios.value = []
        }
      } catch (error) {
        console.error('Error inesperado cargando usuarios:', error)
        usuarios.value = []
      } finally {
        loading.value = false
      }
    }

    // Cargar roles desde la base de datos
    const cargarRoles = async () => {
      try {
        const result = await PermissionsService.getRoles()
        
        if (result.success && result.data) {
          roles.value = result.data
        } else {
          console.error('Error cargando roles:', result.error)
          roles.value = []
        }
      } catch (error) {
        console.error('Error inesperado cargando roles:', error)
        roles.value = []
      }
    }

    // Methods
    const nuevoUsuario = () => {
      usuarioSeleccionado.value = null
      tabActivo.value = 'nuevo'
    }

    const verUsuario = (usuario) => {
      usuarioSeleccionado.value = usuario
      mostrarDetalle.value = true
    }

    const editarUsuario = (usuario) => {
      usuarioSeleccionado.value = usuario
      mostrarDetalle.value = false
      mostrarEditar.value = true
    }

    const guardarUsuario = async (usuario) => {
      loading.value = true
      try {
        if (usuario.id) {
          // Editar usuario existente - usar UserService.updateUserProfile para administradores
          const result = await UserService.updateUserProfile(usuario, usuario.id)
          if (result.success) {
            success('Usuario actualizado exitosamente')
            await cargarUsuarios()
          } else {
            error('Error al actualizar usuario: ' + result.error)
            return
          }
        } else {
          // Crear nuevo usuario - usar Edge Function
          console.log('[UsuariosRoles] Creando nuevo usuario...')
          console.log('[UsuariosRoles] Datos del formulario:', usuario)
          
          const { AuthService } = await import('@/services/authService')
          const result = await AuthService.createInternalUser({
            email: usuario.email,
            password: usuario.password,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            telefono: usuario.telefono,
            cedula: usuario.cedula,
            rol_id: usuario.rol_id,
            departamento: usuario.departamento,
            puesto: usuario.puesto
          })
          
          console.log('[UsuariosRoles] Resultado de createInternalUser:', result)
          
          if (result.success) {
            success('Usuario creado exitosamente')
            await cargarUsuarios()
          } else {
            error('Error al crear usuario: ' + result.error)
            return
          }
        }
        usuarioSeleccionado.value = null
        mostrarEditar.value = false
        tabActivo.value = 'lista'
      } catch (err) {
        console.error('Error guardando usuario:', err)
        error('Error al guardar usuario')
      } finally {
        loading.value = false
      }
    }


    const crearRol = (rol) => {
      const nuevoRol = {
        ...rol,
        id: Date.now()
      }
      roles.value.push(nuevoRol)
    }

    const editarRol = (rol) => {
      const index = roles.value.findIndex(r => r.id === rol.id)
      if (index > -1) {
        roles.value[index] = rol
      }
    }

    const eliminarRol = (rol) => {
      const index = roles.value.findIndex(r => r.id === rol.id)
      if (index > -1) {
        roles.value.splice(index, 1)
      }
    }

    const cerrarFormulario = () => {
      usuarioSeleccionado.value = null
      tabActivo.value = 'lista'
    }

    const cerrarDetalle = () => {
      mostrarDetalle.value = false
      usuarioSeleccionado.value = null
    }

    const cerrarEditar = () => {
      mostrarEditar.value = false
      usuarioSeleccionado.value = null
    }

    const getRolClass = (rolId) => {
      // Buscar el rol en la lista de roles cargados
      const rol = roles.value.find(r => r.id === rolId)
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

    // Actualizar último acceso del usuario actual
    const actualizarUltimoAcceso = async () => {
      try {
        await UserService.updateLastAccess()
      } catch (error) {
        console.warn('No se pudo actualizar el último acceso:', error)
      }
    }

    // Cargar datos al montar el componente
    onMounted(async () => {
      await actualizarUltimoAcceso()
      await cargarRoles()
      await cargarUsuarios()
    })

    return {
      sidebarOpen,
      tabActivo,
      tabs,
      mostrarDetalle,
      mostrarEditar,
      usuarioSeleccionado,
      loading,
      usuarios,
      roles,
      estadisticas,
      usuariosRecientes,
      cargarUsuarios,
      cargarRoles,
      verUsuario,
      editarUsuario,
      guardarUsuario,
      crearRol,
      editarRol,
      eliminarRol,
      cerrarFormulario,
      cerrarDetalle,
      cerrarEditar,
      getRolClass
    }
  }
}
</script> 