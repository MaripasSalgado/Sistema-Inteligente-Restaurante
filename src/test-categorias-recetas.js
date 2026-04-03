import { CategoriaRecetaService } from './services/categoriaRecetaService.js'
import { supabase } from './config/supabase.js'

async function testCategoriasRecetas() {
  // 1. Verificar conexión a Supabase
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

  if (sessionError) {
    console.error('❌ Error de sesión:', sessionError)
    return
  }
  const userId = sessionData?.session?.user?.id
  // 2. Intentar leer categorías existentes
  const resultCategorias = await CategoriaRecetaService.getAllCategorias()

  if (resultCategorias.success) {
    if (resultCategorias.data && resultCategorias.data.length > 0) {
    }
  } else {
    console.error('❌ Error al leer categorías:', resultCategorias.error)
  }
  // 3. Verificar que la tabla existe
  const { data: tableData, error: tableError } = await supabase
    .from('categorias_recetas')
    .select('*')
    .limit(1)

  if (tableError) {
    console.error('❌ Error al acceder a la tabla:', tableError)
  } else {
  }
  // 4. Intentar crear una categoría de prueba (solo si hay usuario)
  if (userId) {
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
      // Intentar eliminarla para limpiar
      const resultEliminar = await CategoriaRecetaService.deleteCategoria(resultCrear.data.id)

      if (resultEliminar.success) {
      } else {
        console.error('❌ Error al eliminar categoría:', resultEliminar.error)
      }
    } else {
      console.error('❌ Error al crear categoría:', resultCrear.error)
    }
  } else {
  }
}

// Ejecutar el test
testCategoriasRecetas().catch(console.error)
