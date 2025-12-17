<template>
  <div class="min-h-screen flex items-center justify-center p-8 reset-password-page" style="background-color: #0a0a0a;">
    <div class="max-w-md w-full space-y-8">

      <!-- Logo y título -->
      <div class="text-center">
        <div class="flex justify-center mb-6">
          <img
            src="/src/images/El_Empanadazo-removebg.png"
            alt="El Empanadazo Logo"
            class="w-32 h-32 object-contain animate-fade-in"
          />
        </div>
        <h2 class="text-3xl font-bold text-white mb-2">Recuperar Contraseña</h2>
        <p class="text-gray-400">Ingresa tu email para recibir un enlace de restablecimiento</p>
      </div>

      <!-- Formulario de recuperación -->
      <div class="bg-zinc-900/80 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-8 shadow-2xl">
        <form @submit.prevent="enviarEmailRecuperacion" class="space-y-6">

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

          <!-- Mensaje de éxito -->
          <div v-if="emailEnviado" class="bg-green-900/50 border border-green-500 rounded-xl p-4 backdrop-blur-sm">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-green-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-green-200 text-sm">
                Se ha enviado un enlace de recuperación a tu email. Revisa tu bandeja de entrada y spam.
              </span>
            </div>
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

          <!-- Botón de envío -->
          <div>
            <button
              type="submit"
              :disabled="resetPasswordLoading || emailEnviado"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-xl text-black bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 focus:ring-offset-black disabled:from-zinc-600 disabled:to-zinc-700 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-yellow-500/50"
            >
              <span v-if="resetPasswordLoading" class="absolute left-0 inset-y-0 flex items-center pl-4">
                <svg class="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ resetPasswordLoading ? 'Enviando...' : emailEnviado ? 'Email Enviado' : 'Enviar Enlace de Recuperación' }}
            </button>
          </div>

          <!-- Enlaces de navegación -->
          <div class="text-center space-y-2">
            <p class="text-sm text-gray-400">
              ¿Recordaste tu contraseña?
              <router-link
                to="/login"
                class="font-medium text-yellow-400 hover:text-yellow-300 ml-1"
              >
                Iniciar sesión
              </router-link>
            </p>
          </div>
        </form>
      </div>

      <!-- Información adicional -->
      <div class="text-center">
        <div class="bg-zinc-900/80 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-6 shadow-2xl">
          <h3 class="text-sm font-medium text-white mb-2">¿No recibiste el email?</h3>
          <p class="text-xs text-gray-400 mb-3">
            Revisa tu carpeta de spam o correo no deseado. El email puede tardar unos minutos en llegar.
          </p>
          <button
            @click="reenviarEmail"
            :disabled="resetPasswordLoading || !emailEnviado"
            class="text-sm text-yellow-400 hover:text-yellow-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Reenviar email
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

export default {
  name: 'ResetPassword',
  setup() {
    const router = useRouter()
    const { resetPassword, resetPasswordLoading, error, clearError } = useAuth()
    
    const form = reactive({
      email: ''
    })

    const errores = reactive({
      email: ''
    })

    const emailEnviado = ref(false)

    const validarFormulario = () => {
      // Limpiar errores anteriores
      errores.email = ''
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

      return true
    }

    const enviarEmailRecuperacion = async () => {
      if (!validarFormulario()) return

      try {
        const success = await resetPassword(form.email)
        
        if (success) {
          emailEnviado.value = true
        }
      } catch (error) {
        console.error('Error inesperado enviando email:', error)
      }
    }

    const reenviarEmail = async () => {
      if (!form.email) return

      try {
        clearError()
        const success = await resetPassword(form.email)
        
        if (success) {
          // Mostrar mensaje de reenvío exitoso
          console.log('Email reenviado exitosamente')
        }
      } catch (error) {
        console.error('Error reenviando email:', error)
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
        router.push('/dashboard')
      }
    })

    return {
      form,
      errores,
      resetPasswordLoading,
      error,
      emailEnviado,
      enviarEmailRecuperacion,
      reenviarEmail
    }
  }
}
</script>

<style scoped>
.reset-password-page {
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
  .reset-password-page {
    overflow-y: auto;
  }
}
</style>
