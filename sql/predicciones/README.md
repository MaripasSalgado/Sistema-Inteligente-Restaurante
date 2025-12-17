# Sistema de Predicciones - Instrucciones de Uso

## 📋 Descripción
Sistema completo de predicciones mensuales para demanda de insumos, ventas de productos e ingresos del restaurante.

## 🚀 Instalación y Configuración

### Paso 0: (Opcional) Verifica llaves foráneas
Si Supabase no reconoce relaciones entre `predicciones` e `insumos` / `productos`, ejecuta `00_fix_foreign_keys.sql` primero. Si ya existen las llaves, sáltalo para evitar errores por nombres duplicados.

### Paso 1: Ejecutar Scripts SQL en Supabase

Ejecuta en orden en el **SQL Editor de Supabase**:

1. **[01_funciones_prediccion.sql](./01_funciones_prediccion.sql)**
   - Crea funciones auxiliares para cálculos
   - Ejecuta primero

2. **[02_prediccion_demanda_insumos.sql](./02_prediccion_demanda_insumos.sql)**
   - Crea funciones para predecir demanda de insumos
   - Ejecuta segundo

3. **[03_prediccion_ventas_productos.sql](./03_prediccion_ventas_productos.sql)**
   - Crea funciones para predecir ventas e ingresos
   - Ejecuta tercero

4. **[04_calcular_desviaciones.sql](./04_calcular_desviaciones.sql)**
   - Crea funciones para calcular desviaciones y precisión
   - Ejecuta cuarto

5. **[05_trigger_automatico.sql](./05_trigger_automatico.sql)**
   - Crea función maestra y sistema de logging
   - Ejecuta al final

6. **[06_fix_data_minima_v2.sql](./06_fix_data_minima_v2.sql)**
   - Actualiza funciones para trabajar con 1-3+ meses de datos (ajuste automático de pesos y confianza)
   - Incluye `DROP FUNCTION IF EXISTS` para evitar el error de ambigüedad de funciones
   - Ejecuta al final (reemplaza las funciones anteriores sin tocar las tablas)

> Tip: si quieres correr todo de una sola vez y luego aplicar el fix de datos mínimos, puedes ejecutar `00_EJECUTAR_TODO.sql` y, al terminar, ejecutar `06_fix_data_minima_v2.sql`.

### Paso 2: Generar Primera Ronda de Predicciones

Una vez ejecutados todos los scripts, genera las primeras predicciones manualmente:

```sql
-- En el SQL Editor de Supabase, ejecuta:
SELECT * FROM generar_todas_predicciones();
```

Si acabas de ejecutar `06_fix_data_minima_v2.sql`, ya incluye una llamada de prueba a `generar_predicciones_insumos()`, pero igual ejecuta `generar_todas_predicciones()` para dejar ventas/ingresos actualizados.

Esto generará:
- ✅ Predicciones de demanda de insumos para el próximo mes (ahora funcionan con 1 mes de historial)
- ✅ Predicciones de ventas de productos
- ✅ Predicción de ingresos totales

### Paso 3: Verificar Resultados

```sql
-- Ver predicciones generadas
SELECT
  tipo_prediccion,
  periodo,
  fecha_inicio,
  fecha_fin,
  COUNT(*) as total
FROM predicciones
WHERE fecha_inicio >= CURRENT_DATE
GROUP BY tipo_prediccion, periodo, fecha_inicio, fecha_fin;

-- Ver estado detallado
SELECT * FROM verificar_estado_predicciones();
```

## 📊 Uso del Frontend

El frontend ya está conectado. Los componentes Vue se cargarán automáticamente las predicciones:

- **PrediccionCortoPlazo.vue**: Muestra predicción mensual de TOP 10 insumos
- **PrediccionLargoPlazo.vue**: Gráfico de tendencias de ingresos
- **TablaDesviaciones.vue**: Tabla de desviaciones (precisión del modelo)
- **AnalisisDesviaciones.vue**: Gráfico de barras comparativo (estimado vs real)

## 🔄 Ejecución Periódica

### Opción A: Manual (Recomendado para empezar)

Ejecuta cada fin de mes:

```sql
SELECT * FROM generar_todas_predicciones();
```

### Opción B: Automática con pg_cron (Si está disponible)

```sql
-- Verificar si pg_cron está disponible
SELECT * FROM pg_available_extensions WHERE name = 'pg_cron';

-- Si está disponible, habilitar
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Programar ejecución automática (último día del mes a las 23:59)
SELECT cron.schedule(
  'generar_predicciones_mensuales',
  '59 23 L * *',
  $$ SELECT generar_todas_predicciones(); $$
);

-- Ver jobs programados
SELECT * FROM cron.job;
```

### Opción C: Desde Frontend (Botón Manual)

Agrega un botón en el dashboard de Predicciones:

```javascript
import { PrediccionService } from '@/services/prediccionService'

async function generarPredicciones() {
  const result = await PrediccionService.generarPredicciones()

  if (result.success) {
    console.log('Predicciones generadas:', result.data)
  } else {
    console.error('Error:', result.error)
  }
}
```

## 🔍 Monitoreo y Mantenimiento

### Ver Predicciones Recientes

```sql
SELECT
  p.*,
  COALESCE(i.nombre, prod.nombre) as nombre_item
FROM predicciones p
LEFT JOIN insumos i ON p.insumo_id = i.id
LEFT JOIN productos prod ON p.producto_id = prod.id
WHERE p.fecha_creacion >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY p.fecha_creacion DESC;
```

### Ver Métricas de Precisión

```sql
SELECT * FROM obtener_metricas_precision();
```

Resultado esperado:
```
tipo_prediccion    | total | evaluadas | desv_promedio | precision_porcentaje | confianza_promedio
-------------------+-------+-----------+---------------+---------------------+-------------------
demanda_insumos   |   30  |    20     |     ±2.5      |        92.3%        |       0.88
ventas_productos  |   24  |    16     |     ±150      |        88.7%        |       0.85
ingresos          |    3  |     2     |     ±2500     |        91.2%        |       0.90
```

### Actualizar Desviaciones Manualmente

Al final de cada mes, puedes actualizar las desviaciones para medir la precisión:

```sql
SELECT * FROM actualizar_todas_desviaciones();
```

Esto:
1. Compara predicciones vs valores reales
2. Calcula desviación absoluta y porcentual
3. Actualiza la tabla `predicciones`

### Limpiar Predicciones Antiguas

```sql
-- Elimina predicciones de más de 12 meses
SELECT limpiar_predicciones_antiguas();
```

## 📈 Entendiendo los Algoritmos

### Promedio Móvil Ponderado (PMP)

**Para Insumos:**
- Usa últimos 3 meses de historial (o los que haya)
- Pesos adaptativos:
  - 1 mes: 100%
  - 2 meses: 60% / 40%
  - 3+ meses: 50% / 30% / 20%
- Fórmula general: `Predicción = Σ (consumo_mes_i × peso_i)`

**Para Ventas:**
- Usa últimos 3 meses de historial
- Mismos pesos que insumos
- Incluye bandas de confianza (±1.96 * desviación estándar = 95%)

### Nivel de Confianza

Basado en el coeficiente de variación (CV = desviación / promedio):

- **CV ≤ 10%** → Confianza 95% (Muy estable)
- **CV ≤ 20%** → Confianza 90% (Estable)
- **CV ≤ 30%** → Confianza 85% (Moderado)
- **CV ≤ 50%** → Confianza 75% (Variable)
- **CV > 50%** → Confianza 65% (Muy variable)

**Penalización por pocos datos (insumos):**
- 1 mes de datos: -15% confianza
- 2 meses de datos: -5% confianza
- 3+ meses: sin penalización

## 🎯 Ejemplo de Flujo Completo

### Día 31 de Enero (Fin de Mes)

**1. Actualizar desviaciones de enero:**
```sql
SELECT * FROM actualizar_todas_desviaciones();
```
Esto compara predicciones de enero vs consumo real de enero.

**2. Generar predicciones para febrero:**
```sql
SELECT * FROM generar_todas_predicciones();
```
Esto crea predicciones para febrero basándose en enero + meses anteriores.

**3. Ver resultados:**
```sql
-- Predicciones para febrero
SELECT * FROM predicciones
WHERE fecha_inicio >= '2025-02-01'
  AND fecha_inicio < '2025-03-01';

-- Desviaciones de enero
SELECT * FROM vista_desviaciones_recientes
WHERE fecha_fin >= '2025-01-01'
  AND fecha_fin < '2025-02-01';
```

## 🔧 Troubleshooting

### Error: "function generar_predicciones_insumos() does not exist"

**Solución:** No ejecutaste los scripts en orden. Vuelve a ejecutar:
1. `01_funciones_prediccion.sql`
2. `02_prediccion_demanda_insumos.sql`

### No aparecen predicciones en el frontend

**Verificar:**
```sql
-- ¿Hay predicciones futuras?
SELECT COUNT(*) FROM predicciones WHERE fecha_inicio >= CURRENT_DATE;

-- Si es 0, generar:
SELECT * FROM generar_todas_predicciones();
```

### Desviaciones no se calculan

**Verificar:**
```sql
-- ¿Hay predicciones pasadas sin valor_real?
SELECT COUNT(*) FROM predicciones
WHERE fecha_fin < CURRENT_DATE
  AND valor_real IS NULL;

-- Si hay, actualizar:
SELECT * FROM actualizar_todas_desviaciones();
```

### Nivel de confianza muy bajo

**Causas comunes:**
- Poco historial de datos (< 3 meses)
- Consumo muy irregular
- Eventos atípicos (temporadas altas/bajas)

**Solución:**
- Espera más datos históricos
- Ajusta pesos del PMP en `01_funciones_prediccion.sql`
- Considera factores estacionales

## 📞 Soporte

Para problemas o preguntas:
1. Revisa este README
2. Verifica logs en `predicciones_log` (si creaste la tabla)
3. Consulta el código SQL directamente

## 🎉 ¡Listo!

Tu sistema de predicciones está configurado y funcionando. Los datos se actualizarán automáticamente cada mes.
