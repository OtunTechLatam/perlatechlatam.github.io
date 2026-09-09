/* Sólo configuración PÚBLICA. Nunca incluir tokens, contraseñas o claves privadas.
   Consulta docs/INTEGRACIONES.md antes de activar un servicio. */
window.PERLATECH_CONFIG = Object.freeze({
  email: 'otuntechnologic@outlook.com',
  bookingUrl: '', // URL HTTPS de tu evento Cal.com, e.g. https://cal.com/tu-cuenta/diagnostico
  requestEndpoint: '', // Gateway HTTPS: POST JSON -> { received: true, id: '...' }
  clientPortalUrl: '' // Portal HTTPS externo con autenticación y permisos del servidor
});
