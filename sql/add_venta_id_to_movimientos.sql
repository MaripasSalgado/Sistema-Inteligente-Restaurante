-- Agregar campo venta_id para trazabilidad directa
-- Este campo permite vincular directamente los movimientos de inventario con las ventas que los generaron
-- Complementa el campo 'documento' que almacena el numero_orden

ALTER TABLE public.movimientos_inventario
ADD COLUMN IF NOT EXISTS venta_id uuid;

-- Agregar foreign key constraint hacia la tabla ventas
ALTER TABLE public.movimientos_inventario
ADD CONSTRAINT movimientos_inventario_venta_id_fkey
FOREIGN KEY (venta_id) REFERENCES public.ventas(id)
ON DELETE SET NULL;

-- Comentario explicativo para documentación
COMMENT ON COLUMN public.movimientos_inventario.venta_id IS 'Referencia directa a la venta que generó este movimiento de inventario. Permite trazabilidad completa desde la venta hasta el consumo de insumos.';

-- Crear índice para mejorar performance en consultas por venta_id
CREATE INDEX IF NOT EXISTS idx_movimientos_inventario_venta_id
ON public.movimientos_inventario(venta_id);
