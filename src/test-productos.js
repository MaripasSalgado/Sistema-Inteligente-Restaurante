// Script de prueba para verificar la funcionalidad de productos
import { ProductoService } from './services/productoService.js'
import { CategoriaProductoService } from './services/categoriaProductoService.js'
import { RecetaService } from './services/recetaService.js'

async function testProductosModule() {
  console.log('🧪 INICIANDO PRUEBAS DEL MÓDULO DE PRODUCTOS...')
  
  try {
    // 1. Probar carga de categorías
    console.log('\n📂 Probando carga de categorías...')
    const categoriasResult = await CategoriaProductoService.getAllCategorias({ activa: true })
    if (categoriasResult.success) {
      console.log('✅ Categorías cargadas:', categoriasResult.data?.length || 0)
    } else {
      console.error('❌ Error al cargar categorías:', categoriasResult.error)
    }

    // 2. Probar carga de recetas
    console.log('\n📋 Probando carga de recetas...')
    const recetasResult = await RecetaService.getAllRecetas({ activa: true })
    if (recetasResult.success) {
      console.log('✅ Recetas cargadas:', recetasResult.data?.length || 0)
    } else {
      console.error('❌ Error al cargar recetas:', recetasResult.error)
    }

    // 3. Probar carga de productos
    console.log('\n📦 Probando carga de productos...')
    const productosResult = await ProductoService.getAllProductos({ activo: true })
    if (productosResult.success) {
      console.log('✅ Productos cargados:', productosResult.data?.length || 0)
      
      // Mostrar algunos detalles de los productos
      if (productosResult.data && productosResult.data.length > 0) {
        console.log('📋 Ejemplo de producto:', {
          id: productosResult.data[0].id,
          nombre: productosResult.data[0].nombre,
          categoria: productosResult.data[0].categoria?.nombre,
          precio_venta: productosResult.data[0].precio_venta,
          recetas_count: productosResult.data[0].recetas?.length || 0
        })
      }
    } else {
      console.error('❌ Error al cargar productos:', productosResult.error)
    }

    // 4. Probar creación de categoría de prueba
    console.log('\n➕ Probando creación de categoría...')
    const nuevaCategoria = {
      nombre: 'Categoría de Prueba',
      descripcion: 'Categoría creada para pruebas',
      color: '#FF6B6B',
      icono: '🧪',
      activa: true,
      creado_por: 'test-user-id'
    }
    
    const categoriaCreada = await CategoriaProductoService.createCategoria(nuevaCategoria)
    if (categoriaCreada.success) {
      console.log('✅ Categoría creada:', categoriaCreada.data)
      
      // Limpiar: eliminar la categoría de prueba
      await CategoriaProductoService.deleteCategoria(categoriaCreada.data.id, 'test-user-id')
      console.log('🧹 Categoría de prueba eliminada')
    } else {
      console.error('❌ Error al crear categoría:', categoriaCreada.error)
    }

    console.log('\n🎉 PRUEBAS COMPLETADAS')
    
  } catch (error) {
    console.error('❌ ERROR EN PRUEBAS:', error)
  }
}

// Exportar para poder ejecutar en la consola del navegador
window.testProductosModule = testProductosModule

console.log('🧪 Script de pruebas cargado. Ejecuta window.testProductosModule() para iniciar pruebas')