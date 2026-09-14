PERLATECH — SUBIDA MANUAL DEL FIX DE CORREOS
==============================================

Rama recomendada:
fix

NO subas directamente a main.

1. SUBIR ARCHIVOS NUEVOS
------------------------

Copia respetando exactamente estas rutas:

assets/js/form-notify.js
pages/gracias.html

2. MODIFICAR 3 PÁGINAS
-----------------------

En estas páginas:

pages/diagnostico.html
pages/soporte.html
pages/nosotros.html

Busca:

<script defer src="../assets/js/app.js?v=20260911-v37"></script>

Y justo después agrega:

<script defer src="../assets/js/form-notify.js?v=20260914-v2"></script>

3. ACTUALIZAR PRIVACIDAD
------------------------

Abre:

pages/privacidad.html

Usa el texto incluido en:

snippets/ACTUALIZAR_PRIVACIDAD.txt

4. HACER COMMIT
---------------

Mensaje sugerido:

feat: add email notifications and client confirmation

5. CREAR PR
-----------

Base:
main

Compare:
fix

Título sugerido:

feat: add PerlaTech email notifications and client confirmation

Descripción sugerida:

- Mantiene Supabase como registro principal de leads.
- Envía notificación a otuntechnologic@outlook.com.
- Envía copia a yanpoolvelez@gmail.com.
- Envía confirmación automática al correo del cliente.
- Agrega página de confirmación después del envío.
- Actualiza privacidad para reflejar el uso de FormSubmit.

6. PRIMERA ACTIVACIÓN DE FORMSUBMIT
----------------------------------

Después de publicar/mergear:

1. Completa un formulario de prueba.
2. Revisa otuntechnologic@outlook.com.
3. FormSubmit enviará un correo de activación.
4. Confirma ese correo.
5. Repite el formulario.
6. Verifica:
   - Outlook recibe la solicitud.
   - Gmail recibe copia.
   - El cliente recibe confirmación automática.
   - El lead sigue guardándose en Supabase.

IMPORTANTE:
La primera prueba antes de activar FormSubmit puede no entregar inmediatamente
los correos. La activación se realiza una sola vez.
