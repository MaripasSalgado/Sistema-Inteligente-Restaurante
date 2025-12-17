<template>
  <div class="connection-test">
    <h2>Prueba de Conexión con Supabase</h2>
    
    <div class="status-section">
      <div class="status-indicator" :class="connectionStatus">
        <span class="status-dot"></span>
        <span class="status-text">{{ statusText }}</span>
      </div>
    </div>

    <div class="info-section">
      <h3>Información de Conexión</h3>
      <div class="info-grid">
        <div class="info-item">
          <label>URL de Supabase:</label>
          <span class="info-value">{{ supabaseUrl }}</span>
        </div>
        <div class="info-item">
          <label>Clave Anónima:</label>
          <span class="info-value">{{ maskedApiKey }}</span>
        </div>
        <div class="info-item">
          <label>Estado de Conexión:</label>
          <span class="info-value">{{ connectionStatus }}</span>
        </div>
      </div>
    </div>

    <div v-if="usuarios.length > 0" class="data-section">
      <h3>Datos de la Tabla Usuarios</h3>
      <div class="data-info">
        <p><strong>Total de registros:</strong> {{ usuarios.length }}</p>
      </div>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Departamento</th>
              <th>Área</th>
              <th>Estado</th>
              <th>Puesto</th>
              <th>Fecha Creación</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="usuario in usuarios" :key="usuario.id">
              <td>{{ usuario.id }}</td>
              <td>{{ usuario.nombre || 'N/A' }}</td>
              <td>{{ usuario.apellido || 'N/A' }}</td>
              <td>{{ usuario.email || 'N/A' }}</td>
              <td>{{ usuario.telefono || 'N/A' }}</td>
              <td>{{ usuario.departamento || 'N/A' }}</td>
              <td>{{ usuario.area || 'N/A' }}</td>
              <td>
                <span class="status-badge" :class="usuario.estado?.toLowerCase()">
                  {{ usuario.estado || 'N/A' }}
                </span>
              </td>
              <td>{{ usuario.puesto || 'N/A' }}</td>
              <td>{{ formatDate(usuario.fecha_creacion) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="actions">
      <button @click="testConnection" :disabled="isLoading" class="test-button">
        {{ isLoading ? 'Probando...' : 'Probar Conexión' }}
      </button>
      <button @click="fetchUsuarios" :disabled="isLoading" class="test-button secondary">
        {{ isLoading ? 'Cargando...' : 'Obtener Usuarios' }}
      </button>
    </div>

    <div v-if="errorMessage" class="error-message">
      <h4>Error:</h4>
      <p>{{ errorMessage }}</p>
    </div>

    <div v-if="successMessage" class="success-message">
      <h4>¡Éxito!</h4>
      <p>{{ successMessage }}</p>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { createClient } from '@supabase/supabase-js'

export default {
  name: 'ConnectionTest',
  setup() {
    const isLoading = ref(false)
    const connectionStatus = ref('disconnected')
    const errorMessage = ref('')
    const successMessage = ref('')
    const usuarios = ref([])

    // Importar variables de entorno
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    // Enmascarar la clave API para mostrar solo los primeros y últimos caracteres
    const maskedApiKey = computed(() => {
      if (!supabaseAnonKey) return 'No disponible'
      return `${supabaseAnonKey.substring(0, 10)}...${supabaseAnonKey.substring(supabaseAnonKey.length - 10)}`
    })

    const statusText = computed(() => {
      switch (connectionStatus.value) {
        case 'connected':
          return 'Conectado'
        case 'connecting':
          return 'Conectando...'
        case 'error':
          return 'Error de Conexión'
        default:
          return 'Desconectado'
      }
    })

    const testConnection = async () => {
      isLoading.value = true
      connectionStatus.value = 'connecting'
      errorMessage.value = ''
      successMessage.value = ''

      try {
        // Verificar que las variables de entorno estén disponibles
        if (!supabaseUrl || !supabaseAnonKey) {
          throw new Error('Variables de entorno de Supabase no configuradas correctamente')
        }

        // Crear cliente de Supabase
        const supabase = createClient(supabaseUrl, supabaseAnonKey)

        // Intentar obtener información básica del proyecto
        // Esto es una prueba simple que no requiere datos específicos
        const { data, error } = await supabase
          .from('_supabase_migrations')
          .select('version')
          .limit(1)

        if (error) {
          // Si no hay tabla de migraciones, intentar otra consulta simple
          const { error: healthError } = await supabase
            .from('pg_stat_activity')
            .select('*')
            .limit(1)

          if (healthError) {
            throw new Error(`Error de conexión: ${error.message}`)
          }
        }

        connectionStatus.value = 'connected'
        successMessage.value = '¡Conexión exitosa con Supabase! El cliente se ha configurado correctamente.'
        
      } catch (error) {
        connectionStatus.value = 'error'
        errorMessage.value = error.message
        console.error('Error de conexión:', error)
      } finally {
        isLoading.value = false
      }
    }

    const fetchUsuarios = async () => {
      isLoading.value = true
      errorMessage.value = ''
      successMessage.value = ''

      try {
        // Verificar que las variables de entorno estén disponibles
        if (!supabaseUrl || !supabaseAnonKey) {
          throw new Error('Variables de entorno de Supabase no configuradas correctamente')
        }

        // Crear cliente de Supabase
        const supabase = createClient(supabaseUrl, supabaseAnonKey)

        // Consultar la tabla usuarios
        const { data, error } = await supabase
          .from('usuarios')
          .select('*')

        if (error) {
          throw new Error(`Error al consultar la tabla usuarios: ${error.message}`)
        }

        usuarios.value = data || []
        connectionStatus.value = 'connected'
        successMessage.value = `¡Consulta exitosa! Se obtuvieron ${usuarios.value.length} registros de la tabla usuarios.`
        
        console.log('Datos obtenidos:', data)
        
      } catch (error) {
        connectionStatus.value = 'error'
        errorMessage.value = error.message
        console.error('Error al consultar usuarios:', error)
      } finally {
        isLoading.value = false
      }
    }

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A'
      try {
        return new Date(dateString).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      } catch {
        return dateString
      }
    }

    // Probar conexión automáticamente al montar el componente
    onMounted(() => {
      testConnection()
    })

    return {
      isLoading,
      connectionStatus,
      errorMessage,
      successMessage,
      supabaseUrl,
      maskedApiKey,
      statusText,
      usuarios,
      testConnection,
      fetchUsuarios,
      formatDate
    }
  }
}
</script>

<style scoped>
.connection-test {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.connection-test h2 {
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 24px;
}

.status-section {
  margin-bottom: 30px;
}

.status-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 18px;
}

.status-indicator.connected {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-indicator.connecting {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.status-indicator.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.status-indicator.disconnected {
  background-color: #e2e3e5;
  color: #383d41;
  border: 1px solid #d6d8db;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: currentColor;
}

.info-section {
  margin-bottom: 30px;
}

.info-section h3 {
  color: #495057;
  margin-bottom: 20px;
  font-size: 18px;
}

.info-grid {
  display: grid;
  gap: 15px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  text-align: left;
}

.info-item label {
  font-weight: bold;
  color: #6c757d;
  font-size: 14px;
}

.info-value {
  font-family: 'Courier New', monospace;
  background-color: #e9ecef;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  word-break: break-all;
}

.actions {
  margin-bottom: 20px;
}

.test-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.test-button:hover:not(:disabled) {
  background-color: #0056b3;
}

.test-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.test-button.secondary {
  background-color: #28a745;
  margin-left: 10px;
}

.test-button.secondary:hover:not(:disabled) {
  background-color: #218838;
}

.data-section {
  margin-top: 30px;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.data-section h3 {
  color: #2c3e50;
  margin-bottom: 15px;
  font-size: 18px;
}

.data-info {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #e9ecef;
  border-radius: 4px;
}

.data-info p {
  margin: 0;
  font-weight: bold;
  color: #495057;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.data-table th,
.data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
}

.data-table th {
  background-color: #f8f9fa;
  font-weight: bold;
  color: #495057;
}

.data-table tr:hover {
  background-color: #f8f9fa;
}

.data-table td {
  font-size: 14px;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
}

.status-badge.activo {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.inactivo {
  background-color: #f8d7da;
  color: #721c24;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  padding: 15px;
  margin-top: 20px;
}

.error-message h4 {
  margin: 0 0 10px 0;
  font-size: 16px;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 6px;
  padding: 15px;
  margin-top: 20px;
}

.success-message h4 {
  margin: 0 0 10px 0;
  font-size: 16px;
}
</style>
