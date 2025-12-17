<template>
    <div class="min-h-screen flex items-center justify-center px-4 py-12" style="background-color: #0a0a0a;">
        <div class="max-w-md w-full space-y-8">

            <!-- Encabezado -->
            <div class="text-center">
                <h2 class="text-3xl font-bold text-white mb-2">Cambiar Contraseña</h2>
                <p class="text-gray-400">Ingrese su nueva contraseña</p>
            </div>

            <!-- Formulario -->
            <div class="bg-zinc-900/80 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-8 shadow-2xl">

                <!-- Mensaje de éxito -->
                <div v-if="success" class="bg-green-900/50 border border-green-500 rounded-xl p-4 backdrop-blur-sm mb-6">
                    <div class="flex items-center">
                        <svg class="w-5 h-5 text-green-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span class="text-green-200 text-sm">{{ success }}</span>
                    </div>
                </div>

                <!-- Mensaje de error -->
                <div v-if="error" class="bg-red-900/50 border border-red-500 rounded-xl p-4 backdrop-blur-sm mb-6">
                    <div class="flex items-center">
                        <svg class="w-5 h-5 text-red-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span class="text-red-200 text-sm">{{ error }}</span>
                    </div>
                </div>

                <form @submit.prevent="updatePassword" class="space-y-6">
                    <!-- Nueva contraseña -->
                    <div>
                        <label for="newPassword" class="block text-sm font-medium text-gray-300 mb-2">
                            Nueva contraseña
                        </label>
                        <input
                            id="newPassword"
                            type="password"
                            v-model="newPassword"
                            required
                            placeholder="Nueva contraseña"
                            class="w-full px-4 py-3 border border-zinc-700/50 rounded-xl bg-zinc-900/80 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
                        />
                    </div>

                    <!-- Confirmar contraseña -->
                    <div>
                        <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-2">
                            Confirmar contraseña
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            v-model="confirmPassword"
                            required
                            placeholder="Confirmar contraseña"
                            class="w-full px-4 py-3 border border-zinc-700/50 rounded-xl bg-zinc-900/80 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
                        />
                    </div>

                    <!-- Botón -->
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
                            {{ loading ? 'Actualizando...' : 'Cambiar Contraseña' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { supabase } from '@/config/supabase'

    export default {
        name: 'ChangePassword',
        setup() {
            const router = useRouter()

            const newPassword = ref('')
            const confirmPassword = ref('')
            const error = ref('')
            const success = ref('')
            const loading = ref(false)

            // Extraer el token de recuperación desde el hash (#) de la URL
            const hash = window.location.hash
            const params = new URLSearchParams(hash.replace('#', ''))
            const accessToken = params.get('access_token')

            const updatePassword = async () => {
                error.value = ''
                success.value = ''

                if (!newPassword.value || !confirmPassword.value) {
                    error.value = 'Ambos campos son obligatorios'
                    return
                }

                if (newPassword.value !== confirmPassword.value) {
                    error.value = 'Las contraseñas no coinciden'
                    return
                }

                if (!accessToken) {
                    error.value = 'Token de recuperación faltante o inválido'
                    return
                }

                loading.value = true

                try {
                    const { error: updateError } = await supabase.auth.updateUser(
                        { password: newPassword.value },
                        { accessToken } // Aquí se pasa el token correcto
                    )

                    if (updateError) {
                        error.value = updateError.message
                    } else {
                        success.value = 'Contraseña actualizada correctamente. Redirigiendo al login...'
                        await supabase.auth.signOut()
                        router.replace({ path: '/login', query: { reset: 'ok' } })
                        setTimeout(() => router.push('/login'), 2500)
                    }
                } catch (err) {
                    error.value = 'Ocurrió un error inesperado'
                    console.error(err)
                } finally {
                    loading.value = false
                }
            }

            return {
                newPassword,
                confirmPassword,
                error,
                success,
                loading,
                updatePassword
            }
        }
    }
</script>

<style scoped>
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
</style>
