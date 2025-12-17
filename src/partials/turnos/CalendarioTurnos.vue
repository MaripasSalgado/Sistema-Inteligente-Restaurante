<template>
  <div class="space-y-6">
    <!-- Configuración de Horarios del Local -->
    <div class="bg-zinc-900/50 border border-zinc-700/50 rounded-lg p-6">
      <h3 class="text-lg font-semibold text-gray-100 mb-4">Horarios de Apertura del Local</h3>
      <div class="grid grid-cols-1 md:grid-cols-7 gap-4">
        <div v-for="(horario, dia) in horariosLocal" :key="dia" class="space-y-3">
          <label class="block text-sm font-medium text-gray-300">{{ getNombreDia(dia) }}</label>
          <div class="flex items-center space-x-2">
            <input
              v-model="horario.abierto"
              type="checkbox"
              class="w-4 h-4 text-violet-500 bg-zinc-800 border-zinc-700/50 rounded focus:ring-violet-500 focus:ring-2"
            />
            <span class="text-sm text-gray-400">Abierto</span>
          </div>
          <div v-if="horario.abierto" class="space-y-2">
            <div>
              <label class="block text-xs text-gray-400 mb-1.5">Apertura</label>
              <div class="relative">
                <input
                  :id="`apertura-${dia}`"
                  v-model="horario.apertura"
                  type="time"
                  step="900"
                  class="time-input w-full pl-3 pr-10 py-2.5 text-sm bg-zinc-900/50 border border-zinc-700/50 rounded text-gray-100 focus:border-violet-500 focus:outline-none"
                />
                <svg
                  @click="abrirSelector(`apertura-${dia}`)"
                  class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white cursor-pointer hover:text-violet-400 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div>
              <label class="block text-xs text-gray-400 mb-1.5">Cierre</label>
              <div class="relative">
                <input
                  :id="`cierre-${dia}`"
                  v-model="horario.cierre"
                  type="time"
                  step="900"
                  class="time-input w-full pl-3 pr-10 py-2.5 text-sm bg-zinc-900/50 border border-zinc-700/50 rounded text-gray-100 focus:border-violet-500 focus:outline-none"
                />
                <svg
                  @click="abrirSelector(`cierre-${dia}`)"
                  class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white cursor-pointer hover:text-violet-400 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-6 flex justify-end gap-4">
        <button
          @click="guardarHorarios"
          :disabled="cargando"
          class="px-4 py-2 bg-violet-500 text-black rounded-lg font-medium transition-colors hover:bg-violet-400 disabled:opacity-50"
        >
          {{ cargando ? 'Guardando...' : 'Guardar Horarios' }}
        </button>
      </div>
    </div>

    <!-- Header del Calendario -->
    <div class="flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <button
          @click="semanaAnterior"
          class="p-2 text-gray-400 hover:text-amber-500 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h2 class="text-xl font-semibold text-gray-100">
          {{ fechaInicioSemana.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }) }} - 
          {{ fechaFinSemana.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }) }}
        </h2>
        
        <button
          @click="semanaSiguiente"
          class="p-2 text-gray-400 hover:text-amber-500 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <div class="flex space-x-2">
        <button
          @click="vistaActual = 'semana'"
          class="px-3 py-1 text-sm rounded-lg transition-colors border font-semibold"
          :class="vistaActual === 'semana'
            ? 'bg-amber-400 text-black border-amber-400 shadow-md'
            : 'bg-zinc-200/80 text-black border-zinc-400 hover:bg-zinc-100'"
        >
          Semana
        </button>
        <button
          @click="vistaActual = 'dia'"
          class="px-3 py-1 text-sm rounded-lg transition-colors border font-semibold"
          :class="vistaActual === 'dia'
            ? 'bg-amber-400 text-black border-amber-400 shadow-md'
            : 'bg-zinc-200/80 text-black border-zinc-400 hover:bg-zinc-100'"
        >
          Día
        </button>
      </div>
    </div>

    <!-- Calendario Semanal -->
    <div v-if="vistaActual === 'semana'" class="bg-zinc-900/50 rounded-lg border border-zinc-700/50 overflow-hidden">
      <!-- Header de días -->
      <div class="grid grid-cols-8 bg-zinc-800/50 border-b border-zinc-700/50">
        <div class="p-3 text-sm font-medium text-gray-400 border-r border-zinc-700/50">
          Hora
        </div>
        <div
          v-for="dia in diasSemana"
          :key="dia.fecha"
          class="p-3 text-sm font-medium text-gray-200 border-r border-zinc-700/50 text-center"
        >
          <div class="font-semibold">{{ dia.nombre }}</div>
          <div class="text-xs text-gray-400">{{ dia.fecha }}</div>
        </div>
      </div>

      <!-- Franjas horarias -->
      <div class="max-h-96 overflow-y-auto">
        <div
          v-for="hora in franjasHorarias"
          :key="hora"
          class="grid grid-cols-8 border-b border-zinc-700/50 hover:bg-zinc-800/30 transition-colors"
        >
          <!-- Hora -->
          <div class="p-2 text-xs text-gray-400 border-r border-zinc-700/50 flex items-center justify-center h-[64px]">
            {{ hora }}
          </div>

          <!-- Celdas por día -->
          <div
            v-for="dia in diasSemana"
            :key="`${dia.fecha}-${hora}`"
            class="p-2 border-r border-zinc-700/50 h-[64px] relative overflow-visible group"
            :class="{ 'z-20 hover:z-30': getTurnosEnHora(dia.fecha, hora).length > 0 }"
            @click="crearTurno(dia.fecha, hora)"
          >
            <template v-for="turnosCelda in [getTurnosEnHora(dia.fecha, hora)]">
              <div
                v-if="esFranjaFueraHorario(dia.fecha, hora)"
                class="pointer-events-none absolute inset-1 rounded bg-red-500/15 border border-red-500/50 backdrop-blur-[1px]"
              ></div>

              <div
                v-else-if="turnosCelda.length === 0"
                class="pointer-events-none absolute inset-2 rounded border border-amber-400/40 bg-amber-400/5 text-[10px] text-amber-200 font-semibold flex items-center justify-center uppercase tracking-wide z-0"
              >
                Sin cobertura
              </div>

              <!-- Turnos en esta hora -->
              <div 
                v-for="(turno, index) in turnosCelda" 
                :key="`${turno.id}-${index}`"
                class="absolute rounded-md px-2 py-1 text-xs cursor-pointer transition-all hover:scale-[1.02] shadow-lg z-10"
                :class="[
                  getTurnoClass(turno),
                  esTurnoFueraHorario(turno) ? 'ring-2 ring-red-500/60 border-red-400 bg-red-900/70' : ''
                ]"
                :style="getTurnoBlockStyle(turno, index, turnosCelda.length)"
                @click.stop="editarTurno(turno)"
              >
                <div class="flex items-center justify-between gap-2 text-[11px] font-semibold text-gray-100">
                  <span class="truncate">{{ turno.empleado || turno.empleadoNombre || 'Sin asignar' }}</span>
                  <span class="text-[10px] text-gray-300">{{ turno.horaInicio }}</span>
                </div>
                <div class="text-[10px] text-gray-400">{{ turno.posicion || turno.puesto || turno.area }}</div>
                <div class="text-[10px] text-gray-500">Fin {{ turno.horaFin }}</div>
              </div>

              <!-- Tooltip con resumen -->
              <div
                v-if="turnosCelda.length"
                class="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full bg-black/80 text-[11px] text-gray-100 rounded-md px-3 py-2 shadow-xl border border-zinc-700/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-max max-w-xs z-20"
              >
                <p class="font-semibold text-amber-300 text-xs mb-1">
                  {{ dia.nombre }} · {{ hora }}
                </p>
                <ul class="space-y-1">
                  <li
                    v-for="turno in turnosCelda"
                    :key="`tooltip-${turno.id}`"
                  >
                    <span class="text-gray-200 font-medium">
                      {{ turno.empleado || turno.empleadoNombre || 'Sin asignar' }}
                    </span>
                    <span class="text-gray-400">({{ turno.horaInicio }} - {{ turno.horaFin }})</span>
                  </li>
                </ul>
              </div>
            </template>
            
            <!-- Indicador de cobertura -->
            <div 
              v-if="getCoberturaHora(dia.fecha, hora) < getCoberturaRequerida(dia.fecha, hora)"
              class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
              title="Cobertura insuficiente"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Vista de Día -->
    <div v-else class="bg-zinc-900/50 rounded-lg border border-zinc-700/50 overflow-hidden">
      <div class="p-4 border-b border-zinc-700/50 flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <button
            @click="cambiarDia(-1)"
            class="p-2 rounded-full text-gray-300 hover:text-amber-400 hover:bg-zinc-800 transition-colors"
            title="Día anterior"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h3 class="text-lg font-semibold text-gray-100 capitalize">
            {{ fechaSeleccionada.toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }) }}
          </h3>
          <button
            @click="cambiarDia(1)"
            class="p-2 rounded-full text-gray-300 hover:text-amber-400 hover:bg-zinc-800 transition-colors"
            title="Día siguiente"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <button
          @click="irAlDiaActual"
          class="px-3 py-1 text-sm font-semibold rounded-lg border border-amber-400 text-amber-400 hover:bg-amber-400/10 transition-colors"
        >
          Hoy
        </button>
      </div>
      
      <div class="max-h-96 overflow-y-auto">
        <div
          v-for="hora in franjasHorarias"
          :key="hora"
          class="flex border-b border-zinc-700/50 hover:bg-zinc-800/30 transition-colors"
        >
          <div class="w-20 p-3 text-sm text-gray-400 border-r border-zinc-700/50 flex items-center justify-center h-[64px]">
            {{ hora }}
          </div>
          <div 
            class="flex-1 p-3 h-[64px] relative overflow-visible group"
            :class="{ 'z-20 hover:z-30': getTurnosEnHora(fechaSeleccionada.toISOString().split('T')[0], hora).length > 0 }"
            @click="crearTurno(fechaSeleccionada.toISOString().split('T')[0], hora)"
          >
            <template v-for="turnosCelda in [getTurnosEnHora(fechaSeleccionada.toISOString().split('T')[0], hora)]">
              <div
                v-if="esFranjaFueraHorario(fechaSeleccionada.toISOString().split('T')[0], hora)"
                class="pointer-events-none absolute inset-1 rounded bg-red-500/15 border border-red-500/50 backdrop-blur-[1px]"
              ></div>

              <div
                v-else-if="turnosCelda.length === 0"
                class="pointer-events-none absolute inset-2 rounded border border-amber-400/40 bg-amber-400/5 text-[11px] text-amber-200 font-semibold flex items-center justify-center uppercase tracking-wide z-0"
              >
                Sin cobertura
              </div>

              <div 
                v-for="(turno, index) in turnosCelda" 
                :key="`${turno.id}-${index}`"
                class="absolute rounded-md px-3 py-2 text-sm cursor-pointer transition-all hover:scale-[1.02] shadow-lg z-10"
                :class="[
                  getTurnoClass(turno),
                  esTurnoFueraHorario(turno) ? 'ring-2 ring-red-500/60 border-red-400 bg-red-900/70' : ''
                ]"
                :style="getTurnoBlockStyle(turno, index, turnosCelda.length)"
                @click.stop="editarTurno(turno)"
              >
                <div class="flex items-center justify-between gap-2 text-sm font-semibold text-gray-100">
                  <span class="truncate">{{ turno.empleado || turno.empleadoNombre || 'Sin asignar' }}</span>
                  <span class="text-xs text-gray-300">{{ turno.horaInicio }}</span>
                </div>
                <div class="text-xs text-gray-400">{{ turno.posicion || turno.puesto || turno.area }}</div>
                <div class="text-xs text-gray-500">{{ turno.horaInicio }} - {{ turno.horaFin }}</div>
                <div v-if="turno.notas" class="mt-1 text-[11px] text-gray-400 italic truncate">
                  {{ turno.notas }}
                </div>
              </div>

              <div
                v-if="turnosCelda.length"
                class="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full bg-black/80 text-[11px] text-gray-100 rounded-md px-3 py-2 shadow-xl border border-zinc-700/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-max max-w-md z-20"
              >
                <p class="font-semibold text-amber-300 text-xs mb-1">
                  {{ fechaSeleccionada.toLocaleDateString('es-ES', { weekday: 'short' }) }} · {{ hora }}
                </p>
                <ul class="space-y-1">
                  <li
                    v-for="turno in turnosCelda"
                    :key="`tooltip-dia-${turno.id}`"
                  >
                    <span class="text-gray-200 font-medium">
                      {{ turno.empleado || turno.empleadoNombre || 'Sin asignar' }}
                    </span>
                    <span class="text-gray-400">({{ turno.horaInicio }} - {{ turno.horaFin }})</span>
                  </li>
                </ul>
              </div>
            </template>

            <div 
              v-if="getCoberturaHora(fechaSeleccionada.toISOString().split('T')[0], hora) < getCoberturaRequerida(fechaSeleccionada.toISOString().split('T')[0], hora)"
              class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
              title="Cobertura insuficiente"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Alertas de Cobertura -->
    <div v-if="alertasCobertura.length > 0" class="bg-red-900/20 border border-red-500 rounded-lg p-4">
      <div class="flex items-center space-x-2 mb-2">
        <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <span class="text-red-400 font-medium">Alertas de Cobertura</span>
      </div>
      <ul class="text-sm text-red-300 space-y-1">
        <li v-for="alerta in alertasCobertura" :key="alerta.id">
          {{ alerta.mensaje }}
        </li>
      </ul>
    </div>

    <!-- Modal de Crear/Editar Turno -->
    <Teleport to="body">
      <div
        v-if="mostrarModalTurno"
        class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50"
        @click.self="cerrarModalTurno"
      >
        <div
          class="bg-zinc-900/95 border border-zinc-700/50 rounded-lg p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
          @click.stop
        >
          <h3 class="text-lg font-semibold text-gray-100 mb-4">
            {{ turnoEditando ? 'Editar Turno' : 'Crear Nuevo Turno' }}
          </h3>

          <div class="space-y-4">
            <div>
              <label class="block text-sm text-gray-300 mb-2">Empleado</label>
              <select v-model="formularioTurno.usuario_id" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-gray-100">
                <option value="">Seleccionar empleado...</option>
                <option v-for="emp in empleadosDisponibles" :key="emp.id" :value="emp.id">
                  {{ emp.nombreCompleto }} - {{ emp.puesto || 'Sin puesto' }}
                </option>
              </select>
              <p v-if="empleadosDisponibles.length === 0" class="text-xs text-yellow-400 mt-1">
                No hay empleados activos. Verifica la tabla usuarios en Supabase.
              </p>
            </div>

            <div>
              <label class="block text-sm text-gray-300 mb-2">Fecha</label>
              <input v-model="formularioTurno.fecha" type="date" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-gray-100" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-gray-300 mb-2">Hora inicio</label>
                <input v-model="formularioTurno.hora_inicio" type="time" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-gray-100" />
              </div>
              <div>
                <label class="block text-sm text-gray-300 mb-2">Hora fin</label>
                <input v-model="formularioTurno.hora_fin" type="time" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-gray-100" />
              </div>
            </div>

            <div>
              <label class="block text-sm text-gray-300 mb-2">Área</label>
              <select v-model="formularioTurno.area" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-gray-100">
                <option value="cocina">Cocina</option>
                <option value="servicio">Servicio</option>
                <option value="caja">Caja</option>
                <option value="limpieza">Limpieza</option>
                <option value="administracion">Administración</option>
              </select>
            </div>

            <div>
              <label class="block text-sm text-gray-300 mb-2">Posición / Rol</label>
              <input
                v-model="formularioTurno.posicion"
                type="text"
                placeholder="Ej: Chef de línea"
                class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-gray-100 placeholder-gray-500"
              />
            </div>

            <div>
              <label class="block text-sm text-gray-300 mb-2">Notas (opcional)</label>
              <textarea v-model="formularioTurno.notas" rows="2" class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-gray-100"></textarea>
            </div>

            <div class="border border-zinc-700/50 rounded-lg p-4 bg-zinc-900/40">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-200">Crear turno recurrente</p>
                  <p class="text-xs text-gray-400">Genera turnos en un rango de fechas seleccionando los días de la semana.</p>
                </div>
                <label class="inline-flex items-center cursor-pointer">
                  <input type="checkbox" class="sr-only" v-model="recurrenciaActiva" :disabled="turnoEditando">
                  <span
                    class="w-11 h-6 flex items-center rounded-full p-1 transition-all"
                    :class="{
                      'bg-violet-500': recurrenciaActiva && !turnoEditando,
                      'bg-zinc-700': !recurrenciaActiva || turnoEditando,
                      'opacity-50': turnoEditando
                    }"
                  >
                    <span
                      class="bg-white w-4 h-4 rounded-full shadow transform transition-transform"
                      :class="{ 'translate-x-5': recurrenciaActiva && !turnoEditando }"
                    ></span>
                  </span>
                </label>
              </div>

              <p v-if="turnoEditando" class="text-xs text-gray-500 mt-2">
                La recurrencia solo está disponible al crear nuevos turnos.
              </p>

              <div v-if="recurrenciaActiva && !turnoEditando" class="mt-4 space-y-4">
                <div>
                  <label class="block text-xs text-gray-400 mb-1.5">Fecha final</label>
                  <input
                    v-model="recurrenciaConfig.fecha_fin"
                    type="date"
                    :min="formularioTurno.fecha"
                    class="w-full px-3 py-2 bg-zinc-900/60 border border-zinc-700 rounded text-gray-100"
                  />
                </div>
                <div>
                  <label class="block text-xs text-gray-400 mb-1.5">Días de la semana</label>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="dia in diasSemanaOpciones"
                      :key="dia.value"
                      type="button"
                      @click="toggleDiaRecurrencia(dia.value)"
                      class="px-3 py-1 rounded-full text-xs border transition-colors"
                      :class="recurrenciaConfig.dias.includes(dia.value)
                        ? 'bg-violet-500/20 border-violet-400 text-violet-200'
                        : 'border-zinc-700 text-gray-400 hover:border-zinc-500'"
                    >
                      {{ dia.label }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-3 mt-6">
            <button
              v-if="turnoEditando"
              @click="abrirDialogoEliminacion"
              :disabled="cargando"
              class="px-4 py-2 bg-red-500 text-black rounded hover:bg-red-400 disabled:opacity-50"
            >
              Eliminar
            </button>
            <div class="flex gap-3 ml-auto">
              <button @click="cerrarModalTurno" class="px-4 py-2 bg-zinc-200 text-black rounded hover:bg-zinc-100">
                Cancelar
              </button>
              <button @click="guardarTurno" :disabled="cargando" class="px-4 py-2 bg-amber-400 text-black rounded hover:bg-amber-300 disabled:opacity-50">
                {{ cargando ? 'Guardando...' : turnoEditando ? 'Actualizar Turno' : 'Guardar Turno' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Diálogo de confirmación de eliminación -->
    <Teleport to="body">
      <div
        v-if="mostrarDialogoEliminacion"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        @click.self="cerrarDialogoEliminacion"
      >
        <div class="bg-zinc-900/95 border border-zinc-700/50 rounded-lg p-6 w-full max-w-md shadow-2xl">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z" />
              </svg>
            </div>
            <div>
              <h4 class="text-lg font-semibold text-white">Confirmar eliminación</h4>
              <p v-if="modoEliminacion === 'single'" class="text-sm text-gray-300 mt-2">
                ¿Seguro que deseas eliminar este turno? Esta acción no se puede deshacer.
              </p>
              <p v-else class="text-sm text-gray-300 mt-2">
                Este turno pertenece a una serie recurrente. ¿Quieres eliminar solo este turno o toda la serie restante?
              </p>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-end gap-3 mt-6">
            <button @click="cerrarDialogoEliminacion" class="px-4 py-2 bg-zinc-800 text-gray-200 rounded hover:bg-zinc-700">
              Cancelar
            </button>
            <template v-if="modoEliminacion === 'serie'">
              <button
                @click="confirmarEliminacionTurno('single')"
                class="px-4 py-2 bg-amber-400 text-black rounded hover:bg-amber-300"
              >
                Solo este turno
              </button>
              <button
                @click="confirmarEliminacionTurno('serie')"
                class="px-4 py-2 bg-red-500 text-black rounded hover:bg-red-400"
              >
                Toda la serie
              </button>
            </template>
            <button
              v-else
              @click="confirmarEliminacionTurno('single')"
              class="px-4 py-2 bg-red-500 text-black rounded hover:bg-red-400"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'
import { HorarioLocalService } from '../../services/horarioLocalService.js'
import { TurnoService } from '../../services/turnoService.js'
import { supabase } from '../../config/supabase.js'

export default {
  name: 'CalendarioTurnos',
  setup() {
    const vistaActual = ref('semana')
    const fechaInicioSemana = ref(new Date())
    const fechaSeleccionada = ref(new Date())
    fechaSeleccionada.value.setHours(0, 0, 0, 0)
    const turnos = ref([])
    const sugerencias = ref([])
    const franjasRequeridas = ref([])
    const empleadosDisponibles = ref([])
    const cargando = ref(false)
    const error = ref(null)
    const SLOT_HEIGHT = 64
    const MAX_RECURRENTES = 90

    const { success: toastSuccess, error: toastError } = useToast()
    const { user } = useAuth()

    const turnoEditando = ref(null)
    const recurrenciaActiva = ref(false)
    const recurrenciaConfig = ref({
      fecha_fin: '',
      dias: []
    })
    const mostrarDialogoEliminacion = ref(false)
    const modoEliminacion = ref('single')

    const diasSemanaOpciones = [
      { value: 'lunes', label: 'Lunes' },
      { value: 'martes', label: 'Martes' },
      { value: 'miercoles', label: 'Miércoles' },
      { value: 'jueves', label: 'Jueves' },
      { value: 'viernes', label: 'Viernes' },
      { value: 'sabado', label: 'Sábado' },
      { value: 'domingo', label: 'Domingo' }
    ]

    const normalizarDia = (valor = '') => {
      if (!valor) return ''
      return valor
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
    }

    const toLocalDate = (valor) => {
      if (!valor) return null
      if (valor instanceof Date) {
        const copy = new Date(valor)
        copy.setHours(0, 0, 0, 0)
        return copy
      }
      if (typeof valor === 'string') {
        const partes = valor.split('-').map(Number)
        if (partes.length !== 3 || partes.some(n => Number.isNaN(n))) return null
        const [anio, mes, dia] = partes
        return new Date(anio, mes - 1, dia)
      }
      return null
    }

    const parseToMinutes = (hora) => {
      if (!hora) return 0
      const [h, m] = hora.split(':').map(Number)
      return (h || 0) * 60 + (m || 0)
    }

    const obtenerClaveDiaDesdeFecha = (fechaIso) => {
      if (!fechaIso) return ''
      const fecha = toLocalDate(fechaIso)
      if (!fecha || Number.isNaN(fecha.getTime())) return ''
      return normalizarDia(
        fecha.toLocaleDateString('es-ES', { weekday: 'long' })
      )
    }

    const sumarHoras = (horaBase = '00:00', horasASumar = 1) => {
      const [horas, minutos] = horaBase.split(':').map(Number)
      if (Number.isNaN(horas) || Number.isNaN(minutos)) return horaBase
      const fecha = new Date()
      fecha.setHours(horas, minutos, 0, 0)
      fecha.setHours(fecha.getHours() + horasASumar)
      const hh = fecha.getHours().toString().padStart(2, '0')
      const mm = fecha.getMinutes().toString().padStart(2, '0')
      return `${hh}:${mm}`
    }

    const toggleDiaRecurrencia = (dia) => {
      if (!recurrenciaActiva.value) return
      const dias = recurrenciaConfig.value.dias
      if (dias.includes(dia)) {
        recurrenciaConfig.value.dias = dias.filter(d => d !== dia)
      } else {
        recurrenciaConfig.value.dias = [...dias, dia]
      }
    }

    const generarFechasRecurrencia = () => {
      if (!recurrenciaActiva.value || !recurrenciaConfig.value.fecha_fin) return []

      const inicio = toLocalDate(formularioTurno.value.fecha)
      const fin = toLocalDate(recurrenciaConfig.value.fecha_fin)
      if (!inicio || !fin || fin < inicio) return []

      const diasSeleccionados = recurrenciaConfig.value.dias.length > 0
        ? recurrenciaConfig.value.dias
        : [obtenerClaveDiaDesdeFecha(formularioTurno.value.fecha)]

      const fechas = []
      const cursor = new Date(inicio)

      while (cursor.getTime() <= fin.getTime() && fechas.length < MAX_RECURRENTES) {
        const diaClave = normalizarDia(
          cursor.toLocaleDateString('es-ES', { weekday: 'long' })
        )
        if (diasSeleccionados.includes(diaClave)) {
          fechas.push(cursor.toISOString().split('T')[0])
        }
        cursor.setDate(cursor.getDate() + 1)
      }

      return fechas
    }

    const obtenerHorarioParaFecha = (fechaIso) => {
      const clave = obtenerClaveDiaDesdeFecha(fechaIso)
      if (!clave) return null
      return horariosLocal.value[clave] || null
    }

    const esFranjaFueraHorario = (fechaIso, hora) => {
      const horario = obtenerHorarioParaFecha(fechaIso)
      if (!horario || !horario.abierto) return true
      const minutos = parseToMinutes(hora)
      const apertura = parseToMinutes(horario.apertura)
      const cierre = parseToMinutes(horario.cierre)
      return minutos < apertura || minutos > cierre
    }

    const esTurnoFueraHorario = (turno) => {
      if (!turno) return false
      const fecha = turno.fecha
      return (
        esFranjaFueraHorario(fecha, turno.horaInicio || turno.hora_inicio) ||
        esFranjaFueraHorario(fecha, turno.horaFin || turno.hora_fin)
      )
    }


    // Modal de turno
    const mostrarModalTurno = ref(false)
    const formularioTurno = ref({
      usuario_id: '',
      fecha: new Date().toISOString().split('T')[0],
      hora_inicio: '09:00',
      hora_fin: '17:00',
      area: 'cocina',
      posicion: '',
      notas: ''
    })

    watch(recurrenciaActiva, (activa) => {
      if (!activa) {
        recurrenciaConfig.value = { fecha_fin: '', dias: [] }
        return
      }

      const fechaBase = formularioTurno.value.fecha
      recurrenciaConfig.value.fecha_fin = fechaBase
      recurrenciaConfig.value.dias = [obtenerClaveDiaDesdeFecha(fechaBase)]
    })

    watch(
      () => formularioTurno.value.fecha,
      (nuevaFecha) => {
        if (recurrenciaActiva.value) {
          if (!recurrenciaConfig.value.fecha_fin || recurrenciaConfig.value.fecha_fin < nuevaFecha) {
            recurrenciaConfig.value.fecha_fin = nuevaFecha
          }
          if (!recurrenciaConfig.value.dias.length) {
            recurrenciaConfig.value.dias = [obtenerClaveDiaDesdeFecha(nuevaFecha)]
          }
        }
      }
    )

    // Horarios del local - se cargarán desde la BD
    const horariosLocal = ref({
      lunes: { abierto: true, apertura: '08:00', cierre: '22:00' },
      martes: { abierto: true, apertura: '08:00', cierre: '22:00' },
      miercoles: { abierto: true, apertura: '08:00', cierre: '22:00' },
      jueves: { abierto: true, apertura: '08:00', cierre: '22:00' },
      viernes: { abierto: true, apertura: '08:00', cierre: '23:00' },
      sabado: { abierto: true, apertura: '09:00', cierre: '23:00' },
      domingo: { abierto: false, apertura: '10:00', cierre: '20:00' }
    })

    // Configurar fecha de inicio de semana (lunes)
    const configurarFechaInicioSemana = (fecha) => {
      const base = new Date(fecha)
      const dia = base.getDay()
      const diff = base.getDate() - dia + (dia === 0 ? -6 : 1) // Ajustar para que lunes sea 1
      base.setDate(diff)
      base.setHours(0, 0, 0, 0)
      return base
    }

    fechaInicioSemana.value = configurarFechaInicioSemana(new Date())

    // Computed properties
    const fechaFinSemana = computed(() => {
      const fin = new Date(fechaInicioSemana.value)
      fin.setDate(fin.getDate() + 6)
      return fin
    })

    const diasSemana = computed(() => {
      const dias = []
      for (let i = 0; i < 7; i++) {
        const fecha = new Date(fechaInicioSemana.value)
        fecha.setDate(fecha.getDate() + i)
        dias.push({
          fecha: fecha.toISOString().split('T')[0],
          nombre: fecha.toLocaleDateString('es-ES', { weekday: 'short' }),
          fechaCompleta: fecha
        })
      }
      return dias
    })

    const estaFechaDentroSemana = (fecha) => {
      if (!fechaInicioSemana.value || !fecha) return false
      const objetivo = toLocalDate(fecha)
      const inicio = toLocalDate(fechaInicioSemana.value)
      if (!objetivo || !inicio) return false
      const fin = new Date(inicio)
      fin.setDate(fin.getDate() + 6)
      fin.setHours(23, 59, 59, 999)
      return objetivo >= inicio && objetivo <= fin
    }

    const franjasHorarias = computed(() => {
      const horas = []
      for (let i = 6; i <= 23; i++) {
        horas.push(`${i.toString().padStart(2, '0')}:00`)
      }
      return horas
    })

    const alertasCobertura = computed(() => {
      const alertas = []
      let id = 1

      diasSemana.value.forEach(dia => {
        franjasHorarias.value.forEach(hora => {
          const cobertura = getCoberturaHora(dia.fecha, hora)
          const requerida = getCoberturaRequerida(dia.fecha, hora)
          
          if (cobertura < requerida) {
            alertas.push({
              id: id++,
              mensaje: `${dia.nombre} ${hora}: ${requerida - cobertura} empleado(s) faltante(s) en ${getAreaRequerida(dia.fecha, hora)}`
            })
          }
        })
      })

      return alertas
    })

    // Cargar horarios del local desde la BD
    const cargarHorarios = async () => {
      const resultado = await HorarioLocalService.getAllHorarios()
      if (resultado.success && resultado.data) {
        // Mapear los datos de la BD al formato del componente
        resultado.data.forEach(horario => {
          horariosLocal.value[horario.dia_semana] = {
            abierto: horario.abierto,
            apertura: horario.hora_apertura || '08:00',
            cierre: horario.hora_cierre || '22:00'
          }
        })
      }
    }

    // Cargar franjas requeridas desde la BD
    const cargarFranjasRequeridas = async () => {
      const { data, error } = await supabase
        .from('franjas_requeridas')
        .select('*')
        .eq('activo', true)

      if (!error && data) {
        franjasRequeridas.value = data.map(franja => ({
          id: franja.id,
          dia: franja.dia_semana,
          inicio: franja.hora_inicio,
          fin: franja.hora_fin,
          area: franja.area,
          minEmpleados: franja.min_empleados
        }))
      }
    }

    // Cargar turnos de la semana actual
    const cargarTurnos = async () => {
      cargando.value = true
      error.value = null

      const fechaInicio = fechaInicioSemana.value.toISOString().split('T')[0]
      const fechaFin = fechaFinSemana.value.toISOString().split('T')[0]

      const resultado = await TurnoService.getAllTurnos({
        fechaInicio,
        fechaFin
      })

      if (resultado.success) {
        // Mapear los datos de la BD al formato del componente
        turnos.value = resultado.data.map(turno => ({
          id: turno.id,
          empleado: turno.usuario ? `${turno.usuario.nombre} ${turno.usuario.apellido}` : 'Sin asignar',
          empleadoNombre: turno.usuario ? `${turno.usuario.nombre} ${turno.usuario.apellido}` : 'Sin asignar',
          puesto: turno.usuario?.puesto || turno.posicion,
          posicion: turno.posicion || turno.usuario?.puesto || '',
          fecha: turno.fecha,
          horaInicio: turno.hora_inicio,
          horaFin: turno.hora_fin,
          area: turno.area,
          estado: turno.estado,
          notas: turno.notas,
          usuarioId: turno.usuario_id,
          serieId: turno.serie_id || null,
          datosCompletos: turno
        }))
      } else {
        error.value = resultado.error
        console.error('Error al cargar turnos:', resultado.error)
      }

      cargando.value = false
    }

    // Methods
    const semanaAnterior = async () => {
      const nuevaFecha = new Date(fechaInicioSemana.value)
      nuevaFecha.setDate(nuevaFecha.getDate() - 7)
      fechaInicioSemana.value = configurarFechaInicioSemana(nuevaFecha)
      if (!estaFechaDentroSemana(fechaSeleccionada.value)) {
        fechaSeleccionada.value = new Date(fechaInicioSemana.value)
      }
      await cargarTurnos()
      await generarSugerencias()
    }

    const semanaSiguiente = async () => {
      const nuevaFecha = new Date(fechaInicioSemana.value)
      nuevaFecha.setDate(nuevaFecha.getDate() + 7)
      fechaInicioSemana.value = configurarFechaInicioSemana(nuevaFecha)
      if (!estaFechaDentroSemana(fechaSeleccionada.value)) {
        fechaSeleccionada.value = new Date(fechaInicioSemana.value)
      }
      await cargarTurnos()
      await generarSugerencias()
    }

    const cambiarDia = async (delta) => {
      if (!delta) return
      const nuevaFecha = new Date(fechaSeleccionada.value)
      nuevaFecha.setDate(nuevaFecha.getDate() + delta)
      nuevaFecha.setHours(0, 0, 0, 0)
      fechaSeleccionada.value = nuevaFecha

      if (!estaFechaDentroSemana(nuevaFecha)) {
        fechaInicioSemana.value = configurarFechaInicioSemana(nuevaFecha)
        await cargarTurnos()
        await generarSugerencias()
      }
    }

    const irAlDiaActual = async () => {
      const hoy = new Date()
      hoy.setHours(0, 0, 0, 0)
      const requiereActualizacion = !estaFechaDentroSemana(hoy)
      fechaSeleccionada.value = hoy

      if (requiereActualizacion) {
        fechaInicioSemana.value = configurarFechaInicioSemana(hoy)
        await cargarTurnos()
        await generarSugerencias()
      }
    }

    const getTurnosEnHora = (fecha, hora) => {
      return turnos.value.filter(turno => {
        const turnoHora = parseInt((turno.horaInicio || '0').split(':')[0])
        const horaInt = parseInt(hora.split(':')[0])
        return turno.fecha === fecha && turnoHora === horaInt
      })
    }

    const getCoberturaHora = (fecha, hora) => {
      const minutoReferencia = parseToMinutes(hora)
      return turnos.value.filter(turno => {
        if (turno.fecha !== fecha) return false
        const inicio = parseToMinutes(turno.horaInicio || turno.hora_inicio)
        const fin = parseToMinutes(turno.horaFin || turno.hora_fin)
        return minutoReferencia >= inicio && minutoReferencia < fin
      }).length
    }

    const getCoberturaRequerida = (fecha, hora) => {
      const fechaObjetivo = toLocalDate(fecha)
      if (!fechaObjetivo) return 0
      const dia = fechaObjetivo.toLocaleDateString('es-ES', { weekday: 'long' }).toLowerCase()
      const horaInt = parseInt(hora.split(':')[0])
      
      const franja = franjasRequeridas.value.find(f => 
        f.dia === dia && 
        parseInt(f.inicio.split(':')[0]) <= horaInt && 
        parseInt(f.fin.split(':')[0]) > horaInt
      )
      
      return franja ? franja.minEmpleados : 0
    }

    const getAreaRequerida = (fecha, hora) => {
      const fechaObjetivo = toLocalDate(fecha)
      if (!fechaObjetivo) return 'general'
      const dia = fechaObjetivo.toLocaleDateString('es-ES', { weekday: 'long' }).toLowerCase()
      const horaInt = parseInt(hora.split(':')[0])
      
      const franja = franjasRequeridas.value.find(f => 
        f.dia === dia && 
        parseInt(f.inicio.split(':')[0]) <= horaInt && 
        parseInt(f.fin.split(':')[0]) > horaInt
      )
      
      return franja ? franja.area : 'general'
    }

    const getTurnoClass = () => {
      return 'bg-zinc-900 text-gray-100 border border-zinc-600 shadow-lg ring-1 ring-black/40'
    }

    const getTurnoStyle = (turno) => {
      const inicio = parseToMinutes(turno.horaInicio || turno.hora_inicio)
      let fin = parseToMinutes(turno.horaFin || turno.hora_fin)
      
      // Handle overnight shifts (end time < start time)
      if (fin < inicio) {
        fin += 24 * 60 // Add 24 hours in minutes
      }
      
      // Dirty fix: Add 1 hour (60 minutes) to the duration as requested by user
      // to compensate for visual shortage where 22:00 end time only reaches 21:00 row.
      const durationMinutes = Math.max(fin - inicio, 30) + 60
      const minuteOffset = inicio % 60

      return {
        top: `${(minuteOffset / 60) * SLOT_HEIGHT}px`,
        height: `calc(${(durationMinutes / 60) * SLOT_HEIGHT}px + 10px)` // Added 10px for extra visual overlap
      }
    }

    const getTurnoBlockStyle = (turno, index = 0, total = 1) => {
      const base = getTurnoStyle(turno)
      if (total <= 1) {
        return {
          ...base,
          left: '0.25rem',
          right: '0.25rem'
        }
      }

      const widthPercent = (100 / total).toFixed(2)
      const leftPercent = (index * (100 / total)).toFixed(2)

      return {
        ...base,
        width: `calc(${widthPercent}% - 6px)`,
        left: `calc(${leftPercent}% + 3px)`,
        right: 'auto'
      }
    }

    // Cargar empleados disponibles
    const cargarEmpleados = async () => {
      const { data, error } = await supabase
        .from('usuarios')
        .select('id, nombre, apellido, puesto')
        .eq('estado', 'Activo')
        .order('nombre', { ascending: true })

      if (error) {
        console.error('Error al cargar empleados:', error)
        return
      }

      if (data) {
        empleadosDisponibles.value = data.map(emp => ({
          id: emp.id,
          nombre: emp.nombre,
          apellido: emp.apellido,
          nombreCompleto: `${emp.nombre} ${emp.apellido}`,
          puesto: emp.puesto
        }))
        console.log(`Empleados cargados: ${empleadosDisponibles.value.length}`, empleadosDisponibles.value)
      }
    }

    const abrirModalTurno = (fecha = null, hora = null) => {
      turnoEditando.value = null
      recurrenciaActiva.value = false
      recurrenciaConfig.value = { fecha_fin: '', dias: [] }
      resetFormularioTurno()

      if (fecha) {
        formularioTurno.value.fecha = fecha
      }
      if (hora) {
        formularioTurno.value.hora_inicio = hora
        formularioTurno.value.hora_fin = sumarHoras(hora, 1)
      } else {
        formularioTurno.value.hora_fin = sumarHoras(formularioTurno.value.hora_inicio, 1)
      }
      mostrarModalTurno.value = true
    }

    const resetFormularioTurno = () => {
      formularioTurno.value = {
        usuario_id: '',
        fecha: new Date().toISOString().split('T')[0],
        hora_inicio: '09:00',
        hora_fin: '17:00',
        area: 'cocina',
        posicion: '',
        notas: ''
      }
    }

    const cerrarModalTurno = () => {
      mostrarModalTurno.value = false
      turnoEditando.value = null
      recurrenciaActiva.value = false
      recurrenciaConfig.value = { fecha_fin: '', dias: [] }
      resetFormularioTurno()
    }

    const guardarTurno = async () => {
      if (!formularioTurno.value.usuario_id || !formularioTurno.value.fecha) {
        toastError('Completa todos los campos obligatorios')
        return
      }

      cargando.value = true

      const payloadBase = {
        usuario_id: formularioTurno.value.usuario_id,
        hora_inicio: formularioTurno.value.hora_inicio,
        hora_fin: formularioTurno.value.hora_fin,
        area: formularioTurno.value.area,
        posicion: formularioTurno.value.posicion || null,
        notas: formularioTurno.value.notas || null,
        serie_id: turnoEditando.value?.serieId || null
      }

      const autor = user.value?.id || formularioTurno.value.usuario_id

      try {
        if (turnoEditando.value) {
          const resultado = await TurnoService.updateTurno(turnoEditando.value.id, {
            ...payloadBase,
            fecha: formularioTurno.value.fecha,
            modificado_por: autor
          })

          if (!resultado.success) {
            toastError(resultado.error || 'No se pudo actualizar el turno')
          } else {
            toastSuccess('Turno actualizado correctamente')
            await cargarTurnos()
            await generarSugerencias()
            cerrarModalTurno()
          }
          return
        }

        let serieActualId = turnoEditando.value?.serieId || null

        const crearTurnoIndividual = async (fecha, serieId = null) => {
          return TurnoService.createTurno({
            ...payloadBase,
            fecha,
            estado: 'programado',
            creado_por: autor,
            serie_id: serieId
          })
        }

        if (recurrenciaActiva.value) {
          const seriePayload = {
            usuario_id: formularioTurno.value.usuario_id,
            descripcion: formularioTurno.value.posicion || formularioTurno.value.area,
            fecha_inicio: formularioTurno.value.fecha,
            fecha_fin: recurrenciaConfig.value.fecha_fin,
            dias_semana: recurrenciaConfig.value.dias,
            hora_inicio: formularioTurno.value.hora_inicio,
            hora_fin: formularioTurno.value.hora_fin,
            area: formularioTurno.value.area,
            posicion: formularioTurno.value.posicion || null,
            creado_por: autor
          }

          const serieResultado = await TurnoService.createSerie(seriePayload)
          if (!serieResultado.success) {
            toastError(serieResultado.error || 'No se pudo crear la serie')
            return
          }

          serieActualId = serieResultado.data.id

          const fechasRecurrencia = generarFechasRecurrencia()
          if (!fechasRecurrencia.length) {
            toastError('Configura la recurrencia con al menos un día válido')
            return
          }

          if (fechasRecurrencia.length > MAX_RECURRENTES) {
            toastError(`El rango genera más de ${MAX_RECURRENTES} turnos. Ajusta la recurrencia.`)
            return
          }

          const resultados = await Promise.all(
            fechasRecurrencia.map(fecha => crearTurnoIndividual(fecha, serieActualId).then(res => ({ ...res, fecha })))
          )

          const errores = resultados.filter(res => !res.success)
          const creados = resultados.length - errores.length

          if (errores.length) {
            const primero = errores[0]
            toastError(`Error al crear turno para ${primero.fecha}: ${primero.error || 'Intenta nuevamente'}`)
            return
          }

          if (creados > 0) {
            toastSuccess(`Se crearon ${creados} turno(s) recurrente(s)`)
            await cargarTurnos()
            await generarSugerencias()
            cerrarModalTurno()
          }
        } else {
          const resultado = await crearTurnoIndividual(formularioTurno.value.fecha, serieActualId)
          if (!resultado.success) {
            toastError(resultado.error || 'No se pudo crear el turno')
          } else {
            toastSuccess('Turno creado correctamente')
            await cargarTurnos()
            await generarSugerencias()
            cerrarModalTurno()
          }
        }
      } finally {
        cargando.value = false
      }
    }

    const eliminarTurno = async (modo = 'single') => {
      if (!turnoEditando.value) return

      cargando.value = true
      try {
        if (modo === 'serie' && turnoEditando.value.serieId) {
          const resultado = await TurnoService.deleteTurnosRecurrentes(turnoEditando.value.serieId)

          if (!resultado.success) {
            toastError(resultado.error || 'No se pudieron eliminar los turnos')
            return
          }

          await TurnoService.deleteSerie(turnoEditando.value.serieId)
          const eliminados = resultado.data?.length || 0
          toastSuccess(
            eliminados > 1
              ? `Se eliminaron ${eliminados} turnos de la serie`
              : 'Turno eliminado'
          )
        } else {
          const resultado = await TurnoService.deleteTurno(turnoEditando.value.id)
          if (!resultado.success) {
            toastError(resultado.error || 'No se pudo eliminar el turno')
            return
          }
          toastSuccess('Turno eliminado')
        }

        await cargarTurnos()
        await generarSugerencias()
        cerrarModalTurno()
      } finally {
        cargando.value = false
      }
    }

    const abrirDialogoEliminacion = () => {
      if (!turnoEditando.value) return
      modoEliminacion.value = turnoEditando.value.serieId ? 'serie' : 'single'
      mostrarDialogoEliminacion.value = true
    }

    const cerrarDialogoEliminacion = () => {
      mostrarDialogoEliminacion.value = false
    }

    const confirmarEliminacionTurno = async (tipo = 'single') => {
      cerrarDialogoEliminacion()
      await eliminarTurno(tipo)
    }

    const crearTurno = (fecha, hora) => {
      abrirModalTurno(fecha, hora)
    }

    const editarTurno = (turno) => {
      turnoEditando.value = turno
      recurrenciaActiva.value = false
      recurrenciaConfig.value = { fecha_fin: '', dias: [] }

      formularioTurno.value = {
        usuario_id: turno.usuarioId || turno.datosCompletos?.usuario_id || '',
        fecha: turno.fecha,
        hora_inicio: turno.horaInicio,
        hora_fin: turno.horaFin,
        area: turno.area,
        posicion: turno.posicion || '',
        notas: turno.notas || ''
      }

      mostrarModalTurno.value = true
    }

    const generarSugerencias = async () => {
      sugerencias.value = []
    }

    const aplicarSugerencia = async () => {}

    const getNombreDia = (dia) => {
      const nombres = {
        lunes: 'Lunes',
        martes: 'Martes',
        miercoles: 'Miércoles',
        jueves: 'Jueves',
        viernes: 'Viernes',
        sabado: 'Sábado',
        domingo: 'Domingo'
      }
      return nombres[dia] || dia
    }

    const guardarHorarios = async () => {
      cargando.value = true
      error.value = null

      // Convertir el objeto de horarios al formato esperado por el servicio
      const horariosArray = Object.entries(horariosLocal.value).map(([dia, horario]) => ({
        dia_semana: dia,
        abierto: horario.abierto,
        hora_apertura: horario.abierto ? horario.apertura : null,
        hora_cierre: horario.abierto ? horario.cierre : null
      }))

      const resultado = await HorarioLocalService.updateHorarios(horariosArray)

      if (resultado.success) {
        toastSuccess('Horarios guardados correctamente')
        await generarSugerencias()
      } else {
        error.value = resultado.error
        toastError(`No se pudieron guardar los horarios: ${resultado.error || 'Intenta nuevamente'}`)
      }

      cargando.value = false
    }

    const abrirSelector = (inputId) => {
      // Obtener el input usando el ID
      const input = document.getElementById(inputId)
      if (input) {
        // Hacer focus primero para que el navegador detecte la posición correcta
        input.focus()

        // Usar setTimeout para asegurar que el focus se haya aplicado
        setTimeout(() => {
          if (input.showPicker) {
            try {
              input.showPicker()
            } catch (error) {
              // Fallback: hacer click en el input
              input.click()
            }
          } else {
            // Si showPicker no existe, hacer click
            input.click()
          }
        }, 50)
      }
    }

    onMounted(async () => {
      await cargarHorarios()
      await cargarFranjasRequeridas()
      await cargarEmpleados()
      await cargarTurnos()
      await generarSugerencias()
    })

    return {
      vistaActual,
      fechaInicioSemana,
      fechaFinSemana,
      fechaSeleccionada,
      diasSemana,
      franjasHorarias,
      alertasCobertura,
      horariosLocal,
      cargando,
      turnoEditando,
      recurrenciaActiva,
      recurrenciaConfig,
      mostrarDialogoEliminacion,
      modoEliminacion,
      mostrarModalTurno,
      formularioTurno,
      empleadosDisponibles,
      diasSemanaOpciones,
      semanaAnterior,
      semanaSiguiente,
      cambiarDia,
      irAlDiaActual,
      getTurnosEnHora,
      getCoberturaHora,
      getCoberturaRequerida,
      getAreaRequerida,
      getTurnoClass,
      getTurnoStyle,
      getTurnoBlockStyle,
      esFranjaFueraHorario,
      esTurnoFueraHorario,
      toggleDiaRecurrencia,
      crearTurno,
      editarTurno,
      getNombreDia,
      guardarHorarios,
      abrirSelector,
      abrirModalTurno,
      cerrarModalTurno,
      guardarTurno,
      abrirDialogoEliminacion,
      cerrarDialogoEliminacion,
      confirmarEliminacionTurno
    }
  },
  // Exponer métodos para el componente padre
  expose: ['abrirModalTurno']
}
</script>

<style scoped>
input[type="date"],
input[type="time"] {
  color-scheme: dark;
}

input[type="date"]::-webkit-calendar-picker-indicator,
input[type="time"]::-webkit-calendar-picker-indicator {
  opacity: 0.85;
  display: inline-flex;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.375rem;
  background-color: transparent;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease, opacity 0.2s ease;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23ffffff' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2'/%3E%3Cline x1='8' y1='2.5' x2='8' y2='6.5'/%3E%3Cline x1='16' y1='2.5' x2='16' y2='6.5'/%3E%3Cline x1='3' y1='10' x2='21' y2='10'/%3E%3C/svg%3E");
}

input[type="time"]::-webkit-calendar-picker-indicator {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23ffffff' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='9'/%3E%3Cpolyline points='12 7 12 12 15 14'/%3E%3C/svg%3E");
}

input[type="date"]::-webkit-calendar-picker-indicator:hover,
input[type="time"]::-webkit-calendar-picker-indicator:hover {
  background-color: rgba(255, 255, 255, 0.08);
  opacity: 1;
}

input[type="date"]::-moz-calendar-picker-indicator,
input[type="time"]::-moz-calendar-picker-indicator {
  filter: invert(1);
}

/* Estilos para mostrar HH:MM AM/PM */
input[type="time"]::-webkit-datetime-edit {
  color: rgb(243, 244, 246);
}

input[type="time"]::-webkit-datetime-edit-fields-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

input[type="time"]::-webkit-datetime-edit-hour-field,
input[type="time"]::-webkit-datetime-edit-minute-field,
input[type="time"]::-webkit-datetime-edit-ampm-field {
  color: rgb(243, 244, 246);
  padding: 0.25rem;
}

input[type="time"]::-webkit-datetime-edit-text {
  color: rgb(156, 163, 175);
}

input[type="time"]::-webkit-datetime-edit-ampm-field {
  margin-left: 0.5rem;
}

input[type="time"]::-webkit-datetime-edit-hour-field:focus,
input[type="time"]::-webkit-datetime-edit-minute-field:focus,
input[type="time"]::-webkit-datetime-edit-ampm-field:focus {
  background-color: rgb(139, 92, 246);
  color: white;
  outline: none;
  border-radius: 0.25rem;
}
</style>
