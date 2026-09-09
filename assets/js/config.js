/* Configuración PÚBLICA del sitio. Nunca pongas tokens, contraseñas ni claves privadas aquí. */
window.PERLATECH_CONFIG = Object.freeze({
  email: 'otuntechnologic@outlook.com',
  phoneDisplay: '+56 9 6814 4532',
  whatsapp: '56968144532',

  /* Agenda pública HTTPS: Cal.com, Microsoft Bookings, Calendly, etc. */
  bookingUrl: 'https://cal.com/perla-tech/30min',
  bookingProvider: 'cal.com', // auto | cal.com | calendly | microsoft-bookings

  /* Endpoint HTTPS opcional para formularios. Debe aceptar POST JSON y responder:
     { received: true, id: 'referencia' }. Si está vacío, se ofrece WhatsApp/correo. */
  requestEndpoint: '',

  /* Google Analytics 4. Ejemplo: G-XXXXXXXXXX. Si está vacío, no se carga Analytics. */
  ga4MeasurementId: '',
  analyticsDebug: false, // true = muestra los eventos en la consola del navegador

  /* Portal externo real con autenticación del lado servidor, si se implementa. */
  clientPortalUrl: ''
});
