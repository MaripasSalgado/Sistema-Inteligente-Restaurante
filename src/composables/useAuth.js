import { ref, computed, onMounted, onUnmounted, readonly } from 'vue'
import { useRouter } from 'vue-router'
import AuthService from '@/services/authService'
import { UserStatusService } from '@/services/userStatusService'

/**
 * Composable para manejo de autenticación
 * Proporciona estado global de autenticación y métodos para login/logout
 */
export function useAuth() {
  const router = useRouter()
  
  // Estado reactivo
  const user = ref(null)
  const loading = ref(true)
  const error = ref(null)
  const resetPasswordLoading = ref(false)
  const signOutLoading = ref(false)

  // Computed properties
  const isAuthenticated = computed(() => !!user.value)
  const userProfile = computed(() => user.value?.profile || null)
  const userRole = computed(() => userProfile.value?.rol?.nombre || null)
  const userName = computed(() => {
    if (!userProfile.value) return ''
    return `${userProfile.value.nombre} ${userProfile.value.apellido}`.trim()
  })

  /**
   * Verificar si el usuario está activo
   * @param {object} authUser - Usuario autenticado
   * @returns {Promise<boolean>} - true si el usuario está activo
   */
  const checkUserStatus = async (authUser) => {
    if (!authUser?.id) return false

    try {
      const { isActive, user: userData } = await UserStatusService.checkUserStatus(authUser.id)
      
      if (!isActive) {
        console.warn('Usuario inactivo detectado, cerrando sesión...')
        await UserStatusService.logoutUser()
        return false
      }

      return true
    } catch (error) {
      console.error('Error verificando estado del usuario:', error)
      return false
    }
  }

  /**
   * Inicializar autenticación
   * Verificar si hay una sesión activa al cargar la app
   */
  const initializeAuth = async () => {
    try {
      loading.value = true
      error.value = null

      const { user: currentUser, error: authError } = await AuthService.getCurrentUser()
      
      if (authError) {
        // No mostrar errores de sesión faltante en la UI
        console.log('No hay sesión activa (normal)')
        user.value = null
      } else {
        // Verificar si el usuario está activo
        const isActive = await checkUserStatus(currentUser)
        if (isActive) {
          user.value = currentUser
        } else {
          user.value = null
        }
      }
    } catch (err) {
      console.error('Error inesperado inicializando auth:', err)
      user.value = null
    } finally {
      loading.value = false
    }
  }

  /**
   * Iniciar sesión
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<boolean>} - true si el login fue exitoso
   */
  const signIn = async (email, password) => {
    loading.value = true
    error.value = null

    try {
      const { user: authUser, error: authError } = await AuthService.signIn(email, password)

      if (authError) {
        error.value = authError
        return false
      }

      // Verificar si el usuario está activo después del login
      const isActive = await checkUserStatus(authUser)
      if (!isActive) {
        error.value = 'Tu cuenta ha sido desactivada. Contacta al administrador.'
        return false
      }

      user.value = authUser

      // Redirigir al inicio después del login exitoso
      await router.push('/')

      return true
    } catch (err) {
      console.error('Error inesperado en login:', err)
      error.value = 'Error inesperado al iniciar sesión'
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Registrar nuevo usuario
   * @param {object} userData - Datos del usuario
   * @returns {Promise<boolean>} - true si el registro fue exitoso
   */
  const signUp = async (userData) => {
    loading.value = true
    error.value = null

    try {
      const { user: authUser, error: authError } = await AuthService.signUp(userData)
      
      if (authError) {
        error.value = authError
        return false
      }

      user.value = authUser
      
      // Redirigir al inicio después del registro exitoso
      await router.push('/')
      
      return true
    } catch (err) {
      console.error('Error inesperado en registro:', err)
      error.value = 'Error inesperado al registrar usuario'
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Cerrar sesión
   * @returns {Promise<boolean>} - true si el logout fue exitoso
   */
  const signOut = async () => {
    console.log('Iniciando logout...')
    signOutLoading.value = true
    error.value = null

    // Timeout de seguridad para resetear loading
    const timeoutId = setTimeout(() => {
      console.warn('Timeout de seguridad: reseteando loading de logout')
      signOutLoading.value = false
    }, 5000) // 5 segundos

    try {
      console.log('Cerrando sesión en Supabase...')
      const { error: authError } = await AuthService.signOut()
      
      console.log('Sesión cerrada exitosamente, limpiando usuario...')
      // Limpiar el usuario inmediatamente
      user.value = null
      
      // Si hay error pero es solo timeout, continuar con la redirección
      if (authError && !authError.includes('Timeout')) {
        console.error('Error en logout:', authError)
        error.value = authError
        clearTimeout(timeoutId)
        signOutLoading.value = false
        return false
      }

      console.log('Redirigiendo al login...')
      // Redirigir al login después del logout
      await router.push('/login')
      
      console.log('Logout completado exitosamente')
      clearTimeout(timeoutId)
      signOutLoading.value = false
      return true
    } catch (err) {
      console.error('Error inesperado en logout:', err)
      
      // Limpiar usuario y redirigir incluso si hay error
      user.value = null
      try {
        await router.push('/login')
      } catch (routerError) {
        console.error('Error redirigiendo:', routerError)
        // Forzar redirección con window.location como último recurso
        window.location.href = '/login'
      }
      
      clearTimeout(timeoutId)
      signOutLoading.value = false
      return true // Retornar true para indicar que se completó (aunque con errores)
    }
  }

  /**
   * Restablecer contraseña
   * @param {string} email - Email del usuario
   * @returns {Promise<boolean>} - true si el envío fue exitoso
   */
  const resetPassword = async (email) => {
    try {
      resetPasswordLoading.value = true
      error.value = null

        const { error: resetError } = await AuthService.resetPassword(email)
        resetPasswordLoading.value = false
      
        if (resetError) {
            error.value = resetError
        return false
      }

      return true
    } catch (err) {
      console.error('Error inesperado restableciendo contraseña:', err)
      error.value = 'Error inesperado al restablecer contraseña'
      return false
    } finally {
      resetPasswordLoading.value = false
    }
  }

  /**
   * Verificar si el usuario tiene un rol específico
   * @param {string} roleName - Nombre del rol
   * @returns {boolean}
   */
  const hasRole = (roleName) => {
    return AuthService.hasRole(user.value, roleName)
  }

  /**
   * Verificar si el usuario tiene un permiso específico
   * @param {string} permission - Nombre del permiso
   * @returns {Promise<boolean>}
   */
  const hasPermission = async (permission) => {
    return await AuthService.hasPermission(user.value, permission)
  }

  /**
   * Limpiar errores
   */
  const clearError = () => {
    error.value = null
  }


  /**
   * Actualizar perfil del usuario
   * @param {object} updates - Datos a actualizar
   * @returns {Promise<boolean>} - true si la actualización fue exitosa
   */
  const updateProfile = async (updates) => {
    try {
      if (!user.value?.id) {
        error.value = 'No hay usuario autenticado'
        return false
      }

      loading.value = true
      error.value = null

      const { profile, error: updateError } = await AuthService.updateUserProfile(user.value.id, updates)
      
      if (updateError) {
        error.value = updateError
        return false
      }

      // Actualizar el usuario en el estado local
      user.value = {
        ...user.value,
        profile: profile
      }

      return true
    } catch (err) {
      console.error('Error inesperado actualizando perfil:', err)
      error.value = 'Error inesperado al actualizar perfil'
      return false
    } finally {
      loading.value = false
    }
  }

  // Escuchar cambios en la autenticación
  let authListener = null

  onMounted(() => {
    // Inicializar autenticación
    initializeAuth()

    // Configurar listener para cambios de autenticación
    authListener = AuthService.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.id)
      
      if (event === 'SIGNED_IN' && session?.user) {
        const { user: authUser, error: authError } = await AuthService.getCurrentUser()
        if (!authError) {
          // Verificar si el usuario está activo
          const isActive = await checkUserStatus(authUser)
          if (isActive) {
            user.value = authUser
          }
        }
      } else if (event === 'SIGNED_OUT') {
        user.value = null
        // Limpiar cualquier estado persistente
        localStorage.removeItem('rememberSession')
      } else if (event === 'TOKEN_REFRESHED') {
        // Actualizar usuario si el token se refrescó
        if (session?.user) {
          const { user: authUser, error: authError } = await AuthService.getCurrentUser()
          if (!authError) {
            // Verificar si el usuario está activo
            const isActive = await checkUserStatus(authUser)
            if (isActive) {
              user.value = authUser
            }
          }
        }
      }
    })
  })

  onUnmounted(() => {
    // Limpiar listener
    if (authListener) {
      authListener.data.subscription.unsubscribe()
    }
  })

  return {
    // Estado
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),
    resetPasswordLoading: readonly(resetPasswordLoading),
    signOutLoading: readonly(signOutLoading),
    
    // Computed
    isAuthenticated,
    userProfile,
    userRole,
    userName,
    
    // Métodos
    signIn,
    signUp,
    signOut,
    resetPassword,
    resetPasswordLoading,
    hasRole,
    hasPermission,
    clearError,
    updateProfile,
    initializeAuth
  }
}

// Exportar también como default para compatibilidad
export default useAuth
