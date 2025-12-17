<template>
  <div class="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-zinc-900/80 border border-zinc-700/50 shadow-xs rounded-xl">
    <header class="px-5 py-4 border-b border-zinc-700 flex justify-between items-center">
      <h2 class="font-semibold text-gray-100">Ventas de la Semana</h2>
      <select 
        v-model="selectedWeek" 
        @change="fetchWeekData"
        class="px-3 py-2 text-sm border border-zinc-700/50 rounded-lg bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 appearance-none cursor-pointer"
        style="background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27white%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e'); background-repeat: no-repeat; background-position: right 0.5rem center; background-size: 1.5em 1.5em; padding-right: 2.5rem;"
      >
        <option v-for="week in weekOptions" :key="week.value" :value="week.value">
          {{ week.label }}
        </option>
      </select>
    </header>
    <div class="px-5 py-3">
      <canvas ref="canvas" :width="width" :height="height"></canvas>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useDark } from '@vueuse/core'
import { chartAreaGradient } from '../../charts/ChartjsConfig'
import { DashboardService } from '@/services/dashboardService'

import {
  Chart, LineController, LineElement, Filler, PointElement, LinearScale, CategoryScale, Tooltip,
} from 'chart.js'

import { adjustColorOpacity, getCssVariable } from '../../utils/Utils'

Chart.register(LineController, LineElement, Filler, PointElement, LinearScale, CategoryScale, Tooltip)

export default {
  name: 'DashboardCard10',
  props: {
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    width: { type: Number, default: 389 },
    height: { type: Number, default: 248 }
  },
  setup(props) {
    const canvas = ref(null)
    let chart = null
    const darkMode = useDark()
    const selectedWeek = ref(1)
    const weekData = ref({ labels: [], data: [] })

    // Generar opciones de semanas con rangos de fechas
    const weekOptions = computed(() => {
      const daysInMonth = new Date(props.year, props.month + 1, 0).getDate()
      const weeks = []
      
      let currentDay = 1
      let weekNum = 1
      
      while (currentDay <= daysInMonth) {
        const startDay = currentDay
        const endDay = Math.min(currentDay + 6, daysInMonth)
        
        weeks.push({
          value: weekNum,
          label: `${startDay}-${endDay}`
        })
        
        currentDay = endDay + 1
        weekNum++
      }
      
      return weeks
    })

    // Días de la semana
    const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

    const fetchWeekData = async () => {
      const data = await DashboardService.getVentasPorSemanaMes(props.month, props.year, selectedWeek.value)
      weekData.value = data
      updateChart()
    }

    const updateChart = () => {
      if (!canvas.value) return

      const ctx = canvas.value

      // Calcular qué día de la semana es el primer día del rango
      const startDay = (selectedWeek.value - 1) * 7 + 1
      const firstDayOfMonth = new Date(props.year, props.month, 1).getDay()
      const firstDayOfWeek = new Date(props.year, props.month, startDay).getDay()
      
      // Ajustar para que Lunes sea 0 (JavaScript usa Domingo = 0)
      const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1

      // Generar labels con días de la semana
      const labels = weekData.value.labels.map((day, index) => {
        const dayIndex = (adjustedFirstDay + index) % 7
        return weekDays[dayIndex]
      })

      const chartData = {
        labels: labels.length > 0 ? labels : weekDays,
        datasets: [
          {
            label: 'Ventas',
            data: weekData.value.data.length > 0 ? weekData.value.data : Array(7).fill(0),
            fill: true,
            backgroundColor: function(context) {
              const chart = context.chart;
              const {ctx, chartArea} = chart;
              return chartAreaGradient(ctx, chartArea, [
                { stop: 0, color: adjustColorOpacity(getCssVariable('--color-green-500'), 0.3) },
                { stop: 1, color: adjustColorOpacity(getCssVariable('--color-green-500'), 0.05) }
              ]);
            },
            borderColor: getCssVariable('--color-green-500'),
            borderWidth: 3,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: getCssVariable('--color-green-500'),
            pointHoverBackgroundColor: getCssVariable('--color-green-600'),
            pointBorderWidth: 2,
            pointBorderColor: '#000000',
            pointHoverBorderWidth: 2,
            pointHoverBorderColor: '#000000',
            clip: 20,
            tension: 0.4,
          },
        ],
      }

      if (chart) {
        chart.data.labels = chartData.labels
        chart.data.datasets[0].data = chartData.datasets[0].data
        chart.update('none')
      } else {
        chart = new Chart(ctx, {
          type: 'line',
          data: chartData,
          options: {
            layout: {
              padding: {
                top: 12,
                bottom: 16,
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
                    size: 11,
                  },
                  callback: function(value) {
                    return '₡' + value.toLocaleString();
                  },
                  maxTicksLimit: 5,
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
                    const dayNum = weekData.value.labels[context[0].dataIndex]
                    return context[0].label + ' ' + dayNum;
                  },
                  label: function(context) {
                    return 'Ventas: ₡' + context.parsed.y.toLocaleString();
                  },
                },
              },
              legend: {
                display: false,
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
      fetchWeekData()
    })

    // Watch for month/year changes
    watch(() => [props.month, props.year], () => {
      selectedWeek.value = 1 // Reset to week 1 when month changes
      fetchWeekData()
    })

    onUnmounted(() => {
      if (chart) {
        chart.destroy()
      }
    })

    return {
      canvas,
      selectedWeek,
      weekOptions,
      fetchWeekData
    }
  }
}
</script>