<template>
  <div class="min-h-screen flex login-page">
    <!-- Lado izquierdo: Imagen con logo -->
    <div class="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-yellow-400 via-orange-400 to-amber-500 overflow-hidden">
      <!-- Imagen de fondo -->
      <div class="absolute inset-0">
        <img 
          src="/empanada-venezolana-10.jpg" 
          alt="Empanadas" 
          class="w-full h-full object-cover opacity-80"
          @error="handleImageError"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
      </div>
      
      <!-- Logo grande -->
      <div class="relative z-10 flex flex-col items-center justify-center w-full p-12">
        <img 
          src="/src/images/El_Empanadazo-removebg.png" 
          alt="El Empanadazo Logo" 
          class="w-64 h-64 object-contain drop-shadow-2xl mb-8 animate-fade-in"
        />
        <h1 class="text-5xl font-bold text-white text-center drop-shadow-lg">
          El Empanadazo
        </h1>
        <p class="text-xl text-white/90 text-center mt-4 drop-shadow-md">
          Sistema de Gestión Inteligente
        </p>
      </div>
    </div>

<!-- Lado derecho: Formulario -->
<div class="w-full lg:w-1/2 flex items-center justify-center p-8" style="background-color: #0a0a0a;">
  <div class="max-w-md w-full space-y-8">
    
    <!-- Logo móvil (solo visible en pantallas pequeñas) -->
    <div class="text-center lg:hidden mb-8">
      <div class="flex justify-center mb-6">
        <img 
          src="/src/images/El_Empanadazo-removebg.png" 
          alt="El Empanadazo Logo" 
          class="w-32 h-32 object-contain"
        />
      </div>
      <h2 class="text-3xl font-bold text-white mb-2">El Empanadazo</h2>
    </div>

    <!-- Encabezado del formulario -->
    <div class="text-center">
      <h2 class="text-3xl font-bold text-white mb-2">Bienvenido</h2>
      <p class="text-gray-400">Inicia sesión en tu cuenta</p>
    </div>

    <!-- Formulario de login -->
    <div class="bg-zinc-900/80 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-8 shadow-2xl">
      <form @submit.prevent="iniciarSesion" class="space-y-6">
      
      <!-- Email -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
          Correo Electrónico
        </label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          placeholder="tu@email.com"
          class="w-full px-4 py-3 border border-zinc-700/50 rounded-xl bg-zinc-900/80 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
          :class="{ 'border-red-500 focus:ring-red-500': errores.email }"
        />
        <p v-if="errores.email" class="mt-1 text-sm text-red-400">{{ errores.email }}</p>
      </div>

      <!-- Contraseña -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
          Contraseña
        </label>
        <div class="relative">
          <input
            id="password"
            v-model="form.password"
            :type="mostrarContraseña ? 'text' : 'password'"
            required
            placeholder="Tu contraseña"
            class="w-full px-4 py-3 pr-12 border border-zinc-700/50 rounded-xl bg-zinc-900/80 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
            :class="{ 'border-red-500 focus:ring-red-500': errores.password }"
          />
          <button
            type="button"
            @click="mostrarContraseña = !mostrarContraseña"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
          >
            <svg v-if="mostrarContraseña" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
        <p v-if="errores.password" class="mt-1 text-sm text-red-400">{{ errores.password }}</p>
      </div>

      <!-- Enlace Olvidaste la contraseña -->
      <div class="text-center mt-2">
        <router-link to="/reset-password"
          class="text-sm text-yellow-400 hover:text-yellow-300">
          ¿Olvidaste tu contraseña?
        </router-link>
      </div>

      <!-- Mensaje de error general -->
      <div v-if="error" class="bg-red-900/50 border border-red-500 rounded-xl p-4 backdrop-blur-sm">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-red-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span class="text-red-200 text-sm">{{ error }}</span>
        </div>
      </div>

      <!-- Botón de login -->
      <div>
        <button
          type="submit"
          :disabled="loading"
          class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-xl text-black bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 focus:ring-offset-black disabled:from-zinc-600 disabled:to-zinc-700 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-yellow-500/50"
        >
          <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-4">
            <svg class="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
        </button>
      </div>
      </form>
    </div>
  </div>
</div>
</div>
</template>

<script>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const { signIn, loading, error, clearError } = useAuth()
    
    const form = reactive({
      email: '',
      password: ''
    })

    const errores = reactive({
      email: '',
      password: ''
    })

    const mostrarContraseña = ref(false)

    const handleImageError = (e) => {
      console.log('Error cargando imagen, usando gradiente de respaldo')
      e.target.style.display = 'none'
    }

    const validarFormulario = () => {
      // Limpiar errores anteriores
      errores.email = ''
      errores.password = ''
      clearError()

      // Validar email
      if (!form.email) {
        errores.email = 'El email es requerido'
        return false
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(form.email)) {
        errores.email = 'El email no tiene un formato válido'
        return false
      }

      // Validar contraseña
      if (!form.password) {
        errores.password = 'La contraseña es requerida'
        return false
      }

      if (form.password.length < 6) {
        errores.password = 'La contraseña debe tener al menos 6 caracteres'
        return false
      }

      return true
    }

    const iniciarSesion = async () => {
      if (!validarFormulario()) return

      try {
        const success = await signIn(form.email, form.password)
        
        if (!success) {
          return
        }

        // Si llegamos aquí, el login fue exitoso
        console.log('Login exitoso')
        
      } catch (error) {
        console.error('Error inesperado en login:', error)
      }
    }


    // Verificar si hay una sesión activa al cargar la página
    onMounted(async () => {
      const { isAuthenticated, loading } = useAuth()

      // Esperar a que se inicialice la autenticación
      if (loading.value) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      if (isAuthenticated.value) {
        router.push('/')
      }
    })


        return {
          form,
          errores,
          loading,
          mostrarContraseña,
          error,
          iniciarSesion,
          handleImageError
        }
  }
}
</script>

<style scoped>
.login-page {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fade-in 1s ease-out;
}

/* Efecto de brillo en el botón */
@keyframes shimmer {
  0% {
    background-position: -100%;
  }
  100% {
    background-position: 200%;
  }
}

button:not(:disabled):hover {
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

/* Mejoras visuales para inputs */
input:focus {
  transform: translateY(-1px);
}

input::placeholder {
  transition: opacity 0.3s;
}

input:focus::placeholder {
  opacity: 0.5;
}

/* Scroll suave para móviles */
@media (max-width: 1023px) {
  .login-page {
    overflow-y: auto;
  }
}
</style>