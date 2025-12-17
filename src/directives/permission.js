import { usePermissions } from '@/composables/usePermissions'

export const vPermission = {
  mounted(el, binding) {
    const { hasPermission } = usePermissions()
    
    const { vista, operacion } = binding.value
    
    if (!hasPermission.value(vista, operacion)) {
      el.style.display = 'none'
    }
  },
  
  updated(el, binding) {
    const { hasPermission } = usePermissions()
    
    const { vista, operacion } = binding.value
    
    if (!hasPermission.value(vista, operacion)) {
      el.style.display = 'none'
    } else {
      el.style.display = ''
    }
  }
}

export default vPermission
