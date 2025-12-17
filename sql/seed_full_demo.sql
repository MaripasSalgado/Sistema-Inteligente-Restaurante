-- Script COMPLETO para generar un entorno de DEMO
-- Ejecutar después de clean_database.sql
-- Este script llena:
-- 1. Catálogos (Categorías, Productos, Clientes, Proveedores, Insumos)
-- 2. Inventario Inicial
-- 3. Historial de Ventas (6 meses)
-- 4. Asistencia
-- 5. Predicciones

BEGIN;

-- =============================================
-- 1. CATÁLOGOS
-- =============================================

-- Categorías de Productos
INSERT INTO public.categorias_productos (id, nombre, descripcion, color, icono) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Empanadas', 'Nuestras famosas empanadas', '#F59E0B', '🥟'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Bebidas', 'Refrescos y jugos naturales', '#3B82F6', '🥤'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Postres', 'Dulces para el final', '#EC4899', '🍰');

-- Productos
INSERT INTO public.productos (id, codigo, nombre, descripcion, categoria_id, precio_venta, costo_total, activo) VALUES
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', 'EMP-001', 'Empanada de Carne', 'Deliciosa empanada de carne molida', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 1200.00, 600.00, true),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b12', 'EMP-002', 'Empanada de Pollo', 'Empanada de pollo desmenuzado', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 1100.00, 550.00, true),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b13', 'EMP-003', 'Empanada de Queso', 'Full queso derretido', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 1000.00, 450.00, true),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b14', 'BEB-001', 'Coca Cola', 'Lata 355ml', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 1000.00, 600.00, true),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b15', 'BEB-002', 'Jugo de Naranja', 'Natural 16oz', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 1500.00, 700.00, true);

-- Clientes
INSERT INTO public.clientes (id, nombre, email, telefono, tipo_cliente) VALUES
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c11', 'Juan Pérez', 'juan@example.com', '9999-9999', 'Regular'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c12', 'María García', 'maria@example.com', '8888-8888', 'Frecuente'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c13', 'Empresa Tech SA', 'contacto@tech.com', '2222-2222', 'Corporativo');

-- Proveedores e Insumos (Básicos para que no esté vacío)
INSERT INTO public.proveedores (id, codigo, nombre, tipo, estado) VALUES
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d11', 'PROV-01', 'Carnes del Sur', 'Carnes y Embutidos', 'Activo');

INSERT INTO public.insumos (id, codigo, nombre, unidad_medida, stock_minimo, proveedor_principal_id) VALUES
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e11', 'INS-01', 'Carne Molida Premium', 'kg', 10, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d11'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e12', 'INS-02', 'Harina de Maíz', 'lb', 20, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d11');

-- Lotes (Inventario Inicial)
INSERT INTO public.lotes_insumos (id, insumo_id, lote, cantidad_inicial, cantidad_actual, precio_unitario) VALUES
(gen_random_uuid(), 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e11', 'LOTE-001', 50, 45, 4500.00), -- Stock OK
(gen_random_uuid(), 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e12', 'LOTE-002', 20, 5, 800.00);   -- Stock BAJO (para probar alertas)

COMMIT;

-- =============================================
-- 2. GENERACIÓN DE HISTORIAL (Script Dinámico)
-- =============================================
DO $$
DECLARE
    v_start_date date := CURRENT_DATE - INTERVAL '6 months';
    v_end_date date := CURRENT_DATE;
    v_current_date date;
    v_cliente_ids uuid[];
    v_producto_ids uuid[];
    v_usuario_ids uuid[];
    v_venta_id uuid;
    v_producto_id uuid;
    v_precio numeric;
    v_cantidad integer;
    v_total_venta numeric;
    v_fecha_venta timestamp with time zone;
    i integer;
    j integer;
    v_num_ventas_dia integer;
    v_dia_semana integer;
BEGIN
    -- Obtener IDs
    SELECT ARRAY(SELECT id FROM public.clientes) INTO v_cliente_ids;
    SELECT ARRAY(SELECT id FROM public.productos) INTO v_producto_ids;
    SELECT ARRAY(SELECT id FROM public.usuarios) INTO v_usuario_ids;

    -- Generar Ventas
    v_current_date := v_start_date;
    WHILE v_current_date <= v_end_date LOOP
        v_dia_semana := EXTRACT(DOW FROM v_current_date);
        
        -- Patrón de ventas: Fin de semana más alto
        IF v_dia_semana IN (0, 5, 6) THEN
            v_num_ventas_dia := floor(random() * 15 + 20); -- 20-35 ventas
        ELSE
            v_num_ventas_dia := floor(random() * 10 + 5); -- 5-15 ventas
        END IF;

        FOR i IN 1..v_num_ventas_dia LOOP
            v_fecha_venta := v_current_date + (random() * interval '12 hours') + interval '10 hours';
            v_venta_id := gen_random_uuid();
            
            INSERT INTO public.ventas (
                id, numero_orden, cliente_id, tipo_venta, estado, metodo_pago, 
                fecha_venta, fecha_creacion, vendedor_id
            ) VALUES (
                v_venta_id,
                'ORD-' || to_char(v_fecha_venta, 'YYYYMMDD') || '-' || i || '-' || floor(random()*1000),
                CASE WHEN random() < 0.5 THEN v_cliente_ids[1 + floor(random() * array_length(v_cliente_ids, 1))] ELSE NULL END,
                'Local',
                'Completada',
                'Efectivo',
                v_fecha_venta,
                v_fecha_venta,
                CASE WHEN array_length(v_usuario_ids, 1) > 0 THEN v_usuario_ids[1 + floor(random() * array_length(v_usuario_ids, 1))] ELSE NULL END
            );

            -- Detalles
            v_total_venta := 0;
            FOR j IN 1..floor(random() * 4 + 1) LOOP
                v_producto_id := v_producto_ids[1 + floor(random() * array_length(v_producto_ids, 1))];
                SELECT precio_venta INTO v_precio FROM public.productos WHERE id = v_producto_id;
                v_cantidad := floor(random() * 3 + 1);
                
                INSERT INTO public.detalles_venta (
                    venta_id, producto_id, cantidad, precio_unitario, subtotal, fecha_creacion
                ) VALUES (
                    v_venta_id, v_producto_id, v_cantidad, v_precio, v_cantidad * v_precio, v_fecha_venta
                );
                v_total_venta := v_total_venta + (v_cantidad * v_precio);
            END LOOP;

            UPDATE public.ventas SET total = v_total_venta, subtotal = v_total_venta WHERE id = v_venta_id;
        END LOOP;
        v_current_date := v_current_date + 1;
    END LOOP;

    -- Generar Asistencia (Último mes)
    v_current_date := CURRENT_DATE - INTERVAL '30 days';
    WHILE v_current_date <= CURRENT_DATE LOOP
        IF array_length(v_usuario_ids, 1) > 0 THEN
            FOR i IN 1..array_length(v_usuario_ids, 1) LOOP
                IF random() < 0.9 THEN
                    INSERT INTO public.asistencia (
                        usuario_id, fecha, entrada_real, salida_real, estado, fecha_creacion
                    ) VALUES (
                        v_usuario_ids[i],
                        v_current_date,
                        time '09:00:00',
                        time '17:00:00',
                        'a_tiempo',
                        v_current_date + time '09:00:00'
                    );
                END IF;
            END LOOP;
        END IF;
        v_current_date := v_current_date + 1;
    END LOOP;

    -- Generar Predicciones (Futuras)
    FOR i IN 1..30 LOOP
        INSERT INTO public.predicciones (
            tipo_prediccion, periodo, fecha_inicio, fecha_fin, valor_predicho, nivel_confianza, algoritmo, activa
        ) VALUES (
            'ventas_productos', 'diario', CURRENT_DATE + i, CURRENT_DATE + i, 
            (random() * 200000 + 100000), 0.85, 'Random Forest', true
        );
    END LOOP;

END $$;
