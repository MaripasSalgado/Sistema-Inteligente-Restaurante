<template>
  <div class="flex h-screen overflow-hidden">

    <!-- Sidebar -->
    <Sidebar :sidebarOpen="sidebarOpen" @toggle-sidebar="sidebarOpen = !sidebarOpen" />

    <!-- Content area -->
    <div class="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

      <!-- Site header -->
      <Header :sidebarOpen="sidebarOpen" @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <!-- Toast Notifications -->
      <Toast />

      <main class="grow">
        <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

          <!-- Dashboard header -->
          <div class="sm:flex sm:justify-between sm:items-center mb-8">
            <div class="mb-4 sm:mb-0">
              <h1 class="text-2xl md:text-3xl text-gray-100 font-bold">Planilla y Nómina</h1>
              <p class="text-gray-400 mt-1">Resumen general de pagos, recibos y configuración de nómina</p>
            </div>
          </div>

          <!-- Métricas Rápidas (removidas) -->

          <!-- Tabs -->
          <div class="mb-8">
            <div class="border-b border-zinc-700/50">
              <nav class="-mb-px flex space-x-8">
                <button
                  v-for="tab in tabs"
                  :key="tab.id"
                  @click="activeTab = tab.id"
                  class="py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
                  :class="activeTab === tab.id
                    ? 'border-violet-500 text-amber-500'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-zinc-700/50'"
                >
                  {{ tab.name }}
                </button>
              </nav>
            </div>
          </div>

          <!-- Tab Content -->
          <div class="bg-zinc-900/80 border border-zinc-700/50 rounded-lg p-6">
            <!-- Planilla Mensual Tab -->
            <div v-if="activeTab === 'planilla'" class="space-y-6">
              <PlanillaCalculator :planillas="planillas" :empleados="empleados" @refresh-planillas="loadData" />
            </div>

            <!-- Recibos Tab -->
            <div v-if="activeTab === 'recibos'" class="space-y-6">
              <ReciboGenerator :planillas="planillas" :empleados="empleados" @refresh-planillas="loadData" />
            </div>

            <!-- Simulaciones Tab -->
            <div v-if="activeTab === 'simulaciones'" class="space-y-6">
              <AguinaldoSimulator :empleados="empleados" />
            </div>

            <!-- Configuración Tab -->
            <div v-if="activeTab === 'configuracion'" class="space-y-6">
              <ConfiguracionPlanilla />
            </div>

            <!-- Salarios Tab -->
            <div v-if="activeTab === 'salarios'" class="space-y-6">
              <SalarioConfig />
            </div>
          </div>

        </div>
      </main>

    </div> 

  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import Sidebar from '../partials/Sidebar.vue'
import Header from '../partials/Header.vue'
import Toast from '../components/Toast.vue'
import PlanillaCalculator from '../partials/planilla/PlanillaCalculator.vue'
import ReciboGenerator from '../partials/planilla/ReciboGenerator.vue'
import AguinaldoSimulator from '../partials/planilla/AguinaldoSimulator.vue'
import ConfiguracionPlanilla from '../partials/planilla/ConfiguracionPlanilla.vue'
import SalarioConfig from '../partials/planilla/SalarioConfig.vue'
import { PlanillaService } from '../services/planillaService'

export default {
  name: 'Planilla',
  components: {
    Sidebar,
    Header,
    Toast,
    PlanillaCalculator,
    ReciboGenerator,
    AguinaldoSimulator,
    ConfiguracionPlanilla,
    SalarioConfig,
  },
  setup() {
    const sidebarOpen = ref(false)
    const activeTab = ref('planilla')
    const planillas = ref([])
    const empleados = ref([])

    const tabs = [
      { id: 'planilla', name: 'Planilla Mensual' },
      { id: 'recibos', name: 'Recibos' },
      { id: 'simulaciones', name: 'Simulaciones' },
      { id: 'configuracion', name: 'Configuración' },
      { id: 'salarios', name: 'Salarios' }
    ]

    const mapPlanilla = (p) => ({
      id: p.id,
      empleadoId: p.usuario_id,
      empleadoNombre: p.empleado ? `${p.empleado.nombre} ${p.empleado.apellido}` : p.empleadoNombre || 'Empleado',
      periodo: p.periodo,
      fechaInicio: p.fecha_inicio,
      fechaFin: p.fecha_fin,
      estado: p.estado,
      horasProgramadas: p.horas_programadas ?? 0,
      horasTrabajadas: p.horas_trabajadas ?? null,
      horasAusencia: p.horas_ausencia ?? 0,
      horasExtra: p.horas_extra ?? 0,
      diasTrabajados: p.dias_trabajados ?? null,
      diasAusencias: p.dias_ausencias ?? 0,
      salarioBase: p.salario_base ?? 0,
      montoHorasExtra: p.monto_horas_extra ?? 0,
      salarioBruto: p.salario_bruto ?? 0,
      bonos: p.bonos || [],
      totalBonos: p.total_bonos ?? 0,
      deducciones: p.deducciones || [],
      totalDeducciones: p.total_deducciones ?? 0,
      salarioNeto: p.salario_neto ?? 0,
      fechaCalculo: p.fecha_calculo,
      calculadoPor: p.calculado_por,
      fechaPago: p.fecha_pago,
      recibogenerado: p.recibo_generado ?? false
    })

    const loadData = async () => {
      const [planillasResp, empleadosResp] = await Promise.all([
        PlanillaService.getPlanillas(),
        PlanillaService.getEmpleadosActivos()
      ])

      if (planillasResp.success) {
        planillas.value = planillasResp.data.map(mapPlanilla)
      }
      if (empleadosResp.success) {
        empleados.value = empleadosResp.data.map(emp => ({
          ...emp,
          nombreCompleto: `${emp.nombre} ${emp.apellido}`,
          fechaIngreso: emp.fecha_ingreso
        }))
      }
    }

    onMounted(loadData)

    // Computed properties para métricas
    const metricas = computed(() => {
      const empleadosActivos = empleados.value.filter(emp => (emp.activo ?? emp.estado === 'Activo')).length
      const planillasCalculadas = planillas.value.filter(p => p.estado === 'calculada').length
      const planillasPendientes = planillas.value.filter(p => p.estado === 'pendiente').length
      const recibosGenerados = planillas.value.filter(p => p.recibogenerado).length
      const totalPlanilla = planillas.value
        .filter(p => p.salarioNeto)
        .reduce((sum, p) => sum + p.salarioNeto, 0)

      return {
        empleadosProcesados: planillasCalculadas,
        totalEmpleados: empleadosActivos,
        totalPlanilla: totalPlanilla,
        pendientes: planillasPendientes,
        recibosGenerados: recibosGenerados
      }
    })

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('es-CR').format(amount)
    }

    return {
      loadData,
      sidebarOpen,
      activeTab,
      tabs,
      metricas,
      formatCurrency,
      planillas,
      empleados
    }  
  }
}
</script> 
