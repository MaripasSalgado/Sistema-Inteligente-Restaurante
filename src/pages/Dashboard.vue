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
              <h1 class="text-2xl md:text-3xl text-gray-100 font-bold">Panel Principal</h1>
            </div>

            <!-- Right: Actions -->
            <div class="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">

              <!-- Filter button -->
              <!-- MonthPicker -->
              <MonthPicker align="right" @change-month="handleMonthChange" />
              <!-- Add view button -->
            </div>

          </div>

          <!-- KPIs Cards -->
          <div class="grid grid-cols-12 gap-6 mb-8">
            <DashboardCard01 :comparacion="comparacionVentas" />
            <DashboardCard02 :stock-critico="stockCritico" />
            <DashboardCard03 :personal-activo="personalActivo" :total-personal="totalPersonal" />
            <!-- DashboardCard04 removed as requested -->
          </div>

          <!-- Charts: Ventas por Hora y Productos Top -->
          <div class="grid grid-cols-12 gap-6 mb-8">
            <DashboardCard05 :data="ventasPorHora" />
            <DashboardCard06 :data="productosTop" />
          </div>

          <!-- Estado Inventario y Alertas -->
          <div class="grid grid-cols-12 gap-6 mb-8">
            <DashboardCard07 :data="estadoInventario" />
            <DashboardCard08 :insumos="insumosVencer" />
            <DashboardCard09 :estado="estadoPedidos" />
            <DashboardCard10 :month="currentMonth" :year="currentYear" />
          </div>

          <!-- Predicciones -->
          <div class="grid grid-cols-12 gap-6 mb-8" v-if="predicciones && predicciones.length > 0">
            <DashboardCardPredictions :predicciones="predicciones" />
          </div>

        </div>
      </main>

    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouteGuard } from '@/composables/useRouteGuard'
import Sidebar from '../partials/Sidebar.vue'
import Header from '../partials/Header.vue'
import FilterButton from '../components/DropdownFilter.vue'
import MonthPicker from '../components/MonthPicker.vue'
import DashboardCard01 from '../partials/dashboard/DashboardCard01.vue'
import DashboardCard02 from '../partials/dashboard/DashboardCard02.vue'
import DashboardCard03 from '../partials/dashboard/DashboardCard03.vue'
// import DashboardCard04 from '../partials/dashboard/DashboardCard04.vue'
import DashboardCard05 from '../partials/dashboard/DashboardCard05.vue'
import DashboardCard06 from '../partials/dashboard/DashboardCard06.vue'
import DashboardCard07 from '../partials/dashboard/DashboardCard07.vue'
import DashboardCard08 from '../partials/dashboard/DashboardCard08.vue'
import DashboardCard09 from '../partials/dashboard/DashboardCard09.vue'
import DashboardCard10 from '../partials/dashboard/DashboardCard10.vue'
import DashboardCardPredictions from '../partials/dashboard/DashboardCardPredictions.vue'
import { DashboardService } from '@/services/dashboardService'

export default {
  name: 'Dashboard',
  components: {
    Sidebar,
    Header,
    FilterButton,
    MonthPicker,
    DashboardCard01,
    DashboardCard02,
    DashboardCard03,
    // DashboardCard04,
    DashboardCard05,
    DashboardCard06,
    DashboardCard07,
    DashboardCard08,
    DashboardCard09,
    DashboardCard10,
    DashboardCardPredictions,
  },
  setup() {
    const sidebarOpen = ref(false)
    useRouteGuard()

    // Reactive state for dashboard data
    const comparacionVentas = ref({ hoy: 0, ayer: 0, cambio: 0, tendencia: 'estable' })
    const stockCritico = ref(0)
    const personalActivo = ref(0)
    const totalPersonal = ref(0)
    const alertasActivas = ref(0)
    const loading = ref(true)

    const ventasPorHora = ref([])
    const productosTop = ref({ labels: [], data: [] })
    const estadoInventario = ref({ optimo: 0, bajo: 0, critico: 0, agotado: 0 })
    const insumosVencer = ref([])
    const estadoPedidos = ref({ pendiente: 0, enProceso: 0, completada: 0, cancelada: 0 })
    const ventas7Dias = ref({ labels: [], data: [] })
    const predicciones = ref([])
    
    const selectedDate = ref(new Date())

    // Computed properties for safe access
    const currentMonth = computed(() => selectedDate.value.getMonth())
    const currentYear = computed(() => selectedDate.value.getFullYear())

    // Fetch data on mount
    const fetchData = async () => {
      try {
        loading.value = true
        
        const month = selectedDate.value.getMonth()
        const year = selectedDate.value.getFullYear()

        // Fetch all dashboard data in one call
        const dashboardData = await DashboardService.getDashboardData(month, year)
        
        // Update reactive state with the received data
        comparacionVentas.value = dashboardData.comparacionVentas
        estadoInventario.value = dashboardData.estadoInventario
        estadoPedidos.value = await DashboardService.getEstadoPedidosMes(month, year)
        insumosVencer.value = dashboardData.insumosVencer
        ventasPorHora.value = dashboardData.ventasPorHora
        productosTop.value = await DashboardService.getProductosMasVendidosMes(month, year)
        ventas7Dias.value = dashboardData.ventas7Dias

        // Fetch additional data that's not in the main dashboard call
        const [stock, personal, totalPers, alertas, preds] = await Promise.all([
          DashboardService.getInsumosBajoStock(),
          DashboardService.getPersonalConTurnoHoy(),
          DashboardService.getTotalPersonal(),
          // DashboardService.getAlertasActivas(),
          DashboardService.getPrediccionesVentas()
        ])

        stockCritico.value = stock.length
        personalActivo.value = personal
        totalPersonal.value = totalPers
        // alertasActivas.value = alertas
        predicciones.value = preds

        // Debug: Log loaded data
        console.log('Dashboard data loaded:', dashboardData)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        loading.value = false
      }
    }

    fetchData()

    const handleMonthChange = (date) => {
      selectedDate.value = date
      fetchData()
    }

    return {
      sidebarOpen,
      handleMonthChange,
      currentMonth,
      currentYear,
      comparacionVentas,
      stockCritico,
      personalActivo,
      totalPersonal,
      alertasActivas,
      ventasPorHora,
      productosTop,
      estadoInventario,
      insumosVencer,
      estadoPedidos,
      ventas7Dias,
      predicciones,
      loading
    }
  },
}
</script>
