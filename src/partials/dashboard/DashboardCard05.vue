<template>
  <div class="flex flex-col col-span-full sm:col-span-6 xl:col-span-6 bg-zinc-900/80 border border-zinc-700/50 shadow-xs rounded-xl">
    <header class="px-5 py-4 border-b border-zinc-700/50">
      <h2 class="font-semibold text-gray-100">Ventas del Mes</h2>
    </header>
    <!-- Chart built with Chart.js 3 -->
    <div class="px-5 py-3">
      <canvas ref="canvas" :width="width" :height="height"></canvas>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useDark } from '@vueuse/core'
import { chartAreaGradient } from '../../charts/ChartjsConfig'

import {
  Chart, LineController, LineElement, Filler, PointElement, LinearScale, CategoryScale, Tooltip,
} from 'chart.js'

// Import utilities
import { adjustColorOpacity, getCssVariable } from '../../utils/Utils'

Chart.register(LineController, LineElement, Filler, PointElement, LinearScale, CategoryScale, Tooltip)

export default {
  name: 'DashboardCard05',
  props: {
    data: { type: Array, default: () => [] },
    width: { type: Number, default: 595 },
    height: { type: Number, default: 248 }
  },
  setup(props) {
    const canvas = ref(null)
    let chart = null
    const darkMode = useDark()

    const createOrUpdateChart = () => {
      if (!canvas.value) return

      const ctx = canvas.value

      // Generar labels para los días del mes basado en la longitud de data
      const daysInMonth = props.data && props.data.length > 0 ? props.data.length : 31
      const labels = []
      for (let i = 1; i <= daysInMonth; i++) {
        labels.push(`${i}`)
      }

      // Usar datos reales del prop (sin datos demo)
      const ventasData = props.data && props.data.length > 0 ? props.data : Array(31).fill(0)

      const chartData = {
        labels,
        datasets: [
          {
            label: 'Ventas Mes',
            data: ventasData,
            fill: true,
            backgroundColor: function(context) {
              const chart = context.chart;
              const {ctx, chartArea} = chart;
              return chartAreaGradient(ctx, chartArea, [
                { stop: 0, color: adjustColorOpacity(getCssVariable('--color-yellow-500'), 0.3) },
                { stop: 1, color: adjustColorOpacity(getCssVariable('--color-yellow-500'), 0.1) }
              ]);
            },
            borderColor: getCssVariable('--color-yellow-500'),
            borderWidth: 3,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: getCssVariable('--color-yellow-500'),
            pointHoverBackgroundColor: getCssVariable('--color-yellow-600'),
            pointBorderWidth: 2,
            pointBorderColor: '#000000',
            pointHoverBorderWidth: 2,
            pointHoverBorderColor: '#000000',
            clip: 20,
            tension: 0.4,
          },
        ],
      }

      // Si el chart ya existe, actualizar los datos
      if (chart) {
        chart.data.labels = labels
        chart.data.datasets[0].data = ventasData
        chart.update('none') // Update without animation for better performance
      } else {
        // Crear nuevo chart
        chart = new Chart(ctx, {
          type: 'line',
          data: chartData,
          options: {
            layout: {
              padding: {
                top: 20,
                bottom: 20,
                left: 20,
                right: 20,
              },
            },
            scales: {
              y: {
                display: true,
                beginAtZero: true,
                border: {
                  display: false,
                },
                grid: {
                  color: darkMode.value ? '#374151' : '#E5E7EB',
                  drawBorder: false,
                },
                ticks: {
                  color: darkMode.value ? '#9CA3AF' : '#6B7280',
                  font: {
                    size: 12,
                  },
                  callback: function(value) {
                    return '₡' + value.toLocaleString();
                  },
                  maxTicksLimit: 6,
                },
              },
              x: {
                type: 'category',
                display: true,
                border: {
                  display: false,
                },
                grid: {
                  display: false,
                },
                ticks: {
                  color: darkMode.value ? '#9CA3AF' : '#6B7280',
                  font: {
                    size: 11,
                  },
                  maxTicksLimit: 12,
                },
              },
            },
            plugins: {
              tooltip: {
                backgroundColor: darkMode.value ? '#1F2937' : '#FFFFFF',
                titleColor: darkMode.value ? '#E5E7EB' : '#111827',
                bodyColor: darkMode.value ? '#D1D5DB' : '#374151',
                borderColor: darkMode.value ? '#374151' : '#E5E7EB',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: true,
                callbacks: {
                  title: function(context) {
                    return 'Día: ' + context[0].label;
                  },
                  label: function(context) {
                    return context.dataset.label + ': ₡' + context.parsed.y.toLocaleString();
                  },
                },
              },
              legend: {
                display: true,
                position: 'top',
                align: 'start',
                labels: {
                  color: darkMode.value ? '#E5E7EB' : '#374151',
                  font: {
                    size: 12,
                  },
                  usePointStyle: true,
                  pointStyle: 'circle',
                  padding: 20,
                },
              },
            },
            interaction: {
              intersect: false,
              mode: 'index',
            },
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              duration: 500,
              easing: 'easeInOutQuart',
            },
          },
        })
      }
    }

    onMounted(() => {
      createOrUpdateChart()
    })

    // Watch for data changes and update chart
    watch(() => props.data, () => {
      createOrUpdateChart()
    }, { deep: true })

    onUnmounted(() => {
      if (chart) {
        chart.destroy()
      }
    })

    return {
      canvas,
    } 
  }
}
</script>