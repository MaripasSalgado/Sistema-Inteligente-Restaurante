-- Fuerza que configuracion_deducciones genere UUID aunque el cliente envíe null/omita id

-- Asegura default en la columna
ALTER TABLE public.configuracion_deducciones
  ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Crea/actualiza trigger para llenar id cuando venga null
CREATE OR REPLACE FUNCTION public.fn_config_deducciones_set_uuid()
RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.id IS NULL THEN
    NEW.id := gen_random_uuid();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_config_deducciones_set_uuid ON public.configuracion_deducciones;
CREATE TRIGGER trg_config_deducciones_set_uuid
BEFORE INSERT ON public.configuracion_deducciones
FOR EACH ROW
EXECUTE FUNCTION public.fn_config_deducciones_set_uuid();
