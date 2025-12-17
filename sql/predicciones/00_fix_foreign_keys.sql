-- =====================================================
-- FIX: Agregar Foreign Keys a tabla predicciones
-- =====================================================
-- Ejecutar este script ANTES de los demás si la tabla
-- predicciones ya existe sin foreign keys
-- =====================================================

-- 1. Agregar foreign key a insumos (si no existe)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'predicciones_insumo_id_fkey'
  ) THEN
    ALTER TABLE predicciones
    ADD CONSTRAINT predicciones_insumo_id_fkey
    FOREIGN KEY (insumo_id)
    REFERENCES insumos(id)
    ON DELETE CASCADE;

    RAISE NOTICE 'Foreign key predicciones_insumo_id_fkey creada';
  ELSE
    RAISE NOTICE 'Foreign key predicciones_insumo_id_fkey ya existe';
  END IF;
END $$;

-- 2. Agregar foreign key a productos (si no existe)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'predicciones_producto_id_fkey'
  ) THEN
    ALTER TABLE predicciones
    ADD CONSTRAINT predicciones_producto_id_fkey
    FOREIGN KEY (producto_id)
    REFERENCES productos(id)
    ON DELETE CASCADE;

    RAISE NOTICE 'Foreign key predicciones_producto_id_fkey creada';
  ELSE
    RAISE NOTICE 'Foreign key predicciones_producto_id_fkey ya existe';
  END IF;
END $$;

-- 3. Verificar foreign keys
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'predicciones';

-- =====================================================
-- Resultado esperado:
-- =====================================================
-- predicciones_insumo_id_fkey   | predicciones | insumo_id   | insumos   | id
-- predicciones_producto_id_fkey | predicciones | producto_id | productos | id
-- =====================================================
