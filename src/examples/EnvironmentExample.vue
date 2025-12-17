<template>
  <div class="p-6 bg-gray-100 rounded-lg">
    <h2 class="text-2xl font-bold mb-4">Configuración de Variables de Entorno</h2>
    
    <!-- Información de la aplicación -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-2">Información de la Aplicación</h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <span class="font-medium">Nombre:</span>
          <span class="ml-2">{{ config.appName }}</span>
        </div>
        <div>
          <span class="font-medium">Versión:</span>
          <span class="ml-2">{{ config.appVersion }}</span>
        </div>
        <div>
          <span class="font-medium">Modo:</span>
          <span class="ml-2">{{ config.mode }}</span>
        </div>
        <div>
          <span class="font-medium">Debug:</span>
          <span class="ml-2">{{ config.debug ? 'Activado' : 'Desactivado' }}</span>
        </div>
      </div>
    </div>

    <!-- Configuración de Supabase -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-2">Configuración de Supabase</h3>
      <div class="space-y-2">
        <div>
          <span class="font-medium">URL:</span>
          <span class="ml-2 text-sm text-gray-600">{{ config.supabaseUrl ? 'Configurada' : 'No configurada' }}</span>
        </div>
        <div>
          <span class="font-medium">Clave Anónima:</span>
          <span class="ml-2 text-sm text-gray-600">{{ config.supabaseAnonKey ? 'Configurada' : 'No configurada' }}</span>
        </div>
      </div>
    </div>

    <!-- Estado de validación -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-2">Estado de Validación</h3>
      <div class="flex items-center space-x-2">
        <span :class="isValid ? 'text-green-600' : 'text-red-600'">
          {{ isValid ? '✅ Configuración válida' : '❌ Configuración inválida' }}
        </span>
      </div>
    </div>

    <!-- Botones de prueba -->
    <div class="space-x-4">
      <button 
        @click="testLogging"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Probar Logging
      </button>
      
      <button 
        @click="validateConfig"
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Validar Configuración
      </button>
    </div>

    <!-- Logs de debug -->
    <div v-if="config.debug" class="mt-6">
      <h3 class="text-lg font-semibold mb-2">Logs de Debug</h3>
      <div class="bg-black text-green-400 p-4 rounded font-mono text-sm">
        <div v-for="(log, index) in debugLogs" :key="index" class="mb-1">
          {{ log }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useEnvironment } from '@/composables/useEnvironment'

export default {
  name: 'EnvironmentExample',
  setup() {
    const { config, isDebugMode, log, logError, logInfo, logWarn, validateConfig } = useEnvironment()
    const debugLogs = ref([])

    const isValid = computed(() => {
      return config.value.supabaseUrl && config.value.supabaseAnonKey
    })

    const testLogging = () => {
      log('Este es un mensaje de debug')
      logInfo('Este es un mensaje de información')
      logWarn('Este es un mensaje de advertencia')
      logError('Este es un mensaje de error')
      
      if (isDebugMode.value) {
        debugLogs.value.push(`[${new Date().toLocaleTimeString()}] Mensajes de prueba enviados`)
      }
    }

    const handleValidateConfig = () => {
      const result = validateConfig()
      if (isDebugMode.value) {
        debugLogs.value.push(`[${new Date().toLocaleTimeString()}] Validación: ${result ? 'Exitosa' : 'Fallida'}`)
      }
    }

    onMounted(() => {
      log('Componente EnvironmentExample montado')
      if (isDebugMode.value) {
        debugLogs.value.push(`[${new Date().toLocaleTimeString()}] Componente montado`)
      }
    })

    return {
      config,
      isValid,
      debugLogs,
      testLogging,
      validateConfig: handleValidateConfig
    }
  }
}
</script>
