-- =====================================================
-- GENERACIÓN DE PREDICCIONES DE DEMANDA DE INSUMOS
-- =====================================================
-- Descripción: Genera predicciones mensuales de consumo de insumos
-- Ejecutar: Manualmente o mediante trigger de fin de mes
-- =====================================================

CREATE OR REPLACE FUNCTION generar_predicciones_insumos()
RETURNS INTEGER AS $$
DECLARE
    v_insumo RECORD;
    v_prediccion NUMERIC;
    v_desviacion NUMERIC;
    v_confianza NUMERIC;
    v_margen_error NUMERIC;
    v_fecha_inicio DATE;
    v_fecha_fin DATE;
    v_contador INTEGER := 0;
    v_meses_historia INTEGER := 3;
BEGIN
    -- Calcular fechas del próximo mes
    v_fecha_inicio := date_trunc('month', CURRENT_DATE + INTERVAL '1 month')::DATE;
    v_fecha_fin := (date_trunc('month', CURRENT_DATE + INTERVAL '2 months') - INTERVAL '1 day')::DATE;

    -- Eliminar predicciones antiguas del mes próximo (por si se re-ejecuta)
    DELETE FROM predicciones
    WHERE tipo_prediccion = 'demanda_insumos'
      AND fecha_inicio = v_fecha_inicio
      AND fecha_fin = v_fecha_fin;

    -- Obtener TOP 10 insumos más consumidos
    FOR v_insumo IN
        SELECT * FROM obtener_top_insumos(10, v_meses_historia)
    LOOP
        -- Calcular predicción usando Promedio Móvil Ponderado
        v_prediccion := calcular_pmp_consumo_insumo(v_insumo.insumo_id, v_meses_historia);

        -- Calcular desviación estándar
        v_desviacion := calcular_desviacion_consumo(v_insumo.insumo_id, v_meses_historia);

        -- Calcular nivel de confianza
        v_confianza := calcular_nivel_confianza(v_desviacion, v_prediccion);

        -- Calcular margen de error (±1.96 * desviación para 95% confianza)
        v_margen_error := ROUND(1.96 * v_desviacion, 2);

        -- Insertar predicción solo si hay suficiente historial
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
                'demanda_insumos',
                'mensual',
                v_fecha_inicio,
                v_fecha_fin,
                v_insumo.insumo_id,
                NULL,
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
                    'desviacion_std', v_desviacion
                ),
                true,
                now()
            );

            v_contador := v_contador + 1;
        END IF;
    END LOOP;

    RAISE NOTICE 'Predicciones de insumos generadas: %', v_contador;
    RETURN v_contador;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN ALTERNATIVA: Predicción Semanal (opcional)
-- =====================================================
-- Esta función genera predicciones SEMANALES en lugar de mensuales
-- Útil si se necesita mayor granularidad en el corto plazo
-- =====================================================

CREATE OR REPLACE FUNCTION generar_predicciones_insumos_semanal()
RETURNS INTEGER AS $$
DECLARE
    v_insumo RECORD;
    v_prediccion NUMERIC;
    v_desviacion NUMERIC;
    v_confianza NUMERIC;
    v_fecha_inicio DATE;
    v_fecha_fin DATE;
    v_contador INTEGER := 0;
    v_semanas_historia INTEGER := 4;
    v_consumo_semanal NUMERIC;
BEGIN
    -- Calcular fechas de la próxima semana (lunes a domingo)
    v_fecha_inicio := date_trunc('week', CURRENT_DATE + INTERVAL '1 week')::DATE;
    v_fecha_fin := (v_fecha_inicio + INTERVAL '6 days')::DATE;

    -- Eliminar predicciones antiguas de la próxima semana
    DELETE FROM predicciones
    WHERE tipo_prediccion = 'demanda_insumos'
      AND periodo = 'semanal'
      AND fecha_inicio = v_fecha_inicio;

    -- Obtener TOP 10 insumos
    FOR v_insumo IN
        SELECT * FROM obtener_top_insumos(10, 1) -- Último mes
    LOOP
        -- Calcular consumo promedio semanal de las últimas 4 semanas
        SELECT COALESCE(AVG(consumo_semana), 0)
        INTO v_consumo_semanal
        FROM (
            SELECT
                date_trunc('week', mi.fecha_movimiento) as semana,
                SUM(mi.cantidad) as consumo_semana
            FROM movimientos_inventario mi
            INNER JOIN lotes_insumos li ON mi.lote_id = li.id
            WHERE li.insumo_id = v_insumo.insumo_id
              AND mi.tipo IN ('salida', 'consumo', 'ajuste_salida')
              AND mi.fecha_movimiento >= CURRENT_DATE - INTERVAL '4 weeks'
            GROUP BY date_trunc('week', mi.fecha_movimiento)
            ORDER BY semana DESC
            LIMIT v_semanas_historia
        ) semanas;

        -- Calcular desviación
        SELECT COALESCE(STDDEV(consumo_semana), 0)
        INTO v_desviacion
        FROM (
            SELECT
                date_trunc('week', mi.fecha_movimiento) as semana,
                SUM(mi.cantidad) as consumo_semana
            FROM movimientos_inventario mi
            INNER JOIN lotes_insumos li ON mi.lote_id = li.id
            WHERE li.insumo_id = v_insumo.insumo_id
              AND mi.tipo IN ('salida', 'consumo', 'ajuste_salida')
              AND mi.fecha_movimiento >= CURRENT_DATE - INTERVAL '4 weeks'
            GROUP BY date_trunc('week', mi.fecha_movimiento)
        ) semanas;

        v_confianza := calcular_nivel_confianza(v_desviacion, v_consumo_semanal);

        IF v_consumo_semanal > 0 THEN
            INSERT INTO predicciones (
                tipo_prediccion,
                periodo,
                fecha_inicio,
                fecha_fin,
                insumo_id,
                valor_predicho,
                nivel_confianza,
                algoritmo,
                parametros,
                activa
            ) VALUES (
                'demanda_insumos',
                'semanal',
                v_fecha_inicio,
                v_fecha_fin,
                v_insumo.insumo_id,
                ROUND(v_consumo_semanal, 2),
                v_confianza,
                'Promedio Móvil Semanal',
                jsonb_build_object(
                    'semanas_historia', v_semanas_historia,
                    'desviacion_std', v_desviacion
                ),
                true
            );

            v_contador := v_contador + 1;
        END IF;
    END LOOP;

    RAISE NOTICE 'Predicciones semanales de insumos generadas: %', v_contador;
    RETURN v_contador;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMENTARIOS
-- =====================================================
-- Para ejecutar manualmente:
-- SELECT generar_predicciones_insumos();
-- SELECT generar_predicciones_insumos_semanal();
-- =====================================================
