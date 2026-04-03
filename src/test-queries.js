import { supabase, testConnection, testUsuariosQuery } from '@/config/supabase'

// Función para probar conexión básica
export const probarConexion = async () => {
  const conectado = await testConnection()
  return conectado
}

// Función para consultar usuarios
export const consultarUsuarios = async () => {
  const { data, error } = await testUsuariosQuery()
  
  if (error) {
    return null
  }
  return data
}

// Función para probar query directo
export const queryDirecto = async () => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
    
    if (error) {
      return null
    }
    return data
  } catch (error) {
    return null
  }
}

// Función para probar todo
export const probarTodo = async () => {
  // 1. Probar conexión
  const conectado = await probarConexion()
  if (!conectado) {
    return
  }
  
  // 2. Consultar usuarios con función
  await consultarUsuarios()
  
  // 3. Query directo
  await queryDirecto()
}
