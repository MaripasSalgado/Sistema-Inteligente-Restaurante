<template>
  <div class="flex h-screen overflow-hidden alertas-page">
    <Sidebar :sidebarOpen="sidebarOpen" @close-sidebar="sidebarOpen = false" />

    <div class="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
      <Header :sidebarOpen="sidebarOpen" @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <main class="grow">
        <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          
          <div class="sm:flex sm:justify-between sm:items-center mb-8">
            <div class="mb-4 sm:mb-0">
              <h1 class="text-2xl md:text-3xl text-gray-100 font-bold">Centro de Alertas</h1>
              <p class="text-gray-400 mt-1">Gestión de incidencias, stock y consumos anómalos</p>
            </div>
            <div class="flex gap-2">
              <button 
                @click="cargarAlertas" 
                class="px-4 py-2 bg-zinc-800 border border-zinc-700/50 text-gray-300 rounded hover:border-amber-500 transition flex items-center gap-2">
                Refrescar
              </button>
            </div>
          </div>

          <div class="flex gap-4 mb-6 border-b border-zinc-700/50">
            <button 
              @click="tabActual = 'pendientes'"
              :class="tabActual === 'pendientes' ? 'border-amber-500 text-amber-500' : 'border-transparent text-gray-500'"
              class="pb-2 border-b-2 font-medium transition-all px-2">
              Pendientes ({{ alertasPendientes.length }})
            </button>
            <button 
              @click="tabActual = 'historial'"
              :class="tabActual === 'historial' ? 'border-amber-500 text-amber-500' : 'border-transparent text-gray-500'"
              class="pb-2 border-b-2 font-medium transition-all px-2">
              Historial
            </button>
          </div>

          <div style="background-color: rgb(24 24 27 / 0.8);" class="border border-zinc-700/50 rounded-lg p-6">
            <h3 class="text-lg font-medium text-white mb-4">
              {{ tabActual === 'pendientes' ? 'Incidencias Recientes' : 'Historial de Gestión' }}
            </h3>
            
            <div v-if="loading" class="flex justify-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="alerta in alertasFiltradas"
                :key="alerta.id"
                class="flex items-center justify-between p-4 border border-zinc-700/50 rounded-lg hover:border-amber-400 transition-colors"
                style="background-color: rgb(39 39 42);"
              >
                <div class="flex items-center">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center mr-4"
                    :class="{
                      'bg-red-500/20 text-red-500': alerta.tipo_alerta === 'stock_bajo',
                      'bg-purple-500/20 text-purple-500': alerta.tipo_alerta === 'consumo_anomalo',
                      'bg-yellow-500/20 text-yellow-500': alerta.tipo_alerta === 'vencimiento'
                    }">
                    <span class="font-bold">!</span>
                  </div>
                  <div>
                    <p class="text-white font-medium">
                      {{ alerta.insumo ? alerta.insumo.nombre : 'Reporte General de Sistema' }}
                    </p>
                    <p class="text-sm text-gray-400 mt-1 whitespace-pre-line leading-relaxed">
                      {{ alerta.mensaje }}
                    </p>
                  </div>
                </div>

                <div class="text-right flex flex-col items-end gap-2">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="alerta.estado === 'pendiente' ? 'bg-red-900/30 text-red-400 border border-red-500/30' : 'bg-zinc-700 text-gray-400'">
                    {{ alerta.estado }}
                  </span>
                  <p class="text-xs text-gray-500">{{ formatearFecha(alerta.fecha_creacion) }}</p>
                  
                  <div v-if="alerta.estado === 'pendiente'" class="flex gap-2 mt-1">
                    <button 
                      @click="gestionarAlerta(alerta.id, 'atendida')"
                      class="text-xs bg-amber-500/10 text-amber-500 border border-amber-500/50 px-2 py-1 rounded hover:bg-amber-500 hover:text-black transition">
                      Marcar atendida
                    </button>
                    <button 
                      @click="gestionarAlerta(alerta.id, 'ignorado')"
                      class="text-xs bg-zinc-700/50 text-gray-400 border border-zinc-600 px-2 py-1 rounded hover:bg-zinc-600 hover:text-white transition">
                      Ignorar
                    </button>
                  </div>
                  
                  <p v-else-if="alerta.fecha_modificacion" class="text-[10px] text-gray-600 italic">
                    Gestionado el: {{ formatearFecha(alerta.fecha_modificacion) }}
                  </p>
                </div>
              </div>

              <div v-if="alertasFiltradas.length === 0" class="text-center py-8 text-gray-500">
                No hay alertas en esta sección.
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Sidebar from '../partials/Sidebar.vue'
import Header from '../partials/Header.vue'
import { AlertaService } from '../services/alertasService'
import { supabase } from '@/config/supabase'

const sidebarOpen = ref(false)
const loading = ref(false)
const alertas = ref([])
const tabActual = ref('pendientes')

// --- COMPUTED ---
const alertasPendientes = computed(() => alertas.value.filter(a => a.estado === 'pendiente'))

const alertasFiltradas = computed(() => {
  return tabActual.value === 'pendientes' 
    ? alertasPendientes.value 
    : alertas.value.filter(a => a.estado !== 'pendiente')
})

const alertasCriticas = computed(() => alertasPendientes.value.length)
const alertasStock = computed(() => alertasPendientes.value.filter(a => a.tipo_alerta === 'stock_bajo').length)

// --- MÉTODOS ---
const cargarAlertas = async () => {
  loading.value = true
  const { data, error } = await AlertaService.getAlertasPendientes()
  if (!error) {
    alertas.value = data
  }
  loading.value = false
}

const gestionarAlerta = async (id, nuevoEstado) => {
  const { error } = await AlertaService.actualizarEstado(id, nuevoEstado)
  if (!error) {
    const index = alertas.value.findIndex(a => a.id === id)
    if (index !== -1) {
      alertas.value[index].estado = nuevoEstado
      alertas.value[index].fecha_modificacion = new Date().toISOString()
    }
  }
}

const formatearFecha = (fechaRaw) => {
  if (!fechaRaw) return 'Sin fecha'
  const fecha = new Date(fechaRaw)
  return isNaN(fecha.getTime()) ? 'Invalid Date' : fecha.toLocaleString()
}

onMounted(() => {
  cargarAlertas()
  supabase
    .channel('alertas_realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'alertas_consumo' }, () => {
      cargarAlertas()
    })
    .subscribe()
})
</script>

<style scoped>
.alertas-page {
  background-color: rgb(15 15 15);
}
</style>