import { supabase } from '@/config/supabase'
import { StorageService } from '@/services/storageService'

// Función para probar la configuración de Storage
export const testStorageConfig = async () => {
  try {
    // 1. Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      console.error('❌ Usuario no autenticado:', authError)
      return false
    }
    // 2. Verificar bucket
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    if (bucketsError) {
      console.error('❌ Error listando buckets:', bucketsError)
      return false
    }
    
    const fotosBucket = buckets.find(b => b.id === 'fotos_perfil')
    if (!fotosBucket) {
      console.error('❌ Bucket "fotos_perfil" no encontrado')
      return false
    }
    // 3. Probar listar archivos (para verificar permisos)
    const { data: files, error: listError } = await supabase.storage
      .from('fotos_perfil')
      .list('', { limit: 1 })
    
    if (listError) {
      console.error('❌ Error listando archivos:', listError)
      return false
    }
    // 4. Crear un archivo de prueba pequeño
    const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' })
    const testPath = `${user.id}/test-${Date.now()}.txt`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('fotos_perfil')
      .upload(testPath, testFile)
    
    if (uploadError) {
      console.error('❌ Error subiendo archivo de prueba:', uploadError)
      return false
    }
    // 5. Eliminar archivo de prueba
    const { error: deleteError } = await supabase.storage
      .from('fotos_perfil')
      .remove([testPath])
    
    if (deleteError) {
      console.warn('⚠️ Error eliminando archivo de prueba:', deleteError)
    } else {
    }
    return true

  } catch (error) {
    console.error('💥 Error inesperado:', error)
    return false
  }
}

// Función para probar subir una imagen real
export const testImageUpload = async (file) => {
  try {
    const result = await StorageService.uploadFoto(file, 'fotos_perfil')
    
    if (result.error) {
      console.error('❌ Error subiendo imagen:', result.error)
      return false
    }
    return true
    
  } catch (error) {
    console.error('💥 Error inesperado:', error)
    return false
  }
}
