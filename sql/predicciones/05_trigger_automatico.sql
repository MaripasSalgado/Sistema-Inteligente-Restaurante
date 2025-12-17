-- =====================================================
-- SISTEMA DE EJECUCIÓN AUTOMÁTICA DE PREDICCIONES
-- =====================================================
-- Descripción: Función maestra que ejecuta todas las predicciones
--              y cálculos de desviaciones automáticamente
-- =====================================================

-- =====================================================
-- FUNCIÓN MAESTRA: Generar Todas las Predicciones
-- =====================================================
-- Esta función ejecuta TODAS las predicciones en un solo llamado
-- Se puede ejecutar manualmente o programar con pg_cron
-- =====================================================

CREATE OR REPLACE FUNCTION generar_todas_predicciones()
RETURNS TABLE(
    proceso VARCHAR,
    registros_generados INTEGER,
    estado VARCHAR,
    mensaje TEXT
) AS $$
DECLARE
    v_count INTEGER;
    v_total INTEGER := 0;
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'INICIANDO GENERACIÓN DE PREDICCIONES';
    RAISE NOTICE '========================================';

    -- 1. Actualizar desviaciones de predicciones pasadas PRIMERO
    BEGIN
        RAISE NOTICE 'Paso 1: Actualizando desviaciones...';

        v_count := actualizar_desviaciones_insumos();
        RETURN QUERY SELECT 'Desviaciones Insumos'::VARCHAR, v_count, 'OK'::VARCHAR,
                           format('Actualizadas %s predicciones de insumos', v_count);
        v_total := v_total + v_count;

        v_count := actualizar_desviaciones_ventas();
        RETURN QUERY SELECT 'Desviaciones Ventas'::VARCHAR, v_count, 'OK'::VARCHAR,
                           format('Actualizadas %s predicciones de ventas', v_count);
        v_total := v_total + v_count;

        v_count := actualizar_desviaciones_ingresos();
        RETURN QUERY SELECT 'Desviaciones Ingresos'::VARCHAR, v_count, 'OK'::VARCHAR,
                           format('Actualizadas %s predicciones de ingresos', v_count);
        v_total := v_total + v_count;

    EXCEPTION WHEN OTHERS THEN
        RETURN QUERY SELECT 'Desviaciones'::VARCHAR, 0, 'ERROR'::VARCHAR,
                           format('Error: %s', SQLERRM);
    END;

    -- 2. Generar predicciones de insumos
    BEGIN
        RAISE NOTICE 'Paso 2: Generando predicciones de insumos...';
        v_count := generar_predicciones_insumos();
        RETURN QUERY SELECT 'Predicciones Insumos'::VARCHAR, v_count, 'OK'::VARCHAR,
                           format('Generadas %s predicciones de demanda', v_count);
        v_total := v_total + v_count;
    EXCEPTION WHEN OTHERS THEN
        RETURN QUERY SELECT 'Predicciones Insumos'::VARCHAR, 0, 'ERROR'::VARCHAR,
                           format('Error: %s', SQLERRM);
    END;

    -- 3. Generar predicciones de ventas de productos
    BEGIN
        RAISE NOTICE 'Paso 3: Generando predicciones de ventas...';
        v_count := generar_predicciones_ventas();
        RETURN QUERY SELECT 'Predicciones Ventas'::VARCHAR, v_count, 'OK'::VARCHAR,
                           format('Generadas %s predicciones de ventas', v_count);
        v_total := v_total + v_count;
    EXCEPTION WHEN OTHERS THEN
        RETURN QUERY SELECT 'Predicciones Ventas'::VARCHAR, 0, 'ERROR'::VARCHAR,
                           format('Error: %s', SQLERRM);
    END;

    -- 4. Generar predicción de ingresos totales
    BEGIN
        RAISE NOTICE 'Paso 4: Generando predicción de ingresos...';
        v_count := generar_prediccion_ingresos();
        RETURN QUERY SELECT 'Predicción Ingresos'::VARCHAR, v_count, 'OK'::VARCHAR,
                           format('Generada predicción de ingresos mensuales', v_count);
        v_total := v_total + v_count;
    EXCEPTION WHEN OTHERS THEN
        RETURN QUERY SELECT 'Predicción Ingresos'::VARCHAR, 0, 'ERROR'::VARCHAR,
                           format('Error: %s', SQLERRM);
    END;

    -- 5. Limpiar predicciones muy antiguas (opcional)
    BEGIN
        RAISE NOTICE 'Paso 5: Limpiando predicciones antiguas...';
        v_count := limpiar_predicciones_antiguas();
        RETURN QUERY SELECT 'Limpieza'::VARCHAR, v_count, 'OK'::VARCHAR,
                           format('Eliminadas %s predicciones antiguas', v_count);
    EXCEPTION WHEN OTHERS THEN
        RETURN QUERY SELECT 'Limpieza'::VARCHAR, 0, 'WARNING'::VARCHAR,
                           format('Error en limpieza: %s', SQLERRM);
    END;

    -- Resumen final
    RAISE NOTICE '========================================';
    RAISE NOTICE 'PROCESO COMPLETADO - Total registros: %', v_total;
    RAISE NOTICE '========================================';

    RETURN QUERY SELECT 'RESUMEN TOTAL'::VARCHAR, v_total, 'COMPLETADO'::VARCHAR,
                       format('Proceso finalizado exitosamente. Total: %s registros', v_total);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN: Generar Solo Predicciones (sin desviaciones)
-- =====================================================
-- Versión simplificada que solo genera predicciones nuevas
-- =====================================================

CREATE OR REPLACE FUNCTION generar_solo_predicciones()
RETURNS INTEGER AS $$
DECLARE
    v_total INTEGER := 0;
    v_count INTEGER;
BEGIN
    -- Generar predicciones de insumos
    v_count := generar_predicciones_insumos();
    RAISE NOTICE 'Predicciones de insumos: %', v_count;
    v_total := v_total + v_count;

    -- Generar predicciones de ventas
    v_count := generar_predicciones_ventas();
    RAISE NOTICE 'Predicciones de ventas: %', v_count;
    v_total := v_total + v_count;

    -- Generar predicción de ingresos
    v_count := generar_prediccion_ingresos();
    RAISE NOTICE 'Predicción de ingresos: %', v_count;
    v_total := v_total + v_count;

    RAISE NOTICE 'Total predicciones generadas: %', v_total;
    RETURN v_total;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- CONFIGURACIÓN CON PG_CRON (Si está disponible)
-- =====================================================
-- pg_cron es una extensión de PostgreSQL para tareas programadas
-- Solo funciona si Supabase tiene habilitada esta extensión
-- =====================================================

-- Verificar si pg_cron está disponible
-- SELECT * FROM pg_available_extensions WHERE name = 'pg_cron';

-- Si está disponible, habilitar:
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Programar ejecución automática el último día de cada mes a las 23:59
-- NOTA: Esto requiere permisos de superusuario en Supabase
/*
SELECT cron.schedule(
    'generar_predicciones_mensuales',    -- Nombre del job
    '59 23 L * *',                        -- Cron: último día del mes a las 23:59
    $$ SELECT generar_todas_predicciones(); $$
);
*/

-- Alternativa: Ejecutar todos los domingos a las 23:59 (predicciones semanales)
/*
SELECT cron.schedule(
    'generar_predicciones_semanales',
    '59 23 * * 0',                        -- Domingos a las 23:59
    $$ SELECT generar_predicciones_insumos_semanal(); $$
);
*/

-- Ver jobs programados
-- SELECT * FROM cron.job;

-- Eliminar un job
-- SELECT cron.unschedule('generar_predicciones_mensuales');

-- =====================================================
-- ALTERNATIVA SIN PG_CRON: Ejecutar desde Frontend
-- =====================================================
-- Si pg_cron no está disponible, se puede ejecutar desde:
-- 1. Frontend con botón manual
-- 2. API externa que llame a la función vía Supabase Client
-- 3. GitHub Actions con schedule
-- 4. Servicio cron externo (cron-job.org)
-- =====================================================

-- Ejemplo de llamada desde JavaScript/TypeScript:
/*
// En el frontend o backend Node.js
import { supabase } from './supabase'

async function ejecutarPredicciones() {
  const { data, error } = await supabase.rpc('generar_todas_predicciones')

  if (error) {
    console.error('Error generando predicciones:', error)
  } else {
    console.log('Predicciones generadas:', data)
  }
}

// Ejecutar manualmente
ejecutarPredicciones()

// O programar con cron en Node.js
import cron from 'node-cron'
cron.schedule('59 23 L * *', () => {
  ejecutarPredicciones()
})
*/

-- =====================================================
-- FUNCIÓN: Verificar Estado de Predicciones
-- =====================================================
-- Útil para monitorear el sistema y ver si hay predicciones activas
-- =====================================================

CREATE OR REPLACE FUNCTION verificar_estado_predicciones()
RETURNS TABLE(
    tipo VARCHAR,
    periodo VARCHAR,
    mes_predicho TEXT,
    total_predicciones BIGINT,
    con_valores_reales BIGINT,
    pendientes BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.tipo_prediccion::VARCHAR,
        p.periodo::VARCHAR,
        to_char(p.fecha_inicio, 'YYYY-MM') as mes,
        COUNT(*)::BIGINT as total,
        COUNT(p.valor_real)::BIGINT as con_real,
        COUNT(*) FILTER (WHERE p.valor_real IS NULL)::BIGINT as pendientes
    FROM predicciones p
    WHERE p.fecha_inicio >= CURRENT_DATE - INTERVAL '3 months'
    GROUP BY p.tipo_prediccion, p.periodo, to_char(p.fecha_inicio, 'YYYY-MM')
    ORDER BY mes DESC, p.tipo_prediccion;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TABLA DE LOG (Opcional pero recomendado)
-- =====================================================
-- Guarda un historial de ejecuciones del sistema de predicciones
-- =====================================================

CREATE TABLE IF NOT EXISTS predicciones_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fecha_ejecucion TIMESTAMP WITH TIME ZONE DEFAULT now(),
    tipo_ejecucion VARCHAR NOT NULL, -- 'automatica' o 'manual'
    predicciones_generadas INTEGER DEFAULT 0,
    desviaciones_actualizadas INTEGER DEFAULT 0,
    estado VARCHAR NOT NULL, -- 'exito', 'error', 'parcial'
    mensaje TEXT,
    tiempo_ejecucion INTERVAL,
    ejecutado_por UUID REFERENCES usuarios(id)
);

-- Función con logging
CREATE OR REPLACE FUNCTION generar_todas_predicciones_con_log(p_ejecutado_por UUID DEFAULT NULL)
RETURNS UUID AS $$
DECLARE
    v_log_id UUID;
    v_inicio TIMESTAMP;
    v_fin TIMESTAMP;
    v_total INTEGER := 0;
    v_estado VARCHAR := 'exito';
    v_mensaje TEXT := '';
BEGIN
    v_inicio := clock_timestamp();
    v_log_id := gen_random_uuid();

    -- Ejecutar predicciones
    BEGIN
        v_total := generar_solo_predicciones();
        v_mensaje := format('Proceso completado. %s predicciones generadas.', v_total);
    EXCEPTION WHEN OTHERS THEN
        v_estado := 'error';
        v_mensaje := format('Error: %s', SQLERRM);
    END;

    v_fin := clock_timestamp();

    -- Guardar log
    INSERT INTO predicciones_log (
        id, fecha_ejecucion, tipo_ejecucion, predicciones_generadas,
        estado, mensaje, tiempo_ejecucion, ejecutado_por
    ) VALUES (
        v_log_id, v_inicio, 'manual', v_total,
        v_estado, v_mensaje, v_fin - v_inicio, p_ejecutado_por
    );

    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- INSTRUCCIONES DE USO
-- =====================================================
/*
EJECUCIÓN MANUAL (recomendado para empezar):
----------------------------------------
1. Ejecutar todos los scripts en orden:
   - 01_funciones_prediccion.sql
   - 02_prediccion_demanda_insumos.sql
   - 03_prediccion_ventas_productos.sql
   - 04_calcular_desviaciones.sql
   - 05_trigger_automatico.sql (este archivo)

2. Generar predicciones manualmente:
   SELECT * FROM generar_todas_predicciones();

3. Ver resultados:
   SELECT * FROM predicciones WHERE fecha_inicio >= CURRENT_DATE ORDER BY tipo_prediccion;

4. Verificar estado:
   SELECT * FROM verificar_estado_predicciones();

5. Ver métricas de precisión:
   SELECT * FROM obtener_metricas_precision();

PROGRAMACIÓN AUTOMÁTICA:
----------------------------------------
Opción 1 - pg_cron (si está disponible en Supabase):
   SELECT cron.schedule('predicciones_mensuales', '59 23 L * *',
          'SELECT generar_todas_predicciones()');

Opción 2 - Desde Frontend:
   Crear un botón en el dashboard que llame a supabase.rpc('generar_todas_predicciones')

Opción 3 - API Externa:
   Configurar un cron job externo que llame a la función vía HTTP

MONITOREO:
----------------------------------------
Ver predicciones recientes:
   SELECT * FROM predicciones
   WHERE fecha_creacion >= CURRENT_DATE - INTERVAL '7 days'
   ORDER BY fecha_creacion DESC;

Ver desviaciones:
   SELECT * FROM vista_desviaciones_recientes LIMIT 20;

Ver logs (si se usa la tabla):
   SELECT * FROM predicciones_log ORDER BY fecha_ejecucion DESC LIMIT 10;
*/
-- =====================================================
