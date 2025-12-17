<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-lg font-semibold text-gray-100">Simulador de Aguinaldo y Liquidación</h3>
        <p class="text-sm text-gray-400">Calcula aguinaldo y liquidación según la legislación costarricense</p>
      </div>
    </div>

    <!-- Configuración de Simulación -->
    <div class="rounded-lg border border-zinc-700/50 p-6" style="background-color: rgb(24 24 27 / 0.8);">
      <h4 class="text-md font-semibold text-gray-100 mb-4">Configuración de Simulación</h4>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Empleado</label>
          <select 
            v-model="empleadoSeleccionado"
            @change="cargarDatosEmpleado"
            class="w-full px-3 py-2 bg-zinc-900/95 border border-zinc-700/50 rounded-lg text-gray-100 focus:border-[#F4B400] focus:ring-1 focus:ring-[#F4B400]"
          >
            <option value="">Seleccionar empleado...</option>
            <option 
              v-for="empleado in empleados" 
              :key="empleado.id" 
              :value="empleado.id"
            >
              {{ empleado.nombre }} - {{ empleado.puesto }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Tipo de Cálculo</label>
          <select 
            v-model="tipoCalculo"
            @change="calcularSimulacion"
            class="w-full px-3 py-2 bg-zinc-900/95 border border-zinc-700/50 rounded-lg text-gray-100 focus:border-[#F4B400] focus:ring-1 focus:ring-[#F4B400]"
          >
            <option value="aguinaldo">Aguinaldo</option>
            <option value="liquidacion">Liquidación</option>
            <option value="ambos">Aguinaldo + Liquidación</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Información del Empleado -->
    <div v-if="empleadoActual" class="rounded-lg border border-zinc-700/50 p-6" style="background-color: rgb(24 24 27 / 0.8);">
      <h4 class="text-md font-semibold text-gray-100 mb-4">Información del Empleado</h4>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div class="text-sm text-gray-400 mb-1">Nombre</div>
          <div class="text-gray-200 font-medium">{{ empleadoActual.nombre }}</div>
        </div>
        <div>
          <div class="text-sm text-gray-400 mb-1">Cédula</div>
          <div class="text-gray-200">{{ empleadoActual.cedula || 'No registrada' }}</div>
        </div>
        <div>
          <div class="text-sm text-gray-400 mb-1">Puesto</div>
          <div class="text-gray-200">{{ empleadoActual.puesto }}</div>
        </div>
        <div>
          <div class="text-sm text-gray-400 mb-1">Fecha de Ingreso</div>
          <div class="text-gray-200">{{ formatearFecha(empleadoActual.fecha_ingreso) }}</div>
        </div>
        <div>
          <div class="text-sm text-gray-400 mb-1">Tipo de Contrato</div>
          <div class="text-gray-200">{{ empleadoActual.tipo_contrato || 'No especificado' }}</div>
        </div>
        <div>
          <div class="text-sm text-gray-400 mb-1">Salario Base</div>
          <div class="text-gray-200">₡{{ formatCurrency(empleadoActual.salario_base || empleadoActual.tarifa_hora || 0) }}</div>
        </div>
      </div>
    </div>

    <!-- Resultados de Simulación -->
    <div v-if="simulacionActual" class="space-y-6">
      <!-- Aguinaldo -->
      <div v-if="tipoCalculo === 'aguinaldo' || tipoCalculo === 'ambos'" class="rounded-lg border border-zinc-700/50 p-6" style="background-color: rgb(24 24 27 / 0.8);">
        <h4 class="text-lg font-semibold text-gray-100 mb-4">Cálculo de Aguinaldo</h4>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 class="text-md font-medium text-gray-200 mb-3">Desglose del Aguinaldo</h5>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-400">Promedio Salarios (Dic-Nov):</span>
                <span class="text-gray-200">₡{{ formatCurrency(simulacionActual.aguinaldo.promedioSalarios) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Meses Trabajados:</span>
                <span class="text-gray-200">{{ simulacionActual.aguinaldo.mesesTrabajados }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Proporción:</span>
                <span class="text-gray-200">{{ simulacionActual.aguinaldo.proporcion }}/12</span>
              </div>
              <hr class="border-zinc-700/50">
              <div class="flex justify-between font-bold">
                <span class="text-gray-200">Aguinaldo Bruto:</span>
                <span class="text-white">₡{{ formatCurrency(simulacionActual.aguinaldo.montoBruto) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Deducciones:</span>
                <span class="text-red-400">₡{{ formatCurrency(simulacionActual.aguinaldo.deducciones) }}</span>
              </div>
              <hr class="border-zinc-700/50">
              <div class="flex justify-between font-bold text-lg">
                <span class="text-gray-200">Aguinaldo Neto:</span>
                <span class="text-white">₡{{ formatCurrency(simulacionActual.aguinaldo.montoNeto) }}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h5 class="text-md font-medium text-gray-200 mb-3">Historial de Salarios</h5>
            <div class="space-y-2 max-h-64 overflow-y-auto bg-zinc-900 p-3 rounded">
              <div v-for="salario in simulacionActual.aguinaldo.historialSalarios" :key="salario.periodo" class="flex justify-between text-sm">
                <span class="text-gray-400">{{ salario.periodo }}:</span>
                <span class="text-gray-200">₡{{ formatCurrency(salario.monto) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Liquidación -->
      <div v-if="tipoCalculo === 'liquidacion' || tipoCalculo === 'ambos'" class="rounded-lg border border-zinc-700/50 p-6" style="background-color: rgb(24 24 27 / 0.8);">
        <h4 class="text-lg font-semibold text-gray-100 mb-4">Cálculo de Liquidación</h4>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 class="text-md font-medium text-gray-200 mb-3">Desglose de Liquidación</h5>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-400">Años de Servicio:</span>
                <span class="text-gray-200">{{ simulacionActual.liquidacion.anosServicio }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Cesantía:</span>
                <span class="text-gray-200">₡{{ formatCurrency(simulacionActual.liquidacion.cesantia) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Vacaciones No Disfrutadas:</span>
                <span class="text-gray-200">₡{{ formatCurrency(simulacionActual.liquidacion.vacaciones) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Preaviso:</span>
                <span class="text-gray-200">₡{{ formatCurrency(simulacionActual.liquidacion.preaviso) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Aguinaldo Proporcional:</span>
                <span class="text-gray-200">₡{{ formatCurrency(simulacionActual.liquidacion.aguinaldoProporcional) }}</span>
              </div>
              <hr class="border-zinc-700/50">
              <div class="flex justify-between font-bold">
                <span class="text-gray-200">Liquidación Bruta:</span>
                <span class="text-white">₡{{ formatCurrency(simulacionActual.liquidacion.montoBruto) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Deducciones:</span>
                <span class="text-red-400">₡{{ formatCurrency(simulacionActual.liquidacion.deducciones) }}</span>
              </div>
              <hr class="border-zinc-700/50">
              <div class="flex justify-between font-bold text-lg">
                <span class="text-gray-200">Liquidación Neto:</span>
                <span class="text-white">₡{{ formatCurrency(simulacionActual.liquidacion.montoNeto) }}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h5 class="text-md font-medium text-gray-200 mb-3">Detalles Legales</h5>
            <div class="space-y-3 text-sm bg-zinc-900 p-3 rounded">
              <div>
                <div class="text-gray-400 mb-1">Cesantía (21 días por año)</div>
                <div class="text-gray-200">{{ simulacionActual.liquidacion.detalles.cesantia }}</div>
              </div>
              <div>
                <div class="text-gray-400 mb-1">Vacaciones (15 días por año)</div>
                <div class="text-gray-200">{{ simulacionActual.liquidacion.detalles.vacaciones }}</div>
              </div>
              <div>
                <div class="text-gray-400 mb-1">Preaviso (1 mes)</div>
                <div class="text-gray-200">{{ simulacionActual.liquidacion.detalles.preaviso }}</div>
              </div>
              <div>
                <div class="text-gray-400 mb-1">Aguinaldo Proporcional</div>
                <div class="text-gray-200">{{ simulacionActual.liquidacion.detalles.aguinaldo }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Total General -->
      <div v-if="tipoCalculo === 'ambos'" class="rounded-lg border border-zinc-700/50 p-6" style="background-color: rgb(24 24 27 / 0.8);">
        <h4 class="text-lg font-semibold text-gray-100 mb-4">Total General</h4>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center">
            <div class="text-sm text-gray-400 mb-1">Aguinaldo Neto</div>
            <div class="text-xl font-bold text-white">₡{{ formatCurrency(simulacionActual.aguinaldo.montoNeto) }}</div>
          </div>
          <div class="text-center">
            <div class="text-sm text-gray-400 mb-1">Liquidación Neto</div>
            <div class="text-xl font-bold text-white">₡{{ formatCurrency(simulacionActual.liquidacion.montoNeto) }}</div>
          </div>
          <div class="text-center">
            <div class="text-sm text-gray-400 mb-1">Total a Recibir</div>
            <div class="text-2xl font-bold text-yellow-400">₡{{ formatCurrency(simulacionActual.totalGeneral) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mensaje cuando no hay empleado seleccionado -->
    <div v-else class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-300 mb-2">Selecciona un Empleado</h3>
        <p class="text-gray-500">Elige un empleado para simular aguinaldo y liquidación</p>
      </div>
    </div>

    <!-- Mensaje de estado -->
    <div v-if="mensaje" class="p-4 rounded-lg" :class="mensajeClass">
      <div class="flex items-center">
        <svg v-if="mensajeTipo === 'success'" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg v-else-if="mensajeTipo === 'error'" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <span>{{ mensaje }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, ref } from 'vue'
import { PlanillaService } from '../../services/planillaService'

export default defineComponent({
  name: 'AguinaldoSimulator',
  props: {
    empleados: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const historialPagos = ref([])
    const empleadoSeleccionado = ref('')
    const tipoCalculo = ref('aguinaldo')
    const fechaCalculo = ref(new Date().toISOString().split('T')[0])
    const empleadoActual = ref(null)
    const simulacionActual = ref(null)
    const mensaje = ref('')
    const mensajeTipo = ref('')
    const configuracionAguinaldo = ref({ porcentaje: 8.33, dias_minimos: 0 })
    const deduccionesConfig = ref([])

    const mapPago = (pago) => ({
      empleadoId: pago.usuario_id,
      salarioNeto: pago.monto_pagado,
      fechaPago: pago.fecha_pago,
      periodo: pago.periodo,
      tipo: pago.tipo_pago
    })

    // Computed properties
    const mensajeClass = computed(() => {
      switch (mensajeTipo.value) {
        case 'success':
          return 'bg-green-900/20 border border-green-500 text-green-300'
        case 'error':
          return 'bg-red-900/20 border border-red-500 text-red-300'
        default:
          return 'bg-blue-900/20 border border-blue-500 text-blue-300'
      }
    })

    // Methods
    const formatearFecha = (fecha) => {
      return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('es-CR').format(amount)
    }

    const calcularDeducciones = (montoBase = 0) => {
      if (!montoBase) return { detalle: [], total: 0 }
      const detalle = deduccionesConfig.value
        .filter(d => d.activa !== false)
        .map(d => {
          const porcentaje = d.porcentaje ? Number(d.porcentaje) : null
          const montoFijo = d.monto_fijo ? Number(d.monto_fijo) : null
          const monto = (porcentaje ? montoBase * (porcentaje / 100) : 0) + (montoFijo || 0)
          return { concepto: d.concepto, monto }
        })
        .filter(d => d.monto)
      const total = detalle.reduce((sum, d) => sum + d.monto, 0)
      return { detalle, total }
    }

    const obtenerHistorialEmpleado = () => {
      if (!empleadoActual.value) return []
      return historialPagos.value
        .filter(p => p.empleadoId === empleadoActual.value.id && p.tipo === 'regular')
        .sort((a, b) => new Date(b.fechaPago) - new Date(a.fechaPago))
    }

    const formatearPeriodo = (periodo) => {
      if (!periodo) return 'N/A'
      const [anio, mes] = periodo.split('-')
      const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
      return `${meses[Number(mes) - 1] || mes} ${anio}`
    }

    const cargarDatosEmpleado = () => {
      if (!empleadoSeleccionado.value) {
        empleadoActual.value = null
        simulacionActual.value = null
        return
      }

      empleadoActual.value = props.empleados.find(emp => String(emp.id) === empleadoSeleccionado.value)
      calcularSimulacion()
    }

    const calcularSimulacion = () => {
      if (!empleadoActual.value) return

      const pagos = obtenerHistorialEmpleado()
      const mesesConsiderados = pagos.slice(0, 12)
      let mesesTrabajados = mesesConsiderados.length
      let totalSalarios = mesesConsiderados.reduce((sum, pago) => sum + (pago.salarioNeto || 0), 0)

      if (mesesTrabajados === 0) {
        mesesTrabajados = 12
        totalSalarios = (empleadoActual.value.salario_base || 0) * mesesTrabajados
      }

      const porcentaje = Number(configuracionAguinaldo.value?.porcentaje || 8.33)
      const montoBrutoAguinaldo = totalSalarios * (porcentaje / 100)
      const deduccionesAguinaldo = calcularDeducciones(montoBrutoAguinaldo)
      const montoNetoAguinaldo = Math.max(montoBrutoAguinaldo - deduccionesAguinaldo.total, 0)
      const promedioSalarios = totalSalarios / mesesTrabajados

      const historialSalarios = mesesConsiderados.map(p => ({
        periodo: formatearPeriodo(p.periodo),
        monto: p.salarioNeto
      }))

      const aguinaldo = {
        promedioSalarios,
        mesesTrabajados,
        proporcion: Math.min(12, mesesTrabajados),
        montoBruto: montoBrutoAguinaldo,
        deducciones: deduccionesAguinaldo.total,
        detalleDeducciones: deduccionesAguinaldo.detalle,
        montoNeto: montoNetoAguinaldo,
        historialSalarios
      }

      const fechaIngreso = empleadoActual.value.fechaIngreso || empleadoActual.value.fecha_ingreso
      const anosServicio = fechaIngreso ? Math.max(1, (new Date().getTime() - new Date(fechaIngreso).getTime()) / (1000 * 60 * 60 * 24 * 365)) : 1
      const salarioPromedio = promedioSalarios || empleadoActual.value.salario_base || 0
      const cesantia = salarioPromedio * Math.min(8, Math.floor(anosServicio))
      const vacaciones = salarioPromedio * 0.5
      const preaviso = salarioPromedio
      const aguinaldoProporcional = montoBrutoAguinaldo
      const montoBrutoLiquidacion = cesantia + vacaciones + preaviso + aguinaldoProporcional
      const deduccionesLiquidacion = calcularDeducciones(montoBrutoLiquidacion)
      const montoNetoLiquidacion = Math.max(montoBrutoLiquidacion - deduccionesLiquidacion.total, 0)

      const liquidacion = {
        anosServicio: Number(anosServicio.toFixed(1)),
        cesantia,
        vacaciones,
        preaviso,
        aguinaldoProporcional,
        montoBruto: montoBrutoLiquidacion,
        deducciones: deduccionesLiquidacion.total,
        detalleDeducciones: deduccionesLiquidacion.detalle,
        montoNeto: montoNetoLiquidacion,
        detalles: {
          cesantia: `Años x salario promedio = ₡${formatCurrency(cesantia)}`,
          vacaciones: `15 días aproximados = ₡${formatCurrency(vacaciones)}`,
          preaviso: `1 mes = ₡${formatCurrency(preaviso)}`,
          aguinaldo: `Proporcional = ₡${formatCurrency(aguinaldoProporcional)}`
        }
      }

      simulacionActual.value = {
        empleado: empleadoActual.value,
        fechaCalculo: fechaCalculo.value,
        tipoCalculo: tipoCalculo.value,
        aguinaldo,
        liquidacion,
        totalGeneral: aguinaldo.montoNeto + liquidacion.montoNeto
      }

      mostrarMensaje(`Simulación calculada para ${empleadoActual.value.nombre}`, 'success')
    }

    const generarReporte = () => {
      if (!simulacionActual.value) {
        mostrarMensaje('No hay simulación para guardar', 'error')
        return
      }

      mostrarMensaje(`Simulación guardada para ${empleadoActual.value.nombre}`, 'success')
    }

    const mostrarMensaje = (texto, tipo = 'info') => {
      mensaje.value = texto
      mensajeTipo.value = tipo
      
      setTimeout(() => {
        mensaje.value = ''
        mensajeTipo.value = ''
      }, 5000)
    }

    const cargarDatosIniciales = async () => {
      const [historialResp, aguinaldoResp, dedResp] = await Promise.all([
        PlanillaService.getHistorialPagos(),
        PlanillaService.getConfiguracionAguinaldo(),
        PlanillaService.getConfiguracionDeducciones()
      ])

      if (historialResp.success) {
        historialPagos.value = historialResp.data.map(mapPago)
      }
      if (aguinaldoResp.success && aguinaldoResp.data) {
        configuracionAguinaldo.value = {
          porcentaje: Number(aguinaldoResp.data.porcentaje || 8.33),
          dias_minimos: aguinaldoResp.data.dias_minimos || 0
        }
      }
      if (dedResp.success && Array.isArray(dedResp.data)) {
        deduccionesConfig.value = dedResp.data
      }
    }

    onMounted(cargarDatosIniciales)

    return {
      empleados: props.empleados,
      empleadoSeleccionado,
      tipoCalculo,
      fechaCalculo,
      empleadoActual,
      simulacionActual,
      mensaje,
      mensajeTipo,
      mensajeClass,
      formatearFecha,
      formatCurrency,
      cargarDatosEmpleado,
      calcularSimulacion,
      generarReporte
    }
  }
})
</script> 
