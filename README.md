# PerlaTech · GitHub Pages

Rediseño estático de PerlaTech con el logo oficial adjunto. Preparado para:
https://otuntechlatam.github.io/perlatechlatam.github.io/

## Abrir en Visual Studio Code

1. Extrae este ZIP.
2. Abre la carpeta `perlatechlatam.github.io` en VS Code.
3. Con Node.js 20 o posterior instalado, ejecuta `npm start`.
4. Abre `http://localhost:4173/perlatechlatam.github.io/`.

El ZIP incluye únicamente las fuentes: `dist/` se genera automáticamente al ejecutar el proyecto o publicarlo. No debes subir `dist/` manualmente.

No necesitas instalar dependencias. El servidor local sirve únicamente `dist/`, con la misma ruta base del sitio publicado. No es un backend de producción. También puedes abrir `index.html` directamente para ver el diseño y la demo; las integraciones externas deben probarse desde HTTP/HTTPS.

## Publicar en GitHub Pages

El proyecto incluye `.github/workflows/pages.yml`.

1. En tu repositorio actual, conserva la carpeta `.git` de tu equipo. Copia el contenido del proyecto actualizado a la raíz del repositorio, no una carpeta adicional dentro de la raíz.
2. Elimina del repositorio los archivos del prototipo anterior `server.js`, `script.js` y la carpeta `data/`. El ZIP entregado ya los excluye. Elimina `node_modules/` del seguimiento de Git si estaba versionado. Revisa los cambios antes de confirmar.
3. En GitHub: Settings → Pages → Build and deployment → Source: **GitHub Actions**.
4. Sube tus cambios a `main`. El workflow verifica el proyecto y publica sólo `dist/`.
5. Espera que termine el workflow de Pages. Las funciones externas requieren la configuración descrita abajo.

Si tu rama principal tiene otro nombre, actualiza `branches: [main]` en el workflow.
No cambies la fuente a publicación desde la raíz de la rama: el workflow y su lista explícita de archivos evitan publicar material de desarrollo. Si cambia el nombre del repositorio, ajusta las URLs absolutas de metadatos, sitemap, robots, 404 y servidor local.

## Qué funciona sin servicios externos

- Cuatro páginas principales y diseño responsive.
- Logo oficial de la concha blanca y perla verde, sin redibujar.
- Navegación accesible, menú móvil, enlaces antiguos y página 404.
- Diagnóstico en cuatro pasos, validaciones, revisión y descarga en TXT.
- Conservación de datos entre pasos en memoria; no entre recargas.
- Contacto y soporte: generación de un correo que el usuario debe enviar.
- Demo CRM: crear oportunidades ficticias y moverlas entre etapas.
- Demo de propuestas: generar y descargar un borrador identificado.
- Demo de portal: aprobar hitos en orden.
- Demo de soporte: crear tickets y cambiar su estado.
- Metadatos SEO con URL real, sitemap y página de privacidad.

## Funciones que necesitan conectar un servicio

Edita **assets/js/config.js**. Es un archivo público; no pongas claves privadas.

| Campo | Función | Estado inicial |
| --- | --- | --- |
| `bookingUrl` | Evento real de agenda; incrustación opcional para Cal.com | Vacío, coordinación por correo |
| `requestEndpoint` | Gateway HTTPS para guardar solicitudes y emitir una referencia real | Vacío, preparación de correo |
| `clientPortalUrl` | Portal privado externo con autenticación y permisos | Vacío, solicitud de acceso por correo |

Lee **docs/INTEGRACIONES.md** para el contrato del gateway y la configuración de agenda; **docs/AUTOMATIZACIONES.md** para los procesos comerciales; **docs/ENTREGA.md** para los cambios y límites.

Los recordatorios, disponibilidad real, CRM privado, base de datos, acceso de clientes y envío automático no están activos sin proveedores configurados. La demo pública no es un portal privado y no guarda información de clientes.

## Comprobaciones

```bash
npm test
npm run build
npm run check
```

Son equivalentes a `node --test tests/core.test.cjs`, `node scripts/build.cjs` y `node scripts/check.cjs`.

El despliegue no instala dependencias. `dist/` se genera desde una lista explícita de archivos públicos. Los tests cubren validación, módulos comerciales, URLs, codificación del correo, estados del CRM e hitos. La verificación adicional revisa referencias y sintaxis JavaScript.
