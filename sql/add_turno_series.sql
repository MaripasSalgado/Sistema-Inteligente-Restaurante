-- Crear tabla para series de turnos recurrentes
CREATE TABLE IF NOT EXISTS public.turno_series (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL REFERENCES public.usuarios (id),
  descripcion text,
  fecha_inicio date NOT NULL,
  fecha_fin date NOT NULL,
  dias_semana jsonb,
  hora_inicio time without time zone NOT NULL,
  hora_fin time without time zone NOT NULL,
  area character varying NOT NULL,
  posicion character varying,
  creado_por uuid REFERENCES public.usuarios (id),
  fecha_creacion timestamptz DEFAULT now(),
  fecha_modificacion timestamptz DEFAULT now(),
  CONSTRAINT turno_series_pkey PRIMARY KEY (id)
);

-- Agregar relación de los turnos con la serie (opcional)
ALTER TABLE public.turnos
  ADD COLUMN IF NOT EXISTS serie_id uuid;

ALTER TABLE public.turnos
  ADD CONSTRAINT turnos_serie_id_fkey
  FOREIGN KEY (serie_id)
  REFERENCES public.turno_series (id)
  ON DELETE SET NULL;
