<template>
  <div class="flex h-screen overflow-hidden recetas-page">

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
              <h1 class="text-2xl md:text-3xl text-gray-100 font-bold">Recetas</h1>
              <p class="text-gray-400 mt-1">Gestión de recetas y preparaciones</p>
            </div>

            <!-- Right: Actions -->
            <div class="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
              <button
                @click="mostrarFormulario = true"
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-black bg-yellow-400 hover:bg-yellow-500 rounded-lg transition-colors border-0"
              >
                <svg class="w-4 h-4 fill-current shrink-0 text-black" viewBox="0 0 16 16">
                  <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                </svg>
                <span class="hidden xs:block ml-2">Nueva Receta</span>
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
            <!-- Loading state -->
            <div v-if="loading" class="flex justify-center items-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
              <p class="ml-4 text-white">Cargando datos...</p>
            </div>
            
            <!-- Error state -->
            <div v-if="error" class="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-6">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 016 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 2h4a1 1 0 102-2v-4a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-red-800">Error al cargar datos</h3>
                  <div class="mt-2 text-sm text-red-700">
                    <p>{{ error }}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Content when loaded -->
            <div v-if="!loading && !error">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div style="background-color: rgb(24 24 27 / 0.8);" class="border border-zinc-700/50 rounded-lg p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span class="text-black font-bold">🥟</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-300">Total Recetas</p>
                    <p class="text-2xl font-bold text-white">{{ estadisticas.totalRecetas }}</p>
                  </div>
                </div>
              </div>

              <div style="background-color: rgb(24 24 27 / 0.8);" class="border border-zinc-700/50 rounded-lg p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span class="text-black font-bold">⭐</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-300">Más Popular</p>
                    <p class="text-lg font-bold text-white">{{ estadisticas.masPopular }}</p>
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
                    <p class="text-sm font-medium text-gray-300">Más Rentable</p>
                    <p class="text-lg font-bold text-white">{{ estadisticas.masRentable }}</p>
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
                    <p class="text-sm font-medium text-gray-300">Promedio Costo</p>
                    <p class="text-lg font-bold text-white">₡{{ estadisticas.promedioCosto }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recetas Recientes -->
            <div style="background-color: rgb(24 24 27 / 0.8);" class="border border-zinc-700/50 rounded-lg p-6">
              <h3 class="text-lg font-medium text-white mb-4">Recetas Recientes</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
                  v-for="receta in recetasRecientes"
                  :key="receta.id"
                  style="background-color: rgb(39 39 42);"
                  class="border border-zinc-700/50 rounded-lg p-4 hover:border-yellow-400 transition-colors cursor-pointer"
                  @click="verReceta(receta)"
                >
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="text-sm font-medium text-white">{{ receta.nombre }}</h4>
                    <span class="text-xs text-gray-300">{{ obtenerNombreCategoria(receta.categoria_id) }}</span>
                  </div>
                  <div class="flex items-center justify-between text-xs text-gray-400">
                    <span>{{ receta.tiempoPreparacion }} min</span>
                    <span>{{ receta.rendimiento }} porciones</span>
                  </div>
                  <div class="flex items-center justify-between mt-2 text-xs">
                    <span class="text-yellow-400 font-semibold">{{ receta.rentabilidad }}% margen</span>
                    <span class="text-gray-400">Costo: ₡{{ Number(receta.costo_total ?? receta.costoTotal ?? 0).toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>

          <!-- Lista de Recetas -->
          <div v-if="tabActivo === 'lista'" class="space-y-6">
            <!-- Loading state -->
            <div v-if="loading" class="flex justify-center items-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
              <p class="ml-4 text-white">Cargando recetas...</p>
            </div>
            
            <!-- Error state -->
            <div v-if="error" class="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-6">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 016 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 2h4a1 1 0 102-2v-4a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-red-800">Error al cargar recetas</h3>
                  <div class="mt-2 text-sm text-red-700">
                    <p>{{ error }}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Content when loaded -->
            <div v-if="!loading && !error">
            <RecetasList 
              :recetas="recetas"
              :categorias="categorias"
              @editar-receta="editarReceta"
              @ver-receta="verReceta"
              @eliminar-receta="eliminarReceta"
              @duplicar-receta="duplicarReceta"
            />
            </div>
          </div>

          <!-- Categorías -->
          <div v-if="tabActivo === 'categorias'" class="space-y-6">
            <!-- Loading state -->
            <div v-if="loading" class="flex justify-center items-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
              <p class="ml-4 text-white">Cargando categorías...</p>
            </div>

            <!-- Error state -->
            <div v-if="error" class="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-6">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 016 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 2h4a1 1 0 102-2v-4a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-red-800">Error al cargar categorías</h3>
                  <div class="mt-2 text-sm text-red-700">
                    <p>{{ error }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Content when loaded -->
            <div v-if="!loading && !error">
              <CategoriasManager
                :categorias="categorias"
                @crear-categoria="crearCategoria"
                @editar-categoria="editarCategoria"
                @eliminar-categoria="eliminarCategoria"
              />
            </div>
          </div>

          <!-- Estadísticas -->
          <div v-if="tabActivo === 'estadisticas'" class="space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div style="background-color: rgb(24 24 27 / 0.8);" class="border border-zinc-700/50 rounded-lg p-6">
                <h3 class="text-lg font-medium text-white mb-4">Recetas por Categoría</h3>
                <div class="space-y-3">
                  <div
                    v-for="cat in estadisticasPorCategoria"
                    :key="cat.id"
                    class="flex items-center justify-between"
                  >
                    <div class="flex items-center">
                      <span class="text-lg mr-2">{{ cat.icono || '🥟' }}</span>
                      <span class="text-white">{{ cat.nombre }}</span>
                    </div>
                    <span class="text-gray-300">{{ cat.cantidad }}</span>
                  </div>
                </div>
              </div>

              <div style="background-color: rgb(24 24 27 / 0.8);" class="border border-zinc-700/50 rounded-lg p-6">
                <h3 class="text-lg font-medium text-white mb-4">Top 5 con Mejor Margen</h3>
                <div class="space-y-3">
                  <div
                    v-for="(receta, index) in topRecetas"
                    :key="receta.id"
                    class="flex items-center justify-between"
                  >
                    <div class="flex items-center">
                      <span class="text-yellow-400 font-bold mr-2">#{{ index + 1 }}</span>
                      <span class="text-white">{{ receta.nombre }}</span>
                    </div>
                    <div class="flex items-center text-sm">
                      <span class="text-yellow-400 font-semibold mr-1">{{ receta.rentabilidad || receta.margen_ganancia || 0 }}%</span>
                      <span class="text-gray-400">margen</span>
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
    <RecetaForm
      v-if="mostrarFormulario"
      :receta="recetaSeleccionada"
      :categorias="categorias"
      :ingredientes="ingredientes"
      @guardar="guardarReceta"
      @cancelar="cerrarFormulario"
    />

    <!-- Modal de Detalle -->
    <RecetaDetail
      v-if="mostrarDetalle"
      :receta="recetaSeleccionada"
      :categorias="categorias"
      @cerrar="cerrarDetalle"
      @editar="editarReceta"
      @duplicar="duplicarReceta"
    />

    <!-- Modal de Duplicación -->
    <RecetaDuplicator
      v-if="mostrarDuplicador"
      :receta="recetaSeleccionada"
      :categorias="categorias"
      @duplicar="confirmarDuplicacion"
      @cancelar="cerrarDuplicador"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import Sidebar from '../partials/Sidebar.vue'
import Header from '../partials/Header.vue'
import RecetasList from '../partials/recetas/RecetasList.vue'
import RecetaForm from '../partials/recetas/RecetaForm.vue'
import RecetaDetail from '../partials/recetas/RecetaDetail.vue'
import RecetaDuplicator from '../partials/recetas/RecetaDuplicator.vue'
import CategoriasManager from '../partials/recetas/CategoriasManager.vue'
import { RecetaService } from '../services/recetaService.js'
import { CategoriaRecetaService } from '../services/categoriaRecetaService.js'
import { InsumoService } from '../services/insumoService.js'
import { useAuth } from '../composables/useAuth'

export default {
  name: 'Recetas',
  components: {
    Sidebar,
    Header,
    RecetasList,
    RecetaForm,
    RecetaDetail,
    RecetaDuplicator,
    CategoriasManager
  },
  setup() {
    // Composables
    const { user } = useAuth()

    // Estado
    const sidebarOpen = ref(false)
    const tabActivo = ref('dashboard')
    const mostrarFormulario = ref(false)
    const mostrarDetalle = ref(false)
    const mostrarDuplicador = ref(false)
    const recetaSeleccionada = ref(null)
    const loading = ref(false)
    const error = ref(null)

    // Datos del backend
    const recetas = ref([])
    const categorias = ref([])
    const ingredientes = ref([])

    // Tabs
    const tabs = [
      { id: 'dashboard', nombre: 'Dashboard' },
      { id: 'lista', nombre: 'Mis Recetas' },
      { id: 'categorias', nombre: 'Categorías' },
      { id: 'estadisticas', nombre: 'Estadísticas' }
    ]

    // Función para transformar datos del backend a formato del frontend
    const transformarReceta = (receta) => {
      return {
        ...receta,
        codigo: receta.codigo || 'N/A',
        tiempoPreparacion: receta.tiempo_preparacion || 0,
        rendimiento: receta.rendimiento || 0,
        costoTotal: receta.costo_total || 0,
        costoPorPorcion: receta.rendimiento > 0 ? (receta.costo_total || 0) / receta.rendimiento : 0,
        rentabilidad: receta.margen_ganancia || 0,
        popularidad: receta.popularidad || 0,
        estado: receta.activa ? 'Activa' : 'Borrador',
        ingredientes: receta.ingredientes || []
      }
    }

    // Funciones para cargar datos desde el backend
    const cargarRecetas = async () => {
      try {
        loading.value = true
        error.value = null // Limpiar errores anteriores
        const result = await RecetaService.getAllRecetas()
        if (result.success) {
          recetas.value = (result.data || []).map(transformarReceta)
        } else {
          error.value = result.error
          console.error('Error al cargar recetas:', result.error)
        }
      } catch (err) {
        error.value = 'Error inesperado al cargar recetas'
        console.error('Error inesperado:', err)
      } finally {
        loading.value = false
      }
    }

    const cargarCategorias = async () => {
      try {
        error.value = null // Limpiar errores anteriores
        const result = await CategoriaRecetaService.getAllCategorias()
        if (result.success) {
          categorias.value = result.data || []
        } else {
          error.value = result.error
          console.error('Error al cargar categorías:', result.error)
        }
      } catch (err) {
        error.value = 'Error inesperado al cargar categorías'
        console.error('Error inesperado:', err)
      }
    }

    const cargarIngredientes = async () => {
      try {
        const result = await InsumoService.getAllInsumos()
        if (result.success) {
          // Transformar datos para que coincidan con el formato esperado
          ingredientes.value = (result.data || []).map(insumo => {
            // Calculate stock from all batches
            const stockTotal = insumo.lotes ? insumo.lotes.reduce((total, lote) => total + (lote.cantidad_actual || 0), 0) : 0
            
            // Get price from most recent batch (sorted by date)
            let precioUnitario = 0
            if (insumo.lotes && insumo.lotes.length > 0) {
              // Sort batches by date to get the most recent one
              const lotesOrdenados = insumo.lotes.sort((a, b) =>
                new Date(b.fecha_ingreso) - new Date(a.fecha_ingreso)
              )
              precioUnitario = lotesOrdenados[0].precio_unitario || 0
            }
            
            return {
              id: insumo.id,
              nombre: insumo.nombre,
              precioUnitario: precioUnitario,
              unidad: insumo.unidad_medida,
              disponible: insumo.estado === 'Activo',
              stock: stockTotal
            }
          })
        } else {
          error.value = result.error
          console.error('Error al cargar ingredientes:', result.error)
        }
      } catch (err) {
        error.value = 'Error inesperado al cargar ingredientes'
        console.error('Error inesperado:', err)
      }
    }

    // Cargar datos al montar el componente
    const cargarDatosIniciales = async () => {
      await Promise.all([
        cargarRecetas(),
        cargarCategorias(),
        cargarIngredientes()
      ])
    }

    // Cargar datos cuando el componente se monte
    onMounted(() => {
      cargarDatosIniciales()
    })

    // Computed properties
    const estadisticas = computed(() => {
      const totalRecetas = recetas.value.length
      if (totalRecetas === 0) {
        return {
          totalRecetas: 0,
          masPopular: 'N/A',
          masRentable: 'N/A',
          promedioCosto: '0.00'
        }
      }

      const masPopular = recetas.value.reduce((max, receta) =>
        (receta.popularidad || 0) > (max.popularidad || 0) ? receta : max
      , recetas.value[0] || {})
      
      const masRentable = recetas.value.reduce((max, receta) =>
        (receta.margen_ganancia || 0) > (max.margen_ganancia || 0) ? receta : max
      , recetas.value[0] || {})
      
      const promedioCosto = (recetas.value.reduce((sum, receta) =>
        sum + (receta.costo_total || 0), 0) / totalRecetas).toFixed(2)

      return {
        totalRecetas,
        masPopular: masPopular.nombre || 'N/A',
        masRentable: masRentable.nombre || 'N/A',
        promedioCosto
      }
    })

    const recetasRecientes = computed(() => {
      return recetas.value
        .sort((a, b) => new Date(b.fecha_modificacion || b.fecha_creacion) - new Date(a.fecha_modificacion || a.fecha_creacion))
        .slice(0, 6)
    })

    const estadisticasPorCategoria = computed(() => {
      return categorias.value.map(cat => ({
        ...cat,
        cantidad: recetas.value.filter(r => r.categoria_id === cat.id).length
      }))
    })

    const topRecetas = computed(() => {
      return recetas.value
        .slice()
        .sort((a, b) => {
          const margenB = b.rentabilidad ?? b.margen_ganancia ?? 0
          const margenA = a.rentabilidad ?? a.margen_ganancia ?? 0
          return margenB - margenA
        })
        .slice(0, 5)
    })

    // Methods
    const obtenerNombreCategoria = (categoriaId) => {
      const categoria = categorias.value.find(c => c.id === categoriaId)
      return categoria ? categoria.nombre : 'Sin categoría'
    }

    const verReceta = (receta) => {
      recetaSeleccionada.value = receta
      mostrarDetalle.value = true
    }

    // Recetas.vue — dentro de setup()
    const editarReceta = (receta) => {
      // Usa la receta que viene del detalle (o la ya seleccionada)
      recetaSeleccionada.value = receta ?? recetaSeleccionada.value

      // 👇 Cierra el modal de detalle para que no tape el formulario
      mostrarDetalle.value = false

      // 👇 Abre el formulario de edición
      mostrarFormulario.value = true
    }

  
const guardarReceta = async (receta) => {
  try {
    loading.value = true
    error.value = null

    console.log('📝 guardarReceta - Datos recibidos:', receta)

    // Preparar datos para el backend
    const recetaData = {
      nombre: receta.nombre,
      descripcion: receta.descripcion || null,
      categoria_id: receta.categoria_id || receta.categoriaId,
      tiempo_preparacion: receta.tiempoPreparacion,
      rendimiento: receta.rendimiento,
      nivel_dificultad: receta.nivelDificultad || 'Intermedio',
      instrucciones: receta.pasos && receta.pasos.length > 0 ? receta.pasos.join('\n\n') : '',
      costo_total: receta.costoTotal || 0.0,
      precio_sugerido: receta.precioSugerido || 0.0,
      margen_ganancia: receta.rentabilidad || 0.0,
      activa: receta.estado !== 'Borrador',
      creado_por: user.value?.id,
      modificado_por: user.value?.id,
      ingredientes: receta.ingredientes?.map(ing => ({
        insumo_id: ing.ingredienteId,
        cantidad: ing.cantidad,
        unidad_medida: ing.unidad,
        costo_unitario: ing.precioUnitario || 0.0,
        costo_total: ing.subtotal || 0.0,
        observaciones: ing.observaciones || null
      })) || [],
      pasos: receta.pasos || []
    }

    console.log('📤 Datos enviados al servicio:', recetaData)

    let result
    if (receta.id) {
      // Actualizar receta existente
      result = await RecetaService.updateReceta(receta.id, recetaData)
      if (result.success) {
        const index = recetas.value.findIndex(r => r.id === receta.id)
        if (index > -1) {
          recetas.value[index] = { ...recetas.value[index], ...result.data }
        }
      }
    } else {
      // Crear nueva receta
      result = await RecetaService.createReceta(recetaData)
      if (result.success) {
        recetas.value.unshift(result.data)
      }
    }

    if (!result.success) {
      error.value = result.error
      console.error('❌ Error al guardar receta:', result.error)
      return
    }

    console.log('✅ Receta guardada exitosamente')

    // Recargar datos para asegurar sincronización
    await cargarRecetas()
    cerrarFormulario()
  } catch (err) {
    error.value = 'Error inesperado al guardar receta'
    console.error('❌ Error inesperado:', err)
  } finally {
    loading.value = false
  }
}


const eliminarReceta = async (recetaOId) => {
  try {
    loading.value = true
    error.value = null

    // Normaliza: acepta objeto o id
    const id = typeof recetaOId === 'object' ? recetaOId?.id : recetaOId
    if (id == null) {
      error.value = 'ID inválido'
      return
    }

    const result = await RecetaService.deleteReceta(id, user.value?.id)
    if (!result.success) {
      error.value = result.error
      console.error('Error al eliminar receta:', result.error)
      return
    }

    // Eliminar del arreglo local
    const idx = recetas.value.findIndex(r => r.id === id)
    if (idx > -1) {
      recetas.value.splice(idx, 1)
    }

    // Cerrar modales si estaban mostrando esa receta
    if (recetaSeleccionada.value && recetaSeleccionada.value.id === id) {
      if (mostrarDetalle.value)     cerrarDetalle()
      if (mostrarFormulario.value)  cerrarFormulario()
      if (mostrarDuplicador.value)  cerrarDuplicador()
      recetaSeleccionada.value = null
    }
  } catch (err) {
    error.value = 'Error inesperado al eliminar receta'
    console.error('Error inesperado:', err)
  } finally {
    loading.value = false
  }
}


    const duplicarReceta = (receta) => {
      recetaSeleccionada.value = receta
      mostrarDuplicador.value = true
    }

    const confirmarDuplicacion = async (nuevoNombre) => {
      try {
        loading.value = true
        error.value = null

        const recetaOriginal = recetaSeleccionada.value
        const recetaData = {
          nombre: nuevoNombre,
          descripcion: recetaOriginal.descripcion,
          categoria_id: recetaOriginal.categoria_id,
          tiempo_preparacion: recetaOriginal.tiempo_preparacion,
          rendimiento: recetaOriginal.rendimiento,
          nivel_dificultad: recetaOriginal.nivel_dificultad,
          instrucciones: recetaOriginal.instrucciones,
          costo_total: recetaOriginal.costo_total,
          precio_sugerido: recetaOriginal.precio_sugerido,
          margen_ganancia: recetaOriginal.margen_ganancia,
          activa: false, // Las recetas duplicadas se crean como inactivas por defecto
          creado_por: user.value?.id,
          modificado_por: user.value?.id,
          ingredientes: recetaOriginal.ingredientes?.map(ing => ({
            insumo_id: ing.insumo_id || ing.insumos?.id || ing.insumo?.id,
            cantidad: ing.cantidad,
            unidad_medida: ing.unidad_medida,
            costo_unitario: ing.costo_unitario,
            costo_total: ing.costo_total,
            observaciones: ing.observaciones
          })) || [],
          pasos: recetaOriginal.pasos?.map(paso => {
            // Si paso es un objeto con descripcion, extraer la descripcion
            if (typeof paso === 'object' && paso.descripcion) {
              return paso.descripcion
            }
            // Si paso es un string, usarlo directamente
            return paso
          }) || []
        }

        const result = await RecetaService.createReceta(recetaData)
        if (result.success) {
          console.log('✅ Receta duplicada exitosamente')
          // Recargar lista de recetas para asegurar sincronización
          await cargarRecetas()
          // Cerrar ambos modales (detalle y duplicador)
          cerrarDuplicador()
          cerrarDetalle()
        } else {
          error.value = result.error
          console.error('❌ Error al duplicar receta:', result.error)
        }
      } catch (err) {
        error.value = 'Error inesperado al duplicar receta'
        console.error('Error inesperado:', err)
      } finally {
        loading.value = false
      }
    }

    const crearCategoria = async (categoria) => {
      console.log('🎯 Recetas.vue - crearCategoria recibido')
      console.log('📥 Datos recibidos:', categoria)
      console.log('👤 Usuario actual:', user.value?.id)

      try {
        loading.value = true
        error.value = null

        console.log('📞 Llamando a CategoriaRecetaService.createCategoria...')
        const result = await CategoriaRecetaService.createCategoria({
          ...categoria,
          creado_por: user.value?.id
        })
        console.log('📊 Resultado del servicio:', result)

        if (result.success) {
          console.log('✅ Categoría creada exitosamente, recargando lista...')
          // Solo recargar la lista completa (no agregar manualmente)
          await cargarCategorias()
        } else {
          error.value = result.error
          console.error('❌ Error al crear categoría:', result.error)
        }
      } catch (err) {
        error.value = 'Error inesperado al crear categoría'
        console.error('❌ Error inesperado:', err)
      } finally {
        loading.value = false
        console.log('🏁 crearCategoria finalizado, loading=false')
      }
    }

    const editarCategoria = async (categoria) => {
      try {
        loading.value = true
        error.value = null

        const result = await CategoriaRecetaService.updateCategoria(categoria.id, {
          ...categoria,
          modificado_por: user.value?.id
        })
        if (result.success) {
          const index = categorias.value.findIndex(c => c.id === categoria.id)
          if (index > -1) {
            categorias.value[index] = result.data
          }
          await cargarCategorias() // Recargar para asegurar sincronización
        } else {
          error.value = result.error
          console.error('Error al actualizar categoría:', result.error)
        }
      } catch (err) {
        error.value = 'Error inesperado al actualizar categoría'
        console.error('Error inesperado:', err)
      } finally {
        loading.value = false
      }
    }

    const eliminarCategoria = async (categoria) => {
      try {
        loading.value = true
        error.value = null

        const result = await CategoriaRecetaService.deleteCategoria(categoria.id)
        if (result.success) {
          const index = categorias.value.findIndex(c => c.id === categoria.id)
          if (index > -1) {
            categorias.value.splice(index, 1)
          }
        } else {
          error.value = result.error
          console.error('Error al eliminar categoría:', result.error)
        }
      } catch (err) {
        error.value = 'Error inesperado al eliminar categoría'
        console.error('Error inesperado:', err)
      } finally {
        loading.value = false
      }
    }

    const cerrarFormulario = () => {
      mostrarFormulario.value = false
      recetaSeleccionada.value = null
    }

    const cerrarDetalle = () => {
      mostrarDetalle.value = false
      recetaSeleccionada.value = null
    }

    const cerrarDuplicador = () => {
      mostrarDuplicador.value = false
      recetaSeleccionada.value = null
    }

    return {
      sidebarOpen,
      tabActivo,
      tabs,
      mostrarFormulario,
      mostrarDetalle,
      mostrarDuplicador,
      recetaSeleccionada,
      recetas,
      categorias,
      ingredientes,
      loading,
      error,
      estadisticas,
      recetasRecientes,
      estadisticasPorCategoria,
      topRecetas,
      verReceta,
      editarReceta,
      guardarReceta,
      eliminarReceta,
      duplicarReceta,
      confirmarDuplicacion,
      crearCategoria,
      editarCategoria,
      eliminarCategoria,
      cerrarFormulario,
      cerrarDetalle,
      cerrarDuplicador,
      cargarRecetas,
      cargarCategorias,
      cargarIngredientes,
      obtenerNombreCategoria
    }
  }
}
</script>

<style scoped>
.recetas-page {
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
