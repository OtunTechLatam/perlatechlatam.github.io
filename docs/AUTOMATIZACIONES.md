# Procesos comerciales propuestos para activar

Estos procesos están especificados para implementarse con tu proveedor de agenda, gateway y CRM. No están ejecutándose con el ZIP: no hay cuentas conectadas, trabajos programados ni credenciales.

| Disparador | Acción | Resultado verificable |
| --- | --- | --- |
| Solicitud recibida y validada | Crear/actualizar contacto por correo normalizado, crear oportunidad y próxima tarea | Referencia real del CRM |
| Reserva confirmada por proveedor | Asociar reserva al contacto y crear tarea de preparación | ID de reserva y fecha en calendario |
| 24 h y 1 h antes de reunión activa | Enviar recordatorio del proveedor | Evento de entrega o error |
| Cancelación | Anular recordatorios y actualizar oportunidad | Reserva cancelada y tarea ajustada |
| Reagendamiento | Recalcular recordatorios según la nueva fecha | Horario nuevo sincronizado |
| Diagnóstico completado | Generar borrador con necesidad, alcance, exclusiones y hitos | Propuesta pendiente de revisión |
| Propuesta revisada y autorizada | Enviar propuesta por canal acordado | Fecha de envío y versión |
| Propuesta sin respuesta | Crear tarea de seguimiento a los 3 días hábiles | Tarea asignada, no envío indiscriminado |
| Respuesta o rechazo | Detener seguimiento pendiente y actualizar estado | Sin mensajes posteriores automáticos |
| Propuesta aceptada | Crear proyecto y solicitar materiales | Hitos y lista de documentos |
| Entregable disponible | Solicitar revisión al cliente | Aprobación autenticada con versión y fecha |
| Solicitud de soporte válida | Crear ticket y notificar recepción | Número real, responsable y estado |

## Reglas que deben respetarse

- Confirmación de reserva sólo desde el proveedor, con verificación de firma del webhook y deduplicación por ID de evento.
- Recordatorios vinculados a la reserva actual. Cancelación y reagendamiento deben invalidar los anteriores.
- Las propuestas requieren revisión humana de inversión, impuestos, plazos y alcance antes de enviarse.
- Un catálogo no incluye pago online: carrito, checkout, pasarela, pedidos, despacho y stock son módulos adicionales según alcance.
- Mensajes de seguimiento sólo con contexto y autorización; detener ante respuesta, rechazo o petición de baja.
- El portal debe guardar quién aprobó qué versión. Las aprobaciones en la demo no tienen efecto comercial.
- Los fallos de envío generan tareas de revisión; no deben marcarse como entrega exitosa.

## Validación al activar servicios

Prueba una consulta nueva, un duplicado, un timeout con reintento, una reserva, cancelación, reagendamiento, envío fallido, rechazo de propuesta y dos clientes con permisos diferentes. Usa datos ficticios. No actives campañas masivas como parte de la publicación del sitio.
