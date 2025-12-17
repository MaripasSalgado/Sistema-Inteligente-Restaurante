<template>
  <div class="min-w-fit">
    <!-- Sidebar backdrop (mobile only) -->
    <div class="fixed inset-0 bg-gray-900/30 z-40 lg:hidden lg:z-auto transition-opacity duration-200" :class="sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'" aria-hidden="true"></div>

    <!-- Sidebar -->
    <div
      id="sidebar"
      ref="sidebar"
      class="flex lg:flex! flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-[100dvh] overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:w-64! shrink-0 bg-black p-4 transition-all duration-200 ease-in-out"
      :class="['border-r', sidebarOpen ? 'translate-x-0' : '-translate-x-64']"
    >

      <!-- Sidebar header -->
      <div class="flex justify-between mb-2 pr-3 sm:px-2">
        <!-- Close button -->
        <button
          ref="trigger"
          class="lg:hidden text-gray-500 hover:text-gray-400"
          @click.stop="$emit('close-sidebar')"
          aria-controls="sidebar"
          :aria-expanded="sidebarOpen"
        >
          <span class="sr-only">Cerrar menú</span>
          <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
          </svg>
        </button>
        <!-- Logo -->
        <router-link class="block" to="/">
          <img src="/src/images/El_Empanadazo-removebg.png" alt="El Empanadazo Logo" class="w-20 h-20 lg:w-16 lg:h-16 2xl:w-20 2xl:h-20 object-contain" />
        </router-link>
      </div>

      <!-- Links -->
      <div class="space-y-6">
        <!-- Pages group -->
        <div>
          <h3 class="text-xs uppercase text-gray-400 font-semibold pl-3">
            <span class="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">•••</span>
            <span class="lg:hidden lg:sidebar-expanded:block 2xl:block font-bold text-lg text-white">Sistema de Restaurante El Empanadazo</span>
          </h3>
          <ul class="mt-3">
            <!-- Dashboard -->
            <SidebarLinkGroup v-slot="parentLink" :activeCondition="currentRoute.fullPath.includes('dashboard') || currentRoute.path === '/dashboard' || currentRoute.fullPath.includes('predicciones')" groupId="dashboard">
                                <a class="block text-gray-800 dark:text-gray-100 truncate transition hover:text-gray-900 dark:hover:text-white" href="#0" @click.prevent="parentLink.handleClick(); sidebarExpanded = true">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <HomeIcon class="shrink-0 w-4 h-4" :class="(currentRoute.fullPath.includes('dashboard') || currentRoute.path === '/dashboard' || currentRoute.fullPath.includes('predicciones')) ? 'text-amber-500' : 'text-gray-400 dark:text-gray-500'" />
                    <span class="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Dashboard</span>
                  </div>
                  <!-- Icon -->
                  <div class="flex shrink-0 ml-2">
                    <svg class="w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500" :class="parentLink.expanded && 'rotate-180'" viewBox="0 0 12 12">
                      <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                    </svg>
                  </div>
                </div>
              </a>
              <div class="lg:hidden lg:sidebar-expanded:block 2xl:block">
                <ul class="pl-8 mt-1" :class="!parentLink.expanded && 'hidden'">
                  <router-link to="/dashboard" custom v-slot="{ href, navigate, isExactActive }">
                    <li class="mb-1 last:mb-0">
                      <a 
                        class="block transition truncate" 
                        :class="[
                          isExactActive ? 'text-amber-500' : 'text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
                          !canViewRoute('/dashboard') ? 'opacity-50 cursor-not-allowed' : ''
                        ]" 
                        :href="canViewRoute('/dashboard') ? href : '#'" 
                        @click="canViewRoute('/dashboard') ? navigate : $event.preventDefault()"
                      >
                        <span class="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Panel Principal</span>
                      </a>
                    </li>
                  </router-link>
                  <!-- <router-link to="/dashboard/analytics" custom v-slot="{ href, navigate, isExactActive }">
                    <li class="mb-1 last:mb-0">
                      <a class="block transition truncate" :class="isExactActive ? 'text-amber-500' : 'text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'" :href="href" @click="navigate">
                        <span class="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Métricas</span>
                      </a>
                    </li>
                  </router-link> -->
                  <router-link to="/predicciones" custom v-slot="{ href, navigate, isExactActive }">
                    <li class="mb-1 last:mb-0">
                      <a 
                        class="block transition truncate" 
                        :class="[
                          isExactActive ? 'text-amber-500' : 'text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
                          !canViewRoute('/predicciones') ? 'opacity-50 cursor-not-allowed' : ''
                        ]" 
                        :href="canViewRoute('/predicciones') ? href : '#'" 
                        @click="canViewRoute('/predicciones') ? navigate : $event.preventDefault()"
                      >
                        <span class="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Predicciones</span>
                      </a>
                    </li>
                  </router-link>                                  
                </ul>
              </div>
            </SidebarLinkGroup>
             <!-- Inventario -->
             <SidebarLinkGroup v-slot="parentLink" :activeCondition="currentRoute.fullPath.includes('insumos') || currentRoute.fullPath.includes('proveedores')" groupId="inventario">
                              <a class="block text-gray-800 dark:text-gray-100 truncate transition hover:text-gray-900 dark:hover:text-white" href="#0" @click="parentLink.handleClick(); sidebarExpanded = true">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <CubeIcon class="shrink-0 w-4 h-4" :class="currentRoute.fullPath.includes('insumos') || currentRoute.fullPath.includes('proveedores') ? 'text-amber-500' : 'text-gray-400 dark:text-gray-500'" />
                    <span class="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Inventario</span>
                  </div>
                  <!-- Icon -->
                  <div class="flex shrink-0 ml-2">
                    <svg class="w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500" :class="parentLink.expanded && 'rotate-180'" viewBox="0 0 12 12">
                      <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                    </svg>
                  </div>
                </div>
              </a>
              <div class="lg:hidden lg:sidebar-expanded:block 2xl:block">
                <ul class="pl-8 mt-1" :class="!parentLink.expanded && 'hidden'">
                  <router-link to="/insumos" custom v-slot="{ href, navigate, isExactActive }">
                    <li class="mb-1 last:mb-0">
                      <a 
                        class="block transition truncate" 
                        :class="[
                          isExactActive ? 'text-amber-500' : 'text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
                          !canViewRoute('/insumos') ? 'opacity-50 cursor-not-allowed' : ''
                        ]" 
                        :href="canViewRoute('/insumos') ? href : '#'" 
                        @click="canViewRoute('/insumos') ? navigate : $event.preventDefault()"
                      >
                        <span class="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Insumos</span>
                      </a>
                    </li>
                  </router-link>
                  <router-link to="/proveedores" custom v-slot="{ href, navigate, isExactActive }">
                    <li class="mb-1 last:mb-0">
                      <a 
                        class="block transition truncate" 
                        :class="[
                          isExactActive ? 'text-amber-500' : 'text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
                          !canViewRoute('/proveedores') ? 'opacity-50 cursor-not-allowed' : ''
                        ]" 
                        :href="canViewRoute('/proveedores') ? href : '#'" 
                        @click="canViewRoute('/proveedores') ? navigate : $event.preventDefault()"
                      >
                        <span class="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Proveedores</span>
                      </a>
                    </li>
                  </router-link>                   
                 <!-- <router-link to="/inventario/stock" custom v-slot="{ href, navigate, isExactActive }">
                    <li class="mb-1 last:mb-0">
                      <a class="block transition truncate" :class="isExactActive ? 'text-amber-500' : 'text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'" :href="href" @click="navigate">
                        <span class="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Control de Stock</span>
                      </a>
                    </li>
                  </router-link> -->                  
                </ul>
              </div>
            </SidebarLinkGroup>
            <!-- Operaciones -->
            <SidebarLinkGroup v-slot="parentLink" :activeCondition="currentRoute.fullPath.includes('ordenes-ventas') || currentRoute.fullPath.includes('productos') || currentRoute.fullPath.includes('recetas')" groupId="operaciones">
              <a class="block text-gray-800 dark:text-gray-100 truncate transition hover:text-gray-900 dark:hover:text-white" href="#0" @click="parentLink.handleClick(); sidebarExpanded = true">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <ShoppingBagIcon class="shrink-0 w-4 h-4" :class="currentRoute.fullPath.includes('ordenes-ventas') || currentRoute.fullPath.includes('productos') || currentRoute.fullPath.includes('recetas') ? 'text-amber-500' : 'text-gray-400 dark:text-gray-500'" />
                    <span class="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Operaciones</span>
                  </div>
                  <!-- Icon -->
                  <div class="flex shrink-0 ml-2">
                    <svg class="w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500" :class="parentLink.expanded && 'rotate-180'" viewBox="0 0 12 12">
                      <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                    </svg>
                  </div>
                </div>
              </a>
              <div class="lg:hidden lg:sidebar-expanded:block 2xl:block">
                <ul class="pl-8 mt-1" :class="!parentLink.expanded && 'hidden'">
                  <router-link to="/ordenes-ventas" custom v-slot="{ href, navigate, isExactActive }">
                    <li class="mb-1 last:mb-0">
                      <a 
                        class="block transition truncate" 
                        :class="[
                          isExactActive ? 'text-amber-500' : 'text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
                          !canViewRoute('/ordenes-ventas') ? 'opacity-50 cursor-not-allowed' : ''
                        ]" 
                        :href="canViewRoute('/ordenes-ventas') ? href : '#'" 
                        @click="canViewRoute('/ordenes-ventas') ? navigate : $event.preventDefault()"
                      >
                        <span class="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Órdenes y Ventas</span>
                      </a>
                    </li>
                  </router-link>
                  <router-link to="/productos" custom v-slot="{ href, navigate, isExactActive }">
                    <li class="mb-1 last:mb-0">
                      <a 
                        class="block transition truncate" 
                        :class="[
                          isExactActive ? 'text-amber-500' : 'text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
                          !canViewRoute('/productos') ? 'opacity-50 cursor-not-allowed' : ''
                        ]" 
                        :href="canViewRoute('/productos') ? href : '#'" 
                        @click="canViewRoute('/productos') ? navigate : $event.preventDefault()"
                      >
                        <span class="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Menú y Productos</span>
                      </a>
                    </li>
                  </router-link>
                  <router-link to="/recetas" custom v-slot="{ href, navigate, isExactActive }">
                    <li class="mb-1 last:mb-0">
                      <a 
                        class="block transition truncate" 
                        :class="[
                          isExactActive ? 'text-amber-500' : 'text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
                          !canViewRoute('/recetas') ? 'opacity-50 cursor-not-allowed' : ''
                        ]" 
                        :href="canViewRoute('/recetas') ? href : '#'" 
                        @click="canViewRoute('/recetas') ? navigate : $event.preventDefault()"
                      >
                        <span class="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Recetas</span>
                      </a>
                    </li>
                  </router-link>
                </ul>
              </div>
            </SidebarLinkGroup>
            <!-- Finance -->
            <SidebarLinkGroup v-slot="parentLink" :activeCondition="currentRoute.fullPath.includes('turnos') || currentRoute.fullPath.includes('planilla')" groupId="finance">
                              <a class="block text-gray-800 dark:text-gray-100 truncate transition hover:text-gray-900 dark:hover:text-white" href="#0" @click="parentLink.handleClick(); sidebarExpanded = true">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                                          <UserGroupIcon class="shrink-0 w-4 h-4" :class="currentRoute.fullPath.includes('turnos') || currentRoute.fullPath.includes('planilla') ? 'text-amber-500' : 'text-gray-400 dark:text-gray-500'" />
                    <span class="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Recursos Humanos</span>
                  </div>
                  <!-- Icon -->
                  <div class="flex shrink-0 ml-2">
                    <svg class="w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500" :class="parentLink.expanded && 'rotate-180'" viewBox="0 0 12 12">
                      <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                    </svg>
                  </div>
                </div>
              </a>
              <div class="lg:hidden lg:sidebar-expanded:block 2xl:block">
                <ul class="pl-8 mt-1" :class="!parentLink.expanded && 'hidden'">
                 <!-- <router-link to="/finance/cards" custom v-slot="{ href, navigate, isExactActive }">
                    <li class="mb-1 last:mb-0">
                      <a class="block transition truncate" :class="isExactActive ? 'text-amber-500' : 'text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'" :href="href" @click="navigate">
                        <span class="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Empleados</span>
                      </a>
                    </li>
                  </router-link> -->
                  <router-link to="/turnos" custom v-slot="{ href, navigate, isExactActive }">
                    <li class="mb-1 last:mb-0">
                      <a 
                        class="block transition truncate" 
                        :class="[
                          isExactActive ? 'text-amber-500' : 'text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
                          !canViewRoute('/turnos') ? 'opacity-50 cursor-not-allowed' : ''
                        ]" 
                        :href="canViewRoute('/turnos') ? href : '#'" 
                        @click="canViewRoute('/turnos') ? navigate : $event.preventDefault()"
                      >
                        <span class="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Turnos y Asistencia</span>
                      </a>
                    </li>
                  </router-link>
                  <router-link to="/planilla" custom v-slot="{ href, navigate, isExactActive }">
                    <li class="mb-1 last:mb-0">
                      <a 
                        class="block transition truncate" 
                        :class="[
                          isExactActive ? 'text-amber-500' : 'text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
                          !canViewRoute('/planilla') ? 'opacity-50 cursor-not-allowed' : ''
                        ]" 
                        :href="canViewRoute('/planilla') ? href : '#'" 
                        @click="canViewRoute('/planilla') ? navigate : $event.preventDefault()"
                      >
                        <span class="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Planilla</span>
                      </a>
                    </li>
                  </router-link> 
                  
                
                </ul>
              </div>
            </SidebarLinkGroup>    
            <!-- Job Board -->
            <!-- <SidebarLinkGroup v-slot="parentLink" :activeCondition="currentRoute.fullPath.includes('job')" groupId="job">
              <a class="block text-gray-800 dark:text-gray-100 truncate transition" :class="currentRoute.fullPath.includes('job') ? 'text-amber-500' : 'hover:text-gray-900 dark:hover:text-white'" href="#0" @click="parentLink.handleClick(); sidebarExpanded = true">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <ChartBarIcon class="shrink-0 w-4 h-4" :class="currentRoute.fullPath.includes('job') ? 'text-amber-500' : 'text-gray-400 dark:text-gray-500'" />
                    <span class="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Análisis</span>
                  </div>
                  
                  <div class="flex shrink-0 ml-2">
                    <svg class="w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500" :class="parentLink.expanded && 'rotate-180'" viewBox="0 0 12 12">
                      <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                    </svg>
                  </div>
                </div>
              </a>
              <div class="lg:hidden lg:sidebar-expanded:block 2xl:block">
                <ul class="pl-8 mt-1" :class="!parentLink.expanded && 'hidden'">
                  <router-link to="/job/job-listing" custom v-slot="{ href, navigate, isExactActive }">
                    <li class="mb-1 last:mb-0">
                      <a class="block transition truncate" :class="isExactActive ? 'text-amber-500' : 'text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'" :href="href" @click="navigate">
                        <span class="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Reportes</span>
                      </a>
                    </li>
                  </router-link> 
                  <router-link to="/job/company-profile" custom v-slot="{ href, navigate, isExactActive }">
                    <li class="mb-1 last:mb-0">
                      <a class="block transition truncate" :class="isExactActive ? 'text-amber-500' : 'text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'" :href="href" @click="navigate">
                        <span class="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Alertas</span>
                      </a>
                    </li>
                  </router-link>                
                </ul>
              </div>
            </SidebarLinkGroup> -->
            <!-- Tasks -->
            <SidebarLinkGroup v-slot="parentLink" :activeCondition="currentRoute.fullPath.includes('usuarios-roles')" groupId="admin">
              <a class="block text-gray-800 dark:text-gray-100 truncate transition hover:text-gray-900 dark:hover:text-white" href="#0" @click="parentLink.handleClick(); sidebarExpanded = true">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <Cog6ToothIcon class="shrink-0 w-4 h-4" :class="currentRoute.fullPath.includes('usuarios-roles') ? 'text-amber-500' : 'text-gray-400 dark:text-gray-500'" />                    
                    <span class="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Administración</span>
                  </div>
                  <!-- Icon -->
                  <div class="flex shrink-0 ml-2">
                    <svg class="w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500" :class="parentLink.expanded && 'rotate-180'" viewBox="0 0 12 12">
                      <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                    </svg>
                  </div>
                </div>
              </a>
              <div class="lg:hidden lg:sidebar-expanded:block 2xl:block">
                <ul class="pl-8 mt-1" :class="!parentLink.expanded && 'hidden'">
                  <router-link to="/usuarios-roles" custom v-slot="{ href, navigate, isExactActive }">
                    <li class="mb-1 last:mb-0">
                      <a 
                        class="block transition truncate" 
                        :class="[
                          isExactActive ? 'text-amber-500' : 'text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
                          !canViewRoute('/usuarios-roles') ? 'opacity-50 cursor-not-allowed' : ''
                        ]" 
                        :href="canViewRoute('/usuarios-roles') ? href : '#'" 
                        @click="canViewRoute('/usuarios-roles') ? navigate : $event.preventDefault()"
                      >
                        <span class="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Usuarios y Roles</span>
                      </a>
                    </li>
                  </router-link>
                   <router-link to="/alertas" custom v-slot="{ href, navigate, isExactActive }">
                    <li class="mb-1 last:mb-0">
                      <a 
                        class="block transition truncate" 
                        :class="[
                          isExactActive ? 'text-amber-500' : 'text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
                          !canViewRoute('/alertas') ? 'opacity-50 cursor-not-allowed' : ''
                        ]" 
                        :href="canViewRoute('/alertas') ? href : '#'" 
                        @click="canViewRoute('/alertas') ? navigate : $event.preventDefault()"
                      >
                        <span class="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Alertas</span>
                      </a>
                    </li>
                  </router-link> 
                  <!-- <router-link to="/tasks/list" custom v-slot="{ href, navigate, isExactActive }">
                    <li class="mb-1 last:mb-0">
                      <a class="block transition truncate" :class="isExactActive ? 'text-amber-500' : 'text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'" :href="href" @click="navigate">
                        <span class="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Configuración</span>
                      </a>
                    </li>
                  </router-link> -->              
                </ul>
              </div>
            </SidebarLinkGroup>                  
            <!-- Account -->
            <router-link to="/account" custom v-slot="{ href, navigate, isExactActive }">
              <li class="pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r" :class="isExactActive && 'from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]'">
                <a class="block text-gray-800 dark:text-gray-100 truncate transition hover:text-gray-900 dark:hover:text-white" :href="href" @click="navigate">
                  <div class="flex items-center justify-between">
                    <div class="grow flex items-center">
                      <UserIcon class="shrink-0 w-4 h-4" :class="isExactActive ? 'text-amber-500' : 'text-gray-400 dark:text-gray-500'" />                      
                      <span class="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Mi Cuenta</span>
                    </div>
                  </div>
                </a>
              </li>
            </router-link>
            <!-- Inbox -->
           <!-- <router-link to="/inbox" custom v-slot="{ href, navigate, isExactActive }">
              <li class="pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r" :class="isExactActive && 'from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]'">
                <a class="block text-gray-800 dark:text-gray-100 truncate transition" :class="isExactActive ? 'text-amber-500' : 'hover:text-gray-900 dark:hover:text-white'" :href="href" @click="navigate">
                  <div class="flex items-center">
                    <ShieldCheckIcon class="shrink-0 w-4 h-4" :class="isExactActive ? 'text-amber-500' : 'text-gray-400 dark:text-gray-500'" />  
                                          <span class="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Seguridad</span>
                  </div>
                </a>
              </li>
            </router-link> -->

            <!-- Cerrar Sesión -->
            <li class="pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 cursor-pointer" @click="cerrarSesion">
              <div class="flex items-center">
                <ArrowRightOnRectangleIcon class="shrink-0 w-4 h-4 text-gray-400 dark:text-gray-500" /> 
                <span class="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 text-gray-800 dark:text-gray-100 hover:text-gray-900 dark:hover:text-white">
                  {{ signOutLoading ? 'Cerrando...' : 'Cerrar Sesión' }}
                </span>
              </div>
            </li>
            
          </ul>
        </div>
      </div>

      <!-- Expand / collapse button -->
      <div class="pt-3 hidden lg:inline-flex 2xl:hidden justify-end mt-auto">
        <div class="w-12 pl-4 pr-3 py-2">
          <button class="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400" @click.prevent="sidebarExpanded = !sidebarExpanded">
            <span class="sr-only">Expand / collapse sidebar</span>
            <svg class="shrink-0 fill-current text-gray-400 dark:text-gray-500 sidebar-expanded:rotate-180" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                <path d="M15 16a1 1 0 0 1-1-1V1a1 1 0 1 1 2 0v14a1 1 0 0 1-1 1ZM8.586 7H1a1 1 0 1 0 0 2h7.586l-2.793 2.793a1 1 0 1 0 1.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
            </svg>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useViewPermissions } from '@/composables/useViewPermissions'
import { 
  HomeIcon,
  ShoppingBagIcon,
  CubeIcon,
  UserGroupIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  UserIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'

import SidebarLinkGroup from './SidebarLinkGroup.vue'

export default {
  name: 'Sidebar',
  props: [
    'sidebarOpen',
    'variant'
  ],
  components: {
    SidebarLinkGroup,
    HomeIcon,
    ShoppingBagIcon,
    CubeIcon,
    UserGroupIcon,
    ChartBarIcon,
    Cog6ToothIcon,
    UserIcon,
    ShieldCheckIcon,
    ArrowRightOnRectangleIcon
  },  
  setup(props, { emit }) {
    const { signOut, signOutLoading } = useAuth()
    const { canViewRoute } = useViewPermissions()

    const trigger = ref(null)
    const sidebar = ref(null)

    const storedSidebarExpanded = localStorage.getItem('sidebar-expanded')
    const sidebarExpanded = ref(storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true')

    const router = useRouter()
    const currentRoute = computed(() => {
      return router.currentRoute.value
    })

    const cerrarSesion = async () => {
      try {
        console.log('Sidebar: Iniciando cierre de sesión...')
        
        // Timeout de seguridad para forzar redirección
        const redirectTimeout = setTimeout(() => {
          console.warn('Sidebar: Timeout de seguridad, forzando redirección')
          router.push('/login')
        }, 15000) // 15 segundos
        
        const success = await signOut()
        clearTimeout(redirectTimeout)
        
        console.log('Sidebar: Resultado del logout:', success)
        
        if (!success) {
          console.error('Sidebar: El logout falló, forzando redirección')
          router.push('/login')
        }
      } catch (error) {
        console.error('Sidebar: Error cerrando sesión:', error)
        // Forzar redirección en caso de error
        router.push('/login')
      }
    }

    // close on click outside
    const clickHandler = ({ target }) => {
      if (!sidebar.value || !trigger.value) return
      if (
        !props.sidebarOpen ||
        sidebar.value.contains(target) ||
        trigger.value.contains(target)
      ) return
      emit('close-sidebar')
    }

    // close if the esc key is pressed
    const keyHandler = ({ keyCode }) => {
      if (!props.sidebarOpen || keyCode !== 27) return
      emit('close-sidebar')
    } 

    onMounted(() => {
      document.addEventListener('click', clickHandler)
      document.addEventListener('keydown', keyHandler)
    })

    onUnmounted(() => {
      document.removeEventListener('click', clickHandler)
      document.removeEventListener('keydown', keyHandler)
    })

    watch(sidebarExpanded, () => {
      localStorage.setItem('sidebar-expanded', sidebarExpanded.value)
      if (sidebarExpanded.value) {
        document.querySelector('body').classList.add('sidebar-expanded')
      } else {
        document.querySelector('body').classList.remove('sidebar-expanded')
      }
    })

    return {
      trigger,
      sidebar,
      sidebarExpanded,
      currentRoute,
      cerrarSesion,
      signOutLoading,
      canViewRoute
    }
  },
}
</script>