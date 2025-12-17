-- Tabla de historial de salarios y contratos
CREATE TABLE IF NOT EXISTS public.historial_salarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  salario_anterior numeric,
  salario_nuevo numeric,
  tarifa_hora_anterior numeric,
  tarifa_hora_nueva numeric,
  tipo_contrato_anterior character varying,
  tipo_contrato_nuevo character varying,
  motivo text,
  cambiado_por uuid REFERENCES public.usuarios(id),
  fecha_cambio timestamptz DEFAULT now()
);

-- Índices para consultas por usuario y fecha
CREATE INDEX IF NOT EXISTS historial_salarios_usuario_idx ON public.historial_salarios(usuario_id, fecha_cambio DESC);
