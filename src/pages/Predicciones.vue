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
              <h1 class="text-2xl md:text-3xl text-gray-100 font-bold">Predicciones</h1>
            </div>

          </div>

          <!-- Predicciones a Corto Plazo -->
          <div class="grid grid-cols-12 gap-6 mb-8">
            <PrediccionCortoPlazo />
          </div>

          <!-- Gráficos de Predicciones -->
          <div class="grid grid-cols-12 gap-6 mb-8">
            <PrediccionLargoPlazo />
            <ComparacionHistorica />
          </div>

          <!-- Análisis de Desviaciones -->
          <div class="grid grid-cols-12 gap-6">
            <AnalisisDesviaciones />
            <TablaDesviaciones />
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
import PrediccionCortoPlazo from '../partials/predicciones/PrediccionCortoPlazo.vue'
import PrediccionLargoPlazo from '../partials/predicciones/PrediccionLargoPlazo.vue'
import ComparacionHistorica from '../partials/predicciones/ComparacionHistorica.vue'
import AnalisisDesviaciones from '../partials/predicciones/AnalisisDesviaciones.vue'
import TablaDesviaciones from '../partials/predicciones/TablaDesviaciones.vue'

export default {
  name: 'Predicciones',
  components: {
    Sidebar,
    Header,
    PrediccionCortoPlazo,
    PrediccionLargoPlazo,
    ComparacionHistorica,
    AnalisisDesviaciones,
    TablaDesviaciones,
  },
  setup() {
    const sidebarOpen = ref(false)

    return {
      sidebarOpen
    }
  }
}
</script> 
