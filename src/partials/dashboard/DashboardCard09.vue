<template>
  <div class="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-zinc-900/80 border border-zinc-700/50 shadow-xs rounded-xl">
    <header class="px-5 py-4 border-b border-zinc-700">
      <h2 class="font-semibold text-gray-100">Estado de Pedidos del Mes</h2>
    </header>
    <div class="p-5">
      <div class="space-y-4">
        <!-- Completados -->
        <div class="flex items-center justify-between p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
          <div class="flex items-center space-x-3">
            <div class="text-green-400">
              <svg class="w-6 h-6 fill-current" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div>
              <div class="text-2xl font-bold text-gray-100">{{ estado?.completada || 0 }}</div>
              <div class="text-sm text-gray-400">Completados</div>
            </div>
          </div>
        </div>

        <!-- En Proceso -->
        <div class="flex items-center justify-between p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <div class="flex items-center space-x-3">
            <div class="text-blue-400">
              <svg class="w-6 h-6 fill-current" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
            </div>
            <div>
              <div class="text-2xl font-bold text-gray-100">{{ estado?.enProceso || 0 }}</div>
              <div class="text-sm text-gray-400">En Proceso</div>
            </div>
          </div>
        </div>

        <!-- Pendientes -->
        <div class="flex items-center justify-between p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
          <div class="flex items-center space-x-3">
            <div class="text-yellow-400">
              <svg class="w-6 h-6 fill-current" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
            </div>
            <div>
              <div class="text-2xl font-bold text-gray-100">{{ estado?.pendiente || 0 }}</div>
              <div class="text-sm text-gray-400">Pendientes</div>
            </div>
          </div>
        </div>

        <!-- Total -->
        <div class="pt-3 border-t border-zinc-700">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-400">Total de pedidos del mes</span>
            <span class="text-lg font-semibold text-gray-100">
              {{ (estado?.completada || 0) + (estado?.enProceso || 0) + (estado?.pendiente || 0) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardCard09',
  props: {
    estado: {
      type: Object,
      default: () => ({ pendiente: 0, enProceso: 0, completada: 0, cancelada: 0 })
    }
  }
}
</script>