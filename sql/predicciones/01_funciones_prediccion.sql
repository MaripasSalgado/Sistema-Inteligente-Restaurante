-- =====================================================
-- FUNCIONES AUXILIARES PARA SISTEMA DE PREDICCIONES
-- =====================================================
-- Autor: Sistema Inteligente para Restaurante
-- Descripción: Funciones reutilizables para cálculos de predicciones
-- =====================================================

-- =====================================================
-- 1. Calcular Promedio Móvil Ponderado de Consumo de Insumos
-- =====================================================
CREATE OR REPLACE FUNCTION calcular_pmp_consumo_insumo(
    p_insumo_id UUID,
    p_meses_historia INTEGER DEFAULT 3
) RETURNS NUMERIC AS $$
DECLARE
    v_consumos NUMERIC[];
    v_pesos NUMERIC[] := ARRAY[0.5, 0.3, 0.2]; -- Pesos: más reciente tiene más peso
    v_pmp NUMERIC := 0;
    v_mes_actual DATE;
    v_consumo_mes NUMERIC;
    i INTEGER;
BEGIN
    -- Obtener consumos de los últimos N meses
    FOR i IN 1..p_meses_historia LOOP
        v_mes_actual := date_trunc('month', CURRENT_DATE - (i || ' months')::INTERVAL)::DATE;

        -- Calcular consumo total del mes (salidas de inventario)
        SELECT COALESCE(SUM(mi.cantidad), 0)
        INTO v_consumo_mes
        FROM movimientos_inventario mi
        INNER JOIN lotes_insumos li ON mi.lote_id = li.id
        WHERE li.insumo_id = p_insumo_id
          AND mi.tipo IN ('salida', 'consumo', 'ajuste_salida')
          AND date_trunc('month', mi.fecha_movimiento) = v_mes_actual;

        v_consumos := array_append(v_consumos, v_consumo_mes);
    END LOOP;

    -- Calcular promedio ponderado
    FOR i IN 1..LEAST(array_length(v_consumos, 1), array_length(v_pesos, 1)) LOOP
        v_pmp := v_pmp + (v_consumos[i] * v_pesos[i]);
    END LOOP;

    RETURN ROUND(v_pmp, 2);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 2. Calcular Desviación Estándar de Consumo
-- =====================================================
CREATE OR REPLACE FUNCTION calcular_desviacion_consumo(
    p_insumo_id UUID,
    p_meses_historia INTEGER DEFAULT 3
) RETURNS NUMERIC AS $$
DECLARE
    v_desviacion NUMERIC;
BEGIN
    WITH consumos_mensuales AS (
        SELECT
            date_trunc('month', mi.fecha_movimiento) as mes,
            SUM(mi.cantidad) as consumo_total
        FROM movimientos_inventario mi
        INNER JOIN lotes_insumos li ON mi.lote_id = li.id
        WHERE li.insumo_id = p_insumo_id
          AND mi.tipo IN ('salida', 'consumo', 'ajuste_salida')
          AND mi.fecha_movimiento >= CURRENT_DATE - (p_meses_historia || ' months')::INTERVAL
        GROUP BY date_trunc('month', mi.fecha_movimiento)
    )
    SELECT COALESCE(STDDEV(consumo_total), 0)
    INTO v_desviacion
    FROM consumos_mensuales;

    RETURN ROUND(v_desviacion, 2);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 3. Calcular Nivel de Confianza
-- =====================================================
CREATE OR REPLACE FUNCTION calcular_nivel_confianza(
    p_desviacion NUMERIC,
    p_promedio NUMERIC
) RETURNS NUMERIC AS $$
DECLARE
    v_coeficiente_variacion NUMERIC;
    v_confianza NUMERIC;
BEGIN
    -- Si no hay promedio, confianza baja
    IF p_promedio = 0 OR p_promedio IS NULL THEN
        RETURN 0.5;
    END IF;

    -- Calcular coeficiente de variación (CV = desviación / promedio)
    v_coeficiente_variacion := p_desviacion / p_promedio;

    -- Mapear CV a nivel de confianza (0 a 1)
    -- CV bajo = alta confianza, CV alto = baja confianza
    CASE
        WHEN v_coeficiente_variacion <= 0.1 THEN v_confianza := 0.95;  -- Muy estable
        WHEN v_coeficiente_variacion <= 0.2 THEN v_confianza := 0.90;  -- Estable
        WHEN v_coeficiente_variacion <= 0.3 THEN v_confianza := 0.85;  -- Moderado
        WHEN v_coeficiente_variacion <= 0.5 THEN v_confianza := 0.75;  -- Variable
        ELSE v_confianza := 0.65;  -- Muy variable
    END CASE;

    RETURN v_confianza;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 4. Calcular Promedio Móvil Ponderado de Ventas de Productos
-- =====================================================
CREATE OR REPLACE FUNCTION calcular_pmp_ventas_producto(
    p_producto_id UUID,
    p_meses_historia INTEGER DEFAULT 3
) RETURNS NUMERIC AS $$
DECLARE
    v_ventas NUMERIC[];
    v_pesos NUMERIC[] := ARRAY[0.5, 0.3, 0.2];
    v_pmp NUMERIC := 0;
    v_mes_actual DATE;
    v_ventas_mes NUMERIC;
    i INTEGER;
BEGIN
    -- Obtener ventas de los últimos N meses
    FOR i IN 1..p_meses_historia LOOP
        v_mes_actual := date_trunc('month', CURRENT_DATE - (i || ' months')::INTERVAL)::DATE;

        -- Calcular total de ventas del producto en el mes
        SELECT COALESCE(SUM(dv.cantidad * dv.precio_unitario), 0)
        INTO v_ventas_mes
        FROM detalles_venta dv
        INNER JOIN ventas v ON dv.venta_id = v.id
        WHERE dv.producto_id = p_producto_id
          AND v.estado = 'Completada'
          AND date_trunc('month', v.fecha_venta) = v_mes_actual;

        v_ventas := array_append(v_ventas, v_ventas_mes);
    END LOOP;

    -- Calcular promedio ponderado
    FOR i IN 1..LEAST(array_length(v_ventas, 1), array_length(v_pesos, 1)) LOOP
        v_pmp := v_pmp + (v_ventas[i] * v_pesos[i]);
    END LOOP;

    RETURN ROUND(v_pmp, 2);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 5. Calcular Desviación Estándar de Ventas
-- =====================================================
CREATE OR REPLACE FUNCTION calcular_desviacion_ventas(
    p_producto_id UUID,
    p_meses_historia INTEGER DEFAULT 3
) RETURNS NUMERIC AS $$
DECLARE
    v_desviacion NUMERIC;
BEGIN
    WITH ventas_mensuales AS (
        SELECT
            date_trunc('month', v.fecha_venta) as mes,
            SUM(dv.cantidad * dv.precio_unitario) as total_ventas
        FROM detalles_venta dv
        INNER JOIN ventas v ON dv.venta_id = v.id
        WHERE dv.producto_id = p_producto_id
          AND v.estado = 'Completada'
          AND v.fecha_venta >= CURRENT_DATE - (p_meses_historia || ' months')::INTERVAL
        GROUP BY date_trunc('month', v.fecha_venta)
    )
    SELECT COALESCE(STDDEV(total_ventas), 0)
    INTO v_desviacion
    FROM ventas_mensuales;

    RETURN ROUND(v_desviacion, 2);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 6. Obtener TOP N insumos más consumidos
-- =====================================================
CREATE OR REPLACE FUNCTION obtener_top_insumos(
    p_limite INTEGER DEFAULT 10,
    p_meses_historia INTEGER DEFAULT 3
) RETURNS TABLE(insumo_id UUID, nombre VARCHAR, consumo_total NUMERIC) AS $$
BEGIN
    RETURN QUERY
    SELECT
        i.id,
        i.nombre,
        SUM(mi.cantidad) as total_consumo
    FROM insumos i
    INNER JOIN lotes_insumos li ON i.id = li.insumo_id
    INNER JOIN movimientos_inventario mi ON li.id = mi.lote_id
    WHERE mi.tipo IN ('salida', 'consumo', 'ajuste_salida')
      AND mi.fecha_movimiento >= CURRENT_DATE - (p_meses_historia || ' months')::INTERVAL
    GROUP BY i.id, i.nombre
    HAVING SUM(mi.cantidad) > 0
    ORDER BY total_consumo DESC
    LIMIT p_limite;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 7. Obtener TOP N productos más vendidos
-- =====================================================
CREATE OR REPLACE FUNCTION obtener_top_productos(
    p_limite INTEGER DEFAULT 8,
    p_meses_historia INTEGER DEFAULT 3
) RETURNS TABLE(producto_id UUID, nombre TEXT, total_vendido NUMERIC) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.nombre,
        SUM(dv.cantidad * dv.precio_unitario) as total
    FROM productos p
    INNER JOIN detalles_venta dv ON p.id = dv.producto_id
    INNER JOIN ventas v ON dv.venta_id = v.id
    WHERE v.estado = 'Completada'
      AND v.fecha_venta >= CURRENT_DATE - (p_meses_historia || ' months')::INTERVAL
    GROUP BY p.id, p.nombre
    HAVING SUM(dv.cantidad * dv.precio_unitario) > 0
    ORDER BY total DESC
    LIMIT p_limite;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMENTARIOS FINALES
-- =====================================================
-- Estas funciones son la base del sistema de predicciones.
-- Se ejecutan desde los scripts 02, 03 y 04.
-- =====================================================
