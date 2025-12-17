<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <Sidebar :sidebarOpen="sidebarOpen" @close-sidebar="sidebarOpen = false" />

    <!-- Content area -->
    <div class="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
      <!-- Site header -->
      <Header :sidebarOpen="sidebarOpen" @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <main class="grow">
        <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-white">Editar Cuenta</h1>
            <p class="mt-2 text-gray-400">Gestiona tu información personal y configuración de cuenta</p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Panel izquierdo - Información personal -->
            <div class="lg:col-span-2 space-y-6">
              
              <!-- Información personal -->
              <div class="bg-zinc-900/95 border border-zinc-700/50 rounded-lg p-6">
                <h2 class="text-lg font-medium text-white mb-6">Información Personal</h2>
                
                <form @submit.prevent="guardarInformacionPersonal" class="space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-400 mb-2">Nombre *</label>
                      <input v-model="form.nombre" type="text" required placeholder="Tu nombre" class="input-field w-full px-3 py-2 rounded-lg" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-400 mb-2">Apellido *</label>
                      <input v-model="form.apellido" type="text" required placeholder="Tu apellido" class="input-field w-full px-3 py-2 rounded-lg" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-400 mb-2">Email *</label>
                      <input v-model="form.email" type="email" required placeholder="tu@email.com" class="input-field w-full px-3 py-2 rounded-lg" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-400 mb-2">Teléfono</label>
                      <input v-model="form.telefono" type="tel" placeholder="+503 7123-4567" class="input-field w-full px-3 py-2 rounded-lg" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-400 mb-2">Cédula</label>
                      <input v-model="form.cedula" type="text" placeholder="00000000-0" class="input-field w-full px-3 py-2 rounded-lg" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-400 mb-2">Departamento</label>
                      <select v-model="form.departamento" class="input-field w-full px-3 py-2 rounded-lg">
                        <option value="">Seleccionar departamento</option>
                        <option value="Administración">Administración</option>
                        <option value="Operaciones">Operaciones</option>
                        <option value="Ventas">Ventas</option>
                        <option value="Cocina">Cocina</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-400 mb-2">Puesto</label>
                      <input v-model="form.puesto" type="text" placeholder="Tu puesto de trabajo" class="input-field w-full px-3 py-2 rounded-lg" />
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-400 mb-2">Biografía</label>
                    <textarea v-model="form.biografia" rows="3" placeholder="Cuéntanos un poco sobre ti..." class="input-field w-full px-3 py-2 rounded-lg resize-none"></textarea>
                  </div>
                  <div class="flex justify-end">
                    <button
                      type="submit"
                      :disabled="!formValido || loading"
                      class="px-4 py-2 text-sm font-medium text-black bg-[#F4B400] rounded-lg hover:bg-[#F4B400]/80 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                    >
                      {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
                    </button>
                  </div>
                </form>
              </div>

              <!-- Cambiar contraseña -->
              <div class="bg-zinc-900/95 border border-zinc-700/50 rounded-lg p-6">
                <h2 class="text-lg font-medium text-white mb-6">Cambiar Contraseña</h2>
                
                <div class="space-y-4">
                  <p class="text-gray-400 text-sm">
                    Si deseas cambiar tu contraseña, te enviaremos un email con un enlace para restablecerla de forma segura.
                  </p>

                  <button
                    @click="enviarRecuperacionContraseña"
                    :disabled="loading"
                    class="w-full px-4 py-2 text-sm font-medium text-black bg-[#F4B400] rounded-lg hover:bg-[#F4B400]/80 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                  >
                    {{ loading ? 'Enviando...' : 'Enviar Email para Cambiar Contraseña' }}
                  </button>
                </div>
              </div>

            </div>

            <!-- Panel derecho - Foto de perfil -->
            <div class="space-y-6">
              
              <!-- Foto de perfil -->
              <div class="bg-zinc-900/95 border border-zinc-700/50 rounded-lg p-6 !hidden">
                <h2 class="text-lg font-medium text-white mb-6">Foto de Perfil</h2>

                <div class="text-center">
                  <div class="relative inline-block">
                    <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-zinc-700/50 mx-auto mb-4">
                      <img
                        v-if="fotoPerfil"
                        :src="fotoPerfil"
                        alt="Foto de perfil"
                        class="w-full h-full object-cover"
                        @error="fotoPerfil = null"
                      />
                      <div
                        v-else
                        class="w-full h-full bg-gray-600 flex items-center justify-center"
                      >
                        <span class="text-white text-3xl font-bold">
                          {{ form.nombre.charAt(0) }}{{ form.apellido.charAt(0) }}
                        </span>
                      </div>
                    </div>

                    <!-- Botón de cambio de foto -->
                    <label class="absolute bottom-0 right-0 bg-[#F4B400] rounded-full p-2 cursor-pointer hover:bg-[#F4B400]/80 transition-colors">
                      <svg class="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <input
                        ref="fileInput"
                        type="file"
                        accept="image/*"
                        class="hidden"
                        @change="cambiarFoto"
                      />
                    </label>
                  </div>

                  <p class="text-gray-400 text-sm mb-4">
                    Haz clic en el ícono para cambiar tu foto de perfil
                  </p>

                  <div class="space-y-2">
                    <button
                      @click="eliminarFoto"
                      v-if="fotoPerfil"
                      :disabled="loading"
                      class="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                    >
                      {{ loading ? 'Eliminando...' : 'Eliminar Foto' }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Información de la cuenta -->
              <div class="bg-zinc-900/95 border border-zinc-700/50 rounded-lg p-6">
                <h2 class="text-lg font-medium text-white mb-6">Información de la Cuenta</h2>
                
                 <div class="space-y-4">
                   <div>
                     <label class="block text-sm font-medium text-gray-400 mb-1">Rol</label>
                     <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                       {{ usuario.rol }}
                     </span>
                   </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-400 mb-1">Departamento</label>
                    <p class="text-gray-100">{{ usuario.departamento }}</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-400 mb-1">Fecha de Registro</label>
                    <p class="text-gray-100">{{ usuario.fechaRegistro }}</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-400 mb-1">Último Acceso</label>
                    <p class="text-gray-100">{{ usuario.ultimoAcceso }}</p>
                  </div>
                </div>
              </div>

              <!-- Cerrar Sesión -->
              <div class="bg-zinc-900/95 border border-zinc-700/50 rounded-lg p-6">
                <h2 class="text-lg font-medium text-white mb-4">Cerrar Sesión</h2>
                
                <div class="space-y-4">
                  <p class="text-gray-400 text-sm">
                    Cierra tu sesión actual en este dispositivo.
                  </p>

                  <button
                    @click="cerrarSesion"
                    class="w-full px-4 py-2 text-sm font-medium text-white bg-zinc-700 rounded-lg hover:bg-zinc-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '../partials/Sidebar.vue'
import Header from '../partials/Header.vue'
import { useAuth } from '@/composables/useAuth'
import { useProfile } from '@/composables/useProfile'
import { useToast } from '@/composables/useToast'

export default {
  name: 'EditarCuenta',
  components: {
    Sidebar,
    Header
  },
  setup() {
    const router = useRouter()
    const { user, signOut } = useAuth()
    const { success, error, warning } = useToast()
    const sidebarOpen = ref(false)
    
    // Usar el composable de perfil
    const {
      loading,
      usuario,
      form,
      fotoPerfil,
      fileInput,
      formValido,
      cargarInformacionUsuario,
      guardarInformacionPersonal,
      enviarRecuperacionContraseña,
      cambiarFoto,
      eliminarFoto
    } = useProfile()

    // Cerrar sesión
    const cerrarSesion = async () => {
      try {
        await signOut()
        router.push('/login')
      } catch (err) {
        error('Error al cerrar sesión')
        console.error('Error logout:', err)
      }
    }

    // Cargar información al montar el componente
    onMounted(() => {
      cargarInformacionUsuario()
    })

    return {
      sidebarOpen,
      fotoPerfil,
      fileInput,
      loading,
      usuario,
      form,
      formValido,
      guardarInformacionPersonal,
      enviarRecuperacionContraseña,
      cambiarFoto,
      eliminarFoto,
      cerrarSesion
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

/* Estilos para botones */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  transition: all 150ms;
}

.btn:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

/* Estilos para cards */
.card {
  background-color: rgb(24 24 27 / 0.8);
  border: 1px solid rgb(63 63 70 / 0.5);
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}
</style>