<template>
  <Teleport to="body">
    <div v-if="lote">
      <!-- Overlay -->
      <div class="fixed inset-0 z-50 backdrop-blur-sm bg-black/50" @click="cerrar"></div>

      <!-- Modal -->
      <div class="fixed inset-0 z-50 overflow-y-auto" @click.self="cerrar">
        <div class="flex min-h-full items-center justify-center p-4">
          <div class="relative bg-zinc-900/95 border border-zinc-700/50 rounded-lg shadow-2xl w-full max-w-md p-6">
          <h2 class="text-lg font-bold text-white mb-4">Eliminar Lote</h2>

          <!-- Información del lote -->
          <div class="bg-zinc-900/50 border border-zinc-700/50 rounded-lg p-4 mb-4">
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-400 text-sm">Lote:</span>
                <span class="text-white font-mono text-sm">{{ lote.lote }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400 text-sm">Insumo:</span>
                <span class="text-white text-sm">{{ getInsumoNombre() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400 text-sm">Cantidad Actual:</span>
                <span class="text-amber-400 font-semibold text-sm">{{ lote.cantidad_actual }} {{ getInsumoUnidad() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400 text-sm">Valor:</span>
                <span class="text-white font-semibold text-sm">₡{{ formatearPrecio(calcularValor()) }}</span>
              </div>
            </div>
          </div>

          <!-- Advertencia -->
          <div class="bg-red-900/30 border border-red-700 rounded-lg p-3 mb-4">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              <div>
                <h4 class="text-red-400 font-semibold text-sm">¡Atención!</h4>
                <p class="text-red-200 text-xs mt-1">
                  Esta acción no se puede deshacer. El lote será eliminado permanentemente del sistema.
                </p>
              </div>
            </div>
          </div>

          <p class="text-sm text-gray-400 mb-2">
            Motivo de la eliminación (obligatorio):
          </p>
          <textarea
            v-model="motivo"
            class="w-full bg-zinc-900/80 border border-zinc-700/50 rounded-lg p-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
            rows="3"
            placeholder="Ej: Lote vencido y descartado, error en registro, producto dañado, etc."
          />

          <!-- Mensaje de alerta -->
          <div v-if="alerta" class="mt-3 p-2 text-sm rounded" :class="alertaClass">
            {{ alerta }}
          </div>

          <!-- Botones -->
          <div class="flex justify-end gap-2 mt-4">
            <button
              class="px-4 py-2 bg-zinc-700/50 text-white rounded hover:bg-zinc-600/50 transition-colors"
              @click="cerrar"
              :disabled="loading"
            >
              Cancelar
            </button>

            <button
              class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="loading || !motivo.trim()"
              @click="confirmarEliminacion"
            >
              {{ loading ? 'Eliminando...' : 'Eliminar Lote' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  </Teleport>
</template>

<script>
import { ref } from 'vue'
import { LoteInsumoService } from '../../services/insumosModuleService'

export default {
  name: 'LoteDeleteModal',
  props: {
    lote: {
      type: Object,
      default: null
    },
    insumos: {
      type: Array,
      default: () => []
    },
    usuarioId: {
      type: String,
      required: true
    }
  },
  emits: ['cerrar', 'confirmado'],
  setup(props, { emit }) {
    const motivo = ref('')
    const alerta = ref(null)
    const alertaClass = ref('')
    const loading = ref(false)

    const getInsumoNombre = () => {
      const insumo = props.insumos.find(i => i.id === props.lote?.insumo_id)
      return insumo?.nombre || 'Insumo no encontrado'
    }

    const getInsumoUnidad = () => {
      const insumo = props.insumos.find(i => i.id === props.lote?.insumo_id)
      return insumo?.unidad_medida || 'unidades'
    }

    const formatearPrecio = (precio) => {
      if (!precio) return '0.00'
      return Number(precio).toLocaleString('es-CR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    }

    const calcularValor = () => {
      if (!props.lote) return 0
      return (props.lote.cantidad_actual || 0) * (props.lote.precio_unitario || 0)
    }

    const cerrar = () => {
      if (!loading.value) {
        motivo.value = ''
        alerta.value = null
        alertaClass.value = ''
        emit('cerrar')
      }
    }

    const confirmarEliminacion = async () => {
      if (!props.lote?.id || !motivo.value.trim()) {
        alerta.value = 'Debes proporcionar un motivo para la eliminación'
        alertaClass.value = 'bg-yellow-900 text-yellow-200 border border-yellow-700'
        return
      }

      loading.value = true
      alerta.value = null

      try {
        // Intentar eliminar el lote
        const result = await LoteInsumoService.deleteLote(
          props.lote.id,
          props.usuarioId,
          motivo.value.trim()
        )

        if (result.success) {
          alerta.value = 'Lote eliminado exitosamente'
          alertaClass.value = 'bg-green-900 text-green-200 border border-green-700'
          
          // Esperar un momento para mostrar el mensaje de éxito
          setTimeout(() => {
            emit('confirmado', props.lote)
            cerrar()
          }, 1000)
        } else {
          alerta.value = result.error || 'Error al eliminar el lote'
          alertaClass.value = 'bg-red-900 text-red-200 border border-red-700'
        }
      } catch (error) {
        console.error('Error al eliminar lote:', error)
        alerta.value = 'Error inesperado al eliminar el lote'
        alertaClass.value = 'bg-red-900 text-red-200 border border-red-700'
      } finally {
        loading.value = false
      }
    }

    return {
      motivo,
      alerta,
      alertaClass,
      loading,
      cerrar,
      confirmarEliminacion,
      getInsumoNombre,
      getInsumoUnidad,
      formatearPrecio,
      calcularValor
    }
  }
}
</script>
