-- Script Modular: PRODUCTOS Y COMBOS BASADOS EN RECETAS
-- Ejecutar después de seed_recetas.sql
-- Genera productos individuales y combos listos para venta

BEGIN;

-- =============================================
-- LIMPIEZA PREVIA (PRODUCTOS Y SUS RECETAS)
-- =============================================
WITH productos_objetivo AS (
    SELECT id
    FROM public.productos
    WHERE codigo IN (
        'PRO-EMP-001','PRO-EMP-002','PRO-EMP-003','PRO-EMP-004','PRO-EMP-005','PRO-EMP-006','PRO-EMP-007',
        'PRO-AC-001','PRO-AC-002','PRO-AC-003',
        'PRO-COM-001','PRO-COM-002','PRO-COM-003',
        'PRO-FAM-001','PRO-FAM-002'
    )
)
DELETE FROM public.recetas_producto
WHERE producto_id IN (SELECT id FROM productos_objetivo);

WITH productos_objetivo AS (
    SELECT id
    FROM public.productos
    WHERE codigo IN (
        'PRO-EMP-001','PRO-EMP-002','PRO-EMP-003','PRO-EMP-004','PRO-EMP-005','PRO-EMP-006','PRO-EMP-007',
        'PRO-AC-001','PRO-AC-002','PRO-AC-003',
        'PRO-COM-001','PRO-COM-002','PRO-COM-003',
        'PRO-FAM-001','PRO-FAM-002'
    )
)
DELETE FROM public.productos
WHERE id IN (SELECT id FROM productos_objetivo);

-- =============================================
-- CATEGORÍAS PARA PRODUCTOS Y COMBOS
-- =============================================
INSERT INTO public.categorias_productos (id, nombre, descripcion, color, icono, activa)
VALUES
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd391001', 'Empanadas Individuales', 'Empanadas listas para servir por unidad', '#facc15', '🥟', true),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd391002', 'Acompañamientos y Extras', 'Guarniciones, salsas y agregados', '#fb923c', '🍟', true),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd391003', 'Combos Criollos', 'Combinaciones personales con bebida o acompañamiento', '#34d399', '🍽️', true),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd391004', 'Combos Familiares', 'Paquetes para compartir en grupo', '#60a5fa', '👨‍👩‍👧‍👦', true)
ON CONFLICT (nombre) DO UPDATE
SET descripcion = EXCLUDED.descripcion,
    color = EXCLUDED.color,
    icono = EXCLUDED.icono,
    activa = EXCLUDED.activa;

-- =============================================
-- PRODUCTOS PRINCIPALES Y COMBOS
-- =============================================
INSERT INTO public.productos (id, codigo, nombre, descripcion, categoria_id, precio_venta, costo_total, margen_ganancia, ventas_registradas, activo)
VALUES
-- Empanadas individuales
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390001', 'PRO-EMP-001', 'Empanada Carne Mechada', 'Relleno criollo clásico con masa dorada', (SELECT id FROM public.categorias_productos WHERE nombre = 'Empanadas Individuales' LIMIT 1), 2800, 0, 0, 0, true),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390002', 'PRO-EMP-002', 'Empanada Pollo Criollo', 'Guiso de pollo mechado con aliños frescos', (SELECT id FROM public.categorias_productos WHERE nombre = 'Empanadas Individuales' LIMIT 1), 2650, 0, 0, 0, true),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390003', 'PRO-EMP-003', 'Empanada Jamón & Queso', 'Jamón ahumado y mozzarella derretida', (SELECT id FROM public.categorias_productos WHERE nombre = 'Empanadas Individuales' LIMIT 1), 2500, 0, 0, 0, true),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390004', 'PRO-EMP-004', 'Empanada Queso Llanero', 'Queso turrialba con natilla salada', (SELECT id FROM public.categorias_productos WHERE nombre = 'Empanadas Individuales' LIMIT 1), 2450, 0, 0, 0, true),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390005', 'PRO-EMP-005', 'Empanada Pabellón', 'Carne mechada, caraotas y queso rallado', (SELECT id FROM public.categorias_productos WHERE nombre = 'Empanadas Individuales' LIMIT 1), 2950, 0, 0, 0, true),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390006', 'PRO-EMP-006', 'Empanada Dominó', 'Caraotas negras con queso blanco rallado', (SELECT id FROM public.categorias_productos WHERE nombre = 'Empanadas Individuales' LIMIT 1), 2550, 0, 0, 0, true),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390007', 'PRO-EMP-007', 'Empanada Choriqueso', 'Chorizo parrillero, papa y queso fundido', (SELECT id FROM public.categorias_productos WHERE nombre = 'Empanadas Individuales' LIMIT 1), 3050, 0, 0, 0, true),

-- Acompañamientos y extras
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390008', 'PRO-AC-001', 'Papas Criollas con Guasacaca', 'Bastones doble fritura con salsa verde', (SELECT id FROM public.categorias_productos WHERE nombre = 'Acompañamientos y Extras' LIMIT 1), 4200, 0, 0, 0, true),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390009', 'PRO-AC-002', 'Arepitas Doradas con Queso', 'Porción de arepitas con queso rallado', (SELECT id FROM public.categorias_productos WHERE nombre = 'Acompañamientos y Extras' LIMIT 1), 3800, 0, 0, 0, true),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390010', 'PRO-AC-003', 'Guasacaca Artesanal', 'Envase de salsa cremosa de aguacate', (SELECT id FROM public.categorias_productos WHERE nombre = 'Acompañamientos y Extras' LIMIT 1), 2200, 0, 0, 0, true),

-- Combos personales
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390011', 'PRO-COM-001', 'Combo Caraqueño', 'Carne + Pollo + Papas + Guasacaca', (SELECT id FROM public.categorias_productos WHERE nombre = 'Combos Criollos' LIMIT 1), 7800, 0, 0, 0, true),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390012', 'PRO-COM-002', 'Combo Llanero', 'Queso Llanero + Dominó + Arepitas + Guasacaca', (SELECT id FROM public.categorias_productos WHERE nombre = 'Combos Criollos' LIMIT 1), 7600, 0, 0, 0, true),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390013', 'PRO-COM-003', 'Combo Pabellón Nocturno', 'Pabellón + Choriqueso + Papas + Guasacaca', (SELECT id FROM public.categorias_productos WHERE nombre = 'Combos Criollos' LIMIT 1), 8500, 0, 0, 0, true),

-- Combos para compartir
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390014', 'PRO-FAM-001', 'Combo Familiar Criollo (8 piezas)', '2 Carne + 2 Pollo + 2 Pabellón + Papas y Guasacaca dobles', (SELECT id FROM public.categorias_productos WHERE nombre = 'Combos Familiares' LIMIT 1), 19600, 0, 0, 0, true),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390015', 'PRO-FAM-002', 'Combo Oficina Surtido (6 piezas)', '2 Jamón & Queso + 2 Queso Llanero + 2 Dominó + Papas + 2 Guasacaca', (SELECT id FROM public.categorias_productos WHERE nombre = 'Combos Familiares' LIMIT 1), 15800, 0, 0, 0, true);

-- =============================================
-- RELACIÓN PRODUCTO ↔ RECETAS
-- =============================================
INSERT INTO public.recetas_producto (producto_id, receta_id, cantidad, observaciones) VALUES
-- Empanadas individuales
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390001', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 1, 'Porción estándar por unidad'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390002', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 1, 'Porción estándar por unidad'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390003', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380003', 1, 'Porción estándar por unidad'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390004', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380004', 1, 'Porción estándar por unidad'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390005', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380005', 1, 'Porción estándar por unidad'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390006', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380006', 1, 'Porción estándar por unidad'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390007', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380007', 1, 'Porción estándar por unidad'),

-- Acompañamientos
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390008', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380008', 1, 'Porción completa para compartir'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390009', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380009', 1, 'Orden de 12 arepitas'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390010', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380010', 1, 'Envase 12 oz'),

-- Combos personales
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390011', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 1, 'Empanada carne'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390011', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 1, 'Empanada pollo'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390011', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380008', 1, 'Papas para compartir'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390011', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380010', 1, 'Guasacaca individual'),

('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390012', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380004', 1, 'Empanada queso llanero'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390012', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380006', 1, 'Empanada dominó'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390012', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380009', 1, 'Arepitas'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390012', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380010', 1, 'Guasacaca'),

('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390013', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380005', 1, 'Empanada pabellón'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390013', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380007', 1, 'Empanada choriqueso'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390013', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380008', 1, 'Papas'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390013', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380010', 1, 'Guasacaca'),

-- Combos familiares
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390014', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 2, '2 empanadas carne'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390014', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 2, '2 empanadas pollo'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390014', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380005', 2, '2 empanadas pabellón'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390014', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380008', 2, '2 porciones papas'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390014', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380010', 2, '2 guasacacas'),

('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390015', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380003', 2, '2 empanadas jamón & queso'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390015', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380004', 2, '2 empanadas queso llanero'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390015', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380006', 2, '2 empanadas dominó'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390015', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380008', 1, 'Papas grande'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd390015', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380010', 2, 'Guasacacas medianas');

-- =============================================
-- RECALCULAR COSTOS Y MÁRGENES
-- =============================================
WITH costo_por_producto AS (
    SELECT
        rp.producto_id,
        SUM(
            (r.costo_total / NULLIF(r.rendimiento, 0)) * rp.cantidad
        ) AS costo_unitario
    FROM public.recetas_producto rp
    JOIN public.recetas r ON r.id = rp.receta_id
    GROUP BY rp.producto_id
)
UPDATE public.productos p
SET costo_total = ROUND(cpp.costo_unitario, 2),
    margen_ganancia = ROUND(p.precio_venta - cpp.costo_unitario, 2),
    fecha_modificacion = now()
FROM costo_por_producto cpp
WHERE p.id = cpp.producto_id;

COMMIT;
