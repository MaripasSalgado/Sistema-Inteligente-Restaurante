export const mockCategorias = [
  { id: 1, nombre: 'Carnes y Embutidos', color: '#f4b400', icono: '🥩' },
  { id: 2, nombre: 'Lácteos', color: '#f4b400', icono: '🥛' },
  { id: 3, nombre: 'Verduras y Hortalizas', color: '#f4b400', icono: '🥬' },
  { id: 4, nombre: 'Harinas y Cereales', color: '#f4b400', icono: '🌾' },
  { id: 5, nombre: 'Condimentos y Especias', color: '#f4b400', icono: '🧂' },
  { id: 6, nombre: 'Aceites y Grasas', color: '#f4b400', icono: '🫒' }
];

export const mockIngredientes = [
  { id: 1, nombre: 'Harina de Trigo', precioUnitario: 1.50, unidad: 'kg', disponible: true, stock: 25 },
  { id: 2, nombre: 'Carne Molida', precioUnitario: 8.50, unidad: 'kg', disponible: true, stock: 15 },
  { id: 3, nombre: 'Cebolla', precioUnitario: 2.00, unidad: 'kg', disponible: true, stock: 8 },
  { id: 4, nombre: 'Huevo', precioUnitario: 0.25, unidad: 'unidad', disponible: true, stock: 50 },
  { id: 5, nombre: 'Aceite', precioUnitario: 3.00, unidad: 'litro', disponible: true, stock: 5 },
  { id: 6, nombre: 'Sal', precioUnitario: 0.80, unidad: 'kg', disponible: true, stock: 2 },
  { id: 7, nombre: 'Queso', precioUnitario: 12.00, unidad: 'kg', disponible: false, stock: 0 },
  { id: 8, nombre: 'Tomate', precioUnitario: 2.50, unidad: 'kg', disponible: true, stock: 6 },
  { id: 9, nombre: 'Limón', precioUnitario: 0.50, unidad: 'unidad', disponible: true, stock: 20 },
  { id: 10, nombre: 'Azúcar', precioUnitario: 1.20, unidad: 'kg', disponible: true, stock: 10 },
  { id: 11, nombre: 'Leche', precioUnitario: 2.80, unidad: 'litro', disponible: true, stock: 8 },
  { id: 12, nombre: 'Mantequilla', precioUnitario: 4.50, unidad: 'kg', disponible: true, stock: 3 }
];

export const mockRecetas = [
  {
    id: 1,
    codigo: 'REC-EMP-001',
    nombre: 'Empanada de Carne',
    categoriaId: 1,
    categoria: 'Empanadas',
    estado: 'Activa',
    tiempoPreparacion: 45, // minutos
    rendimiento: 12, // porciones
    popularidad: 5, // estrellas
    rentabilidad: 65, // porcentaje de margen
    fechaCreacion: '2024-12-01',
    ultimaModificacion: '2025-01-15',
    vecesPreparada: 156,
    ingredientes: [
      { ingredienteId: 1, nombre: 'Harina de Trigo', cantidad: 0.5, unidad: 'kg', precioUnitario: 1.50, subtotal: 0.75 },
      { ingredienteId: 2, nombre: 'Carne Molida', cantidad: 0.3, unidad: 'kg', precioUnitario: 8.50, subtotal: 2.55 },
      { ingredienteId: 3, nombre: 'Cebolla', cantidad: 0.1, unidad: 'kg', precioUnitario: 2.00, subtotal: 0.20 },
      { ingredienteId: 4, nombre: 'Huevo', cantidad: 2, unidad: 'unidad', precioUnitario: 0.25, subtotal: 0.50 },
      { ingredienteId: 5, nombre: 'Aceite', cantidad: 0.05, unidad: 'litro', precioUnitario: 3.00, subtotal: 0.15 },
      { ingredienteId: 6, nombre: 'Sal', cantidad: 0.01, unidad: 'kg', precioUnitario: 0.80, subtotal: 0.008 }
    ],
    costoTotal: 4.158, // suma automática de subtotales
    costoPorPorcion: 0.347, // costoTotal / rendimiento
    pasos: [
      '1. Preparar la masa mezclando harina, huevo y sal',
      '2. Sofreír la cebolla hasta que esté transparente',
      '3. Agregar la carne molida y cocinar por 15 minutos',
      '4. Extender la masa y cortar círculos de 12cm',
      '5. Rellenar con la mezcla de carne',
      '6. Cerrar y sellar los bordes',
      '7. Freír en aceite caliente hasta dorar'
    ]
  },
  {
    id: 2,
    codigo: 'REC-BEB-001',
    nombre: 'Refresco Natural de Limón',
    categoriaId: 2,
    categoria: 'Bebidas',
    estado: 'Borrador',
    tiempoPreparacion: 10,
    rendimiento: 4,
    popularidad: 3,
    rentabilidad: 80,
    fechaCreacion: '2025-01-20',
    ultimaModificacion: '2025-01-20',
    vecesPreparada: 0,
    ingredientes: [
      { ingredienteId: 9, nombre: 'Limón', cantidad: 4, unidad: 'unidad', precioUnitario: 0.50, subtotal: 2.00 },
      { ingredienteId: 10, nombre: 'Azúcar', cantidad: 0.1, unidad: 'kg', precioUnitario: 1.20, subtotal: 0.12 }
    ],
    costoTotal: 2.12,
    costoPorPorcion: 0.53,
    pasos: [
      '1. Exprimir los limones',
      '2. Agregar azúcar al gusto',
      '3. Servir con hielo'
    ]
  },
  {
    id: 3,
    codigo: 'REC-POS-001',
    nombre: 'Flan Casero',
    categoriaId: 3,
    categoria: 'Postres',
    estado: 'Activa',
    tiempoPreparacion: 60,
    rendimiento: 8,
    popularidad: 4,
    rentabilidad: 70,
    fechaCreacion: '2024-11-15',
    ultimaModificacion: '2025-01-10',
    vecesPreparada: 89,
    ingredientes: [
      { ingredienteId: 4, nombre: 'Huevo', cantidad: 6, unidad: 'unidad', precioUnitario: 0.25, subtotal: 1.50 },
      { ingredienteId: 10, nombre: 'Azúcar', cantidad: 0.2, unidad: 'kg', precioUnitario: 1.20, subtotal: 0.24 },
      { ingredienteId: 11, nombre: 'Leche', cantidad: 0.5, unidad: 'litro', precioUnitario: 2.80, subtotal: 1.40 },
      { ingredienteId: 12, nombre: 'Mantequilla', cantidad: 0.05, unidad: 'kg', precioUnitario: 4.50, subtotal: 0.225 }
    ],
    costoTotal: 3.365,
    costoPorPorcion: 0.421,
    pasos: [
      '1. Preparar caramelo con azúcar',
      '2. Batir huevos con azúcar',
      '3. Agregar leche y mantequilla',
      '4. Verter en molde con caramelo',
      '5. Hornear a baño maría por 45 minutos'
    ]
  },
  {
    id: 4,
    codigo: 'REC-GUA-001',
    nombre: 'Ensalada César',
    categoriaId: 4,
    categoria: 'Guarniciones',
    estado: 'Activa',
    tiempoPreparacion: 20,
    rendimiento: 4,
    popularidad: 4,
    rentabilidad: 75,
    fechaCreacion: '2024-12-10',
    ultimaModificacion: '2025-01-05',
    vecesPreparada: 67,
    ingredientes: [
      { ingredienteId: 8, nombre: 'Tomate', cantidad: 0.3, unidad: 'kg', precioUnitario: 2.50, subtotal: 0.75 },
      { ingredienteId: 3, nombre: 'Cebolla', cantidad: 0.1, unidad: 'kg', precioUnitario: 2.00, subtotal: 0.20 },
      { ingredienteId: 5, nombre: 'Aceite', cantidad: 0.02, unidad: 'litro', precioUnitario: 3.00, subtotal: 0.06 },
      { ingredienteId: 6, nombre: 'Sal', cantidad: 0.005, unidad: 'kg', precioUnitario: 0.80, subtotal: 0.004 }
    ],
    costoTotal: 1.014,
    costoPorPorcion: 0.254,
    pasos: [
      '1. Lavar y cortar tomates',
      '2. Picar cebolla finamente',
      '3. Mezclar ingredientes',
      '4. Agregar aceite y sal',
      '5. Servir fresco'
    ]
  },
  {
    id: 5,
    codigo: 'REC-SAL-001',
    nombre: 'Salsa Chimichurri',
    categoriaId: 5,
    categoria: 'Salsas',
    estado: 'Activa',
    tiempoPreparacion: 15,
    rendimiento: 6,
    popularidad: 5,
    rentabilidad: 85,
    fechaCreacion: '2024-10-20',
    ultimaModificacion: '2025-01-12',
    vecesPreparada: 123,
    ingredientes: [
      { ingredienteId: 3, nombre: 'Cebolla', cantidad: 0.05, unidad: 'kg', precioUnitario: 2.00, subtotal: 0.10 },
      { ingredienteId: 5, nombre: 'Aceite', cantidad: 0.1, unidad: 'litro', precioUnitario: 3.00, subtotal: 0.30 },
      { ingredienteId: 6, nombre: 'Sal', cantidad: 0.005, unidad: 'kg', precioUnitario: 0.80, subtotal: 0.004 },
      { ingredienteId: 9, nombre: 'Limón', cantidad: 1, unidad: 'unidad', precioUnitario: 0.50, subtotal: 0.50 }
    ],
    costoTotal: 0.904,
    costoPorPorcion: 0.151,
    pasos: [
      '1. Picar cebolla finamente',
      '2. Agregar aceite de oliva',
      '3. Exprimir limón',
      '4. Agregar sal al gusto',
      '5. Dejar reposar 30 minutos'
    ]
  },
  {
    id: 6,
    codigo: 'REC-PAP-001',
    nombre: 'Papas Fritas',
    categoriaId: 6,
    categoria: 'Acompañamientos',
    estado: 'Activa',
    tiempoPreparacion: 25,
    rendimiento: 8,
    popularidad: 5,
    rentabilidad: 75,
    fechaCreacion: '2024-12-01',
    ultimaModificacion: '2024-12-20',
    vecesPreparada: 320,
    ingredientes: [
      { ingredienteId: 13, nombre: 'Papas', cantidad: 2.0, unidad: 'kg', precioUnitario: 1.20, subtotal: 2.40 },
      { ingredienteId: 14, nombre: 'Aceite', cantidad: 0.5, unidad: 'litro', precioUnitario: 3.00, subtotal: 1.50 },
      { ingredienteId: 6, nombre: 'Sal', cantidad: 0.02, unidad: 'kg', precioUnitario: 0.80, subtotal: 0.016 }
    ],
    costoTotal: 3.916,
    costoPorPorcion: 0.490,
    pasos: [
      '1. Pelar y cortar papas en bastones',
      '2. Enjuagar para quitar almidón',
      '3. Secar completamente',
      '4. Freír en aceite caliente hasta dorar',
      '5. Escurrir en papel absorbente',
      '6. Salar al gusto'
    ]
  }
];

export const mockHistorialUso = [
  { recetaId: 1, fecha: '2025-01-22', cantidadPreparada: 24, empleado: 'Juan Pérez' },
  { recetaId: 1, fecha: '2025-01-21', cantidadPreparada: 36, empleado: 'María González' },
  { recetaId: 3, fecha: '2025-01-20', cantidadPreparada: 8, empleado: 'Carlos López' },
  { recetaId: 5, fecha: '2025-01-19', cantidadPreparada: 12, empleado: 'Ana Martínez' },
  { recetaId: 4, fecha: '2025-01-18', cantidadPreparada: 8, empleado: 'Luis Rodríguez' }
];

export const mockInsumos = [
  {
    id: 1,
    codigo: 'CM-2025-001',
    nombre: 'Carne Molida',
    descripcion: 'Carne molida fresca para empanadas',
    unidadMedida: 'kg',
    stockMinimo: 5,
    stockMaximo: 50,
    proveedorPrincipal: 'Distribuidora San José',
    estado: 'Activo',
    observaciones: 'Mantener refrigerado',
    lotes: [
      {
        id: 1,
        lote: 'CM-2025-001-A',
        cantidadInicial: 20,
        cantidadActual: 15,
        precioUnitario: 8.50,
        proveedor: 'Distribuidora San José',
        fechaIngreso: '2025-01-20',
        fechaVencimiento: '2025-01-25',
        estado: 'Activo',
        observaciones: 'Lote principal'
      }
    ],
    categorias: [1] // Relación con categorías
  },
  {
    id: 2,
    codigo: 'HT-2025-003',
    nombre: 'Harina de Trigo',
    descripcion: 'Harina de trigo para masa de empanadas',
    unidadMedida: 'kg',
    stockMinimo: 10,
    stockMaximo: 100,
    proveedorPrincipal: 'Molinos del Valle',
    estado: 'Activo',
    observaciones: 'Almacenar en lugar seco',
    lotes: [
      {
        id: 2,
        lote: 'HT-2025-003-B',
        cantidadInicial: 25,
        cantidadActual: 25,
        precioUnitario: 1.50,
        proveedor: 'Molinos del Valle',
        fechaIngreso: '2025-01-15',
        fechaVencimiento: '2025-03-15',
        estado: 'Activo',
        observaciones: 'Lote fresco'
      }
    ],
    categorias: [4]
  },
  {
    id: 3,
    codigo: 'LE-2025-002',
    nombre: 'Leche Entera',
    descripcion: 'Leche entera fresca para recetas',
    unidadMedida: 'litros',
    stockMinimo: 3,
    stockMaximo: 20,
    proveedorPrincipal: 'Lácteos La Esperanza',
    estado: 'Activo',
    observaciones: 'Mantener refrigerado',
    lotes: [
      {
        id: 3,
        lote: 'LE-2025-002-C',
        cantidadInicial: 8,
        cantidadActual: 8,
        precioUnitario: 2.80,
        proveedor: 'Lácteos La Esperanza',
        fechaIngreso: '2025-01-23',
        fechaVencimiento: '2025-01-28',
        estado: 'Activo',
        observaciones: 'Próximo a vencer'
      }
    ],
    categorias: [2]
  },
  {
    id: 4,
    codigo: 'CE-2025-004',
    nombre: 'Cebolla',
    descripcion: 'Cebolla fresca para preparaciones',
    unidadMedida: 'kg',
    stockMinimo: 2,
    stockMaximo: 20,
    proveedorPrincipal: 'Verduras Frescas SA',
    estado: 'Activo',
    observaciones: 'Almacenar en lugar fresco',
    lotes: [
      {
        id: 4,
        lote: 'CE-2025-004-D',
        cantidadInicial: 12,
        cantidadActual: 12,
        precioUnitario: 2.00,
        proveedor: 'Verduras Frescas SA',
        fechaIngreso: '2025-01-21',
        fechaVencimiento: '2025-01-26',
        estado: 'Activo',
        observaciones: 'Próximo a vencer'
      }
    ],
    categorias: [3]
  },
  {
    id: 5,
    codigo: 'PO-2025-005',
    nombre: 'Pollo Entero',
    descripcion: 'Pollo entero fresco para preparaciones',
    unidadMedida: 'kg',
    stockMinimo: 5,
    stockMaximo: 30,
    proveedorPrincipal: 'Carnicería El Buen Sabor',
    estado: 'Activo',
    observaciones: 'Mantener refrigerado',
    lotes: [
      {
        id: 5,
        lote: 'PO-2025-005-E',
        cantidadInicial: 6,
        cantidadActual: 6,
        precioUnitario: 6.50,
        proveedor: 'Carnicería El Buen Sabor',
        fechaIngreso: '2025-01-22',
        fechaVencimiento: '2025-01-27',
        estado: 'Activo',
        observaciones: 'Próximo a vencer'
      }
    ],
    categorias: [1]
  },
  {
    id: 6,
    codigo: 'AC-2025-006',
    nombre: 'Aceite de Oliva',
    descripcion: 'Aceite de oliva extra virgen',
    unidadMedida: 'litros',
    stockMinimo: 2,
    stockMaximo: 10,
    proveedorPrincipal: 'Aceites Premium',
    estado: 'Activo',
    observaciones: 'Almacenar en lugar fresco',
    lotes: [
      {
        id: 6,
        lote: 'AC-2025-006-F',
        cantidadInicial: 4,
        cantidadActual: 4,
        precioUnitario: 12.00,
        proveedor: 'Aceites Premium',
        fechaIngreso: '2025-01-10',
        fechaVencimiento: '2025-07-10',
        estado: 'Activo',
        observaciones: 'Lote estable'
      }
    ],
    categorias: [6]
  }
]

// Mock de movimientos de inventario
export const mockMovimientos = [
  {
    id: 1,
    loteId: 1,
    insumoId: 1,
    tipo: 'Entrada',
    cantidad: 20,
    motivo: 'Compra a proveedor',
    documento: 'FAC-001234',
    costoUnitario: 8.50,
    costoTotal: 170.00,
    usuarioId: 1,
    fechaMovimiento: '2025-01-20T10:00:00',
    observaciones: 'Lote principal'
  },
  {
    id: 2,
    loteId: 1,
    insumoId: 1,
    tipo: 'Salida',
    cantidad: 5,
    motivo: 'Uso en receta: Empanada de Carne',
    documento: '',
    costoUnitario: 8.50,
    costoTotal: 42.50,
    usuarioId: 2,
    fechaMovimiento: '2025-01-22T14:30:00',
    observaciones: 'Para preparación de empanadas'
  }
]

export const mockProveedores = [
  'Distribuidora San José',
  'Molinos del Valle',
  'Lácteos La Esperanza',
  'Verduras Frescas SA',
  'Carnicería El Buen Sabor',
  'Aceites Premium',
  'Condimentos El Sabor',
  'Granja San Martín'
]

export const mockMotivos = [
  'Desperdicio por caducidad',
  'Ajuste de inventario',
  'Producto dañado',
  'Uso en receta',
  'Pérdida por manipulación',
  'Compra a proveedor',
  'Transferencia entre almacenes',
  'Merma por cocción'
]

export const mockUnidadesMedida = [
  'kg',
  'litros',
  'unidades',
  'gramos',
  'mililitros',
  'paquetes',
  'cajas',
  'botellas'
]

// Datos mock para Productos (combinaciones de recetas)
export const mockCategoriasProductos = [
  {
    id: 1,
    nombre: 'Empanadas',
    descripcion: 'Empanadas tradicionales y especiales',
    color: '#F4B400',
    margenEstandar: 60, // porcentaje
    activa: true
  },
  {
    id: 2,
    nombre: 'Bebidas',
    descripcion: 'Bebidas naturales y procesadas',
    color: '#3b82f6',
    margenEstandar: 70,
    activa: true
  },
  {
    id: 3,
    nombre: 'Combos',
    descripcion: 'Combinaciones de productos',
    color: '#ef4444',
    margenEstandar: 50,
    activa: true
  },
  {
    id: 4,
    nombre: 'Postres',
    descripcion: 'Postres y dulces caseros',
    color: '#8b5cf6',
    margenEstandar: 65,
    activa: true
  }
];

export const mockProductos = [
  {
    id: 1,
    codigo: 'PROD-001',
    nombre: 'Empanada Individual de Carne',
    descripcion: 'Empanada tradicional de carne molida con especias',
    categoriaId: 1,
    categoria: 'Empanadas',
    estado: 'Activo',
    fechaCreacion: '2024-12-01',
    recetas: [
      {
        recetaId: 1,
        nombre: 'Empanada de Carne',
        cantidad: 1, // 1 empanada
        costoUnitario: 0.347,
        subtotal: 0.347
      }
    ],
    costoTotal: 0.347,
    precioVenta: 1.000,
    margenGanancia: 65.3, // porcentaje
    gananciaUnitaria: 0.653,
    ventasRegistradas: 245, // para validar eliminación
    ultimaVenta: '2025-01-22'
  },
  {
    id: 2,
    codigo: 'PROD-002',
    nombre: 'Combo Empanada + Refresco',
    descripcion: 'Empanada de carne con refresco natural de limón',
    categoriaId: 3,
    categoria: 'Combos',
    estado: 'Activo',
    fechaCreacion: '2024-12-15',
    recetas: [
      {
        recetaId: 1,
        nombre: 'Empanada de Carne',
        cantidad: 1,
        costoUnitario: 0.347,
        subtotal: 0.347
      },
      {
        recetaId: 3,
        nombre: 'Refresco de Limón',
        cantidad: 1,
        costoUnitario: 0.625,
        subtotal: 0.625
      }
    ],
    costoTotal: 0.972,
    precioVenta: 2.000,
    margenGanancia: 51.4,
    gananciaUnitaria: 1.028,
    ventasRegistradas: 89,
    ultimaVenta: '2025-01-21'
  },
  {
    id: 3,
    codigo: 'PROD-003',
    nombre: 'Empanada Premium con Salsas',
    descripcion: 'Empanada de queso con dos salsas especiales',
    categoriaId: 1,
    categoria: 'Empanadas',
    estado: 'Inactivo',
    fechaCreacion: '2025-01-10',
    recetas: [
      {
        recetaId: 2,
        nombre: 'Empanada de Queso',
        cantidad: 1,
        costoUnitario: 0.321,
        subtotal: 0.321
      },
      {
        recetaId: 4,
        nombre: 'Salsa Picante',
        cantidad: 2, // 2 porciones de salsa
        costoUnitario: 0.050,
        subtotal: 0.100
      }
    ],
    costoTotal: 0.421,
    precioVenta: 1.500,
    margenGanancia: 71.9,
    gananciaUnitaria: 1.079,
    ventasRegistradas: 0, // sin ventas, puede eliminarse
    ultimaVenta: null
  },
  {
    id: 4,
    codigo: 'PROD-004',
    nombre: 'Combo Familiar',
    descripcion: '4 empanadas + 2 refrescos + papas fritas',
    categoriaId: 3,
    categoria: 'Combos',
    estado: 'Activo',
    fechaCreacion: '2025-01-05',
    recetas: [
      {
        recetaId: 1,
        nombre: 'Empanada de Carne',
        cantidad: 4,
        costoUnitario: 0.347,
        subtotal: 1.388
      },
      {
        recetaId: 3,
        nombre: 'Refresco de Limón',
        cantidad: 2,
        costoUnitario: 0.625,
        subtotal: 1.250
      },
      {
        recetaId: 5,
        nombre: 'Papas Fritas',
        cantidad: 1,
        costoUnitario: 0.800,
        subtotal: 0.800
      }
    ],
    costoTotal: 3.438,
    precioVenta: 8.000,
    margenGanancia: 57.0,
    gananciaUnitaria: 4.562,
    ventasRegistradas: 156,
    ultimaVenta: '2025-01-22'
  }
];

export const mockHistorialVentas = [
  { productoId: 1, fecha: '2025-01-22', cantidad: 15, total: 15.000 },
  { productoId: 1, fecha: '2025-01-21', cantidad: 12, total: 12.000 },
  { productoId: 2, fecha: '2025-01-22', cantidad: 8, total: 16.000 },
  { productoId: 2, fecha: '2025-01-21', cantidad: 10, total: 20.000 },
  { productoId: 4, fecha: '2025-01-22', cantidad: 5, total: 40.000 },
  { productoId: 4, fecha: '2025-01-21', cantidad: 7, total: 56.000 }
];

// Datos mock para Ventas
export const mockVentas = [
  {
    id: 1,
    numeroOrden: 'ORD-0001',
    fecha: '2025-01-22',
    hora: '14:30',
    cliente: 'Juan Pérez',
    telefono: '+503 7123-4567',
    direccion: 'San Salvador, El Salvador',
    tipoVenta: 'Delivery',
    estado: 'Completada',
    productos: [
      {
        id: 1,
        nombre: 'Empanada Individual de Carne',
        cantidad: 2,
        precioUnitario: 1.00,
        subtotal: 2.00
      },
      {
        id: 2,
        nombre: 'Combo Empanada + Refresco',
        cantidad: 1,
        precioUnitario: 2.00,
        subtotal: 2.00
      }
    ],
    subtotal: 4.00,
    impuesto: 0.40,
    descuento: 0.00,
    total: 4.40,
    metodoPago: 'Efectivo',
    empleado: 'María González',
    notas: 'Sin cebolla en las empanadas'
  },
  {
    id: 2,
    numeroOrden: 'ORD-0002',
    fecha: '2025-01-22',
    hora: '15:45',
    cliente: 'Ana López',
    telefono: '+503 7234-5678',
    direccion: 'Santa Tecla, La Libertad',
    tipoVenta: 'Para Llevar',
    estado: 'Completada',
    productos: [
      {
        id: 4,
        nombre: 'Combo Familiar',
        cantidad: 1,
        precioUnitario: 8.00,
        subtotal: 8.00
      }
    ],
    subtotal: 8.00,
    impuesto: 0.80,
    descuento: 1.00,
    total: 7.80,
    metodoPago: 'Tarjeta',
    empleado: 'Carlos Rodríguez',
    notas: 'Combo para 4 personas'
  },
  {
    id: 3,
    numeroOrden: 'ORD-0003',
    fecha: '2025-01-22',
    hora: '16:20',
    cliente: 'Roberto Martínez',
    telefono: '+503 7345-6789',
    direccion: 'San Salvador, El Salvador',
    tipoVenta: 'Local',
    estado: 'En Proceso',
    productos: [
      {
        id: 1,
        nombre: 'Empanada Individual de Carne',
        cantidad: 3,
        precioUnitario: 1.00,
        subtotal: 3.00
      },
      {
        id: 3,
        nombre: 'Empanada Premium con Salsas',
        cantidad: 2,
        precioUnitario: 1.50,
        subtotal: 3.00
      }
    ],
    subtotal: 6.00,
    impuesto: 0.60,
    descuento: 0.00,
    total: 6.60,
    metodoPago: 'Efectivo',
    empleado: 'María González',
    notas: 'Servir en plato'
  },
  {
    id: 4,
    numeroOrden: 'ORD-0004',
    fecha: '2025-01-21',
    hora: '12:15',
    cliente: 'Carmen Herrera',
    telefono: '+503 7456-7890',
    direccion: 'Antiguo Cuscatlán, La Libertad',
    tipoVenta: 'Delivery',
    estado: 'Completada',
    productos: [
      {
        id: 2,
        nombre: 'Combo Empanada + Refresco',
        cantidad: 2,
        precioUnitario: 2.00,
        subtotal: 4.00
      }
    ],
    subtotal: 4.00,
    impuesto: 0.40,
    descuento: 0.00,
    total: 4.40,
    metodoPago: 'Efectivo',
    empleado: 'Carlos Rodríguez',
    notas: 'Entregar en la puerta principal'
  },
  {
    id: 5,
    numeroOrden: 'ORD-0005',
    fecha: '2025-01-21',
    hora: '18:30',
    cliente: 'Luis Fernández',
    telefono: '+503 7567-8901',
    direccion: 'San Salvador, El Salvador',
    tipoVenta: 'Para Llevar',
    estado: 'Completada',
    productos: [
      {
        id: 1,
        nombre: 'Empanada Individual de Carne',
        cantidad: 5,
        precioUnitario: 1.00,
        subtotal: 5.00
      },
      {
        id: 2,
        nombre: 'Combo Empanada + Refresco',
        cantidad: 1,
        precioUnitario: 2.00,
        subtotal: 2.00
      }
    ],
    subtotal: 7.00,
    impuesto: 0.70,
    descuento: 0.50,
    total: 7.20,
    metodoPago: 'Tarjeta',
    empleado: 'María González',
    notas: 'Empacar bien para viaje'
  }
];

// Datos mock para Usuarios
export const mockUsuarios = [
  {
    id: 1,
    nombre: 'María',
    apellido: 'González',
    email: 'maria.gonzalez@empresa.com',
    telefono: '+503 7123-4567',
    rol: 'Administrador',
    estado: 'Activo',
    fechaCreacion: '2024-01-15',
    fechaModificacion: null,
    ultimoAcceso: '2025-01-22 14:30',
    departamento: 'Administración',
    permisos: ['dashboard', 'operaciones', 'inventario', 'usuarios', 'reportes'],
    notas: 'Usuario principal del sistema'
  },
  {
    id: 2,
    nombre: 'Carlos',
    apellido: 'Rodríguez',
    email: 'carlos.rodriguez@empresa.com',
    telefono: '+503 7234-5678',
    rol: 'Gerente',
    estado: 'Activo',
    fechaCreacion: '2024-02-10',
    fechaModificacion: null,
    ultimoAcceso: '2025-01-22 13:45',
    departamento: 'Operaciones',
    permisos: ['dashboard', 'operaciones', 'inventario', 'reportes'],
    notas: 'Gerente de operaciones'
  },
  {
    id: 3,
    nombre: 'Ana',
    apellido: 'López',
    email: 'ana.lopez@empresa.com',
    telefono: '+503 7345-6789',
    rol: 'Cajero',
    estado: 'Activo',
    fechaCreacion: '2024-03-05',
    fechaModificacion: null,
    ultimoAcceso: '2025-01-22 12:15',
    departamento: 'Ventas',
    permisos: ['dashboard', 'operaciones', 'reportes'],
    notas: 'Cajera principal'
  },
  {
    id: 4,
    nombre: 'Roberto',
    apellido: 'Martínez',
    email: 'roberto.martinez@empresa.com',
    telefono: '+503 7456-7890',
    rol: 'Cocinero',
    estado: 'Activo',
    fechaCreacion: '2024-03-20',
    fechaModificacion: null,
    ultimoAcceso: '2025-01-22 11:30',
    departamento: 'Cocina',
    permisos: ['dashboard', 'recetas', 'productos'],
    notas: 'Chef principal'
  },
  {
    id: 5,
    nombre: 'Carmen',
    apellido: 'Herrera',
    email: 'carmen.herrera@empresa.com',
    telefono: '+503 7567-8901',
    rol: 'Cajero',
    estado: 'Inactivo',
    fechaCreacion: '2024-04-12',
    fechaModificacion: '2025-01-15',
    ultimoAcceso: '2025-01-15 16:20',
    departamento: 'Ventas',
    permisos: ['dashboard', 'operaciones'],
    notas: 'Cajera de respaldo'
  }
];

// Datos mock para Roles
export const mockRoles = [
  {
    id: 1,
    nombre: 'Administrador',
    descripcion: 'Acceso completo a todas las funcionalidades del sistema',
    permisos: ['dashboard', 'operaciones', 'inventario', 'usuarios', 'reportes', 'configuracion'],
    nivel: 1,
    activo: true,
    fechaCreacion: '2024-01-01',
    usuariosAsignados: 1
  },
  {
    id: 2,
    nombre: 'Gerente',
    descripcion: 'Gestión completa de operaciones e inventario',
    permisos: ['dashboard', 'operaciones', 'inventario', 'reportes'],
    nivel: 2,
    activo: true,
    fechaCreacion: '2024-01-01',
    usuariosAsignados: 1
  },
  {
    id: 3,
    nombre: 'Cajero',
    descripcion: 'Gestión de ventas y reportes básicos',
    permisos: ['dashboard', 'operaciones', 'reportes'],
    nivel: 3,
    activo: true,
    fechaCreacion: '2024-01-01',
    usuariosAsignados: 2
  },
  {
    id: 4,
    nombre: 'Cocinero',
    descripcion: 'Gestión de recetas y productos',
    permisos: ['dashboard', 'recetas', 'productos'],
    nivel: 3,
    activo: true,
    fechaCreacion: '2024-01-01',
    usuariosAsignados: 1
  },
  {
    id: 5,
    nombre: 'Auxiliar',
    descripcion: 'Acceso limitado a funciones básicas',
    permisos: ['dashboard'],
    nivel: 4,
    activo: false,
    fechaCreacion: '2024-01-01',
    usuariosAsignados: 0
  }
];

// Datos mock para Empleados
export const mockEmpleados = [
  {
    id: 1,
    nombre: 'Juan Pérez',
    puesto: 'Cocinero',
    area: 'cocina',
    disponibilidad: {
      lunes: { inicio: '06:00', fin: '22:00' },
      martes: { inicio: '06:00', fin: '22:00' },
      miercoles: { inicio: '06:00', fin: '22:00' },
      jueves: { inicio: '06:00', fin: '22:00' },
      viernes: { inicio: '06:00', fin: '22:00' },
      sabado: { inicio: '08:00', fin: '18:00' },
      domingo: null
    },
    horasSemanales: 40,
    horasAsignadas: 32,
    activo: true,
    telefono: '8888-1234',
    email: 'juan@empanadazo.com'
  },
  {
    id: 2,
    nombre: 'María González',
    puesto: 'Mesera',
    area: 'servicio',
    disponibilidad: {
      lunes: { inicio: '10:00', fin: '22:00' },
      martes: { inicio: '10:00', fin: '22:00' },
      miercoles: { inicio: '10:00', fin: '22:00' },
      jueves: { inicio: '10:00', fin: '22:00' },
      viernes: { inicio: '10:00', fin: '23:00' },
      sabado: { inicio: '10:00', fin: '23:00' },
      domingo: { inicio: '12:00', fin: '20:00' }
    },
    horasSemanales: 40,
    horasAsignadas: 38,
    activo: true,
    telefono: '8888-5678',
    email: 'maria@empanadazo.com'
  },
  {
    id: 3,
    nombre: 'Carlos Rodríguez',
    puesto: 'Cocinero',
    area: 'cocina',
    disponibilidad: {
      lunes: { inicio: '14:00', fin: '22:00' },
      martes: { inicio: '14:00', fin: '22:00' },
      miercoles: { inicio: '14:00', fin: '22:00' },
      jueves: { inicio: '14:00', fin: '22:00' },
      viernes: { inicio: '14:00', fin: '23:00' },
      sabado: { inicio: '12:00', fin: '20:00' },
      domingo: null
    },
    horasSemanales: 35,
    horasAsignadas: 28,
    activo: true,
    telefono: '8888-9012',
    email: 'carlos@empanadazo.com'
  },
  {
    id: 4,
    nombre: 'Ana López',
    puesto: 'Mesera',
    area: 'servicio',
    disponibilidad: {
      lunes: { inicio: '08:00', fin: '16:00' },
      martes: { inicio: '08:00', fin: '16:00' },
      miercoles: { inicio: '08:00', fin: '16:00' },
      jueves: { inicio: '08:00', fin: '16:00' },
      viernes: { inicio: '08:00', fin: '16:00' },
      sabado: { inicio: '10:00', fin: '18:00' },
      domingo: { inicio: '10:00', fin: '18:00' }
    },
    horasSemanales: 40,
    horasAsignadas: 40,
    activo: true,
    telefono: '8888-3456',
    email: 'ana@empanadazo.com'
  },
  {
    id: 5,
    nombre: 'Roberto Martínez',
    puesto: 'Cajero',
    area: 'caja',
    disponibilidad: {
      lunes: { inicio: '10:00', fin: '18:00' },
      martes: { inicio: '10:00', fin: '18:00' },
      miercoles: { inicio: '10:00', fin: '18:00' },
      jueves: { inicio: '10:00', fin: '18:00' },
      viernes: { inicio: '10:00', fin: '18:00' },
      sabado: { inicio: '10:00', fin: '16:00' },
      domingo: null
    },
    horasSemanales: 35,
    horasAsignadas: 30,
    activo: true,
    telefono: '8888-7890',
    email: 'roberto@empanadazo.com'
  },
  {
    id: 6,
    nombre: 'Carmen Herrera',
    puesto: 'Limpieza',
    area: 'limpieza',
    disponibilidad: {
      lunes: { inicio: '06:00', fin: '14:00' },
      martes: { inicio: '06:00', fin: '14:00' },
      miercoles: { inicio: '06:00', fin: '14:00' },
      jueves: { inicio: '06:00', fin: '14:00' },
      viernes: { inicio: '06:00', fin: '14:00' },
      sabado: { inicio: '08:00', fin: '12:00' },
      domingo: null
    },
    horasSemanales: 30,
    horasAsignadas: 25,
    activo: true,
    telefono: '8888-2345',
    email: 'carmen@empanadazo.com'
  },
  {
    id: 7,
    nombre: 'Luis Fernández',
    puesto: 'Cocinero',
    area: 'cocina',
    disponibilidad: {
      lunes: { inicio: '08:00', fin: '16:00' },
      martes: { inicio: '08:00', fin: '16:00' },
      miercoles: { inicio: '08:00', fin: '16:00' },
      jueves: { inicio: '08:00', fin: '16:00' },
      viernes: { inicio: '08:00', fin: '16:00' },
      sabado: { inicio: '10:00', fin: '18:00' },
      domingo: null
    },
    horasSemanales: 40,
    horasAsignadas: 35,
    activo: true,
    telefono: '8888-6789',
    email: 'luis@empanadazo.com'
  },
  {
    id: 8,
    nombre: 'Patricia Silva',
    puesto: 'Mesera',
    area: 'servicio',
    disponibilidad: {
      lunes: { inicio: '16:00', fin: '00:00' },
      martes: { inicio: '16:00', fin: '00:00' },
      miercoles: { inicio: '16:00', fin: '00:00' },
      jueves: { inicio: '16:00', fin: '00:00' },
      viernes: { inicio: '16:00', fin: '01:00' },
      sabado: { inicio: '16:00', fin: '01:00' },
      domingo: { inicio: '14:00', fin: '22:00' }
    },
    horasSemanales: 40,
    horasAsignadas: 32,
    activo: true,
    telefono: '8888-4567',
    email: 'patricia@empanadazo.com'
  }
];

// Datos mock para Turnos
export const mockTurnos = [
  {
    id: 1,
    empleadoId: 1,
    empleadoNombre: 'Juan Pérez',
    fecha: '2025-01-27',
    horaInicio: '08:00',
    horaFin: '16:00',
    area: 'cocina',
    posicion: 'Cocinero Principal',
    estado: 'confirmado',
    notas: 'Turno de mañana - preparación'
  },
  {
    id: 2,
    empleadoId: 2,
    empleadoNombre: 'María González',
    fecha: '2025-01-27',
    horaInicio: '14:00',
    horaFin: '22:00',
    area: 'servicio',
    posicion: 'Mesera',
    estado: 'confirmado',
    notas: 'Turno de tarde - hora pico'
  },
  {
    id: 3,
    empleadoId: 3,
    empleadoNombre: 'Carlos Rodríguez',
    fecha: '2025-01-27',
    horaInicio: '14:00',
    horaFin: '22:00',
    area: 'cocina',
    posicion: 'Cocinero',
    estado: 'confirmado',
    notas: 'Turno de tarde'
  },
  {
    id: 4,
    empleadoId: 4,
    empleadoNombre: 'Ana López',
    fecha: '2025-01-27',
    horaInicio: '08:00',
    horaFin: '16:00',
    area: 'servicio',
    posicion: 'Mesera',
    estado: 'confirmado',
    notas: 'Turno de mañana'
  },
  {
    id: 5,
    empleadoId: 5,
    empleadoNombre: 'Roberto Martínez',
    fecha: '2025-01-27',
    horaInicio: '10:00',
    horaFin: '18:00',
    area: 'caja',
    posicion: 'Cajero',
    estado: 'confirmado',
    notas: 'Turno completo'
  },
  {
    id: 6,
    empleadoId: 6,
    empleadoNombre: 'Carmen Herrera',
    fecha: '2025-01-27',
    horaInicio: '06:00',
    horaFin: '14:00',
    area: 'limpieza',
    posicion: 'Limpieza',
    estado: 'confirmado',
    notas: 'Limpieza matutina'
  },
  {
    id: 7,
    empleadoId: 7,
    empleadoNombre: 'Luis Fernández',
    fecha: '2025-01-27',
    horaInicio: '08:00',
    horaFin: '16:00',
    area: 'cocina',
    posicion: 'Cocinero',
    estado: 'confirmado',
    notas: 'Turno de mañana'
  },
  {
    id: 8,
    empleadoId: 8,
    empleadoNombre: 'Patricia Silva',
    fecha: '2025-01-27',
    horaInicio: '16:00',
    horaFin: '00:00',
    area: 'servicio',
    posicion: 'Mesera',
    estado: 'confirmado',
    notas: 'Turno de noche'
  }
];

// Datos mock para Asistencia
export const mockAsistencia = [
  {
    id: 1,
    empleadoId: 1,
    turnoId: 1,
    fecha: '2025-01-27',
    turnoInicio: '08:00',
    turnoFin: '16:00',
    entradaReal: '08:03',
    salidaReal: '16:05',
    estado: 'a_tiempo',
    minutosRetraso: 3,
    minutosExtra: 5,
    observaciones: 'Entrada puntual'
  },
  {
    id: 2,
    empleadoId: 2,
    turnoId: 2,
    fecha: '2025-01-27',
    turnoInicio: '14:00',
    turnoFin: '22:00',
    entradaReal: '14:15',
    salidaReal: '22:00',
    estado: 'tarde',
    minutosRetraso: 15,
    minutosExtra: 0,
    observaciones: 'Retraso por tráfico'
  },
  {
    id: 3,
    empleadoId: 3,
    turnoId: 3,
    fecha: '2025-01-27',
    turnoInicio: '14:00',
    turnoFin: '22:00',
    entradaReal: '14:02',
    salidaReal: '22:10',
    estado: 'a_tiempo',
    minutosRetraso: 2,
    minutosExtra: 10,
    observaciones: 'Salida tardía por limpieza'
  },
  {
    id: 4,
    empleadoId: 4,
    turnoId: 4,
    fecha: '2025-01-27',
    turnoInicio: '08:00',
    turnoFin: '16:00',
    entradaReal: '07:55',
    salidaReal: '16:00',
    estado: 'a_tiempo',
    minutosRetraso: 0,
    minutosExtra: 0,
    observaciones: 'Entrada temprana'
  },
  {
    id: 5,
    empleadoId: 5,
    turnoId: 5,
    fecha: '2025-01-27',
    turnoInicio: '10:00',
    turnoFin: '18:00',
    entradaReal: '10:20',
    salidaReal: '18:00',
    estado: 'tarde',
    minutosRetraso: 20,
    minutosExtra: 0,
    observaciones: 'Retraso significativo'
  },
  {
    id: 6,
    empleadoId: 6,
    turnoId: 6,
    fecha: '2025-01-27',
    turnoInicio: '06:00',
    turnoFin: '14:00',
    entradaReal: null,
    salidaReal: null,
    estado: 'ausencia',
    minutosRetraso: 0,
    minutosExtra: 0,
    observaciones: 'Sin justificación'
  },
  {
    id: 7,
    empleadoId: 7,
    turnoId: 7,
    fecha: '2025-01-27',
    turnoInicio: '08:00',
    turnoFin: '16:00',
    entradaReal: '08:00',
    salidaReal: '16:00',
    estado: 'a_tiempo',
    minutosRetraso: 0,
    minutosExtra: 0,
    observaciones: 'Puntualidad perfecta'
  },
  {
    id: 8,
    empleadoId: 8,
    turnoId: 8,
    fecha: '2025-01-27',
    turnoInicio: '16:00',
    turnoFin: '00:00',
    entradaReal: '16:05',
    salidaReal: '00:10',
    estado: 'tarde',
    minutosRetraso: 5,
    minutosExtra: 10,
    observaciones: 'Ligero retraso'
  }
];

// Datos mock para Franjas Requeridas
export const mockFranjasRequeridas = [
  { dia: 'lunes', inicio: '06:00', fin: '10:00', area: 'cocina', minEmpleados: 2 },
  { dia: 'lunes', inicio: '10:00', fin: '14:00', area: 'cocina', minEmpleados: 3 },
  { dia: 'lunes', inicio: '14:00', fin: '18:00', area: 'cocina', minEmpleados: 3 },
  { dia: 'lunes', inicio: '18:00', fin: '22:00', area: 'cocina', minEmpleados: 2 },
  { dia: 'lunes', inicio: '11:00', fin: '15:00', area: 'servicio', minEmpleados: 2 },
  { dia: 'lunes', inicio: '15:00', fin: '21:00', area: 'servicio', minEmpleados: 3 },
  { dia: 'lunes', inicio: '10:00', fin: '18:00', area: 'caja', minEmpleados: 1 },
  { dia: 'lunes', inicio: '06:00', fin: '14:00', area: 'limpieza', minEmpleados: 1 },
  { dia: 'martes', inicio: '06:00', fin: '10:00', area: 'cocina', minEmpleados: 2 },
  { dia: 'martes', inicio: '10:00', fin: '14:00', area: 'cocina', minEmpleados: 3 },
  { dia: 'martes', inicio: '14:00', fin: '18:00', area: 'cocina', minEmpleados: 3 },
  { dia: 'martes', inicio: '18:00', fin: '22:00', area: 'cocina', minEmpleados: 2 },
  { dia: 'martes', inicio: '11:00', fin: '15:00', area: 'servicio', minEmpleados: 2 },
  { dia: 'martes', inicio: '15:00', fin: '21:00', area: 'servicio', minEmpleados: 3 },
  { dia: 'martes', inicio: '10:00', fin: '18:00', area: 'caja', minEmpleados: 1 },
  { dia: 'martes', inicio: '06:00', fin: '14:00', area: 'limpieza', minEmpleados: 1 }
];

// Datos mock para Tipos de Contrato
export const mockTiposContrato = [
  {
    id: 1,
    nombre: 'Jornada Completa',
    descripcion: '40 horas semanales, salario fijo mensual',
    horasSemanales: 40,
    tipoSalario: 'fijo',
    deduccionSeguroSocial: 9.34,
    deduccionImpuesto: 'progresivo',
    horasExtraAplicable: true,
    tarifaHorasExtra: 1.5,
    aguinaldoCompleto: true,
    activo: true
  },
  {
    id: 2,
    nombre: 'Media Jornada',
    descripcion: '20 horas semanales, salario proporcional',
    horasSemanales: 20,
    tipoSalario: 'fijo',
    deduccionSeguroSocial: 9.34,
    deduccionImpuesto: 'progresivo',
    horasExtraAplicable: true,
    tarifaHorasExtra: 1.5,
    aguinaldoCompleto: true,
    activo: true
  },
  {
    id: 3,
    nombre: 'Por Servicios',
    descripcion: 'Pago por horas trabajadas, sin beneficios',
    horasSemanales: 0,
    tipoSalario: 'por_hora',
    deduccionSeguroSocial: 0,
    deduccionImpuesto: 'simplificado',
    horasExtraAplicable: false,
    tarifaHorasExtra: 1.0,
    aguinaldoCompleto: false,
    activo: true
  }
];

// Datos mock para Empleados con información salarial
export const mockEmpleadosPlanilla = [
  {
    id: 1,
    nombre: 'Juan Pérez',
    cedula: '1-1234-5678',
    puesto: 'Cocinero',
    fechaIngreso: '2024-06-01',
    tipoContratoId: 1,
    tipoContrato: 'Jornada Completa',
    salarioBase: 450000,
    tarifaHora: null,
    activo: true,
    cuentaBanco: 'BAC-123456789',
    telefono: '8888-1234',
    email: 'juan@empanadazo.com'
  },
  {
    id: 2,
    nombre: 'María González',
    cedula: '2-2345-6789',
    puesto: 'Mesera',
    fechaIngreso: '2024-08-15',
    tipoContratoId: 1,
    tipoContrato: 'Jornada Completa',
    salarioBase: 380000,
    tarifaHora: null,
    activo: true,
    cuentaBanco: 'BCR-987654321',
    telefono: '8888-5678',
    email: 'maria@empanadazo.com'
  },
  {
    id: 3,
    nombre: 'Carlos Rodríguez',
    cedula: '1-3456-7890',
    puesto: 'Ayudante Cocina',
    fechaIngreso: '2024-12-01',
    tipoContratoId: 3,
    tipoContrato: 'Por Servicios',
    salarioBase: null,
    tarifaHora: 2500,
    activo: true,
    cuentaBanco: null,
    telefono: '8888-9012',
    email: 'carlos@empanadazo.com'
  },
  {
    id: 4,
    nombre: 'Ana López',
    cedula: '2-4567-8901',
    puesto: 'Mesera',
    fechaIngreso: '2024-09-01',
    tipoContratoId: 2,
    tipoContrato: 'Media Jornada',
    salarioBase: 190000,
    tarifaHora: null,
    activo: true,
    cuentaBanco: 'BN-111222333',
    telefono: '8888-3456',
    email: 'ana@empanadazo.com'
  },
  {
    id: 5,
    nombre: 'Roberto Martínez',
    cedula: '1-5678-9012',
    puesto: 'Cajero',
    fechaIngreso: '2024-07-15',
    tipoContratoId: 1,
    tipoContrato: 'Jornada Completa',
    salarioBase: 420000,
    tarifaHora: null,
    activo: true,
    cuentaBanco: 'BCR-444555666',
    telefono: '8888-7890',
    email: 'roberto@empanadazo.com'
  }
];

// Datos mock para Planillas
export const mockPlanillas = [
  {
    id: 1,
    empleadoId: 1,
    empleadoNombre: 'Juan Pérez',
    periodo: '2025-01',
    fechaInicio: '2025-01-01',
    fechaFin: '2025-01-31',
    estado: 'calculada',
    
    // Datos de asistencia
    horasProgramadas: 184,
    horasTrabajadas: 180,
    horasAusencia: 4,
    horasExtra: 8,
    diasTrabajados: 23,
    diasAusencias: 1,
    
    // Cálculos salariales
    salarioBase: 450000,
    montoHorasExtra: 24000,
    salarioBruto: 474000,
    
    // Bonos
    bonos: [
      { concepto: 'Bono por puntualidad', monto: 15000, aplicadoPor: 'Admin', fecha: '2025-01-31' },
      { concepto: 'Bono por ventas', monto: 10000, aplicadoPor: 'Admin', fecha: '2025-01-31' }
    ],
    totalBonos: 25000,
    
    // Deducciones
    deducciones: [
      { concepto: 'Seguro Social (9.34%)', monto: 44300, tipo: 'legal' },
      { concepto: 'Impuesto sobre la renta', monto: 28000, tipo: 'legal' },
      { concepto: 'Adelanto de salario', monto: 50000, tipo: 'personal', aplicadoPor: 'Admin', fecha: '2025-01-15' }
    ],
    totalDeducciones: 122300,
    
    // Total final
    salarioNeto: 376700,
    
    fechaCalculo: '2025-01-31T10:30:00',
    calculadoPor: 'Admin Sistema',
    fechaPago: null,
    recibogenerado: false
  },
  {
    id: 2,
    empleadoId: 2,
    empleadoNombre: 'María González',
    periodo: '2025-01',
    fechaInicio: '2025-01-01',
    fechaFin: '2025-01-31',
    estado: 'pendiente',
    
    horasProgramadas: 184,
    horasTrabajadas: null,
    horasAusencia: null,
    horasExtra: null,
    diasTrabajados: null,
    diasAusencias: null,
    
    salarioBase: 380000,
    salarioBruto: null,
    bonos: [],
    totalBonos: 0,
    deducciones: [],
    totalDeducciones: null,
    salarioNeto: null,
    
    fechaCalculo: null,
    calculadoPor: null,
    alertas: ['Faltan registros de asistencia', 'Datos incompletos para cálculo']
  },
  {
    id: 3,
    empleadoId: 3,
    empleadoNombre: 'Carlos Rodríguez',
    periodo: '2025-01',
    fechaInicio: '2025-01-01',
    fechaFin: '2025-01-31',
    estado: 'calculada',
    
    horasProgramadas: 160,
    horasTrabajadas: 158,
    horasAusencia: 2,
    horasExtra: 0,
    diasTrabajados: 20,
    diasAusencias: 0,
    
    salarioBase: null,
    tarifaHora: 2500,
    montoHorasExtra: 0,
    salarioBruto: 395000,
    
    bonos: [],
    totalBonos: 0,
    
    deducciones: [
      { concepto: 'Impuesto simplificado (10%)', monto: 39500, tipo: 'legal' }
    ],
    totalDeducciones: 39500,
    
    salarioNeto: 355500,
    
    fechaCalculo: '2025-01-31T11:15:00',
    calculadoPor: 'Admin Sistema',
    fechaPago: null,
    recibogenerado: false
  },
  {
    id: 4,
    empleadoId: 4,
    empleadoNombre: 'Ana López',
    periodo: '2025-01',
    fechaInicio: '2025-01-01',
    fechaFin: '2025-01-31',
    estado: 'calculada',
    
    horasProgramadas: 92,
    horasTrabajadas: 90,
    horasAusencia: 2,
    horasExtra: 0,
    diasTrabajados: 23,
    diasAusencias: 0,
    
    salarioBase: 190000,
    montoHorasExtra: 0,
    salarioBruto: 190000,
    
    bonos: [
      { concepto: 'Bono por eficiencia', monto: 8000, aplicadoPor: 'Admin', fecha: '2025-01-31' }
    ],
    totalBonos: 8000,
    
    deducciones: [
      { concepto: 'Seguro Social (9.34%)', monto: 17740, tipo: 'legal' },
      { concepto: 'Impuesto sobre la renta', monto: 0, tipo: 'legal' }
    ],
    totalDeducciones: 17740,
    
    salarioNeto: 180260,
    
    fechaCalculo: '2025-01-31T12:00:00',
    calculadoPor: 'Admin Sistema',
    fechaPago: null,
    recibogenerado: false
  },
  {
    id: 5,
    empleadoId: 5,
    empleadoNombre: 'Roberto Martínez',
    periodo: '2025-01',
    fechaInicio: '2025-01-01',
    fechaFin: '2025-01-31',
    estado: 'calculada',
    
    horasProgramadas: 184,
    horasTrabajadas: 182,
    horasAusencia: 2,
    horasExtra: 4,
    diasTrabajados: 23,
    diasAusencias: 0,
    
    salarioBase: 420000,
    montoHorasExtra: 12000,
    salarioBruto: 432000,
    
    bonos: [],
    totalBonos: 0,
    
    deducciones: [
      { concepto: 'Seguro Social (9.34%)', monto: 40350, tipo: 'legal' },
      { concepto: 'Impuesto sobre la renta', monto: 25000, tipo: 'legal' }
    ],
    totalDeducciones: 65350,
    
    salarioNeto: 366650,
    
    fechaCalculo: '2025-01-31T13:45:00',
    calculadoPor: 'Admin Sistema',
    fechaPago: null,
    recibogenerado: false
  }
];

// Datos mock para Historial de Pagos
export const mockHistorialPagos = [
  {
    id: 1,
    empleadoId: 1,
    periodo: '2024-12',
    fechaPago: '2025-01-05',
    salarioNeto: 385200,
    tipo: 'regular',
    estado: 'pagado'
  },
  {
    id: 2,
    empleadoId: 1,
    periodo: '2024-11',
    fechaPago: '2024-12-05',
    salarioNeto: 392100,
    tipo: 'regular',
    estado: 'pagado'
  },
  {
    id: 3,
    empleadoId: 1,
    periodo: '2024-aguinaldo',
    fechaPago: '2024-12-15',
    salarioNeto: 485000,
    tipo: 'aguinaldo',
    estado: 'pagado'
  },
  {
    id: 4,
    empleadoId: 2,
    periodo: '2024-12',
    fechaPago: '2025-01-05',
    salarioNeto: 325800,
    tipo: 'regular',
    estado: 'pagado'
  },
  {
    id: 5,
    empleadoId: 3,
    periodo: '2024-12',
    fechaPago: '2025-01-05',
    salarioNeto: 355500,
    tipo: 'regular',
    estado: 'pagado'
  }
];

// Datos mock para Configuración de Deducciones
export const mockConfiguracionDeducciones = [
  {
    concepto: 'Seguro Social',
    porcentaje: 9.34,
    tipo: 'legal',
    aplicaA: 'todos',
    activa: true
  },
  {
    concepto: 'Impuesto sobre la renta',
    tipo: 'legal',
    aplicaA: 'segun_tabla',
    tabla: [
      { desde: 0, hasta: 929000, porcentaje: 0 },
      { desde: 929001, hasta: 1363000, porcentaje: 10 },
      { desde: 1363001, hasta: 2392000, porcentaje: 15 },
      { desde: 2392001, hasta: Infinity, porcentaje: 20 }
    ],
    activa: true
  }
];