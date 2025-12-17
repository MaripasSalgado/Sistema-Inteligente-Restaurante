<template>
  <div class="flex h-screen overflow-hidden">

    <!-- Sidebar -->
    <Sidebar :sidebarOpen="sidebarOpen" @close-sidebar="sidebarOpen = false" />

    <!-- Content area -->
    <div class="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
      
      <!-- Site header -->
      <Header :sidebarOpen="sidebarOpen" @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <main class="grow">
        <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

          <!-- Page header -->
          <div class="sm:flex sm:justify-between sm:items-center mb-8">

            <!-- Left: Title -->
            <div class="mb-4 sm:mb-0">
              <h1 class="text-2xl md:text-3xl text-gray-100 font-bold">Gestión de Insumos</h1>
              <p class="text-gray-400 mt-2">Administra el inventario de ingredientes y materias primas</p>
            </div>


          </div>


          <!-- Tabs -->
          <div class="mb-8">
            <div class="border-b border-zinc-700/50">
              <nav class="-mb-px flex space-x-8">
                <button
                  @click="activeTab = 'inventario'"
                  class="py-2 px-1 border-b-2 font-medium text-sm"
                  :class="activeTab === 'inventario' ? 'border-violet-500 text-amber-500' : 'border-transparent text-white hover:text-amber-400 hover:border-zinc-700/50'"
                >
                  Inventario
                </button>
                <button
                  @click="activeTab = 'lotes'"
                  class="py-2 px-1 border-b-2 font-medium text-sm"
                  :class="activeTab === 'lotes' ? 'border-violet-500 text-amber-500' : 'border-transparent text-white hover:text-amber-400 hover:border-zinc-700/50'"
                >
                  Lotes
                </button>
                <button
                  @click="activeTab = 'nuevo-insumo'"
                  class="py-2 px-1 border-b-2 font-medium text-sm"
                  :class="activeTab === 'nuevo-insumo' ? 'border-violet-500 text-amber-500' : 'border-transparent text-white hover:text-amber-400 hover:border-zinc-700/50'"
                >
                  Nuevo Insumo
                </button>
                <button
                  @click="activeTab = 'nuevo-lote'"
                  class="py-2 px-1 border-b-2 font-medium text-sm"
                  :class="activeTab === 'nuevo-lote' ? 'border-violet-500 text-amber-500' : 'border-transparent text-white hover:text-amber-400 hover:border-zinc-700/50'"
                >
                  Nuevo Lote
                </button>
                <button
                  @click="activeTab = 'categorias'"
                  class="py-2 px-1 border-b-2 font-medium text-sm"
                  :class="activeTab === 'categorias' ? 'border-violet-500 text-amber-500' : 'border-transparent text-white hover:text-amber-400 hover:border-zinc-700/50'"
                >
                  Categorías
                </button>
                <button
                  @click="activeTab = 'movimientos'"
                  class="py-2 px-1 border-b-2 font-medium text-sm"
                  :class="activeTab === 'movimientos' ? 'border-violet-500 text-amber-500' : 'border-transparent text-white hover:text-amber-400 hover:border-zinc-700/50'"
                >
                  Movimientos
                </button>
              </nav>
            </div>
          </div>

          <!-- Tab Content -->
          <div class="space-y-6">
            <!-- Loading indicator -->
            <div v-if="loading" class="flex justify-center items-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
              <span class="ml-2 text-gray-400">Cargando...</span>
            </div>


              <InsumosList 
              v-if="activeTab === 'inventario'"
              key="inventario"
                :insumos="insumos"
                :categorias="categorias"
              :proveedores="proveedoresActivos"
                @editar-insumo="editarInsumo"
                @ver-insumo="verInsumo"
                @eliminar-insumo="eliminarInsumo"
                @registrar-movimiento="registrarMovimiento"
              />

            <LotesList 
              v-else-if="activeTab === 'lotes'"
              key="lotes"
              :lotes="lotes"
              :insumos="insumos"
              @ver-lote="verLote"
              @editar-lote="editarLote"
              @eliminar-lote="eliminarLote"
            />

               <InsumoForm 
              v-else-if="activeTab === 'nuevo-insumo'"
              key="nuevo-insumo"
                 :categorias="categorias"
                 :proveedores="proveedoresActivos"
                 :insumo-edit="insumoSeleccionado"
                 @guardar-insumo="guardarInsumo"
                 @cancelar="activeTab = 'inventario'"
               />

            <LoteForm 
              v-else-if="activeTab === 'nuevo-lote'"
              key="nuevo-lote"
              :insumos="insumos"
              :proveedores="proveedoresActivos"
              @guardar-lote="guardarLote"
              @cancelar="activeTab = 'inventario'"
            />

              <CategoriasManager 
              v-else-if="activeTab === 'categorias'"
              key="categorias"
                :categorias="categorias"
                @guardar-categoria="guardarCategoria"
                @eliminar-categoria="eliminarCategoria"
              />

              <MovimientosManager
              v-else-if="activeTab === 'movimientos'"
              key="movimientos"
                :insumos="insumos"
                :proveedores="proveedoresActivos"
                :movimientos="movimientos"
                @registrar-movimiento="registrarMovimiento"
                @movimiento-actualizado="movimientoActualizado"
                @movimiento-eliminado="movimientoEliminado"
              />
          </div>

        </div>
      </main>

    </div>


    <!-- Modal de Detalle -->
    <InsumoDetail 
      v-if="mostrarModalVer"
      :insumo="insumoSeleccionado"
      :categorias="categorias"
      @cerrar="cerrarModalVer"
      @editar="editarInsumo"
    />

    <!-- Modal de Editar -->
    <InsumoEditModal
      v-show="mostrarModalEditar"
      :insumo="insumoSeleccionado"
      :categorias="categorias"
      :proveedores="proveedoresActivos"
      @cerrar="cerrarModalEditar"
      @guardar="guardarEdicion"
    />

    <!-- Modal de Eliminar -->
    <InsumoDeleteModal
      v-show="mostrarModalEliminar"
      :insumo="insumoSeleccionado"
      :usuario-id="usuarioId || ''"
      @cerrar="cerrarModalEliminar"
      @confirmar="confirmarEliminacion"
    />

    <!-- Modales de Lotes -->
    <!-- Modal de Detalle de Lote -->
    <LoteDetail 
      v-if="mostrarModalVerLote"
      :lote="loteSeleccionado"
      :insumos="insumos"
      @cerrar="cerrarModalVerLote"
      @editar="editarLoteDesdeModal"
    />

    <!-- Modal de Editar Lote -->
    <LoteEditModal
      v-show="mostrarModalEditarLote"
      :lote="loteSeleccionado"
      :insumos="insumos"
      :proveedores="proveedoresActivos"
      @cerrar="cerrarModalEditarLote"
      @guardar="guardarEdicionLote"
    />

    <!-- Modal de Eliminar Lote -->
    <LoteDeleteModal
      v-show="mostrarModalEliminarLote"
      :lote="loteSeleccionado"
      :insumos="insumos"
      :usuario-id="usuarioId || ''"
      @cerrar="cerrarModalEliminarLote"
      @confirmado="confirmarEliminacionLote"
    />

  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import Sidebar from '../partials/Sidebar.vue'
import Header from '../partials/Header.vue'
import InsumosList from '../partials/insumos/InsumosList.vue'
import LotesList from '../partials/insumos/LotesList.vue'
import InsumoForm from '../partials/insumos/InsumoForm.vue'
import InsumoDetail from '../partials/insumos/InsumoDetail.vue'
import InsumoEditModal from '../partials/insumos/InsumoEditModal.vue'
import InsumoDeleteModal from '../partials/insumos/InsumoDeleteModal.vue'
import CategoriasManager from '../partials/insumos/CategoriasManager.vue'
import MovimientosManager from '../partials/insumos/MovimientosManager.vue'
import LoteForm from '../partials/insumos/LoteForm.vue'
import LoteDetail from '../partials/insumos/LoteDetail.vue'
import LoteEditModal from '../partials/insumos/LoteEditModal.vue'
import LoteDeleteModal from '../partials/insumos/LoteDeleteModal.vue'
import { 
  CubeIcon, 
  PlusIcon, 
  TagIcon, 
  ArrowPathIcon 
} from '@heroicons/vue/24/outline'

// Servicios reales
import { InsumosModuleService, InsumoService, CategoriaInsumoService, LoteInsumoService, MovimientoInventarioService } from '../services/insumosModuleService'
import { useAuth } from '../composables/useAuth'
import { useToast } from '../composables/useToast'
import { useProveedores } from '../composables/useProveedores'

export default {
  name: 'Insumos',
  components: {
    Sidebar,
    Header,
    InsumosList,
    LotesList,
    InsumoForm,
    InsumoDetail,
    InsumoEditModal,
    InsumoDeleteModal,
    CategoriasManager,
    MovimientosManager,
    LoteForm,
    LoteDetail,
    LoteEditModal,
    LoteDeleteModal,
    CubeIcon,
    PlusIcon,
    TagIcon,
    ArrowPathIcon
  },
  setup() {
    const sidebarOpen = ref(false)
    const activeTab = ref('inventario')
    const insumoSeleccionado = ref(null)
    const mostrarModalVer = ref(false)
    const mostrarModalEditar = ref(false)
    const mostrarModalEliminar = ref(false)
    
    // Modales de lotes
    const loteSeleccionado = ref(null)
    const mostrarModalVerLote = ref(false)
    const mostrarModalEditarLote = ref(false)
    const mostrarModalEliminarLote = ref(false)
    
    // Estado de los datos
    const insumos = ref([])
    const lotes = ref([])
    const categorias = ref([])
    // proveedores se obtiene del composable useProveedores()
    const movimientos = ref([])
    const loading = ref(false)
    
    // Composables
    const { user } = useAuth()
    const usuarioId = computed(() => user.value?.id || null)
    const { addToast: showToast } = useToast()
    const { proveedoresActivos, cargarProveedoresActivos } = useProveedores()
    



    // Cargar datos iniciales
    const cargarDatos = async () => {
      console.log('🔄 INICIANDO CARGA DE DATOS...')
      loading.value = true
      
      try {
        console.log('📡 Intentando conectar con base de datos...')
        
        // Cargar proveedores activos
        await cargarProveedoresActivos()
        
        const result = await InsumosModuleService.getDashboard()
        console.log('Resultado del dashboard:', result)
        
        if (result.success) {
          insumos.value = result.data.insumos || []
          categorias.value = result.data.categorias || []
          
          // Extraer lotes de los insumos
          const todosLosLotes = []
          console.log('🔍 Extrayendo lotes de insumos...')
          insumos.value.forEach(insumo => {
            console.log(`🔍 Insumo ${insumo.nombre}:`, { 
              tieneLotes: !!insumo.lotes, 
              cantidadLotes: insumo.lotes?.length || 0,
              lotes: insumo.lotes 
            })
            if (insumo.lotes && insumo.lotes.length > 0) {
              insumo.lotes.forEach(lote => {
                todosLosLotes.push({
                  ...lote,
                  insumo_id: insumo.id
                })
              })
            }
          })
          lotes.value = todosLosLotes
          
          // Cargar movimientos
          await cargarMovimientos()
          
          console.log('✅ Datos reales cargados:', { 
            insumos: insumos.value.length, 
            categorias: categorias.value.length, 
            lotes: lotes.value.length,
            movimientos: movimientos.value.length
          })
        } else {
          console.error('❌ Error al cargar datos:', result.error)
          showToast('Error al cargar datos: ' + result.error, 'error')
          
          // Cargar datos de prueba si hay error
          console.log('⚠️ Fallback a datos de prueba...')
          await cargarDatosPrueba()
        }
      } catch (error) {
        console.error('❌ ERROR INESPERADO EN CARGA DE DATOS:', error)
        console.error('Stack trace:', error.stack)
        showToast('Error inesperado al cargar datos', 'error')
        
        // Cargar datos de prueba si hay error
        await cargarDatosPrueba()
      } finally {
        loading.value = false
        console.log('🏁 CARGA DE DATOS FINALIZADA')
      }
    }

    // Cargar movimientos de inventario
    const cargarMovimientos = async () => {
      try {
        console.log('📋 Cargando movimientos de inventario...')
        const result = await MovimientoInventarioService.getAllMovimientos()
        console.log('📋 Resultado de carga de movimientos:', result)
        
        if (result.success) {
          movimientos.value = result.data || []
          console.log('✅ Movimientos cargados:', movimientos.value.length)
          console.log('📋 Datos de movimientos:', movimientos.value)
        } else {
          console.warn('⚠️ No se pudieron cargar movimientos:', result.error)
          movimientos.value = []
        }
      } catch (error) {
        console.error('❌ Error al cargar movimientos:', error)
        console.error('Stack trace:', error.stack)
        movimientos.value = []
      }
    }

    // Cargar datos de prueba como fallback
    const cargarDatosPrueba = async () => {
      console.log('🚀 INICIANDO CARGA DE DATOS DE PRUEBA...')
      loading.value = true
      
      try {
        console.log('📦 Importando mockData...')
        // Importar datos de prueba
        const { mockInsumos, mockCategorias } = await import('../utils/mockData')
        console.log('✅ MockData importado:', { 
          mockInsumos: mockInsumos.length, 
          mockCategorias: mockCategorias.length 
        })
        
        console.log('🔄 Procesando estructura de datos...')
        // Simular estructura de datos real
        insumos.value = mockInsumos.map(insumo => {
          const insumoProcesado = {
            ...insumo,
            categorias: insumo.categorias.map(catId => ({
              id: `cat-rel-${catId}`,
              categoria: mockCategorias.find(cat => cat.id === catId)
            }))
          }
          console.log('📝 Insumo procesado:', insumoProcesado.nombre, insumoProcesado.categorias.length, 'categorías')
          return insumoProcesado
        })
        
        categorias.value = mockCategorias
        
        // Extraer lotes de los insumos
        const todosLosLotes = []
        console.log('🔍 Extrayendo lotes de insumos (datos de prueba)...')
        insumos.value.forEach(insumo => {
          console.log(`🔍 Insumo ${insumo.nombre}:`, { 
            tieneLotes: !!insumo.lotes, 
            cantidadLotes: insumo.lotes?.length || 0,
            lotes: insumo.lotes 
          })
          if (insumo.lotes && insumo.lotes.length > 0) {
            insumo.lotes.forEach(lote => {
              todosLosLotes.push({
                ...lote,
                insumo_id: insumo.id
              })
            })
          }
        })
        lotes.value = todosLosLotes
        console.log('🔍 Total de lotes extraídos (datos de prueba):', lotes.value.length)
        
        console.log('✅ DATOS DE PRUEBA CARGADOS EXITOSAMENTE:')
        console.log('   - Insumos:', insumos.value.length)
        console.log('   - Categorías:', categorias.value.length)
        console.log('   - Lotes:', lotes.value.length)
        console.log('   - Primer insumo:', insumos.value[0])
        console.log('   - Primera categoría:', categorias.value[0])
        
        showToast('Datos de prueba cargados (modo offline)', 'info')
      } catch (error) {
        console.error('❌ ERROR AL CARGAR DATOS DE PRUEBA:', error)
        console.error('Stack trace:', error.stack)
        showToast('No se pudieron cargar los datos', 'error')
      } finally {
        loading.value = false
        console.log('🏁 CARGA DE DATOS DE PRUEBA FINALIZADA')
      }
    }

    // Methods
    const guardarInsumo = async (insumoData) => {
      loading.value = true
      try {
        let result
        if (insumoData.id) {
        // Editar insumo existente
          result = await InsumoService.updateInsumo(insumoData.id, {
            ...insumoData,
            modificado_por: user.value?.id
          })
        } else {
          // Nuevo insumo - generar código primero
          const codigoResult = await InsumoService.generateCodigo(insumoData.nombre)
          if (!codigoResult.success) {
            showToast('Error al generar código: ' + codigoResult.error, 'error')
            return
          }
          
          result = await InsumoService.createInsumo({
            ...insumoData,
            codigo: codigoResult.data,
            creado_por: user.value?.id
          })
        }

        if (result.success) {
          showToast(insumoData.id ? 'Insumo actualizado correctamente' : 'Insumo creado correctamente', 'success')
          await cargarDatos() // Recargar datos
          insumoSeleccionado.value = null
          activeTab.value = 'inventario'
        } else {
          showToast('Error: ' + result.error, 'error')
          // Fallback: agregar localmente
          await guardarInsumoLocal(insumoData)
        }
      } catch (error) {
        showToast('Error inesperado al guardar insumo', 'error')
        console.error('Error:', error)
        // Fallback: agregar localmente
        await guardarInsumoLocal(insumoData)
      } finally {
        loading.value = false
      }
    }

    // Fallback para guardar insumo localmente
    const guardarInsumoLocal = async (insumoData) => {
      try {
        if (insumoData.id) {
          // Editar insumo existente
          const index = insumos.value.findIndex(i => i.id === insumoData.id)
        if (index !== -1) {
            insumos.value[index] = { ...insumos.value[index], ...insumoData }
            showToast('Insumo actualizado localmente', 'info')
        }
      } else {
        // Nuevo insumo
          const nuevoId = Date.now().toString()
          const codigo = generarCodigoLocal(insumoData.nombre)
        const nuevoInsumo = {
            ...insumoData,
          id: nuevoId,
            codigo: codigo,
          estado: 'Activo',
            lotes: [],
            categorias: insumoData.categorias.map(catId => ({
              id: `cat-rel-${catId}`,
              categoria: categorias.value.find(cat => cat.id === catId)
            }))
        }
        insumos.value.push(nuevoInsumo)
          showToast('Insumo creado localmente', 'info')
      }
      insumoSeleccionado.value = null
      activeTab.value = 'inventario'
      } catch (error) {
        console.error('Error al guardar localmente:', error)
        showToast('Error al guardar insumo', 'error')
      }
    }

    // Generar código local
    const generarCodigoLocal = (nombre) => {
      const prefijo = nombre.substring(0, 2).toUpperCase()
      const año = new Date().getFullYear()
      const correlativo = String(insumos.value.length + 1).padStart(3, '0')
      return `${prefijo}-${año}-${correlativo}`
    }

    const guardarLote = async (loteData) => {
      loading.value = true
      try {
        console.log('📦 Creando lote:', loteData)
        
        // Crear el lote con cantidad_actual = 0
        // El movimiento de entrada lo actualizará a la cantidad correcta
        const result = await LoteInsumoService.createLote({
          ...loteData,
          cantidad_actual: 0, // Iniciar en 0, el movimiento lo actualizará
          creado_por: user.value?.id
        })

        if (result.success) {
          const loteCreado = result.data
          console.log('✅ Lote creado exitosamente:', loteCreado)
          
          // Registrar automáticamente el movimiento de entrada del nuevo lote
          // Este movimiento actualizará la cantidad_actual del lote
          try {
            console.log('📝 Registrando movimiento de entrada automático...')
            const movimientoResult = await MovimientoInventarioService.createMovimiento({
              lote_id: loteCreado.id,
              tipo: 'Entrada',
              cantidad: loteData.cantidad_inicial,
              motivo: 'Ingreso de lote nuevo',
              documento: loteData.documento || null,
              costo_unitario: loteData.precio_unitario,
              costo_total: loteData.cantidad_inicial * loteData.precio_unitario,
              usuario_id: user.value?.id,
              fecha_movimiento: loteData.fecha_ingreso || new Date().toISOString(),
              observaciones: `Movimiento automático por creación de lote ${loteData.lote}`
            })

            if (movimientoResult.success) {
              console.log('✅ Movimiento de entrada registrado automáticamente')
              showToast('Lote y movimiento de entrada registrados correctamente', 'success')
            } else {
              console.warn('⚠️ Error al registrar movimiento automático:', movimientoResult.error)
              showToast('Lote creado, pero hubo un error al registrar el movimiento de entrada', 'warning')
            }
          } catch (movError) {
            console.error('❌ Error al registrar movimiento automático:', movError)
            showToast('Lote creado, pero hubo un error al registrar el movimiento de entrada', 'warning')
          }

          await cargarDatos() // Recargar datos (incluye lotes y movimientos)
          activeTab.value = 'lotes'
        } else {
          showToast('Error: ' + result.error, 'error')
        }
      } catch (error) {
        showToast('Error inesperado al crear lote', 'error')
        console.error('Error:', error)
      } finally {
        loading.value = false
      }
    }


    const verInsumo = (insumo) => {
      insumoSeleccionado.value = insumo
      mostrarModalVer.value = true
    }

    const editarInsumo = (insumo) => {
      insumoSeleccionado.value = insumo
      mostrarModalEditar.value = true
    }

    const eliminarInsumo = (insumo) => {
      insumoSeleccionado.value = insumo
      mostrarModalEliminar.value = true
    }

    // Funciones para lotes
    const verLote = (lote) => {
      console.log('Ver lote:', lote)
      loteSeleccionado.value = lote
      mostrarModalVerLote.value = true
    }

    const editarLote = (lote) => {
      console.log('Editar lote:', lote)
      loteSeleccionado.value = lote
      mostrarModalEditarLote.value = true
    }

    const editarLoteDesdeModal = (lote) => {
      cerrarModalVerLote()
      setTimeout(() => {
        editarLote(lote)
      }, 100)
    }

    const eliminarLote = (lote) => {
      console.log('Eliminar lote:', lote)
      loteSeleccionado.value = lote
      mostrarModalEliminarLote.value = true
    }

    const cerrarModalVerLote = () => {
      mostrarModalVerLote.value = false
      loteSeleccionado.value = null
    }

    const cerrarModalEditarLote = () => {
      mostrarModalEditarLote.value = false
      loteSeleccionado.value = null
    }

    const cerrarModalEliminarLote = () => {
      mostrarModalEliminarLote.value = false
      loteSeleccionado.value = null
    }

    const guardarEdicionLote = async (loteData) => {
      console.log('🔧 GUARDAR EDICIÓN LOTE CLICKED!', loteData)
      loading.value = true
      try {
        console.log('🔧 Llamando a LoteInsumoService.updateLote...')
        const result = await LoteInsumoService.updateLote(loteData.id, {
          ...loteData,
          modificado_por: user.value?.id
        })
        console.log('🔧 Resultado de updateLote:', result)

        if (result.success) {
          showToast('Lote actualizado correctamente', 'success')
          await cargarDatos() // Recargar datos
          cerrarModalEditarLote()
        } else {
          showToast('Error: ' + result.error, 'error')
        }
      } catch (error) {
        showToast('Error inesperado al actualizar lote', 'error')
        console.error('Error:', error)
      } finally {
        loading.value = false
      }
    }

    const confirmarEliminacionLote = async (lote) => {
      console.log('🗑️ CONFIRMAR ELIMINACIÓN LOTE:', lote)
      // El modal ya maneja la eliminación, solo recargamos datos
      showToast('Lote eliminado correctamente', 'success')
      await cargarDatos()
      cerrarModalEliminarLote()
    }

    const cerrarModalVer = () => {
      mostrarModalVer.value = false
      insumoSeleccionado.value = null
    }

    const cerrarModalEditar = () => {
      mostrarModalEditar.value = false
      insumoSeleccionado.value = null
    }

    const cerrarModalEliminar = () => {
      mostrarModalEliminar.value = false
      insumoSeleccionado.value = null
    }

    const guardarEdicion = async (insumoData) => {
      console.log('🔧 GUARDAR EDICIÓN CLICKED!', insumoData)
      loading.value = true
      try {
        console.log('🔧 Llamando a InsumoService.updateInsumo...')
        const result = await InsumoService.updateInsumo(insumoData.id, {
          ...insumoData,
          modificado_por: user.value?.id
        })
        console.log('🔧 Resultado de updateInsumo:', result)

        if (result.success) {
          showToast('Insumo actualizado correctamente', 'success')
          await cargarDatos() // Recargar datos
          cerrarModalEditar()
        } else {
          showToast('Error: ' + result.error, 'error')
        }
      } catch (error) {
        showToast('Error inesperado al actualizar insumo', 'error')
        console.error('Error:', error)
      } finally {
        loading.value = false
      }
    }

    const confirmarEliminacion = async (insumo) => {
      loading.value = true
      try {
        const result = await InsumoService.deleteInsumo(insumo.id, user.value?.id)
        
        if (result.success) {
          showToast('Insumo eliminado correctamente', 'success')
          await cargarDatos() // Recargar datos
          cerrarModalEliminar()
        } else {
          showToast('Error: ' + result.error, 'error')
        }
      } catch (error) {
        showToast('Error inesperado al eliminar insumo', 'error')
        console.error('Error:', error)
      } finally {
        loading.value = false
      }
    }


    const registrarMovimiento = async (movimientoData) => {
      loading.value = true
      try {
        console.log('📝 Registrando movimiento:', movimientoData)
        
        const result = await MovimientoInventarioService.createMovimiento({
          lote_id: movimientoData.loteId,
          tipo: movimientoData.tipo,
          cantidad: movimientoData.cantidad,
          motivo: movimientoData.motivo,
          documento: movimientoData.documento || null,
          lote_origen_id: movimientoData.loteOrigenId || null,
          lote_destino_id: movimientoData.loteDestinoId || null,
          costo_unitario: movimientoData.costoUnitario || null,
          costo_total: movimientoData.costoTotal || null,
          usuario_id: user.value?.id,
          fecha_movimiento: movimientoData.fecha || new Date().toISOString(),
          observaciones: movimientoData.observaciones || null
        })

        if (result.success) {
          showToast('Movimiento registrado correctamente', 'success')
          await cargarDatos() // Recargar datos (incluye movimientos y lotes actualizados)
          activeTab.value = 'movimientos'
        } else {
          showToast('Error: ' + result.error, 'error')
          // Si el error es de cantidad negativa, mostrar mensaje específico
          if (result.error.includes('negativa')) {
            showToast('La cantidad resultante no puede ser negativa. Verifica el stock disponible.', 'warning')
          }
        }
      } catch (error) {
        showToast('Error inesperado al registrar movimiento', 'error')
        console.error('Error:', error)
      } finally {
        loading.value = false
      }
    }

    const movimientoActualizado = async (movimiento) => {
      console.log('📝 Movimiento actualizado:', movimiento)
      // Recargar datos para reflejar los cambios
      await cargarDatos()
    }

    const movimientoEliminado = async (movimiento) => {
      console.log('🗑️ Movimiento eliminado:', movimiento)
      // Recargar datos para reflejar los cambios
      await cargarDatos()
    }

    const guardarCategoria = async (categoriaData) => {
      loading.value = true
      try {
        let result
        if (categoriaData.id) {
          // Editar categoría existente
          result = await CategoriaInsumoService.updateCategoria(categoriaData.id, {
            ...categoriaData,
            modificado_por: user.value?.id
          })
        } else {
          // Nueva categoría
          result = await CategoriaInsumoService.createCategoria({
            ...categoriaData,
            creado_por: user.value?.id
          })
        }

        if (result.success) {
          showToast(categoriaData.id ? 'Categoría actualizada correctamente' : 'Categoría creada correctamente', 'success')
          await cargarDatos() // Recargar datos
          // Se mantiene en el tab de categorías
        } else {
          showToast('Error: ' + result.error, 'error')
          // Fallback: guardar localmente si falla Supabase
          await guardarCategoriaLocal(categoriaData)
        }
      } catch (error) {
        showToast('Error inesperado al guardar categoría', 'error')
        console.error('Error:', error)
        // Fallback: guardar localmente
        await guardarCategoriaLocal(categoriaData)
      } finally {
        loading.value = false
      }
    }

    // Fallback para guardar categoría localmente
    const guardarCategoriaLocal = async (categoriaData) => {
      try {
        if (categoriaData.id) {
          // Editar categoría existente
          const index = categorias.value.findIndex(c => c.id === categoriaData.id)
          if (index !== -1) {
            categorias.value[index] = { ...categorias.value[index], ...categoriaData }
            showToast('Categoría actualizada localmente', 'info')
          }
        } else {
          // Nueva categoría
          const nuevoId = Date.now().toString()
          const nuevaCategoria = {
            ...categoriaData,
            id: nuevoId
          }
          categorias.value.push(nuevaCategoria)
          showToast('Categoría creada localmente', 'info')
        }
        // Se mantiene en el tab de categorías
      } catch (error) {
        console.error('Error al guardar localmente:', error)
      }
    }

    const eliminarCategoria = async (categoria) => {
      if (!confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
        return
      }

      loading.value = true
      try {
        const result = await CategoriaInsumoService.deleteCategoria(categoria.id, user.value?.id)
        
        if (result.success) {
          showToast('Categoría eliminada correctamente', 'success')
          await cargarDatos() // Recargar datos
        } else {
          showToast('Error: ' + result.error, 'error')
          // Si hay error pero es por insumos asociados, informar mejor
          if (result.error.includes('insumos asociados')) {
            showToast('No se puede eliminar la categoría porque tiene insumos asociados', 'warning')
          }
        }
      } catch (error) {
        showToast('Error inesperado al eliminar categoría', 'error')
        console.error('Error:', error)
        // Fallback: eliminar localmente
        const index = categorias.value.findIndex(c => c.id === categoria.id)
        if (index !== -1) {
          categorias.value.splice(index, 1)
          showToast('Categoría eliminada localmente', 'info')
        }
      } finally {
        loading.value = false
      }
    }

    // Cargar datos al montar el componente
    onMounted(() => {
      console.log('🎯 COMPONENTE MONTADO - Iniciando carga de datos...')
      console.log('📊 Estado inicial:', {
        insumos: insumos.value.length,
        categorias: categorias.value.length,
        loading: loading.value,
        user: user.value?.id || 'No logueado'
      })
      cargarDatos()
    })

    return {
      usuarioId,
      sidebarOpen,
      activeTab,
      insumoSeleccionado,
      mostrarModalVer,
      mostrarModalEditar,
      mostrarModalEliminar,
      loteSeleccionado,
      mostrarModalVerLote,
      mostrarModalEditarLote,
      mostrarModalEliminarLote,
      loading,
      insumos,
      lotes,
      categorias,
      proveedoresActivos,
      movimientos,
      guardarInsumo,
      guardarLote,
      verInsumo,
      editarInsumo,
      eliminarInsumo,
      verLote,
      editarLote,
      editarLoteDesdeModal,
      eliminarLote,
      cerrarModalVer,
      cerrarModalEditar,
      cerrarModalEliminar,
      cerrarModalVerLote,
      cerrarModalEditarLote,
      cerrarModalEliminarLote,
      guardarEdicion,
      guardarEdicionLote,
      confirmarEliminacion,
      confirmarEliminacionLote,
      registrarMovimiento,
      movimientoActualizado,
      movimientoEliminado,
      guardarCategoria,
      eliminarCategoria,
      cargarDatos,
      cargarDatosPrueba
    }
  }
}
</script>

<style scoped>
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

.tab-content {
  min-height: 400px;
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
</style> 