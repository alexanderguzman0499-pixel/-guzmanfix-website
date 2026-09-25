/* GRS — one state shared by the house and the visual estimate. No messages are sent. */
(()=>{'use strict';
const $=s=>document.querySelector(s),all=s=>[...document.querySelectorAll(s)];
const es=()=>document.documentElement.lang==='es',t=(en,sp)=>es()?sp:en;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const motion=()=>!reduced.matches&&!document.body.classList.contains('motion-paused')&&!document.hidden;
const rooms={kitchen:['Kitchen','Cocina',['plumbing','painting','flooring','general']],bathroom:['Bathroom','Baño',['plumbing','flooring','painting','general']],living:['Living room','Sala',['flooring','drywall','painting','doors','general']],bedroom:['Bedroom','Habitación',['painting','drywall','flooring','doors','general']]};
// Preliminary ranges copied from the existing calculator, not claimed as verified market rates.
const services={
flooring:{name:['Flooring','Pisos'],scopes:[['Up to 200 sq ft','Hasta 200 pies²',400,800],['200–500 sq ft','200–500 pies²',800,1800],['Over 500 sq ft','Más de 500 pies²',1800,4000]]},
drywall:{name:['Drywall repair','Reparación de drywall'],scopes:[['Patches / small holes','Parches / agujeros pequeños',150,350],['A wall section','Una sección de pared',350,900],['Full room or multiple areas','Habitación completa o varias áreas',900,2200]]},
painting:{name:['Painting','Pintura'],scopes:[['One room','Una habitación',350,700],['2–3 rooms','2–3 habitaciones',700,1800],['Full interior','Interior completo',1800,5000]]},
plumbing:{name:['Plumbing fixtures','Accesorios de plomería'],scopes:[['Simple repair','Reparación sencilla',150,350],['One fixture replacement','Reemplazo de un accesorio',350,700],['Multiple fixtures','Varios accesorios',700,1600]]},
doors:{name:['Doors & hardware','Puertas y herrajes'],scopes:[['Lock / adjustment','Cerradura / ajuste',100,250],['One door installation','Instalación de una puerta',250,600],['Multiple doors','Varias puertas',600,1500]]},
general:{name:['Repairs & assembly','Reparaciones y ensamblaje'],scopes:[['1–2 hours of tasks','Tareas de 1–2 horas',100,250],['Half-day scope','Alcance de medio día',250,550],['Full-day scope','Alcance de un día',550,1200]]}
};
let state={room:null,service:null,scope:null,step:0};let film=0;
const money=n=>'$'+n.toLocaleString('en-US');
const label=x=>x[es()?1:0];
const range=()=>state.scope===null?'—':money(services[state.service].scopes[state.scope][2])+' – '+money(services[state.service].scopes[state.scope][3]);
function chooseRoom(room,advance=false){if(!rooms[room])return;const changed=state.room!==room;state.room=room;if(changed){state.service=null;state.scope=null;}state.step=advance?1:Math.min(state.step,1);syncRoom();renderQuote();document.dispatchEvent(new CustomEvent('grs-room-selected',{detail:room}));}
function syncRoom(){all('[data-room]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.room===state.room)));if(state.room){$('#room-title').textContent=label(rooms[state.room]);$('#room-description').textContent=rooms[state.room][2].map(k=>label(services[k].name)).join(' · ');}}
function summary(){if(state.scope===null)return '';return ['Guzman Reliable Services LLC',t('Project request — preliminary estimate','Solicitud de proyecto — estimado preliminar'),'',t('Space: ','Espacio: ')+label(rooms[state.room]),t('Service: ','Servicio: ')+label(services[state.service].name),t('Scope: ','Alcance: ')+label(services[state.service].scopes[state.scope]),t('Preliminary range: ','Rango preliminar: ')+range(),t('Name: ','Nombre: ')+($('#quote-name').value.trim()||'—'),t('Location: ','Ubicación: ')+($('#quote-location').value.trim()||'—'),t('Details: ','Detalles: ')+($('#quote-details').value.trim()||'—'),'',t('Subject to confirmation of scope, materials, access and site conditions. Please confirm the final price.','Sujeto a confirmación del alcance, materiales, acceso y condiciones. Por favor confirma el precio final.'),'guzmanfix.com · (727) 479-5969'].join('\n');}
function updateSummary(){const text=summary();$('#quote-summary').textContent=text;$('#quote-whatsapp').href='https://wa.me/17274795969?text='+encodeURIComponent(text);}
function renderQuote(focus=false){
 $('#quote-title').textContent=[t('Which space needs attention?','¿Qué espacio necesita atención?'),t('What can we help with?','¿En qué podemos ayudarte?'),t('How much work is involved?','¿Cuál es el alcance del trabajo?'),t('Review your project','Revisa tu proyecto')][state.step];
 all('#quote-progress li').forEach((li,i)=>{if(i===state.step)li.setAttribute('aria-current','step');else li.removeAttribute('aria-current')});
 const options=$('#quote-options');options.replaceChildren();options.hidden=state.step===3;$('#quote-contact').hidden=state.step!==3;$('#quote-back').disabled=state.step===0;
 let choices=[];
 if(state.step===0)choices=Object.entries(rooms).map(([id,v])=>({id,name:label(v),selected:id===state.room}));
 if(state.step===1)choices=rooms[state.room][2].map(id=>({id,name:label(services[id].name),selected:id===state.service}));
 if(state.step===2)choices=services[state.service].scopes.map((v,id)=>({id,name:label(v),price:money(v[2])+' – '+money(v[3]),selected:id===state.scope}));
 choices.forEach(c=>{const button=document.createElement('button');button.type='button';button.setAttribute('aria-pressed',String(c.selected));button.textContent=c.name;if(c.price){const s=document.createElement('strong');s.textContent=c.price;button.append(s)}button.addEventListener('click',()=>{if(state.step===0){chooseRoom(c.id,true)}else if(state.step===1){state.service=c.id;state.scope=null;state.step=2;}else{state.scope=c.id;state.step=3;}renderQuote(true)});options.append(button)});
 $('#quote-range').textContent=range();$('#quote-selection').textContent=[state.room&&label(rooms[state.room]),state.service&&label(services[state.service].name),state.scope!==null&&label(services[state.service].scopes[state.scope])].filter(Boolean).join(' · ');
 updateSummary();if(focus)$('#quote-title').focus({preventScroll:true});
}
all('[data-room]').forEach(b=>b.addEventListener('click',()=>chooseRoom(b.dataset.room,true)));
$('#room-quote').addEventListener('click',()=>{state.step=state.room?1:0;renderQuote()});
$('#quote-back').addEventListener('click',()=>{state.step=Math.max(0,state.step-1);renderQuote(true)});
$('#quote-reset').addEventListener('click',()=>{state={room:null,service:null,scope:null,step:0};$('#room-title').textContent=t('Start with a space','Comienza con un espacio');$('#room-description').textContent=t('Choose a room to see services.','Elige un espacio para ver servicios.');syncRoom();renderQuote(true);document.dispatchEvent(new CustomEvent('grs-room-selected',{detail:null}));});
all('#quote-contact input,#quote-contact textarea').forEach(el=>el.addEventListener('input',updateSummary));
document.addEventListener('grs-room-picked',e=>chooseRoom(e.detail,true));
const films=[
{src:'assets/after.jpg',name:['A living space, ready again.','Una sala lista de nuevo.'],desc:['The original photos show a protected floor and masked fixtures during interior work, followed by this finished living space with visible wood flooring and white built-ins.','Las fotos originales muestran el piso protegido y accesorios cubiertos durante los trabajos, seguidos de esta sala terminada con piso de madera visible y muebles empotrados blancos.'],alt:['Finished living room with wood flooring and white built-ins','Sala terminada con piso de madera y muebles empotrados blancos']},
{src:'assets/before2.jpg',name:['A closer look at the repair.','La reparación, de cerca.'],desc:['This project photo documents a gap in the flooring at a doorway. It shows the condition before the repair, without guessing at the cause of the damage.','Esta foto documenta un hueco en el piso junto a una puerta. Muestra el estado antes de la reparación, sin atribuir una causa no documentada.'],alt:['Gap in flooring at a doorway before repair','Hueco en el piso junto a una puerta antes de reparar']},
{src:'assets/after2.jpg',name:['Flooring details.','Detalles del piso.'],desc:['The supplied after photo shows installed wood-look flooring near the doorway. The camera angle differs from the before photo; use the comparison below to inspect both.','La foto posterior muestra piso con apariencia de madera instalado junto a la puerta. El ángulo difiere de la foto anterior; usa la comparación de abajo para revisar ambas.'],alt:['Installed wood-look flooring near a doorway','Piso con apariencia de madera instalado junto a una puerta']}
];
function renderFilm(){const f=films[film];$('#film-image').src=f.src;$('#film-image').alt=label(f.alt);$('#film-title').textContent=label(f.name);$('#film-description').textContent=label(f.desc);$('#film-count').textContent=String(film+1).padStart(2,'0')+' / 03';$('#film-open').setAttribute('aria-label',t('Enlarge photo: ','Ampliar foto: ')+label(f.name));}
$('#film-prev').addEventListener('click',()=>{film=(film+films.length-1)%films.length;renderFilm()});$('#film-next').addEventListener('click',()=>{film=(film+1)%films.length;renderFilm()});
const dialog=$('#grs-photo-dialog');$('#film-open').addEventListener('click',()=>{const f=films[film];$('#grs-photo-image').src=f.src;$('#grs-photo-image').alt=label(f.alt);$('#grs-photo-caption').textContent=label(f.name);dialog.showModal()});$('#grs-photo-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
// Comparison stops following scroll as soon as the visitor takes control.
const comparisons=all('[data-ba]').map(el=>({el,handle:el.querySelector('.ba-handle'),after:el.querySelector('.ba-after'),manual:false,drag:null}));
function reveal(c,v){v=Math.round(Math.max(0,Math.min(100,v)));c.handle.style.left=v+'%';c.handle.setAttribute('aria-valuenow',v);c.handle.setAttribute('aria-valuetext',v+'% '+t('after photo','foto posterior'));c.after.style.clipPath=`inset(0 ${100-v}% 0 0)`;}
comparisons.forEach(c=>{reveal(c,50);c.handle.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key))return;e.preventDefault();c.manual=true;let v=Number(c.handle.getAttribute('aria-valuenow'));reveal(c,e.key==='Home'?0:e.key==='End'?100:v+(['ArrowRight','ArrowUp'].includes(e.key)?5:-5))});
 c.handle.addEventListener('pointerdown',e=>{if(e.button!==0)return;c.manual=true;c.drag=e.pointerId;c.handle.setPointerCapture(e.pointerId);c.handle.focus({preventScroll:true});e.preventDefault()});c.handle.addEventListener('pointermove',e=>{if(c.drag!==e.pointerId)return;const r=c.el.getBoundingClientRect();reveal(c,(e.clientX-r.left)/r.width*100)});['pointerup','pointercancel','lostpointercapture'].forEach(evt=>c.handle.addEventListener(evt,()=>c.drag=null));
});
let scrollFrame=0;
function scrollReveal(){scrollFrame=0;if(!motion())return;comparisons.forEach(c=>{if(c.manual)return;const r=c.el.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;reveal(c,(innerHeight*.8-r.top)/(innerHeight*.6)*100)})}
addEventListener('scroll',()=>{if(!scrollFrame&&motion())scrollFrame=requestAnimationFrame(scrollReveal)},{passive:true});$('#compare-auto').addEventListener('click',()=>{comparisons.forEach(c=>c.manual=false);if(motion())scrollReveal();else comparisons.forEach(c=>reveal(c,50))});
// Intro is nonblocking, times out even if other code fails, and is never replayed this session.
const entry=$('#grs-entry');const dismiss=()=>{entry.hidden=true;};$('#entry-skip').addEventListener('click',dismiss);
let visited=true;try{visited=sessionStorage.getItem('grs-entry-seen')==='1';sessionStorage.setItem('grs-entry-seen','1')}catch{}
if(!visited&&motion()){entry.hidden=false;setTimeout(dismiss,1900);addEventListener('keydown',dismiss,{once:true});entry.addEventListener('animationend',e=>{if(e.animationName==='grs-entry-out')dismiss()});}
setTimeout(()=>document.body.classList.add('grs-hero-ready'),1600);
// All automatic movement and media obey reduced motion, pause and page visibility.
const video=$('#grs-introduction');let videoVisible=false;
function syncMotion(){if(!motion()){dismiss();video.pause();}document.body.classList.toggle('grs-hidden',document.hidden);document.dispatchEvent(new CustomEvent('grs-motion-change',{detail:motion()}));}
new MutationObserver(syncMotion).observe(document.body,{attributes:true,attributeFilter:['class']});
document.addEventListener('visibilitychange',syncMotion);reduced.addEventListener('change',syncMotion);
video.addEventListener('play',()=>{if(document.hidden||!videoVisible)video.pause()});
new IntersectionObserver(([e])=>{videoVisible=e.isIntersecting;if(!videoVisible)video.pause()},{threshold:.15}).observe(video);
const stageObserver=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('grs-offscreen',!e.isIntersecting)));all('.future-stage,.hero__left').forEach(e=>stageObserver.observe(e));
function translate(){all('[data-grs-en]').forEach(el=>el.textContent=es()?el.dataset.grsEs:el.dataset.grsEn);syncRoom();renderQuote();renderFilm();$('#manager-contact').href='https://wa.me/17274795969?text='+encodeURIComponent(t('Hello GRS, I would like to discuss apartment preparation, repair lists or recurring maintenance for my properties. Location: __. Units: __. Priorities: __.','Hola GRS, quisiera hablar sobre preparación de apartamentos, listas de reparaciones o mantenimiento recurrente. Ubicación: __. Unidades: __. Prioridades: __.')+'\nguzmanfix.com · (727) 479-5969');for(const track of video.textTracks)track.mode=track.language===(es()?'es':'en')?'showing':'disabled';comparisons.forEach(c=>c.handle.setAttribute('aria-label',t('Before and after comparison','Comparación antes y después')));}
new MutationObserver(translate).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});translate();
// Native dialogs restore focus and keep the keyboard within the photo viewer.
$('#lightbox')?.addEventListener('close',()=>{document.body.style.overflow='';$('#lightbox').classList.remove('active')});
$('#hamburger')?.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#mobileNav').classList.remove('show');$('#hamburger').setAttribute('aria-expanded','false')}});
// Load WebGL only near the house. Text room controls never depend on this import.
let houseLoaded=false;const houseObserver=new IntersectionObserver(async entries=>{if(!entries.some(e=>e.isIntersecting)||houseLoaded)return;houseLoaded=true;houseObserver.disconnect();try{const module=await import('./home3d.js');await module.initHouse($('#grs-house'),()=>state.room);}catch(error){$('#grs-house').replaceChildren();const img=document.createElement('img');img.src='assets/after.jpg';img.alt=t('Real GRS interior project','Proyecto interior real de GRS');img.style.cssText='width:100%;height:100%;object-fit:contain';$('#grs-house').append(img);$('#house-status').textContent=t('3D is unavailable. Use the room buttons to select services.','La vista 3D no está disponible. Usa los botones de espacios para elegir servicios.');all('.grs-view-controls button').forEach(b=>b.disabled=true);console.info('GRS house: functional room selector active without WebGL.');}},{rootMargin:'200px'});houseObserver.observe($('#experience'));
})();
