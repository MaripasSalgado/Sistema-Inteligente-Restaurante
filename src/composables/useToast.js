import { ref } from 'vue'

const toasts = ref([])
let toastId = 0

export function useToast() {
  const addToast = (message, type = 'info', duration = 5000) => {
    const id = ++toastId
    const toast = {
      id,
      message,
      type,
      duration,
      visible: true
    }
    
    toasts.value.push(toast)
    
    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
    
    return id
  }

  const removeToast = (id) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (message, duration = 5000) => {
    return addToast(message, 'success', duration)
  }

  const error = (message, duration = 7000) => {
    return addToast(message, 'error', duration)
  }

  const warning = (message, duration = 6000) => {
    return addToast(message, 'warning', duration)
  }

  const info = (message, duration = 5000) => {
    return addToast(message, 'info', duration)
  }

  const confirm = (message, onConfirm, onCancel) => {
    const id = addToast(message, 'confirm', 0) // No auto-remove for confirm
    
    // Add confirm buttons to the toast
    const toast = toasts.value.find(t => t.id === id)
    if (toast) {
      toast.actions = {
        confirm: () => {
          onConfirm()
          removeToast(id)
        },
        cancel: () => {
          if (onCancel) onCancel()
          removeToast(id)
        }
      }
    }
    
    return id
  }

  const clearAll = () => {
    toasts.value.splice(0)
  }

  return {
    toasts,
    addToast,
    removeToast,
    clearAll,
    success,
    error,
    warning,
    info,
    confirm
  }
}
