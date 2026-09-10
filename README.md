# PerlaTech V3.1 Comercial

Sitio estático para GitHub Pages con modo claro/oscuro, tecnología en movimiento, WhatsApp contextual, diagnóstico, agenda con fallback, demo y medición de conversiones preparada para GA4.

## Estado
- Carrusel continuo de tecnologías: activo y visible en Inicio.
- WhatsApp contextual: activo y visible en todas las páginas principales.
- Eventos comerciales: activos localmente; se envían a GA4 al configurar un Measurement ID real.
- GA4: requiere `ga4MeasurementId`.
- Cal.com / Calendly / Microsoft Bookings: requiere `bookingUrl`.
- Endpoint de formularios: requiere `requestEndpoint`.

Consulta `docs/ACTIVAR_INTEGRACIONES.md`.

## V3.2 · Logos de marca
El carrusel usa logotipos SVG de marca en lugar de iniciales genéricas. Docker, Kubernetes, Terraform, .NET, Python, Odoo, Grafana, Jenkins, GitHub Actions, Prometheus, SonarQube y WhatsApp se sirven mediante Simple Icons CDN; AWS usa el SVG de Wikimedia Commons proveniente de Amazon. El sitio conserva nombre y descripción textual para accesibilidad.


## Agenda Cal.com conectada

Evento público conectado: `https://cal.com/perla-tech/30min`. La página `pages/agenda.html` usa el embed inline oficial de Cal.com y conserva un enlace externo como respaldo.


## Agenda
El diagnóstico inicial está configurado a 30 minutos y conectado con https://cal.com/perla-tech/30min.


## Supabase
Los formularios están conectados a la Edge Function `perlatech-lead` del proyecto PerlaTechLatam. La clave incluida en `config.js` es la clave pública anon destinada al navegador; nunca poner una service role key en el repositorio.
