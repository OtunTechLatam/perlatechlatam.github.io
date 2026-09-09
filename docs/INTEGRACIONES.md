# Activar integraciones

El alojamiento objetivo es GitHub Pages. Los servicios con persistencia, autenticación y envíos deben ejecutarse externamente. No hay cuentas conectadas ni credenciales incluidas en esta entrega.

## Agenda

1. Crea un evento en tu proveedor de agenda y conecta el calendario que realmente utilices, por ejemplo Outlook, desde la cuenta del proveedor.
2. Configura duración de 25 minutos, pausa de 15 minutos entre reuniones, zona `America/Santiago`, disponibilidad real y anticipación mínima acorde a tu trabajo.
3. Configura videollamada, correo de confirmación y enlaces de cancelación/reagendamiento.
4. Si tu plan lo permite, configura recordatorios 24 horas y 1 hora antes. No se deben programar desde JavaScript: un navegador cerrado no ejecuta tareas.
5. Copia la URL HTTPS completa del evento en `bookingUrl`.
6. Publica el cambio. Para Cal.com aparecerán un enlace a la agenda y un botón para cargarla dentro de la página, sólo tras el clic del visitante.
7. Realiza una reserva de prueba, comprueba el calendario, enlace de reunión, correo, cancelación y liberación del horario. Sólo la confirmación del proveedor acredita la reserva.

El enlace externo se conserva por si el proveedor bloquea la incrustación. Los costos, funciones y permisos dependen de la cuenta contratada.

## Solicitudes online: contrato del gateway

El frontend está preparado para un único endpoint HTTPS que debe implementarse fuera de GitHub Pages. Puede ser una función serverless o un gateway integrado con tu CRM. No uses un webhook privado directamente en el código público.

Solicitud `POST`, `Content-Type: application/json`:

```json
{
  "type": "diagnostico",
  "requestId": "uuid-del-navegador",
  "name": "Nombre del solicitante",
  "company": "Empresa",
  "email": "correo@example.com",
  "service": "web",
  "goal": "Objetivo del proyecto",
  "current": "Proceso actual",
  "timeline": "En 1 a 3 meses",
  "budget": "Por definir",
  "catalog": "on",
  "commerce": "on",
  "consent": true,
  "source": "perlatech-web"
}
```

`type` puede ser `diagnostico`, `contacto` o `soporte`. Contacto usa `message`; soporte usa `subject` y `message`. Los checkbox no marcados se omiten. El servidor debe validar todos los valores por sí mismo; la validación del navegador no es una frontera de seguridad.

Sólo después de guardar correctamente:

```json
{ "received": true, "id": "PT-000123" }
```

Usa HTTP 200/201. El identificador debe ser una cadena no vacía de máximo 120 caracteres. Un HTTP 200 sin este contrato no se presenta como éxito. Ante errores, responde 4xx/5xx; la web mantiene la alternativa por correo. El navegador corta la espera a los 15 segundos, pero eso no garantiza que el servidor no haya procesado la solicitud.

Requisitos del gateway:

- Atender preflight OPTIONS y permitir POST/Content-Type desde `https://otuntechlatam.github.io`. CORS trabaja con el origen, no con la ruta del repositorio. CORS no sustituye autenticación ni protección antiabuso.
- Rechazar cuerpos excesivos, campos desconocidos, emails inválidos y solicitudes sin consentimiento. Limitar longitud y sanear datos para el destino.
- Aplicar límite de frecuencia, control de abuso y registro de errores. No aceptar destinatarios de correo suministrados por el cliente.
- Usar `requestId` como clave idempotente para evitar duplicados tras un timeout. El frontend conserva la misma clave al reintentar datos idénticos durante la página actual.
- Guardar el registro con acceso privado y fecha del servidor antes de devolver éxito.
- Registrar origen y autorización; enviar correos sólo por una cuenta verificada. Las claves se almacenan exclusivamente en el proveedor.
- No incluir contenido personal en logs públicos o analítica.

No publiques `requestEndpoint` hasta verificar estos requisitos con datos de prueba.

## CRM y portal privados

La vista `demo.html` es pública, ficticia y efímera. No puede utilizarse para clientes reales.

`clientPortalUrl` debe apuntar a un servicio externo con autenticación real, aislamiento por cliente y autorización del servidor para cada lectura, archivo y aprobación. Define roles de administrador y cliente. Un cliente no debe poder consultar proyectos ajenos ni cambiando un ID o URL. Usa almacenamiento privado y enlaces de descarga temporales.

Al conectar un portal existente, la página de clientes cambia a un acceso externo. El login y los datos no se implementan ni alojan en GitHub Pages. Verifica con dos cuentas de prueba que no puedan leer información de la otra antes de habilitarlo.

## Medición

Actualmente no se envía analítica. El código emite eventos internos `perlatech:event`, sin datos personales: `diagnostic_step_1` a `diagnostic_step_4`, `request_prepared`, `request_received`, `booking_opened`.

Para medir reservas reales utiliza la confirmación/webhook del calendario, no el clic del botón. Conecta una plataforma de medición sólo después de definir finalidad, condiciones de privacidad y consentimiento cuando corresponda. Mide reuniones realizadas y propuestas aceptadas desde el CRM, no por inferencia del tráfico web.
