<template>
  <div class="flex h-screen overflow-hidden">

    <!-- Sidebar -->
    <Sidebar :sidebarOpen="sidebarOpen" @close-sidebar="sidebarOpen = false" />

    <!-- Content area -->
    <div class="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
      
      <!-- Site header -->
      <Header :sidebarOpen="sidebarOpen" @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <main class="grow">
        <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

          <!-- Header -->
          <div class="mb-8">
            <h1 class="text-3xl md:text-4xl text-white font-bold mb-2">Menú Principal</h1>
            <p class="text-gray-400 text-lg">El Empanadazo - Selecciona un módulo para continuar</p>
          </div>

          <!-- Módulos del Sistema -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            
            <!-- Dashboard -->
            <div class="bg-zinc-900/80 border border-zinc-700/50 rounded-xl p-6 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20 transition-all cursor-pointer" @click="navigateTo('/dashboard')">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-semibold text-white">Dashboard</h3>
                  <p class="text-gray-400 text-sm">Gráficos y métricas</p>
                </div>
              </div>
              <p class="text-gray-300 text-sm mb-4">Acceso completo al dashboard principal con métricas y estadísticas del restaurante.</p>
              <div class="flex items-center justify-between">
                <span class="text-yellow-400 text-sm font-medium">Hacer clic para acceder</span>
                <div class="w-2 h-2 bg-yellow-400 rounded-full"></div>
              </div>
            </div>

            <!-- Predicciones -->
            <div v-if="canViewRoute('/predicciones')" class="bg-zinc-900/80 border border-zinc-700/50 rounded-xl p-6 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20 transition-all cursor-pointer" @click="navigateTo('/predicciones')">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-semibold text-white">Predicciones</h3>
                  <p class="text-gray-400 text-sm">Análisis predictivo</p>
                </div>
              </div>
              <p class="text-gray-300 text-sm mb-4">Análisis de tendencias y predicciones para optimizar el negocio.</p>
              <div class="flex items-center justify-between">
                <span class="text-yellow-400 text-sm font-medium">Hacer clic para acceder</span>
                <div class="w-2 h-2 bg-yellow-400 rounded-full"></div>
              </div>
            </div>

            <!-- Insumos -->
            <div v-if="canViewRoute('/insumos')" class="bg-zinc-900/80 border border-zinc-700/50 rounded-xl p-6 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20 transition-all cursor-pointer" @click="navigateTo('/insumos')">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-semibold text-white">Insumos</h3>
                  <p class="text-gray-400 text-sm">Gestión de inventario</p>
                </div>
              </div>
              <p class="text-gray-300 text-sm mb-4">Control de ingredientes, materias primas y productos en stock.</p>
              <div class="flex items-center justify-between">
                <span class="text-yellow-400 text-sm font-medium">Hacer clic para acceder</span>
                <div class="w-2 h-2 bg-yellow-400 rounded-full"></div>
              </div>
            </div>

            <!-- Proveedores -->
            <div v-if="canViewRoute('/proveedores')" class="bg-zinc-900/80 border border-zinc-700/50 rounded-xl p-6 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20 transition-all cursor-pointer" @click="navigateTo('/proveedores')">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-semibold text-white">Proveedores</h3>
                  <p class="text-gray-400 text-sm">Gestión de proveedores</p>
                </div>
              </div>
              <p class="text-gray-300 text-sm mb-4">Administración de proveedores y relaciones comerciales.</p>
              <div class="flex items-center justify-between">
                <span class="text-yellow-400 text-sm font-medium">Hacer clic para acceder</span>
                <div class="w-2 h-2 bg-yellow-400 rounded-full"></div>
              </div>
            </div>

            <!-- Órdenes y Ventas -->
            <div v-if="canViewRoute('/ordenes-ventas')" class="bg-zinc-900/80 border border-zinc-700/50 rounded-xl p-6 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20 transition-all cursor-pointer" @click="navigateTo('/ordenes-ventas')">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-semibold text-white">Órdenes y Ventas</h3>
                  <p class="text-gray-400 text-sm">Gestión de pedidos</p>
                </div>
              </div>
              <p class="text-gray-300 text-sm mb-4">Control de órdenes, ventas y transacciones del restaurante.</p>
              <div class="flex items-center justify-between">
                <span class="text-yellow-400 text-sm font-medium">Hacer clic para acceder</span>
                <div class="w-2 h-2 bg-yellow-400 rounded-full"></div>
              </div>
            </div>

            <!-- Productos -->
            <div v-if="canViewRoute('/productos')" class="bg-zinc-900/80 border border-zinc-700/50 rounded-xl p-6 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20 transition-all cursor-pointer" @click="navigateTo('/productos')">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-semibold text-white">Productos</h3>
                  <p class="text-gray-400 text-sm">Menú y productos</p>
                </div>
              </div>
              <p class="text-gray-300 text-sm mb-4">Gestión del menú, productos y precios del restaurante.</p>
              <div class="flex items-center justify-between">
                <span class="text-yellow-400 text-sm font-medium">Hacer clic para acceder</span>
                <div class="w-2 h-2 bg-yellow-400 rounded-full"></div>
              </div>
            </div>

            <!-- Recetas -->
            <div v-if="canViewRoute('/recetas')" class="bg-zinc-900/80 border border-zinc-700/50 rounded-xl p-6 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20 transition-all cursor-pointer" @click="navigateTo('/recetas')">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-semibold text-white">Recetas</h3>
                  <p class="text-gray-400 text-sm">Gestión de recetas</p>
                </div>
              </div>
              <p class="text-gray-300 text-sm mb-4">Recetas, ingredientes y procedimientos de preparación.</p>
              <div class="flex items-center justify-between">
                <span class="text-yellow-400 text-sm font-medium">Hacer clic para acceder</span>
                <div class="w-2 h-2 bg-yellow-400 rounded-full"></div>
              </div>
            </div>

            <!-- Turnos y Asistencia -->
            <div v-if="canViewRoute('/turnos')" class="bg-zinc-900/80 border border-zinc-700/50 rounded-xl p-6 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20 transition-all cursor-pointer" @click="navigateTo('/turnos')">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-semibold text-white">Turnos y Asistencia</h3>
                  <p class="text-gray-400 text-sm">Control de personal</p>
                </div>
              </div>
              <p class="text-gray-300 text-sm mb-4">Gestión de horarios, turnos y asistencia del personal.</p>
              <div class="flex items-center justify-between">
                <span class="text-yellow-400 text-sm font-medium">Hacer clic para acceder</span>
                <div class="w-2 h-2 bg-yellow-400 rounded-full"></div>
              </div>
            </div>

            <!-- Planilla -->
            <div v-if="canViewRoute('/planilla')" class="bg-zinc-900/80 border border-zinc-700/50 rounded-xl p-6 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20 transition-all cursor-pointer" @click="navigateTo('/planilla')">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-semibold text-white">Planilla</h3>
                  <p class="text-gray-400 text-sm">Gestión de nómina</p>
                </div>
              </div>
              <p class="text-gray-300 text-sm mb-4">Cálculo de salarios, beneficios y gestión de nómina.</p>
              <div class="flex items-center justify-between">
                <span class="text-yellow-400 text-sm font-medium">Hacer clic para acceder</span>
                <div class="w-2 h-2 bg-yellow-400 rounded-full"></div>
              </div>
            </div>

            <!-- Usuarios y Roles -->
            <div v-if="canViewRoute('/usuarios-roles')" class="bg-zinc-900/80 border border-zinc-700/50 rounded-xl p-6 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20 transition-all cursor-pointer" @click="navigateTo('/usuarios-roles')">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-semibold text-white">Usuarios y Roles</h3>
                  <p class="text-gray-400 text-sm">Administración de usuarios</p>
                </div>
              </div>
              <p class="text-gray-300 text-sm mb-4">Gestión de usuarios, roles y permisos del sistema.</p>
              <div class="flex items-center justify-between">
                <span class="text-yellow-400 text-sm font-medium">Hacer clic para acceder</span>
                <div class="w-2 h-2 bg-yellow-400 rounded-full"></div>
              </div>
            </div>

          </div>

          <!-- Información adicional -->
          <div class="mt-12 bg-zinc-900/80 border border-zinc-700/50 rounded-xl p-6">
            <h2 class="text-xl font-semibold text-white mb-4">Información del Sistema</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 class="text-lg font-medium text-yellow-400 mb-2">Módulos Disponibles</h3>
                <p class="text-gray-300 text-sm">Solo se muestran los módulos a los que tienes acceso según tu rol y permisos.</p>
              </div>
              <div>
                <h3 class="text-lg font-medium text-yellow-400 mb-2">Navegación</h3>
                <p class="text-gray-300 text-sm">Haz clic en cualquier módulo para acceder a su funcionalidad específica.</p>
              </div>
              <div>
                <h3 class="text-lg font-medium text-yellow-400 mb-2">Permisos</h3>
                <p class="text-gray-300 text-sm">Los módulos ocultos requieren permisos adicionales. Contacta al administrador.</p>
          </div>
          </div>
          </div>

        </div>
      </main>

    </div> 
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useViewPermissions } from '@/composables/useViewPermissions'
import Sidebar from '../partials/Sidebar.vue'
import Header from '../partials/Header.vue'

export default {
  name: 'MainPanel',
  components: {
    Sidebar,
    Header
  },
  setup() {
    const router = useRouter()
    const { canViewRoute } = useViewPermissions()
    const sidebarOpen = ref(false)

    const navigateTo = (route) => {
      console.log(`Navegando a: ${route}`)
      router.push(route)
    }

    return {
      sidebarOpen,
      canViewRoute,
      navigateTo
    }  
  }
}
</script> 