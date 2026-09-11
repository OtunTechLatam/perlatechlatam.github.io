# PerlaTech Commercial V4 — primera implementación

Esta carpeta contiene la primera implementación del rediseño comercial acordado.

## Archivos incluidos

- `index.html`  
  Reemplazo completo de la portada actual.
- `assets/css/commercial-v4.css`  
  Capa de estilos adicional. Mantiene `styles.css` actual y agrega únicamente los componentes nuevos.
- `DIAGNOSTICO-PATCH.md`  
  Cambio recomendado para eliminar el anclaje de presupuesto bajo del diagnóstico.

## Qué cambia en la portada

1. Nuevo hero orientado a negocio.
2. CTA principal: `Solicitar diagnóstico`.
3. Bloque de beneficios empresariales.
4. Selector `¿Qué necesitas resolver?`.
5. Presentación de PerlaTech separada de la propuesta de valor.
6. Servicios reorganizados por necesidad.
7. Segmentación por tipo/etapa de organización.
8. Proceso de trabajo más claro.
9. Diagnóstico inicial destacado.
10. SETECMA se mantiene como caso real.
11. Soporte y evolución ganan visibilidad.
12. Tecnologías se mueven cerca del final.
13. FAQ comercial.
14. Footer reorganizado.
15. SEO de portada reescrito alrededor de intención empresarial.

## Cómo probarlo localmente

Copia `index.html` y `assets/css/commercial-v4.css` dentro de una copia del repositorio actual.

El `index.html` sigue utilizando estos archivos existentes:

- `styles.css`
- `assets/js/config.js`
- `assets/js/core.js`
- `assets/js/app.js`
- `assets/logo-perlatech-clean.png`
- `assets/hero-pearl.jpg`
- `assets/favicon.png`

Por lo tanto, no reemplaza las integraciones existentes de Cal.com, Supabase, WhatsApp o analítica.

## Publicación en GitHub Pages

1. Haz una copia/backup de la rama `main`.
2. Sube `assets/css/commercial-v4.css`.
3. Reemplaza `index.html` por el incluido en esta carpeta.
4. Aplica el cambio indicado en `DIAGNOSTICO-PATCH.md`.
5. Confirma que los enlaces de navegación carguen correctamente.
6. Prueba escritorio y móvil.
7. Publica el commit en la rama utilizada por GitHub Pages.

## Nota

La integración GitHub disponible en esta conversación tiene acceso de lectura pero rechazó la creación de una rama con HTTP 403. Por eso esta versión se entrega como paquete listo para aplicar, sin modificar tu repositorio remoto.
