// Script de prueba para verificar la funcionalidad de productos
import { ProductoService } from './services/productoService.js'
import { CategoriaProductoService } from './services/categoriaProductoService.js'
import { RecetaService } from './services/recetaService.js'

async function testProductosModule() {
  try {
    // 1. Probar carga de categorías
    const categoriasResult = await CategoriaProductoService.getAllCategorias({ activa: true })
    if (categoriasResult.success) {
    } else {
      console.error('❌ Error al cargar categorías:', categoriasResult.error)
    }

    // 2. Probar carga de recetas
    const recetasResult = await RecetaService.getAllRecetas({ activa: true })
    if (recetasResult.success) {
    } else {
      console.error('❌ Error al cargar recetas:', recetasResult.error)
    }

    // 3. Probar carga de productos
    const productosResult = await ProductoService.getAllProductos({ activo: true })
    if (productosResult.success) {
      // Mostrar algunos detalles de los productos
      if (productosResult.data && productosResult.data.length > 0) {
      }
    } else {
      console.error('❌ Error al cargar productos:', productosResult.error)
    }

    // 4. Probar creación de categoría de prueba
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
      // Limpiar: eliminar la categoría de prueba
      await CategoriaProductoService.deleteCategoria(categoriaCreada.data.id, 'test-user-id')
    } else {
      console.error('❌ Error al crear categoría:', categoriaCreada.error)
    }
  } catch (error) {
    console.error('❌ ERROR EN PRUEBAS:', error)
  }
}

// Exportar para poder ejecutar en la consola del navegador
window.testProductosModule = testProductosModule
