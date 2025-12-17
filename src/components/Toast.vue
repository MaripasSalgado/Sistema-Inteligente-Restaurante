<template>
  <div class="fixed top-4 right-4 z-[9999] space-y-3">
    <TransitionGroup name="toast" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="getToastClass(toast.type)"
        class="toast-container min-w-80 max-w-md w-full bg-zinc-900/95 border border-zinc-600 shadow-2xl rounded-lg pointer-events-auto overflow-hidden"
        @click.stop
      >
        <div class="p-6">
          <div class="toast-content flex items-start">
            <div class="flex-shrink-0">
              <component :is="getIcon(toast.type)" :class="getIconClass(toast.type)" class="h-7 w-7" />
            </div>
            <div class="toast-message ml-4 flex-1 pt-1">
              <p class="text-base font-medium text-white">{{ toast.message }}</p>
              
              <!-- Confirm actions -->
              <div v-if="toast.type === 'confirm' && toast.actions" class="toast-actions">
                <button
                  @click="toast.actions.confirm"
                  class="bg-red-600 text-white px-4 py-2 text-sm font-medium rounded hover:bg-red-700 transition-colors"
                >
                  Confirmar
                </button>
                <button
                  @click="toast.actions.cancel"
                  class="bg-gray-600 border border-zinc-600 text-white px-4 py-2 text-sm font-medium rounded hover:bg-gray-500 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
            <div class="ml-4 flex-shrink-0 flex items-start">
              <button
                @click="removeToast(toast.id)"
                class="bg-zinc-900/95 rounded-md inline-flex text-gray-400 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
              >
                <span class="sr-only">Cerrar</span>
                <svg class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script>
import { useToast } from '@/composables/useToast'
import CheckCircleIcon from './icons/CheckCircleIcon.vue'
import XCircleIcon from './icons/XCircleIcon.vue'
import ExclamationTriangleIcon from './icons/ExclamationTriangleIcon.vue'
import QuestionMarkCircleIcon from './icons/QuestionMarkCircleIcon.vue'
import InformationCircleIcon from './icons/InformationCircleIcon.vue'

export default {
  name: 'Toast',
  components: {
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
    QuestionMarkCircleIcon,
    InformationCircleIcon
  },
  setup() {
    const { toasts, removeToast } = useToast()

    const getToastClass = (type) => {
      switch (type) {
        case 'success':
          return 'border-l-4 border-green-500'
        case 'error':
          return 'border-l-4 border-red-500'
        case 'warning':
          return 'border-l-4 border-yellow-500'
        case 'confirm':
          return 'border-l-4 border-blue-500'
        default:
          return 'border-l-4 border-gray-500'
      }
    }

    const getIconClass = (type) => {
      switch (type) {
        case 'success':
          return 'text-green-500'
        case 'error':
          return 'text-red-500'
        case 'warning':
          return 'text-yellow-500'
        case 'confirm':
          return 'text-yellow-500'
        default:
          return 'text-gray-500'
      }
    }

    const getIcon = (type) => {
      switch (type) {
        case 'success':
          return 'CheckCircleIcon'
        case 'error':
          return 'XCircleIcon'
        case 'warning':
          return 'ExclamationTriangleIcon'
        case 'confirm':
          return 'QuestionMarkCircleIcon'
        default:
          return 'InformationCircleIcon'
      }
    }

    return {
      toasts,
      removeToast,
      getToastClass,
      getIconClass,
      getIcon
    }
  }
}
</script>

<style>
/* Estilos globales para asegurar que los toasts se vean correctamente */
.toast-container {
  min-height: 80px !important;
  display: flex !important;
  flex-direction: column !important;
}

.toast-content {
  flex: 1 !important;
  display: flex !important;
  align-items: flex-start !important;
  gap: 1rem !important;
}

.toast-message {
  flex: 1 !important;
  min-height: 1.5rem !important;
  line-height: 1.5 !important;
}

.toast-actions {
  margin-top: 0.75rem !important;
  display: flex !important;
  gap: 0.5rem !important;
}

.toast-actions button {
  min-height: 2rem !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
}
</style>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}

/* Asegurar que el toast tenga altura mínima y no se colapse */
.toast-container {
  min-height: 80px;
  display: flex;
  flex-direction: column;
}

.toast-content {
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

/* Forzar que el contenido no se colapse */
.toast-message {
  flex: 1;
  min-height: 1.5rem;
  line-height: 1.5;
}

/* Asegurar que los botones tengan altura mínima */
.toast-actions {
  margin-top: 0.75rem;
  display: flex;
  gap: 0.5rem;
}

.toast-actions button {
  min-height: 2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
