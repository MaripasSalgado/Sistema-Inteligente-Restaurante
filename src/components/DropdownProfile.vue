<template>
  <div class="relative inline-flex">
    <button
      ref="trigger"
      class="inline-flex justify-center items-center group cursor-pointer"
      aria-haspopup="true"
      @click.prevent="irAEditarCuenta"
    >
      <!-- Foto de perfil o iniciales -->
      <div v-if="usuario.foto_perfil" class="w-10 h-10 rounded-full overflow-hidden border-2 border-zinc-600">
        <img :src="usuario.foto_perfil" class="w-full h-full object-cover" alt="Foto de perfil" />
      </div>
      <div v-else class="w-10 h-10 rounded-full bg-gray-600 border-2 border-zinc-600 flex items-center justify-center">
        <span class="text-white font-medium text-sm">
          {{ usuario.nombre.charAt(0) }}{{ usuario.apellido.charAt(0) }}
        </span>
      </div>
      
      <!-- Nombre del usuario -->
      <div class="flex items-center truncate ml-3">
        <span class="truncate text-sm font-medium text-white group-hover:text-yellow-400 transition-colors">
          {{ usuario.nombre }} {{ usuario.apellido }}
        </span>
      </div>
    </button>
   <!-- <transition
      enter-active-class="transition ease-out duration-200 transform"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-out duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-show="dropdownOpen" class="origin-top-right z-10 absolute top-full min-w-44 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700/60 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1" :class="align === 'right' ? 'right-0' : 'left-0'">
        <div class="pt-0.5 pb-2 px-3 mb-1 border-b border-gray-200 dark:border-gray-700/60">
          <div class="font-medium text-gray-800 dark:text-gray-100">El Epanadazo</div>
          <div class="text-xs text-gray-500 dark:text-gray-400 italic">Administrator</div>
        </div>
        <ul
          ref="dropdown"
          @focusin="dropdownOpen = true"
          @focusout="dropdownOpen = false"
        >
          <li>
            <router-link class="font-medium text-sm text-amber-500 hover:text-amber-600 dark:hover:text-amber-400 flex items-center py-1 px-3" to="/settings/account" @click="dropdownOpen = false">Settings</router-link>
          </li>
          <li>
            <router-link class="font-medium text-sm text-amber-500 hover:text-amber-600 dark:hover:text-amber-400 flex items-center py-1 px-3" to="/signin" @click="dropdownOpen = false">Sign Out</router-link>
          </li>
        </ul>
      </div> 
    </transition> -->
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { UserService } from '@/services/userService'
import { AvatarService } from '@/services/avatarService'

export default {
  name: 'DropdownProfile',
  props: ['align'],
  setup() {
    const router = useRouter()
    const dropdownOpen = ref(false)
    const trigger = ref(null)
    const dropdown = ref(null)
    const usuario = ref({
      nombre: '',
      apellido: '',
      foto_perfil: null
    })

    // Cargar información del usuario
    const cargarUsuario = async () => {
      try {
        const result = await UserService.getCurrentProfile()
        if (result.data) {
          usuario.value = {
            nombre: result.data.nombre || 'Usuario',
            apellido: result.data.apellido || '',
            foto_perfil: result.data.foto_perfil 
              ? AvatarService.getPublicUrl(result.data.foto_perfil) 
              : null
          }
        }
      } catch (error) {
        console.error('Error cargando usuario:', error)
      }
    }

    // Redirigir a editar cuenta
    const irAEditarCuenta = () => {
      router.push('/account')
    }

    // close on click outside
    const clickHandler = ({ target }) => {
      if (!dropdownOpen.value || dropdown.value?.contains(target) || trigger.value?.contains(target)) return
      dropdownOpen.value = false
    }

    // close if the esc key is pressed
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen.value || keyCode !== 27) return
      dropdownOpen.value = false
    }

    onMounted(() => {
      cargarUsuario()
      document.addEventListener('click', clickHandler)
      document.addEventListener('keydown', keyHandler)
    })

    onUnmounted(() => {
      document.removeEventListener('click', clickHandler)
      document.removeEventListener('keydown', keyHandler)
    })

    return {
      dropdownOpen,
      trigger,
      dropdown,
      usuario,
      irAEditarCuenta
    }
  }
}
</script>