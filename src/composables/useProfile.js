import { ref, computed } from 'vue'
import { UserService } from '@/services/userService'
import { AuthService } from '@/services/authService'
import { AvatarService } from '@/services/avatarService'
import { useToast } from '@/composables/useToast'
import { supabase } from '@/config/supabase'

export function useProfile() {
  const { success, error, warning } = useToast()
  const loading = ref(false)
  const usuario = ref({
    rol: 'Usuario',
    departamento: 'General',
    fechaRegistro: '',
    ultimoAcceso: ''
  })

  const form = ref({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    cedula: '',
    departamento: '',
    puesto: '',
    puesto: '',
    biografia: '',
    rol_id: null
  })

  const fotoPerfil = ref(null)
  const fileInput = ref(null)

  // Computed properties
  const formValido = computed(() => {
    return form.value.nombre && form.value.apellido && form.value.email
  })

  // Cargar información del usuario
  const cargarInformacionUsuario = async () => {
    loading.value = true
    try {
      const result = await UserService.getCurrentProfile()

      if (result.success && result.data) {
        const usuarioData = result.data

        // Llenar formulario con datos editables
        form.value = {
          nombre: usuarioData.nombre || '',
          apellido: usuarioData.apellido || '',
          email: usuarioData.email || '',
          telefono: usuarioData.telefono || '',
          cedula: usuarioData.cedula || '',
          departamento: usuarioData.departamento || '',
          puesto: usuarioData.puesto || '',
          puesto: usuarioData.puesto || '',
          biografia: usuarioData.biografia || '',
          rol_id: usuarioData.rol_id
        }

        // Cargar foto de perfil desde Supabase
        fotoPerfil.value = usuarioData.foto_perfil ? AvatarService.getPublicUrl(usuarioData.foto_perfil) : null

        // Llenar información de la cuenta (solo lectura)
        usuario.value = {
          rol: usuarioData.roles?.nombre || 'No asignado',
          departamento: usuarioData.departamento || 'No asignado',
          fechaRegistro: usuarioData.fecha_creacion ? new Date(usuarioData.fecha_creacion).toLocaleDateString('es-ES') : 'No disponible',
          ultimoAcceso: usuarioData.ultimo_acceso ? new Date(usuarioData.ultimo_acceso).toLocaleString('es-ES') : 'Nunca'
        }
      } else {
        // Si no se encuentra en la tabla usuarios, usar datos de auth
        const { user: currentUser } = await AuthService.getCurrentUser()

        if (currentUser) {
          form.value = {
            nombre: currentUser.user_metadata?.nombre || '',
            apellido: currentUser.user_metadata?.apellido || '',
            email: currentUser.email || '',
            telefono: '',
            cedula: '',
            departamento: '',
            puesto: '',
            biografia: ''
          }

          usuario.value = {
            rol: 'No asignado',
            departamento: 'No asignado',
            fechaRegistro: new Date(currentUser.created_at).toLocaleDateString('es-ES'),
            ultimoAcceso: currentUser.last_sign_in_at ? new Date(currentUser.last_sign_in_at).toLocaleString('es-ES') : 'Nunca'
          }
        }
      }
    } catch (error) {
      console.error('Error cargando información del usuario:', error)
    } finally {
      loading.value = false
    }
  }

  // Guardar información personal
  const guardarInformacionPersonal = async () => {
    loading.value = true
    try {
      const result = await UserService.updateProfile(form.value)

      if (result.success) {
        success('Información personal actualizada exitosamente')
        // Recargar la información del usuario
        await cargarInformacionUsuario()
      } else {
        error('Error al actualizar el perfil: ' + result.error)
      }
    } catch (err) {
      console.error('Error guardando información:', err)
      error('Error al guardar la información')
    } finally {
      loading.value = false
    }
  }

  // Enviar email de recuperación de contraseña
  const enviarRecuperacionContraseña = async () => {
    loading.value = true
    try {
      // Obtener el email del usuario autenticado directamente
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user?.email) {
        error('No se pudo obtener el email del usuario autenticado')
        return
      }

      const result = await UserService.resetPassword(user.email)

      if (result.success) {
        success('Se ha enviado un email de recuperación de contraseña a tu correo electrónico.')
      } else {
        error('Error al enviar el email de recuperación: ' + result.error)
      }
    } catch (err) {
      console.error('Error enviando recuperación:', err)
      error('Error al enviar el email de recuperación')
    } finally {
      loading.value = false
    }
  }

  // Cambiar foto de perfil
  const cambiarFoto = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    loading.value = true
    try {
      // Obtener el path de la foto actual para eliminarla
      const { data: { user } } = await supabase.auth.getUser()
      const { data: profileData } = await supabase
        .from('usuarios')
        .select('foto_perfil')
        .eq('id', user.id)
        .single()

      const oldAvatarPath = profileData?.foto_perfil || null

      // Subir nueva foto (elimina la anterior automáticamente)
      const result = await UserService.uploadProfilePhoto(file, oldAvatarPath)

      if (!result.success) {
        error('Error al subir la foto: ' + result.error)
        return
      }

      // Actualizar la vista previa
      fotoPerfil.value = result.url

      // Recargar información del usuario
      await cargarInformacionUsuario()

      success('Foto de perfil actualizada exitosamente')
    } catch (err) {
      console.error('Error cambiando foto:', err)
      error('Error al cambiar la foto de perfil')
    } finally {
      loading.value = false
    }
  }

  // Eliminar foto de perfil
  const eliminarFoto = async () => {
    confirm(
      '¿Estás seguro de que quieres eliminar tu foto de perfil?',
      async () => {
        loading.value = true
        try {
          const result = await UserService.deleteProfilePhoto()

          if (!result.success) {
            error('Error al eliminar la foto: ' + result.error)
            return
          }

          // Limpiar la vista previa
          fotoPerfil.value = null
          if (fileInput.value) {
            fileInput.value.value = ''
          }

          // Recargar información del usuario
          await cargarInformacionUsuario()

          success('Foto de perfil eliminada exitosamente')
        } catch (err) {
          console.error('Error eliminando foto:', err)
          error('Error al eliminar la foto de perfil')
        } finally {
          loading.value = false
        }
      }
    )
  }

  return {
    // State
    loading,
    usuario,
    form,
    fotoPerfil,
    fileInput,

    // Computed
    formValido,

    // Methods
    cargarInformacionUsuario,
    guardarInformacionPersonal,
    enviarRecuperacionContraseña,
    cambiarFoto,
    eliminarFoto
  }
}
