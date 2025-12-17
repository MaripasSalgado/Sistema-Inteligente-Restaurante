-- Garantiza que configuracion_deducciones genere UUID por defecto
ALTER TABLE public.configuracion_deducciones
  ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- En caso de tablas que quedaron sin default previo, esta instrucción lo reestablece.
-- No se actualizan filas existentes porque la columna es NOT NULL y deberían tener id válido.
