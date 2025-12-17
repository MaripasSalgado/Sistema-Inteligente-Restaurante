<template>
  <div class="bg-zinc-900/80 border border-zinc-700/50 shadow-xs rounded-xl">
    <header class="px-5 py-4 border-b border-[#CCCCCC]">
      <h2 class="font-semibold text-gray-100">Lista de Proveedores</h2>
    </header>
    
    <div class="p-5">
      <!-- Buscador y Filtros -->
      <div class="mb-6 space-y-4">
        <div class="flex flex-col sm:flex-row gap-4">
          <!-- Buscador -->
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-300 mb-2">Buscar</label>
            <input
              v-model="busqueda"
              type="text"
              placeholder="Buscar por nombre, código o tipo..."
              class="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          
          <!-- Filtro por estado -->
          <div class="sm:w-48">
            <label class="block text-sm font-medium text-gray-300 mb-2">Estado</label>
            <select
              v-model="filtroEstado"
              class="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="">Todos</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
          
          <!-- Filtro por tipo -->
          <div class="sm:w-48">
            <label class="block text-sm font-medium text-gray-300 mb-2">Tipo</label>
            <select
              v-model="filtroTipo"
              class="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="">Todos</option>
              <option value="Carnes y Embutidos">Carnes y Embutidos</option>
              <option value="Frutas y Verduras">Frutas y Verduras</option>
              <option value="Lácteos y Derivados">Lácteos y Derivados</option>
              <option value="Granos y Harinas">Granos y Harinas</option>
              <option value="Condimentos y Especias">Condimentos y Especias</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Tabla de Proveedores -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-700">
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-300">Código</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-300">Nombre</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-300">Tipo</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-300">Estado</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-300">Última Compra</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-300">Calificación</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-300">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="proveedor in proveedoresFiltrados" 
              :key="proveedor.id"
              class="border-b border-gray-800 hover:bg-zinc-800/50"
            >
              <td class="py-4 px-4 text-sm text-gray-100">{{ proveedor.codigo }}</td>
              <td class="py-4 px-4 text-sm text-gray-100">{{ proveedor.nombre }}</td>
              <td class="py-4 px-4 text-sm text-gray-300">{{ proveedor.tipo }}</td>
              <td class="py-4 px-4">
                <span 
                  class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
                  :class="proveedor.estado === 'Activo' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'"
                >
                  {{ proveedor.estado }}
                </span>
              </td>
              <td class="py-4 px-4 text-sm text-gray-300">
                {{ proveedor.ultima_compra ? formatearFecha(proveedor.ultima_compra) : 'N/A' }}
              </td>
              <td class="py-4 px-4">
                <div class="flex items-center">
                  <div class="flex text-yellow-400">
                    <svg 
                      v-for="i in 5" 
                      :key="i"
                      class="w-4 h-4"
                      :class="i <= Math.round(proveedor.calificacion_promedio || 0) ? 'fill-current' : 'fill-gray-600'"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span class="ml-2 text-sm text-gray-300">{{ (proveedor.calificacion_promedio || 0).toFixed(1) }}</span>
                </div>
              </td>
              <td class="py-4 px-4">
                <div class="flex space-x-2">
                  <button
                    @click="$emit('ver-detalle', proveedor)"
                    class="text-blue-400 hover:text-blue-300 text-sm"
                    title="Ver detalle"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    @click="$emit('editar-proveedor', proveedor)"
                    class="text-yellow-400 hover:text-yellow-300 text-sm"
                    title="Editar"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="$emit('cambiar-estado', proveedor)"
                    :class="proveedor.estado === 'Activo' ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'"
                    class="text-sm"
                    :title="proveedor.estado === 'Activo' ? 'Desactivar' : 'Activar'"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button
                    @click="$emit('evaluar', proveedor)"
                    class="text-purple-400 hover:text-purple-300 text-sm"
                    title="Evaluar"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="proveedoresFiltrados.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-300">No se encontraron proveedores</h3>
        <p class="mt-1 text-sm text-gray-500">Intenta ajustar los filtros de búsqueda.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'ProveedoresList',
  props: {
    proveedores: {
      type: Array,
      required: true
    }
  },
  emits: ['editar-proveedor', 'ver-detalle', 'cambiar-estado', 'evaluar'],
  setup(props) {
    const busqueda = ref('')
    const filtroEstado = ref('')
    const filtroTipo = ref('')

    const proveedoresFiltrados = computed(() => {
      return props.proveedores.filter(proveedor => {
        const cumpleBusqueda = !busqueda.value || 
          proveedor.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
          proveedor.codigo.toLowerCase().includes(busqueda.value.toLowerCase()) ||
          proveedor.tipo.toLowerCase().includes(busqueda.value.toLowerCase())
        
        const cumpleEstado = !filtroEstado.value || proveedor.estado === filtroEstado.value
        const cumpleTipo = !filtroTipo.value || proveedor.tipo === filtroTipo.value
        
        return cumpleBusqueda && cumpleEstado && cumpleTipo
      })
    })

    const formatearFecha = (fecha) => {
      if (!fecha) return 'N/A'
      try {
        return new Date(fecha).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      } catch (error) {
        return 'N/A'
      }
    }

    return {
      busqueda,
      filtroEstado,
      filtroTipo,
      proveedoresFiltrados,
      formatearFecha
    }
  }
}
</script> 