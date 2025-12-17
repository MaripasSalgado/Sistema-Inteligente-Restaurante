<template>
  <div class="flex flex-col col-span-full sm:col-span-6 xl:col-span-6 bg-zinc-900/80 border border-zinc-700/50 shadow-xs rounded-xl">
    <header class="px-5 py-4 border-b border-[#CCCCCC]">
      <h2 class="font-semibold text-gray-100">Tendencias Mensuales - Ingresos</h2>
    </header>
    <div class="px-5 py-3">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center" :style="{height: height + 'px'}">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
      <div v-else-if="sinDatos" class="flex items-center justify-center text-sm text-gray-400" :style="{height: height + 'px'}">
        Sin datos suficientes para mostrar la tendencia.
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
  Chart, LineController, LineElement, Filler, PointElement, LinearScale, CategoryScale, Tooltip, Legend
} from 'chart.js'

Chart.register(LineController, LineElement, Filler, PointElement, LinearScale, CategoryScale, Tooltip, Legend)

export default {
  name: 'PrediccionLargoPlazo',
  props: {
    width: { type: Number, default: 595 },
    height: { type: Number, default: 248 }
  },
  setup(props) {
    const canvas = ref(null)
    const loading = ref(true)
    let chart = null
    const sinDatos = ref(false)
    const darkMode = useDark()
    const datosGrafico = ref(null)

    const cargarDatos = async () => {
      loading.value = true

      try {
        // Obtener tendencias históricas de ingresos (últimos 12 meses)
        datosGrafico.value = await PrediccionService.getTendenciasHistoricas('ingresos', 12)
      } catch (error) {
        console.error('Error cargando tendencias:', error)
      } finally {
        loading.value = false
        await nextTick()
        crearGrafico(datosGrafico.value)
      }
    }

    const crearGrafico = (data) => {
      if (!data || !data.labels || data.labels.length === 0) {
        console.warn('[PrediccionLargoPlazo] Sin datos para dibujar')
        sinDatos.value = true
        return
      } else {
        sinDatos.value = false
      }

      console.log('[PrediccionLargoPlazo] Datos recibidos:', {
        labels: data.labels,
        valoresReales: data.valoresReales,
        predicciones: data.predicciones,
        totalReales: data.valoresReales?.filter(v => v !== null).length,
        totalPredicciones: data.predicciones?.filter(v => v !== null).length
      })

      if (chart) {
        chart.destroy()
      }

      const ctx = canvas.value

      if (!ctx) {
        console.warn('[PrediccionLargoPlazo] Canvas no disponible')
        return
      }

      const chartData = {
        labels: data.labels,
        datasets: [
          // Valores Reales (si existen)
          {
            label: 'Ingresos Reales',
            data: data.valoresReales,
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 3,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: '#10B981',
            pointHoverBackgroundColor: '#059669',
            pointBorderWidth: 2,
            pointBorderColor: '#ffffff',
            fill: false,
            tension: 0.3,
            spanGaps: true, // Permite conectar puntos aunque haya nulls
            segment: {
              borderColor: ctx => {
                // Asegura que la línea se dibuje incluso con valores null
                return '#10B981'
              }
            }
          },
          // Predicciones
          {
            label: 'Predicción',
            data: data.predicciones,
            borderColor: '#F59E0B',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            borderWidth: 3,
            borderDash: [5, 5],
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: '#F59E0B',
            pointHoverBackgroundColor: '#D97706',
            pointBorderWidth: 2,
            pointBorderColor: '#ffffff',
            fill: false,
            tension: 0.3,
            spanGaps: true
          },
          // Banda de Confianza Superior
          {
            label: 'Banda Superior',
            data: data.bandasSuperior,
            borderColor: 'rgba(245, 158, 11, 0.3)',
            backgroundColor: 'rgba(245, 158, 11, 0.05)',
            borderWidth: 1,
            pointRadius: 0,
            fill: '+1',
            tension: 0.3,
            spanGaps: true
          },
          // Banda de Confianza Inferior
          {
            label: 'Banda Inferior',
            data: data.bandasInferior,
            borderColor: 'rgba(245, 158, 11, 0.3)',
            backgroundColor: 'rgba(245, 158, 11, 0.05)',
            borderWidth: 1,
            pointRadius: 0,
            fill: false,
            tension: 0.3,
            spanGaps: true
          }
        ]
      }

      console.log('[PrediccionLargoPlazo] chartData', chartData)

      chart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
          layout: {
            padding: {
              top: 20,
              bottom: 20,
              left: 20,
              right: 20
            }
          },
          scales: {
            y: {
              display: true,
              beginAtZero: false,
              border: {
                display: false
              },
              grid: {
                color: darkMode.value ? '#374151' : '#E5E7EB',
                drawBorder: false
              },
              ticks: {
                color: darkMode.value ? '#9CA3AF' : '#6B7280',
                font: {
                  size: 12
                },
                callback: function(value) {
                  // Formato en miles de Colones
                  if (value >= 1000) {
                    return '₡' + (value / 1000).toFixed(0) + 'k'
                  }
                  return '₡' + value.toFixed(0)
                },
                maxTicksLimit: 6
              }
            },
            x: {
              type: 'category',
              display: true,
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
            tooltip: {
              backgroundColor: darkMode.value ? '#1F2937' : '#FFFFFF',
              titleColor: darkMode.value ? '#E5E7EB' : '#111827',
              bodyColor: darkMode.value ? '#D1D5DB' : '#374151',
              borderColor: darkMode.value ? '#374151' : '#E5E7EB',
              borderWidth: 1,
              cornerRadius: 8,
              displayColors: true,
              padding: 12,
              callbacks: {
                title: function(context) {
                  return 'Mes: ' + context[0].label
                },
                label: function(context) {
                  if (context.parsed.y === null) return null
                  const value = new Intl.NumberFormat('es-CR', {
                    style: 'currency',
                    currency: 'CRC',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  }).format(context.parsed.y)
                  return context.dataset.label + ': ' + value
                }
              }
            },
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
                pointStyle: 'circle',
                padding: 20,
                filter: function(item) {
                  // Ocultar bandas de la leyenda (demasiado ruido)
                  return !item.text.includes('Banda')
                }
              }
            }
          },
          interaction: {
            intersect: false,
            mode: 'index'
          },
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 1000,
            easing: 'easeInOutQuart'
          }
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
