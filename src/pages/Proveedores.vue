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

          <!-- Dashboard actions -->
          <div class="sm:flex sm:justify-between sm:items-center mb-8">

            <!-- Left: Title -->
            <div class="mb-4 sm:mb-0">
              <h1 class="text-2xl md:text-3xl text-gray-100 font-bold">Gestión de Proveedores</h1>
            </div>

            <!-- Right: Actions -->
            <div class="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
              <button 
                v-permission="{ vista: 'Proveedores', operacion: 'crear' }"
                @click="activeTab = 'registrar'"
                class="btn bg-black text-gray-100 hover:bg-zinc-800 border border-[#CCCCCC]"
              >
                <svg class="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                  <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                </svg>
                <span class="hidden xs:block ml-2">Nuevo Proveedor</span>
              </button>
            </div>

          </div>

          <!-- Tabs -->
          <div class="mb-8">
            <div class="border-b border-gray-700">
              <nav class="-mb-px flex space-x-8">
                <button
                  @click="activeTab = 'lista'"
                  class="py-2 px-1 border-b-2 font-medium text-sm"
                  :class="activeTab === 'lista' ? 'border-violet-500 text-amber-500' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-zinc-700/50'"
                >
                  Lista de Proveedores
                </button>
                <button
                  @click="activeTab = 'registrar'"
                  class="py-2 px-1 border-b-2 font-medium text-sm"
                  :class="activeTab === 'registrar' ? 'border-violet-500 text-amber-500' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-zinc-700/50'"
                >
                  Registrar Proveedor
                </button>
                <button
                  @click="activeTab = 'evaluaciones'"
                  class="py-2 px-1 border-b-2 font-medium text-sm"
                  :class="activeTab === 'evaluaciones' ? 'border-violet-500 text-amber-500' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-zinc-700/50'"
                >
                  Evaluaciones
                </button>
              </nav>
            </div>
          </div>

          <!-- Tab Content -->
          <div class="space-y-6">
            <!-- Lista de Proveedores -->
            <div v-if="activeTab === 'lista'">
              <ProveedoresList 
                :proveedores="proveedores" 
                @editar-proveedor="editarProveedor"
                @ver-detalle="verDetalle"
                @cambiar-estado="cambiarEstado"
                @evaluar="evaluarProveedor"
              />
            </div>

            <!-- Registrar Proveedor -->
            <div v-if="activeTab === 'registrar'">
              <ProveedorForm 
                :proveedor="proveedorEnEdicion"
                @guardar="guardarProveedor"
                @cancelar="cancelarEdicion"
              />
            </div>

            <!-- Evaluaciones -->
            <div v-if="activeTab === 'evaluaciones'">
              <ProveedorEvaluacion
                ref="evaluacionComponent"
                :proveedores="proveedores"
                @evaluar="guardarEvaluacion"
              />
            </div>
          </div>

        </div>
      </main>

    </div>

    <!-- Modales -->
    <ProveedorDetailModal
      :show="mostrarModalDetalle"
      :proveedor-id="proveedorIdSeleccionado"
      @cerrar="cerrarModalDetalle"
      @editar="abrirEdicionDesdeDetalle"
    />

    <ProveedorEditModal
      :show="mostrarModalEdicion"
      :proveedor="proveedorSeleccionado"
      @cerrar="cerrarModalEdicion"
      @guardar="guardarEdicionDesdeModal"
    />

  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import Sidebar from '../partials/Sidebar.vue'
import Header from '../partials/Header.vue'
import ProveedoresList from '../partials/proveedores/ProveedoresList.vue'
import ProveedorForm from '../partials/proveedores/ProveedorForm.vue'
import ProveedorEvaluacion from '../partials/proveedores/ProveedorEvaluacion.vue'
import ProveedorDetailModal from '../partials/proveedores/ProveedorDetailModal.vue'
import ProveedorEditModal from '../partials/proveedores/ProveedorEditModal.vue'
import { useToast } from '../composables/useToast'
import proveedorService from '../services/proveedorService'

export default {
  name: 'Proveedores',
  components: {
    Sidebar,
    Header,
    ProveedoresList,
    ProveedorForm,
    ProveedorEvaluacion,
    ProveedorDetailModal,
    ProveedorEditModal,
  },
  setup() {
    const sidebarOpen = ref(false)
    const activeTab = ref('lista')
    const proveedorEnEdicion = ref(null)
    const proveedores = ref([])
    const cargando = ref(false)
    const { success, error: showError } = useToast()

    // Estados de los modales
    const mostrarModalDetalle = ref(false)
    const mostrarModalEdicion = ref(false)
    const proveedorIdSeleccionado = ref(null)
    const proveedorSeleccionado = ref(null)

    // Referencia al componente de evaluación
    const evaluacionComponent = ref(null)

    // Cargar proveedores desde el backend
    const cargarProveedores = async () => {
      try {
        cargando.value = true
        const data = await proveedorService.obtenerProveedores()
        proveedores.value = data
      } catch (error) {
        console.error('Error al cargar proveedores:', error)
        showError('Error al cargar los proveedores')
      } finally {
        cargando.value = false
      }
    }

    // Cargar proveedores al montar el componente
    onMounted(() => {
      cargarProveedores()
    })

    // Datos mock de proveedores (mantenidos como fallback)
    const proveedoresMock = reactive([
      {
        id: 1,
        codigo: 'PROV-001',
        nombre: 'Distribuidora San José',
        tipo: 'Carnes y Embutidos',
        estado: 'Activo',
        telefono: '22345678',
        email: 'ventas@distribsj.com',
        direccion: 'San José Centro, 200m norte del teatro',
        ultimaCompra: '2024-01-15',
        calificacion: 4.5,
        insumos: [
          { nombre: 'Carne molida', precio: 3500, unidad: 'kg' },
          { nombre: 'Pollo entero', precio: 2800, unidad: 'kg' },
          { nombre: 'Chorizo', precio: 4200, unidad: 'kg' }
        ],
        evaluaciones: [
          { fecha: '2024-01-15', puntualidad: 5, calidad: 4, servicio: 5, comentario: 'Excelente entrega' },
          { fecha: '2024-01-10', puntualidad: 4, calidad: 5, servicio: 4, comentario: 'Producto de muy buena calidad' }
        ]
      },
      {
        id: 2,
        codigo: 'PROV-002',
        nombre: 'Verduras Frescas del Valle',
        tipo: 'Frutas y Verduras',
        estado: 'Activo',
        telefono: '22456789',
        email: 'pedidos@verdurasvalle.com',
        direccion: 'Heredia Centro, 100m este del parque',
        ultimaCompra: '2024-01-14',
        calificacion: 4.8,
        insumos: [
          { nombre: 'Cebolla', precio: 800, unidad: 'kg' },
          { nombre: 'Tomate', precio: 1200, unidad: 'kg' },
          { nombre: 'Papa', precio: 600, unidad: 'kg' },
          { nombre: 'Zanahoria', precio: 900, unidad: 'kg' }
        ],
        evaluaciones: [
          { fecha: '2024-01-14', puntualidad: 5, calidad: 5, servicio: 5, comentario: 'Productos muy frescos' }
        ]
      },
      {
        id: 3,
        codigo: 'PROV-003',
        nombre: 'Lácteos Central',
        tipo: 'Lácteos y Derivados',
        estado: 'Activo',
        telefono: '22567890',
        email: 'compras@lacteoscentral.com',
        direccion: 'Alajuela, 300m norte del hospital',
        ultimaCompra: '2024-01-13',
        calificacion: 4.2,
        insumos: [
          { nombre: 'Leche entera', precio: 1200, unidad: 'L' },
          { nombre: 'Queso mozzarella', precio: 4500, unidad: 'kg' },
          { nombre: 'Crema', precio: 2800, unidad: 'L' }
        ],
        evaluaciones: [
          { fecha: '2024-01-13', puntualidad: 4, calidad: 4, servicio: 4, comentario: 'Buen servicio' }
        ]
      },
      {
        id: 4,
        codigo: 'PROV-004',
        nombre: 'Harinas del Norte',
        tipo: 'Granos y Harinas',
        estado: 'Inactivo',
        telefono: '22678901',
        email: 'ventas@harinasnorte.com',
        direccion: 'San Carlos, 500m este del centro',
        ultimaCompra: '2023-12-20',
        calificacion: 3.8,
        insumos: [
          { nombre: 'Harina de trigo', precio: 1800, unidad: 'kg' },
          { nombre: 'Harina de maíz', precio: 1500, unidad: 'kg' }
        ],
        evaluaciones: [
          { fecha: '2023-12-20', puntualidad: 3, calidad: 4, servicio: 3, comentario: 'Atrasos frecuentes' }
        ]
      },
      {
        id: 5,
        codigo: 'PROV-005',
        nombre: 'Especias del Mundo',
        tipo: 'Condimentos y Especias',
        estado: 'Activo',
        telefono: '22789012',
        email: 'pedidos@especiasmundo.com',
        direccion: 'Cartago, 150m sur del mercado',
        ultimaCompra: '2024-01-12',
        calificacion: 4.6,
        insumos: [
          { nombre: 'Sal', precio: 500, unidad: 'kg' },
          { nombre: 'Pimienta', precio: 3500, unidad: 'kg' },
          { nombre: 'Orégano', precio: 2800, unidad: 'kg' },
          { nombre: 'Comino', precio: 3200, unidad: 'kg' }
        ],
        evaluaciones: [
          { fecha: '2024-01-12', puntualidad: 5, calidad: 4, servicio: 5, comentario: 'Especias de excelente calidad' }
        ]
      }
    ])

    // Métodos de modales
    const verDetalle = (proveedor) => {
      proveedorIdSeleccionado.value = proveedor.id
      mostrarModalDetalle.value = true
    }

    const editarProveedor = (proveedor) => {
      proveedorSeleccionado.value = proveedor
      mostrarModalEdicion.value = true
    }

    const cerrarModalDetalle = () => {
      mostrarModalDetalle.value = false
      proveedorIdSeleccionado.value = null
    }

    const cerrarModalEdicion = () => {
      mostrarModalEdicion.value = false
      proveedorSeleccionado.value = null
    }

    const abrirEdicionDesdeDetalle = (proveedor) => {
      cerrarModalDetalle()
      editarProveedor(proveedor)
    }

    const cambiarEstado = async (proveedor) => {
      try {
        const nuevoEstado = proveedor.estado === 'Activo' ? 'Inactivo' : 'Activo'
        await proveedorService.actualizarProveedor(proveedor.id, { estado: nuevoEstado })
        
        // Actualizar en la lista local
        const index = proveedores.value.findIndex(p => p.id === proveedor.id)
        if (index !== -1) {
          proveedores.value[index].estado = nuevoEstado
        }

        success(`Proveedor ${nuevoEstado === 'Activo' ? 'activado' : 'desactivado'} correctamente`)
      } catch (error) {
        console.error('Error al cambiar estado:', error)
        showError('Error al cambiar el estado')
      }
    }

    const evaluarProveedor = (proveedor) => {
      // Navegar al tab de evaluaciones
      activeTab.value = 'evaluaciones'
    }

    const guardarEvaluacion = async (evaluacionData) => {
      try {
        cargando.value = true

        if (evaluacionData.id) {
          // Actualizar evaluación existente
          await proveedorService.actualizarEvaluacion(evaluacionData.id, evaluacionData)
          success('Evaluación actualizada correctamente')
        } else {
          // Crear nueva evaluación
          await proveedorService.crearEvaluacionProveedor(evaluacionData)
          success('Evaluación guardada correctamente')
        }

        // Recargar proveedores para obtener la calificación actualizada
        await cargarProveedores()

        // Refrescar las evaluaciones en el componente hijo
        if (evaluacionComponent.value) {
          await evaluacionComponent.value.refrescarEvaluaciones()
        }
      } catch (error) {
        console.error('Error al guardar evaluación:', error)
        showError(error.message || 'Error al guardar la evaluación')
      } finally {
        cargando.value = false
      }
    }

    const guardarProveedor = async (proveedor) => {
      try {
        cargando.value = true
        
        if (proveedorEnEdicion.value && proveedorEnEdicion.value.id) {
          // Actualizar proveedor existente
          const actualizado = await proveedorService.actualizarProveedor(proveedorEnEdicion.value.id, proveedor)

          // Actualizar en la lista local
          const index = proveedores.value.findIndex(p => p.id === actualizado.id)
          if (index !== -1) {
            proveedores.value[index] = actualizado
          }

          success('Proveedor actualizado correctamente')
        } else {
          // Crear nuevo proveedor
          const nuevo = await proveedorService.crearProveedor(proveedor)
          proveedores.value.push(nuevo)
          success('Proveedor creado correctamente')
        }

        proveedorEnEdicion.value = null
        activeTab.value = 'lista'
      } catch (error) {
        console.error('Error al guardar proveedor:', error)
        showError(error.message || 'Error al guardar el proveedor')
      } finally {
        cargando.value = false
      }
    }

    const guardarEdicionDesdeModal = async (id, proveedorData) => {
      try {
        cargando.value = true
        
        const actualizado = await proveedorService.actualizarProveedor(id, proveedorData)

        // Actualizar en la lista local
        const index = proveedores.value.findIndex(p => p.id === actualizado.id)
        if (index !== -1) {
          proveedores.value[index] = actualizado
        }

        cerrarModalEdicion()
        success('Proveedor actualizado correctamente')
      } catch (error) {
        console.error('Error al actualizar proveedor:', error)
        showError(error.message || 'Error al actualizar el proveedor')
      } finally {
        cargando.value = false
      }
    }

    const cancelarEdicion = () => {
      proveedorEnEdicion.value = null
      activeTab.value = 'lista'
    }

    return {
      sidebarOpen,
      activeTab,
      proveedores,
      proveedorEnEdicion,
      cargando,
      mostrarModalDetalle,
      mostrarModalEdicion,
      proveedorIdSeleccionado,
      proveedorSeleccionado,
      evaluacionComponent,
      editarProveedor,
      verDetalle,
      cambiarEstado,
      evaluarProveedor,
      guardarProveedor,
      guardarEvaluacion,
      guardarEdicionDesdeModal,
      cancelarEdicion,
      cargarProveedores,
      cerrarModalDetalle,
      cerrarModalEdicion,
      abrirEdicionDesdeDetalle
    }
  }
}
</script> 