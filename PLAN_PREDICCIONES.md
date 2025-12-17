# PLAN DE IMPLEMENTACIÓN: Sistema de Predicciones SQL

## 📋 Contexto
El usuario necesita un sistema de predicciones funcional URGENTE (mismo día), sin tiempo para Machine Learning complejo. La solución debe usar SQL puro con PostgreSQL/Supabase.

## 🎯 Objetivos
Crear predicciones automáticas para:
1. **Demanda de insumos** (corto plazo: semanal)
2. **Tendencias de ventas** (largo plazo: mensual/anual)
3. **Análisis de desviaciones** (comparar predicciones vs valores reales)

## 📊 Datos que tenemos disponibles
Según el schema actual:
- ✅ `ventas` y `detalles_venta` (historial de ventas)
- ✅ `movimientos_inventario` (consumo de insumos)
- ✅ `lotes_insumos` y `insumos` (inventario)
- ✅ `productos` (productos vendidos)
- ✅ Tabla `predicciones` ya existe con estructura completa

## 🔧 Enfoque: Algoritmos SQL Simples y Eficientes

### **Algoritmo #1: Promedio Móvil Ponderado (PMP)**
- **Para:** Predicción semanal de demanda de insumos
- **Lógica:** Últimas 4 semanas con pesos: 40% semana más reciente, 30% anterior, 20%, 10%
- **Ventaja:** Prioriza tendencias recientes

### **Algoritmo #2: Regresión Lineal Simple en SQL**
- **Para:** Tendencias mensuales/anuales
- **Lógica:** Usar funciones agregadas de PostgreSQL (AVG, STDDEV, CORR)
- **Ventaja:** Detecta tendencias crecientes/decrecientes

### **Algoritmo #3: Desviación Estándar + Factor de Estacionalidad**
- **Para:** Calcular bandas de confianza y margen de error
- **Lógica:** ±1.96 * desviación estándar = 95% confianza
- **Ventaja:** Métricas de precisión automáticas

## 📁 Estructura de Archivos a Crear

```
sql/
├── predicciones/
│   ├── 01_funciones_prediccion.sql          # Funciones auxiliares reutilizables
│   ├── 02_prediccion_demanda_insumos.sql    # Predicciones semanales de insumos
│   ├── 03_prediccion_ventas_productos.sql   # Predicciones mensuales de ventas
│   ├── 04_calcular_desviaciones.sql         # Compara predicción vs real
│   └── 05_trigger_automatico.sql            # Trigger para ejecutar automáticamente
```

## 🔄 Flujo de Ejecución

### **TRIGGER: ¿Cuándo ejecutar?**
**Respuesta:** **Fin de cada semana** (Domingo 23:59)

**Razón:**
- ✅ Predicciones para la PRÓXIMA semana basadas en datos COMPLETOS de la semana que acaba de terminar
- ✅ Datos de lunes-domingo completos para cálculos precisos
- ✅ Los gerentes pueden planificar compras el lunes temprano

**Alternativa simple:** Función que se llama manualmente o mediante cron job (pg_cron extension)

### **Secuencia:**
```
1. Domingo 23:59 → Trigger se activa
2. Calcula promedios de consumo de últimas 4 semanas
3. Genera predicciones para próxima semana (Lunes-Domingo)
4. Inserta en tabla `predicciones` con:
   - tipo_prediccion: 'demanda_insumos'
   - periodo: 'semanal'
   - fecha_inicio: próximo lunes
   - fecha_fin: próximo domingo
   - valor_predicho: cantidad estimada
   - nivel_confianza: basado en desviación estándar
```

## 💾 Detalles de Implementación

### **Archivo 1: Funciones Auxiliares**
```sql
-- Función para calcular promedio móvil ponderado
CREATE OR REPLACE FUNCTION calcular_pmp_consumo(
    p_insumo_id UUID,
    p_semanas INTEGER DEFAULT 4
) RETURNS NUMERIC

-- Función para detectar estacionalidad
CREATE OR REPLACE FUNCTION calcular_factor_estacional(
    p_insumo_id UUID,
    p_dia_semana INTEGER
) RETURNS NUMERIC

-- Función para calcular nivel de confianza
CREATE OR REPLACE FUNCTION calcular_nivel_confianza(
    p_desviacion NUMERIC,
    p_promedio NUMERIC
) RETURNS NUMERIC
```

### **Archivo 2: Predicción Demanda de Insumos (Semanal)**
```sql
-- Genera predicciones para los TOP insumos más usados
-- Basado en movimientos_inventario de tipo 'salida'/'consumo'
-- Agrupa por semana (date_trunc('week', fecha_movimiento))
-- Calcula PMP de últimas 4 semanas
-- Inserta predicción para próxima semana
```

**Insumos a predecir:**
- TOP 10 insumos por volumen de consumo
- Insumos con movimientos regulares (no esporádicos)

### **Archivo 3: Predicción Ventas Productos (Mensual)**
```sql
-- Genera predicciones mensuales de productos
-- Basado en ventas históricas (tabla detalles_venta)
-- Agrupa por mes (date_trunc('month', fecha_venta))
-- Usa regresión lineal simple para tendencia
-- Calcula bandas de confianza superior e inferior
```

**Productos a predecir:**
- TOP 5-8 productos más vendidos
- Predicción para próximo mes

### **Archivo 4: Cálculo de Desviaciones**
```sql
-- Compara predicciones vs valores reales
-- Actualiza campos: valor_real, desviacion, porcentaje_desviacion
-- Solo para predicciones donde fecha_fin < HOY
-- Ayuda a mejorar precisión futura
```

### **Archivo 5: Trigger/Scheduler**
**Opción A - Trigger temporal (PostgreSQL 14+):**
```sql
-- Usar pg_cron extension (si está disponible en Supabase)
SELECT cron.schedule(
    'generar_predicciones_semanales',
    '59 23 * * 0',  -- Domingo 23:59
    $$ SELECT generar_predicciones_semanales(); $$
);
```

**Opción B - Función manual (más simple):**
```sql
CREATE OR REPLACE FUNCTION generar_todas_predicciones()
RETURNS void AS $$
BEGIN
    -- Llamar a todas las funciones de predicción
    PERFORM generar_predicciones_insumos();
    PERFORM generar_predicciones_ventas();
    PERFORM actualizar_desviaciones();
END;
$$ LANGUAGE plpgsql;

-- Usuario lo ejecuta manualmente o desde frontend
```

## 🎨 Integración con Frontend

### **Nuevos servicios necesarios:**

**`src/services/prediccionService.js`:**
```javascript
static async getPrediccionesInsumosSemana() {
    // Obtiene predicciones tipo='demanda_insumos', periodo='semanal'
    // Para la próxima semana
    // JOIN con insumos para obtener nombres
}

static async getPrediccionesVentasMensuales() {
    // Obtiene predicciones tipo='ventas_productos', periodo='mensual'
    // Para próximo mes
    // Incluye bandas de confianza
}

static async getDesviacionesRecientes() {
    // Obtiene predicciones pasadas con desviaciones calculadas
    // Para análisis de precisión
}

static async generarPredicciones() {
    // Llama a función SQL generar_todas_predicciones()
    // Botón manual en dashboard
}
```

### **Actualizar componentes Vue:**
- `PrediccionCortoPlazo.vue`: Conectar a `getPrediccionesInsumosSemana()`
- `PrediccionLargoPlazo.vue`: Conectar a `getPrediccionesVentasMensuales()`
- `TablaDesviaciones.vue`: Conectar a `getDesviacionesRecientes()`
- `AnalisisDesviaciones.vue`: Agregar gráfico con data real

## ⚙️ Parámetros Configurables

### **Variables globales (tabla o constantes):**
```sql
-- Cuántas semanas históricas usar
v_semanas_historico := 4

-- Umbral mínimo de movimientos para predecir
v_min_movimientos := 10

-- Nivel de confianza (1.96 = 95%, 1.645 = 90%)
v_z_score := 1.96

-- Pesos para promedio móvil [más reciente → más antiguo]
v_pesos := ARRAY[0.4, 0.3, 0.2, 0.1]
```

## 📈 Ejemplo de Cálculo: Predicción de Carne de Res

**Datos históricos (últimas 4 semanas):**
- Semana -1 (más reciente): 26kg consumidos
- Semana -2: 24kg
- Semana -3: 25kg
- Semana -4: 23kg

**Cálculo PMP:**
```
Predicción = (26 × 0.4) + (24 × 0.3) + (25 × 0.2) + (23 × 0.1)
           = 10.4 + 7.2 + 5.0 + 2.3
           = 24.9 kg ≈ 25kg
```

**Desviación estándar:** ~1.29kg

**Margen de error (95% confianza):**
```
Margen = 1.96 × 1.29 = ±2.5kg
Rango: 22.5kg - 27.5kg
```

**Resultado insertado:**
```sql
INSERT INTO predicciones (
    tipo_prediccion, periodo, fecha_inicio, fecha_fin,
    insumo_id, valor_predicho, nivel_confianza, algoritmo
) VALUES (
    'demanda_insumos', 'semanal',
    '2025-01-29', '2025-02-05',
    'uuid-carne-res', 25.0, 0.95, 'Promedio Móvil Ponderado'
);
```

## ⏱️ Timeline de Ejecución

### **Hoy (urgente):**
1. ✅ Crear carpeta `sql/predicciones/`
2. ✅ Escribir 5 archivos SQL
3. ✅ Ejecutar archivos en Supabase SQL Editor (orden: 01 → 05)
4. ✅ Generar primera ronda de predicciones (llamar función manualmente)
5. ✅ Crear `prediccionService.js`
6. ✅ Conectar componentes Vue con servicio
7. ✅ Probar en frontend

**Tiempo estimado:** 2-3 horas (sin Machine Learning, solo SQL)

## 🚀 Ventajas de este Enfoque

✅ **Rápido:** Sin librerías externas, solo SQL nativo
✅ **Confiable:** PostgreSQL es robusto para cálculos estadísticos
✅ **Escalable:** Funciona con cualquier volumen de datos
✅ **Mantenible:** Código SQL simple, fácil de entender
✅ **Automático:** Trigger semanal (o llamada manual)
✅ **Preciso:** Promedio móvil ponderado es efectivo para demanda

## 🎯 Métricas de Éxito

- [ ] Predicciones generadas para próxima semana (insumos)
- [ ] Predicciones generadas para próximo mes (ventas)
- [ ] Desviaciones calculadas para predicciones pasadas
- [ ] Frontend muestra datos reales (no hardcoded)
- [ ] Nivel de confianza >= 85% en promedio
- [ ] Margen de error promedio <= 20%

## 🔄 Mejoras Futuras (Opcional)

- Integrar días festivos/eventos especiales
- Ajuste dinámico de pesos según precisión histórica
- Predicciones por categoría de productos
- Dashboard de precisión del modelo
- Alertas cuando desviación > 30%

---

## ✅ Decisiones Clave

1. **¿Cuándo ejecutar?** → Domingo 23:59 (fin de semana)
2. **¿Qué predecir?** → TOP 10 insumos + TOP 5 productos
3. **¿Qué algoritmo?** → Promedio Móvil Ponderado (simple y efectivo)
4. **¿Cuánta historia?** → 4 semanas (balance entre reciente y estable)
5. **¿Automatización?** → Función manual primero, trigger después

---

**Estado:** ✅ PLAN COMPLETO - LISTO PARA IMPLEMENTAR
