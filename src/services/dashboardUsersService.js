import { supabase } from '@/config/supabase'

/**
 * Servicio para consultas del dashboard de usuarios
 */
export class DashboardService {
  /**
   * Obtener estadísticas generales de usuarios
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  static async getUsuariosStats() {
    try {
      // Query 1: Estadísticas generales
      const { data: stats, error: statsError } = await supabase
        .from('usuarios')
        .select(`
          estado,
          departamento,
          area,
          fecha_creacion
        `)

      if (statsError) {
        return { success: false, error: statsError.message }
      }

      // Procesar estadísticas
      const totalUsuarios = stats.length
      const usuariosActivos = stats.filter(u => u.estado === 'Activo').length
      const usuariosInactivos = stats.filter(u => u.estado === 'Inactivo').length

      // Estadísticas por departamento
      const porDepartamento = stats.reduce((acc, usuario) => {
        const dept = usuario.departamento || 'Sin asignar'
        acc[dept] = (acc[dept] || 0) + 1
        return acc
      }, {})

      // Estadísticas por área
      const porArea = stats.reduce((acc, usuario) => {
        const area = usuario.area || 'Sin asignar'
        acc[area] = (acc[area] || 0) + 1
        return acc
      }, {})

      // Usuarios registrados en los últimos 30 días
      const hace30Dias = new Date()
      hace30Dias.setDate(hace30Dias.getDate() - 30)
      
      const usuariosRecientes = stats.filter(u => 
        new Date(u.fecha_creacion) >= hace30Dias
      ).length

      return {
        success: true,
        data: {
          totalUsuarios,
          usuariosActivos,
          usuariosInactivos,
          usuariosRecientes,
          porDepartamento,
          porArea,
          porcentajeActivos: totalUsuarios > 0 ? Math.round((usuariosActivos / totalUsuarios) * 100) : 0
        }
      }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener estadísticas de usuarios' }
    }
  }

  /**
   * Obtener lista de usuarios con información detallada
   * @param {number} limit - Límite de resultados (default: 10)
   * @param {number} offset - Offset para paginación (default: 0)
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  static async getUsuariosList(limit = 10, offset = 0) {
    try {
      const { data: usuarios, error } = await supabase
        .from('usuarios')
        .select(`
          id,
          nombre,
          apellido,
          email,
          telefono,
          departamento,
          area,
          puesto,
          estado,
          fecha_creacion,
          ultimo_acceso,
          foto_perfil
        `)
        .order('fecha_creacion', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        return { success: false, error: error.message }
      }

      // Formatear datos para el dashboard
      const usuariosFormateados = usuarios.map(usuario => ({
        id: usuario.id,
        nombre: usuario.nombre || 'Sin nombre',
        apellido: usuario.apellido || 'Sin apellido',
        email: usuario.email || 'Sin email',
        telefono: usuario.telefono || 'Sin teléfono',
        departamento: usuario.departamento || 'Sin asignar',
        area: usuario.area || 'Sin asignar',
        puesto: usuario.puesto || 'Sin asignar',
        estado: usuario.estado || 'Inactivo',
        fechaRegistro: usuario.fecha_creacion ? new Date(usuario.fecha_creacion).toLocaleDateString('es-ES') : 'No disponible',
        ultimoAcceso: usuario.ultimo_acceso ? new Date(usuario.ultimo_acceso).toLocaleString('es-ES') : 'Nunca',
        fotoPerfil: usuario.foto_perfil ? `https://wmjiksplijxnbcmoivbd.supabase.co/storage/v1/object/public/fotos_perfil/${usuario.foto_perfil}` : null,
        nombreCompleto: `${usuario.nombre || ''} ${usuario.apellido || ''}`.trim() || 'Usuario sin nombre'
      }))

      return {
        success: true,
        data: usuariosFormateados
      }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener lista de usuarios' }
    }
  }

  /**
   * Obtener usuarios por departamento
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  static async getUsuariosPorDepartamento() {
    try {
      const { data: usuarios, error } = await supabase
        .from('usuarios')
        .select('departamento, estado')
        .not('departamento', 'is', null)

      if (error) {
        return { success: false, error: error.message }
      }

      // Agrupar por departamento
      const porDepartamento = usuarios.reduce((acc, usuario) => {
        const dept = usuario.departamento
        if (!acc[dept]) {
          acc[dept] = { total: 0, activos: 0, inactivos: 0 }
        }
        acc[dept].total++
        if (usuario.estado === 'Activo') {
          acc[dept].activos++
        } else {
          acc[dept].inactivos++
        }
        return acc
      }, {})

      // Convertir a array para gráficos
      const dataArray = Object.entries(porDepartamento).map(([departamento, stats]) => ({
        departamento,
        total: stats.total,
        activos: stats.activos,
        inactivos: stats.inactivos,
        porcentajeActivos: Math.round((stats.activos / stats.total) * 100)
      }))

      return {
        success: true,
        data: dataArray
      }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener usuarios por departamento' }
    }
  }

  /**
   * Obtener usuarios por área
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  static async getUsuariosPorArea() {
    try {
      const { data: usuarios, error } = await supabase
        .from('usuarios')
        .select('area, estado')
        .not('area', 'is', null)

      if (error) {
        return { success: false, error: error.message }
      }

      // Agrupar por área
      const porArea = usuarios.reduce((acc, usuario) => {
        const area = usuario.area
        if (!acc[area]) {
          acc[area] = { total: 0, activos: 0, inactivos: 0 }
        }
        acc[area].total++
        if (usuario.estado === 'Activo') {
          acc[area].activos++
        } else {
          acc[area].inactivos++
        }
        return acc
      }, {})

      // Convertir a array para gráficos
      const dataArray = Object.entries(porArea).map(([area, stats]) => ({
        area,
        total: stats.total,
        activos: stats.activos,
        inactivos: stats.inactivos,
        porcentajeActivos: Math.round((stats.activos / stats.total) * 100)
      }))

      return {
        success: true,
        data: dataArray
      }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener usuarios por área' }
    }
  }

  /**
   * Obtener actividad de usuarios (registros por mes)
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  static async getActividadUsuarios() {
    try {
      const { data: usuarios, error } = await supabase
        .from('usuarios')
        .select('fecha_creacion')
        .order('fecha_creacion', { ascending: true })

      if (error) {
        return { success: false, error: error.message }
      }

      // Agrupar por mes
      const porMes = usuarios.reduce((acc, usuario) => {
        const fecha = new Date(usuario.fecha_creacion)
        const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`
        
        if (!acc[mes]) {
          acc[mes] = 0
        }
        acc[mes]++
        return acc
      }, {})

      // Convertir a array para gráficos
      const dataArray = Object.entries(porMes).map(([mes, cantidad]) => ({
        mes,
        cantidad,
        fecha: new Date(mes + '-01').toLocaleDateString('es-ES', { 
          year: 'numeric', 
          month: 'long' 
        })
      }))

      return {
        success: true,
        data: dataArray
      }
    } catch (error) {
      return { success: false, error: 'Error inesperado al obtener actividad de usuarios' }
    }
  }
}

export default DashboardService
