<template>
  <div v-if="insumo" class="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/50 z-50">
    <div class="bg-zinc-900/95 border border-zinc-700/50 rounded-lg shadow-2xl w-full max-w-md p-6">
      <h2 class="text-lg font-bold text-white mb-4">Eliminar / Desactivar Insumo</h2>

      <p class="text-sm text-gray-300 mb-2">
        Escriba el motivo de la eliminación o desactivación:
      </p>
      <textarea
        v-model="motivo"
        class="w-full bg-zinc-900/80 border border-zinc-700/50 rounded p-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
        rows="3"
        placeholder="Motivo..."
      />

      <!-- Mensaje de alerta -->
      <div v-if="alerta" class="mt-3 p-2 text-sm rounded bg-yellow-900 text-yellow-200 border border-yellow-700">
        {{ alerta }}
      </div>

      <!-- Botones -->
      <div class="flex justify-end gap-2 mt-4">
        <button
          class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
          @click="cerrar"
        >
          Cancelar
        </button>

        <!-- Escenario normal: Eliminar -->
        <button
          v-if="!blocked"
          class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          :disabled="loading || !motivo"
          @click="confirmarEliminacion"
        >
          {{ loading ? 'Procesando...' : 'Eliminar' }}
        </button>

        <!-- Escenario bloqueado: opciones -->
        <button
          v-if="blocked && opciones.includes('Desactivar insumo')"
          class="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          :disabled="loading || !motivo"
          @click="desactivarInsumo"
        >
          {{ loading ? 'Procesando...' : 'Desactivar' }}
        </button>

        <button
          v-if="blocked && opciones.includes('Ver historial completo')"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          @click="verHistorial"
        >
          Ver historial
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { InsumoService } from '../../services/insumoService'

export default {
  name: 'InsumoDeleteModal',
  props: {
    insumo: {
      type: Object,
      default: null
    },
    usuarioId: {
      type: String,
      required: true // ID del usuario logueado
    }
  },
  emits: ['cerrar', 'actualizado'],
  setup(props, { emit }) {
    const motivo = ref('')
    const alerta = ref(null)
    const opciones = ref([])
    const blocked = ref(false)
    const loading = ref(false)

    const cerrar = () => {
      motivo.value = ''
      alerta.value = null
      opciones.value = []
      blocked.value = false
      emit('cerrar')
    }

    const confirmarEliminacion = async () => {
      if (!props.insumo?.id) return
      loading.value = true
      alerta.value = null
      opciones.value = []
      blocked.value = false

      const result = await InsumoService.deleteInsumo(
        props.insumo.id,
        props.usuarioId,
        motivo.value
      )

      if (result.blocked) {
        // Escenario 2: insumo con movimientos
        alerta.value = result.message
        opciones.value = result.opciones
        blocked.value = true
      } else if (!result.success) {
        alerta.value = result.error
      } else {
        alerta.value = result.message
        emit('actualizado')
        cerrar()
      }
      loading.value = false
    }

    const desactivarInsumo = async () => {
      if (!props.insumo?.id) return
      loading.value = true
      alerta.value = null

      const result = await InsumoService.deactivateInsumo(
        props.insumo.id,
        props.usuarioId,
        motivo.value
      )

      if (result.blocked) {
        // Escenario 3: dependencias en recetas activas
        alerta.value = result.message
      } else if (!result.success) {
        alerta.value = result.error
      } else {
        alerta.value = result.message
        emit('actualizado')
        cerrar()
      }
      loading.value = false
    }

    const getStockTotal = (insumo) => {
      if (!insumo?.lotes) return 0
      return insumo.lotes.reduce((total, lote) => total + parseFloat(lote.cantidad_actual || 0), 0)
    }

    return {
      motivo,
      alerta,
      opciones,
      blocked,
      loading,
      cerrar,
      confirmarEliminacion,
      desactivarInsumo,
      getStockTotal
    }
  }
}
</script>
