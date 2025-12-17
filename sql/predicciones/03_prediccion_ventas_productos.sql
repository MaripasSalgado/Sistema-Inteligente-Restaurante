-- =====================================================
-- GENERACIÓN DE PREDICCIONES DE VENTAS DE PRODUCTOS
-- =====================================================
-- Descripción: Genera predicciones mensuales de ventas de productos
-- Ejecutar: Manualmente o mediante trigger de fin de mes
-- =====================================================

CREATE OR REPLACE FUNCTION generar_predicciones_ventas()
RETURNS INTEGER AS $$
DECLARE
    v_producto RECORD;
    v_prediccion NUMERIC;
    v_desviacion NUMERIC;
    v_confianza NUMERIC;
    v_margen_error NUMERIC;
    v_banda_superior NUMERIC;
    v_banda_inferior NUMERIC;
    v_fecha_inicio DATE;
    v_fecha_fin DATE;
    v_contador INTEGER := 0;
    v_meses_historia INTEGER := 3;
BEGIN
    -- Calcular fechas del próximo mes
    v_fecha_inicio := date_trunc('month', CURRENT_DATE + INTERVAL '1 month')::DATE;
    v_fecha_fin := (date_trunc('month', CURRENT_DATE + INTERVAL '2 months') - INTERVAL '1 day')::DATE;

    -- Eliminar predicciones antiguas del mes próximo
    DELETE FROM predicciones
    WHERE tipo_prediccion = 'ventas_productos'
      AND fecha_inicio = v_fecha_inicio
      AND fecha_fin = v_fecha_fin;

    -- Obtener TOP 8 productos más vendidos
    FOR v_producto IN
        SELECT * FROM obtener_top_productos(8, v_meses_historia)
    LOOP
        -- Calcular predicción usando Promedio Móvil Ponderado
        v_prediccion := calcular_pmp_ventas_producto(v_producto.producto_id, v_meses_historia);

        -- Calcular desviación estándar
        v_desviacion := calcular_desviacion_ventas(v_producto.producto_id, v_meses_historia);

        -- Calcular nivel de confianza
        v_confianza := calcular_nivel_confianza(v_desviacion, v_prediccion);

        -- Calcular margen de error y bandas de confianza
        v_margen_error := ROUND(1.96 * v_desviacion, 2);
        v_banda_superior := ROUND(v_prediccion + v_margen_error, 2);
        v_banda_inferior := ROUND(GREATEST(0, v_prediccion - v_margen_error), 2); -- No puede ser negativo

        -- Insertar predicción
        IF v_prediccion > 0 THEN
            INSERT INTO predicciones (
                tipo_prediccion,
                periodo,
                fecha_inicio,
                fecha_fin,
                insumo_id,
                producto_id,
                valor_predicho,
                valor_real,
                desviacion,
                porcentaje_desviacion,
                nivel_confianza,
                algoritmo,
                parametros,
                activa,
                fecha_creacion
            ) VALUES (
                'ventas_productos',
                'mensual',
                v_fecha_inicio,
                v_fecha_fin,
                NULL,
                v_producto.producto_id,
                v_prediccion,
                NULL,
                NULL,
                NULL,
                v_confianza,
                'Promedio Móvil Ponderado',
                jsonb_build_object(
                    'pesos', ARRAY[0.5, 0.3, 0.2],
                    'meses_historia', v_meses_historia,
                    'margen_error', v_margen_error,
                    'banda_superior', v_banda_superior,
                    'banda_inferior', v_banda_inferior,
                    'desviacion_std', v_desviacion
                ),
                true,
                now()
            );

            v_contador := v_contador + 1;
        END IF;
    END LOOP;

    RAISE NOTICE 'Predicciones de ventas generadas: %', v_contador;
    RETURN v_contador;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN: Predicción de Ingresos Totales Mensuales
-- =====================================================
-- Predice el ingreso total del restaurante para el próximo mes
-- =====================================================

CREATE OR REPLACE FUNCTION generar_prediccion_ingresos()
RETURNS INTEGER AS $$
DECLARE
    v_prediccion NUMERIC;
    v_desviacion NUMERIC;
    v_confianza NUMERIC;
    v_margen_error NUMERIC;
    v_fecha_inicio DATE;
    v_fecha_fin DATE;
    v_meses_historia INTEGER := 6;
    v_ingresos_mensuales NUMERIC[];
    v_pesos NUMERIC[] := ARRAY[0.3, 0.25, 0.2, 0.15, 0.1];
    v_ingreso_mes NUMERIC;
    v_mes_actual DATE;
    i INTEGER;
BEGIN
    -- Calcular fechas del próximo mes
    v_fecha_inicio := date_trunc('month', CURRENT_DATE + INTERVAL '1 month')::DATE;
    v_fecha_fin := (date_trunc('month', CURRENT_DATE + INTERVAL '2 months') - INTERVAL '1 day')::DATE;

    -- Eliminar predicción antigua de ingresos
    DELETE FROM predicciones
    WHERE tipo_prediccion = 'ingresos'
      AND fecha_inicio = v_fecha_inicio
      AND fecha_fin = v_fecha_fin;

    -- Obtener ingresos de los últimos 5 meses
    FOR i IN 1..5 LOOP
        v_mes_actual := date_trunc('month', CURRENT_DATE - (i || ' months')::INTERVAL)::DATE;

        SELECT COALESCE(SUM(total), 0)
        INTO v_ingreso_mes
        FROM ventas
        WHERE estado = 'Completada'
          AND date_trunc('month', fecha_venta) = v_mes_actual;

        v_ingresos_mensuales := array_append(v_ingresos_mensuales, v_ingreso_mes);
    END LOOP;

    -- Calcular promedio ponderado
    v_prediccion := 0;
    FOR i IN 1..LEAST(array_length(v_ingresos_mensuales, 1), array_length(v_pesos, 1)) LOOP
        v_prediccion := v_prediccion + (v_ingresos_mensuales[i] * v_pesos[i]);
    END LOOP;

    -- Calcular desviación estándar de ingresos mensuales
    WITH ingresos_hist AS (
        SELECT
            date_trunc('month', fecha_venta) as mes,
            SUM(total) as ingreso_total
        FROM ventas
        WHERE estado = 'Completada'
          AND fecha_venta >= CURRENT_DATE - (v_meses_historia || ' months')::INTERVAL
        GROUP BY date_trunc('month', fecha_venta)
    )
    SELECT COALESCE(STDDEV(ingreso_total), 0)
    INTO v_desviacion
    FROM ingresos_hist;

    -- Calcular nivel de confianza
    v_confianza := calcular_nivel_confianza(v_desviacion, v_prediccion);
    v_margen_error := ROUND(1.96 * v_desviacion, 2);

    -- Insertar predicción de ingresos
    IF v_prediccion > 0 THEN
        INSERT INTO predicciones (
            tipo_prediccion,
            periodo,
            fecha_inicio,
            fecha_fin,
            insumo_id,
            producto_id,
            valor_predicho,
            valor_real,
            desviacion,
            porcentaje_desviacion,
            nivel_confianza,
            algoritmo,
            parametros,
            activa,
            fecha_creacion
        ) VALUES (
            'ingresos',
            'mensual',
            v_fecha_inicio,
            v_fecha_fin,
            NULL,
            NULL,
            ROUND(v_prediccion, 2),
            NULL,
            NULL,
            NULL,
            v_confianza,
            'Promedio Móvil Ponderado',
            jsonb_build_object(
                'pesos', v_pesos,
                'meses_historia', v_meses_historia,
                'margen_error', v_margen_error,
                'desviacion_std', v_desviacion,
                'banda_superior', ROUND(v_prediccion + v_margen_error, 2),
                'banda_inferior', ROUND(GREATEST(0, v_prediccion - v_margen_error), 2)
            ),
            true,
            now()
        );

        RAISE NOTICE 'Predicción de ingresos generada: %', ROUND(v_prediccion, 2);
        RETURN 1;
    END IF;

    RETURN 0;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN: Generar Predicciones Anuales (12 meses)
-- =====================================================
-- Genera predicciones para cada mes del próximo año
-- Útil para planificación a largo plazo
-- =====================================================

CREATE OR REPLACE FUNCTION generar_predicciones_anuales()
RETURNS INTEGER AS $$
DECLARE
    v_contador INTEGER := 0;
    v_mes_offset INTEGER;
    v_fecha_inicio DATE;
    v_fecha_fin DATE;
    v_prediccion NUMERIC;
    v_factor_estacional NUMERIC;
BEGIN
    -- Generar predicciones para los próximos 12 meses
    FOR v_mes_offset IN 1..12 LOOP
        v_fecha_inicio := date_trunc('month', CURRENT_DATE + (v_mes_offset || ' months')::INTERVAL)::DATE;
        v_fecha_fin := (date_trunc('month', CURRENT_DATE + ((v_mes_offset + 1) || ' months')::INTERVAL) - INTERVAL '1 day')::DATE;

        -- Calcular predicción base (promedio del mismo mes en años anteriores)
        SELECT COALESCE(AVG(total_mes), 0)
        INTO v_prediccion
        FROM (
            SELECT
                EXTRACT(MONTH FROM fecha_venta) as mes,
                SUM(total) as total_mes
            FROM ventas
            WHERE estado = 'Completada'
              AND EXTRACT(MONTH FROM fecha_venta) = EXTRACT(MONTH FROM v_fecha_inicio)
              AND fecha_venta >= CURRENT_DATE - INTERVAL '2 years'
            GROUP BY EXTRACT(MONTH FROM fecha_venta), EXTRACT(YEAR FROM fecha_venta)
        ) historico;

        -- Factor estacional (ajuste simple: diciembre +20%, febrero -10%, etc.)
        v_factor_estacional := 1.0;
        CASE EXTRACT(MONTH FROM v_fecha_inicio)
            WHEN 12 THEN v_factor_estacional := 1.20; -- Diciembre: temporada alta
            WHEN 11 THEN v_factor_estacional := 1.10; -- Noviembre
            WHEN 2 THEN v_factor_estacional := 0.90;  -- Febrero: temporada baja
            WHEN 3 THEN v_factor_estacional := 0.95;  -- Marzo
            ELSE v_factor_estacional := 1.0;
        END CASE;

        v_prediccion := ROUND(v_prediccion * v_factor_estacional, 2);

        IF v_prediccion > 0 THEN
            INSERT INTO predicciones (
                tipo_prediccion,
                periodo,
                fecha_inicio,
                fecha_fin,
                valor_predicho,
                nivel_confianza,
                algoritmo,
                parametros,
                activa
            ) VALUES (
                'ingresos',
                'mensual',
                v_fecha_inicio,
                v_fecha_fin,
                v_prediccion,
                0.80,
                'Promedio Histórico con Estacionalidad',
                jsonb_build_object(
                    'factor_estacional', v_factor_estacional,
                    'años_historia', 2
                ),
                true
            );

            v_contador := v_contador + 1;
        END IF;
    END LOOP;

    RAISE NOTICE 'Predicciones anuales generadas: %', v_contador;
    RETURN v_contador;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMENTARIOS
-- =====================================================
-- Para ejecutar manualmente:
-- SELECT generar_predicciones_ventas();
-- SELECT generar_prediccion_ingresos();
-- SELECT generar_predicciones_anuales();
-- =====================================================
