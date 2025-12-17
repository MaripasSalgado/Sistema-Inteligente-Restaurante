<template>
  <div class="flex h-screen overflow-hidden turnos-page">

    <!-- Sidebar -->
    <Sidebar :sidebarOpen="sidebarOpen" @toggle-sidebar="sidebarOpen = !sidebarOpen" />

    <!-- Content area -->
    <div class="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
      
      <!-- Site header -->
      <Header :sidebarOpen="sidebarOpen" @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <main class="grow">
        <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

          <!-- Dashboard actions -->
          <div class="sm:flex sm:justify-between sm:items-start sm:gap-6 mb-8">

            <!-- Left: Title -->
            <div class="mb-6 sm:mb-0 max-w-2xl">
              <h1 class="text-2xl md:text-3xl text-gray-100 font-bold">Gestión de Turnos y Asistencia</h1>
              <p class="text-gray-400 mt-2">
                Programa turnos, valida la cobertura por área y monitorea la asistencia en tiempo real.
              </p>
            </div>

            <!-- Right: Actions -->
            <div class="flex items-center justify-start sm:justify-end gap-2 w-full sm:w-auto">

              <button 
                @click="abrirModalTurno"
                class="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-black bg-[#F4B400] hover:bg-[#F4B400]/90 transition-colors shadow-lg"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 9V3a1 1 0 10-2 0v6H3a1 1 0 100 2h6v6a1 1 0 102 0v-6h6a1 1 0 100-2h-6z" />
                </svg>
                Nuevo turno
              </button>
            </div>

          </div>

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
                    : 'border-transparent text-white hover:text-amber-400 hover:border-zinc-700/50'"
                >
                  {{ tab.name }}
                </button>
              </nav>
            </div>
          </div>

          <!-- Tab Content -->
          <div class="bg-zinc-900/50 border border-zinc-700/50 rounded-lg p-6">
            <!-- Calendario Tab -->
            <div v-if="activeTab === 'calendario'" class="space-y-6">
              <CalendarioTurnos ref="calendarioRef" />
            </div>

            <!-- Asistencia Tab -->
            <div v-if="activeTab === 'asistencia'" class="space-y-6">
              <AsistenciaTracker />
              <HistorialAsistencia />
            </div>
          </div>

        </div>
      </main>

    </div> 

  </div>
</template>

<script>
import { ref } from 'vue'
import Sidebar from '../partials/Sidebar.vue'
import Header from '../partials/Header.vue'
import CalendarioTurnos from '../partials/turnos/CalendarioTurnos.vue'
import AsistenciaTracker from '../partials/turnos/AsistenciaTracker.vue'
import HistorialAsistencia from '../partials/turnos/HistorialAsistencia.vue'

export default {
  name: 'Turnos',
  components: {
    Sidebar,
    Header,
    CalendarioTurnos,
    AsistenciaTracker,
    HistorialAsistencia,
  },
  setup() {
    const sidebarOpen = ref(false)
    const activeTab = ref('calendario')
    const calendarioRef = ref(null)

    const tabs = [
      { id: 'calendario', name: 'Calendario' },
      { id: 'asistencia', name: 'Asistencia' }
    ]

    const abrirModalTurno = () => {
      if (calendarioRef.value && calendarioRef.value.abrirModalTurno) {
        calendarioRef.value.abrirModalTurno()
      }
    }

    return {
      sidebarOpen,
      activeTab,
      tabs,
      abrirModalTurno,
      calendarioRef
    }  
  }
}
</script> 

<style scoped>
.turnos-page {
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
</style>
