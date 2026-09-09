(() => {
  'use strict';
  const C=window.PerlaCore, cfg=window.PERLATECH_CONFIG || {}, $=(q,r=document)=>r.querySelector(q), $$=(q,r=document)=>[...r.querySelectorAll(q)];
  const node=(tag,text,className)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(className)n.className=className;return n;};
  const button=(text,fn,cls='button secondary small')=>{const n=node('button',text,cls);n.type='button';n.addEventListener('click',fn);return n;};
  const email=typeof cfg.email==='string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cfg.email)?cfg.email:'otuntechnologic@outlook.com';
  $$('[data-year]').forEach(n=>n.textContent=new Date().getFullYear());
  const nav=$('#navigation'), toggle=$('.menu-toggle');
  function closeMenu(){nav?.classList.remove('open');toggle?.setAttribute('aria-expanded','false');}
  toggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});
  nav?.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape' && nav?.classList.contains('open')){closeMenu();toggle.focus();}});
  document.addEventListener('click',e=>{if(!e.target.closest('.header'))closeMenu();});
  const event=name=>document.dispatchEvent(new CustomEvent('perlatech:event',{detail:{name}})); // No data sent or stored.
  function download(filename,text){const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=node('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  function data(form){return Object.fromEntries(new FormData(form));}
  function offlineResult(container,type,payload){
    container.replaceChildren();const box=node('div',undefined,'request-result');const text=C.requestText(type,payload);
    box.append(node('p','Tu solicitud está preparada, pero todavía no se ha enviado. Abre tu correo y envíala, o descarga el resumen.'));
    const a=node('a','Abrir mi correo ↗','button');a.href=C.mailto(email,`Solicitud de ${type} · PerlaTech`,text);box.append(a);
    box.append(button('Descargar solicitud',()=>download('solicitud-perlatech.txt',text)));
    const label=node('label','También puedes copiar este texto');const ta=node('textarea');ta.readOnly=true;ta.value=text;ta.rows=6;label.append(ta);box.append(label);container.append(box);
  }
  const endpoint=C.httpsUrl(cfg.requestEndpoint);
  const pending=new WeakSet(), received=new WeakMap(), requestIds=new WeakMap();
  async function send(form,type,payload,status,result,submit){
    if(pending.has(form))return;
    status.classList.remove('error');result.replaceChildren();
    if(!endpoint){status.textContent='Resumen preparado. Falta enviarlo desde tu correo.';offlineResult(result,type,payload);event('request_prepared');return;}
    const signature=JSON.stringify({type,payload});
    if(received.get(form)?.signature===signature){status.textContent=`Esta solicitud ya fue recibida. Referencia: ${received.get(form).id}.`;return;}
    let req=requestIds.get(form);if(!req || req.signature!==signature){req={signature,id:crypto.randomUUID()};requestIds.set(form,req);}
    pending.add(form);submit.disabled=true;status.textContent='Enviando solicitud…';
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
    try{
      const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type,...payload,requestId:req.id,consent:true,source:'perlatech-web'}),signal:controller.signal,credentials:'omit'});
      if(!response.ok)throw new Error('Rejected');
      const body=await response.json();
      if(body.received!==true || typeof body.id!=='string' || !body.id.trim() || body.id.length>120)throw new Error('Invalid receipt');
      received.set(form,{signature,id:body.id});status.textContent=`Solicitud recibida. Referencia: ${body.id}. ${type==='diagnostico'?'Esto no confirma una reserva.':''}`;event('request_received');
    }catch{
      status.classList.add('error');status.textContent='No pudimos confirmar la recepción. Puedes reintentar o usar el correo. Si ya se recibió, el reintento conserva la misma referencia de solicitud.';
      offlineResult(result,type,payload);
    }finally{clearTimeout(timer);pending.delete(form);submit.disabled=false;}
  }
  $$('[data-request]').forEach(form=>{
    const submit=$('[data-send-label]',form);if(endpoint)submit.textContent=form.dataset.request==='soporte'?'Enviar solicitud de soporte':'Enviar solicitud';
    form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;send(form,form.dataset.request,data(form),$('.form-status',form),$('[data-request-result]',form),submit);});
  });
  const wizard=$('#diagnostic-form');
  if(wizard){
    let step=0;const names=['Necesidad','Contexto','Contacto','Revisión'];const fields=$$('[data-step]',wizard),prev=$('#previous-step'),next=$('#next-step'),submit=$('#submit-diagnostic'),status=$('#diagnostic-status'),result=$('#diagnostic-result');
    if(endpoint)submit.textContent='Enviar solicitud';
    const initial=new URLSearchParams(location.search).get('servicio');if(C.services[initial])wizard.elements.service.value=initial;
    function syncWeb(){const web=wizard.elements.service.value==='web';$('#web-options').hidden=!web;if(!web){wizard.elements.catalog.checked=false;wizard.elements.commerce.checked=false;}}
    syncWeb();wizard.elements.service.addEventListener('change',syncWeb);
    function draw(focus=true){fields.forEach((f,i)=>f.hidden=i!==step);prev.hidden=step===0;next.hidden=step===3;submit.hidden=step!==3;$('#step-label').textContent=`Paso ${step+1} de 4 · ${names[step]}`;$('#step-progress').value=step+1;status.textContent='';result.replaceChildren();if(step===3)$('#diagnostic-summary').textContent=C.summary(data(wizard));if(focus){const target=fields[step].querySelector('input,textarea,select,button');target?.focus();}event('diagnostic_step_'+(step+1));}
    next.addEventListener('click',()=>{const invalid=$$('input,select,textarea',fields[step]).find(x=>!x.checkValidity());if(invalid){invalid.reportValidity();return;}step=Math.min(3,step+1);draw();});
    prev.addEventListener('click',()=>{step=Math.max(0,step-1);draw();});
    wizard.addEventListener('submit',e=>{e.preventDefault();if(step<3){next.click();return;}const payload=data(wizard),error=C.validateDiagnostic(payload);if(error){status.textContent=error;status.classList.add('error');return;}send(wizard,'diagnostico',payload,status,result,submit);});
    $('#download-summary').addEventListener('click',()=>download('diagnostico-perlatech.txt',C.summary(data(wizard))));draw(false);
  }
  const booking=$('#booking'),bookingURL=C.httpsUrl(cfg.bookingUrl);
  if(booking && bookingURL){
    booking.replaceChildren(node('h2','Elige el horario que te acomode'),node('p','La disponibilidad y la confirmación se gestionan en nuestra agenda externa. Desde su confirmación podrás cancelar o reagendar.'));
    const link=node('a','Abrir agenda en otra pestaña ↗','button');link.href=bookingURL;link.target='_blank';link.rel='noopener noreferrer';booking.append(link);
    const host=new URL(bookingURL).hostname;
    if(host==='cal.com'){
      const load=button('Mostrar agenda aquí',()=>{load.remove();const frame=document.createElement('iframe');frame.title='Agenda de diagnóstico PerlaTech';frame.src=bookingURL;frame.referrerPolicy='strict-origin-when-cross-origin';booking.append(frame);event('booking_opened');});booking.append(load);
      booking.append(node('p','Al mostrar la agenda se cargará contenido de Cal.com. Si no aparece, utiliza el enlace para abrirla en otra pestaña.','fine'));
    }
  }
  const access=$('#client-access'),portalURL=C.httpsUrl(cfg.clientPortalUrl);
  if(access && portalURL){access.replaceChildren(node('p','Accede al portal seguro con las credenciales facilitadas para tu proyecto.'));const a=node('a','Abrir mi portal ↗','button');a.href=portalURL;a.target='_blank';a.rel='noopener noreferrer';access.append(a);}
  if(!$('#demo-board'))return;
  let state=C.initialDemo(),counter=3,proposal='';const stages=['Nuevo','Propuesta','Proyecto'];
  function log(text){state.activity.unshift(text);state.activity=state.activity.slice(0,12);$('#demo-status').textContent=text;}
  function render(){
    const kpis=$('#demo-kpis');kpis.replaceChildren();[['Oportunidades',state.leads.length],['En propuesta',state.leads.filter(x=>x.stage===1).length],['En proyecto',state.leads.filter(x=>x.stage===2).length]].forEach(([label,value])=>{const el=node('div',label);el.append(node('strong',String(value)));kpis.append(el);});
    const board=$('#demo-board');board.replaceChildren();
    stages.forEach((stage,index)=>{const col=node('div',undefined,'kanban-column');col.append(node('h3',stage));const leads=state.leads.filter(x=>x.stage===index);if(!leads.length)col.append(node('p','Sin oportunidades en esta etapa.'));
      leads.forEach(lead=>{const card=node('article',undefined,'lead-card');card.append(node('span',`DEMO ${String(lead.id).padStart(2,'0')}`,'tag'),node('strong',lead.company),node('p',lead.service),node('small',['Próxima acción: realizar diagnóstico','Próxima acción: revisar alcance','Próxima acción: revisar entregables'][index]));if(index<2)card.append(button(`Pasar a ${stages[index+1]}`,()=>{if(C.advanceLead(state,lead.id)){log(`${lead.company}: pasa a ${stages[index+1]} (demo).`);render();}}));col.append(card);});board.append(col);});
    $('#activity').replaceChildren(...state.activity.map(t=>node('li',t)));
    $('#portal-progress').textContent=`${state.milestones.filter(Boolean).length} de 3 hitos aprobados`;
    const milestones=$('#milestones');milestones.replaceChildren();['Diagnóstico y alcance','Diseño de la experiencia','Revisión de la entrega'].forEach((name,i)=>{const row=node('article',undefined,'milestone'),copy=node('div');copy.append(node('strong',`0${i+1} · ${name}`),node('p',state.milestones[i]?'Aprobado en la demostración':i===1?'Entregable de ejemplo: estructura y recorrido de navegación.':'Entregable de ejemplo: revisión de funciones y contenidos.'));row.append(copy);if(state.milestones[i])row.append(node('span','Aprobado','tag'));else if(state.milestones.slice(0,i).every(Boolean))row.append(button('Aprobar hito demo',()=>{if(C.approveMilestone(state,i)){log(`Hito ${i+1} aprobado en la demostración.`);render();}}));else row.append(node('span','Pendiente del hito anterior','tag'));milestones.append(row);});
    const tickets=$('#tickets');tickets.replaceChildren();if(!state.tickets.length)tickets.append(node('p','Aún no hay tickets de ejemplo. Crea uno para ver el seguimiento.','empty'));state.tickets.forEach(t=>{const row=node('article',undefined,'ticket'),copy=node('div');copy.append(node('strong',t.id+' · Ajuste de contenido de ejemplo'),node('p','Estado: '+['Abierto','En revisión','Resuelto'][t.stage]));row.append(copy);if(t.stage<2)row.append(button(t.stage===0?'Pasar a revisión':'Resolver demo',()=>{t.stage++;log(`${t.id}: ${['Abierto','En revisión','Resuelto'][t.stage]} (demo).`);render();}));tickets.append(row);});
  }
  const tabs=$$('[data-tab]');function selectTab(key,focus=false){if(!['crm','propuestas','portal','soporte'].includes(key))key='crm';tabs.forEach(t=>{const active=t.dataset.tab===key;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;$('#panel-'+t.dataset.tab).hidden=!active;if(active&&focus)t.focus();});}
  tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>{selectTab(tab.dataset.tab);history.replaceState(null,'','#'+tab.dataset.tab);});tab.addEventListener('keydown',e=>{let n;if(e.key==='ArrowRight')n=(i+1)%tabs.length;if(e.key==='ArrowLeft')n=(i+tabs.length-1)%tabs.length;if(e.key==='Home')n=0;if(e.key==='End')n=tabs.length-1;if(n!==undefined){e.preventDefault();selectTab(tabs[n].dataset.tab,true);history.replaceState(null,'','#'+tabs[n].dataset.tab);}});});
  addEventListener('hashchange',()=>selectTab(location.hash.slice(1)));selectTab(location.hash.slice(1));
  $('#add-demo').addEventListener('click',()=>{if(state.leads.length>=12){$('#demo-status').textContent='La demo admite hasta 12 oportunidades. Reinicia para volver al inicio.';return;}counter++;state.leads.push({id:counter,company:`Empresa demo ${counter}`,service:'Solicitud desde la web',stage:0});log('Consulta ficticia registrada. Tarea de diagnóstico creada en la demo; no se envió ningún correo.');render();});
  $('#add-ticket').addEventListener('click',()=>{if(state.tickets.length>=10){$('#demo-status').textContent='La demo admite hasta 10 tickets.';return;}state.tickets.push({id:`DEMO-PT-${String(state.tickets.length+1).padStart(3,'0')}`,stage:0});log('Ticket ficticio creado. No corresponde a una solicitud real.');render();});
  $('#make-proposal').addEventListener('click',()=>{proposal=['PERLATECH · BORRADOR DEMOSTRATIVO','No enviar: datos ficticios y condiciones pendientes.','','Cliente: Empresa demo B','Necesidad: organizar el seguimiento de consultas.','','ALCANCE PROPUESTO','• Formulario de captación.','• Registro de oportunidades y próxima acción.','• Configuración de confirmaciones y seguimiento.','','HITOS','1. Diagnóstico y definición de alcance.','2. Configuración e integración.','3. Validación y entrega.','','INVERSIÓN Y PLAZOS','Por definir tras validación técnica y comercial.','','CONDICIONES','Licencias y servicios externos se cotizan por separado.','Requiere revisión humana antes de enviar.','Catálogo online no incluye carrito ni pagos.'].join('\n');const out=$('#proposal-output');out.className='proposal';out.replaceChildren(node('span','Borrador · requiere revisión','tag'),node('pre',proposal));out.append(button('Descargar borrador demo',()=>download('propuesta-demo-perlatech.txt',proposal)));log('Borrador de ejemplo generado para revisión.');render();});
  $('#reset-demo').addEventListener('click',()=>{state=C.initialDemo();counter=3;proposal='';const out=$('#proposal-output');out.className='empty';out.textContent='Aún no hay borradores. Genera uno para explorar su estructura.';selectTab('crm');history.replaceState(null,'','#crm');log('Demo reiniciada.');render();});
  render();
})();
