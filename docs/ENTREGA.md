# Entrega y cambios realizados

## Correcciones sobre el ZIP recibido

- Se unificó el diseño de Inicio y páginas internas.
- Se reemplazó el logo anterior por el archivo oficial adjunto, sin redibujarlo.
- Se corrigieron los enlaces a servicios, historia, propósito, contacto y diagnóstico.
- Se retiró el cursor personalizado y el JavaScript que accedía a elementos inexistentes.
- Se sustituyó el servidor Express del prototipo por una construcción estática. No se requiere instalar paquetes.
- Se excluyeron del proyecto distribuido la API sin autenticación y los JSON de datos del prototipo.
- Se retiraron el teléfono de ejemplo, los enlaces sociales vacíos, las cifras sin respaldo y las afirmaciones de soporte 24/7 no acreditadas.
- Se conservó el teléfono +56 9 6814 4532, presente en la página Nosotros original, y el correo existente.
- Se corrigió el dominio canónico `perlatech.cl` por la URL de GitHub Pages facilitada.
- Se etiquetaron como demostraciones los proyectos sin evidencia de implementación real.

## Diseño

Cuatro páginas principales con fondos claros, verde esmeralda y grafito, tipografía Manrope/DM Sans con fallback local, navegación compacta y adaptación móvil. Formularios, agenda y portal tienen páginas propias. Las fuentes externas son opcionales; la web continúa funcionando si no cargan.

Se usa el PNG del logo exactamente como fue adjuntado. El archivo contiene un pequeño icono superpuesto en su esquina inferior derecha; no se ha alterado. Para una versión limpia de marca, reemplazar `assets/logo-perlatech.png` por una exportación original sin esa superposición, conservando el nombre.

## Completado y pendiente

| Área | Entrega |
| --- | --- |
| Diseño, navegación y SEO | Implementados |
| Diagnóstico | Validación, revisión y descarga implementadas |
| Correo de contacto/soporte | Borrador para envío manual implementado |
| Agenda | Integración por URL preparada; falta conectar cuenta real |
| CRM, propuestas, portal, tickets | Demostraciones operativas con datos ficticios |
| Envíos y base de datos | Gateway documentado; no desplegado |
| Acceso privado | Enlace configurable a portal externo; falta servicio real |
| Recordatorios y seguimiento | Reglas documentadas; falta activarlas en proveedores |
| Analítica | Eventos locales preparados, sin plataforma conectada |

## Verificación realizada

- Seis tests de lógica: validación, distinción de módulos, URLs seguras, correo, CRM y aprobaciones.
- Compilación estática y comprobación de las referencias locales de los HTML, anclas y sintaxis JavaScript.
- Revisión de la lista de publicación para excluir datos privados, servidor y dependencias.
- No se ha publicado en GitHub ni se han enviado mensajes.
- No se han probado reservas, envío por gateway ni acceso externo: no hay servicios configurados.
- No se ha realizado prueba visual en navegador en esta entrega.

## Antes de publicar

Confirma los datos comerciales y reemplaza, si la tienes, la exportación limpia del logo. Sigue el README para publicar sólo `dist/` con GitHub Actions. Las demos pueden publicarse tal como están porque no contienen datos de clientes. Las integraciones tienen estados claros y alternativas de contacto hasta que estén conectadas.
