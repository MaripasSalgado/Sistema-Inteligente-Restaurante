<template>
  <div class="flex flex-col col-span-full sm:col-span-6 xl:col-span-6 bg-zinc-900/80 border border-zinc-700/50 shadow-xs rounded-xl">
    <header class="px-5 py-4 border-b border-[#CCCCCC]">
      <h2 class="font-semibold text-gray-100">CONSUMO: ESTIMADO VS REAL</h2>
    </header>
    <div class="px-5 py-3">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center" :style="{height: height + 'px'}">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
      <div v-else-if="sinDatos" class="flex items-center justify-center text-sm text-gray-400" :style="{height: height + 'px'}">
        Sin datos suficientes para mostrar el comparativo.
      </div>

      <!-- Chart -->
      <canvas v-else ref="canvas" :width="width" :height="height"></canvas>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useDark } from '@vueuse/core'
import { PrediccionService } from '@/services/prediccionService'

import {
  Chart, BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend
} from 'chart.js'

Chart.register(BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend)

export default {
  name: 'AnalisisDesviaciones',
  props: {
    width: { type: Number, default: 595 },
    height: { type: Number, default: 248 }
  },
  setup(props) {
    const canvas = ref(null)
    const loading = ref(true)
    const sinDatos = ref(false)
    let chart = null
    const darkMode = useDark()
    const datosGrafico = ref(null)

    const cargarDatos = async () => {
      loading.value = true

      try {
        // Obtener comparación de estimado vs real de insumos (últimas 6 desviaciones)
        datosGrafico.value = await PrediccionService.getComparacionEstimadoVsReal('demanda_insumos', 6)
      } catch (error) {
        console.error('Error cargando comparación:', error)
      } finally {
        loading.value = false
        await nextTick()
        crearGrafico(datosGrafico.value)
      }
    }

    const crearGrafico = (data) => {
      if (!data || !data.labels || data.labels.length === 0) {
        console.warn('[AnalisisDesviaciones] Sin datos para dibujar')
        sinDatos.value = true
        return
      } else {
        sinDatos.value = false
      }

      if (chart) {
        chart.destroy()
      }

      const ctx = canvas.value

      if (!ctx) {
        console.warn('[AnalisisDesviaciones] Canvas no disponible')
        return
      }

      const chartData = {
        labels: data.labels,
        datasets: [
          // Estimado
          {
            label: 'Estimado',
            data: data.estimado,
            backgroundColor: '#3B82F6',
            hoverBackgroundColor: '#2563EB',
            barPercentage: 0.8,
            categoryPercentage: 0.9,
            borderRadius: 4
          },
          // Real
          {
            label: 'Real',
            data: data.real,
            backgroundColor: '#10B981',
            hoverBackgroundColor: '#059669',
            barPercentage: 0.8,
            categoryPercentage: 0.9,
            borderRadius: 4
          }
        ]
      }

      console.log('[AnalisisDesviaciones] chartData', chartData)

      chart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
          layout: {
            padding: {
              top: 12,
              bottom: 16,
              left: 20,
              right: 20
            }
          },
          scales: {
            y: {
              border: {
                display: false
              },
              ticks: {
                maxTicksLimit: 5,
                callback: (value) => `${value}kg`,
                color: darkMode.value ? '#9CA3AF' : '#6B7280',
                font: {
                  size: 12
                }
              },
              grid: {
                color: darkMode.value ? '#374151' : '#E5E7EB'
              }
            },
            x: {
              type: 'category',
              border: {
                display: false
              },
              grid: {
                display: false
              },
              ticks: {
                color: darkMode.value ? '#9CA3AF' : '#6B7280',
                font: {
                  size: 11
                }
              }
            }
          },
          plugins: {
            legend: {
              display: true,
              position: 'top',
              align: 'start',
              labels: {
                color: darkMode.value ? '#E5E7EB' : '#374151',
                font: {
                  size: 12
                },
                usePointStyle: true,
                pointStyle: 'rect',
                padding: 20
              }
            },
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
                  return 'Producto: ' + context[0].label
                },
                label: function(context) {
                  return context.dataset.label + ': ' + context.parsed.y + 'kg'
                }
              }
            }
          },
          interaction: {
            intersect: false,
            mode: 'index'
          },
          animation: {
            duration: 500
          },
          maintainAspectRatio: false,
          resizeDelay: 200
        }
      })
    }

    onMounted(() => {
      cargarDatos()
    })

    onUnmounted(() => {
      if (chart) {
        chart.destroy()
      }
    })

    return {
      canvas,
      loading,
      sinDatos
    }
  }
}
</script> 
