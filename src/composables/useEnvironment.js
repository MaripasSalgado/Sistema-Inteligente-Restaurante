import { computed } from 'vue'
import { ENV } from '@/config/env'

/**
 * Composable para manejar variables de entorno
 * @returns {object} Configuración y utilidades de entorno
 */
export function useEnvironment() {
  // Configuración base
  const config = computed(() => ({
    // Supabase
    supabaseUrl: ENV.SUPABASE_URL,
    supabaseAnonKey: ENV.SUPABASE_ANON_KEY,
    
    // Aplicación
    appName: ENV.APP_NAME,
    appVersion: ENV.APP_VERSION,
    debug: ENV.DEBUG,
    
    // Modo
    isDev: ENV.DEV,
    isProd: ENV.PROD,
    mode: ENV.MODE
  }))

  // Utilidades
  const isDevelopment = computed(() => ENV.DEV)
  const isProduction = computed(() => ENV.PROD)
  const isDebugMode = computed(() => ENV.DEBUG)

  // Función para logging condicional
  const log = (...args) => {
    if (ENV.DEBUG) {
      console.log('[DEBUG]', ...args)
    }
  }

  // Función para logging de errores
  const logError = (...args) => {
    console.error('[ERROR]', ...args)
  }

  // Función para logging de información
  const logInfo = (...args) => {
    if (ENV.DEBUG) {
      console.info('[INFO]', ...args)
    }
  }

  // Función para logging de advertencias
  const logWarn = (...args) => {
    console.warn('[WARN]', ...args)
  }

  // Validar configuración
  const validateConfig = () => {
    const required = ['supabaseUrl', 'supabaseAnonKey']
    const missing = required.filter(key => !config.value[key])
    
    if (missing.length > 0) {
      logError('Configuración faltante:', missing)
      return false
    }
    
    logInfo('Configuración válida')
    return true
  }

  return {
    // Estado
    config,
    isDevelopment,
    isProduction,
    isDebugMode,
    
    // Utilidades
    log,
    logError,
    logInfo,
    logWarn,
    validateConfig
  }
}

export default useEnvironment
