(() => {
  'use strict';

  const PRIMARY_EMAIL = 'otuntechnologic@outlook.com';
  const SECONDARY_EMAIL = 'yanpoolvelez@gmail.com';
  const FORM_ACTION = `https://formsubmit.co/${PRIMARY_EMAIL}`;
  const THANK_YOU_URL =
    'https://otuntechlatam.github.io/perlatechlatam.github.io/pages/gracias.html';

  const snapshots = new Map();

  const typeLabels = {
    diagnostico: 'Nuevo diagnóstico',
    soporte: 'Nueva solicitud de soporte',
    contacto: 'Nuevo contacto',
    agenda: 'Nueva solicitud de agenda'
  };

  const autoresponse = [
    'Hola,',
    '',
    'Hemos recibido correctamente tu solicitud en PerlaTech.',
    'Nuestro equipo revisará la información que compartiste y se pondrá en contacto contigo para definir el siguiente paso.',
    '',
    'Este correo confirma la recepción de tu solicitud; no corresponde todavía a una cotización ni a una reserva confirmada.',
    '',
    'Gracias por confiar en PerlaTech.',
    'Tecnología con propósito · Otun Technology SpA'
  ].join('\n');

  function normalizeType(form) {
    if (form.id === 'diagnostic-form') return 'diagnostico';
    return form.dataset.request || null;
  }

  function snapshotForm(form) {
    const fd = new FormData(form);
    const fields = [];
    for (const [name, value] of fd.entries()) {
      if (name === 'consent') continue;
      fields.push([name, String(value)]);
    }
    return fields;
  }

  // Captura los datos antes de que app.js intercepte el submit.
  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;

    const type = normalizeType(form);
    if (!type) return;

    snapshots.set(type, {
      fields: snapshotForm(form),
      pageUrl: location.href
    });
  }, true);

  function addHidden(form, name, value) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value ?? '';
    form.appendChild(input);
  }

  function submitNotification(type, snapshot) {
    const relay = document.createElement('form');
    relay.method = 'POST';
    relay.action = FORM_ACTION;
    relay.style.display = 'none';
    relay.setAttribute('aria-hidden', 'true');

    addHidden(relay, '_subject', `[PerlaTech] ${typeLabels[type] || 'Nueva solicitud'}`);
    addHidden(relay, '_cc', SECONDARY_EMAIL);
    addHidden(relay, '_template', 'table');
    addHidden(relay, '_next', THANK_YOU_URL);
    addHidden(relay, '_autoresponse', autoresponse);
    addHidden(relay, 'Tipo de solicitud', typeLabels[type] || type);
    addHidden(relay, 'Página de origen', snapshot.pageUrl);

    let clientEmail = '';
    for (const [name, value] of snapshot.fields) {
      if (name === 'email') clientEmail = value;
      addHidden(relay, name, value);
    }

    if (clientEmail) addHidden(relay, '_replyto', clientEmail);

    document.body.appendChild(relay);

    // Debe ser POST estándar. _autoresponse de FormSubmit no funciona por AJAX.
    relay.submit();
  }

  // app.js emite form_submitted solo después de que Supabase confirma el guardado.
  document.addEventListener('perlatech:event', (event) => {
    const detail = event.detail || {};
    if (detail.name !== 'form_submitted') return;

    const type = detail.form_type;
    const snapshot = snapshots.get(type);
    if (!snapshot) return;

    submitNotification(type, snapshot);
  });
})();