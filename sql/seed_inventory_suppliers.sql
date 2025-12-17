-- Script Modular: INSUMOS Y PROVEEDORES (SOLO COMIDA)
-- Ejecutar después de clean_database.sql
-- Genera: Proveedores, Evaluaciones, Categorías de Insumos, Insumos, Lotes y Movimientos.
-- Moneda: Colones (CRC)

BEGIN;

-- RAISE NOTICE 'Iniciando carga de datos para Insumos y Proveedores (Solo Comida)...';

-- =============================================
-- 1. PROVEEDORES (Alimentos y Bebidas)
-- =============================================
INSERT INTO public.proveedores (id, codigo, nombre, tipo, telefono, email, direccion, contacto_principal, rtn, estado, observaciones) VALUES
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d11', 'PROV-001', 'Distribuidora La Venezolana', 'Carnes y Embutidos', '2234-5678', 'ventas@venezolana.cr', 'San José, Costa Rica', 'Carlos Martínez', '1-1111-1111', 'Activo', 'Proveedor principal de carnes y embutidos'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d12', 'PROV-002', 'Molinos de Costa Rica', 'Granos y Harinas', '2245-6789', 'info@molinos.cr', 'Alajuela, Costa Rica', 'María López', '2-2222-2222', 'Activo', 'Harinas y cereales'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d13', 'PROV-003', 'Feria del Agricultor', 'Frutas y Verduras', '8888-8888', 'feria@agricultor.cr', 'Cartago, Costa Rica', 'Jorge Rodríguez', '3-3333-3333', 'Activo', 'Verduras frescas de temporada'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d14', 'PROV-004', 'Lácteos del Volcán', 'Lácteos y Derivados', '2256-7890', 'pedidos@lacteos.cr', 'Heredia, Costa Rica', 'Ana Hernández', '4-4444-4444', 'Activo', 'Quesos y lácteos artesanales'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d16', 'PROV-006', 'Especias del Mundo', 'Condimentos y Especias', '2233-4455', 'info@especias.cr', 'Escazú, Costa Rica', 'Elena White', '6-6666-6666', 'Activo', 'Condimentos importados'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d18', 'PROV-008', 'Bebidas Tropicales', 'Bebidas', '2222-1111', 'ventas@bebidas.cr', 'Heredia, Costa Rica', 'Sofía Méndez', '8-8888-8888', 'Activo', 'Refrescos y jugos'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d19', 'PROV-009', 'Carnicería El Arreo', 'Carnes y Embutidos', '2440-5050', 'pedidos@elarreo.cr', 'Alajuela, Costa Rica', 'Pedro Ramírez', '9-9999-9999', 'Activo', 'Cortes premium'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d20', 'PROV-010', 'Abarrotes Central', 'Otros', '2221-3030', 'info@central.cr', 'San José, Costa Rica', 'Carmen Vega', '1-0000-0000', 'Activo', 'Aceites, granos y varios');

-- =============================================
-- 2. EVALUACIONES DE PROVEEDORES
-- =============================================
INSERT INTO public.evaluaciones_proveedores (proveedor_id, usuario_id, calificacion, criterios, comentarios, fecha_evaluacion) VALUES
-- La Venezolana (Carnes)
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d11', (SELECT id FROM public.usuarios LIMIT 1), 5, '{"calidad": 5, "servicio": 5, "puntualidad": 4}', 'Excelente calidad de carne, entregas a tiempo.', CURRENT_DATE - INTERVAL '1 month'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d11', (SELECT id FROM public.usuarios LIMIT 1), 4, '{"calidad": 5, "servicio": 4, "puntualidad": 3}', 'Calidad impecable pero hubo un retraso en la última entrega.', CURRENT_DATE - INTERVAL '3 months'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d11', (SELECT id FROM public.usuarios LIMIT 1), 5, '{"calidad": 5, "servicio": 5, "puntualidad": 5}', 'Perfecto, como siempre.', CURRENT_DATE - INTERVAL '5 months'),

-- Molinos de Costa Rica (Harinas)
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d12', (SELECT id FROM public.usuarios LIMIT 1), 4, '{"calidad": 4, "servicio": 4, "puntualidad": 3}', 'Buenos precios, pero a veces se atrasan.', CURRENT_DATE - INTERVAL '2 months'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d12', (SELECT id FROM public.usuarios LIMIT 1), 3, '{"calidad": 4, "servicio": 3, "puntualidad": 2}', 'Retraso de 3 días en la última entrega.', CURRENT_DATE - INTERVAL '4 months'),

-- Feria del Agricultor (Verduras)
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d13', (SELECT id FROM public.usuarios LIMIT 1), 5, '{"calidad": 5, "servicio": 5, "puntualidad": 5}', 'Vegetales muy frescos y baratos.', CURRENT_DATE - INTERVAL '15 days'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d13', (SELECT id FROM public.usuarios LIMIT 1), 5, '{"calidad": 5, "servicio": 5, "puntualidad": 5}', 'Siempre productos de primera.', CURRENT_DATE - INTERVAL '1 month'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d13', (SELECT id FROM public.usuarios LIMIT 1), 5, '{"calidad": 5, "servicio": 5, "puntualidad": 4}', 'Excelente relación calidad-precio.', CURRENT_DATE - INTERVAL '2 months'),

-- Lácteos del Volcán
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d14', (SELECT id FROM public.usuarios LIMIT 1), 4, '{"calidad": 5, "servicio": 4, "puntualidad": 4}', 'Quesos artesanales de calidad, pero un poco caros.', CURRENT_DATE - INTERVAL '20 days'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d14', (SELECT id FROM public.usuarios LIMIT 1), 5, '{"calidad": 5, "servicio": 5, "puntualidad": 5}', 'Vale la pena pagar un poco más por esta calidad.', CURRENT_DATE - INTERVAL '2 months'),

-- Especias del Mundo
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d16', (SELECT id FROM public.usuarios LIMIT 1), 4, '{"calidad": 5, "servicio": 4, "puntualidad": 4}', 'Especias de calidad premium, precio elevado.', CURRENT_DATE - INTERVAL '1 month'),

-- Bebidas Tropicales
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d18', (SELECT id FROM public.usuarios LIMIT 1), 4, '{"calidad": 4, "servicio": 4, "puntualidad": 4}', 'Buen servicio en general.', CURRENT_DATE - INTERVAL '25 days'),

-- Carnicería El Arreo
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d19', (SELECT id FROM public.usuarios LIMIT 1), 4, '{"calidad": 5, "servicio": 4, "puntualidad": 4}', 'Carne excelente pero un poco cara.', CURRENT_DATE - INTERVAL '5 days'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d19', (SELECT id FROM public.usuarios LIMIT 1), 5, '{"calidad": 5, "servicio": 5, "puntualidad": 5}', 'Los cortes premium valen cada colón.', CURRENT_DATE - INTERVAL '1 month'),

-- Abarrotes Central
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d20', (SELECT id FROM public.usuarios LIMIT 1), 4, '{"calidad": 4, "servicio": 4, "puntualidad": 4}', 'Precios muy competitivos.', CURRENT_DATE - INTERVAL '10 days'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d20', (SELECT id FROM public.usuarios LIMIT 1), 3, '{"calidad": 3, "servicio": 3, "puntualidad": 4}', 'El aceite del último lote no era de la mejor calidad.', CURRENT_DATE - INTERVAL '3 months'),

-- Evaluaciones de Diciembre (Mes Actual)
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d11', (SELECT id FROM public.usuarios LIMIT 1), 5, '{"calidad": 5, "servicio": 5, "puntualidad": 5}', 'Excelente servicio en diciembre.', CURRENT_DATE),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d13', (SELECT id FROM public.usuarios LIMIT 1), 5, '{"calidad": 5, "servicio": 5, "puntualidad": 5}', 'Productos frescos para las fiestas.', CURRENT_DATE - INTERVAL '1 day'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d14', (SELECT id FROM public.usuarios LIMIT 1), 4, '{"calidad": 5, "servicio": 4, "puntualidad": 4}', 'Buenos quesos para la temporada.', CURRENT_DATE - INTERVAL '2 days');

-- =============================================
-- 3. CATEGORÍAS DE INSUMOS
-- =============================================
INSERT INTO public.categorias_insumos (id, nombre, descripcion, color, icono, activa) VALUES
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f11', 'Carnes y Embutidos', 'Carnes rojas, blancas y procesadas', '#EF4444', '🥩', true),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f12', 'Verduras y Hortalizas', 'Vegetales frescos', '#10B981', '🥬', true),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f13', 'Lácteos', 'Leche, quesos y derivados', '#F59E0B', '🧀', true),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f14', 'Granos y Harinas', 'Harinas, arroz, frijoles', '#D97706', '🌾', true),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f15', 'Condimentos y Especias', 'Sal, pimienta, salsas', '#8B5CF6', '🧂', true),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f18', 'Bebidas e Insumos Líquidos', 'Concentrados, jugos', '#EC4899', '🥤', true);

-- =============================================
-- 4. INSUMOS (Solo Comida)
-- =============================================
INSERT INTO public.insumos (id, codigo, nombre, descripcion, unidad_medida, stock_minimo, stock_maximo, proveedor_principal_id, estado) VALUES
-- Carnes
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e11', 'CAR-001', 'Carne Molida Premium', 'Posta de cuarto 95% libre de grasa', 'kg', 10, 50, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d11', 'Activo'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e12', 'CAR-002', 'Pollo Desmenuzado', 'Pechuga cocida y desmenuzada', 'kg', 8, 40, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d11', 'Activo'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e13', 'CAR-003', 'Jamón de Cerdo', 'Jamón prensado para relleno', 'kg', 5, 20, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d11', 'Activo'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e14', 'CAR-004', 'Chorizo Parrillero', 'Chorizo suelto', 'kg', 5, 25, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d19', 'Activo'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e15', 'CAR-005', 'Tocino Ahumado', 'Tiras de tocino', 'kg', 2, 10, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d19', 'Activo'),

-- Verduras
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e21', 'VER-001', 'Cebolla Blanca', 'Cebolla nacional', 'kg', 5, 30, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d13', 'Activo'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e22', 'VER-002', 'Chile Dulce', 'Pimiento rojo/verde', 'unidad', 10, 50, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d13', 'Activo'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e23', 'VER-003', 'Tomate', 'Tomate perita', 'kg', 5, 25, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d13', 'Activo'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e24', 'VER-004', 'Culantro Castilla', 'Rollos frescos', 'unidad', 5, 20, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d13', 'Activo'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e25', 'VER-005', 'Ajo', 'Cabezas de ajo', 'unidad', 5, 30, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d13', 'Activo'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e26', 'VER-006', 'Papa', 'Papa blanca lavada', 'kg', 20, 100, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d13', 'Activo'),

-- Lácteos
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e31', 'LAC-001', 'Queso Turrialba', 'Fresco para freír', 'kg', 5, 30, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d14', 'Activo'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e32', 'LAC-002', 'Queso Mozzarella', 'Rallado para derretir', 'kg', 5, 40, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d14', 'Activo'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e33', 'LAC-003', 'Natilla', 'Natilla casera con sal', 'kg', 2, 15, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d14', 'Activo'),

-- Granos y Harinas
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e41', 'HAR-001', 'Harina de Maíz', 'Masa para empanadas', 'kg', 20, 150, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d12', 'Activo'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e42', 'HAR-002', 'Harina de Trigo', 'Todo uso', 'kg', 10, 50, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d12', 'Activo'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e43', 'GRA-001', 'Arroz', 'Grano entero 99%', 'kg', 10, 60, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d12', 'Activo'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e44', 'GRA-002', 'Frijoles Negros', 'Frijol nuevo', 'kg', 10, 60, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d12', 'Activo'),

-- Condimentos
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e51', 'CON-001', 'Aceite Vegetal', 'Bidón 20L', 'litro', 20, 100, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d20', 'Activo'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e52', 'CON-002', 'Sal', 'Sal refinada', 'kg', 5, 20, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d20', 'Activo'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e53', 'CON-003', 'Pimienta Negra', 'Molida', 'kg', 0.5, 2, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d16', 'Activo'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e54', 'CON-004', 'Salsa Inglesa', 'Galón', 'litro', 2, 10, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d16', 'Activo');

-- Relacionar Insumos con Categorías
INSERT INTO public.insumos_categorias (insumo_id, categoria_id) VALUES
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e11', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f11'), ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e12', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f11'), ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e13', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f11'), ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e14', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f11'), ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e15', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f11'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e21', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f12'), ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e22', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f12'), ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e23', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f12'), ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e24', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f12'), ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e25', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f12'), ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e26', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f12'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e31', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f13'), ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e32', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f13'), ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e33', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f13'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e41', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f14'), ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e42', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f14'), ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e43', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f14'), ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e44', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f14'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e51', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f15'), ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e52', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f15'), ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e53', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f15'), ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e54', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f15');

-- =============================================
-- 5. LOTES (Inventario Inicial - Múltiples lotes)
-- =============================================
INSERT INTO public.lotes_insumos (id, insumo_id, lote, cantidad_inicial, cantidad_actual, precio_unitario, proveedor_id, fecha_ingreso, fecha_vencimiento, estado) VALUES
-- Carne (2 lotes, uno nuevo y uno viejo)
(gen_random_uuid(), 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e11', 'L-CAR-001', 40, 10, 4500.00, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d11', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '2 days', 'Activo'),
(gen_random_uuid(), 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e11', 'L-CAR-002', 50, 50, 4600.00, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d11', CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE + INTERVAL '12 days', 'Activo'),

-- Pollo (Stock BAJO)
(gen_random_uuid(), 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e12', 'L-POL-001', 20, 4, 3800.00, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d11', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '5 days', 'Activo'),

-- Harina (Stock OK)
(gen_random_uuid(), 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e41', 'L-HAR-001', 100, 80, 800.00, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d12', CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE + INTERVAL '6 months', 'Activo'),

-- Queso (Stock OK)
(gen_random_uuid(), 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e31', 'L-QUE-001', 30, 25, 3500.00, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d14', CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE + INTERVAL '15 days', 'Activo'),

-- Aceite (Stock OK)
(gen_random_uuid(), 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e51', 'L-ACE-001', 50, 40, 1200.00, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d20', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE + INTERVAL '1 year', 'Activo'),

-- Verduras (Rotación rápida)
(gen_random_uuid(), 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e21', 'L-CEB-001', 20, 15, 600.00, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d13', CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE + INTERVAL '10 days', 'Activo'),
(gen_random_uuid(), 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e23', 'L-TOM-001', 15, 10, 800.00, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d13', CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE + INTERVAL '5 days', 'Activo');

-- =============================================
-- 6. MOVIMIENTOS DE INVENTARIO (Historial)
-- =============================================
-- Entradas iniciales
INSERT INTO public.movimientos_inventario (lote_id, tipo, cantidad, motivo, costo_unitario, costo_total, usuario_id, fecha_movimiento) 
SELECT id, 'Entrada', cantidad_inicial, 'Compra Inicial', precio_unitario, cantidad_inicial * precio_unitario, (SELECT id FROM public.usuarios LIMIT 1), fecha_ingreso 
FROM public.lotes_insumos;

-- Salidas simuladas (Consumo diario)
-- Carne
INSERT INTO public.movimientos_inventario (lote_id, tipo, cantidad, motivo, costo_unitario, costo_total, usuario_id, fecha_movimiento) VALUES
((SELECT id FROM public.lotes_insumos WHERE lote = 'L-CAR-001'), 'Salida', 10, 'Producción Lunes', 4500.00, 45000.00, (SELECT id FROM public.usuarios LIMIT 1), CURRENT_DATE - INTERVAL '8 days'),
((SELECT id FROM public.lotes_insumos WHERE lote = 'L-CAR-001'), 'Salida', 10, 'Producción Martes', 4500.00, 45000.00, (SELECT id FROM public.usuarios LIMIT 1), CURRENT_DATE - INTERVAL '7 days'),
((SELECT id FROM public.lotes_insumos WHERE lote = 'L-CAR-001'), 'Salida', 10, 'Producción Miércoles', 4500.00, 45000.00, (SELECT id FROM public.usuarios LIMIT 1), CURRENT_DATE - INTERVAL '6 days');

-- Pollo (Consumo alto)
INSERT INTO public.movimientos_inventario (lote_id, tipo, cantidad, motivo, costo_unitario, costo_total, usuario_id, fecha_movimiento) VALUES
((SELECT id FROM public.lotes_insumos WHERE lote = 'L-POL-001'), 'Salida', 5, 'Producción Lunes', 3800.00, 19000.00, (SELECT id FROM public.usuarios LIMIT 1), CURRENT_DATE - INTERVAL '4 days'),
((SELECT id FROM public.lotes_insumos WHERE lote = 'L-POL-001'), 'Salida', 6, 'Producción Martes', 3800.00, 22800.00, (SELECT id FROM public.usuarios LIMIT 1), CURRENT_DATE - INTERVAL '3 days'),
((SELECT id FROM public.lotes_insumos WHERE lote = 'L-POL-001'), 'Salida', 5, 'Producción Miércoles', 3800.00, 19000.00, (SELECT id FROM public.usuarios LIMIT 1), CURRENT_DATE - INTERVAL '2 days');

-- Harina
INSERT INTO public.movimientos_inventario (lote_id, tipo, cantidad, motivo, costo_unitario, costo_total, usuario_id, fecha_movimiento) VALUES
((SELECT id FROM public.lotes_insumos WHERE lote = 'L-HAR-001'), 'Salida', 20, 'Producción Masa Semanal', 800.00, 16000.00, (SELECT id FROM public.usuarios LIMIT 1), CURRENT_DATE - INTERVAL '5 days');

-- RAISE NOTICE 'Carga de Insumos y Proveedores (Solo Comida) completada exitosamente.';

COMMIT;
