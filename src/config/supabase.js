import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variables de entorno de Supabase no configuradas correctamente')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const testConnection = async () => {
  try {
    const { data, error } = await supabase.auth.getSession()
    return !error
  } catch (error) {
    return false
  }
}

export const testUsuariosQuery = async () => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
    
    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

export { supabase }
export default supabase