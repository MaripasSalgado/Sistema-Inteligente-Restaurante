<template>
  <div class="test-queries">
    <h1>Prueba de Queries</h1>
    
    <div class="buttons">
      <button @click="probarConexion" :disabled="loading">Probar Conexión</button>
      <button @click="consultarUsuarios" :disabled="loading">Consultar Usuarios</button>
      <button @click="queryDirecto" :disabled="loading">Query Directo</button>
      <button @click="probarTodo" :disabled="loading">Probar Todo</button>
      <button @click="probarStorage" :disabled="loading">Probar Storage</button>
    </div>

    <div v-if="resultado" class="resultado">
      <h3>Resultado:</h3>
      <pre>{{ JSON.stringify(resultado, null, 2) }}</pre>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { probarConexion, consultarUsuarios, queryDirecto, probarTodo } from '@/test-queries'
import { testStorageConfig, testImageUpload } from '@/test-storage'

export default {
  name: 'TestQueries',
  setup() {
    const loading = ref(false)
    const resultado = ref(null)

    const ejecutar = async (funcion) => {
      loading.value = true
      resultado.value = null
      
      try {
        const result = await funcion()
        resultado.value = result
      } catch (error) {
        resultado.value = { error: error.message }
      } finally {
        loading.value = false
      }
    }

    const probarStorage = async () => {
      loading.value = true
      try {
        const success = await testStorageConfig()
        resultado.value = success ? 'Storage configurado correctamente' : 'Error en configuración de Storage'
      } catch (error) {
        resultado.value = `Error: ${error.message}`
      } finally {
        loading.value = false
      }
    }

    return {
      loading,
      resultado,
      probarConexion: () => ejecutar(probarConexion),
      consultarUsuarios: () => ejecutar(consultarUsuarios),
      queryDirecto: () => ejecutar(queryDirecto),
      probarTodo: () => ejecutar(probarTodo),
      probarStorage
    }
  }
}
</script>

<style scoped>
.test-queries {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

button {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover:not(:disabled) {
  background: #0056b3;
}

button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.resultado {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 15px;
  margin-top: 20px;
}

pre {
  background: white;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
}
</style>
