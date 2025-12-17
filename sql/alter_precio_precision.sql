-- Ajusta la precisión de campos monetarios para permitir montos en colones
-- Ejecutar antes de resembrar recetas/productos para evitar overflow (numeric 5,2)

BEGIN;

-- Ampliar columnas monetarias en productos
ALTER TABLE public.productos
    ALTER COLUMN precio_venta TYPE numeric(12,2) USING precio_venta::numeric(12,2),
    ALTER COLUMN costo_total TYPE numeric(12,2) USING costo_total::numeric(12,2),
    ALTER COLUMN margen_ganancia TYPE numeric(12,2) USING margen_ganancia::numeric(12,2);

-- Ampliar columnas monetarias en recetas (se usan para calcular productos)
ALTER TABLE public.recetas
    ALTER COLUMN costo_total TYPE numeric(12,2) USING costo_total::numeric(12,2),
    ALTER COLUMN precio_sugerido TYPE numeric(12,2) USING precio_sugerido::numeric(12,2),
    ALTER COLUMN margen_ganancia TYPE numeric(12,2) USING margen_ganancia::numeric(12,2),
    ALTER COLUMN rentabilidad TYPE numeric(12,2) USING rentabilidad::numeric(12,2);

COMMIT;
