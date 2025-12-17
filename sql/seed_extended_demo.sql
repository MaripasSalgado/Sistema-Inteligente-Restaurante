-- Script EXTENDIDO para generar datos de demo más realistas
-- Ejecutar después de los seeds existentes (seed_inventory_suppliers.sql, seed_recetas.sql, seed_productos.sql)
-- Este script agrega:
-- 1. Más clientes (20+)
-- 2. Ventas de los últimos 6 meses con patrones realistas
-- 3. Movimientos de inventario extensivos
-- 4. Predicciones de demanda e ingresos
-- 5. Métricas de dashboard
-- Moneda: Colones (CRC)

BEGIN;

-- =============================================
-- 1. CLIENTES ADICIONALES (20 clientes diversos)
-- =============================================
INSERT INTO public.clientes (id, nombre, email, telefono, tipo_cliente, direccion, total_compras, observaciones) VALUES
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c01', 'Juan Pérez Mora', 'juan.perez@gmail.com', '8844-5566', 'Frecuente', 'San José Centro', 125000, 'Cliente desde 2024'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c02', 'María García López', 'maria.garcia@hotmail.com', '8855-6677', 'Regular', 'Escazú', 45000, NULL),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c03', 'Carlos Jiménez Rojas', 'carlos.jimenez@empresa.cr', '7011-2233', 'VIP', 'Santa Ana', 380000, 'Pedidos corporativos frecuentes'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c04', 'Ana Rodríguez Vargas', 'ana.rodriguez@gmail.com', '8866-7788', 'Frecuente', 'Heredia Centro', 95000, NULL),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c05', 'Roberto Méndez Castro', 'roberto.mendez@outlook.com', '8877-8899', 'Regular', 'Alajuela', 32000, NULL),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c06', 'Patricia Solís Hernández', 'patricia.solis@gmail.com', '7022-3344', 'Frecuente', 'Cartago', 78000, 'Prefiere pedidos para llevar'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c07', 'Empresa NovaTech S.A.', 'pedidos@novatech.cr', '2222-8899', 'Corporativo', 'Parque Empresarial Forum', 520000, 'Pedidos semanales para oficina'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c08', 'Luis Quesada Mora', 'luis.quesada@gmail.com', '8811-0099', 'Regular', 'Moravia', 28000, NULL),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c09', 'Sofía Ramírez Chen', 'sofia.ramirez@empresa.cr', '8822-1100', 'VIP', 'Rohrmoser', 290000, 'Eventos especiales'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c10', 'Diego Torres Arias', 'diego.torres@gmail.com', '7033-4455', 'Frecuente', 'Tibás', 67000, NULL),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c11', 'Restaurante Los Amigos', 'pedidos@losamigos.cr', '2233-5566', 'Corporativo', 'San Pedro', 185000, 'Reventa autorizada'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c12', 'Fernanda Villalobos', 'fernanda.v@outlook.com', '8833-2211', 'Regular', 'Desamparados', 19000, NULL),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c13', 'Miguel Álvarez Soto', 'miguel.alvarez@gmail.com', '8844-3322', 'Frecuente', 'Tres Ríos', 82000, 'Siempre pide combo familiar'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c14', 'Oficinas del Banco Popular', 'comedor@bp.fi.cr', '2211-4433', 'Corporativo', 'San José Centro', 420000, 'Entregas cada viernes'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c15', 'Carmen Vega Solano', 'carmen.vega@gmail.com', '7044-5566', 'Regular', 'Curridabat', 24000, NULL),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c16', 'Andrés Montero', 'andres.montero@hotmail.com', '8855-4433', 'Frecuente', 'Guadalupe', 56000, NULL),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c17', 'Consultora TecnoSoft', 'admin@tecnosoft.cr', '2244-6677', 'Corporativo', 'La Sabana', 310000, 'Eventos mensuales'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c18', 'Valentina Campos', 'valentina.campos@gmail.com', '8866-5544', 'VIP', 'Escazú', 175000, 'Cumpleaños y celebraciones'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c19', 'José Alfredo Sánchez', 'jose.sanchez@empresa.cr', '7055-6677', 'Regular', 'Pavas', 31000, NULL),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c20', 'Elena Morales Ulate', 'elena.morales@outlook.com', '8877-6655', 'Frecuente', 'Coronado', 89000, 'Pedidos de fin de semana')
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 2. GENERACIÓN DINÁMICA DE VENTAS (6 MESES)
-- =============================================
DO $$
DECLARE
    v_start_date date := CURRENT_DATE - INTERVAL '6 months';
    v_end_date date := CURRENT_DATE;
    v_current_date date;
    v_cliente_ids uuid[];
    v_producto_ids uuid[];
    v_producto_precios numeric[];
    v_usuario_ids uuid[];
    v_venta_id uuid;
    v_producto_id uuid;
    v_precio numeric;
    v_cantidad integer;
    v_total_venta numeric;
    v_descuento numeric;
    v_impuesto numeric;
    v_fecha_venta timestamp with time zone;
    i integer;
    j integer;
    v_num_ventas_dia integer;
    v_dia_semana integer;
    v_mes integer;
    v_tipo_venta text;
    v_metodo_pago text;
    v_orden_num integer := 10000;
BEGIN
    -- Obtener IDs existentes
    SELECT ARRAY(SELECT id FROM public.clientes WHERE activo = true) INTO v_cliente_ids;
    SELECT ARRAY(SELECT id FROM public.productos WHERE activo = true) INTO v_producto_ids;
    SELECT ARRAY(SELECT precio_venta FROM public.productos WHERE activo = true) INTO v_producto_precios;
    SELECT ARRAY(SELECT id FROM public.usuarios WHERE estado = 'Activo' LIMIT 5) INTO v_usuario_ids;

    -- Si no hay productos, salir
    IF array_length(v_producto_ids, 1) IS NULL THEN
        RAISE NOTICE 'No hay productos activos. Saltando generación de ventas.';
        RETURN;
    END IF;

    -- Generar Ventas día por día
    v_current_date := v_start_date;
    WHILE v_current_date <= v_end_date LOOP
        v_dia_semana := EXTRACT(DOW FROM v_current_date);
        v_mes := EXTRACT(MONTH FROM v_current_date);
        
        -- Patrón de ventas más realista
        -- Fin de semana (Viernes a Domingo): más ventas
        -- Diciembre: temporada alta
        IF v_dia_semana IN (0, 5, 6) THEN
            v_num_ventas_dia := floor(random() * 15 + 25); -- 25-40 ventas
        ELSIF v_dia_semana IN (4) THEN -- Jueves
            v_num_ventas_dia := floor(random() * 10 + 18); -- 18-28 ventas
        ELSE
            v_num_ventas_dia := floor(random() * 12 + 8); -- 8-20 ventas
        END IF;

        -- Boost de Diciembre
        IF v_mes = 12 THEN
            v_num_ventas_dia := v_num_ventas_dia + floor(random() * 10 + 5);
        END IF;

        FOR i IN 1..v_num_ventas_dia LOOP
            -- Hora aleatoria entre 10am y 10pm
            v_fecha_venta := v_current_date + (random() * interval '12 hours') + interval '10 hours';
            v_venta_id := gen_random_uuid();
            v_orden_num := v_orden_num + 1;
            
            -- Tipo de venta con distribución realista
            IF random() < 0.55 THEN
                v_tipo_venta := 'Local';
            ELSIF random() < 0.75 THEN
                v_tipo_venta := 'Para Llevar';
            ELSE
                v_tipo_venta := 'Domicilio';
            END IF;

            -- Método de pago
            IF random() < 0.45 THEN
                v_metodo_pago := 'Efectivo';
            ELSIF random() < 0.85 THEN
                v_metodo_pago := 'Tarjeta';
            ELSE
                v_metodo_pago := 'Transferencia';
            END IF;

            INSERT INTO public.ventas (
                id, numero_orden, cliente_id, tipo_venta, estado, metodo_pago, 
                subtotal, descuento, impuestos, total,
                fecha_venta, fecha_creacion, vendedor_id
            ) VALUES (
                v_venta_id,
                'ORD-' || v_orden_num,
                CASE WHEN random() < 0.65 AND array_length(v_cliente_ids, 1) > 0 
                     THEN v_cliente_ids[1 + floor(random() * array_length(v_cliente_ids, 1))::integer] 
                     ELSE NULL END,
                v_tipo_venta,
                'Completada',
                v_metodo_pago,
                0, 0, 0, 0,
                v_fecha_venta,
                v_fecha_venta,
                CASE WHEN array_length(v_usuario_ids, 1) > 0 
                     THEN v_usuario_ids[1 + floor(random() * array_length(v_usuario_ids, 1))::integer] 
                     ELSE NULL END
            );

            -- Detalles de venta (1-5 productos por venta)
            v_total_venta := 0;
            FOR j IN 1..floor(random() * 5 + 1)::integer LOOP
                DECLARE
                    v_idx integer := 1 + floor(random() * array_length(v_producto_ids, 1))::integer;
                BEGIN
                    v_producto_id := v_producto_ids[v_idx];
                    v_precio := v_producto_precios[v_idx];
                    v_cantidad := floor(random() * 3 + 1)::integer;
                    
                    IF v_producto_id IS NOT NULL AND v_precio IS NOT NULL THEN
                        INSERT INTO public.detalles_venta (
                            venta_id, producto_id, cantidad, precio_unitario, descuento, subtotal, fecha_creacion
                        ) VALUES (
                            v_venta_id, v_producto_id, v_cantidad, v_precio, 0, v_cantidad * v_precio, v_fecha_venta
                        );
                        v_total_venta := v_total_venta + (v_cantidad * v_precio);
                    END IF;
                END;
            END LOOP;

            -- Aplicar descuento ocasional (10% de ventas)
            IF random() < 0.10 THEN
                v_descuento := ROUND(v_total_venta * 0.10, 2);
            ELSE
                v_descuento := 0;
            END IF;

            -- Calcular impuesto (13% IVA Costa Rica)
            v_impuesto := ROUND((v_total_venta - v_descuento) * 0.13, 2);

            UPDATE public.ventas 
            SET subtotal = v_total_venta,
                descuento = v_descuento,
                impuestos = v_impuesto,
                total = v_total_venta - v_descuento + v_impuesto
            WHERE id = v_venta_id;

        END LOOP;
        v_current_date := v_current_date + 1;
    END LOOP;

    RAISE NOTICE 'Ventas generadas exitosamente hasta orden: %', v_orden_num;
END $$;

-- =============================================
-- 3. ACTUALIZAR CONTADORES DE PRODUCTOS
-- =============================================
WITH ventas_por_producto AS (
    SELECT 
        dv.producto_id,
        SUM(dv.cantidad)::integer as total_vendido,
        MAX(v.fecha_venta) as ultima_venta
    FROM public.detalles_venta dv
    JOIN public.ventas v ON v.id = dv.venta_id
    WHERE v.estado = 'Completada'
    GROUP BY dv.producto_id
)
UPDATE public.productos p
SET ventas_registradas = COALESCE(vpp.total_vendido, 0),
    ultima_venta = COALESCE(vpp.ultima_venta, p.ultima_venta)
FROM ventas_por_producto vpp
WHERE p.id = vpp.producto_id;

-- =============================================
-- 4. ACTUALIZAR TOTALES DE CLIENTES
-- =============================================
WITH compras_por_cliente AS (
    SELECT 
        v.cliente_id,
        SUM(v.total) as total_comprado,
        MAX(v.fecha_venta) as ultima_compra
    FROM public.ventas v
    WHERE v.estado = 'Completada' AND v.cliente_id IS NOT NULL
    GROUP BY v.cliente_id
)
UPDATE public.clientes c
SET total_compras = COALESCE(cc.total_comprado, 0),
    ultima_compra = COALESCE(cc.ultima_compra, c.ultima_compra)
FROM compras_por_cliente cc
WHERE c.id = cc.cliente_id;

-- =============================================
-- 5. MOVIMIENTOS DE INVENTARIO ADICIONALES
-- =============================================
DO $$
DECLARE
    v_lote_ids uuid[];
    v_lote record;
    v_usuario_id uuid;
    v_current_date date := CURRENT_DATE - INTERVAL '30 days';
    v_movimiento_tipo text;
    v_cantidad numeric;
    i integer;
BEGIN
    SELECT id INTO v_usuario_id FROM public.usuarios LIMIT 1;
    
    -- Obtener lotes activos
    FOR v_lote IN SELECT id, insumo_id, precio_unitario, lote FROM public.lotes_insumos WHERE estado = 'Activo' LOOP
        -- Generar 3-5 movimientos por lote en el último mes
        FOR i IN 1..floor(random() * 3 + 3)::integer LOOP
            v_current_date := CURRENT_DATE - (floor(random() * 30)::integer || ' days')::interval;
            v_cantidad := ROUND((random() * 5 + 1)::numeric, 2);
            
            IF random() < 0.8 THEN
                v_movimiento_tipo := 'Salida';
            ELSE
                v_movimiento_tipo := 'Entrada';
            END IF;

            INSERT INTO public.movimientos_inventario (
                lote_id, tipo, cantidad, motivo, 
                costo_unitario, costo_total, usuario_id, fecha_movimiento
            ) VALUES (
                v_lote.id,
                v_movimiento_tipo,
                v_cantidad,
                CASE v_movimiento_tipo 
                    WHEN 'Salida' THEN 'Producción diaria - ' || to_char(v_current_date, 'DD/MM')
                    ELSE 'Reposición stock - ' || v_lote.lote
                END,
                v_lote.precio_unitario,
                v_cantidad * v_lote.precio_unitario,
                v_usuario_id,
                v_current_date
            );
        END LOOP;
    END LOOP;
END $$;

-- =============================================
-- 6. PREDICCIONES DE DEMANDA E INGRESOS
-- =============================================
-- Limpiar predicciones anteriores
DELETE FROM public.predicciones WHERE fecha_inicio >= CURRENT_DATE;

-- Predicciones de ventas para los próximos 30 días
INSERT INTO public.predicciones (tipo_prediccion, periodo, fecha_inicio, fecha_fin, valor_predicho, nivel_confianza, algoritmo, activa)
SELECT 
    'ventas_productos',
    'diario',
    CURRENT_DATE + (n || ' days')::interval,
    CURRENT_DATE + (n || ' days')::interval,
    CASE 
        WHEN EXTRACT(DOW FROM CURRENT_DATE + (n || ' days')::interval) IN (0, 5, 6) 
        THEN ROUND((random() * 150000 + 250000)::numeric, 2)
        ELSE ROUND((random() * 100000 + 120000)::numeric, 2)
    END,
    ROUND((random() * 0.15 + 0.80)::numeric, 2),
    'Random Forest v2.1',
    true
FROM generate_series(1, 30) n;

-- Predicciones de ingresos semanales
INSERT INTO public.predicciones (tipo_prediccion, periodo, fecha_inicio, fecha_fin, valor_predicho, nivel_confianza, algoritmo, activa)
SELECT 
    'ingresos',
    'semanal',
    CURRENT_DATE + ((n * 7) || ' days')::interval,
    CURRENT_DATE + ((n * 7 + 6) || ' days')::interval,
    ROUND((random() * 800000 + 1200000)::numeric, 2),
    ROUND((random() * 0.10 + 0.85)::numeric, 2),
    'ARIMA + XGBoost',
    true
FROM generate_series(1, 8) n;

-- Predicciones de demanda de insumos críticos
INSERT INTO public.predicciones (tipo_prediccion, periodo, fecha_inicio, fecha_fin, insumo_id, valor_predicho, nivel_confianza, algoritmo, activa)
SELECT 
    'demanda_insumos',
    'semanal',
    CURRENT_DATE + ((n * 7) || ' days')::interval,
    CURRENT_DATE + ((n * 7 + 6) || ' days')::interval,
    i.id,
    ROUND((random() * 20 + 10)::numeric, 2),
    ROUND((random() * 0.12 + 0.82)::numeric, 2),
    'Prophet + LSTM',
    true
FROM generate_series(1, 4) n
CROSS JOIN (
    SELECT id FROM public.insumos 
    WHERE codigo IN ('CAR-001', 'CAR-002', 'HAR-001', 'LAC-001', 'CON-001')
) i;

-- =============================================
-- 7. MÉTRICAS DE DASHBOARD
-- =============================================
-- Limpiar métricas antiguas del mes actual
DELETE FROM public.metricas_dashboard 
WHERE fecha_medicion >= DATE_TRUNC('month', CURRENT_DATE);

-- Métricas de ventas diarias del mes actual
INSERT INTO public.metricas_dashboard (nombre, valor, unidad, tipo_metrica, periodo, fecha_medicion, tendencia, activa)
SELECT 
    'Ventas del Día',
    COALESCE(SUM(v.total), 0),
    'CRC',
    'ventas',
    'diario',
    DATE(v.fecha_venta),
    CASE 
        WHEN random() < 0.4 THEN 'ascendente'
        WHEN random() < 0.7 THEN 'estable'
        ELSE 'descendente'
    END,
    true
FROM public.ventas v
WHERE v.estado = 'Completada'
  AND DATE(v.fecha_venta) >= DATE_TRUNC('month', CURRENT_DATE)
GROUP BY DATE(v.fecha_venta);

-- Métricas de inventario
INSERT INTO public.metricas_dashboard (nombre, valor, unidad, tipo_metrica, periodo, fecha_medicion, meta, activa)
SELECT 
    'Valor Inventario Total',
    COALESCE(SUM(l.cantidad_actual * l.precio_unitario), 0),
    'CRC',
    'inventario',
    'diario',
    CURRENT_DATE,
    2000000,
    true
FROM public.lotes_insumos l
WHERE l.estado = 'Activo';

-- Conteo de productos bajo stock
INSERT INTO public.metricas_dashboard (nombre, valor, unidad, tipo_metrica, periodo, fecha_medicion, meta, activa)
SELECT 
    'Productos Bajo Stock',
    COUNT(DISTINCT i.id),
    'unidades',
    'inventario',
    'diario',
    CURRENT_DATE,
    0,
    true
FROM public.insumos i
LEFT JOIN public.lotes_insumos l ON l.insumo_id = i.id AND l.estado = 'Activo'
GROUP BY i.id
HAVING COALESCE(SUM(l.cantidad_actual), 0) < i.stock_minimo;

-- =============================================
-- 8. ACTUALIZAR CALIFICACIONES PROMEDIO PROVEEDORES
-- =============================================
WITH calificaciones_promedio AS (
    SELECT 
        proveedor_id,
        ROUND(AVG(calificacion)::numeric, 2) as promedio,
        COUNT(*) as total_evaluaciones
    FROM public.evaluaciones_proveedores
    GROUP BY proveedor_id
)
UPDATE public.proveedores p
SET calificacion_promedio = cp.promedio
FROM calificaciones_promedio cp
WHERE p.id = cp.proveedor_id;

-- =============================================
-- 9. ACTUALIZAR ESTADÍSTICAS DE RECETAS
-- =============================================
UPDATE public.recetas r
SET veces_preparada = COALESCE((
    SELECT SUM(dv.cantidad * rp.cantidad)::integer
    FROM public.detalles_venta dv
    JOIN public.productos p ON p.id = dv.producto_id
    JOIN public.recetas_producto rp ON rp.producto_id = p.id
    JOIN public.ventas v ON v.id = dv.venta_id
    WHERE rp.receta_id = r.id AND v.estado = 'Completada'
), 0),
popularidad = COALESCE((
    SELECT COUNT(DISTINCT v.id)::integer
    FROM public.detalles_venta dv
    JOIN public.productos p ON p.id = dv.producto_id
    JOIN public.recetas_producto rp ON rp.producto_id = p.id
    JOIN public.ventas v ON v.id = dv.venta_id
    WHERE rp.receta_id = r.id AND v.estado = 'Completada'
), 0);

COMMIT;

-- =============================================
-- RESUMEN
-- =============================================
-- Este script genera:
-- ✅ 20 clientes adicionales (regulares, frecuentes, VIP, corporativos)
-- ✅ ~3000-5000 ventas distribuidas en 6 meses con patrones realistas
-- ✅ Movimientos de inventario diarios
-- ✅ 30 días de predicciones de ventas
-- ✅ 8 semanas de predicciones de ingresos
-- ✅ Predicciones de demanda de insumos críticos
-- ✅ Métricas de dashboard actualizadas
-- ✅ Estadísticas de recetas y productos actualizadas
