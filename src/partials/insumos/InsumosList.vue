<template>
  <div class="space-y-6">
    <!-- Banner de alertas -->
    <div v-if="alertas.length" class="bg-red-600 text-white p-3 rounded mb-4">
      ⚠️ {{ alertas.length }} insumos próximos a vencer:
      <span v-for="(insumo, i) in alertas" :key="i">{{ insumo.nombre }}{{ i < alertas.length - 1 ? "," : "" }}</span>
    </div>

    <!-- Filtros -->
    <div class="bg-zinc-900/80 border border-zinc-700/50 rounded-lg p-4">
      <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
        <!-- Búsqueda -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-300 mb-2">Buscar insumo</label>
          <input
            v-model="filtros.busqueda"
            type="text"
            placeholder="Nombre, código o descripción..."
            class="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <!-- Categoría -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Categoría</label>
          <select
            v-model="filtros.categoria"
            class="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="">Todas las categorías</option>
            <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
              {{ categoria.nombre }}
            </option>
          </select>
        </div>

        <!-- Estado -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Estado</label>
          <select
            v-model="filtros.estado"
            class="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="">Todos los estados</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
            <option value="Agotado">Agotado</option>
            <option value="Vencido">Vencido</option>
          </select>
        </div>

        <!-- Filtro de vencimiento -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Vencimiento</label>
          <select
            v-model="filtros.vencimiento"
            @change="aplicarFiltroVencimiento"
            class="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="">Todos</option>
            <option value="hoy">Hoy</option>
            <option value="mañana">Mañana</option>
            <option value="estaSemana">Esta semana</option>
            <option value="esteMes">Este mes</option>
          </select>
        </div>

        <!-- Reset -->
        <div class="flex items-end">
          <button @click="resetFiltros()" class="px-3 py-2 bg-gray-500 text-white rounded">Reiniciar</button>
        </div>
      </div>
    </div>

    <!-- Lista de insumos -->
    <div class="bg-zinc-900/80 border border-zinc-700/50 rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-zinc-900 border-b border-zinc-700/50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Insumo</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Categorías</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Stock Total</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Lotes</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Proveedor</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Estado</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Fecha Vencimiento</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Criticidad</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-700/50">
            <tr v-for="insumo in insumosOrdenados" :key="insumo.id" class="hover:bg-zinc-800/50 transition-colors">
              <td class="px-4 py-4">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-violet-500 flex items-center justify-center">
                      <span class="text-white font-bold text-sm">{{ insumo.nombre.charAt(0) }}</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-white">{{ insumo.nombre }}</div>
                    <div class="text-sm text-gray-400">{{ insumo.codigo }}</div>
                    <div class="text-xs text-gray-500">{{ insumo.descripcion }}</div>
                  </div>
                </div>
              </td>

              <td class="px-4 py-4">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="categoriaRel in insumo.categorias"
                    :key="categoriaRel.id"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    :style="{ backgroundColor: getCategoriaColor(categoriaRel.categoria?.id) + '20', color: getCategoriaColor(categoriaRel.categoria?.id) }"
                  >
                    {{ getCategoriaNombre(categoriaRel.categoria?.id) }}
                  </span>
                </div>
              </td>

              <td class="px-4 py-4 text-white font-medium">{{ getStockTotal(insumo) }} {{ insumo.unidad_medida }}</td>
              <td class="px-4 py-4 text-white font-medium">{{ insumo.lotes.length }} lote(s)</td>
              <td class="px-4 py-4">
                <div class="text-sm">
                  <span v-if="insumo.proveedor_principal" class="text-white font-medium">
                    {{ insumo.proveedor_principal.nombre }}
                  </span>
                  <span v-else class="text-gray-400 italic">Sin proveedor</span>
                </div>
              </td>

              <td class="px-4 py-4">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getEstadoClass(insumo.estado)"
                >
                  {{ insumo.estado }}
                </span>
              </td>

              <td class="px-4 py-4 text-white font-medium">{{ getFechaVencimiento(insumo) || "-" }}</td>

              <td class="px-4 py-4">
                <span
                  v-if="getCriticidad(insumo).label"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
                  :style="{ backgroundColor: getCriticidad(insumo).color, color: '#000' }"
                >
                  {{ getCriticidad(insumo).label }}
                </span>
                <span v-else class="text-gray-400 text-xs">Sin criticidad</span>
              </td>

              <td class="px-4 py-4">
                <div class="flex space-x-2">
                  <button @click="$emit('ver-insumo', insumo)" class="px-3 py-1 bg-violet-500 text-white rounded">Ver</button>
                  <button @click="$emit('editar-insumo', insumo)" class="px-3 py-1 bg-amber-500 text-black rounded">Editar</button>
                  <button @click="$emit('eliminar-insumo', insumo)" class="px-3 py-1 bg-red-500 text-white rounded">Eliminar</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="insumosFiltrados.length === 0" class="text-center py-8">
        <div class="text-gray-400 text-lg">No se encontraron insumos</div>
        <div class="text-gray-500 text-sm mt-2">Intenta ajustar los filtros de búsqueda</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { calcularCriticidad } from "@/utils/vencimientoHelper";

export default {
  name: "InsumosList",
  props: {
    insumos: Array,
    categorias: Array,
    proveedores: Array
  },
  emits: ["ver-insumo", "editar-insumo", "eliminar-insumo", "registrar-movimiento"],
  setup(props) {
    const filtros = ref({
      busqueda: "",
      categoria: "",
      estado: "",
      vencimiento: ""
    });

    const getCategoriaNombre = categoriaId => {
      const categoria = props.categorias.find(c => c.id === categoriaId);
      return categoria ? categoria.nombre : "Sin categoría";
    };

    const getCategoriaColor = categoriaId => {
      const categoria = props.categorias.find(c => c.id === categoriaId);
      return categoria ? categoria.color : "#6b7280";
    };

    const getStockTotal = insumo =>
      insumo.lotes.reduce((total, lote) => total + parseFloat(lote.cantidad_actual || 0), 0);

    const getFechaVencimiento = insumo => {
      if (!insumo.lotes || insumo.lotes.length === 0) return null;
      const lotesOrdenados = [...insumo.lotes].sort(
        (a, b) => new Date(a.fecha_vencimiento) - new Date(b.fecha_vencimiento)
      );
      return lotesOrdenados[0]?.fecha_vencimiento || null;
    };

    const getCriticidad = insumo => {
      const fecha = getFechaVencimiento(insumo);
      if (!fecha) return { label: null, color: "" };

      const crit = calcularCriticidad(fecha);

      if (new Date(fecha) < new Date()) {
        return { label: "Vencido", color: "#ff4d4f" };
      }

      return crit;
    };

    const getEstadoClass = estado => {
      const clases = {
        Activo: "bg-green-100 text-green-800",
        Inactivo: "bg-gray-100 text-gray-800",
        Agotado: "bg-red-100 text-red-800",
        Vencido: "bg-orange-100 text-orange-800"
      };
      return clases[estado] || "bg-gray-100 text-gray-800";
    };

    const insumosFiltrados = computed(() => {
      let resultado = props.insumos;

      if (filtros.value.busqueda) {
        const busqueda = filtros.value.busqueda.toLowerCase();
        resultado = resultado.filter(
          insumo =>
            insumo.nombre.toLowerCase().includes(busqueda) ||
            insumo.codigo.toLowerCase().includes(busqueda) ||
            insumo.descripcion.toLowerCase().includes(busqueda)
        );
      }

      if (filtros.value.categoria) {
        resultado = resultado.filter(insumo =>
          insumo.categorias.some(cat => cat.categoria?.id === filtros.value.categoria)
        );
      }

      if (filtros.value.estado) {
        resultado = resultado.filter(insumo => insumo.estado === filtros.value.estado);
      }

      if (filtros.value.vencimiento) {
        const hoy = new Date();
        resultado = resultado.filter(insumo => {
          const fecha = getFechaVencimiento(insumo);
          if (!fecha) return false;
          const fechaV = new Date(fecha);
          const diffDias = Math.ceil((fechaV - hoy) / (1000 * 60 * 60 * 24));
          if (filtros.value.vencimiento === "hoy") return diffDias === 0;
          if (filtros.value.vencimiento === "mañana") return diffDias === 1;
          if (filtros.value.vencimiento === "estaSemana") return diffDias > 1 && diffDias <= 7;
          if (filtros.value.vencimiento === "esteMes") return fechaV.getMonth() === hoy.getMonth() && fechaV.getFullYear() === hoy.getFullYear();
          return true;
        });
      }

      return resultado;
    });

    const insumosOrdenados = computed(() => {
      return [...insumosFiltrados.value].sort((a, b) => {
        const fechaA = new Date(getFechaVencimiento(a) || 0);
        const fechaB = new Date(getFechaVencimiento(b) || 0);
        return fechaA - fechaB;
      });
    });

    const alertas = computed(() =>
      props.insumos.filter(insumo => {
        const fecha = getFechaVencimiento(insumo);
        if (!fecha) return false;
        const diffDias = Math.ceil((new Date(fecha) - new Date()) / (1000 * 60 * 60 * 24));
        return diffDias <= 7 && diffDias >= 0;
      })
    );

    const aplicarFiltroVencimiento = () => {};

    const resetFiltros = () => {
      filtros.value = {
        busqueda: "",
        categoria: "",
        estado: "",
        vencimiento: ""
      };
    };

    return {
      filtros,
      insumosFiltrados,
      insumosOrdenados,
      getCategoriaNombre,
      getCategoriaColor,
      getStockTotal,
      getEstadoClass,
      getFechaVencimiento,
      getCriticidad,
      alertas,
      aplicarFiltroVencimiento,
      resetFiltros
    };
  }
};
</script>
