Cuando se crea un movimiento de inventario (entrada, salida, ajuste, transferencia) desde el front-end Vue, se inserta un registro en la tabla movimientos_inventario de Supabase

Se ha creado un trigger en la base de datos (trg_movimiento_alerta) que, tras cada inserción en movimientos_inventario, envía un NOTIFY al canal movimiento_alerta.

El listener Node.js está conectado a este canal y detecta el NOTIFY.

Cuando el listener recibe un movimiento con cantidad mayor al límite definido (por ejemplo 4), considera que es una anomalía.

En caso de anomalía:

Envía un email de alerta usando nodemailer.

Notas importantes:

listener.js y server.js son para desarrollo local; cuando se despliega a Vercel, la lógica de alertas podria tener que hacerce con Serverless functions, ya que Vercel no mantiene procesos Node persistentes.