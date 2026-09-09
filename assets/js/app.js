(() => {
  'use strict';
  const C=window.PerlaCore, cfg=window.PERLATECH_CONFIG || {}, $=(q,r=document)=>r.querySelector(q), $$=(q,r=document)=>[...r.querySelectorAll(q)];
  const node=(tag,text,className)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(className)n.className=className;return n;};
  const button=(text,fn,cls='button secondary small')=>{const n=node('button',text,cls);n.type='button';n.addEventListener('click',fn);return n;};
  const email=typeof cfg.email==='string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cfg.email)?cfg.email:'otuntechnologic@outlook.com';
  const whatsapp=typeof cfg.whatsapp==='string' ? cfg.whatsapp.replace(/\D/g,'') : '';
  const waLink=text=>whatsapp?`https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`:'';
  const waIcon=()=>{const img=document.createElement('img');img.className='wa-logo';img.src='https://cdn.simpleicons.org/whatsapp/FFFFFF/FFFFFF';img.alt='';img.width=22;img.height=22;img.setAttribute('aria-hidden','true');img.decoding='async';return img;};
  const decorateWhatsApp=(a,label='WhatsApp')=>{a.replaceChildren(waIcon(),node('span',label,'label'));return a;};
  const analyticsDebug=cfg.analyticsDebug===true;
  window.PERLATECH_ANALYTICS={enabled:false,measurementId:null,events:[]};

  // Analytics comercial opcional. No se envían campos de formularios ni datos personales.
  const gaId=typeof cfg.ga4MeasurementId==='string' && /^G-[A-Z0-9]+$/i.test(cfg.ga4MeasurementId.trim())?cfg.ga4MeasurementId.trim().toUpperCase():'';
  window.PERLATECH_ANALYTICS.enabled=!!gaId;window.PERLATECH_ANALYTICS.measurementId=gaId||null;
  if(gaId){
    window.dataLayer=window.dataLayer||[];
    window.gtag=window.gtag||function(){dataLayer.push(arguments);};
    gtag('js',new Date());gtag('config',gaId,{anonymize_ip:true,send_page_view:true});
    const gaScript=document.createElement('script');gaScript.async=true;gaScript.src=`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;document.head.append(gaScript);
  }
  $$('[data-year]').forEach(n=>n.textContent=new Date().getFullYear());
  const nav=$('#navigation'), toggle=$('.menu-toggle');
  // Tema visual: claro por defecto, oscuro opcional. La preferencia se guarda sólo en este navegador.
  const themeToggle=node('button',undefined,'theme-toggle');
  themeToggle.type='button';
  const readTheme=()=>document.documentElement.dataset.theme==='dark'?'dark':'light';
  function paintThemeButton(){
    const dark=readTheme()==='dark';
    themeToggle.replaceChildren(node('span',dark?'☀':'☾','theme-icon'),node('span',dark?'Claro':'Oscuro','theme-label'));
    themeToggle.setAttribute('aria-label',dark?'Cambiar a modo claro':'Cambiar a modo oscuro');
    themeToggle.title=dark?'Cambiar a modo claro':'Cambiar a modo oscuro';
    themeToggle.setAttribute('aria-pressed',String(dark));
  }
  paintThemeButton();
  const headerWrap=$('.nav-wrap');
  if(headerWrap){headerWrap.insertBefore(themeToggle,toggle || nav || null);}
  themeToggle.addEventListener('click',()=>{
    const next=readTheme()==='dark'?'light':'dark';
    document.documentElement.dataset.theme=next;
    try{localStorage.setItem('perlatech-theme',next);}catch{}
    paintThemeButton();
    if(typeof window.__PERLATECH_SYNC_CAL_THEME==='function')window.__PERLATECH_SYNC_CAL_THEME(next);
    event('theme_changed',{theme:next});
  });
  function closeMenu(){nav?.classList.remove('open');toggle?.setAttribute('aria-expanded','false');}
  toggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});
  nav?.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape' && nav?.classList.contains('open')){closeMenu();toggle.focus();}});
  document.addEventListener('click',e=>{if(!e.target.closest('.header'))closeMenu();});
  const event=(name,params={})=>{
    const safe={page_path:location.pathname,...params};
    const record={name,...safe,timestamp:new Date().toISOString()};
    window.PERLATECH_ANALYTICS.events.push(record);
    if(window.PERLATECH_ANALYTICS.events.length>80)window.PERLATECH_ANALYTICS.events.shift();
    document.dispatchEvent(new CustomEvent('perlatech:event',{detail:record}));
    if(analyticsDebug)console.info('[PerlaTech event]',record);
    if(gaId && typeof window.gtag==='function')gtag('event',name,safe);
  };
  function download(filename,text){const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=node('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  function data(form){return Object.fromEntries(new FormData(form));}
  function offlineResult(container,type,payload){
    container.replaceChildren();const box=node('div',undefined,'request-result');const text=C.requestText(type,payload);
    box.append(node('p','Tu solicitud está preparada, pero todavía no se ha enviado. Elige WhatsApp o correo para compartirla, o descarga el resumen.'));
    if(whatsapp){const wa=node('a',undefined,'button whatsapp-action');wa.href=waLink(`Hola PerlaTech. Quiero compartir esta solicitud:\n\n${text}`);wa.target='_blank';wa.rel='noopener noreferrer';decorateWhatsApp(wa,'Enviar por WhatsApp ↗');box.append(wa);}
    const a=node('a','Abrir mi correo ↗','button secondary');a.href=C.mailto(email,`Solicitud de ${type} · PerlaTech`,text);box.append(a);
    box.append(button('Descargar solicitud',()=>download('solicitud-perlatech.txt',text)));
    const label=node('label','También puedes copiar este texto');const ta=node('textarea');ta.readOnly=true;ta.value=text;ta.rows=6;label.append(ta);box.append(label);container.append(box);
  }
  const endpoint=C.httpsUrl(cfg.requestEndpoint);
  const pending=new WeakSet(), received=new WeakMap(), requestIds=new WeakMap();
  async function send(form,type,payload,status,result,submit){
    if(pending.has(form))return;
    status.classList.remove('error');result.replaceChildren();
    if(!endpoint){status.textContent='Resumen preparado. Elige WhatsApp o correo para enviarlo.';offlineResult(result,type,payload);event('form_prepared',{form_type:type});return;}
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
      received.set(form,{signature,id:body.id});status.textContent=`Solicitud recibida. Referencia: ${body.id}. ${type==='diagnostico'?'Esto no confirma una reserva.':''}`;event('form_submitted',{form_type:type});
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
  const schedule=$('#schedule-request');
  if(schedule){
    const status=$('#schedule-status');
    const dateInput=schedule.elements.date;
    if(dateInput){const now=new Date();const local=new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().slice(0,10);dateInput.min=local;}
    schedule.addEventListener('submit',e=>{
      e.preventDefault();if(!schedule.reportValidity())return;
      const d=data(schedule);const message=[
        'Hola PerlaTech. Quiero coordinar un diagnóstico.',
        '',`Nombre: ${d.name||''}`,`Empresa/proyecto: ${d.company||'Por conversar'}`,`Tema: ${d.topic||'Por definir'}`,`Fecha preferida: ${d.date||''}`,`Hora preferida: ${d.time||''}`,`Correo: ${d.email||'Por compartir'}`,
        '','Sé que el horario queda sujeto a confirmación.'
      ].join('\n');
      const url=waLink(message);
      if(url){window.open(url,'_blank','noopener,noreferrer');status.textContent='WhatsApp abierto con tu solicitud preparada. El horario se confirma cuando PerlaTech responda.';event('schedule_whatsapp_opened');}
      else{location.href=C.mailto(email,'Solicitud de horario · PerlaTech',message);status.textContent='Abrimos tu correo con la solicitud preparada.';}
    });
  }
  function bootCalEmbed(){
    if(typeof window.Cal==='function')return window.Cal;
    ((Cw,A,L)=>{
      const push=(a,args)=>a.q.push(args),d=Cw.document;
      Cw.Cal=Cw.Cal||function(){
        const cal=Cw.Cal,args=arguments;
        if(!cal.loaded){cal.ns={};cal.q=cal.q||[];const script=d.createElement('script');script.src=A;script.async=true;d.head.appendChild(script);cal.loaded=true;}
        if(args[0]===L){
          const api=function(){push(api,arguments);},namespace=args[1];api.q=api.q||[];
          if(typeof namespace==='string'){cal.ns[namespace]=cal.ns[namespace]||api;push(cal.ns[namespace],args);push(cal,['initNamespace',namespace]);}
          else push(cal,args);
          return;
        }
        push(cal,args);
      };
    })(window,'https://app.cal.com/embed/embed.js','init');
    return window.Cal;
  }
  const booking=$('#booking'),bookingURL=C.httpsUrl(cfg.bookingUrl);
  if(booking && bookingURL){
    const parsedBooking=new URL(bookingURL),host=parsedBooking.hostname.toLowerCase();
    const provider=host==='cal.com'||host.endsWith('.cal.com')?'Cal.com':host.includes('calendly.com')?'Calendly':(host.includes('outlook.office.com')||host.includes('bookings.microsoft')||host.includes('microsoft.com'))?'Microsoft Bookings':'agenda online';
    booking.replaceChildren();
    const badge=node('span',`AGENDA CONECTADA · ${provider}`,'tag booking-provider');booking.append(badge);
    booking.append(node('h2','Elige un horario disponible'),node('p',`La disponibilidad y la confirmación se gestionan directamente en ${provider}.`));

    if(provider==='Cal.com'){
      const calLink=parsedBooking.pathname.replace(/^\/+|\/+$/g,'');
      const calWrap=node('div',undefined,'cal-inline-shell');
      const calInline=node('div',undefined,'cal-inline-embed');calInline.id='perlatech-cal-inline';
      const calStatus=node('p','Cargando disponibilidad en tiempo real…','cal-booking-status');calStatus.id='cal-booking-status';calStatus.setAttribute('role','status');
      calWrap.append(calInline,calStatus);booking.append(calWrap);
      const actions=node('div',undefined,'inline-actions');
      const link=node('a','Abrir agenda en Cal.com ↗','button secondary small');link.href=bookingURL;link.target='_blank';link.rel='noopener noreferrer';link.dataset.track='booking_provider_clicked';actions.append(link);booking.append(actions);
      try{
        const Cal=bootCalEmbed(),ns='perlatech30min';
        Cal('init',ns,{origin:'https://cal.com'});
        const api=Cal.ns[ns];
        api('inline',{elementOrSelector:'#perlatech-cal-inline',calLink,config:{layout:'month_view'}});
        const syncTheme=theme=>api('ui',{
          theme:theme==='dark'?'dark':'light',
          hideEventTypeDetails:false,
          layout:'month_view',
          cssVarsPerTheme:{
            light:{'cal-brand':'#58df19','cal-brand-emphasis':'#41bd0e','cal-brand-text':'#061109'},
            dark:{'cal-brand':'#78ef1d','cal-brand-emphasis':'#91ff3b','cal-brand-text':'#061109'}
          }
        });
        window.__PERLATECH_SYNC_CAL_THEME=syncTheme;syncTheme(readTheme());
        api('on',{action:'bookerReady',callback:()=>{calStatus.textContent='Selecciona el día y horario que mejor te acomode.';event('cal_booker_ready',{provider:'Cal.com'});}});
        api('on',{action:'bookerViewed',callback:()=>event('cal_booker_viewed',{provider:'Cal.com'})});
        api('on',{action:'bookingSuccessfulV2',callback:e=>{
          const d=e?.detail?.data||{};
          calStatus.textContent='Reserva creada correctamente en Cal.com. Revisa tu correo para la confirmación y los detalles de la reunión.';
          event('booking_successful',{provider:'Cal.com',status:d.status||'created',event_type_id:d.eventTypeId||undefined});
        }});
        api('on',{action:'linkFailed',callback:()=>{calStatus.textContent='No pudimos cargar la agenda dentro del sitio. Usa “Abrir agenda en Cal.com” para reservar.';event('booking_embed_failed',{provider:'Cal.com'});}});
        event('booking_embedded',{provider:'Cal.com'});
      }catch{
        calStatus.textContent='No pudimos cargar la agenda dentro del sitio. Usa “Abrir agenda en Cal.com” para reservar.';
      }
    }else{
      const link=node('a',`Abrir ${provider} ↗`,'button');link.href=bookingURL;link.target='_blank';link.rel='noopener noreferrer';link.dataset.track='booking_provider_clicked';booking.append(link);
      const embeddable=provider==='Calendly';
      if(embeddable){
        const load=button('Mostrar agenda aquí',()=>{load.remove();const frame=document.createElement('iframe');frame.title=`Agenda de diagnóstico PerlaTech en ${provider}`;frame.src=bookingURL;frame.referrerPolicy='strict-origin-when-cross-origin';frame.loading='lazy';booking.append(frame);event('booking_embedded',{provider});},'button secondary');booking.append(load);
      }
    }
    event('booking_provider_ready',{provider});
  }
  const access=$('#client-access'),portalURL=C.httpsUrl(cfg.clientPortalUrl);
  if(access && portalURL){access.replaceChildren(node('p','Accede al portal seguro con las credenciales facilitadas para tu proyecto.'));const a=node('a','Abrir mi portal ↗','button');a.href=portalURL;a.target='_blank';a.rel='noopener noreferrer';access.append(a);}
  if(whatsapp && !document.querySelector('.whatsapp-float')){
    const path=location.pathname.toLowerCase();
    const context=path.includes('soluciones')?'sus soluciones':path.includes('proyectos')?'sus proyectos y casos':path.includes('agenda')?'agendar un diagnóstico':path.includes('diagnostico')?'preparar un diagnóstico':path.includes('soporte')?'una solicitud de soporte':path.includes('nosotros')?'PerlaTech':'un proyecto';
    const wa=node('a',undefined,'whatsapp-float');wa.href=waLink(`Hola PerlaTech. Estoy revisando ${context} y quiero conversar.`);wa.target='_blank';wa.rel='noopener noreferrer';wa.setAttribute('aria-label','Conversar con PerlaTech por WhatsApp');wa.dataset.track='whatsapp_float';
    decorateWhatsApp(wa,'WhatsApp');document.body.append(wa);
  }

  // Medición de acciones comerciales sin capturar contenido ni datos personales.
  document.addEventListener('click',e=>{
    const el=e.target.closest('a,button');if(!el)return;
    const href=el.matches('a')?(el.getAttribute('href')||''):'';
    let name=el.dataset.track||'';
    if(!name && href.includes('wa.me/'))name='whatsapp_clicked';
    else if(!name && /agenda\.html/.test(href))name='agenda_clicked';
    else if(!name && /diagnostico\.html/.test(href))name='diagnostic_clicked';
    else if(!name && href.startsWith('mailto:'))name='email_clicked';
    else if(!name && href.startsWith('tel:'))name='phone_clicked';
    else if(!name && /setecma\.cl/.test(href))name='project_external_clicked';
    if(name)event(name,{location:el.closest('header')?'header':el.closest('footer')?'footer':el.classList.contains('whatsapp-float')?'floating':'content'});
  });

  $$('form').forEach(form=>{let started=false;form.addEventListener('focusin',()=>{if(!started){started=true;event('form_started',{form_id:form.id||form.dataset.request||'form'});}});});
  // Movimiento sutil y navegación visual. Se desactiva automáticamente si el usuario prefiere reducir animaciones.
  const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Barra de progreso de lectura.
  const progress=node('div',undefined,'scroll-progress');progress.setAttribute('aria-hidden','true');document.body.append(progress);
  const updateProgress=()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.setProperty('--scroll-progress',max>0?Math.min(1,scrollY/max):0);};
  addEventListener('scroll',updateProgress,{passive:true});addEventListener('resize',updateProgress,{passive:true});updateProgress();

  // Aparición progresiva al entrar al viewport. Sin JavaScript el contenido permanece visible.
  if(!reduceMotion && 'IntersectionObserver' in window){
    const revealTargets=$$('main > section, .service-card, .card, .value-card, .project-feature, .showcase, .solution-detail, .process-list li, .brand-panel');
    revealTargets.forEach((el,i)=>{el.classList.add('reveal-ready');el.style.setProperty('--reveal-delay',`${Math.min((i%4)*70,210)}ms`);});
    const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('reveal-visible');revealObserver.unobserve(entry.target);}}),{threshold:.12,rootMargin:'0px 0px -45px'});
    revealTargets.forEach(el=>revealObserver.observe(el));
  }

  // Banda continua de capacidades en la portada.
  const strip=$('.strip .container');
  if(strip && !strip.dataset.motionReady){
    strip.dataset.motionReady='true';strip.classList.add('marquee-shell');
    const items=[...strip.children];
    if(items.length>2){
      const track=node('div',undefined,'marquee-track');items.forEach(el=>track.append(el));
      const clone=track.cloneNode(true);clone.setAttribute('aria-hidden','true');
      strip.replaceChildren(track,clone);
      if(reduceMotion)strip.classList.add('motion-paused');
    }
  }

  // Carruseles reutilizables: scroll-snap + botones + autoplay suave sólo cuando tiene sentido.
  $$('[data-carousel]').forEach((carousel,index)=>{
    const slides=[...carousel.children];if(slides.length<2)return;
    carousel.classList.add('carousel-enhanced');carousel.tabIndex=0;carousel.setAttribute('role','region');carousel.setAttribute('aria-label',carousel.getAttribute('aria-label')||'Carrusel de contenido');
    slides.forEach((slide,i)=>{slide.classList.add('carousel-slide');slide.setAttribute('data-slide',String(i+1));});
    const ui=node('div',undefined,'carousel-ui');
    const status=node('span',`1 / ${slides.length}`,'carousel-status');status.setAttribute('aria-live','polite');
    const prev=button('←',()=>move(-1),'carousel-control');prev.setAttribute('aria-label','Anterior');
    const next=button('→',()=>move(1),'carousel-control');next.setAttribute('aria-label','Siguiente');
    ui.append(status,prev,next);carousel.parentNode.insertBefore(ui,carousel);
    let active=0,timer=0,paused=false;
    const slideWidth=()=>{const first=slides[0];return first.getBoundingClientRect().width+parseFloat(getComputedStyle(carousel).gap||0);};
    function go(to,behavior='smooth'){active=(to+slides.length)%slides.length;carousel.scrollTo({left:active*slideWidth(),behavior:reduceMotion?'auto':behavior});status.textContent=`${active+1} / ${slides.length}`;}
    function move(dir){go(active+dir);restart();}
    let raf=0;carousel.addEventListener('scroll',()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{const w=slideWidth();if(w>0){active=Math.max(0,Math.min(slides.length-1,Math.round(carousel.scrollLeft/w)));status.textContent=`${active+1} / ${slides.length}`;}});},{passive:true});
    carousel.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();move(1);}if(e.key==='ArrowLeft'){e.preventDefault();move(-1);}});
    const autoplay=Number(carousel.dataset.autoplay||0);
    function stop(){if(timer)clearInterval(timer);timer=0;}
    function start(){stop();if(!reduceMotion && autoplay>=3500 && innerWidth>720 && !paused)timer=setInterval(()=>go(active+1),autoplay);}
    function restart(){stop();start();}
    carousel.addEventListener('mouseenter',()=>{paused=true;stop();});carousel.addEventListener('mouseleave',()=>{paused=false;start();});
    carousel.addEventListener('focusin',()=>{paused=true;stop();});carousel.addEventListener('focusout',()=>{paused=false;start();});
    document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
    addEventListener('resize',()=>go(active,'auto'),{passive:true});start();
  });

  // Profundidad mínima en el visual principal, sin interferir con la lectura.
  const heroMedia=$('.hero-media');
  if(heroMedia && !reduceMotion && matchMedia('(pointer:fine)').matches){
    heroMedia.addEventListener('pointermove',e=>{const r=heroMedia.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;heroMedia.style.setProperty('--tilt-x',`${(-y*2.2).toFixed(2)}deg`);heroMedia.style.setProperty('--tilt-y',`${(x*2.8).toFixed(2)}deg`);});
    heroMedia.addEventListener('pointerleave',()=>{heroMedia.style.setProperty('--tilt-x','0deg');heroMedia.style.setProperty('--tilt-y','0deg');});
  }

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
