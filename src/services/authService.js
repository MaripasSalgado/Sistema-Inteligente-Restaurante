import { supabase } from '@/config/supabase'

export class AuthService {
  static async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password
      })

      if (error) {
        return { user: null, error: error.message }
      }

      // Actualizar último acceso después del login exitoso
      if (data.user) {
        try {
          const { UserService } = await import('./userService')
          await UserService.updateLastAccess()
        } catch (updateError) {
          // No fallar el login si no se puede actualizar el último acceso
          console.warn('No se pudo actualizar el último acceso:', updateError)
        }
      }

      return { user: data.user, error: null }
    } catch (error) {
      return { user: null, error: 'Error inesperado al iniciar sesión' }
    }
  }

  /**
   * Registrar nuevo usuario
   * @param {object} userData - Datos del usuario
   * @returns {Promise<{user: object|null, error: string|null}>}
   */
  static async signUp(userData) {
    try {
      const { email, password, ...profileData } = userData

      // Crear usuario en Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password
      })

      if (error) {
        console.error('Error en registro:', error.message)
        return { user: null, error: error.message }
      }

      // Si el usuario se creó correctamente, crear perfil en tabla usuarios
      if (data.user) {
        const profileResult = await this.createUserProfile(data.user.id, {
          email: email.trim().toLowerCase(),
          ...profileData
        })

        if (profileResult.error) {
          console.error('Error creando perfil:', profileResult.error)
          return { user: null, error: profileResult.error }
        }

        return { 
          user: { 
            ...data.user, 
            profile: profileResult.profile 
          }, 
          error: null 
        }
      }

      return { user: null, error: 'No se pudo crear el usuario' }
    } catch (error) {
      console.error('Error inesperado en registro:', error)
      return { user: null, error: 'Error inesperado al registrar usuario' }
    }
  }

  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        return { error: error.message }
      }

      localStorage.removeItem('rememberSession')
      sessionStorage.clear()

      return { error: null }
    } catch (error) {
      return { error: 'Error inesperado al cerrar sesión' }
    }
  }

  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error) {
        return { user: null, error: null }
      }

      return { user, error: null }
    } catch (error) {
      return { user: null, error: null }
    }
  }

  static onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }

  static async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
          redirectTo: `${window.location.origin}/change-password`
      })

      if (error) {
        return { error: error.message }
      }

      return { error: null }
    } catch (error) {
      return { error: 'Error inesperado al restablecer contraseña' }
    }
  }

  /**
   * Crear usuario interno (solo administradores)
   * @param {object} userData - Datos del usuario a crear
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async createInternalUser(userData) {
    try {
      console.log('[AuthService] Iniciando creación de usuario interno...')
      console.log('[AuthService] Datos a enviar:', {
        email: userData.email,
        nombre: userData.nombre,
        apellido: userData.apellido,
        cedula: userData.cedula,
        rol_id: userData.rol_id,
        departamento: userData.departamento
      })

      const { data, error } = await supabase.functions.invoke('crear-usuario', {
        body: {
          email: userData.email.trim().toLowerCase(),
          password: userData.password,
          nombre: userData.nombre,
          apellido: userData.apellido,
          telefono: userData.telefono || null,
          cedula: userData.cedula || null,
          rol_id: userData.rol_id || null,
          departamento: userData.departamento,
          puesto: userData.puesto || null
        }
      })

      console.log('[AuthService] Respuesta de la Edge Function:', { data, error })

      if (error) {
        console.error('[AuthService] Error en la Edge Function:', error)
        return { success: false, error: error.message }
      }

      console.log('[AuthService] Usuario creado exitosamente:', data)
      return { success: true, data: data }
    } catch (error) {
      console.error('[AuthService] Error inesperado:', error)
      return { success: false, error: 'Error inesperado al crear usuario interno' }
    }
  }
}

export default AuthService
