import { supabase, testConnection, testUsuariosQuery } from '@/config/supabase'

// Función para probar conexión básica
export const probarConexion = async () => {
  console.log('Probando conexión básica...')
  const conectado = await testConnection()
  console.log('Conexión:', conectado ? 'OK' : 'ERROR')
  return conectado
}

// Función para consultar usuarios
export const consultarUsuarios = async () => {
  console.log('Consultando tabla usuarios...')
  const { data, error } = await testUsuariosQuery()
  
  if (error) {
    console.log('Error:', error.message)
    return null
  }
  
  console.log('Usuarios encontrados:', data ? data.length : 0)
  console.log('Datos:', data)
  return data
}

// Función para probar query directo
export const queryDirecto = async () => {
  console.log('Query directo a usuarios...')
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
    
    if (error) {
      console.log('Error en query directo:', error.message)
      return null
    }
    
    console.log('Query directo exitoso, registros:', data ? data.length : 0)
    console.log('Datos del query directo:', data)
    return data
  } catch (error) {
    console.log('Error inesperado en query directo:', error.message)
    return null
  }
}

// Función para probar todo
export const probarTodo = async () => {
  console.log('=== INICIANDO PRUEBAS ===')
  
  // 1. Probar conexión
  const conectado = await probarConexion()
  if (!conectado) {
    console.log('No se puede continuar sin conexión')
    return
  }
  
  // 2. Consultar usuarios con función
  await consultarUsuarios()
  
  // 3. Query directo
  await queryDirecto()
  
  console.log('=== PRUEBAS COMPLETADAS ===')
}
