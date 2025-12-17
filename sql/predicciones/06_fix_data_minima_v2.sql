-- =====================================================
-- FIX: Permitir predicciones con cualquier cantidad de datos
-- =====================================================
-- Este script modifica las funciones para que funcionen
-- incluso con 1 solo mes de datos históricos
-- =====================================================

-- =====================================================
-- PASO 1: ELIMINAR FUNCIONES EXISTENTES
-- =====================================================

-- Asegura usar el schema público
SET search_path TO public;

-- Elimina cualquier overload previo de las funciones
DO $$
DECLARE
    rec RECORD;
BEGIN
    FOR rec IN
        SELECT oid::regprocedure AS fn
        FROM pg_proc
        WHERE pronamespace = 'public'::regnamespace
          AND proname IN ('calcular_pmp_consumo_insumo',
                          'calcular_desviacion_consumo',
                          'obtener_top_insumos',
                          'calcular_nivel_confianza',
                          'generar_predicciones_insumos')
    LOOP
        EXECUTE format('DROP FUNCTION IF EXISTS %s;', rec.fn);
    END LOOP;
END $$;

-- =====================================================
-- PASO 2: CREAR FUNCIONES ACTUALIZADAS
-- =====================================================

-- 1. FUNCIÓN: Calcular PMP con datos flexibles
CREATE FUNCTION calcular_pmp_consumo_insumo(
    p_insumo_id UUID,
    p_fecha_inicio DATE,
    p_fecha_fin DATE
) RETURNS NUMERIC AS $$
DECLARE
    v_fecha_ref DATE := (
        SELECT COALESCE(MAX(fecha_movimiento)::DATE, CURRENT_DATE)
        FROM movimientos_inventario
    );
    v_consumos NUMERIC[];
    v_pesos NUMERIC[];
    v_pmp NUMERIC := 0;
    v_consumo_mes NUMERIC;
    v_mes_actual DATE;
    i INT;
    v_total_meses INT := 0;
BEGIN
    -- Calcular últimos 3 meses de consumo
    FOR i IN 1..3 LOOP
        v_mes_actual := DATE_TRUNC('month', v_fecha_ref) - (i || ' month')::INTERVAL;

        -- Calcular consumo total del mes (salidas de inventario)
        SELECT COALESCE(SUM(ABS(mi.cantidad)), 0)
        INTO v_consumo_mes
        FROM movimientos_inventario mi
        INNER JOIN lotes_insumos li ON mi.lote_id = li.id
        WHERE li.insumo_id = p_insumo_id
          AND lower(mi.tipo) IN ('salida', 'consumo', 'ajuste_salida')
          AND mi.fecha_movimiento >= DATE_TRUNC('month', v_mes_actual)
          AND mi.fecha_movimiento < DATE_TRUNC('month', v_mes_actual) + INTERVAL '1 month';

        -- Solo agregar si hay consumo
        IF v_consumo_mes > 0 THEN
            v_consumos := array_append(v_consumos, v_consumo_mes);
            v_total_meses := v_total_meses + 1;
        END IF;
    END LOOP;

    -- Si no hay datos, retornar 0
    IF v_total_meses = 0 THEN
        RETURN 0;
    END IF;

    -- Ajustar pesos según cantidad de datos disponibles
    IF v_total_meses = 1 THEN
        v_pesos := ARRAY[1.0]; -- 100% al único mes
    ELSIF v_total_meses = 2 THEN
        v_pesos := ARRAY[0.6, 0.4]; -- 60%, 40%
    ELSE
        v_pesos := ARRAY[0.5, 0.3, 0.2]; -- 50%, 30%, 20%
    END IF;

    -- Calcular promedio móvil ponderado
    FOR i IN 1..v_total_meses LOOP
        v_pmp := v_pmp + (v_consumos[i] * v_pesos[i]);
    END LOOP;

    RETURN v_pmp;
END;
$$ LANGUAGE plpgsql;

-- 2. FUNCIÓN: Calcular desviación con datos flexibles
CREATE FUNCTION calcular_desviacion_consumo(
    p_insumo_id UUID,
    p_fecha_inicio DATE
) RETURNS NUMERIC AS $$
DECLARE
    v_fecha_ref DATE := (
        SELECT COALESCE(MAX(fecha_movimiento)::DATE, CURRENT_DATE)
        FROM movimientos_inventario
    );
    v_consumos NUMERIC[];
    v_promedio NUMERIC;
    v_desviacion NUMERIC := 0;
    v_suma_cuadrados NUMERIC := 0;
    v_n INT := 0;
    v_consumo_mes NUMERIC;
    v_mes_actual DATE;
    i INT;
BEGIN
    -- Recopilar últimos 3 meses (o los que haya)
    FOR i IN 1..3 LOOP
        v_mes_actual := DATE_TRUNC('month', v_fecha_ref) - (i || ' month')::INTERVAL;

        SELECT COALESCE(SUM(ABS(mi.cantidad)), 0)
        INTO v_consumo_mes
        FROM movimientos_inventario mi
        INNER JOIN lotes_insumos li ON mi.lote_id = li.id
        WHERE li.insumo_id = p_insumo_id
          AND lower(mi.tipo) IN ('salida', 'consumo', 'ajuste_salida')
          AND mi.fecha_movimiento >= DATE_TRUNC('month', v_mes_actual)
          AND mi.fecha_movimiento < DATE_TRUNC('month', v_mes_actual) + INTERVAL '1 month';

        -- Solo agregar si hay datos
        IF v_consumo_mes > 0 THEN
            v_consumos := array_append(v_consumos, v_consumo_mes);
            v_n := v_n + 1;
        END IF;
    END LOOP;

    -- Si hay menos de 2 datos, retornar 0 (no se puede calcular desviación)
    IF v_n < 2 THEN
        RETURN 0;
    END IF;

    -- Calcular promedio
    SELECT AVG(val) INTO v_promedio FROM unnest(v_consumos) AS val;

    -- Calcular suma de cuadrados de diferencias
    FOR i IN 1..v_n LOOP
        v_suma_cuadrados := v_suma_cuadrados + POWER(v_consumos[i] - v_promedio, 2);
    END LOOP;

    -- Calcular desviación estándar
    v_desviacion := SQRT(v_suma_cuadrados / v_n);

    RETURN v_desviacion;
END;
$$ LANGUAGE plpgsql;

-- 3. FUNCIÓN: Obtener TOP insumos con datos flexibles
CREATE FUNCTION obtener_top_insumos(p_limite INT DEFAULT 10)
RETURNS TABLE (
    insumo_id UUID,
    total_consumo NUMERIC,
    meses_con_datos INT
) AS $$
DECLARE
    v_rows INT := 0;
    v_fecha_ref DATE := (
        SELECT COALESCE(MAX(mi.fecha_movimiento)::DATE, CURRENT_DATE)
        FROM movimientos_inventario mi
    );
BEGIN
    -- Intento 1: últimos 3 meses
    RETURN QUERY
    SELECT
        li.insumo_id,
        SUM(ABS(mi.cantidad)) as total_consumo,
        COUNT(DISTINCT DATE_TRUNC('month', mi.fecha_movimiento))::INT as meses_con_datos
    FROM movimientos_inventario mi
    INNER JOIN lotes_insumos li ON mi.lote_id = li.id
    WHERE lower(mi.tipo) IN ('salida', 'consumo', 'ajuste_salida')
      AND mi.fecha_movimiento >= v_fecha_ref - INTERVAL '3 months'
    GROUP BY li.insumo_id
    HAVING SUM(ABS(mi.cantidad)) > 0 -- Solo insumos con consumo
    ORDER BY total_consumo DESC
    LIMIT p_limite;

    GET DIAGNOSTICS v_rows = ROW_COUNT;

    -- Intento 2: si no hubo datos recientes, usa últimos 12 meses
    IF v_rows = 0 THEN
        RETURN QUERY
        SELECT
            li.insumo_id,
            SUM(ABS(mi.cantidad)) as total_consumo,
            COUNT(DISTINCT DATE_TRUNC('month', mi.fecha_movimiento))::INT as meses_con_datos
        FROM movimientos_inventario mi
        INNER JOIN lotes_insumos li ON mi.lote_id = li.id
        WHERE lower(mi.tipo) IN ('salida', 'consumo', 'ajuste_salida')
          AND mi.fecha_movimiento >= v_fecha_ref - INTERVAL '12 months'
        GROUP BY li.insumo_id
        HAVING SUM(ABS(mi.cantidad)) > 0
        ORDER BY total_consumo DESC
        LIMIT p_limite;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 4. FUNCIÓN: Calcular nivel de confianza flexible
CREATE FUNCTION calcular_nivel_confianza(
    p_desviacion NUMERIC,
    p_promedio NUMERIC,
    p_meses_datos INT DEFAULT 3
) RETURNS NUMERIC AS $$
DECLARE
    v_coeficiente_variacion NUMERIC;
    v_nivel_confianza NUMERIC;
    v_penalizacion_datos NUMERIC;
BEGIN
    -- Si no hay datos suficientes, retornar baja confianza
    IF p_promedio = 0 OR p_promedio IS NULL THEN
        RETURN 0.50;
    END IF;

    -- Calcular coeficiente de variación (CV = desviación / promedio)
    v_coeficiente_variacion := (p_desviacion / NULLIF(p_promedio, 0)) * 100;

    -- Determinar nivel de confianza base según CV
    IF v_coeficiente_variacion <= 10 THEN
        v_nivel_confianza := 0.95; -- Muy estable
    ELSIF v_coeficiente_variacion <= 20 THEN
        v_nivel_confianza := 0.90; -- Estable
    ELSIF v_coeficiente_variacion <= 30 THEN
        v_nivel_confianza := 0.85; -- Moderado
    ELSIF v_coeficiente_variacion <= 50 THEN
        v_nivel_confianza := 0.75; -- Variable
    ELSE
        v_nivel_confianza := 0.65; -- Muy variable
    END IF;

    -- Aplicar penalización por pocos datos
    IF p_meses_datos = 1 THEN
        v_penalizacion_datos := 0.15; -- Penalizar 15% con solo 1 mes
    ELSIF p_meses_datos = 2 THEN
        v_penalizacion_datos := 0.05; -- Penalizar 5% con solo 2 meses
    ELSE
        v_penalizacion_datos := 0; -- Sin penalización con 3+ meses
    END IF;

    v_nivel_confianza := v_nivel_confianza - v_penalizacion_datos;

    -- Asegurar que esté entre 0.50 y 0.95
    v_nivel_confianza := GREATEST(0.50, LEAST(0.95, v_nivel_confianza));

    RETURN v_nivel_confianza;
END;
$$ LANGUAGE plpgsql;

-- 5. FUNCIÓN: Generar predicciones de insumos
CREATE FUNCTION generar_predicciones_insumos()
RETURNS TABLE (
    insumo_id UUID,
    insumo_nombre TEXT,
    prediccion NUMERIC,
    nivel_confianza NUMERIC,
    meses_datos INT
) AS $$
DECLARE
    v_fecha_ref DATE := (
        SELECT COALESCE(MAX(mi.fecha_movimiento)::DATE, CURRENT_DATE)
        FROM movimientos_inventario mi
    );
    v_fecha_inicio DATE := DATE_TRUNC('month', v_fecha_ref + INTERVAL '1 month');
    v_fecha_fin DATE := (DATE_TRUNC('month', v_fecha_ref + INTERVAL '1 month') + INTERVAL '1 month - 1 day')::DATE;
    v_insumo RECORD;
    v_pmp NUMERIC;
    v_desviacion NUMERIC;
    v_nivel_confianza NUMERIC;
    v_margen_error NUMERIC;
    v_banda_inferior NUMERIC;
    v_banda_superior NUMERIC;
    v_meses_con_datos INT;
BEGIN
    -- Eliminar predicciones futuras existentes para el mismo período
    DELETE FROM predicciones
    WHERE tipo_prediccion = 'demanda_insumos'
      AND periodo = 'mensual'
      AND fecha_inicio = v_fecha_inicio;

    -- Iterar sobre TOP insumos
    FOR v_insumo IN
        SELECT * FROM obtener_top_insumos(10)
    LOOP
        -- Calcular PMP
        v_pmp := calcular_pmp_consumo_insumo(
            v_insumo.insumo_id,
            v_fecha_inicio,
            v_fecha_fin
        );

        -- Solo procesar si hay consumo predicho
        IF v_pmp > 0 THEN
            -- Calcular desviación estándar
            v_desviacion := calcular_desviacion_consumo(
                v_insumo.insumo_id,
                v_fecha_inicio
            );

            -- Calcular nivel de confianza (con penalización por pocos datos)
            v_meses_con_datos := v_insumo.meses_con_datos;
            v_nivel_confianza := calcular_nivel_confianza(
                v_desviacion,
                v_pmp,
                v_meses_con_datos
            );

            -- Calcular margen de error y bandas de confianza
            v_margen_error := 1.96 * v_desviacion; -- 95% confianza
            v_banda_inferior := GREATEST(0, v_pmp - v_margen_error);
            v_banda_superior := v_pmp + v_margen_error;

            -- Insertar predicción
            INSERT INTO predicciones (
                tipo_prediccion,
                periodo,
                fecha_inicio,
                fecha_fin,
                insumo_id,
                valor_predicho,
                nivel_confianza,
                algoritmo,
                parametros
            ) VALUES (
                'demanda_insumos',
                'mensual',
                v_fecha_inicio,
                v_fecha_fin,
                v_insumo.insumo_id,
                v_pmp,
                v_nivel_confianza,
                'Promedio Móvil Ponderado (Flexible)',
                jsonb_build_object(
                    'pesos', CASE v_meses_con_datos
                        WHEN 1 THEN '[1.0]'
                        WHEN 2 THEN '[0.6, 0.4]'
                        ELSE '[0.5, 0.3, 0.2]'
                    END,
                    'meses_historia', v_meses_con_datos,
                    'desviacion_std', v_desviacion,
                    'margen_error', v_margen_error,
                    'banda_inferior', v_banda_inferior,
                    'banda_superior', v_banda_superior
                )
            );

            -- Retornar resultado para logging
            RETURN QUERY
            SELECT
                v_insumo.insumo_id,
                i.nombre::TEXT,
                v_pmp,
                v_nivel_confianza,
                v_meses_con_datos
            FROM insumos i
            WHERE i.id = v_insumo.insumo_id;
        END IF;
    END LOOP;

    RETURN;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PASO 3: VERIFICACIÓN Y PRUEBA
-- =====================================================

SELECT 'Funciones actualizadas correctamente' as mensaje;

-- Probar generación de predicciones
SELECT 'Generando predicciones con datos flexibles...' as mensaje;
SELECT * FROM generar_predicciones_insumos();

-- Ver estado
SELECT * FROM verificar_estado_predicciones();
