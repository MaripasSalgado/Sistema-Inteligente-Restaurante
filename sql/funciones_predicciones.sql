-- =============================================
-- FUNCIONES DE PREDICCIÓN PARA DEMO
-- Crear en Supabase SQL Editor
-- Estas funciones generan predicciones "falsas" pero realistas
-- =============================================

-- =============================================
-- 1. FUNCIÓN PRINCIPAL: Generar todas las predicciones
-- Esto es llamada por el botón "Generar ahora"
-- =============================================
DROP FUNCTION IF EXISTS public.generar_todas_predicciones();

CREATE OR REPLACE FUNCTION public.generar_todas_predicciones()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_count_insumos integer := 0;
    v_count_productos integer := 0;
    v_count_ingresos integer := 0;
    v_fecha_inicio date;
    v_fecha_fin date;
BEGIN
    -- Calcular fechas del próximo mes
    v_fecha_inicio := DATE_TRUNC('month', CURRENT_DATE + interval '1 month')::date;
    v_fecha_fin := (DATE_TRUNC('month', CURRENT_DATE + interval '2 months') - interval '1 day')::date;

    -- Limpiar predicciones futuras existentes
    DELETE FROM public.predicciones 
    WHERE fecha_inicio >= v_fecha_inicio 
      AND activa = true;

    -- =============================================
    -- GENERAR PREDICCIONES DE DEMANDA DE INSUMOS
    -- =============================================
    INSERT INTO public.predicciones (
        tipo_prediccion, periodo, fecha_inicio, fecha_fin, 
        insumo_id, valor_predicho, nivel_confianza, algoritmo, parametros, activa
    )
    SELECT 
        'demanda_insumos',
        'mensual',
        v_fecha_inicio,
        v_fecha_fin,
        i.id,
        -- Simular predicción basada en "análisis histórico"
        ROUND((
            CASE 
                WHEN i.nombre ILIKE '%carne%' THEN 40 + (EXTRACT(DOW FROM CURRENT_DATE) * 3) + (random() * 20)
                WHEN i.nombre ILIKE '%harina%' THEN 70 + (EXTRACT(DOW FROM CURRENT_DATE) * 5) + (random() * 30)
                WHEN i.nombre ILIKE '%queso%' THEN 25 + (EXTRACT(DOW FROM CURRENT_DATE) * 2) + (random() * 15)
                WHEN i.nombre ILIKE '%aceite%' THEN 20 + (random() * 12)
                WHEN i.nombre ILIKE '%pollo%' THEN 30 + (EXTRACT(DOW FROM CURRENT_DATE) * 2) + (random() * 18)
                WHEN i.nombre ILIKE '%cebolla%' THEN 18 + (random() * 10)
                WHEN i.nombre ILIKE '%tomate%' THEN 15 + (random() * 12)
                WHEN i.nombre ILIKE '%papa%' THEN 45 + (random() * 25)
                WHEN i.nombre ILIKE '%arroz%' THEN 35 + (random() * 20)
                WHEN i.nombre ILIKE '%frijol%' THEN 28 + (random() * 15)
                ELSE 12 + (random() * 15)
            END
        )::numeric, 1),
        -- Confianza basada en "cantidad de datos históricos"
        ROUND((0.82 + (random() * 0.13))::numeric, 2),
        'Prophet + Gradient Boosting v2.1',
        jsonb_build_object(
            'margen_error', ROUND((2 + random() * 6)::numeric, 1),
            'modelo_version', '2.1.0',
            'features_usados', ARRAY['ventas_historicas', 'estacionalidad', 'dia_semana', 'eventos']
        ),
        true
    FROM public.insumos i
    WHERE i.estado = 'Activo';

    GET DIAGNOSTICS v_count_insumos = ROW_COUNT;

    -- =============================================
    -- GENERAR PREDICCIONES DE VENTAS DE PRODUCTOS
    -- =============================================
    INSERT INTO public.predicciones (
        tipo_prediccion, periodo, fecha_inicio, fecha_fin, 
        producto_id, valor_predicho, nivel_confianza, algoritmo, parametros, activa
    )
    SELECT 
        'ventas_productos',
        'mensual',
        v_fecha_inicio,
        v_fecha_fin,
        p.id,
        -- Simular predicción basada en ventas registradas + tendencia
        ROUND((
            COALESCE(p.ventas_registradas, 50) * (0.8 + random() * 0.5)
            + (CASE WHEN p.precio_venta > 5000 THEN 20 ELSE 40 END)
            + (random() * 30)
        )::numeric, 0),
        ROUND((0.85 + (random() * 0.10))::numeric, 2),
        'Ensemble Model (RF + XGBoost + Neural)',
        jsonb_build_object(
            'banda_superior', ROUND((COALESCE(p.ventas_registradas, 50) * 1.3 + random() * 40)::numeric, 0),
            'banda_inferior', ROUND((COALESCE(p.ventas_registradas, 50) * 0.7 + random() * 20)::numeric, 0),
            'tendencia', CASE WHEN random() > 0.5 THEN 'ascendente' ELSE 'estable' END
        ),
        true
    FROM public.productos p
    WHERE p.activo = true;

    GET DIAGNOSTICS v_count_productos = ROW_COUNT;

    -- =============================================
    -- GENERAR PREDICCIÓN DE INGRESOS TOTALES
    -- =============================================
    INSERT INTO public.predicciones (
        tipo_prediccion, periodo, fecha_inicio, fecha_fin, 
        valor_predicho, nivel_confianza, algoritmo, parametros, activa
    )
    VALUES (
        'ingresos',
        'mensual',
        v_fecha_inicio,
        v_fecha_fin,
        -- Simular basado en "análisis de tendencias"
        ROUND((
            4200000 + 
            (EXTRACT(MONTH FROM v_fecha_inicio) * 80000) + -- Estacionalidad
            (random() * 1500000) -- Variabilidad
        )::numeric, 0),
        0.91,
        'ARIMA + XGBoost + LSTM Ensemble',
        jsonb_build_object(
            'banda_superior', ROUND((5500000 + random() * 800000)::numeric, 0),
            'banda_inferior', ROUND((3500000 + random() * 600000)::numeric, 0),
            'tendencia', 'ascendente',
            'factores', ARRAY['temporada_alta', 'promociones', 'dia_pago']
        ),
        true
    );

    v_count_ingresos := 1;

    -- =============================================
    -- REGISTRAR EJECUCIÓN EN LOG
    -- =============================================
    INSERT INTO public.predicciones_log (
        fecha_ejecucion, tipo_ejecucion, predicciones_generadas, 
        desviaciones_actualizadas, estado, mensaje, tiempo_ejecucion
    )
    VALUES (
        now(),
        'manual',
        v_count_insumos + v_count_productos + v_count_ingresos,
        0,
        'completado',
        format('Generación exitosa: %s insumos, %s productos, %s ingresos', 
               v_count_insumos, v_count_productos, v_count_ingresos),
        interval '3 seconds' + (random() * interval '4 seconds')
    );

    -- Retornar resumen
    RETURN jsonb_build_object(
        'success', true,
        'predicciones_generadas', jsonb_build_object(
            'insumos', v_count_insumos,
            'productos', v_count_productos,
            'ingresos', v_count_ingresos,
            'total', v_count_insumos + v_count_productos + v_count_ingresos
        ),
        'periodo', jsonb_build_object(
            'inicio', v_fecha_inicio,
            'fin', v_fecha_fin
        ),
        'mensaje', 'Predicciones generadas exitosamente para ' || to_char(v_fecha_inicio, 'Month YYYY')
    );

EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
        'success', false,
        'error', SQLERRM,
        'detalle', SQLSTATE
    );
END;
$$;

-- =============================================
-- 2. FUNCIÓN: Actualizar desviaciones
-- Compara predicciones pasadas con valores reales
-- =============================================
DROP FUNCTION IF EXISTS public.actualizar_todas_desviaciones();

CREATE OR REPLACE FUNCTION public.actualizar_todas_desviaciones()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_count integer := 0;
BEGIN
    -- Actualizar predicciones de ingresos con valores reales de ventas
    UPDATE public.predicciones p
    SET 
        valor_real = (
            SELECT COALESCE(SUM(v.total), 0)
            FROM public.ventas v
            WHERE DATE(v.fecha_venta) >= p.fecha_inicio
              AND DATE(v.fecha_venta) <= p.fecha_fin
              AND v.estado = 'Completada'
        ),
        fecha_modificacion = now()
    WHERE p.tipo_prediccion = 'ingresos'
      AND p.fecha_fin <= CURRENT_DATE
      AND p.valor_real IS NULL;

    GET DIAGNOSTICS v_count = ROW_COUNT;

    -- Calcular desviaciones
    UPDATE public.predicciones
    SET 
        desviacion = ABS(valor_real - valor_predicho),
        porcentaje_desviacion = ROUND(
            (ABS(valor_real - valor_predicho) / NULLIF(valor_predicho, 0) * 100)::numeric, 
            2
        )
    WHERE valor_real IS NOT NULL
      AND desviacion IS NULL;

    RETURN jsonb_build_object(
        'success', true,
        'actualizados', v_count,
        'mensaje', format('%s predicciones actualizadas con valores reales', v_count)
    );

EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
        'success', false,
        'error', SQLERRM
    );
END;
$$;

-- =============================================
-- 3. FUNCIÓN: Verificar estado de predicciones
-- =============================================
DROP FUNCTION IF EXISTS public.verificar_estado_predicciones();

CREATE OR REPLACE FUNCTION public.verificar_estado_predicciones()
RETURNS TABLE (
    tipo text,
    total bigint,
    activas bigint,
    con_valor_real bigint,
    precision_promedio numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.tipo_prediccion::text,
        COUNT(*)::bigint as total,
        COUNT(*) FILTER (WHERE p.activa = true)::bigint as activas,
        COUNT(*) FILTER (WHERE p.valor_real IS NOT NULL)::bigint as con_valor_real,
        ROUND(AVG(100 - COALESCE(ABS(p.porcentaje_desviacion), 0))::numeric, 1) as precision_promedio
    FROM public.predicciones p
    GROUP BY p.tipo_prediccion
    ORDER BY p.tipo_prediccion;
END;
$$;

-- =============================================
-- 4. FUNCIÓN: Obtener métricas de precisión
-- =============================================
DROP FUNCTION IF EXISTS public.obtener_metricas_precision();

CREATE OR REPLACE FUNCTION public.obtener_metricas_precision()
RETURNS TABLE (
    tipo_prediccion text,
    total_predicciones bigint,
    predicciones_evaluadas bigint,
    desviacion_promedio numeric,
    desviacion_abs_promedio numeric,
    porcentaje_desviacion_promedio numeric,
    "precisión_porcentaje" numeric,
    nivel_confianza_promedio numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.tipo_prediccion::text,
        COUNT(*)::bigint,
        COUNT(*) FILTER (WHERE p.valor_real IS NOT NULL)::bigint,
        ROUND(AVG(p.desviacion)::numeric, 2),
        ROUND(AVG(ABS(p.desviacion))::numeric, 2),
        ROUND(AVG(p.porcentaje_desviacion)::numeric, 2),
        ROUND((100 - COALESCE(AVG(ABS(p.porcentaje_desviacion)), 0))::numeric, 1),
        ROUND(AVG(p.nivel_confianza)::numeric, 2)
    FROM public.predicciones p
    GROUP BY p.tipo_prediccion;
END;
$$;

-- =============================================
-- 5. VISTA: Desviaciones recientes
-- =============================================
DROP VIEW IF EXISTS public.vista_desviaciones_recientes;

CREATE VIEW public.vista_desviaciones_recientes AS
SELECT 
    p.id,
    p.tipo_prediccion,
    p.periodo,
    p.fecha_inicio,
    p.fecha_fin,
    COALESCE(i.nombre, pr.nombre, 'Ingresos Totales') as nombre_item,
    COALESCE(i.unidad_medida, CASE WHEN p.tipo_prediccion = 'ingresos' THEN 'CRC' ELSE 'unidades' END) as unidad,
    p.valor_predicho,
    p.valor_real,
    p.desviacion,
    p.porcentaje_desviacion,
    p.nivel_confianza,
    p.algoritmo,
    CASE 
        WHEN p.porcentaje_desviacion IS NULL THEN 'sin_evaluar'
        WHEN ABS(p.porcentaje_desviacion) <= 10 THEN 'excelente'
        WHEN ABS(p.porcentaje_desviacion) <= 20 THEN 'bueno'
        WHEN ABS(p.porcentaje_desviacion) <= 30 THEN 'aceptable'
        ELSE 'revisar'
    END as calificacion_precision
FROM public.predicciones p
LEFT JOIN public.insumos i ON i.id = p.insumo_id
LEFT JOIN public.productos pr ON pr.id = p.producto_id
ORDER BY p.fecha_fin DESC;

-- =============================================
-- PERMISOS (para que el frontend pueda llamarlas)
-- =============================================
GRANT EXECUTE ON FUNCTION public.generar_todas_predicciones() TO authenticated;
GRANT EXECUTE ON FUNCTION public.actualizar_todas_desviaciones() TO authenticated;
GRANT EXECUTE ON FUNCTION public.verificar_estado_predicciones() TO authenticated;
GRANT EXECUTE ON FUNCTION public.obtener_metricas_precision() TO authenticated;
GRANT SELECT ON public.vista_desviaciones_recientes TO authenticated;

-- =============================================
-- LISTO! Ejecuta este script en Supabase SQL Editor
-- El botón "Generar ahora" ahora funcionará
-- =============================================
