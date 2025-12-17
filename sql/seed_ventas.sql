-- Script: SEED DE VENTAS Y MOVIMIENTOS ASOCIADOS
-- Ejecutar después de seed_inventory_suppliers.sql, seed_recetas.sql y seed_productos.sql
-- Genera ventas con sus detalles y los movimientos que representan el consumo de insumos

BEGIN;

-- =============================================
-- LIMPIEZA DE REGISTROS ANTERIORES
-- =============================================
WITH ventas_target AS (
    SELECT id
    FROM public.ventas
    WHERE numero_orden IN ('ORD-1001','ORD-1002','ORD-1003','ORD-1004','ORD-1005')
)
DELETE FROM public.detalles_venta
WHERE venta_id IN (SELECT id FROM ventas_target);

DELETE FROM public.movimientos_inventario
WHERE documento IN ('ORD-1001','ORD-1002','ORD-1003','ORD-1004','ORD-1005');

DELETE FROM public.ventas
WHERE numero_orden IN ('ORD-1001','ORD-1002','ORD-1003','ORD-1004','ORD-1005');

-- =============================================
-- VENTAS PRINCIPALES
-- =============================================
WITH usuario_default AS (
    SELECT id AS usuario_id FROM public.usuarios ORDER BY fecha_creacion LIMIT 1
)
INSERT INTO public.ventas (
    id, numero_orden, cliente_id, cliente_nombre, cliente_telefono,
    tipo_venta, estado, metodo_pago,
    subtotal, descuento, impuestos, total,
    fecha_venta, fecha_entrega, direccion_entrega, observaciones,
    vendedor_id, creado_por, modificado_por
)
SELECT 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd390101'::uuid, 'ORD-1001', NULL::uuid, 'María Pérez', '8888-1122',
       'Local', 'Completada', 'Efectivo',
       13400, 0, 1742, 15142,
       CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE - INTERVAL '3 days', NULL, 'Almuerzo ejecutivo',
       usuario_id, usuario_id, usuario_id
FROM usuario_default
UNION ALL
SELECT 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd390102'::uuid, 'ORD-1002', NULL::uuid, 'Carlos Jiménez', '7011-2233',
       'Domicilio', 'Completada', 'Tarjeta',
       15250, 500, 1917.50, 16667.50,
       CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE - INTERVAL '2 days', 'Residencial Cartago Norte', 'Incluye salsa extra',
       usuario_id, usuario_id, usuario_id
FROM usuario_default
UNION ALL
SELECT 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd390103'::uuid, 'ORD-1003', NULL::uuid, 'Patricia Gómez', '7011-4455',
       'Para Llevar', 'Completada', 'Transferencia',
       12500, 0, 1625, 14125,
       CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE - INTERVAL '1 day', NULL, 'Pedido para reunión',
       usuario_id, usuario_id, usuario_id
FROM usuario_default
UNION ALL
SELECT 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd390104'::uuid, 'ORD-1004', NULL::uuid, 'Empresa NovaTech', '2222-8899',
       'Local', 'Completada', 'Tarjeta',
       29800, 1000, 3744, 32544,
       CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '5 days', NULL, 'Atención comité ejecutivo',
       usuario_id, usuario_id, usuario_id
FROM usuario_default
UNION ALL
SELECT 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd390105'::uuid, 'ORD-1005', NULL::uuid, 'Luis Quesada', '8811-0099',
       'Para Llevar', 'Completada', 'Efectivo',
       18850, 0, 2450.50, 21300.50,
       CURRENT_DATE, CURRENT_DATE, NULL, 'Cena para ver el partido',
       usuario_id, usuario_id, usuario_id
FROM usuario_default;

-- =============================================
-- DETALLES DE VENTA
-- =============================================
INSERT INTO public.detalles_venta (id, venta_id, producto_id, cantidad, precio_unitario, descuento, subtotal, observaciones) VALUES
-- ORD-1001
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd390201'::uuid, 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd390101', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd390001', 2, 2800, 0, 5600, 'Sin picante'),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd390202'::uuid, 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd390101', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd390011', 1, 7800, 0, 7800, 'Combo Caraqueño'),
-- ORD-1002
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd390203'::uuid, 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd390102', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd390005', 3, 2950, 0, 8850, NULL),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd390204'::uuid, 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd390102', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd390008', 1, 4200, 0, 4200, 'Papas familia'),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd390205'::uuid, 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd390102', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd390010', 1, 2200, 0, 2200, 'Guasacaca individual'),
-- ORD-1003
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd390206'::uuid, 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd390103', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd390012', 1, 7600, 0, 7600, NULL),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd390207'::uuid, 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd390103', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd390004', 2, 2450, 0, 4900, NULL),
-- ORD-1004
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd390208'::uuid, 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd390104', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd390014', 1, 19600, 0, 19600, 'Combo familiar criollo'),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd390209'::uuid, 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd390104', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd390006', 4, 2550, 0, 10200, 'Dominó extra queso'),
-- ORD-1005
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd390210'::uuid, 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd390105', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd390007', 1, 3050, 0, 3050, NULL),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd390211'::uuid, 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd390105', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd390015', 1, 15800, 0, 15800, NULL);

-- =============================================
-- ACTUALIZAR VENTAS REGISTRADAS DE PRODUCTOS
-- =============================================
WITH productos_afectados AS (
    SELECT DISTINCT producto_id
    FROM public.detalles_venta
    WHERE venta_id IN (
        'f0eebc99-9c0b-4ef8-bb6d-6bb9bd390101',
        'f0eebc99-9c0b-4ef8-bb6d-6bb9bd390102',
        'f0eebc99-9c0b-4ef8-bb6d-6bb9bd390103',
        'f0eebc99-9c0b-4ef8-bb6d-6bb9bd390104',
        'f0eebc99-9c0b-4ef8-bb6d-6bb9bd390105'
    )
)
UPDATE public.productos p
SET ventas_registradas = COALESCE((
    SELECT SUM(dv.cantidad)::integer
    FROM public.detalles_venta dv
    WHERE dv.producto_id = p.id
), 0)
WHERE p.id IN (SELECT producto_id FROM productos_afectados);

-- =============================================
-- MOVIMIENTOS DE INVENTARIO (MENTELES CONSUMO POR VENTA)
-- Nota: se registran salidas informativas; no es necesario restar existencias reales en este seed.
-- =============================================
WITH usuario_default AS (
    SELECT id AS usuario_id FROM public.usuarios ORDER BY fecha_creacion LIMIT 1
)
INSERT INTO public.movimientos_inventario (lote_id, tipo, cantidad, motivo, documento, costo_unitario, costo_total, usuario_id, fecha_movimiento)
SELECT l.id, 'Salida', 1.8, 'Venta ORD-1001 - Carne Mechada', 'ORD-1001',
       l.precio_unitario, l.precio_unitario * 1.8, usuario_default.usuario_id, CURRENT_DATE - INTERVAL '3 days'
FROM public.lotes_insumos l, usuario_default
WHERE l.lote = 'L-CAR-002';

WITH usuario_default AS (
    SELECT id AS usuario_id FROM public.usuarios ORDER BY fecha_creacion LIMIT 1
)
INSERT INTO public.movimientos_inventario (lote_id, tipo, cantidad, motivo, documento, costo_unitario, costo_total, usuario_id, fecha_movimiento)
SELECT l.id, 'Salida', 2.2, 'Venta ORD-1001 - Masa Empanada', 'ORD-1001',
       l.precio_unitario, l.precio_unitario * 2.2, usuario_default.usuario_id, CURRENT_DATE - INTERVAL '3 days'
FROM public.lotes_insumos l, usuario_default
WHERE l.lote = 'L-HAR-001';

WITH usuario_default AS (
    SELECT id AS usuario_id FROM public.usuarios ORDER BY fecha_creacion LIMIT 1
)
INSERT INTO public.movimientos_inventario (lote_id, tipo, cantidad, motivo, documento, costo_unitario, costo_total, usuario_id, fecha_movimiento)
SELECT l.id, 'Salida', 1.5, 'Venta ORD-1002 - Pollo Criollo', 'ORD-1002',
       l.precio_unitario, l.precio_unitario * 1.5, usuario_default.usuario_id, CURRENT_DATE - INTERVAL '2 days'
FROM public.lotes_insumos l, usuario_default
WHERE l.lote = 'L-POL-001';

WITH usuario_default AS (
    SELECT id AS usuario_id FROM public.usuarios ORDER BY fecha_creacion LIMIT 1
)
INSERT INTO public.movimientos_inventario (lote_id, tipo, cantidad, motivo, documento, costo_unitario, costo_total, usuario_id, fecha_movimiento)
SELECT l.id, 'Salida', 1.0, 'Venta ORD-1002 - Masa y fritura', 'ORD-1002',
       l.precio_unitario, l.precio_unitario, usuario_default.usuario_id, CURRENT_DATE - INTERVAL '2 days'
FROM public.lotes_insumos l, usuario_default
WHERE l.lote = 'L-HAR-001';

WITH usuario_default AS (
    SELECT id AS usuario_id FROM public.usuarios ORDER BY fecha_creacion LIMIT 1
)
INSERT INTO public.movimientos_inventario (lote_id, tipo, cantidad, motivo, documento, costo_unitario, costo_total, usuario_id, fecha_movimiento)
SELECT l.id, 'Salida', 0.8, 'Venta ORD-1002 - Aceite freído', 'ORD-1002',
       l.precio_unitario, l.precio_unitario * 0.8, usuario_default.usuario_id, CURRENT_DATE - INTERVAL '2 days'
FROM public.lotes_insumos l, usuario_default
WHERE l.lote = 'L-ACE-001';

WITH usuario_default AS (
    SELECT id AS usuario_id FROM public.usuarios ORDER BY fecha_creacion LIMIT 1
)
INSERT INTO public.movimientos_inventario (lote_id, tipo, cantidad, motivo, documento, costo_unitario, costo_total, usuario_id, fecha_movimiento)
SELECT l.id, 'Salida', 0.9, 'Venta ORD-1003 - Quesos', 'ORD-1003',
       l.precio_unitario, l.precio_unitario * 0.9, usuario_default.usuario_id, CURRENT_DATE - INTERVAL '1 day'
FROM public.lotes_insumos l, usuario_default
WHERE l.lote = 'L-QUE-001';

WITH usuario_default AS (
    SELECT id AS usuario_id FROM public.usuarios ORDER BY fecha_creacion LIMIT 1
)
INSERT INTO public.movimientos_inventario (lote_id, tipo, cantidad, motivo, documento, costo_unitario, costo_total, usuario_id, fecha_movimiento)
SELECT l.id, 'Salida', 1.5, 'Venta ORD-1003 - Masa adicional', 'ORD-1003',
       l.precio_unitario, l.precio_unitario * 1.5, usuario_default.usuario_id, CURRENT_DATE - INTERVAL '1 day'
FROM public.lotes_insumos l, usuario_default
WHERE l.lote = 'L-HAR-001';

WITH usuario_default AS (
    SELECT id AS usuario_id FROM public.usuarios ORDER BY fecha_creacion LIMIT 1
)
INSERT INTO public.movimientos_inventario (lote_id, tipo, cantidad, motivo, documento, costo_unitario, costo_total, usuario_id, fecha_movimiento)
SELECT l.id, 'Salida', 2.5, 'Venta ORD-1004 - Carne ejecutiva', 'ORD-1004',
       l.precio_unitario, l.precio_unitario * 2.5, usuario_default.usuario_id, CURRENT_DATE - INTERVAL '5 days'
FROM public.lotes_insumos l, usuario_default
WHERE l.lote = 'L-CAR-001';

WITH usuario_default AS (
    SELECT id AS usuario_id FROM public.usuarios ORDER BY fecha_creacion LIMIT 1
)
INSERT INTO public.movimientos_inventario (lote_id, tipo, cantidad, motivo, documento, costo_unitario, costo_total, usuario_id, fecha_movimiento)
SELECT l.id, 'Salida', 3.0, 'Venta ORD-1004 - Masa especial', 'ORD-1004',
       l.precio_unitario, l.precio_unitario * 3.0, usuario_default.usuario_id, CURRENT_DATE - INTERVAL '5 days'
FROM public.lotes_insumos l, usuario_default
WHERE l.lote = 'L-HAR-001';

WITH usuario_default AS (
    SELECT id AS usuario_id FROM public.usuarios ORDER BY fecha_creacion LIMIT 1
)
INSERT INTO public.movimientos_inventario (lote_id, tipo, cantidad, motivo, documento, costo_unitario, costo_total, usuario_id, fecha_movimiento)
SELECT l.id, 'Salida', 1.2, 'Venta ORD-1005 - Queso fundido', 'ORD-1005',
       l.precio_unitario, l.precio_unitario * 1.2, usuario_default.usuario_id, CURRENT_DATE
FROM public.lotes_insumos l, usuario_default
WHERE l.lote = 'L-QUE-001';

WITH usuario_default AS (
    SELECT id AS usuario_id FROM public.usuarios ORDER BY fecha_creacion LIMIT 1
)
INSERT INTO public.movimientos_inventario (lote_id, tipo, cantidad, motivo, documento, costo_unitario, costo_total, usuario_id, fecha_movimiento)
SELECT l.id, 'Salida', 0.6, 'Venta ORD-1005 - Aceite fritura', 'ORD-1005',
       l.precio_unitario, l.precio_unitario * 0.6, usuario_default.usuario_id, CURRENT_DATE
FROM public.lotes_insumos l, usuario_default
WHERE l.lote = 'L-ACE-001';

COMMIT;
