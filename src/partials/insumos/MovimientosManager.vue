<template>
  <div class="space-y-6">
    <!-- Header con botón de nuevo movimiento -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-xl font-bold text-white">Gestión de Movimientos</h2>
        <p class="text-gray-400 mt-1">Registra entradas y salidas de inventario</p>
      </div>
      <button
        @click="mostrarFormulario = true; movimientoEditando = null"
        class="px-4 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition-colors font-medium"
      >
        Nuevo Movimiento
      </button>
          </div>

    <!-- Filtros -->
    <div class="bg-zinc-900/95 border border-zinc-700/50 rounded-lg p-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Filtro por insumo -->
          <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Insumo</label>
            <select
            v-model="filtros.insumo"
            class="w-full px-3 py-2 bg-zinc-900/95 border border-zinc-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="">Todos los insumos</option>
            <option v-for="insumo in insumos" :key="insumo.id" :value="insumo.id">
              {{ insumo.nombre }}
              </option>
            </select>
        </div>

        <!-- Filtro por tipo -->
          <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Tipo</label>
            <select
            v-model="filtros.tipo"
            class="w-full px-3 py-2 bg-zinc-900/95 border border-zinc-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="">Todos los tipos</option>
            <option value="Entrada">Entrada</option>
            <option value="Salida">Salida</option>
            <option value="Ajuste">Ajuste</option>
            <option value="Transferencia">Transferencia</option>
            </select>
      </div>

        <!-- Filtro por fecha desde -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Desde</label>
              <input
            v-model="filtros.fechaDesde"
            type="date"
            style="color-scheme: dark;"
            class="w-full px-3 py-2 bg-zinc-900/95 border border-zinc-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500 date-input"
          />
        </div>

        <!-- Filtro por fecha hasta -->
          <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Hasta</label>
              <input
            v-model="filtros.fechaHasta"
            type="date"
            style="color-scheme: dark;"
            class="w-full px-3 py-2 bg-zinc-900/95 border border-zinc-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500 date-input"
            />
          </div>
        </div>
    </div>

    <!-- Lista de movimientos -->
    <div class="bg-zinc-900/95 border border-zinc-700/50 rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-zinc-900/95 border-b border-zinc-700/50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Fecha
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Insumo
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Tipo
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Cantidad
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Motivo
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Documento
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-700/50">
            <tr v-for="movimiento in movimientosFiltrados" :key="movimiento.id" class="hover:bg-zinc-800/50 transition-colors">
              <!-- Fecha -->
              <td class="px-4 py-4 text-sm text-white">
                {{ formatearFecha(movimiento.fecha_movimiento) }}
              </td>

              <!-- Insumo -->
              <td class="px-4 py-4">
                <div class="text-sm text-white">{{ getInsumoNombreDeMovimiento(movimiento) }}</div>
                <div class="text-xs text-gray-400">{{ getLoteDeMovimiento(movimiento) }}</div>
              </td>

              <!-- Tipo -->
              <td class="px-4 py-4">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getTipoClass(movimiento.tipo)"
                >
                  {{ movimiento.tipo }}
                </span>
              </td>

              <!-- Cantidad -->
              <td class="px-4 py-4 text-sm text-white">
                {{ movimiento.cantidad }} {{ getUnidadDeMovimiento(movimiento) }}
              </td>

              <!-- Motivo -->
              <td class="px-4 py-4 text-sm text-white">
                {{ movimiento.motivo }}
              </td>

              <!-- Documento -->
              <td class="px-4 py-4 text-sm text-gray-400">
                {{ movimiento.documento || '-' }}
              </td>

              <!-- Acciones -->
              <td class="px-4 py-4">
                <div class="flex space-x-2">
                  <button
                    @click="editarMovimiento(movimiento)"
                    class="text-amber-500 hover:text-amber-400 text-sm"
                  >
                    Editar
                  </button>
                  <button
                    @click="eliminarMovimiento(movimiento)"
                    class="text-red-500 hover:text-red-400 text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mensaje cuando no hay resultados -->
      <div v-if="movimientosFiltrados.length === 0" class="text-center py-8">
        <div class="text-gray-400 text-lg">No se encontraron movimientos</div>
        <div class="text-gray-500 text-sm mt-2">Intenta ajustar los filtros de búsqueda</div>
          </div>
        </div>

    <!-- Modal de formulario -->
    <Teleport to="body">
      <div v-if="mostrarFormulario">
        <div class="fixed inset-0 z-50 backdrop-blur-sm bg-black/50" @click="cerrarFormulario"></div>
        <div class="fixed inset-0 z-50 overflow-y-auto" @click.self="cerrarFormulario">
          <div class="flex min-h-full items-center justify-center p-4">
            <div class="bg-zinc-900/95 border border-zinc-700/50 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 class="text-lg font-semibold text-white mb-4">
              {{ movimientoEditando ? 'Editar Movimiento' : 'Nuevo Movimiento' }}
            </h3>

            <form @submit.prevent="guardarMovimiento" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Insumo -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
                Insumo *
            </label>
            <select
                v-model="formulario.insumoId"
              required
                @change="cargarLotes"
                class="w-full px-3 py-2 bg-zinc-900/95 border border-zinc-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="">Seleccionar insumo</option>
                <option v-for="insumo in insumos" :key="insumo.id" :value="insumo.id">
                  {{ insumo.nombre }}
                </option>
              </select>
            </div>

            <!-- Lote -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Lote *
              </label>
              <select
                v-model="formulario.loteId"
                required
                :disabled="!formulario.insumoId"
                class="w-full px-3 py-2 bg-zinc-900/95 border border-zinc-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">{{ formulario.insumoId ? 'Seleccionar lote' : 'Primero selecciona un insumo' }}</option>
                <option v-for="lote in lotesDisponibles" :key="lote.id" :value="lote.id">
                  {{ lote.lote }} - Disponible: {{ lote.cantidad_actual || 0 }} {{ getInsumoUnidad(formulario.insumoId) }}
              </option>
            </select>
            </div>

            <!-- Tipo -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Tipo *
              </label>
              <select
                v-model="formulario.tipo"
                required
                class="w-full px-3 py-2 bg-zinc-900/95 border border-zinc-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="">Seleccionar tipo</option>
                <option value="Entrada">Entrada</option>
                <option value="Salida">Salida</option>
                <option value="Ajuste">Ajuste</option>
                <option value="Transferencia">Transferencia</option>
              </select>
          </div>

          <!-- Cantidad -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
                Cantidad *
            </label>
              <input
                v-model.number="formulario.cantidad"
                type="number"
                min="0"
                step="0.01"
                required
                class="w-full px-3 py-2 bg-zinc-900/95 border border-zinc-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="0"
              />
          </div>

          <!-- Motivo -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
                Motivo *
            </label>
            <select
                v-model="formulario.motivo"
              required
                class="w-full px-3 py-2 bg-zinc-900/95 border border-zinc-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="">Seleccionar motivo</option>
                <option v-for="motivo in motivos" :key="motivo" :value="motivo">
                {{ motivo }}
              </option>
            </select>
        </div>

            <!-- Documento -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
                Documento
            </label>
              <input
                v-model="formulario.documento"
                type="text"
                class="w-full px-3 py-2 bg-zinc-900/95 border border-zinc-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Número de factura, orden, etc."
              />
          </div>

            <!-- Fecha -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
                Fecha *
            </label>
            <input
                v-model="formulario.fecha"
                type="datetime-local"
                style="color-scheme: dark;"
                required
                class="w-full px-3 py-2 bg-zinc-900/95 border border-zinc-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500 date-input"
              />
            </div>
          </div>

          <!-- Observaciones -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Observaciones
            </label>
            <textarea
              v-model="formulario.observaciones"
              rows="3"
              class="w-full px-3 py-2 bg-zinc-900/95 border border-zinc-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Observaciones adicionales..."
            ></textarea>
        </div>

          <!-- Botones -->
          <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
              @click="cerrarFormulario"
              class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors font-medium"
          >
              Cancelar
          </button>
          <button
            type="submit"
              class="px-4 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition-colors font-medium"
          >
              {{ movimientoEditando ? 'Actualizar' : 'Guardar' }}
          </button>
        </div>
            </form>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { toDatetimeLocal, formatearFecha as formatFecha } from '@/utils/dateHelper'
import { MovimientoInventarioService } from '@/services/movimientoInventarioService'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'

export default {
  name: 'MovimientosManager',
  props: {
    insumos: {
      type: Array,
      required: true
    },
    proveedores: {
      type: Array,
      required: true
    },
    movimientos: {
      type: Array,
      default: () => []
    }
  },
  emits: ['registrar-movimiento', 'movimiento-actualizado', 'movimiento-eliminado'],
  setup(props, { emit }) {
    const mostrarFormulario = ref(false)
    const movimientoEditando = ref(null)
    const lotesDisponibles = ref([])
    
    // Composables
    const { user } = useAuth()
    const { addToast: showToast } = useToast()

    const filtros = ref({
      insumo: '',
      tipo: '',
      fechaDesde: '',
      fechaHasta: ''
    })

    const formulario = ref({
      insumoId: '',
      loteId: '',
      tipo: '',
      cantidad: 0,
      motivo: '',
      documento: '',
      fecha: '',
      observaciones: ''
    })

    const motivos = [
      'Compra a proveedor',
      'Uso en receta',
      'Desperdicio por caducidad',
      'Ajuste de inventario',
      'Producto dañado',
      'Pérdida por manipulación',
      'Transferencia entre almacenes',
      'Merma por cocción'
    ]

    // Computed para movimientos filtrados
    const movimientosFiltrados = computed(() => {
      let resultado = props.movimientos || []

      if (filtros.value.insumo) {
        resultado = resultado.filter(m => {
          // Buscar el insumo_id en el lote del movimiento
          const loteInsumoId = m.lote?.insumo_id || m.lote?.insumo?.id
          return loteInsumoId === filtros.value.insumo
        })
      }

      if (filtros.value.tipo) {
        resultado = resultado.filter(m => m.tipo === filtros.value.tipo)
      }

      if (filtros.value.fechaDesde) {
        resultado = resultado.filter(m => new Date(m.fecha_movimiento) >= new Date(filtros.value.fechaDesde))
      }

      if (filtros.value.fechaHasta) {
        resultado = resultado.filter(m => new Date(m.fecha_movimiento) <= new Date(filtros.value.fechaHasta))
      }

      return resultado.sort((a, b) => new Date(b.fecha_movimiento) - new Date(a.fecha_movimiento))
    })

    // Métodos auxiliares
    const getInsumoNombre = (insumoId) => {
      const insumo = props.insumos.find(i => i.id === insumoId)
      return insumo ? insumo.nombre : 'Insumo no encontrado'
    }

    const getInsumoUnidad = (insumoId) => {
      const insumo = props.insumos.find(i => i.id === insumoId)
      return insumo ? insumo.unidad_medida : ''
    }

    const getInsumoNombreDeMovimiento = (movimiento) => {
      if (movimiento.lote?.insumo?.nombre) {
        return movimiento.lote.insumo.nombre
      }
      if (movimiento.lote?.insumo_id) {
        return getInsumoNombre(movimiento.lote.insumo_id)
      }
      return 'Insumo no encontrado'
    }

    const getLoteDeMovimiento = (movimiento) => {
      return movimiento.lote?.lote || movimiento.lote_id || '-'
    }

    const getUnidadDeMovimiento = (movimiento) => {
      if (movimiento.lote?.insumo?.unidad_medida) {
        return movimiento.lote.insumo.unidad_medida
      }
      if (movimiento.lote?.insumo_id) {
        return getInsumoUnidad(movimiento.lote.insumo_id)
      }
      return ''
    }

    const getTipoClass = (tipo) => {
      const clases = {
        'Entrada': 'bg-green-100 text-green-800',
        'Salida': 'bg-red-100 text-red-800',
        'Ajuste': 'bg-yellow-100 text-yellow-800',
        'Transferencia': 'bg-blue-100 text-blue-800'
      }
      return clases[tipo] || 'bg-gray-100 text-gray-800'
    }

    const formatearFecha = (fecha) => {
      return formatFecha(fecha, true) // Usar helper con hora de Costa Rica
    }

    const cargarLotes = () => {
      if (formulario.value.insumoId) {
        const insumo = props.insumos.find(i => i.id === formulario.value.insumoId)
        console.log('🔍 Insumo seleccionado:', insumo)
        console.log('🔍 Lotes disponibles:', insumo?.lotes)
        lotesDisponibles.value = insumo?.lotes || []
        formulario.value.loteId = ''
      } else {
        lotesDisponibles.value = []
        formulario.value.loteId = ''
      }
    }

    const resetearFormulario = () => {
      formulario.value = {
        insumoId: '',
        loteId: '',
        tipo: '',
        cantidad: 0,
        motivo: '',
        documento: '',
        fecha: toDatetimeLocal(), // Usar hora de Costa Rica
        observaciones: ''
      }
      lotesDisponibles.value = []
    }

    const editarMovimiento = (movimiento) => {
      console.log('🔧 Editando movimiento:', movimiento)
      movimientoEditando.value = movimiento
      
      // Extraer el insumo_id del lote
      const insumoId = movimiento.lote?.insumo_id || movimiento.lote?.insumo?.id
      
      formulario.value = {
        id: movimiento.id,
        insumoId: insumoId || '',
        loteId: movimiento.lote_id || '',
        tipo: movimiento.tipo,
        cantidad: movimiento.cantidad,
        motivo: movimiento.motivo,
        documento: movimiento.documento || '',
        fecha: toDatetimeLocal(movimiento.fecha_movimiento),
        observaciones: movimiento.observaciones || ''
      }
      
      // Cargar lotes del insumo antes de mostrar el formulario
      if (insumoId) {
        const insumo = props.insumos.find(i => i.id === insumoId)
        lotesDisponibles.value = insumo?.lotes || []
      }
      
      mostrarFormulario.value = true
    }

    const cerrarFormulario = () => {
      mostrarFormulario.value = false
      movimientoEditando.value = null
      resetearFormulario()
    }

    const guardarMovimiento = async () => {
      if (!formulario.value.insumoId || !formulario.value.loteId || !formulario.value.tipo || !formulario.value.cantidad) {
        showToast('Por favor completa todos los campos obligatorios', 'error')
        return
      }

      try {
        const movimientoData = {
          ...formulario.value,
          usuario_id: user.value?.id
        }

        console.log('💾 Guardando movimiento:', movimientoData)

        let result
        if (movimientoEditando.value) {
          // Actualizar movimiento existente
          result = await MovimientoInventarioService.updateMovimiento(
            movimientoEditando.value.id,
            movimientoData
          )
          
          if (result.success) {
            showToast('Movimiento actualizado correctamente', 'success')
            emit('movimiento-actualizado', result.data)
          } else {
            showToast('Error al actualizar movimiento: ' + result.error, 'error')
            return
          }
        } else {
          // Crear nuevo movimiento
          const loteSeleccionado = lotesDisponibles.value.find(l => l.id === formulario.value.loteId)
          
          const nuevoMovimiento = {
            ...movimientoData,
            lote: loteSeleccionado?.lote || ''
          }

          console.log('📤 Emitiendo nuevo movimiento:', nuevoMovimiento)
          emit('registrar-movimiento', nuevoMovimiento)
        }

        cerrarFormulario()
      } catch (error) {
        console.error('❌ Error al guardar movimiento:', error)
        showToast('Error inesperado al guardar movimiento', 'error')
      }
    }

    const eliminarMovimiento = async (movimiento) => {
      if (confirm('¿Estás seguro de que quieres eliminar este movimiento? Esto revertirá los cambios en el inventario.')) {
        try {
          console.log('🗑️ Eliminando movimiento:', movimiento)
          
          const result = await MovimientoInventarioService.deleteMovimiento(
            movimiento.id,
            user.value?.id
          )
          
          if (result.success) {
            showToast('Movimiento eliminado correctamente', 'success')
            emit('movimiento-eliminado', movimiento)
          } else {
            showToast('Error al eliminar movimiento: ' + result.error, 'error')
          }
        } catch (error) {
          console.error('❌ Error al eliminar movimiento:', error)
          showToast('Error inesperado al eliminar movimiento', 'error')
        }
      }
    }


    return {
      mostrarFormulario,
      movimientoEditando,
      lotesDisponibles,
      filtros,
      formulario,
      motivos,
      movimientosFiltrados,
      getInsumoNombre,
      getInsumoUnidad,
      getInsumoNombreDeMovimiento,
      getLoteDeMovimiento,
      getUnidadDeMovimiento,
      getTipoClass,
      formatearFecha,
      cargarLotes,
      editarMovimiento,
      cerrarFormulario,
      guardarMovimiento,
      eliminarMovimiento
    }
  }
}
</script>

<style>
/* Estilos para el input de fecha/hora - sin scoped para que funcione */
input[type="date"].date-input::-webkit-calendar-picker-indicator,
input[type="datetime-local"].date-input::-webkit-calendar-picker-indicator {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 16px;
  cursor: pointer;
  opacity: 0.8;
  width: 20px;
  height: 20px;
}

input[type="date"].date-input::-webkit-calendar-picker-indicator:hover,
input[type="datetime-local"].date-input::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
}

/* Para Firefox */
input[type="date"].date-input::-moz-calendar-picker-indicator,
input[type="datetime-local"].date-input::-moz-calendar-picker-indicator {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E");
  cursor: pointer;
  opacity: 0.8;
}
</style> 
