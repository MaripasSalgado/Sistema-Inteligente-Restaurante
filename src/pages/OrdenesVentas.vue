<template>
  <div class="flex h-screen overflow-hidden ordenes-ventas-page">

    <!-- Sidebar -->
    <Sidebar :sidebarOpen="sidebarOpen" @close-sidebar="sidebarOpen = false" />

    <!-- Content area -->
    <div class="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
      
      <!-- Site header -->
      <Header :sidebarOpen="sidebarOpen" @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <main class="grow">
        <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

          <!-- Header -->
          <div class="sm:flex sm:justify-between sm:items-center mb-8">
            <div class="mb-4 sm:mb-0">
              <h1 class="text-2xl md:text-3xl text-gray-100 font-bold">Órdenes y Ventas</h1>
              <p class="text-gray-400 mt-1">Gestión de ventas y órdenes del restaurante</p>
            </div>
            <div class="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
              <button
                @click="abrirFormularioCrear"
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-black bg-yellow-400 hover:bg-yellow-500 rounded-lg transition-colors border-0"
              >
                <svg class="w-4 h-4 fill-current shrink-0" viewBox="0 0 16 16">
                  <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                </svg>
                <span class="hidden xs:block ml-2">Nueva Venta</span>
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
                      <span class="text-black font-bold">💰</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-300">Ventas Hoy</p>
                    <p class="text-2xl font-bold text-white">{{ estadisticas.ventasHoy }}</p>
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
                    <p class="text-sm font-medium text-gray-300">Ingresos Hoy</p>
                    <p class="text-2xl font-bold text-white">₡{{ estadisticas.ingresosHoy }}</p>
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
                    <p class="text-sm font-medium text-gray-300">Promedio Ticket</p>
                    <p class="text-2xl font-bold text-white">₡{{ estadisticas.promedioTicket }}</p>
                  </div>
                </div>
              </div>

              <div style="background-color: rgb(24 24 27 / 0.8);" class="border border-zinc-700/50 rounded-lg p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span class="text-black font-bold">🎯</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-300">Producto Más Vendido</p>
                    <p class="text-lg font-bold text-white">{{ estadisticas.productoMasVendido }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Ventas Recientes -->
            <div style="background-color: rgb(24 24 27 / 0.8);" class="border border-zinc-700/50 rounded-lg p-6">
              <h3 class="text-lg font-medium text-white mb-4">Ventas Recientes</h3>
              <div class="space-y-3">
                <div
                  v-for="venta in ventasRecientes"
                  :key="venta.id"
                  class="flex items-center justify-between p-3 border border-zinc-700/50 rounded-lg hover:border-yellow-400 transition-colors cursor-pointer"
                  style="background-color: rgb(39 39 42);"
                  @click="verVenta(venta)"
                >
                  <div class="flex items-center">
                    <div class="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                    <div>
                      <p class="text-white font-medium">{{ venta.cliente }}</p>
                      <p class="text-sm text-gray-400">{{ venta.productos.length }} productos</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-yellow-400 font-bold">₡{{ venta.total }}</p>
                    <p class="text-sm text-gray-400">{{ venta.fechaLegible || venta.fecha || '-' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Lista de Ventas -->
          <div v-if="tabActivo === 'lista'" class="space-y-6">
            <VentasList 
              :ventas="ventas"
              @editar-venta="editarVenta"
              @ver-venta="verVenta"
              @eliminar-venta="eliminarVenta"
            />
          </div>

          <!-- Nueva Venta -->
          <div v-if="tabActivo === 'nueva'" class="space-y-6">
            <!-- Stock Warnings Component -->
            <StockWarnings :warnings="stockWarnings" />

            <VentaForm
              :venta="ventaSeleccionada"
              :productos="productos"
              :guardando="guardandoVenta"
              @guardar="guardarVenta"
              @cancelar="cerrarFormulario"
            />
          </div>

          <!-- Reportes -->
          <div v-if="tabActivo === 'reportes'" class="space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div style="background-color: rgb(24 24 27 / 0.8);" class="border border-zinc-700/50 rounded-lg p-6">
                <h3 class="text-lg font-medium text-white mb-4">Ventas por Día</h3>
                <div class="space-y-3">
                  <div
                    v-for="reporte in reportesPorDia"
                    :key="reporte.fecha"
                    class="flex items-center justify-between"
                  >
                    <span class="text-white">{{ reporte.fecha }}</span>
                    <div class="flex items-center space-x-4">
                      <span class="text-gray-300">{{ reporte.cantidad }} ventas</span>
                      <span class="text-yellow-400">₡{{ reporte.total }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div style="background-color: rgb(24 24 27 / 0.8);" class="border border-zinc-700/50 rounded-lg p-6">
                <h3 class="text-lg font-medium text-white mb-4">Productos Más Vendidos</h3>
                <div class="space-y-3">
                  <div
                    v-for="producto in productosMasVendidos"
                    :key="producto.nombre"
                    class="flex items-center justify-between"
                  >
                    <span class="text-white">{{ producto.nombre }}</span>
                    <span class="text-yellow-400">{{ producto.cantidad }} unidades</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

    </div>

    <!-- Modal de Detalle -->
    <VentaDetail
      v-if="mostrarDetalle"
      :venta="ventaSeleccionada"
      @cerrar="cerrarDetalle"
      @editar="editarVenta"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import Sidebar from '../partials/Sidebar.vue'
import Header from '../partials/Header.vue'
import VentasList from '../partials/ventas/VentasList.vue'
import VentaForm from '../partials/ventas/VentaForm.vue'
import VentaDetail from '../partials/ventas/VentaDetail.vue'
import StockWarnings from '../partials/ventas/StockWarnings.vue'
import VentaService from '@/services/ventaService'
import { ProductoService } from '@/services/productoService'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'

const formatDate = (fecha) => {
  if (!fecha) return '-'
  const date = new Date(fecha)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('es-CR', { timeZone: 'America/Costa_Rica' })
}

const formatTime = (fecha) => {
  if (!fecha) return '--:--'
  const date = new Date(fecha)
  if (Number.isNaN(date.getTime())) return '--:--'
  return date.toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Costa_Rica' })
}

export default {
  name: 'OrdenesVentas',
  components: {
    Sidebar,
    Header,
    VentasList,
    VentaForm,
    VentaDetail,
    StockWarnings
  },
  setup() {
    const sidebarOpen = ref(false)
    const tabActivo = ref('dashboard')
    const mostrarDetalle = ref(false)
    const ventaSeleccionada = ref(null)
    const ventas = ref([])
    const productos = ref([])
    const loading = ref(false)
    const guardandoVenta = ref(false)
    const stockWarnings = ref([])

    const { user } = useAuth()
    const { addToast: showToast } = useToast()
    const usuarioId = computed(() => user.value?.id || null)

    const tabs = [
      { id: 'dashboard', nombre: 'Dashboard' },
      { id: 'lista', nombre: 'Todas las Ventas' },
      { id: 'nueva', nombre: 'Nueva Venta' },
      { id: 'reportes', nombre: 'Reportes' }
    ]

    const mapVentaRecord = (venta) => {
      const detalles = (venta.detalles || []).map(detalle => ({
        id: detalle.producto_id || detalle.id,
        detalleId: detalle.id,
        productoId: detalle.producto_id,
        nombre: detalle.producto?.nombre || 'Producto sin nombre',
        cantidad: Number(detalle.cantidad) || 0,
        precioUnitario: Number(detalle.precio_unitario) || 0,
        subtotal: Number(detalle.subtotal) || 0,
        descuento: Number(detalle.descuento) || 0,
        observaciones: detalle.observaciones || null
      }))

      const vendedorNombre = venta.vendedor
        ? `${venta.vendedor.nombre || ''} ${venta.vendedor.apellido || ''}`.trim()
        : ''

      const fechaISO = venta.fecha_venta
        ? new Date(venta.fecha_venta).toLocaleDateString('en-CA', { timeZone: 'America/Costa_Rica' })
        : ''

      return {
        id: venta.id,
        numeroOrden: venta.numero_orden,
        cliente: venta.cliente_nombre || venta.cliente?.nombre || 'Cliente sin nombre',
        clienteNombre: venta.cliente_nombre || venta.cliente?.nombre || 'Cliente sin nombre',
        telefono: venta.cliente_telefono || venta.cliente?.telefono || '',
        clienteId: venta.cliente_id || venta.cliente?.id || null,
        direccion: venta.direccion_entrega || venta.cliente?.direccion || '',
        tipoVenta: venta.tipo_venta,
        estado: venta.estado,
        metodoPago: venta.metodo_pago,
        subtotal: Number(venta.subtotal) || 0,
        descuento: Number(venta.descuento) || 0,
        impuesto: Number(venta.impuestos) || 0,
        total: Number(venta.total) || 0,
        fechaVenta: venta.fecha_venta,
        fecha: fechaISO,
        fechaLegible: formatDate(venta.fecha_venta),
        hora: formatTime(venta.fecha_venta),
        productos: detalles,
        notas: venta.observaciones || '',
        observaciones: venta.observaciones || '',
        empleado: vendedorNombre || 'Sin asignar',
        vendedorId: venta.vendedor_id || null
      }
    }

    const cargarProductos = async () => {
      const result = await ProductoService.getAllProductos({ activo: true })
      if (result.success) {
        productos.value = (result.data || []).map(producto => ({
          id: producto.id,
          nombre: producto.nombre,
          precioVenta: Number(producto.precio_venta) || 0,
          precio_venta: Number(producto.precio_venta) || 0,
          activo: producto.activo,
          estado: producto.activo ? 'Activo' : 'Inactivo',
          categoria: producto.categoria
        }))
      } else if (result.error) {
        showToast('Error al cargar productos: ' + result.error, 'error')
      }
    }

    const cargarVentas = async () => {
      const result = await VentaService.getAllVentas()
      if (result.success) {
        ventas.value = (result.data || []).map(mapVentaRecord)
      } else if (result.error) {
        showToast('Error al cargar ventas: ' + result.error, 'error')
      }
    }

    const cargarDatos = async () => {
      loading.value = true
      try {
        await Promise.all([cargarProductos(), cargarVentas()])
      } catch (error) {
        console.error('❌ Error cargando ventas:', error)
        showToast('Error inesperado al cargar ventas', 'error')
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      cargarDatos()
    })

    const estadisticas = computed(() => {
      if (!ventas.value.length) {
        return {
          ventasHoy: 0,
          ingresosHoy: '0.00',
          promedioTicket: '0.00',
          productoMasVendido: 'Sin datos'
        }
      }

      const hoy = new Date().toISOString().split('T')[0]
      const ventasHoy = ventas.value.filter(venta => {
        if (!venta.fechaVenta) return false
        return new Date(venta.fechaVenta).toISOString().split('T')[0] === hoy
      })

      const ingresosHoy = ventasHoy.reduce((sum, venta) => sum + (venta.total || 0), 0)
      const totalVentas = ventas.value.reduce((sum, venta) => sum + (venta.total || 0), 0)
      const promedioTicket = ventas.value.length ? (totalVentas / ventas.value.length).toFixed(2) : '0.00'

      const productosVendidos = {}
      ventas.value.forEach(venta => {
        venta.productos.forEach(producto => {
          productosVendidos[producto.nombre] = (productosVendidos[producto.nombre] || 0) + (producto.cantidad || 0)
        })
      })

      const productoMasVendido = Object.keys(productosVendidos).length
        ? Object.entries(productosVendidos).sort((a, b) => b[1] - a[1])[0][0]
        : 'Sin datos'

      return {
        ventasHoy: ventasHoy.length,
        ingresosHoy: ingresosHoy.toFixed(2),
        promedioTicket,
        productoMasVendido
      }
    })

    const ventasRecientes = computed(() => {
      return [...ventas.value]
        .sort((a, b) => new Date(b.fechaVenta || b.fecha) - new Date(a.fechaVenta || a.fecha))
        .slice(0, 5)
    })

    const reportesPorDia = computed(() => {
      const reportes = {}
      ventas.value.forEach(venta => {
        const fecha = venta.fecha || formatDate(venta.fechaVenta)
        if (!reportes[fecha]) {
          reportes[fecha] = { cantidad: 0, total: 0 }
        }
        reportes[fecha].cantidad += 1
        reportes[fecha].total += venta.total || 0
      })

      return Object.entries(reportes)
        .map(([fecha, data]) => ({
          fecha,
          cantidad: data.cantidad,
          total: data.total.toFixed(2)
        }))
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, 7)
    })

    const productosMasVendidos = computed(() => {
      const productosVendidos = {}
      ventas.value.forEach(venta => {
        venta.productos.forEach(producto => {
          productosVendidos[producto.nombre] = (productosVendidos[producto.nombre] || 0) + (producto.cantidad || 0)
        })
      })

      return Object.entries(productosVendidos)
        .map(([nombre, cantidad]) => ({ nombre, cantidad }))
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 5)
    })

    const abrirFormularioCrear = () => {
      if (!productos.value.length) {
        showToast('Debes tener al menos un producto activo para registrar ventas', 'warning')
        return
      }
      ventaSeleccionada.value = null
      tabActivo.value = 'nueva'
    }

    const verVenta = (venta) => {
      ventaSeleccionada.value = venta
      mostrarDetalle.value = true
    }

    const editarVenta = (venta) => {
      ventaSeleccionada.value = venta
      mostrarDetalle.value = false
      tabActivo.value = 'nueva'
    }

    const buildVentaPayload = (venta) => {
      const detalles = (venta.productos || [])
        .filter(producto => producto.productoId || producto.id)
        .map(producto => ({
          producto_id: producto.productoId || producto.id,
          cantidad: Number(producto.cantidad) || 0,
          precio_unitario: Number(producto.precioUnitario) || 0,
          descuento: Number(producto.descuento) || 0,
          subtotal: Number(producto.precioUnitario) * Number(producto.cantidad) || 0,
          observaciones: producto.observaciones || null
        }))

      return {
        cliente_nombre: venta.cliente || null,
        cliente_telefono: venta.telefono || null,
        direccion_entrega: venta.direccion || null,
        tipo_venta: venta.tipoVenta,
        estado: venta.estado,
        metodo_pago: venta.metodoPago,
        subtotal: Number(venta.subtotal) || 0,
        descuento: Number(venta.descuento) || 0,
        impuestos: Number(venta.impuesto) || 0,
        total: Number(venta.total) || 0,
        observaciones: venta.notas || null,
        vendedor_id: usuarioId.value,
        creado_por: usuarioId.value,
        modificado_por: usuarioId.value,
        detalles
      }
    }

    const guardarVenta = async (venta) => {
      if (!usuarioId.value) {
        showToast('Debes iniciar sesión para registrar ventas', 'error')
        return
      }

      if (!venta.productos || !venta.productos.length) {
        showToast('Agrega al menos un producto a la venta', 'warning')
        return
      }

      guardandoVenta.value = true
      try {
        const payload = buildVentaPayload(venta)
        let result
        if (venta.id) {
          result = await VentaService.updateVenta(venta.id, payload)
        } else {
          result = await VentaService.createVenta(payload)
        }

        if (result.success) {
          // Mostrar mensaje de éxito
          showToast(venta.id ? 'Venta actualizada correctamente' : 'Venta creada correctamente', 'success')

          // Verificar si hay warnings de stock
          if (result.warnings && result.warnings.length > 0) {
            stockWarnings.value = result.warnings
            // Mostrar toast adicional para advertencia de stock
            showToast(`Advertencia: ${result.warnings.length} insumo(s) con stock insuficiente`, 'warning')
          } else {
            stockWarnings.value = []
          }

          // Recargar ventas
          await cargarVentas()

          // Solo cerrar formulario y cambiar tab si NO hay warnings (o si el usuario ya los vio)
          ventaSeleccionada.value = null
          tabActivo.value = 'lista'
        } else if (result.error) {
          showToast('Error al guardar venta: ' + result.error, 'error')
        }
      } catch (error) {
        console.error('❌ Error al guardar venta:', error)
        showToast('Error inesperado al guardar venta', 'error')
      } finally {
        guardandoVenta.value = false
      }
    }

    const eliminarVenta = async (venta) => {
      try {
        const result = await VentaService.deleteVenta(venta.id)
        if (result.success) {
          showToast('Venta eliminada correctamente', 'success')
          await cargarVentas()
        } else if (result.error) {
          showToast('Error al eliminar venta: ' + result.error, 'error')
        }
      } catch (error) {
        console.error('❌ Error al eliminar venta:', error)
        showToast('Error inesperado al eliminar venta', 'error')
      }
    }

    const cerrarFormulario = () => {
      ventaSeleccionada.value = null
      tabActivo.value = 'lista'
    }

    const cerrarDetalle = () => {
      mostrarDetalle.value = false
      ventaSeleccionada.value = null
    }

    return {
      sidebarOpen,
      tabActivo,
      tabs,
      mostrarDetalle,
      ventaSeleccionada,
      ventas,
      productos,
      estadisticas,
      ventasRecientes,
      reportesPorDia,
      productosMasVendidos,
      loading,
      guardandoVenta,
      stockWarnings,
      abrirFormularioCrear,
      verVenta,
      editarVenta,
      guardarVenta,
      eliminarVenta,
      cerrarFormulario,
      cerrarDetalle
    }
  }
}
</script> 
