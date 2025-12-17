<template>
  <div class="flex h-screen overflow-hidden productos-page">

    <!-- Sidebar -->
    <Sidebar :sidebarOpen="sidebarOpen" @close-sidebar="sidebarOpen = false" />

    <!-- Content area -->
    <div class="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
      
      <!-- Site header -->
      <Header :sidebarOpen="sidebarOpen" @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <main class="grow">
        <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

          <!-- Dashboard actions -->
          <div class="sm:flex sm:justify-between sm:items-center mb-8">
            <!-- Left: Title -->
            <div class="mb-4 sm:mb-0">
              <h1 class="text-2xl md:text-3xl text-gray-100 font-bold">Productos</h1>
              <p class="text-gray-400 mt-1">Gestión de productos del menú (combinaciones de recetas)</p>
            </div>

            <!-- Right: Actions -->
            <div class="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
              <button
                @click="abrirFormularioCrear"
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-black bg-yellow-400 hover:bg-yellow-500 rounded-lg transition-colors border-0"
              >
                <svg class="w-4 h-4 fill-current shrink-0" viewBox="0 0 16 16">
                  <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                </svg>
                <span class="hidden xs:block ml-2">Nuevo Producto</span>
              </button>
            </div>
          </div>

          <!-- Tabs -->
          <div class="mb-8">
            <div class="border-b border-gray-700">
              <nav class="-mb-px flex space-x-8">
                <button
                  v-for="tab in tabs"
                  :key="tab.id"
                  @click="tabActivo = tab.id"
                  class="py-2 px-1 border-b-2 font-medium text-sm"
                  :class="tabActivo === tab.id ? 'border-violet-500 text-amber-500' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-zinc-700/50'"
                >
                  {{ tab.nombre }}
                </button>
              </nav>
            </div>
          </div>

          <!-- Dashboard -->
          <div v-if="tabActivo === 'dashboard'" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div style="background-color: rgb(24 24 27 / 0.8);" class="border border-zinc-700/50 rounded-lg p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span class="text-black font-bold">🍽️</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-300">Total Productos</p>
                    <p class="text-2xl font-bold text-white">{{ estadisticas.totalProductos }}</p>
                  </div>
                </div>
              </div>

              <div style="background-color: rgb(24 24 27 / 0.8);" class="border border-zinc-700/50 rounded-lg p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span class="text-black font-bold">💰</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-300">Más Vendido</p>
                    <p class="text-lg font-bold text-white">{{ estadisticas.masVendido }}</p>
                  </div>
                </div>
              </div>

              <div style="background-color: rgb(24 24 27 / 0.8);" class="border border-zinc-700/50 rounded-lg p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span class="text-black font-bold">📈</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-300">Mejor Margen</p>
                    <p class="text-lg font-bold text-white">{{ estadisticas.mejorMargen }}</p>
                  </div>
                </div>
              </div>

              <div style="background-color: rgb(24 24 27 / 0.8);" class="border border-zinc-700/50 rounded-lg p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span class="text-black font-bold">📊</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-300">Promedio Margen</p>
                    <p class="text-lg font-bold text-white">{{ estadisticas.promedioMargen }}%</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Productos Recientes -->
            <div style="background-color: rgb(24 24 27 / 0.8);" class="border border-zinc-700/50 rounded-lg p-6">
              <h3 class="text-lg font-medium text-white mb-4">Productos Recientes</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
                  v-for="producto in productosRecientes"
                  :key="producto.id"
                  style="background-color: rgb(39 39 42);"
                  class="border border-zinc-700/50 rounded-lg p-4 hover:border-yellow-400 transition-colors cursor-pointer"
                  @click="verProducto(producto)"
                >
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="text-sm font-medium text-white">{{ producto.nombre }}</h4>
                    <span class="text-xs text-gray-300">{{ producto.categoria?.nombre || 'Sin categoría' }}</span>
                  </div>
                  <div class="flex items-center justify-between text-xs text-gray-400">
                    <span>₡{{ producto.precio_venta }}</span>
                    <span>{{ producto.recetas?.length || 0 }} recetas</span>
                  </div>
                  <div class="flex items-center mt-2">
                    <div class="flex text-yellow-400">
                      <span class="text-xs">{{ producto.margen_ganancia }}% margen</span>
                    </div>
                    <span class="text-xs text-gray-400 ml-2">{{ producto.ventas_registradas || 0 }} ventas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Lista de Productos -->
          <div v-if="tabActivo === 'lista'" class="space-y-6">
            <ProductosList
              :productos="productos"
              :categorias="categorias"
              @editar-producto="editarProducto"
              @ver-producto="verProducto"
              @eliminar-producto="eliminarProducto"
              @duplicar-producto="duplicarProducto"
            />
          </div>

          <!-- Categorías -->
          <div v-if="tabActivo === 'categorias'" class="space-y-6">
            <CategoriasManager
              :categorias="categorias"
              :productos="productos"
              @crear-categoria="crearCategoria"
              @editar-categoria="editarCategoria"
              @eliminar-categoria="eliminarCategoria"
            />
          </div>

          <!-- Análisis -->
          <div v-if="tabActivo === 'analisis'" class="space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div style="background-color: rgb(24 24 27 / 0.8);" class="border border-zinc-700/50 rounded-lg p-6">
                <h3 class="text-lg font-medium text-white mb-4">Productos por Categoría</h3>
                <div class="space-y-3">
                  <div
                    v-for="cat in estadisticasPorCategoria"
                    :key="cat.id"
                    class="flex items-center justify-between"
                  >
                    <div class="flex items-center">
                      <div class="w-4 h-4 rounded-full mr-3" :style="{ backgroundColor: cat.color }"></div>
                      <span class="text-white">{{ cat.nombre }}</span>
                    </div>
                    <span class="text-gray-300">{{ cat.cantidad }}</span>
                  </div>
                </div>
              </div>

              <div style="background-color: rgb(24 24 27 / 0.8);" class="border border-zinc-700/50 rounded-lg p-6">
                <h3 class="text-lg font-medium text-white mb-4">Top 5 Más Rentables</h3>
                <div class="space-y-3">
                  <div
                    v-for="(producto, index) in topProductos"
                    :key="producto.id"
                    class="flex items-center justify-between"
                  >
                    <div class="flex items-center">
                      <span class="text-yellow-400 font-bold mr-2">#{{ index + 1 }}</span>
                      <span class="text-white">{{ producto.nombre }}</span>
                    </div>
                    <div class="flex items-center">
                      <span class="text-gray-300">{{ producto.margen_ganancia }}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

    </div>

    <!-- Modal de Formulario -->
    <ProductoForm
      v-if="mostrarFormulario"
      :producto="productoSeleccionado"
      :categorias="categorias"
      :recetas="recetas"
      @guardar="guardarProducto"
      @cancelar="cerrarFormulario"
    />

    <!-- Modal de Detalle -->
    <ProductoDetail
      v-if="mostrarDetalle"
      :producto="productoSeleccionado"
      @cerrar="cerrarDetalle"
      @editar="editarProducto"
    />

    <!-- Modal de Duplicación -->
    <ProductoDuplicator
      v-if="mostrarDuplicador"
      :producto="productoSeleccionado"
      @duplicar="confirmarDuplicacion"
      @cancelar="cerrarDuplicador"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import Sidebar from '../partials/Sidebar.vue'
import Header from '../partials/Header.vue'
import ProductosList from '../partials/productos/ProductosList.vue'
import ProductoForm from '../partials/productos/ProductoForm.vue'
import ProductoDetail from '../partials/productos/ProductoDetail.vue'
import ProductoDuplicator from '../partials/productos/ProductoDuplicator.vue'
import CategoriasManager from '../partials/productos/CategoriasManager.vue'
import { ProductoService } from '../services/productoService'
import { CategoriaProductoService } from '../services/categoriaProductoService'
import { RecetaProductoService } from '../services/recetaProductoService'
import { RecetaService } from '../services/recetaService'
import { useAuth } from '../composables/useAuth'
import { useToast } from '../composables/useToast'

export default {
  name: 'Productos',
  components: {
    Sidebar,
    Header,
    ProductosList,
    ProductoForm,
    ProductoDetail,
    ProductoDuplicator,
    CategoriasManager
  },
  setup() {
    // Estado
    const sidebarOpen = ref(false)
    const tabActivo = ref('dashboard')
    const mostrarFormulario = ref(false)
    const mostrarDetalle = ref(false)
    const mostrarDuplicador = ref(false)
    const productoSeleccionado = ref(null)
    const loading = ref(false)

    // Datos
    const productos = ref([])
    const categorias = ref([])
    const recetas = ref([])

    // Composables
    const { user } = useAuth()
    const { addToast: showToast } = useToast()
    const usuarioId = computed(() => user.value?.id || null)

    // Tabs
    const tabs = [
      { id: 'dashboard', nombre: 'Dashboard' },
      { id: 'lista', nombre: 'Mis Productos' },
      { id: 'categorias', nombre: 'Categorías' },
      { id: 'analisis', nombre: 'Análisis' }
    ]

    // Computed properties
    const estadisticas = computed(() => {
      if (!productos.value.length) {
        return {
          totalProductos: 0,
          masVendido: 'Sin datos',
          mejorMargen: 'Sin datos',
          promedioMargen: '0'
        }
      }
      
      const totalProductos = productos.value.length
      const masVendido = productos.value.reduce((max, producto) =>
        (producto.ventas_registradas || 0) > (max.ventas_registradas || 0) ? producto : max
      )
      const mejorMargen = productos.value.reduce((max, producto) =>
        (producto.margen_ganancia || 0) > (max.margen_ganancia || 0) ? producto : max
      )
      const promedioMargen = (productos.value.reduce((sum, producto) =>
        sum + (producto.margen_ganancia || 0), 0) / totalProductos).toFixed(1)

      return {
        totalProductos,
        masVendido: masVendido.nombre || 'Sin datos',
        mejorMargen: mejorMargen.nombre || 'Sin datos',
        promedioMargen
      }
    })

    const productosRecientes = computed(() => {
      return productos.value
        .sort((a, b) => new Date(b.fecha_creacion || 0) - new Date(a.fecha_creacion || 0))
        .slice(0, 6)
    })

    const estadisticasPorCategoria = computed(() => {
      return categorias.value.map(cat => ({
        ...cat,
        cantidad: productos.value.filter(p => p.categoria_id === cat.id).length
      }))
    })

    const topProductos = computed(() => {
      return productos.value
        .sort((a, b) => (b.margen_ganancia || 0) - (a.margen_ganancia || 0))
        .slice(0, 5)
    })

    // Methods
    const verProducto = (producto) => {
      productoSeleccionado.value = producto
      mostrarDetalle.value = true
    }

    const editarProducto = (producto) => {
      productoSeleccionado.value = producto
      mostrarDetalle.value = false
      mostrarFormulario.value = true
    }

    const abrirFormularioCrear = () => {
      // Validar que haya categorías y recetas disponibles
      if (categorias.value.length === 0) {
        showToast('Debes crear al menos una categoría antes de crear productos', 'warning')
        tabActivo.value = 'categorias'
        return
      }

      if (recetas.value.length === 0) {
        showToast('Debes crear al menos una receta antes de crear productos', 'warning')
        return
      }

      productoSeleccionado.value = null
      mostrarFormulario.value = true
    }

    // Cargar datos iniciales
    const cargarDatos = async () => {
      console.log('🔄 INICIANDO CARGA DE DATOS DE PRODUCTOS...')
      loading.value = true
      
      try {
        // Cargar categorías (todas, activas e inactivas)
        const categoriasResult = await CategoriaProductoService.getAllCategorias()
        if (categoriasResult.success) {
          categorias.value = categoriasResult.data || []
          console.log('✅ Categorías cargadas:', categorias.value.length)
        } else {
          console.error('❌ Error al cargar categorías:', categoriasResult.error)
          showToast('Error al cargar categorías: ' + categoriasResult.error, 'error')
        }

        // Cargar productos (todos, activos e inactivos)
        const productosResult = await ProductoService.getAllProductos()
        if (productosResult.success) {
          productos.value = productosResult.data || []
          console.log('✅ Productos cargados:', productos.value.length)
        } else {
          console.error('❌ Error al cargar productos:', productosResult.error)
          showToast('Error al cargar productos: ' + productosResult.error, 'error')
        }

        // Cargar recetas
        const recetasResult = await RecetaService.getAllRecetas({ activa: true })
        if (recetasResult.success) {
          recetas.value = recetasResult.data || []
          console.log('✅ Recetas cargadas:', recetas.value.length)
        } else {
          console.error('❌ Error al cargar recetas:', recetasResult.error)
          showToast('Error al cargar recetas: ' + recetasResult.error, 'error')
        }

      } catch (error) {
        console.error('❌ ERROR INESPERADO EN CARGA DE DATOS:', error)
        showToast('Error inesperado al cargar datos', 'error')
      } finally {
        loading.value = false
        console.log('🏁 CARGA DE DATOS FINALIZADA')
      }
    }

    const guardarProducto = async (producto) => {
      console.log('💾 guardarProducto - Datos recibidos:', producto)

      // Validaciones previas
      if (!producto.nombre || !producto.categoria_id || !producto.precio_venta) {
        showToast('Por favor completa todos los campos obligatorios', 'warning')
        return
      }

      if (!producto.recetas || producto.recetas.length === 0) {
        showToast('Debes agregar al menos una receta al producto', 'warning')
        return
      }

      if (!usuarioId.value) {
        showToast('Error: No se pudo identificar el usuario', 'error')
        return
      }

      loading.value = true
      try {
        let result
        if (producto.id) {
          // Editar producto existente
          console.log('📝 Editando producto existente con ID:', producto.id)
          result = await ProductoService.updateProducto(producto.id, {
            ...producto,
            modificado_por: usuarioId.value
          })

          if (result.success) {
            console.log('✅ Producto actualizado exitosamente')
            showToast('Producto actualizado correctamente', 'success')
          } else {
            console.error('❌ Error al actualizar:', result.error)
            showToast('Error al actualizar producto: ' + result.error, 'error')
            return
          }
        } else {
          // Crear nuevo producto
          console.log('➕ Creando nuevo producto')
          result = await ProductoService.createProducto({
            ...producto,
            creado_por: usuarioId.value
          })

          if (result.success) {
            console.log('✅ Producto creado exitosamente:', result.data)
            showToast('Producto creado correctamente', 'success')
          } else {
            console.error('❌ Error al crear:', result.error)
            showToast('Error al crear producto: ' + result.error, 'error')
            return
          }
        }

        console.log('🔄 Recargando datos...')
        await cargarDatos() // Recargar datos
        cerrarFormulario()
      } catch (error) {
        console.error('❌ Error inesperado al guardar producto:', error)
        showToast('Error inesperado: ' + error.message, 'error')
      } finally {
        loading.value = false
      }
    }

    const eliminarProducto = async (producto) => {
      if ((producto.ventas_registradas || 0) > 0) {
        showToast('No se puede eliminar: producto con ventas registradas', 'warning')
        return
      }

      if (!confirm(`¿Estás seguro de que quieres eliminar el producto "${producto.nombre}"?`)) {
        return
      }

      loading.value = true
      try {
        console.log('🗑️ Eliminando producto:', producto)
        
        const result = await ProductoService.deleteProducto(producto.id, usuarioId.value)
        
        if (result.success) {
          showToast('Producto eliminado correctamente', 'success')
          await cargarDatos() // Recargar datos
        } else {
          showToast('Error al eliminar producto: ' + result.error, 'error')
        }
      } catch (error) {
        console.error('❌ Error al eliminar producto:', error)
        showToast('Error inesperado al eliminar producto', 'error')
      } finally {
        loading.value = false
      }
    }

    const duplicarProducto = (producto) => {
      productoSeleccionado.value = producto
      mostrarDuplicador.value = true
    }

    const confirmarDuplicacion = async (productoDuplicado) => {
      const productoOriginal = productoSeleccionado.value

      console.log('🔄 Duplicando producto:', productoOriginal.nombre, '→', productoDuplicado.nombre)

      loading.value = true
      try {
        // Preparar datos del producto duplicado con límites de caracteres
        const productoData = {
          nombre: productoDuplicado.nombre ? String(productoDuplicado.nombre).substring(0, 200) : '', // Limitar nombre a 200 caracteres
          descripcion: productoDuplicado.descripcion ? String(productoDuplicado.descripcion).substring(0, 200) : null, // Limitar descripción
          categoria_id: productoDuplicado.categoria_id,
          precio_venta: productoDuplicado.precio_venta,
          costo_total: productoDuplicado.costo_total || 0.0,
          margen_ganancia: productoDuplicado.margen_ganancia || 0.0,
          activo: false, // Los productos duplicados inician como inactivos
          creado_por: usuarioId.value,
          recetas: (productoDuplicado.recetas || []).map(r => ({
            receta_id: r.receta?.id || r.receta_id,
            cantidad: r.cantidad || 1,
            observaciones: r.observaciones ? String(r.observaciones).substring(0, 200) : null
          }))
        }

        console.log('📤 Datos del producto a duplicar:', productoData)

        // Crear el producto duplicado
        const result = await ProductoService.createProducto(productoData)

        if (result.success) {
          console.log('✅ Producto duplicado exitosamente')
          showToast('Producto duplicado correctamente', 'success')

          // Recargar lista de productos
          await cargarDatos()

          // Cerrar modales
          cerrarDuplicador()
          cerrarDetalle()

          // Cambiar a vista de lista para ver el nuevo producto
          tabActivo.value = 'lista'
        } else {
          console.error('❌ Error al duplicar producto:', result.error)
          showToast('Error al duplicar producto: ' + result.error, 'error')
        }
      } catch (error) {
        console.error('❌ Error inesperado al duplicar producto:', error)
        showToast('Error inesperado al duplicar producto', 'error')
      } finally {
        loading.value = false
      }
    }

    const crearCategoria = async (categoria) => {
      loading.value = true
      try {
        console.log('📝 Creando categoría:', categoria)
        
        const result = await CategoriaProductoService.createCategoria({
          ...categoria,
          creado_por: usuarioId.value
        })
        
        if (result.success) {
          showToast('Categoría creada correctamente', 'success')
          await cargarDatos() // Recargar datos
        } else {
          showToast('Error al crear categoría: ' + result.error, 'error')
        }
      } catch (error) {
        console.error('❌ Error al crear categoría:', error)
        showToast('Error inesperado al crear categoría', 'error')
      } finally {
        loading.value = false
      }
    }

    const editarCategoria = async (categoria) => {
      loading.value = true
      try {
        console.log('📝 Editando categoría:', categoria)
        
        const result = await CategoriaProductoService.updateCategoria(categoria.id, {
          ...categoria,
          modificado_por: usuarioId.value
        })
        
        if (result.success) {
          showToast('Categoría actualizada correctamente', 'success')
          await cargarDatos() // Recargar datos
        } else {
          showToast('Error al actualizar categoría: ' + result.error, 'error')
        }
      } catch (error) {
        console.error('❌ Error al actualizar categoría:', error)
        showToast('Error inesperado al actualizar categoría', 'error')
      } finally {
        loading.value = false
      }
    }

    const eliminarCategoria = async (categoria) => {
      if (!confirm(`¿Estás seguro de que quieres eliminar la categoría "${categoria.nombre}"?`)) {
        return
      }

      loading.value = true
      try {
        console.log('🗑️ Eliminando categoría:', categoria)
        
        const result = await CategoriaProductoService.deleteCategoria(categoria.id, usuarioId.value)
        
        if (result.success) {
          showToast('Categoría eliminada correctamente', 'success')
          await cargarDatos() // Recargar datos
        } else {
          showToast('Error al eliminar categoría: ' + result.error, 'error')
        }
      } catch (error) {
        console.error('❌ Error al eliminar categoría:', error)
        showToast('Error inesperado al eliminar categoría', 'error')
      } finally {
        loading.value = false
      }
    }

    const cerrarFormulario = () => {
      mostrarFormulario.value = false
      productoSeleccionado.value = null
    }

    const cerrarDetalle = () => {
      mostrarDetalle.value = false
      productoSeleccionado.value = null
    }

    const cerrarDuplicador = () => {
      mostrarDuplicador.value = false
      productoSeleccionado.value = null
    }

    // Cargar datos al montar el componente
    onMounted(() => {
      console.log('🎯 COMPONENTE MONTADO - Iniciando carga de datos de productos...')
      cargarDatos()
    })

    return {
      sidebarOpen,
      tabActivo,
      tabs,
      mostrarFormulario,
      mostrarDetalle,
      mostrarDuplicador,
      productoSeleccionado,
      loading,
      productos,
      categorias,
      recetas,
      estadisticas,
      productosRecientes,
      estadisticasPorCategoria,
      topProductos,
      verProducto,
      editarProducto,
      abrirFormularioCrear,
      guardarProducto,
      eliminarProducto,
      duplicarProducto,
      confirmarDuplicacion,
      crearCategoria,
      editarCategoria,
      eliminarCategoria,
      cerrarFormulario,
      cerrarDetalle,
      cerrarDuplicador,
      cargarDatos
    }
  }
}
</script>

<style scoped>
.productos-page {
  background-color: #000000;
}

/* Estilos para cards y contenedores */
.card {
  background-color: rgb(24 24 27 / 0.8);
  border: 1px solid rgb(63 63 70 / 0.5);
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

.card-header {
  background-color: black;
  border-bottom: 1px solid rgb(63 63 70 / 0.5);
}

.card-body {
  background-color: black;
}

/* Estilos para inputs */
.input-field {
  background-color: rgb(24 24 27 / 0.8);
  border: 1px solid rgb(63 63 70 / 0.5);
  color: white;
}

.input-field::placeholder {
  color: #9ca3af;
}

.input-field:focus {
  border-color: #9ca3af;
}

/* Estilos para botones */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid rgb(63 63 70 / 0.5);
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  transition: all 150ms;
  background-color: black;
  color: white;
}

.btn:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.btn:hover {
  background-color: rgb(39 39 42);
}

.btn-primary {
  background-color: rgb(24 24 27 / 0.8);
  border: 1px solid rgb(63 63 70 / 0.5);
  color: white;
}

.btn-primary:hover {
  background-color: rgb(39 39 42);
  border-color: #9ca3af;
}

.btn-secondary {
  background-color: rgb(24 24 27 / 0.8);
  border: 1px solid rgb(63 63 70 / 0.5);
  color: white;
}

.btn-secondary:hover {
  background-color: rgb(39 39 42);
  border-color: #9ca3af;
}

.btn-danger {
  background-color: #7f1d1d;
  border: 1px solid #fca5a5;
  color: #fecaca;
}

.btn-danger:hover {
  background-color: #991b1b;
  border-color: #f87171;
}

.btn-success {
  background-color: #14532d;
  border: 1px solid #86efac;
  color: #bbf7d0;
}

.btn-success:hover {
  background-color: #166534;
  border-color: #4ade80;
}

/* Estilos para tablas */
.table {
  background-color: rgb(24 24 27 / 0.8);
  border: 1px solid rgb(63 63 70 / 0.5);
}

.table-header {
  background-color: black;
  border-bottom: 1px solid rgb(63 63 70 / 0.5);
}

.table-row {
  background-color: black;
  border-bottom: 1px solid rgb(63 63 70 / 0.5);
}

.table-row:hover {
  background-color: rgb(39 39 42);
}

/* Estilos para modales */
.modal {
  background-color: rgb(24 24 27 / 0.8);
  border: 1px solid rgb(63 63 70 / 0.5);
}

.modal-header {
  background-color: black;
  border-bottom: 1px solid rgb(63 63 70 / 0.5);
}

.modal-body {
  background-color: black;
}

/* Estilos para tabs */
.tab-active {
  color: #d1d5db;
  border-color: rgb(63 63 70 / 0.5);
  background-color: black;
}

.tab-inactive {
  color: #9ca3af;
  border-color: transparent;
  background-color: black;
}

.tab-inactive:hover {
  color: #d1d5db;
  border-color: rgb(63 63 70 / 0.5);
}

/* Transiciones suaves */
* {
  transition: background-color 150ms ease, border-color 150ms ease, color 150ms ease;
}
</style>
