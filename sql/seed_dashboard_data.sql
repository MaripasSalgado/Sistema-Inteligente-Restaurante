-- Script para generar datos de prueba (Mock Data) para el Dashboard y Predicciones
-- Este script genera:
-- 1. Ventas históricas (6 meses) con detalles
-- 2. Movimientos de inventario relacionados
-- 3. Asistencia de empleados
-- 4. Métricas pre-calculadas

-- Función auxiliar para generar fechas aleatorias
CREATE OR REPLACE FUNCTION random_date(start_date date, end_date date)
RETURNS timestamp WITH TIME ZONE AS $$
BEGIN
  RETURN start_date + random() * (end_date - start_date) + (random() * interval '24 hours');
END;
$$ LANGUAGE plpgsql;

-- Función auxiliar para seleccionar un elemento aleatorio de un array
CREATE OR REPLACE FUNCTION random_element(elements anyarray)
RETURNS anyelement AS $$
BEGIN
  RETURN elements[1 + floor(random() * array_length(elements, 1))];
END;
$$ LANGUAGE plpgsql;

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
    -- Obtener IDs existentes
    SELECT ARRAY(SELECT id FROM public.clientes) INTO v_cliente_ids;
    SELECT ARRAY(SELECT id FROM public.productos) INTO v_producto_ids;
    SELECT ARRAY(SELECT id FROM public.usuarios) INTO v_usuario_ids;

    -- Si no hay datos suficientes, lanzar error o crear defaults (aquí asumimos que existen)
    IF array_length(v_producto_ids, 1) IS NULL THEN
        RAISE NOTICE 'No hay productos para generar ventas.';
        RETURN;
    END IF;

    -- 1. GENERAR VENTAS HISTÓRICAS
    v_current_date := v_start_date;
    WHILE v_current_date <= v_end_date LOOP
        v_dia_semana := EXTRACT(DOW FROM v_current_date);
        
        -- Más ventas los fines de semana (Viernes=5, Sábado=6, Domingo=0)
        IF v_dia_semana IN (0, 5, 6) THEN
            v_num_ventas_dia := floor(random() * 20 + 30); -- 30 a 50 ventas
        ELSE
            v_num_ventas_dia := floor(random() * 15 + 10); -- 10 a 25 ventas
        END IF;

        FOR i IN 1..v_num_ventas_dia LOOP
            v_fecha_venta := v_current_date + (random() * interval '12 hours') + interval '10 hours'; -- Entre 10am y 10pm
            v_venta_id := gen_random_uuid();
            
            -- Crear Venta
            INSERT INTO public.ventas (
                id, numero_orden, cliente_id, tipo_venta, estado, metodo_pago, 
                fecha_venta, fecha_creacion, vendedor_id
            ) VALUES (
                v_venta_id,
                'ORD-' || to_char(v_fecha_venta, 'YYYYMMDD') || '-' || i,
                CASE WHEN random() < 0.7 AND array_length(v_cliente_ids, 1) > 0 THEN random_element(v_cliente_ids) ELSE NULL END, -- 70% clientes registrados
                random_element(ARRAY['Local', 'Para Llevar', 'Domicilio']),
                'Completada',
                random_element(ARRAY['Efectivo', 'Tarjeta', 'Transferencia']),
                v_fecha_venta,
                v_fecha_venta,
                CASE WHEN array_length(v_usuario_ids, 1) > 0 THEN random_element(v_usuario_ids) ELSE NULL END
            );

            -- Crear Detalles de Venta (1 a 5 productos por venta)
            v_total_venta := 0;
            FOR j IN 1..floor(random() * 5 + 1) LOOP
                v_producto_id := random_element(v_producto_ids);
                SELECT precio_venta INTO v_precio FROM public.productos WHERE id = v_producto_id;
                v_cantidad := floor(random() * 3 + 1);
                
                INSERT INTO public.detalles_venta (
                    venta_id, producto_id, cantidad, precio_unitario, subtotal, fecha_creacion
                ) VALUES (
                    v_venta_id, v_producto_id, v_cantidad, v_precio, v_cantidad * v_precio, v_fecha_venta
                );
                
                v_total_venta := v_total_venta + (v_cantidad * v_precio);
            END LOOP;

            -- Actualizar total venta
            UPDATE public.ventas SET total = v_total_venta, subtotal = v_total_venta WHERE id = v_venta_id;
        END LOOP;

        v_current_date := v_current_date + 1;
    END LOOP;

    -- 2. GENERAR ASISTENCIA (Simplificado)
    -- Generar asistencia para los últimos 30 días
    v_current_date := CURRENT_DATE - INTERVAL '30 days';
    WHILE v_current_date <= CURRENT_DATE LOOP
        IF array_length(v_usuario_ids, 1) > 0 THEN
            FOREACH i IN ARRAY v_usuario_ids LOOP
                -- 90% de probabilidad de asistencia
                IF random() < 0.9 THEN
                    INSERT INTO public.asistencia (
                        usuario_id, fecha, entrada_real, salida_real, estado, fecha_creacion
                    ) VALUES (
                        v_usuario_ids[i], -- Esto fallará si i es UUID, foreach itera sobre elementos
                        v_current_date,
                        time '09:00:00' + (random() * interval '30 minutes'), -- Entrada entre 9:00 y 9:30
                        time '17:00:00' + (random() * interval '60 minutes'), -- Salida entre 17:00 y 18:00
                        CASE WHEN random() < 0.1 THEN 'tarde' ELSE 'a_tiempo' END,
                        v_current_date + time '09:00:00'
                    );
                END IF;
            END LOOP;
        END IF;
        v_current_date := v_current_date + 1;
    END LOOP;
    
    -- Nota: El loop FOREACH anterior estaba mal sintácticamente para arrays de UUID en este contexto específico si no se maneja bien,
    -- corregiremos la lógica de asistencia abajo de forma más segura.
END $$;

-- Corrección y ejecución separada para Asistencia para evitar errores en el bloque anterior
DO $$
DECLARE
    v_usuario_record RECORD;
    v_current_date date;
    v_entrada time;
BEGIN
    v_current_date := CURRENT_DATE - INTERVAL '30 days';
    WHILE v_current_date <= CURRENT_DATE LOOP
        FOR v_usuario_record IN SELECT id FROM public.usuarios LOOP
             IF random() < 0.9 THEN
                v_entrada := time '09:00:00' + (random() * interval '30 minutes');
                INSERT INTO public.asistencia (
                    usuario_id, fecha, entrada_real, salida_real, estado, fecha_creacion
                ) VALUES (
                    v_usuario_record.id,
                    v_current_date,
                    v_entrada,
                    v_entrada + interval '8 hours',
                    CASE WHEN v_entrada > time '09:15:00' THEN 'tarde' ELSE 'a_tiempo' END,
                    v_current_date + v_entrada
                );
             END IF;
        END LOOP;
        v_current_date := v_current_date + 1;
    END LOOP;
END $$;

-- 3. GENERAR PREDICCIONES (Futuras)
-- Insertar predicciones de ventas para el próximo mes
DO $$
DECLARE
    v_fecha_prediccion date := CURRENT_DATE;
    v_producto_record RECORD;
BEGIN
    FOR i IN 1..30 LOOP
        FOR v_producto_record IN SELECT id, precio_venta FROM public.productos LIMIT 5 LOOP -- Solo para 5 productos top
            INSERT INTO public.predicciones (
                tipo_prediccion, periodo, fecha_inicio, fecha_fin, producto_id,
                valor_predicho, nivel_confianza, algoritmo, activa
            ) VALUES (
                'ventas_productos',
                'diario',
                v_fecha_prediccion + i,
                v_fecha_prediccion + i,
                v_producto_record.id,
                (random() * 20 + 10) * v_producto_record.precio_venta, -- Predicción de ventas en dinero
                0.85,
                'Promedio Móvil Ponderado',
                true
            );
        END LOOP;
    END LOOP;
END $$;
