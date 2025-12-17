CREATE OR REPLACE FUNCTION movimiento_alerta()
RETURNS trigger AS $$
DECLARE
  payload jsonb;
BEGIN
  payload := jsonb_build_object(
    'id', NEW.id,
    'lote_id', NEW.lote_id,
    'tipo', NEW.tipo,
    'cantidad', NEW.cantidad,
    'usuario_id', NEW.usuario_id,
    'fecha_movimiento', NEW.fecha_movimiento
  );

  PERFORM pg_notify('movimiento_alerta', payload::text);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_movimiento_alerta
AFTER INSERT OR UPDATE ON movimientos_inventario
FOR EACH ROW
EXECUTE FUNCTION movimiento_alerta();
