<template>
  <div class="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-zinc-900/80 border border-zinc-700/50 shadow-xs rounded-xl">
    <div class="px-5 pt-5">
      <header class="flex justify-between items-start mb-2">
        <h2 class="text-lg font-semibold text-gray-100 mb-0">Personal con Turno</h2>
        <div class="text-emerald-400">
          <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
          </svg>
        </div>
      </header>
      <div class="text-3xl font-bold text-gray-100 mb-1">{{ personalActivo || 0 }}</div>
      <div class="text-sm font-medium text-emerald-400 mb-2">turnos activos ahora</div>
      <div class="flex items-center">
        <div class="text-xs text-gray-400">Total: {{ totalPersonal || 0 }} empleados</div>
        <div class="flex-1 ml-2">
          <div class="w-full bg-zinc-700 rounded-full h-2">
            <div class="bg-emerald-500 h-2 rounded-full" :style="`width: ${totalPersonal ? (personalActivo / totalPersonal) * 100 : 0}%`"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardCard03',
  props: ['personalActivo', 'totalPersonal'],
}
</script>