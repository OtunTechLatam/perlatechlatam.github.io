# Activar integraciones de PerlaTech V3.1

La web diferencia **implementado** de **activado**. GitHub Pages no puede inventar credenciales ni una agenda pública.

## 1. WhatsApp contextual — ACTIVO
El número público está en `assets/js/config.js` y cada página incluye un botón flotante con mensaje contextual. Funciona incluso si JavaScript falla.

## 2. Google Analytics 4 — PREPARADO, NO ACTIVO HASTA PONER EL ID
En `assets/js/config.js`, cambia:

```js
ga4MeasurementId: 'G-XXXXXXXXXX'
```

Al existir un ID válido se carga `gtag.js`. No se envían nombres, correos ni texto de formularios como eventos.

### Cómo verificar
En la consola del navegador puedes ejecutar:

```js
PERLATECH_ANALYTICS
```

`enabled` indica si GA4 está conectado y `events` muestra los últimos eventos capturados localmente. Para depuración temporal puedes usar `analyticsDebug: true`.

Eventos incluidos: `whatsapp_clicked`, `whatsapp_contextual`, `agenda_clicked`, `diagnostic_clicked`, `email_clicked`, `phone_clicked`, `project_external_clicked`, `form_started`, `form_prepared`, `form_submitted`, `schedule_whatsapp_opened`, `booking_provider_clicked`, `booking_embedded` y eventos de interacción de la demo.

## 3. Agenda — PREPARADA, NO ACTIVA HASTA PONER UNA URL PÚBLICA
En `assets/js/config.js`:

```js
bookingUrl: 'https://...'
```

Se detectan automáticamente Cal.com, Calendly y Microsoft Bookings. Cal.com y Calendly pueden ofrecer vista embebida; siempre existe un botón para abrir la agenda externa. Si `bookingUrl` está vacío, la página mantiene el flujo de solicitud por WhatsApp y correo sin afirmar que el horario quedó reservado.

## 4. Formularios automáticos — PREPARADOS
Configura `requestEndpoint` con un endpoint HTTPS que acepte POST JSON y responda `{ received: true, id: '...' }`. Mientras esté vacío, el usuario puede enviar el resumen por WhatsApp o correo.

Nunca pongas tokens, secretos, credenciales privadas ni claves de servicio en `config.js`.


### Estado actual de agenda

Cal.com ya está conectado al evento `perla-tech/30min`. El sitio escucha `bookerReady`, `bookerViewed`, `bookingSuccessfulV2` y `linkFailed` para telemetría interna/GA4 cuando éste sea activado.
