<template>
  <div class="test-auth-page">
    <div class="container">
      <div class="header">
        <h1>🧪 Prueba de Autenticación</h1>
        <p>Página de prueba para verificar el funcionamiento de Supabase y la autenticación</p>
      </div>

      <div class="test-container">
        <AuthTest />
      </div>

      <div class="info-section">
        <h3>📋 Información de Debug</h3>
        <div class="info-grid">
          <div class="info-item">
            <label>URL de Supabase:</label>
            <span class="info-value">{{ supabaseUrl || 'No configurada' }}</span>
          </div>
          <div class="info-item">
            <label>Clave API:</label>
            <span class="info-value">{{ maskedApiKey }}</span>
          </div>
          <div class="info-item">
            <label>Modo Debug:</label>
            <span class="info-value">{{ debugMode ? 'Activado' : 'Desactivado' }}</span>
          </div>
        </div>
      </div>

      <div class="instructions">
        <h3>📖 Instrucciones</h3>
        <ol>
          <li>Verifica que las variables de entorno estén configuradas correctamente</li>
          <li>Haz clic en "Probar Conexión" para verificar la conexión con Supabase</li>
          <li>Usa el formulario de login para probar la autenticación</li>
          <li>Revisa los logs de debug en la parte inferior</li>
          <li>Si hay errores, revisa la consola del navegador</li>
        </ol>
      </div>

      <div class="navigation">
        <router-link to="/login" class="nav-link">
          ← Volver al Login Principal
        </router-link>
        <router-link to="/" class="nav-link">
          🏠 Ir al Dashboard
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import AuthTest from '@/components/AuthTest.vue'

export default {
  name: 'TestAuth',
  components: {
    AuthTest
  },
  setup() {
    // Variables de entorno
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    const debugMode = import.meta.env.VITE_DEBUG === 'true'

    // Enmascarar la clave API
    const maskedApiKey = computed(() => {
      if (!supabaseAnonKey) return 'No configurada'
      return `${supabaseAnonKey.substring(0, 10)}...${supabaseAnonKey.substring(supabaseAnonKey.length - 10)}`
    })

    return {
      supabaseUrl,
      maskedApiKey,
      debugMode
    }
  }
}
</script>

<style scoped>
.test-auth-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 30px;
  color: white;
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.header p {
  font-size: 1.1rem;
  opacity: 0.9;
}

.test-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  margin-bottom: 30px;
  overflow: hidden;
}

.info-section {
  background: white;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.info-section h3 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.3rem;
}

.info-grid {
  display: grid;
  gap: 15px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.info-item label {
  font-weight: bold;
  color: #6c757d;
  font-size: 14px;
}

.info-value {
  font-family: 'Courier New', monospace;
  background-color: #f8f9fa;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  word-break: break-all;
  border: 1px solid #e9ecef;
}

.instructions {
  background: white;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.instructions h3 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.3rem;
}

.instructions ol {
  color: #495057;
  line-height: 1.6;
}

.instructions li {
  margin-bottom: 8px;
}

.navigation {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: white;
  color: #495057;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.nav-link:hover {
  background: #f8f9fa;
  color: #2c3e50;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

/* Responsive */
@media (max-width: 768px) {
  .test-auth-page {
    padding: 10px;
  }
  
  .header h1 {
    font-size: 2rem;
  }
  
  .navigation {
    flex-direction: column;
    align-items: center;
  }
  
  .nav-link {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }
}
</style>
