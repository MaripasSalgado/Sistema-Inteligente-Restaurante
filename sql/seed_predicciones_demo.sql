-- =============================================
-- SEED DE PREDICCIONES DEMO COMPLETO
-- Genera datos que coinciden con las consultas del frontend
-- Ejecutar independientemente en Supabase
-- =============================================

BEGIN;

-- Limpiar predicciones anteriores
DELETE FROM public.predicciones;

-- =============================================
-- 1. PREDICCIONES MENSUALES DE INSUMOS
-- (Para PrediccionCortoPlazo.vue - getPrediccionesInsumosMensual)
-- =============================================
INSERT INTO public.predicciones (
    tipo_prediccion, periodo, fecha_inicio, fecha_fin, 
    insumo_id, valor_predicho, valor_real, desviacion, porcentaje_desviacion,
    nivel_confianza, algoritmo, parametros, activa
)
SELECT 
    'demanda_insumos',
    'mensual',
    DATE_TRUNC('month', CURRENT_DATE + interval '1 month'),
    (DATE_TRUNC('month', CURRENT_DATE + interval '1 month') + interval '1 month - 1 day')::date,
    i.id,
    -- Cantidad predicha según tipo de insumo
    CASE 
        WHEN i.nombre ILIKE '%carne%' THEN ROUND((45 + random() * 25)::numeric, 1)
        WHEN i.nombre ILIKE '%harina%' THEN ROUND((80 + random() * 40)::numeric, 1)
        WHEN i.nombre ILIKE '%queso%' THEN ROUND((30 + random() * 20)::numeric, 1)
        WHEN i.nombre ILIKE '%aceite%' THEN ROUND((25 + random() * 15)::numeric, 1)
        WHEN i.nombre ILIKE '%pollo%' THEN ROUND((35 + random() * 20)::numeric, 1)
        WHEN i.nombre ILIKE '%cebolla%' THEN ROUND((20 + random() * 15)::numeric, 1)
        WHEN i.nombre ILIKE '%tomate%' THEN ROUND((18 + random() * 12)::numeric, 1)
        WHEN i.nombre ILIKE '%papa%' THEN ROUND((50 + random() * 30)::numeric, 1)
        ELSE ROUND((15 + random() * 15)::numeric, 1)
    END,
    NULL,
    NULL, NULL,
    ROUND((0.85 + random() * 0.10)::numeric, 2),
    'Prophet + Gradient Boosting',
    jsonb_build_object('margen_error', ROUND((2 + random() * 5)::numeric, 1)),
    true
FROM (
    SELECT id, nombre FROM public.insumos 
    WHERE estado = 'Activo'
    ORDER BY random()
    LIMIT 10
) i;

-- =============================================
-- 2. PREDICCIONES MENSUALES DE VENTAS/PRODUCTOS
-- (Para gráficos de ventas de productos)
-- =============================================
INSERT INTO public.predicciones (
    tipo_prediccion, periodo, fecha_inicio, fecha_fin, 
    producto_id, valor_predicho, valor_real, desviacion, porcentaje_desviacion,
    nivel_confianza, algoritmo, parametros, activa
)
SELECT 
    'ventas_productos',
    'mensual',
    DATE_TRUNC('month', CURRENT_DATE + interval '1 month'),
    (DATE_TRUNC('month', CURRENT_DATE + interval '1 month') + interval '1 month - 1 day')::date,
    p.id,
    -- Unidades predichas
    ROUND((80 + random() * 150)::numeric, 0),
    NULL,
    NULL, NULL,
    ROUND((0.88 + random() * 0.08)::numeric, 2),
    'Ensemble (RF + XGB)',
    jsonb_build_object(
        'margen_error', ROUND((5 + random() * 10)::numeric, 0),
        'banda_superior', ROUND((90 + random() * 160)::numeric, 0),
        'banda_inferior', ROUND((60 + random() * 120)::numeric, 0)
    ),
    true
FROM (
    SELECT id FROM public.productos 
    WHERE activo = true
    ORDER BY ventas_registradas DESC NULLS LAST
    LIMIT 8
) p;

-- =============================================
-- 3. PREDICCIÓN MENSUAL DE INGRESOS TOTALES
-- (Para getPrediccionIngresos)
-- =============================================
INSERT INTO public.predicciones (
    tipo_prediccion, periodo, fecha_inicio, fecha_fin, 
    valor_predicho, valor_real, desviacion, porcentaje_desviacion,
    nivel_confianza, algoritmo, parametros, activa
)
VALUES
-- Próximo mes
(
    'ingresos',
    'mensual',
    DATE_TRUNC('month', CURRENT_DATE + interval '1 month'),
    (DATE_TRUNC('month', CURRENT_DATE + interval '1 month') + interval '1 month - 1 day')::date,
    ROUND((4500000 + random() * 1500000)::numeric, 0),
    NULL,
    NULL, NULL,
    0.91,
    'ARIMA + XGBoost + LSTM',
    jsonb_build_object(
        'banda_superior', ROUND((5200000 + random() * 1000000)::numeric, 0),
        'banda_inferior', ROUND((3800000 + random() * 800000)::numeric, 0)
    ),
    true
),
-- Mes actual (con valor real parcial)
(
    'ingresos',
    'mensual',
    DATE_TRUNC('month', CURRENT_DATE),
    (DATE_TRUNC('month', CURRENT_DATE) + interval '1 month - 1 day')::date,
    ROUND((4200000 + random() * 1200000)::numeric, 0),
    ROUND((3800000 + random() * 1400000)::numeric, 0),
    NULL, NULL,
    0.89,
    'ARIMA + XGBoost + LSTM',
    jsonb_build_object(
        'banda_superior', ROUND((4800000 + random() * 800000)::numeric, 0),
        'banda_inferior', ROUND((3500000 + random() * 700000)::numeric, 0)
    ),
    true
);

-- =============================================
-- 4. HISTORIAL DE INGRESOS (últimos 6 meses)
-- (Para tendencias históricas)
-- =============================================
INSERT INTO public.predicciones (
    tipo_prediccion, periodo, fecha_inicio, fecha_fin, 
    valor_predicho, valor_real, desviacion, porcentaje_desviacion,
    nivel_confianza, algoritmo, activa
)
SELECT 
    'ingresos',
    'mensual',
    DATE_TRUNC('month', CURRENT_DATE - (n || ' months')::interval),
    (DATE_TRUNC('month', CURRENT_DATE - (n || ' months')::interval) + interval '1 month - 1 day')::date,
    ROUND((3500000 + random() * 2000000)::numeric, 0) as predicho,
    ROUND((3300000 + random() * 2200000)::numeric, 0) as real_val,
    NULL, NULL,
    ROUND((0.85 + random() * 0.10)::numeric, 2),
    'ARIMA + XGBoost',
    true
FROM generate_series(1, 6) n;

-- Actualizar desviaciones para datos con valor_real
UPDATE public.predicciones
SET 
    desviacion = ABS(valor_real - valor_predicho),
    porcentaje_desviacion = ROUND((ABS(valor_real - valor_predicho) / NULLIF(valor_predicho, 0) * 100)::numeric, 2)
WHERE valor_real IS NOT NULL;

-- =============================================
-- 5. HISTORIAL DE DEMANDA INSUMOS (para comparativas)
-- =============================================
INSERT INTO public.predicciones (
    tipo_prediccion, periodo, fecha_inicio, fecha_fin, 
    insumo_id, valor_predicho, valor_real, desviacion, porcentaje_desviacion,
    nivel_confianza, algoritmo, activa
)
SELECT 
    'demanda_insumos',
    'mensual',
    DATE_TRUNC('month', CURRENT_DATE),
    (DATE_TRUNC('month', CURRENT_DATE) + interval '1 month - 1 day')::date,
    i.id,
    ROUND((20 + random() * 30)::numeric, 1) as predicho,
    ROUND((18 + random() * 35)::numeric, 1) as real_val,
    NULL, NULL,
    ROUND((0.82 + random() * 0.12)::numeric, 2),
    'Prophet + ML',
    true
FROM (
    SELECT id FROM public.insumos 
    WHERE estado = 'Activo'
    ORDER BY random()
    LIMIT 8
) i;

-- Actualizar desviaciones de insumos
UPDATE public.predicciones
SET 
    desviacion = ABS(valor_real - valor_predicho),
    porcentaje_desviacion = ROUND((ABS(valor_real - valor_predicho) / NULLIF(valor_predicho, 0) * 100)::numeric, 2)
WHERE valor_real IS NOT NULL AND tipo_prediccion = 'demanda_insumos';

-- =============================================
-- 6. PREDICCIONES SEMANALES (Corto plazo)
-- =============================================
INSERT INTO public.predicciones (
    tipo_prediccion, periodo, fecha_inicio, fecha_fin, 
    insumo_id, valor_predicho, nivel_confianza, algoritmo, activa
)
SELECT 
    'demanda_insumos',
    'semanal',
    DATE_TRUNC('week', CURRENT_DATE) + ((n) * 7 || ' days')::interval,
    DATE_TRUNC('week', CURRENT_DATE) + ((n+1) * 7 - 1 || ' days')::interval,
    i.id,
    ROUND((8 + random() * 15)::numeric, 1),
    ROUND((0.88 + random() * 0.08)::numeric, 2),
    'LSTM + Attention',
    true
FROM generate_series(0, 3) n
CROSS JOIN (
    SELECT id FROM public.insumos 
    WHERE estado = 'Activo'
    ORDER BY random()
    LIMIT 6
) i;

COMMIT;

-- =============================================
-- CREAR VISTA PARA DESVIACIONES (si no existe)
-- =============================================
DO $$
BEGIN
    -- Drop if exists and recreate
    DROP VIEW IF EXISTS public.vista_desviaciones_recientes;
    
    CREATE VIEW public.vista_desviaciones_recientes AS
    SELECT 
        p.id,
        p.tipo_prediccion,
        p.periodo,
        p.fecha_inicio,
        p.fecha_fin,
        COALESCE(i.nombre, pr.nombre, 'Ingresos Totales') as nombre_item,
        COALESCE(i.unidad_medida, 'CRC') as unidad,
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
    WHERE p.valor_real IS NOT NULL
    ORDER BY p.fecha_fin DESC;
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'No se pudo crear la vista, posiblemente por permisos';
END $$;

-- =============================================
-- RESUMEN
-- =============================================
-- ✅ 10 predicciones mensuales de insumos (próximo mes)
-- ✅ 8 predicciones mensuales de productos
-- ✅ 2 predicciones de ingresos (mes actual y próximo)
-- ✅ 6 predicciones históricas de ingresos
-- ✅ 8 predicciones de demanda de insumos con valores reales
-- ✅ 24 predicciones semanales de insumos
-- ✅ Vista de desviaciones creada
