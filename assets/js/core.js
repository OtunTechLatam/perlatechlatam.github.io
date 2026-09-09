(function (root) {
  'use strict';
  const services = Object.freeze({web:'Web y software',automatizacion:'Automatización e IA',erp:'ERP y CRM',cloud:'Cloud y DevOps',seguridad:'Seguridad',datos:'Datos y tableros',orientacion:'Necesito orientación'});
  function httpsUrl(value) {
    try { const u=new URL(value); return u.protocol==='https:' && !u.username && !u.password ? u.href : ''; } catch { return ''; }
  }
  function validateDiagnostic(d) {
    if(!Object.hasOwn(services,d.service))return 'Selecciona una solución.';
    if(!d.goal || d.goal.trim().length<15)return 'Describe tu objetivo con al menos 15 caracteres.';
    if(!d.timeline)return 'Selecciona cuándo te gustaría empezar.';
    if(!d.name?.trim() || !d.company?.trim())return 'Completa tu nombre y empresa.';
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email || ''))return 'Revisa tu correo electrónico.';
    if(!d.consent)return 'Necesitamos tu autorización para responder la solicitud.';
    return '';
  }
  function summary(d) {
    return ['SOLICITUD DE DIAGNÓSTICO · PERLATECH','',`Contacto: ${d.name || ''}`,`Empresa: ${d.company || ''}`,`Correo: ${d.email || ''}`,'',`Solución: ${services[d.service] || 'Por definir'}`,`Objetivo: ${d.goal || ''}`,`Situación actual: ${d.current || 'Por conversar'}`,`Inicio: ${d.timeline || 'Por definir'}`,`Inversión estimada: ${d.budget || 'Por definir'}`,...(d.service==='web'?[`Catálogo online: ${d.catalog?'Solicitado':'No solicitado'}`,`Venta online (módulo adicional): ${d.commerce?'Solicitada':'No solicitada'}`]:[]),'','Alcance, plazos e inversión sujetos a revisión. No confirma una reserva.'].join('\n');
  }
  function requestText(type,d) {
    if(type==='diagnostico')return summary(d);
    return [`SOLICITUD DE ${type.toUpperCase()} · PERLATECH`,`Nombre: ${d.name || ''}`,`Empresa / proyecto: ${d.company || ''}`,`Correo: ${d.email || ''}`,`Asunto: ${d.subject || 'Consulta de proyecto'}`,'',d.message || ''].join('\n');
  }
  function mailto(email,subject,body) {return `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;}
  function initialDemo(){return {leads:[{id:1,company:'Empresa demo A',service:'Web corporativa',stage:0},{id:2,company:'Empresa demo B',service:'Automatización',stage:1},{id:3,company:'Empresa demo C',service:'Panel de gestión',stage:2}],milestones:[true,false,false],tickets:[],activity:['Demostración iniciada con tres oportunidades ficticias.']};}
  function advanceLead(state,id){const item=state.leads.find(l=>l.id===id);if(!item || item.stage>=2)return false;item.stage++;return true;}
  function approveMilestone(state,index){if(index<0 || index>=state.milestones.length || state.milestones[index] || state.milestones.slice(0,index).some(v=>!v))return false;state.milestones[index]=true;return true;}
  const api={services,httpsUrl,validateDiagnostic,summary,requestText,mailto,initialDemo,advanceLead,approveMilestone};
  if(typeof module==='object' && module.exports)module.exports=api; else root.PerlaCore=api;
})(typeof window==='undefined'?globalThis:window);
