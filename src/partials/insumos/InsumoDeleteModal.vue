<template>
  <div v-if="insumo" class="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/50 z-50">
    <div class="bg-zinc-900/95 border border-zinc-700/50 rounded-lg shadow-2xl w-full max-w-md p-6">
      <h2 class="text-lg font-bold text-white mb-4">Eliminar / Desactivar Insumo</h2>

      <p class="text-sm text-gray-300 mt-3 mb-2">
        Para confirmar la acción, escribe <span class="font-semibold text-yellow-400">confirmar</span>:
      </p>
      <input
        v-model="confirmacionTexto"
        type="text"
        class="w-full bg-zinc-900/80 border border-zinc-700/50 rounded p-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        placeholder="confirmar"
      />

      <!-- Mensaje de alerta -->
      <div v-if="alerta" class="mt-3 p-2 text-sm rounded bg-yellow-900 text-yellow-200 border border-yellow-700">
        {{ alerta }}
      </div>

      <!-- Botones -->
      <div class="flex justify-end gap-2 mt-4">
        <button
          class="px-4 py-2 bg-zinc-700 text-white rounded hover:bg-zinc-600 transition-colors border border-zinc-600"
          @click="cerrar"
        >
          Cancelar
        </button>

        <!-- Escenario normal: Eliminar -->
        <button
          v-if="!blocked"
          class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition-colors border border-red-400"
          :disabled="loading || !confirmacionValida"
          @click="confirmarEliminacion"
        >
          {{ loading ? 'Procesando...' : 'Eliminar' }}
        </button>

        <!-- Escenario bloqueado: opciones -->
        <button
          v-if="blocked && opciones.includes('Desactivar insumo')"
          class="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition-colors border border-yellow-300"
          :disabled="loading || !confirmacionValida"
          @click="desactivarInsumo"
        >
          {{ loading ? 'Procesando...' : 'Desactivar' }}
        </button>

        <button
          v-if="blocked && opciones.includes('Ver historial completo')"
          class="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition-colors border border-yellow-300"
          @click="verHistorial"
        >
          Ver historial
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
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
  emits: ['cerrar', 'actualizado', 'ver-historial'],
  setup(props, { emit }) {
    const motivo = ref('')
    const alerta = ref(null)
    const opciones = ref([])
    const blocked = ref(false)
    const loading = ref(false)
    const confirmacionTexto = ref('')
    const confirmacionValida = computed(() => confirmacionTexto.value.trim().toLowerCase() === 'confirmar')

    const cerrar = () => {
      confirmacionTexto.value = ''
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
        props.usuarioId
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
        props.usuarioId
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

    const verHistorial = () => {
      if (!props.insumo?.id) return
      emit('ver-historial', props.insumo.id)
      cerrar()
    }

    const getStockTotal = (insumo) => {
      if (!insumo?.lotes) return 0
      return insumo.lotes.reduce((total, lote) => total + parseFloat(lote.cantidad_actual || 0), 0)
    }

    return {
      confirmacionTexto,
      confirmacionValida,
      alerta,
      opciones,
      blocked,
      loading,
      cerrar,
      confirmarEliminacion,
      desactivarInsumo,
      verHistorial,
      getStockTotal
    }
  }
}
</script>
