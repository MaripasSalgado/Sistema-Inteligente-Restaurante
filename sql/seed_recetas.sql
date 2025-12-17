-- Script Modular: RECETAS COMPLETAS PARA EMPANADAS VENEZOLANAS
-- Ejecutar después de seed_inventory_suppliers.sql
-- Genera platos completos con ingredientes y pasos formales

BEGIN;

-- =============================================
-- LIMPIEZA DE DATOS ANTERIORES (POR CÓDIGO E ID)
-- =============================================

WITH recetas_existentes AS (
    SELECT id
    FROM public.recetas
    WHERE codigo IN ('REC-001','REC-002','REC-003','REC-004','REC-005','REC-006','REC-007','REC-008','REC-009','REC-010')
       OR id IN (
            'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380001',
            'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380002',
            'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380003',
            'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380004',
            'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380005',
            'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380006',
            'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380007',
            'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380008',
            'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380009',
            'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380010'
       )
)
DELETE FROM public.pasos_receta
WHERE receta_id IN (SELECT id FROM recetas_existentes);

WITH recetas_existentes AS (
    SELECT id
    FROM public.recetas
    WHERE codigo IN ('REC-001','REC-002','REC-003','REC-004','REC-005','REC-006','REC-007','REC-008','REC-009','REC-010')
       OR id IN (
            'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380001',
            'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380002',
            'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380003',
            'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380004',
            'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380005',
            'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380006',
            'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380007',
            'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380008',
            'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380009',
            'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380010'
       )
)
DELETE FROM public.ingredientes_receta
WHERE receta_id IN (SELECT id FROM recetas_existentes);

DELETE FROM public.recetas
WHERE codigo IN ('REC-001','REC-002','REC-003','REC-004','REC-005','REC-006','REC-007','REC-008','REC-009','REC-010')
   OR id IN (
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380001',
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380002',
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380003',
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380004',
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380005',
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380006',
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380007',
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380008',
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380009',
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380010'
   );

-- =============================================
-- CATEGORÍAS PARA PLATOS COMPLETOS
-- =============================================

INSERT INTO public.categorias_recetas (id, nombre, descripcion, color, icono, activa)
VALUES
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd381001', 'Empanadas Clásicas', 'Sabores tradicionales venezolanos', '#f97316', '🥟', true),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd381002', 'Empanadas Especiales', 'Rellenos con giros modernos o mixtos', '#fb7185', '🔥', true),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd381003', 'Acompañamientos Criollos', 'Guarniciones y frituras para compartir', '#22d3ee', '🍟', true),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd381004', 'Salsas y Bebidas', 'Salsas frescas y bebidas caseras', '#0ea5e9', '🥤', true)
ON CONFLICT (nombre) DO NOTHING;

-- =============================================
-- RECETAS COMPLETAS (PLATOS READY-TO-SERVE)
-- =============================================

INSERT INTO public.recetas (id, codigo, nombre, descripcion, categoria_id, tiempo_preparacion, rendimiento, nivel_dificultad, instrucciones)
VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'REC-001', 'Empanada de Carne Mechada', 'Empanada completa rellena de carne mechada criolla con masa de maíz dorada.', (SELECT id FROM public.categorias_recetas WHERE nombre = 'Empanadas Clásicas' LIMIT 1), 40, 10, 'Intermedio', 'Sigue los pasos registrados para preparar la masa, guiso y fritura.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 'REC-002', 'Empanada de Pollo Criollo', 'Empanada tradicional con guiso de pollo mechado y aliños frescos.', (SELECT id FROM public.categorias_recetas WHERE nombre = 'Empanadas Clásicas' LIMIT 1), 35, 10, 'Intermedio', 'Revisa los pasos asociados para hidratar masa, guisar pollo y freír.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380003', 'REC-003', 'Empanada Jamón y Queso', 'Versión venezolana con jamón ahumado y queso derretido.', (SELECT id FROM public.categorias_recetas WHERE nombre = 'Empanadas Clásicas' LIMIT 1), 25, 10, 'Fácil', 'Pasos disponibles describen armado y fritura controlada.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380004', 'REC-004', 'Empanada Queso Llanero', 'Empanada rellena con queso turrialba y natilla salada.', (SELECT id FROM public.categorias_recetas WHERE nombre = 'Empanadas Clásicas' LIMIT 1), 20, 10, 'Fácil', 'Consultar pasos para hidratar masa suave y sellado uniforme.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380005', 'REC-005', 'Empanada Pabellón', 'Inspirada en el pabellón criollo: carne, caraotas y queso.', (SELECT id FROM public.categorias_recetas WHERE nombre = 'Empanadas Especiales' LIMIT 1), 45, 10, 'Intermedio', 'Pasos detallan cómo preparar cada componente antes de armar.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380006', 'REC-006', 'Empanada Dominó', 'Relleno cremoso de caraotas negras y queso blanco.', (SELECT id FROM public.categorias_recetas WHERE nombre = 'Empanadas Especiales' LIMIT 1), 30, 10, 'Fácil', 'Ver pasos para cocinar caraotas, mezclar queso y freír.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380007', 'REC-007', 'Empanada Choriqueso', 'Relleno de chorizo parrillero, papa y queso turrialba.', (SELECT id FROM public.categorias_recetas WHERE nombre = 'Empanadas Especiales' LIMIT 1), 40, 10, 'Intermedio', 'Pasos explican cómo sofreír chorizo, cocinar papa y sellar.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380008', 'REC-008', 'Papas Criollas con Guasacaca', 'Papas fritas gruesas acompañadas de guasacaca fresca.', (SELECT id FROM public.categorias_recetas WHERE nombre = 'Acompañamientos Criollos' LIMIT 1), 25, 8, 'Fácil', 'Pasos describen blanqueo, fritura doble y salsa verde.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380009', 'REC-009', 'Arepitas Doradas con Queso', 'Arepitas pequeñas para compartir con queso derretido.', (SELECT id FROM public.categorias_recetas WHERE nombre = 'Acompañamientos Criollos' LIMIT 1), 30, 12, 'Fácil', 'Pasos incluyen amasado, porcionado y fritura uniforme.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380010', 'REC-010', 'Guasacaca Artesanal', 'Salsa cremosa de aguacate criollo para acompañar.', (SELECT id FROM public.categorias_recetas WHERE nombre = 'Salsas y Bebidas' LIMIT 1), 15, 20, 'Fácil', 'Pasos describen licuado, ajuste de textura y servicio.')
;

-- =============================================
-- INGREDIENTES (PLATOS COMPLETOS)
-- =============================================

-- Empanada de Carne Mechada
INSERT INTO public.ingredientes_receta (receta_id, insumo_id, cantidad, unidad_medida) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e41', 0.22, 'kg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e52', 0.01, 'kg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e51', 0.10, 'litro'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e11', 0.10, 'kg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e21', 0.12, 'kg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e23', 0.08, 'kg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e22', 2, 'unidad'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e25', 2, 'unidad'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e24', 1, 'unidad'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e54', 0.02, 'litro');

-- Empanada de Pollo Criollo
INSERT INTO public.ingredientes_receta (receta_id, insumo_id, cantidad, unidad_medida) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e41', 0.22, 'kg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e52', 0.01, 'kg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e51', 0.09, 'litro'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e12', 0.12, 'kg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e21', 0.10, 'kg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e23', 0.07, 'kg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e22', 2, 'unidad'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e25', 1, 'unidad'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e24', 1, 'unidad');

-- Empanada Jamón y Queso
INSERT INTO public.ingredientes_receta (receta_id, insumo_id, cantidad, unidad_medida) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380003', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e41', 0.22, 'kg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380003', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e52', 0.01, 'kg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380003', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e51', 0.09, 'litro'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380003', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e13', 0.08, 'kg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380003', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e32', 0.09, 'kg');

-- Empanada Queso Llanero
INSERT INTO public.ingredientes_receta (receta_id, insumo_id, cantidad, unidad_medida) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380004', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e41', 0.22, 'kg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380004', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e52', 0.01, 'kg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380004', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e51', 0.09, 'litro'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380004', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e31', 0.12, 'kg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380004', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e33', 0.05, 'kg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380004', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e24', 1, 'unidad');

-- Empanada Pabellón
INSERT INTO public.ingredientes_receta (receta_id, insumo_id, cantidad, unidad_medida) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380005', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e41', 0.22, 'kg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380005', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e52', 0.01, 'kg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380005', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e51', 0.12, 'litro'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380005', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e11', 0.09, 'kg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380005', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e44', 0.07, 'kg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380005', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e31', 0.06, 'kg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380005', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e21', 0.08, 'kg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380005', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e23', 0.06, 'kg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380005', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e22', 1, 'unidad'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380005', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e25', 1, 'unidad');

-- Empanada Dominó
INSERT INTO public.ingredientes_receta (receta_id, insumo_id, cantidad, unidad_medida) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380006', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e41', 0.22, 'kg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380006', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e52', 0.01, 'kg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380006', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e51', 0.09, 'litro'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380006', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e44', 0.10, 'kg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380006', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e31', 0.08, 'kg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380006', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e24', 1, 'unidad');

-- Empanada Choriqueso
INSERT INTO public.ingredientes_receta (receta_id, insumo_id, cantidad, unidad_medida) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380007', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e41', 0.22, 'kg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380007', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e52', 0.01, 'kg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380007', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e51', 0.10, 'litro'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380007', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e14', 0.09, 'kg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380007', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e26', 0.12, 'kg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380007', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e31', 0.08, 'kg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380007', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e21', 0.06, 'kg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380007', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e25', 1, 'unidad');

-- Papas Criollas con Guasacaca
INSERT INTO public.ingredientes_receta (receta_id, insumo_id, cantidad, unidad_medida) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380008', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e26', 1.20, 'kg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380008', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e51', 0.40, 'litro'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380008', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e52', 0.02, 'kg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380008', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e21', 0.10, 'kg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380008', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e22', 2, 'unidad'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380008', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e24', 2, 'unidad'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380008', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e25', 2, 'unidad');

-- Arepitas Doradas con Queso
INSERT INTO public.ingredientes_receta (receta_id, insumo_id, cantidad, unidad_medida) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380009', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e41', 0.50, 'kg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380009', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e31', 0.20, 'kg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380009', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e33', 0.10, 'kg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380009', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e51', 0.20, 'litro'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380009', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e52', 0.01, 'kg');

-- Guasacaca Artesanal
INSERT INTO public.ingredientes_receta (receta_id, insumo_id, cantidad, unidad_medida) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380010', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e22', 4, 'unidad'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380010', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e21', 0.20, 'kg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380010', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e24', 3, 'unidad'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380010', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e25', 3, 'unidad'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380010', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e51', 0.12, 'litro'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380010', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e52', 0.01, 'kg');

-- =============================================
-- PASOS DE PREPARACIÓN (DETALLADOS)
-- =============================================

INSERT INTO public.pasos_receta (receta_id, numero_paso, descripcion) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 1, 'Hidratar la harina con sal y agua tibia hasta lograr una masa maleable.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 2, 'Sofreír los aliños, agregar la carne y cocinar con salsa inglesa hasta espesar.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 3, 'Armar discos de masa, rellenar con el guiso y sellar bien los bordes.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 4, 'Freír en aceite caliente hasta dorar y escurrir sobre papel absorbente.'),

('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 1, 'Preparar la masa básica y dejar reposar 10 minutos.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 2, 'Sofreír pollo desmenuzado con aliños hasta secar jugos.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 3, 'Rellenar discos de masa y dar forma de media luna.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 4, 'Freír o air-freír hasta dorar y servir con guasacaca.'),

('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380003', 1, 'Amasar harina con sal y agua hasta que no se pegue.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380003', 2, 'Rellenar cada disco con jamón y queso equilibrados.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380003', 3, 'Sellar con repulgue y pinchar ligeramente la masa.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380003', 4, 'Freír en aceite medio para que el queso se derrita sin salir.'),

('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380004', 1, 'Mezclar harina con sal y suficiente agua para una masa suave.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380004', 2, 'Rellenar con queso turrialba mezclado con natilla.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380004', 3, 'Cerrar y sellar al vacío para evitar fugas.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380004', 4, 'Freír hasta dorar y escurrir en rejilla.'),

('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380005', 1, 'Preparar masa básica y reservar bolitas por porción.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380005', 2, 'Cocinar carne, caraotas y aliños por separado.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380005', 3, 'Ensamblar con capas de carne, caraotas y queso rallado.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380005', 4, 'Freír hasta dorar bien y servir con tajadas o ensalada.'),

('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380006', 1, 'Remojar y cocinar caraotas hasta que estén cremosas.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380006', 2, 'Mezclar caraotas calientes con queso desmenuzado.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380006', 3, 'Rellenar discos de masa y sellar formando un repulgue.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380006', 4, 'Freír hasta dorar y dejar reposar antes de cortar.'),

('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380007', 1, 'Pelar y pre-cocinar la papa en cubos, reservar.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380007', 2, 'Saltear chorizo con cebolla y ajo hasta dorar.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380007', 3, 'Integrar papa y queso para formar el relleno choriqueso.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380007', 4, 'Armar, sellar y freír empanadas hasta crujir.'),

('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380008', 1, 'Cortar papas en bastones y remojar en agua fría.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380008', 2, 'Secar bien y realizar primera fritura suave.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380008', 3, 'Preparar la guasacaca licuando vegetales con aceite.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380008', 4, 'Dar segunda fritura alta y servir con la salsa fresca.'),

('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380009', 1, 'Amasar harina con queso rallado, natilla y sal.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380009', 2, 'Formar bolitas pequeñas y aplanar ligeramente.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380009', 3, 'Freír en aceite medio-alto hasta dorar por ambos lados.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380009', 4, 'Escurrir y servir con más queso por encima.'),

('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380010', 1, 'Picar chiles, cebolla, culantro y ajo en trozos grandes.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380010', 2, 'Licuar con aceite y sal hasta lograr crema espesa.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380010', 3, 'Ajustar sazón con más culantro o sal al gusto.'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380010', 4, 'Refrigerar 30 minutos y servir con empanadas y papas.');

-- =============================================
-- CÁLCULO DE COSTOS Y PRECIOS
-- =============================================

UPDATE public.recetas r
SET costo_total = ROUND(LEAST((
    SELECT COALESCE(SUM(
        ir.cantidad * (
            SELECT AVG(l.precio_unitario)
            FROM public.lotes_insumos l
            WHERE l.insumo_id = ir.insumo_id
              AND l.estado = 'Activo'
        )
    ), 0)
    FROM public.ingredientes_receta ir
    WHERE ir.receta_id = r.id
), 999.99), 2)
WHERE r.id IN (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380001',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380002',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380003',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380004',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380005',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380006',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380007',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380008',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380009',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380010'
);

UPDATE public.recetas
SET precio_sugerido = ROUND(LEAST(costo_total * 1.65, 999.99), 2),
    margen_ganancia = ROUND(GREATEST(LEAST(costo_total * 1.65, 999.99) - costo_total, 0), 2),
    rentabilidad = CASE
        WHEN costo_total > 0 THEN ROUND(((ROUND(GREATEST(LEAST(costo_total * 1.65, 999.99) - costo_total, 0), 2)) / costo_total) * 100, 2)
        ELSE rentabilidad
    END
WHERE id IN (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380001',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380002',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380003',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380004',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380005',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380006',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380007',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380008',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380009',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380010'
);

COMMIT;

-- Las recetas ahora representan platos completos listos para vincular con productos/combos.
