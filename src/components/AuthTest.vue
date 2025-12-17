<template>
  <div class="auth-test">
    <h2>🧪 Prueba de Autenticación</h2>
    
    <!-- Estado de conexión -->
    <div class="status-section">
      <div class="status-indicator" :class="connectionStatus">
        <span class="status-dot"></span>
        <span class="status-text">{{ statusText }}</span>
      </div>
    </div>

    <!-- Información del usuario -->
    <div v-if="user" class="user-info">
      <h3>👤 Usuario Autenticado</h3>
      <div class="user-details">
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>ID:</strong> {{ user.id }}</p>
        <p><strong>Última conexión:</strong> {{ formatDate(user.last_sign_in_at) }}</p>
      </div>
    </div>

    <!-- Formulario de login -->
    <div v-if="!user" class="login-form">
      <h3>🔐 Iniciar Sesión</h3>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email:</label>
          <input 
            id="email"
            v-model="loginForm.email" 
            type="email" 
            required 
            placeholder="tu@email.com"
            :disabled="isLoading"
          />
        </div>
        <div class="form-group">
          <label for="password">Contraseña:</label>
          <input 
            id="password"
            v-model="loginForm.password" 
            type="password" 
            required 
            placeholder="Tu contraseña"
            :disabled="isLoading"
          />
        </div>
        <button type="submit" :disabled="isLoading" class="login-btn">
          {{ isLoading ? 'Iniciando...' : 'Iniciar Sesión' }}
        </button>
      </form>
    </div>

    <!-- Botones de acción -->
    <div v-if="user" class="actions">
      <button @click="handleLogout" :disabled="isLoading" class="logout-btn">
        {{ isLoading ? 'Cerrando...' : 'Cerrar Sesión' }}
      </button>
      <button @click="testConnection" :disabled="isLoading" class="test-btn">
        Probar Conexión
      </button>
      <button @click="fetchUsuarios" :disabled="isLoading" class="test-btn">
        {{ isLoading ? 'Cargando...' : 'Consultar Usuarios' }}
      </button>
    </div>

    <!-- Botones de acción sin usuario -->
    <div v-else class="actions">
      <button @click="testConnection" :disabled="isLoading" class="test-btn">
        Probar Conexión
      </button>
      <button @click="fetchUsuarios" :disabled="isLoading" class="test-btn">
        {{ isLoading ? 'Cargando...' : 'Consultar Usuarios' }}
      </button>
    </div>

    <!-- Mensajes -->
    <div v-if="message" class="message" :class="messageType">
      <h4>{{ messageType === 'error' ? '❌ Error' : '✅ Éxito' }}</h4>
      <p>{{ message }}</p>
    </div>

    <!-- Datos de usuarios -->
    <div v-if="usuarios.length > 0" class="usuarios-section">
      <h3>👥 Datos de la Tabla Usuarios</h3>
      <div class="usuarios-info">
        <p><strong>Total de registros:</strong> {{ usuarios.length }}</p>
      </div>
      <div class="table-container">
        <table class="usuarios-table">
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

    <!-- Logs de debug -->
    <div v-if="debugLogs.length > 0" class="debug-logs">
      <h4>🔍 Logs de Debug</h4>
      <div class="logs-container">
        <div v-for="(log, index) in debugLogs" :key="index" class="log-item" :class="log.type">
          <span class="log-time">{{ log.time }}</span>
          <span class="log-message">{{ log.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { AuthService } from '@/services/authService'
import { testConnection } from '@/config/supabase'

export default {
  name: 'AuthTest',
  setup() {
    // Estados
    const user = ref(null)
    const isLoading = ref(false)
    const connectionStatus = ref('disconnected')
    const message = ref('')
    const messageType = ref('')
    const debugLogs = ref([])
    const usuarios = ref([])

    // Formulario
    const loginForm = ref({
      email: '',
      password: ''
    })

    // Computed
    const statusText = computed(() => {
      switch (connectionStatus.value) {
        case 'connected': return 'Conectado'
        case 'connecting': return 'Conectando...'
        case 'error': return 'Error de Conexión'
        default: return 'Desconectado'
      }
    })

    // Funciones de debug
    const addDebugLog = (msg, type = 'info') => {
      debugLogs.value.unshift({
        message: msg,
        type,
        time: new Date().toLocaleTimeString()
      })
      // Mantener solo los últimos 10 logs
      if (debugLogs.value.length > 10) {
        debugLogs.value = debugLogs.value.slice(0, 10)
      }
    }

    const showMessage = (msg, type) => {
      message.value = msg
      messageType.value = type
      setTimeout(() => {
        message.value = ''
        messageType.value = ''
      }, 5000)
    }

    // Funciones principales
    const handleLogin = async () => {
      isLoading.value = true
      connectionStatus.value = 'connecting'
      addDebugLog('Iniciando proceso de login...', 'info')
      
      try {
        const { user: loggedUser, error } = await AuthService.signIn(
          loginForm.value.email,
          loginForm.value.password
        )

        if (error) {
          addDebugLog(`Error en login: ${error}`, 'error')
          showMessage(`Error: ${error}`, 'error')
          connectionStatus.value = 'error'
        } else {
          addDebugLog('Login exitoso!', 'success')
          user.value = loggedUser
          showMessage('¡Login exitoso!', 'success')
          connectionStatus.value = 'connected'
          loginForm.value = { email: '', password: '' }
        }
      } catch (error) {
        addDebugLog(`Error inesperado: ${error.message}`, 'error')
        showMessage(`Error inesperado: ${error.message}`, 'error')
        connectionStatus.value = 'error'
      } finally {
        isLoading.value = false
      }
    }

    const handleLogout = async () => {
      isLoading.value = true
      addDebugLog('Iniciando proceso de logout...', 'info')
      
      try {
        const { error } = await AuthService.signOut()

        if (error) {
          addDebugLog(`Error en logout: ${error}`, 'error')
          showMessage(`Error: ${error}`, 'error')
        } else {
          addDebugLog('Logout exitoso!', 'success')
          user.value = null
          showMessage('¡Sesión cerrada correctamente!', 'success')
          connectionStatus.value = 'disconnected'
        }
      } catch (error) {
        addDebugLog(`Error inesperado: ${error.message}`, 'error')
        showMessage(`Error inesperado: ${error.message}`, 'error')
      } finally {
        isLoading.value = false
      }
    }

    const testConnection = async () => {
      isLoading.value = true
      connectionStatus.value = 'connecting'
      addDebugLog('Probando conexión con Supabase...', 'info')
      
      try {
        const isConnected = await testConnection()
        
        if (isConnected) {
          addDebugLog('Conexión exitosa!', 'success')
          showMessage('¡Conexión exitosa con Supabase!', 'success')
          connectionStatus.value = 'connected'
        } else {
          addDebugLog('Error de conexión', 'error')
          showMessage('Error de conexión con Supabase', 'error')
          connectionStatus.value = 'error'
        }
      } catch (error) {
        addDebugLog(`Error: ${error.message}`, 'error')
        showMessage(`Error: ${error.message}`, 'error')
        connectionStatus.value = 'error'
      } finally {
        isLoading.value = false
      }
    }

    const fetchUsuarios = async () => {
      isLoading.value = true
      addDebugLog('Consultando tabla usuarios...', 'info')
      
      try {
        const { testUsuariosQuery } = await import('@/config/supabase')
        const { data, error } = await testUsuariosQuery()
        
        if (error) {
          addDebugLog(`Error consultando usuarios: ${error.message}`, 'error')
          showMessage(`Error consultando usuarios: ${error.message}`, 'error')
        } else {
          usuarios.value = data || []
          addDebugLog(`Consulta exitosa! ${usuarios.value.length} registros obtenidos`, 'success')
          showMessage(`¡Consulta exitosa! Se obtuvieron ${usuarios.value.length} registros`, 'success')
        }
      } catch (error) {
        addDebugLog(`Error inesperado: ${error.message}`, 'error')
        showMessage(`Error inesperado: ${error.message}`, 'error')
      } finally {
        isLoading.value = false
      }
    }

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A'
      try {
        return new Date(dateString).toLocaleString('es-ES')
      } catch {
        return dateString
      }
    }

    // Verificar usuario actual al montar
    onMounted(async () => {
      addDebugLog('Verificando usuario actual...', 'info')
      try {
        const { user: currentUser } = await AuthService.getCurrentUser()
        if (currentUser) {
          user.value = currentUser
          connectionStatus.value = 'connected'
          addDebugLog('Usuario ya autenticado', 'success')
        } else {
          addDebugLog('No hay usuario autenticado', 'info')
        }
      } catch (error) {
        addDebugLog(`Error verificando usuario: ${error.message}`, 'error')
      }
    })

    return {
      user,
      isLoading,
      connectionStatus,
      message,
      messageType,
      debugLogs,
      usuarios,
      loginForm,
      statusText,
      handleLogin,
      handleLogout,
      testConnection,
      fetchUsuarios,
      formatDate
    }
  }
}
</script>

<style scoped>
.auth-test {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.auth-test h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
}

.status-section {
  margin-bottom: 20px;
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

.user-info, .login-form {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.user-info h3, .login-form h3 {
  color: #2c3e50;
  margin-bottom: 15px;
}

.user-details p {
  margin: 8px 0;
  color: #495057;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #495057;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 16px;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.login-btn, .logout-btn, .test-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-btn {
  background-color: #007bff;
  color: white;
}

.login-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.logout-btn {
  background-color: #dc3545;
  color: white;
}

.logout-btn:hover:not(:disabled) {
  background-color: #c82333;
}

.test-btn {
  background-color: #28a745;
  color: white;
}

.test-btn:hover:not(:disabled) {
  background-color: #218838;
}

button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.message {
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.debug-logs {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.debug-logs h4 {
  color: #2c3e50;
  margin-bottom: 15px;
}

.logs-container {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 10px;
  background: #f8f9fa;
}

.log-item {
  display: flex;
  gap: 10px;
  padding: 5px 0;
  border-bottom: 1px solid #e9ecef;
  font-family: 'Courier New', monospace;
  font-size: 14px;
}

.log-item:last-child {
  border-bottom: none;
}

.log-time {
  color: #6c757d;
  font-weight: bold;
  min-width: 80px;
}

.log-message {
  flex: 1;
}

.log-item.info .log-message {
  color: #495057;
}

.log-item.success .log-message {
  color: #155724;
}

.log-item.error .log-message {
  color: #721c24;
}

/* Estilos para la sección de usuarios */
.usuarios-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.usuarios-section h3 {
  color: #2c3e50;
  margin-bottom: 15px;
  font-size: 18px;
}

.usuarios-info {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #e9ecef;
  border-radius: 4px;
}

.usuarios-info p {
  margin: 0;
  font-weight: bold;
  color: #495057;
}

.table-container {
  overflow-x: auto;
}

.usuarios-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.usuarios-table th,
.usuarios-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
  font-size: 14px;
}

.usuarios-table th {
  background-color: #f8f9fa;
  font-weight: bold;
  color: #495057;
}

.usuarios-table tr:hover {
  background-color: #f8f9fa;
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
</style>
