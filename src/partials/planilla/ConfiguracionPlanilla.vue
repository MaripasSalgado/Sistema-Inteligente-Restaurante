<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-lg font-semibold text-gray-100">Configuración de Planilla</h3>
        <p class="text-sm text-gray-400">Gestiona deducciones legales y reglas de cálculo</p>
      </div>
      
      <div class="flex space-x-3">
        <button 
          @click="guardarConfiguracion"
          class="px-4 py-2 bg-[#F4B400] text-black rounded-lg font-medium transition-colors hover:bg-[#F4B400]/80"
        >
          Guardar Cambios
        </button>
        <button
          @click="abrirRestaurar"
          class="px-4 py-2 bg-zinc-900/50 border border-zinc-700/50 text-sm font-medium rounded-lg text-white transition-colors hover:bg-zinc-900/70"
        >
          Restaurar Valores
        </button>
      </div>
    </div>

    <!-- Configuración de Deducciones -->
    <div class="rounded-lg border border-zinc-700/50 p-6" style="background-color: rgb(24 24 27 / 0.8);">
      <h4 class="text-lg font-semibold text-gray-100 mb-4">Deducciones Legales</h4>
      
      <div class="space-y-6">
        <!-- Seguro Social -->
        <div class="border border-zinc-700/50 rounded-lg p-4 bg-zinc-900">
          <div class="flex justify-between items-center mb-4">
            <div>
              <h5 class="text-md font-medium text-gray-200">Seguro Social</h5>
              <p class="text-sm text-gray-400">Deducción obligatoria para todos los empleados</p>
            </div>
            <div class="flex items-center space-x-2">
              <label class="relative inline-flex items-center cursor-pointer">
                <input 
                  v-model="configuracion.seguroSocial.activa" 
                  type="checkbox" 
                  class="sr-only peer"
                >
                <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F4B400]"></div>
              </label>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Porcentaje de Deducción</label>
              <div class="flex items-center space-x-2">
                <input 
                  v-model="configuracion.seguroSocial.porcentaje"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  class="flex-1 px-3 py-2 bg-zinc-900/95 border border-zinc-700/50 rounded-lg text-gray-100 focus:border-[#F4B400] focus:ring-1 focus:ring-[#F4B400]"
                />
                <span class="text-gray-400">%</span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Aplica a</label>
              <select 
                v-model="configuracion.seguroSocial.aplicaA"
                class="w-full px-3 py-2 bg-zinc-900/95 border border-zinc-700/50 rounded-lg text-gray-100 focus:border-[#F4B400] focus:ring-1 focus:ring-[#F4B400]"
              >
                <option value="todos">Todos los empleados</option>
                <option value="jornada_completa">Solo jornada completa</option>
                <option value="media_jornada">Solo media jornada</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Impuesto sobre la Renta -->
        <div class="border border-zinc-700/50 rounded-lg p-4 bg-zinc-900">
          <div class="flex justify-between items-center mb-4">
            <div>
              <h5 class="text-md font-medium text-gray-200">Impuesto sobre la Renta</h5>
              <p class="text-sm text-gray-400">Tabla progresiva según legislación vigente</p>
            </div>
            <div class="flex items-center space-x-2">
              <label class="relative inline-flex items-center cursor-pointer">
                <input 
                  v-model="configuracion.impuestoRenta.activa" 
                  type="checkbox" 
                  class="sr-only peer"
                >
                <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F4B400]"></div>
              </label>
            </div>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Tipo de Cálculo</label>
              <select 
                v-model="configuracion.impuestoRenta.tipo"
                class="w-full px-3 py-2 bg-zinc-900/95 border border-zinc-700/50 rounded-lg text-gray-100 focus:border-[#F4B400] focus:ring-1 focus:ring-[#F4B400]"
              >
                <option value="progresivo">Tabla Progresiva</option>
                <option value="simplificado">Simplificado (10%)</option>
                <option value="personalizado">Personalizado</option>
              </select>
            </div>
            
            <!-- Tabla Progresiva -->
            <div v-if="configuracion.impuestoRenta.tipo === 'progresivo'" class="space-y-3">
              <h6 class="text-sm font-medium text-gray-300">Tabla Progresiva</h6>
              <div class="space-y-2">
                <div v-for="(tramo, index) in configuracion.impuestoRenta.tabla" :key="index" class="grid grid-cols-3 gap-2">
                  <input 
                    v-model="tramo.desde"
                    type="number"
                    placeholder="Desde"
                    class="px-2 py-1 bg-zinc-900/95 border border-zinc-700/50 rounded text-gray-100 text-sm focus:border-[#F4B400]"
                  />
                  <input 
                    v-model="tramo.hasta"
                    type="number"
                    placeholder="Hasta"
                    class="px-2 py-1 bg-zinc-900/95 border border-zinc-700/50 rounded text-gray-100 text-sm focus:border-[#F4B400]"
                  />
                  <div class="flex items-center space-x-1">
                    <input 
                      v-model="tramo.porcentaje"
                      type="number"
                      step="0.1"
                      placeholder="%"
                      class="flex-1 px-2 py-1 bg-zinc-900/95 border border-zinc-700/50 rounded text-gray-100 text-sm focus:border-[#F4B400]"
                    />
                    <span class="text-gray-400 text-sm">%</span>
                    <button 
                      @click="eliminarTramo(index)"
                      class="text-red-400 hover:text-red-300"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <button
                  @click="agregarTramo"
                  class="px-3 py-1 bg-zinc-900/50 border border-zinc-700/50 text-white text-sm font-medium rounded hover:bg-zinc-900/70 transition-colors"
                >
                  + Agregar Tramo
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Otras Deducciones -->
        <div class="border border-zinc-700/50 rounded-lg p-4 bg-zinc-900">
          <div class="flex justify-between items-center mb-4">
            <div>
              <h5 class="text-md font-medium text-gray-200">Otras Deducciones</h5>
              <p class="text-sm text-gray-400">Deducciones adicionales configurables</p>
            </div>
            <button
              @click="agregarDeduccion"
              class="px-3 py-1 bg-zinc-900/50 border border-zinc-700/50 text-white text-sm font-medium rounded hover:bg-zinc-900/70 transition-colors"
            >
              + Agregar Deducción
            </button>
          </div>
          
          <div class="space-y-3">
            <div 
              v-for="(deduccion, index) in configuracion.otrasDeducciones" 
              :key="index"
              class="grid grid-cols-1 md:grid-cols-4 gap-2 items-end"
            >
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Concepto</label>
                <input 
                  v-model="deduccion.concepto"
                  type="text"
                  placeholder="Ej: Seguro médico"
                  class="w-full px-3 py-2 bg-zinc-900/95 border border-zinc-700/50 rounded-lg text-gray-100 text-sm focus:border-[#F4B400]"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Tipo</label>
                <select 
                  v-model="deduccion.tipo"
                  class="w-full px-3 py-2 bg-zinc-900/95 border border-zinc-700/50 rounded-lg text-gray-100 text-sm focus:border-[#F4B400]"
                >
                  <option value="porcentaje">Porcentaje</option>
                  <option value="monto_fijo">Monto Fijo</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Valor</label>
                <input 
                  v-model="deduccion.valor"
                  type="number"
                  step="0.01"
                  :placeholder="deduccion.tipo === 'porcentaje' ? '5.5' : '50000'"
                  class="w-full px-3 py-2 bg-zinc-900/95 border border-zinc-700/50 rounded-lg text-gray-100 text-sm focus:border-[#F4B400]"
                />
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="eliminarDeduccion(index)"
                  class="px-3 py-2 bg-zinc-900/50 border border-zinc-700/50 text-white text-sm font-medium rounded hover:bg-zinc-900/70 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Configuración de Horas Extra -->
    <div class="rounded-lg border border-zinc-700/50 p-6" style="background-color: rgb(24 24 27 / 0.8);">
      <h4 class="text-lg font-semibold text-gray-100 mb-4">Configuración de Horas Extra</h4>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Tarifa Horas Extra</label>
          <div class="flex items-center space-x-2">
            <input 
              v-model="configuracion.horasExtra.tarifa"
              type="number"
              step="0.1"
              min="1"
              max="3"
              class="flex-1 px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-gray-100 focus:border-[#F4B400] focus:ring-1 focus:ring-[#F4B400]"
            />
            <span class="text-gray-400">x salario normal</span>
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Límite Semanal</label>
          <div class="flex items-center space-x-2">
            <input 
              v-model="configuracion.horasExtra.limiteSemanal"
              type="number"
              min="0"
              max="20"
              class="flex-1 px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-gray-100 focus:border-[#F4B400] focus:ring-1 focus:ring-[#F4B400]"
            />
            <span class="text-gray-400">horas</span>
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Requiere Aprobación</label>
          <div class="flex items-center">
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                v-model="configuracion.horasExtra.requiereAprobacion" 
                type="checkbox" 
                class="sr-only peer"
              >
              <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F4B400]"></div>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Configuración de Aguinaldo -->
    <div class="rounded-lg border border-zinc-700/50 p-6" style="background-color: rgb(24 24 27 / 0.8);">
      <h4 class="text-lg font-semibold text-gray-100 mb-4">Configuración de Aguinaldo</h4>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Período de Cálculo</label>
          <select 
            v-model="configuracion.aguinaldo.periodoCalculo"
            class="w-full px-3 py-2 bg-zinc-900/95 border border-zinc-700/50 rounded-lg text-gray-100 focus:border-[#F4B400] focus:ring-1 focus:ring-[#F4B400]"
          >
            <option value="dic_nov">Diciembre - Noviembre</option>
            <option value="todo_ano">Todo el año</option>
            <option value="ultimos_6">Últimos 6 meses</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">% Referencial (CR ≈ 8.33)</label>
          <div class="flex items-center space-x-2">
            <input 
              v-model="configuracion.aguinaldo.porcentaje"
              type="number"
              step="0.01"
              min="0"
              max="20"
              class="flex-1 px-3 py-2 bg-zinc-900/95 border border-zinc-700/50 rounded-lg text-gray-100 focus:border-[#F4B400] focus:ring-1 focus:ring-[#F4B400]"
            />
            <span class="text-gray-400">%</span>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Días mínimos trabajados</label>
          <input 
            v-model="configuracion.aguinaldo.diasMinimos"
            type="number"
            min="0"
            class="w-full px-3 py-2 bg-zinc-900/95 border border-zinc-700/50 rounded-lg text-gray-100 focus:border-[#F4B400] focus:ring-1 focus:ring-[#F4B400]"
          />
        </div>
      </div>
    </div>

    <!-- Resumen de Configuración -->
    <div class="rounded-lg border border-zinc-700/50 p-6" style="background-color: rgb(24 24 27 / 0.8);">
      <h4 class="text-lg font-semibold text-gray-100 mb-4">Resumen de Configuración</h4>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="text-center">
          <div class="text-sm text-gray-400 mb-1">Deducciones Activas</div>
          <div class="text-xl font-bold text-white">{{ deduccionesActivas }}</div>
        </div>
        <div class="text-center">
          <div class="text-sm text-gray-400 mb-1">Tarifa Horas Extra</div>
          <div class="text-xl font-bold text-white">{{ configuracion.horasExtra.tarifa }}x</div>
        </div>
        <div class="text-center">
          <div class="text-sm text-gray-400 mb-1">Aguinaldo</div>
          <div class="text-xl font-bold text-yellow-400">{{ configuracion.aguinaldo.periodoCalculo === 'dic_nov' ? 'Dic-Nov' : 'Anual' }}</div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación -->
    <div v-if="mostrarDialogoRestaurar" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div class="bg-zinc-900 border border-zinc-700/70 rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
        <div class="flex items-start justify-between">
          <div>
            <h4 class="text-lg font-semibold text-gray-100">Restaurar valores</h4>
            <p class="text-sm text-gray-400 mt-1">Esto sobrescribirá la configuración actual con los valores legales por defecto.</p>
          </div>
          <button @click="cerrarRestaurar" class="text-gray-400 hover:text-gray-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="flex justify-end space-x-3">
          <button
            @click="cerrarRestaurar"
            class="px-4 py-2 bg-zinc-800 border border-zinc-700/70 text-gray-200 rounded-lg hover:bg-zinc-700"
          >
            Cancelar
          </button>
          <button
            @click="confirmarRestaurar"
            class="px-4 py-2 bg-[#F4B400] text-black rounded-lg font-medium hover:bg-[#F4B400]/90"
          >
            Restaurar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { PlanillaService } from '../../services/planillaService'
import { useToast } from '@/composables/useToast'

export default {
  name: 'ConfiguracionPlanilla',
  setup() {
    const toast = useToast()
    const configuracion = ref({
      seguroSocial: {
        id: null,
        activa: true,
        porcentaje: 9.34,
        aplicaA: 'todos'
      },
      impuestoRenta: {
        id: null,
        activa: true,
        tipo: 'progresivo',
        tabla: [
          { desde: 0, hasta: 929000, porcentaje: 0 },
          { desde: 929001, hasta: 1363000, porcentaje: 10 },
          { desde: 1363001, hasta: 2392000, porcentaje: 15 },
          { desde: 2392001, hasta: 999999999, porcentaje: 20 }
        ],
        porcentajeSimplificado: 10
      },
      otrasDeducciones: [],
      horasExtra: {
        tarifa: 1.5,
        limiteSemanal: 12,
        requiereAprobacion: true
      },
      aguinaldo: {
        id: null,
        periodoCalculo: 'dic_nov',
        porcentaje: 8.33,
        diasMinimos: 0
      }
    })

    const cargando = ref(false)
    const mostrarDialogoRestaurar = ref(false)

    // Computed properties
    const deduccionesActivas = computed(() => {
      let count = 0
      if (configuracion.value.seguroSocial.activa) count++
      if (configuracion.value.impuestoRenta.activa) count++
      count += configuracion.value.otrasDeducciones.filter(d => d.activa !== false).length
      return count
    })

    const parseDeducciones = (rows) => {
      const otras = []
      rows.forEach((d) => {
        const conceptoLower = (d.concepto || '').toLowerCase()
        if (conceptoLower.includes('seguro social')) {
          configuracion.value.seguroSocial = {
            id: d.id,
            activa: d.activa,
            porcentaje: Number(d.porcentaje || 0),
            aplicaA: d.aplica_a || 'todos'
          }
          return
        }

        if (conceptoLower.includes('renta') || d.tabla_progresiva) {
          configuracion.value.impuestoRenta = {
            id: d.id,
            activa: d.activa,
            tipo: d.tabla_progresiva ? 'progresivo' : 'simplificado',
            tabla: d.tabla_progresiva || configuracion.value.impuestoRenta.tabla,
            porcentajeSimplificado: Number(d.porcentaje || 10)
          }
          return
        }

        otras.push({
          id: d.id,
          concepto: d.concepto,
          tipo: d.monto_fijo ? 'monto_fijo' : 'porcentaje',
          valor: d.monto_fijo || d.porcentaje || 0,
          activa: d.activa
        })
      })

      configuracion.value.otrasDeducciones = otras
    }

    const cargarConfiguracion = async () => {
      cargando.value = true
      const [deduccionesResp, aguinaldoResp] = await Promise.all([
        PlanillaService.getConfiguracionDeducciones(),
        PlanillaService.getConfiguracionAguinaldo()
      ])

      if (deduccionesResp.success && deduccionesResp.data) {
        parseDeducciones(deduccionesResp.data)
      }

      if (aguinaldoResp.success && aguinaldoResp.data) {
        configuracion.value.aguinaldo = {
          ...configuracion.value.aguinaldo,
          id: aguinaldoResp.data.id,
          porcentaje: Number(aguinaldoResp.data.porcentaje || 8.33),
          diasMinimos: aguinaldoResp.data.dias_minimos || 0,
          periodoCalculo: 'dic_nov'
        }
      }
      cargando.value = false
    }

    // Methods
    const agregarTramo = () => {
      configuracion.value.impuestoRenta.tabla.push({
        desde: 0,
        hasta: 0,
        porcentaje: 0
      })
    }

    const eliminarTramo = (index) => {
      if (configuracion.value.impuestoRenta.tabla.length > 1) {
        configuracion.value.impuestoRenta.tabla.splice(index, 1)
      }
    }

    const agregarDeduccion = () => {
      configuracion.value.otrasDeducciones.push({
        concepto: '',
        tipo: 'porcentaje',
        valor: 0,
        activa: true
      })
    }

    const eliminarDeduccion = (index) => {
      configuracion.value.otrasDeducciones.splice(index, 1)
    }

    const guardarConfiguracion = async () => {
      if (configuracion.value.seguroSocial.porcentaje < 0 || configuracion.value.seguroSocial.porcentaje > 100) {
        toast.error('El porcentaje del seguro social debe estar entre 0 y 100')
        return
      }

      if (configuracion.value.horasExtra.tarifa < 1 || configuracion.value.horasExtra.tarifa > 3) {
        toast.error('La tarifa de horas extra debe estar entre 1x y 3x')
        return
      }

      const deduccionesPayload = []

      deduccionesPayload.push({
        id: configuracion.value.seguroSocial.id,
        concepto: 'Seguro Social',
        porcentaje: Number(configuracion.value.seguroSocial.porcentaje),
        tipo: 'legal',
        aplica_a: configuracion.value.seguroSocial.aplicaA,
        activa: configuracion.value.seguroSocial.activa
      })

      const renta = configuracion.value.impuestoRenta
      deduccionesPayload.push({
        id: renta.id,
        concepto: 'Impuesto sobre la Renta',
        porcentaje: renta.tipo === 'progresivo' ? null : Number(renta.porcentajeSimplificado || 10),
        tipo: 'legal',
        aplica_a: 'todos',
        tabla_progresiva: renta.tipo === 'progresivo' ? renta.tabla : null,
        activa: renta.activa
      })

      configuracion.value.otrasDeducciones.forEach(d => {
        deduccionesPayload.push({
          id: d.id,
          concepto: d.concepto,
          porcentaje: d.tipo === 'porcentaje' ? Number(d.valor || 0) : null,
          monto_fijo: d.tipo === 'monto_fijo' ? Number(d.valor || 0) : null,
          tipo: 'opcional',
          aplica_a: 'todos',
          activa: d.activa !== false
        })
      })

      const [dedResp, agResp] = await Promise.all([
        PlanillaService.saveConfiguracionDeducciones(deduccionesPayload),
        PlanillaService.upsertConfiguracionAguinaldo({
          id: configuracion.value.aguinaldo.id,
          porcentaje: Number(configuracion.value.aguinaldo.porcentaje || 8.33),
          dias_minimos: configuracion.value.aguinaldo.diasMinimos || 0,
          activa: true
        })
      ])

      if (!dedResp.success) {
        toast.error(`Error al guardar deducciones: ${dedResp.error}`)
        return
      }
      if (!agResp.success) {
        toast.error(`Error al guardar aguinaldo: ${agResp.error}`)
        return
      }

      toast.success('Configuración guardada exitosamente')
      cargarConfiguracion()
    }

    const abrirRestaurar = () => {
      mostrarDialogoRestaurar.value = true
    }

    const cerrarRestaurar = () => {
      mostrarDialogoRestaurar.value = false
    }

    const confirmarRestaurar = async () => {
      // Preserve IDs to update existing records
      const seguroSocialId = configuracion.value.seguroSocial.id
      const impuestoRentaId = configuracion.value.impuestoRenta.id
      const aguinaldoId = configuracion.value.aguinaldo.id

      configuracion.value = {
        seguroSocial: {
          id: seguroSocialId,
          activa: true,
          porcentaje: 9.34,
          aplicaA: 'todos'
        },
        impuestoRenta: {
          id: impuestoRentaId,
          activa: true,
          tipo: 'progresivo',
          tabla: [
            { desde: 0, hasta: 929000, porcentaje: 0 },
            { desde: 929001, hasta: 1363000, porcentaje: 10 },
            { desde: 1363001, hasta: 2392000, porcentaje: 15 },
            { desde: 2392001, hasta: 999999999, porcentaje: 20 }
          ],
          porcentajeSimplificado: 10
        },
        otrasDeducciones: [],
        horasExtra: {
          tarifa: 1.5,
          limiteSemanal: 12,
          requiereAprobacion: true
        },
        aguinaldo: {
          id: aguinaldoId,
          periodoCalculo: 'dic_nov',
          porcentaje: 8.33,
          diasMinimos: 0
        }
      }

      mostrarDialogoRestaurar.value = false
      toast.success('Valores restaurados. Haz clic en "Guardar Cambios" para persistir los cambios.')
    }

    onMounted(cargarConfiguracion)

    return {
      configuracion,
      deduccionesActivas,
      cargando,
      mostrarDialogoRestaurar,
      agregarTramo,
      eliminarTramo,
      agregarDeduccion,
      eliminarDeduccion,
      guardarConfiguracion,
      abrirRestaurar,
      cerrarRestaurar,
      confirmarRestaurar
    }
  }
}
</script> 
