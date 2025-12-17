import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from './useAuth'

/**
 * Composable para protección de rutas
 * Maneja la verificación de autenticación en componentes
 */
export function useRouteGuard() {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuth()

  const checkAuth = () => {
    if (!loading.value && !isAuthenticated.value) {
      router.push('/login')
      return false
    }
    return true
  }

  onMounted(() => {
    checkAuth()
  })

  return {
    checkAuth,
    isAuthenticated,
    loading
  }
}

export default useRouteGuard
