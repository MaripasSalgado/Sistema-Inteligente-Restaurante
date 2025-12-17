<template>
  <li class="pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0" :class="activeCondition && !noGradient && 'bg-gradient-to-r from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]'">
    <slot :handleClick="handleClick" :expanded="expanded" />
  </li>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'SidebarLinkGroup',
  props: ['activeCondition', 'noGradient', 'groupId'],
  setup(props) {
    // Obtener el estado inicial del localStorage usando el groupId
    const getInitialExpandedState = () => {
      const stored = localStorage.getItem('sidebar-expanded-state')
      if (stored) {
        try {
          const state = JSON.parse(stored)
          // Usar el estado guardado para este grupo específico o false como fallback
          return state[props.groupId] || false
        } catch (e) {
          return false
        }
      }
      return false
    }

    const expanded = ref(getInitialExpandedState())

    const handleClick = () => {
      expanded.value = !expanded.value
      // Guardar el estado en localStorage usando el groupId
      const currentState = JSON.parse(localStorage.getItem('sidebar-expanded-state') || '{}')
      currentState[props.groupId] = expanded.value
      localStorage.setItem('sidebar-expanded-state', JSON.stringify(currentState))
    }

    return {
      expanded,
      handleClick,
    }
  },
}
</script>