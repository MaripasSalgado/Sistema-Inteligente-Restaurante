import { CategoriaRecetaService } from './services/categoriaRecetaService.js'
import { supabase } from './config/supabase.js'

async function testCategoriasRecetas() {
  console.log('=== TEST CATEGORÍAS RECETAS ===\n')

  // 1. Verificar conexión a Supabase
  console.log('1. Verificando conexión a Supabase...')
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

  if (sessionError) {
    console.error('❌ Error de sesión:', sessionError)
    return
  }

  console.log('✅ Sesión activa:', sessionData?.session?.user?.id || 'No hay usuario logueado')
  const userId = sessionData?.session?.user?.id
  console.log('\n')

  // 2. Intentar leer categorías existentes
  console.log('2. Leyendo categorías existentes...')
  const resultCategorias = await CategoriaRecetaService.getAllCategorias()

  if (resultCategorias.success) {
    console.log('✅ Categorías encontradas:', resultCategorias.data?.length || 0)
    if (resultCategorias.data && resultCategorias.data.length > 0) {
      console.log('Primera categoría:', resultCategorias.data[0])
    }
  } else {
    console.error('❌ Error al leer categorías:', resultCategorias.error)
  }
  console.log('\n')

  // 3. Verificar que la tabla existe
  console.log('3. Verificando que la tabla categorias_recetas existe...')
  const { data: tableData, error: tableError } = await supabase
    .from('categorias_recetas')
    .select('*')
    .limit(1)

  if (tableError) {
    console.error('❌ Error al acceder a la tabla:', tableError)
  } else {
    console.log('✅ Tabla accesible')
  }
  console.log('\n')

  // 4. Intentar crear una categoría de prueba (solo si hay usuario)
  if (userId) {
    console.log('4. Intentando crear categoría de prueba...')
    const categoriaTest = {
      nombre: `Categoría Test ${Date.now()}`,
      descripcion: 'Categoría de prueba creada desde script',
      color: '#3B82F6',
      icono: '🥟',
      activa: true,
      creado_por: userId
    }

    const resultCrear = await CategoriaRecetaService.createCategoria(categoriaTest)

    if (resultCrear.success) {
      console.log('✅ Categoría creada exitosamente:', resultCrear.data)

      // Intentar eliminarla para limpiar
      console.log('\n5. Limpiando categoría de prueba...')
      const resultEliminar = await CategoriaRecetaService.deleteCategoria(resultCrear.data.id)

      if (resultEliminar.success) {
        console.log('✅ Categoría eliminada exitosamente')
      } else {
        console.error('❌ Error al eliminar categoría:', resultEliminar.error)
      }
    } else {
      console.error('❌ Error al crear categoría:', resultCrear.error)
    }
  } else {
    console.log('4. ⚠️ No hay usuario logueado, saltando prueba de creación')
    console.log('   Para crear categorías necesitas estar autenticado')
  }

  console.log('\n=== FIN DEL TEST ===')
}

// Ejecutar el test
testCategoriasRecetas().catch(console.error)
