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
  requestEndpoint: 'https://dtemhjbyavsgykckcevx.supabase.co/functions/v1/perlatech-lead',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0ZW1oamJ5YXZzZ3lrY2tjZXZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5OTkxMDMsImV4cCI6MjEwNDU3NTEwM30.trv44JdjYllVOD-TuX8r91lY4npps6dfQcHMjFBR8e8',

  /* Google Analytics 4. Ejemplo: G-XXXXXXXXXX. Si está vacío, no se carga Analytics. */
  ga4MeasurementId: '',
  analyticsDebug: false, // true = muestra los eventos en la consola del navegador

  /* Portal externo real con autenticación del lado servidor, si se implementa. */
  clientPortalUrl: ''
});
