-- Script para limpiar toda la data del restaurante y empezar desde cero
-- Mantiene: Usuarios, Roles y Permisos del sistema.
-- Elimina: Ventas, Inventario, Recetas, Productos, Clientes, Asistencia, Planillas, etc.

BEGIN;

RAISE NOTICE 'Iniciando limpieza de base de datos...';

-- 1. Métricas, Alertas y Predicciones (Tablas sin dependencias fuertes hacia abajo)
TRUNCATE TABLE public.metricas_dashboard, public.predicciones, public.alertas_consumo, public.alertas_vencimiento, public.alerts, public.alert_logs CASCADE;

-- 2. Ventas y Clientes
TRUNCATE TABLE public.detalles_venta, public.ventas, public.clientes CASCADE;

-- 3. Productos y Recetas
-- Nota: Recetas depende de Insumos (ingredientes), Productos depende de Categorias
TRUNCATE TABLE public.recetas_producto, public.ingredientes_receta, public.pasos_receta, public.recetas, public.categorias_recetas, public.productos, public.categorias_productos CASCADE;

-- 4. Inventario y Proveedores
TRUNCATE TABLE public.movimientos_inventario, public.lotes_insumos, public.insumos_categorias, public.insumos, public.categorias_insumos, public.proveedores, public.evaluaciones_proveedores CASCADE;

-- 5. RRHH y Planillas
TRUNCATE TABLE public.asistencia, public.turnos, public.turno_series, public.bonos, public.deducciones, public.recibos_pago, public.historial_pagos, public.planillas, public.historial_salarios CASCADE;

-- 6. Configuraciones de Negocio
-- Estas tablas definen la operación del restaurante. Se limpian para un "hard reset".
TRUNCATE TABLE public.configuracion_aguinaldo, public.configuracion_deducciones, public.tipos_contrato, public.franjas_requeridas, public.horarios_local CASCADE;

RAISE NOTICE 'Limpieza completada. La base de datos está lista para nueva data.';

COMMIT;
