/* Configuración PÚBLICA del sitio. Nunca pongas tokens, contraseñas ni claves privadas aquí. */
window.PERLATECH_CONFIG = Object.freeze({
  email: 'otuntechnologic@outlook.com',
  phoneDisplay: '+56 9 6814 4532',
  whatsapp: '56968144532',
  /* Pega aquí una URL pública HTTPS de Cal.com, Microsoft Bookings, Calendly, etc.
     Cuando exista, pages/agenda.html mostrará la agenda real automáticamente. */
  bookingUrl: '',
  /* Endpoint HTTPS opcional para recibir formularios como JSON. Si queda vacío,
     el sitio ofrece envío por WhatsApp/correo sin fingir que los datos fueron recibidos. */
  requestEndpoint: '',
  /* Portal externo real, si se implementa con autenticación del lado servidor. */
  clientPortalUrl: ''
});
