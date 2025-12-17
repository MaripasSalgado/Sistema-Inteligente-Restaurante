-- =====================================================
-- SCRIPT DE INSTALACIÓN COMPLETA
-- Sistema de Predicciones
-- =====================================================
-- Este script ejecuta TODOS los archivos en orden
-- Copia y pega TODO este contenido en Supabase SQL Editor
-- =====================================================

-- =====================================================
-- PASO 1: FUNCIONES AUXILIARES
-- =====================================================

\echo '========================================='
\echo 'PASO 1/5: Creando funciones auxiliares...'
\echo '========================================='

\i 01_funciones_prediccion.sql

-- =====================================================
-- PASO 2: PREDICCIÓN DE INSUMOS
-- =====================================================

\echo '========================================='
\echo 'PASO 2/5: Creando funciones de predicción de insumos...'
\echo '========================================='

\i 02_prediccion_demanda_insumos.sql

-- =====================================================
-- PASO 3: PREDICCIÓN DE VENTAS
-- =====================================================

\echo '========================================='
\echo 'PASO 3/5: Creando funciones de predicción de ventas...'
\echo '========================================='

\i 03_prediccion_ventas_productos.sql

-- =====================================================
-- PASO 4: CÁLCULO DE DESVIACIONES
-- =====================================================

\echo '========================================='
\echo 'PASO 4/5: Creando funciones de desviaciones...'
\echo '========================================='

\i 04_calcular_desviaciones.sql

-- =====================================================
-- PASO 5: TRIGGER Y LOGGING
-- =====================================================

\echo '========================================='
\echo 'PASO 5/5: Creando sistema de ejecución automática...'
\echo '========================================='

\i 05_trigger_automatico.sql

-- =====================================================
-- GENERACIÓN INICIAL DE PREDICCIONES
-- =====================================================

\echo ''
\echo '========================================='
\echo 'INSTALACIÓN COMPLETADA'
\echo '========================================='
\echo ''
\echo 'Generando predicciones iniciales...'
\echo ''

SELECT * FROM generar_todas_predicciones();

\echo ''
\echo '========================================='
\echo 'VERIFICACIÓN FINAL'
\echo '========================================='
\echo ''

SELECT * FROM verificar_estado_predicciones();

\echo ''
\echo '✅ Sistema de Predicciones instalado correctamente'
\echo ''
\echo 'Próximos pasos:'
\echo '1. Revisa las predicciones generadas en la tabla predicciones'
\echo '2. Ve al frontend /predicciones para ver los gráficos'
\echo '3. Programa la ejecución automática mensual'
\echo ''
\echo 'Comandos útiles:'
\echo '- SELECT * FROM generar_todas_predicciones();  -- Generar predicciones'
\echo '- SELECT * FROM actualizar_todas_desviaciones();  -- Actualizar desviaciones'
\echo '- SELECT * FROM obtener_metricas_precision();  -- Ver precisión del modelo'
\echo ''
