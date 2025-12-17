<template>
  <div class="grow flex flex-col justify-center">
    <div>
      <canvas ref="canvas" :data="data" :width="width" :height="height"></canvas>
    </div>
    <div class="px-5 pt-2 pb-6">
      <ul ref="legend" class="flex flex-wrap justify-center -m-1"></ul>
    </div>
  </div>  
</template>

<script>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useDark } from '@vueuse/core'
import { getChartColors } from './ChartjsConfig'

import {
  Chart, DoughnutController, ArcElement, TimeScale, Tooltip,
} from 'chart.js'
import 'chartjs-adapter-moment'

Chart.register(DoughnutController, ArcElement, TimeScale, Tooltip)

export default {
  name: 'DoughnutChart',
  props: ['data', 'width', 'height'],
  setup(props) {

    const canvas = ref(null)
    const legend = ref(null)
    let chart = null
    const darkMode = useDark()
    const { tooltipTitleColor, tooltipBodyColor, tooltipBgColor, tooltipBorderColor } = getChartColors()
    
    onMounted(() => {
      const ctx = canvas.value

      // Ensure data is valid before creating chart
      const initialData = props.data || {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [],
          hoverBackgroundColor: [],
          borderWidth: 0
        }]
      }

      chart = new Chart(ctx, {
        type: 'doughnut',
        data: initialData,
        options: {
          cutout: '80%',
          layout: {
            padding: 24,
          },
          plugins: {
            legend: {
              display: false,
              labels: {
                generateLabels: (chart) => {
                  const data = chart.data;
                  if (!data || !data.labels || !data.datasets) {
                    return [];
                  }
                  if (data.labels.length && data.datasets.length) {
                    return data.labels.map((label, i) => {
                      const meta = chart.getDatasetMeta(0);
                      const style = meta.controller.getStyle(i);
                      return {
                        text: label,
                        fillStyle: style.backgroundColor,
                        strokeStyle: style.borderColor,
                        lineWidth: style.borderWidth,
                        hidden: !chart.getDataVisibility(i),
                        index: i
                      };
                    });
                  }
                  return [];
                }
              }
            },
            tooltip: {
              titleColor: darkMode.value ? tooltipTitleColor.dark : tooltipTitleColor.light,
              bodyColor: darkMode.value ? tooltipBodyColor.dark : tooltipBodyColor.light,
              backgroundColor: darkMode.value ? tooltipBgColor.dark : tooltipBgColor.light,
              borderColor: darkMode.value ? tooltipBorderColor.dark : tooltipBorderColor.light,
            },            
          },
          interaction: {
            intersect: false,
            mode: 'nearest',
          },
          animation: {
            duration: 500,
          },
          maintainAspectRatio: false,
          resizeDelay: 200,
        },
        plugins: [{
          id: 'htmlLegend',
          afterUpdate(c, args, options) {
            const ul = legend.value
            if (!ul) return
            // Remove old legend items
            while (ul.firstChild) {
              ul.firstChild.remove()
            }
            // Ensure data exists before generating labels
            if (!c.data || !c.data.labels || c.data.labels.length === 0) {
              return
            }
            if (!c.data.datasets || c.data.datasets.length === 0) {
              return
            }
            
            // Manually generate legend items from chart data
            const dataset = c.data.datasets[0]
            c.data.labels.forEach((label, i) => {
              const meta = c.getDatasetMeta(0)
              const style = meta.controller.getStyle(i)
              
              const item = {
                text: label,
                fillStyle: style.backgroundColor,
                strokeStyle: style.borderColor,
                lineWidth: style.borderWidth,
                hidden: !c.getDataVisibility(i),
                index: i
              }
              
              const li = document.createElement('li')
              li.style.margin = '4px'
              // Button element
              const button = document.createElement('button')
              button.classList.add('btn-xs', 'bg-white', 'dark:bg-zinc-700', 'text-gray-500', 'dark:text-gray-400', 'shadow-xs', 'shadow-black/[0.08]', 'rounded-full')
              button.style.opacity = item.hidden ? '.3' : ''
              button.onclick = () => {
                c.toggleDataVisibility(item.index, !item.index)
                c.update()
              }
              // Color box
              const box = document.createElement('span')
              box.style.display = 'block'
              box.style.width = '8px'
              box.style.height = '8px'
              box.style.backgroundColor = item.fillStyle
              box.style.borderRadius = '4px'
              box.style.marginRight = '4px'
              box.style.pointerEvents = 'none'
              // Label
              const labelEl = document.createElement('span')
              labelEl.style.display = 'flex'
              labelEl.style.alignItems = 'center'
              const labelText = document.createTextNode(item.text)
              labelEl.appendChild(labelText)
              li.appendChild(button)
              button.appendChild(box)
              button.appendChild(labelEl)
              ul.appendChild(li)
            })
          },
        }],        
      })
    })

    onUnmounted(() => chart.destroy())

    // Watch for data changes
    watch(
      () => props.data,
      (newData) => {
        if (chart && newData) {
          chart.data = newData
          chart.update('none')
        }
      },
      { deep: true }
    )

    watch(
      () => darkMode.value,
      () => {
        if (darkMode.value) {
          chart.options.plugins.tooltip.titleColor = tooltipTitleColor.dark
          chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.dark
          chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.dark
          chart.options.plugins.tooltip.borderColor = tooltipBorderColor.dark
        } else {
          chart.options.plugins.tooltip.titleColor = tooltipTitleColor.light
          chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.light
          chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.light
          chart.options.plugins.tooltip.borderColor = tooltipBorderColor.light
        }
        chart.update('none')
      })         

    return {
      canvas,
      legend,
    }
  }
}
</script>