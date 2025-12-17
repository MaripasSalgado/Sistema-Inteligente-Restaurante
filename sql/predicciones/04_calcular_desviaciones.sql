-- =====================================================
-- CÁLCULO DE DESVIACIONES Y PRECISIÓN DE PREDICCIONES
-- =====================================================
-- Descripción: Actualiza predicciones pasadas con valores reales
--              y calcula las desviaciones para medir precisión
-- Ejecutar: Manualmente o mediante trigger de fin de mes
-- =====================================================

CREATE OR REPLACE FUNCTION actualizar_desviaciones_insumos()
RETURNS INTEGER AS $$
DECLARE
    v_prediccion RECORD;
    v_valor_real NUMERIC;
    v_desviacion NUMERIC;
    v_porcentaje_desviacion NUMERIC;
    v_contador INTEGER := 0;
BEGIN
    -- Buscar predicciones de insumos que ya pasaron y no tienen valor real
    FOR v_prediccion IN
        SELECT
            p.id,
            p.insumo_id,
            p.valor_predicho,
            p.fecha_inicio,
            p.fecha_fin
        FROM predicciones p
        WHERE p.tipo_prediccion = 'demanda_insumos'
          AND p.fecha_fin < CURRENT_DATE
          AND p.valor_real IS NULL
          AND p.insumo_id IS NOT NULL
    LOOP
        -- Calcular consumo real del periodo
        SELECT COALESCE(SUM(mi.cantidad), 0)
        INTO v_valor_real
        FROM movimientos_inventario mi
        INNER JOIN lotes_insumos li ON mi.lote_id = li.id
        WHERE li.insumo_id = v_prediccion.insumo_id
          AND mi.tipo IN ('salida', 'consumo', 'ajuste_salida')
          AND mi.fecha_movimiento >= v_prediccion.fecha_inicio
          AND mi.fecha_movimiento <= v_prediccion.fecha_fin;

        -- Calcular desviación
        v_desviacion := v_valor_real - v_prediccion.valor_predicho;

        -- Calcular porcentaje de desviación
        IF v_prediccion.valor_predicho > 0 THEN
            v_porcentaje_desviacion := (v_desviacion / v_prediccion.valor_predicho) * 100;
        ELSE
            v_porcentaje_desviacion := NULL;
        END IF;

        -- Actualizar predicción con valores reales
        UPDATE predicciones
        SET
            valor_real = v_valor_real,
            desviacion = ROUND(v_desviacion, 2),
            porcentaje_desviacion = ROUND(v_porcentaje_desviacion, 2),
            fecha_modificacion = now()
        WHERE id = v_prediccion.id;

        v_contador := v_contador + 1;
    END LOOP;

    RAISE NOTICE 'Desviaciones de insumos actualizadas: %', v_contador;
    RETURN v_contador;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN: Actualizar Desviaciones de Ventas
-- =====================================================

CREATE OR REPLACE FUNCTION actualizar_desviaciones_ventas()
RETURNS INTEGER AS $$
DECLARE
    v_prediccion RECORD;
    v_valor_real NUMERIC;
    v_desviacion NUMERIC;
    v_porcentaje_desviacion NUMERIC;
    v_contador INTEGER := 0;
BEGIN
    -- Buscar predicciones de ventas que ya pasaron y no tienen valor real
    FOR v_prediccion IN
        SELECT
            p.id,
            p.producto_id,
            p.valor_predicho,
            p.fecha_inicio,
            p.fecha_fin
        FROM predicciones p
        WHERE p.tipo_prediccion = 'ventas_productos'
          AND p.fecha_fin < CURRENT_DATE
          AND p.valor_real IS NULL
          AND p.producto_id IS NOT NULL
    LOOP
        -- Calcular ventas reales del periodo
        SELECT COALESCE(SUM(dv.cantidad * dv.precio_unitario), 0)
        INTO v_valor_real
        FROM detalles_venta dv
        INNER JOIN ventas v ON dv.venta_id = v.id
        WHERE dv.producto_id = v_prediccion.producto_id
          AND v.estado = 'Completada'
          AND v.fecha_venta >= v_prediccion.fecha_inicio
          AND v.fecha_venta <= v_prediccion.fecha_fin;

        -- Calcular desviación
        v_desviacion := v_valor_real - v_prediccion.valor_predicho;

        -- Calcular porcentaje de desviación
        IF v_prediccion.valor_predicho > 0 THEN
            v_porcentaje_desviacion := (v_desviacion / v_prediccion.valor_predicho) * 100;
        ELSE
            v_porcentaje_desviacion := NULL;
        END IF;

        -- Actualizar predicción con valores reales
        UPDATE predicciones
        SET
            valor_real = v_valor_real,
            desviacion = ROUND(v_desviacion, 2),
            porcentaje_desviacion = ROUND(v_porcentaje_desviacion, 2),
            fecha_modificacion = now()
        WHERE id = v_prediccion.id;

        v_contador := v_contador + 1;
    END LOOP;

    RAISE NOTICE 'Desviaciones de ventas actualizadas: %', v_contador;
    RETURN v_contador;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN: Actualizar Desviaciones de Ingresos
-- =====================================================

CREATE OR REPLACE FUNCTION actualizar_desviaciones_ingresos()
RETURNS INTEGER AS $$
DECLARE
    v_prediccion RECORD;
    v_valor_real NUMERIC;
    v_desviacion NUMERIC;
    v_porcentaje_desviacion NUMERIC;
    v_contador INTEGER := 0;
BEGIN
    -- Buscar predicciones de ingresos que ya pasaron y no tienen valor real
    FOR v_prediccion IN
        SELECT
            p.id,
            p.valor_predicho,
            p.fecha_inicio,
            p.fecha_fin
        FROM predicciones p
        WHERE p.tipo_prediccion = 'ingresos'
          AND p.fecha_fin < CURRENT_DATE
          AND p.valor_real IS NULL
    LOOP
        -- Calcular ingresos reales del periodo
        SELECT COALESCE(SUM(total), 0)
        INTO v_valor_real
        FROM ventas
        WHERE estado = 'Completada'
          AND fecha_venta >= v_prediccion.fecha_inicio
          AND fecha_venta <= v_prediccion.fecha_fin;

        -- Calcular desviación
        v_desviacion := v_valor_real - v_prediccion.valor_predicho;

        -- Calcular porcentaje de desviación
        IF v_prediccion.valor_predicho > 0 THEN
            v_porcentaje_desviacion := (v_desviacion / v_prediccion.valor_predicho) * 100;
        ELSE
            v_porcentaje_desviacion := NULL;
        END IF;

        -- Actualizar predicción con valores reales
        UPDATE predicciones
        SET
            valor_real = v_valor_real,
            desviacion = ROUND(v_desviacion, 2),
            porcentaje_desviacion = ROUND(v_porcentaje_desviacion, 2),
            fecha_modificacion = now()
        WHERE id = v_prediccion.id;

        v_contador := v_contador + 1;
    END LOOP;

    RAISE NOTICE 'Desviaciones de ingresos actualizadas: %', v_contador;
    RETURN v_contador;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN MAESTRA: Actualizar Todas las Desviaciones
-- =====================================================

CREATE OR REPLACE FUNCTION actualizar_todas_desviaciones()
RETURNS TABLE(
    tipo VARCHAR,
    actualizadas INTEGER
) AS $$
DECLARE
    v_count_insumos INTEGER;
    v_count_ventas INTEGER;
    v_count_ingresos INTEGER;
BEGIN
    -- Actualizar desviaciones de insumos
    v_count_insumos := actualizar_desviaciones_insumos();

    -- Actualizar desviaciones de ventas
    v_count_ventas := actualizar_desviaciones_ventas();

    -- Actualizar desviaciones de ingresos
    v_count_ingresos := actualizar_desviaciones_ingresos();

    -- Retornar resumen
    RETURN QUERY
    SELECT 'insumos'::VARCHAR, v_count_insumos
    UNION ALL
    SELECT 'ventas'::VARCHAR, v_count_ventas
    UNION ALL
    SELECT 'ingresos'::VARCHAR, v_count_ingresos;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN: Obtener Métricas de Precisión
-- =====================================================
-- Calcula estadísticas de precisión del modelo de predicciones
-- =====================================================

CREATE OR REPLACE FUNCTION obtener_metricas_precision()
RETURNS TABLE(
    tipo_prediccion VARCHAR,
    total_predicciones BIGINT,
    predicciones_evaluadas BIGINT,
    desviacion_promedio NUMERIC,
    desviacion_abs_promedio NUMERIC,
    porcentaje_desviacion_promedio NUMERIC,
    precisión_porcentaje NUMERIC,
    nivel_confianza_promedio NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.tipo_prediccion::VARCHAR,
        COUNT(*)::BIGINT as total,
        COUNT(p.valor_real)::BIGINT as evaluadas,
        ROUND(AVG(p.desviacion), 2) as desv_prom,
        ROUND(AVG(ABS(p.desviacion)), 2) as desv_abs_prom,
        ROUND(AVG(ABS(p.porcentaje_desviacion)), 2) as porc_desv_prom,
        ROUND(100 - AVG(ABS(p.porcentaje_desviacion)), 2) as precision,
        ROUND(AVG(p.nivel_confianza), 2) as conf_prom
    FROM predicciones p
    WHERE p.valor_real IS NOT NULL
    GROUP BY p.tipo_prediccion;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN: Limpiar Predicciones Antiguas
-- =====================================================
-- Elimina predicciones muy antiguas para mantener la BD limpia
-- Mantiene predicciones de los últimos 12 meses
-- =====================================================

CREATE OR REPLACE FUNCTION limpiar_predicciones_antiguas()
RETURNS INTEGER AS $$
DECLARE
    v_eliminadas INTEGER;
BEGIN
    WITH deleted AS (
        DELETE FROM predicciones
        WHERE fecha_fin < CURRENT_DATE - INTERVAL '12 months'
        RETURNING *
    )
    SELECT COUNT(*) INTO v_eliminadas FROM deleted;

    RAISE NOTICE 'Predicciones antiguas eliminadas: %', v_eliminadas;
    RETURN v_eliminadas;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VISTA: Resumen de Desviaciones Recientes
-- =====================================================
-- Vista materializada para consultas rápidas de desviaciones
-- =====================================================

CREATE OR REPLACE VIEW vista_desviaciones_recientes AS
SELECT
    p.tipo_prediccion,
    p.periodo,
    p.fecha_inicio,
    p.fecha_fin,
    COALESCE(i.nombre, prod.nombre) as nombre_item,
    p.valor_predicho,
    p.valor_real,
    p.desviacion,
    p.porcentaje_desviacion,
    p.nivel_confianza,
    p.algoritmo,
    CASE
        WHEN ABS(p.porcentaje_desviacion) <= 10 THEN 'excelente'
        WHEN ABS(p.porcentaje_desviacion) <= 20 THEN 'bueno'
        WHEN ABS(p.porcentaje_desviacion) <= 30 THEN 'aceptable'
        ELSE 'necesita_ajuste'
    END as calificacion_precision
FROM predicciones p
LEFT JOIN insumos i ON p.insumo_id = i.id
LEFT JOIN productos prod ON p.producto_id = prod.id
WHERE p.valor_real IS NOT NULL
  AND p.fecha_fin >= CURRENT_DATE - INTERVAL '6 months'
ORDER BY p.fecha_fin DESC;

-- =====================================================
-- COMENTARIOS
-- =====================================================
-- Para ejecutar manualmente:
-- SELECT * FROM actualizar_todas_desviaciones();
-- SELECT * FROM obtener_metricas_precision();
-- SELECT * FROM vista_desviaciones_recientes;
-- SELECT limpiar_predicciones_antiguas();
-- =====================================================
