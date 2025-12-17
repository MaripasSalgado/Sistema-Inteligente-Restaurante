<template>
  <div class="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-zinc-900/80 border border-zinc-700/50 shadow-xs rounded-xl">
    <div class="px-5 pt-5">
      <header class="flex justify-between items-start mb-2">
        <h2 class="text-lg font-semibold text-gray-100 mb-0">Stock Crítico</h2>
        <div class="text-red-400">
          <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
      </header>
      <div class="text-3xl font-bold text-gray-100 mb-1">{{ stockCritico || 0 }}</div>
      <div class="text-sm font-medium text-red-400 mb-2">items críticos</div>
      <div class="flex items-center">
        <div class="text-xs text-gray-400">Acción requerida</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardCard02',
  props: ['stockCritico'],
}
</script>