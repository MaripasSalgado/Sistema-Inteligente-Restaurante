<template>
  <div class="relative">
    <flat-pickr class="form-input pl-9 bg-black text-gray-100 hover:bg-zinc-800 border border-[#CCCCCC] rounded-lg font-medium w-[15.5rem]" :config="config" v-model="date"></flat-pickr>
    <div class="absolute inset-0 right-auto flex items-center pointer-events-none">
      <svg class="fill-current text-gray-300 ml-3" width="16" height="16" viewBox="0 0 16 16">
        <path d="M5 4a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H5Z" />
        <path d="M4 0a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4H4ZM2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Z" />
      </svg>
    </div>    
  </div>
</template>

<script>
import flatPickr from 'vue-flatpickr-component'

export default {
  name: 'Datepicker',
  props: ['align'],
    data (props) {
      return {
        date: null, // refer to https://github.com/ankurk91/vue-flatpickr-component
        config: {
          mode: 'range',
          static: true,
          monthSelectorType: 'static',
          dateFormat: 'M j, Y',
          defaultDate: [new Date().setDate(new Date().getDate() - 6), new Date()],
          prevArrow: '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
          nextArrow: '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
          onReady: (selectedDates, dateStr, instance) => {
            instance.element.value = dateStr.replace('to', '-');
            const customClass = (props.align) ? props.align : '';
            instance.calendarContainer.classList.add(`flatpickr-${customClass}`);            
          },
          onChange: (selectedDates, dateStr, instance) => {
            instance.element.value = dateStr.replace('to', '-');
          },
        },                
      }
    },  
  components: {
    flatPickr
  },
}
</script>

<style>
/* Estilos personalizados para el popup del calendario */
.flatpickr-calendar {
  background: #000000 !important;
  border: 1px solid #666666 !important;
  color: #ffffff !important;
}

.flatpickr-calendar.open {
  background: #000000 !important;
  border: 1px solid #666666 !important;
}

.flatpickr-calendar .flatpickr-months {
  background: #000000 !important;
  color: #ffffff !important;
}

.flatpickr-calendar .flatpickr-month {
  background: #000000 !important;
  color: #ffffff !important;
}

.flatpickr-calendar .flatpickr-current-month {
  background: #000000 !important;
  color: #ffffff !important;
}

.flatpickr-calendar .flatpickr-weekdays {
  background: #000000 !important;
  color: #cccccc !important;
}

.flatpickr-calendar .flatpickr-weekday {
  background: #000000 !important;
  color: #cccccc !important;
}

.flatpickr-calendar .flatpickr-days {
  background: #000000 !important;
}

.flatpickr-calendar .flatpickr-day {
  background: #000000 !important;
  color: #ffffff !important;
  border: 1px solid #333333 !important;
}

.flatpickr-calendar .flatpickr-day:hover {
  background: #333333 !important;
  color: #ffffff !important;
}

.flatpickr-calendar .flatpickr-day.selected {
  background: #F4B400 !important;
  color: #000000 !important;
  border-color: #F4B400 !important;
}

.flatpickr-calendar .flatpickr-day.inRange {
  background: #F4B400 !important;
  color: #000000 !important;
  border-color: #F4B400 !important;
}

.flatpickr-calendar .flatpickr-day.startRange {
  background: #F4B400 !important;
  color: #000000 !important;
  border-color: #F4B400 !important;
}

.flatpickr-calendar .flatpickr-day.endRange {
  background: #F4B400 !important;
  color: #000000 !important;
  border-color: #F4B400 !important;
}

.flatpickr-calendar .flatpickr-day.today {
  background: #374151 !important;
  color: #ffffff !important;
  border-color: #6b7280 !important;
}

.flatpickr-calendar .flatpickr-day.prevMonthDay,
.flatpickr-calendar .flatpickr-day.nextMonthDay {
  color: #666666 !important;
}

.flatpickr-calendar .flatpickr-months .flatpickr-month {
  color: #ffffff !important;
}

.flatpickr-calendar .flatpickr-months .flatpickr-prev-month,
.flatpickr-calendar .flatpickr-months .flatpickr-next-month {
  color: #ffffff !important;
  fill: #ffffff !important;
}

.flatpickr-calendar .flatpickr-months .flatpickr-prev-month:hover,
.flatpickr-calendar .flatpickr-months .flatpickr-next-month:hover {
  color: #cccccc !important;
  fill: #cccccc !important;
}

.flatpickr-calendar .flatpickr-current-month .flatpickr-monthDropdown-months {
  background: #000000 !important;
  color: #ffffff !important;
}

.flatpickr-calendar .flatpickr-current-month input.cur-year {
  background: #000000 !important;
  color: #ffffff !important;
}
</style>