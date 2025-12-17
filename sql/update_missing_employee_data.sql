-- Update missing employee data fields (cedula, tipo_contrato, salario_base)
-- This script adds realistic data for existing users in the database

BEGIN;

-- Update users with missing cedula, tipo_contrato, and salario_base
-- Using realistic Costa Rican cédulas and salary ranges

UPDATE public.usuarios
SET 
  cedula = CASE 
    WHEN nombre = 'Ariel' THEN '1-1234-5678'
    WHEN nombre LIKE '%Admin%' OR puesto = 'CEO' THEN '1-0987-6543'
    WHEN puesto = 'Chef' OR puesto LIKE '%Cocina%' THEN '2-' || LPAD(FLOOR(RANDOM() * 9999 + 1000)::TEXT, 4, '0') || '-' || LPAD(FLOOR(RANDOM() * 9999 + 1000)::TEXT, 4, '0')
    WHEN puesto LIKE '%Mesero%' OR puesto LIKE '%Servicio%' THEN '3-' || LPAD(FLOOR(RANDOM() * 9999 + 1000)::TEXT, 4, '0') || '-' || LPAD(FLOOR(RANDOM() * 9999 + 1000)::TEXT, 4, '0')
    WHEN puesto LIKE '%Cajero%' OR puesto = 'Caja' THEN '4-' || LPAD(FLOOR(RANDOM() * 9999 + 1000)::TEXT, 4, '0') || '-' || LPAD(FLOOR(RANDOM() * 9999 + 1000)::TEXT, 4, '0')
    ELSE '5-' || LPAD(FLOOR(RANDOM() * 9999 + 1000)::TEXT, 4, '0') || '-' || LPAD(FLOOR(RANDOM() * 9999 + 1000)::TEXT, 4, '0')
  END,
  
  tipo_contrato = CASE 
    WHEN puesto = 'CEO' OR puesto LIKE '%Gerente%' OR puesto LIKE '%Admin%' THEN 'Tiempo Completo'
    WHEN puesto LIKE '%Chef%' OR puesto LIKE '%Cocina%' THEN 'Tiempo Completo'
    WHEN puesto LIKE '%Mesero%' OR puesto LIKE '%Servicio%' THEN 
      CASE WHEN RANDOM() > 0.5 THEN 'Tiempo Completo' ELSE 'Medio Tiempo' END
    WHEN puesto LIKE '%Cajero%' THEN 'Tiempo Completo'
    ELSE 'Medio Tiempo'
  END,
  
  salario_base = CASE 
    WHEN puesto = 'CEO' OR puesto LIKE '%Director%' THEN 2500000.00
    WHEN puesto LIKE '%Gerente%' THEN 1500000.00
    WHEN puesto LIKE '%Admin%' THEN 800000.00
    WHEN puesto = 'Chef' OR puesto LIKE '%Chef Ejecutivo%' THEN 1200000.00
    WHEN puesto LIKE '%Sous Chef%' OR puesto LIKE '%Jefe de Cocina%' THEN 900000.00
    WHEN puesto LIKE '%Cocinero%' OR puesto LIKE '%Cocina%' THEN 650000.00
    WHEN puesto LIKE '%Mesero%' OR puesto LIKE '%Servicio%' THEN 550000.00
    WHEN puesto LIKE '%Cajero%' OR puesto = 'Caja' THEN 600000.00
    WHEN puesto LIKE '%Limpieza%' THEN 500000.00
    WHEN puesto LIKE '%Ayudante%' THEN 480000.00
    ELSE 550000.00
  END,
  
  fecha_ingreso = COALESCE(
    fecha_ingreso, 
    CURRENT_DATE - INTERVAL '1 year' * FLOOR(RANDOM() * 3 + 1)
  )

WHERE cedula IS NULL 
   OR tipo_contrato IS NULL 
   OR salario_base IS NULL 
   OR salario_base = 0
   OR fecha_ingreso IS NULL
   OR fecha_ingreso < '1970-01-02'; -- Fix the 1969 date issue

-- Verify the updates
SELECT 
  id, 
  nombre, 
  apellido, 
  cedula, 
  puesto, 
  tipo_contrato, 
  salario_base,
  fecha_ingreso
FROM public.usuarios
ORDER BY nombre;

COMMIT;
