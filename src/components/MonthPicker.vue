<template>
  <div class="relative">
    <flat-pickr 
      class="form-input pl-9 px-3 py-2 bg-zinc-900/95 text-gray-100 text-sm hover:bg-zinc-900 border border-zinc-700/50 focus:border-[#F4B400] focus:ring-1 focus:ring-[#F4B400] placeholder-gray-500 rounded-lg font-medium w-[15.5rem] transition-colors duration-150" 
      style="color-scheme: dark;"
      :config="config" 
      v-model="date"
      @on-change="onDateChange"
    ></flat-pickr>
    <div class="absolute inset-0 right-auto flex items-center pointer-events-none">
      <svg class="fill-current text-gray-400 ml-3" width="16" height="16" viewBox="0 0 16 16">
        <path d="M5 4a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H5Z" />
        <path d="M4 0a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4H4ZM2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Z" />
      </svg>
    </div>    
  </div>
</template>

<script>
import flatPickr from 'vue-flatpickr-component'
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect/index'
import 'flatpickr/dist/plugins/monthSelect/style.css'
import { Spanish } from 'flatpickr/dist/l10n/es.js'

export default {
  name: 'MonthPicker',
  props: ['align'],
  emits: ['change-month'],
  components: {
    flatPickr
  },
  data(props) {
    return {
      date: new Date(),
      config: {
        plugins: [
          monthSelectPlugin({
            shorthand: true, //defaults to false
            dateFormat: "F Y", //defaults to "F Y"
            altFormat: "F Y", //defaults to "F Y"
            theme: "dark" // defaults to "light"
          })
        ],
        locale: Spanish,
        disableMobile: true,
        defaultDate: new Date(),
        prevArrow: '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
        nextArrow: '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
        onReady: (selectedDates, dateStr, instance) => {
          const customClass = (props.align) ? props.align : '';
          instance.calendarContainer.classList.add(`flatpickr-${customClass}`);            
        },
      }
    }
  },
  methods: {
    onDateChange(selectedDates, dateStr, instance) {
      if (selectedDates.length > 0) {
        this.$emit('change-month', selectedDates[0]);
      }
    }
  }
}
</script>

<style>
/* Estilos personalizados para el popup del calendario */
.flatpickr-calendar {
  background: rgba(24, 24, 27, 0.96) !important;
  border: 1px solid rgba(63, 63, 70, 0.6) !important;
  color: #F4F4F5 !important;
}

.flatpickr-calendar.open {
  background: rgba(24, 24, 27, 0.96) !important;
  border: 1px solid rgba(63, 63, 70, 0.6) !important;
  z-index: 99999 !important;
}

.flatpickr-months .flatpickr-month {
  background: transparent !important;
  color: #E4E4E7 !important;
}

.flatpickr-current-month {
  color: #E4E4E7 !important;
}

.flatpickr-monthSelect-theme-dark {
  background: rgba(24, 24, 27, 0.96) !important;
}

.flatpickr-monthSelect-month {
  color: #F4F4F5 !important;
  background-color: rgba(39, 39, 42, 0.85) !important;
  border: 1px solid rgba(63, 63, 70, 0.7) !important;
}

.flatpickr-monthSelect-month:hover {
  background: rgba(63, 63, 70, 0.9) !important;
  color: #FFFFFF !important;
}

.flatpickr-monthSelect-month.selected {
  background: #3F3F46 !important;
  color: #F4F4F5 !important;
  border-color: #A1A1AA !important;
}

/* Flechas de navegación */
.flatpickr-prev-month, .flatpickr-next-month {
  fill: #E4E4E7 !important;
  color: #E4E4E7 !important;
}

.flatpickr-prev-month:hover, .flatpickr-next-month:hover {
  fill: #FAFAFA !important;
  color: #FAFAFA !important;
}
</style>
