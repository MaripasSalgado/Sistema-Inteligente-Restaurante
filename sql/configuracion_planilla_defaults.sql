-- Configuración base de planilla para Costa Rica
-- Seguro Social (9.34%), Renta progresiva vigente y aguinaldo 8.33%

-- Deducción: Seguro Social
INSERT INTO public.configuracion_deducciones (concepto, porcentaje, tipo, aplica_a, activa)
VALUES ('Seguro Social', 9.34, 'legal', 'todos', true)
ON CONFLICT (concepto) DO UPDATE
SET porcentaje = EXCLUDED.porcentaje,
    tipo = EXCLUDED.tipo,
    aplica_a = EXCLUDED.aplica_a,
    activa = EXCLUDED.activa,
    fecha_modificacion = now();

-- Deducción: Impuesto sobre la Renta (tabla progresiva)
INSERT INTO public.configuracion_deducciones (concepto, tipo, aplica_a, tabla_progresiva, activa)
VALUES (
  'Impuesto sobre la Renta',
  'legal',
  'todos',
  '[
    {"desde":0,"hasta":929000,"porcentaje":0},
    {"desde":929001,"hasta":1363000,"porcentaje":10},
    {"desde":1363001,"hasta":2392000,"porcentaje":15},
    {"desde":2392001,"hasta":999999999,"porcentaje":20}
  ]'::jsonb,
  true
)
ON CONFLICT (concepto) DO UPDATE
SET tabla_progresiva = EXCLUDED.tabla_progresiva,
    tipo = EXCLUDED.tipo,
    aplica_a = EXCLUDED.aplica_a,
    activa = EXCLUDED.activa,
    fecha_modificacion = now();

-- Aguinaldo: 8.33% con días mínimos 0
INSERT INTO public.configuracion_aguinaldo (porcentaje, dias_minimos, activa)
VALUES (8.33, 0, true)
ON CONFLICT (id) DO NOTHING;
