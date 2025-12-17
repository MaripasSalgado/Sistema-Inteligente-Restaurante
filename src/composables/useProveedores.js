import { ref, computed } from 'vue'
import proveedorService from '../services/proveedorService'
import { useToast } from './useToast'

/**
 * Composable para gestionar proveedores
 * Proporciona funcionalidad reactiva para trabajar con proveedores
 */
export function useProveedores() {
  const proveedores = ref([])
  const proveedorActual = ref(null)
  const cargando = ref(false)
  const error = ref(null)
  const { mostrarToast } = useToast()

  /**
   * Proveedores activos para selects
   */
  const proveedoresActivos = computed(() => {
    return proveedores.value.filter(p => p.estado === 'Activo')
  })

  /**
   * Proveedores por tipo
   */
  const proveedoresPorTipo = computed(() => {
    const grupos = {}
    proveedores.value.forEach(proveedor => {
      if (!grupos[proveedor.tipo]) {
        grupos[proveedor.tipo] = []
      }
      grupos[proveedor.tipo].push(proveedor)
    })
    return grupos
  })

  /**
   * Cargar todos los proveedores
   */
  const cargarProveedores = async (filtros = {}) => {
    try {
      cargando.value = true
      error.value = null
      proveedores.value = await proveedorService.obtenerProveedores(filtros)
      return proveedores.value
    } catch (err) {
      error.value = err.message
      mostrarToast('Error al cargar proveedores', 'error')
      throw err
    } finally {
      cargando.value = false
    }
  }

  /**
   * Cargar solo proveedores activos
   */
  const cargarProveedoresActivos = async () => {
    try {
      cargando.value = true
      error.value = null
      const activos = await proveedorService.obtenerProveedoresActivos()
      proveedores.value = activos
      return activos
    } catch (err) {
      error.value = err.message
      mostrarToast('Error al cargar proveedores activos', 'error')
      throw err
    } finally {
      cargando.value = false
    }
  }

  /**
   * Obtener un proveedor por ID
   */
  const obtenerProveedor = async (id) => {
    try {
      cargando.value = true
      error.value = null
      proveedorActual.value = await proveedorService.obtenerProveedorPorId(id)
      return proveedorActual.value
    } catch (err) {
      error.value = err.message
      mostrarToast('Error al cargar el proveedor', 'error')
      throw err
    } finally {
      cargando.value = false
    }
  }

  /**
   * Crear un nuevo proveedor
   */
  const crearProveedor = async (datos) => {
    try {
      cargando.value = true
      error.value = null
      const nuevo = await proveedorService.crearProveedor(datos)
      proveedores.value.push(nuevo)
      mostrarToast('Proveedor creado correctamente', 'success')
      return nuevo
    } catch (err) {
      error.value = err.message
      mostrarToast(err.message || 'Error al crear el proveedor', 'error')
      throw err
    } finally {
      cargando.value = false
    }
  }

  /**
   * Actualizar un proveedor
   */
  const actualizarProveedor = async (id, datos) => {
    try {
      cargando.value = true
      error.value = null
      const actualizado = await proveedorService.actualizarProveedor(id, datos)
      
      // Actualizar en la lista local
      const index = proveedores.value.findIndex(p => p.id === id)
      if (index !== -1) {
        proveedores.value[index] = actualizado
      }
      
      mostrarToast('Proveedor actualizado correctamente', 'success')
      return actualizado
    } catch (err) {
      error.value = err.message
      mostrarToast(err.message || 'Error al actualizar el proveedor', 'error')
      throw err
    } finally {
      cargando.value = false
    }
  }

  /**
   * Eliminar (desactivar) un proveedor
   */
  const eliminarProveedor = async (id) => {
    try {
      cargando.value = true
      error.value = null
      await proveedorService.eliminarProveedor(id)
      
      // Actualizar en la lista local
      const index = proveedores.value.findIndex(p => p.id === id)
      if (index !== -1) {
        proveedores.value[index].estado = 'Inactivo'
      }
      
      mostrarToast('Proveedor desactivado correctamente', 'success')
      return true
    } catch (err) {
      error.value = err.message
      mostrarToast(err.message || 'Error al desactivar el proveedor', 'error')
      throw err
    } finally {
      cargando.value = false
    }
  }

  /**
   * Cambiar estado de un proveedor
   */
  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      cargando.value = true
      error.value = null
      await proveedorService.actualizarProveedor(id, { estado: nuevoEstado })
      
      // Actualizar en la lista local
      const index = proveedores.value.findIndex(p => p.id === id)
      if (index !== -1) {
        proveedores.value[index].estado = nuevoEstado
      }
      
      mostrarToast(`Proveedor ${nuevoEstado === 'Activo' ? 'activado' : 'desactivado'} correctamente`, 'success')
      return true
    } catch (err) {
      error.value = err.message
      mostrarToast('Error al cambiar el estado', 'error')
      throw err
    } finally {
      cargando.value = false
    }
  }

  /**
   * Evaluar un proveedor
   */
  const evaluarProveedor = async (evaluacion) => {
    try {
      cargando.value = true
      error.value = null
      const nuevaEvaluacion = await proveedorService.crearEvaluacionProveedor(evaluacion)
      
      // Recargar el proveedor para obtener la calificación actualizada
      if (evaluacion.proveedor_id) {
        await obtenerProveedor(evaluacion.proveedor_id)
      }
      
      mostrarToast('Evaluación registrada correctamente', 'success')
      return nuevaEvaluacion
    } catch (err) {
      error.value = err.message
      mostrarToast('Error al registrar la evaluación', 'error')
      throw err
    } finally {
      cargando.value = false
    }
  }

  /**
   * Obtener evaluaciones de un proveedor
   */
  const obtenerEvaluaciones = async (proveedorId) => {
    try {
      cargando.value = true
      error.value = null
      const evaluaciones = await proveedorService.obtenerEvaluacionesProveedor(proveedorId)
      return evaluaciones
    } catch (err) {
      error.value = err.message
      mostrarToast('Error al cargar evaluaciones', 'error')
      throw err
    } finally {
      cargando.value = false
    }
  }

  /**
   * Obtener estadísticas de proveedores
   */
  const obtenerEstadisticas = async () => {
    try {
      cargando.value = true
      error.value = null
      const estadisticas = await proveedorService.obtenerEstadisticasProveedores()
      return estadisticas
    } catch (err) {
      error.value = err.message
      mostrarToast('Error al cargar estadísticas', 'error')
      throw err
    } finally {
      cargando.value = false
    }
  }

  /**
   * Obtener top proveedores
   */
  const obtenerTopProveedores = async (limite = 10) => {
    try {
      cargando.value = true
      error.value = null
      const top = await proveedorService.obtenerTopProveedores(limite)
      return top
    } catch (err) {
      error.value = err.message
      mostrarToast('Error al cargar top proveedores', 'error')
      throw err
    } finally {
      cargando.value = false
    }
  }

  /**
   * Buscar proveedores con filtros avanzados
   */
  const buscarProveedores = async (parametros) => {
    try {
      cargando.value = true
      error.value = null
      const resultados = await proveedorService.buscarProveedoresAvanzado(parametros)
      proveedores.value = resultados
      return resultados
    } catch (err) {
      error.value = err.message
      mostrarToast('Error en la búsqueda', 'error')
      throw err
    } finally {
      cargando.value = false
    }
  }

  /**
   * Obtener tipos de proveedores
   */
  const obtenerTipos = () => {
    return proveedorService.obtenerTiposProveedor()
  }

  /**
   * Obtener estados disponibles
   */
  const obtenerEstados = () => {
    return proveedorService.obtenerEstadosProveedor()
  }

  /**
   * Verificar si un código existe
   */
  const verificarCodigo = async (codigo, idExcluir = null) => {
    try {
      return await proveedorService.verificarCodigoExistente(codigo, idExcluir)
    } catch (err) {
      console.error('Error al verificar código:', err)
      return false
    }
  }

  /**
   * Limpiar estado
   */
  const limpiar = () => {
    proveedores.value = []
    proveedorActual.value = null
    error.value = null
  }

  return {
    // Estado
    proveedores,
    proveedorActual,
    cargando,
    error,
    
    // Computed
    proveedoresActivos,
    proveedoresPorTipo,
    
    // Métodos
    cargarProveedores,
    cargarProveedoresActivos,
    obtenerProveedor,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor,
    cambiarEstado,
    evaluarProveedor,
    obtenerEvaluaciones,
    obtenerEstadisticas,
    obtenerTopProveedores,
    buscarProveedores,
    obtenerTipos,
    obtenerEstados,
    verificarCodigo,
    limpiar
  }
}

export default useProveedores

