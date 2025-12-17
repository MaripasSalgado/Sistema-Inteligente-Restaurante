-- Actualiza salario_base y tarifa_hora en usuarios tomando el último registro de historial_salarios
-- Úsalo si tienes datos en historial_salarios pero columnas nulas en usuarios.

WITH ultimo_historial AS (
  SELECT DISTINCT ON (usuario_id)
         usuario_id,
         salario_nuevo,
         tarifa_hora_nueva,
         tipo_contrato_nuevo
  FROM public.historial_salarios
  ORDER BY usuario_id, fecha_cambio DESC NULLS LAST, id DESC
)
UPDATE public.usuarios u
SET salario_base = COALESCE(h.salario_nuevo, u.salario_base),
    tarifa_hora = COALESCE(h.tarifa_hora_nueva, u.tarifa_hora),
    tipo_contrato = COALESCE(h.tipo_contrato_nuevo, u.tipo_contrato)
FROM ultimo_historial h
WHERE u.id = h.usuario_id;

-- Opcional: valida resultado
-- SELECT id, nombre, apellido, salario_base, tarifa_hora, tipo_contrato FROM public.usuarios;
