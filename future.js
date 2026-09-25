/* GRS ORBIT: native WebGL geometry, pointer depth and progressive motion. */
(()=>{
'use strict';
const body=document.body,stage=document.querySelector('.future-stage'),canvas=document.getElementById('grs-orbit'),control=document.getElementById('motion-toggle');
const reduce=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(pointer: fine)');
let saved=null;try{saved=localStorage.getItem('grs-motion')}catch{}
let paused=reduce.matches||saved==='paused',visible=true,contextLost=false;
let frame=0,last=0,elapsed=0,yaw=0,pitch=0,targetYaw=0,targetPitch=0,renderer=null;
function labels(){
 const es=document.documentElement.lang==='es';
 document.querySelectorAll('[data-future-en]').forEach(el=>el.textContent=es?el.dataset.futureEs:el.dataset.futureEn);
 control.querySelector('.motion-text').textContent=paused?(es?'Activar movimiento':'Play motion'):(es?'Pausar movimiento':'Pause motion');
 control.querySelector('.motion-symbol').textContent=paused?'▶':'Ⅱ';
 control.setAttribute('aria-label',paused?(es?'Activar animaciones':'Play animations'):(es?'Pausar animaciones':'Pause animations'));
 control.setAttribute('aria-pressed',String(paused));
}
function sync(){
 body.classList.toggle('motion-paused',paused);body.classList.toggle('motion-enabled',!paused);
 labels();cancelAnimationFrame(frame);frame=0;last=0;
 if(renderer){renderer.draw(elapsed,yaw,pitch);if(!paused&&visible&&!document.hidden&&!contextLost)frame=requestAnimationFrame(tick);}
}
control.addEventListener('click',()=>{paused=!paused;try{localStorage.setItem('grs-motion',paused?'paused':'playing')}catch{}sync()});
reduce.addEventListener?.('change',()=>{paused=reduce.matches;sync()});
document.getElementById('langToggle')?.addEventListener('click',labels);
document.addEventListener('visibilitychange',sync);
// Every animation is progressive: content remains visible without the observers.
if('IntersectionObserver' in window){
 const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');reveal.unobserve(e.target)}}),{threshold:.07,rootMargin:'0px 0px 20px 0px'});
 document.querySelectorAll('.section__head,.service-card,.process-step,.review-card,.pricing-card,.about__text,.about__contact,.estimate-intro,.estimate-section .card').forEach((el,i)=>{el.classList.add('future-reveal');el.style.setProperty('--reveal-delay',(el.classList.contains('service-card')?i%4*65:0)+'ms');reveal.observe(el)});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()},{rootMargin:'100px'}).observe(stage);
}
const core=stage.querySelector('.brand-core');
stage.addEventListener('pointermove',e=>{
 if(paused||!fine.matches)return;const r=stage.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
 targetYaw=x*.5;targetPitch=y*.3;core.style.setProperty('--core-x',(-y*13)+'deg');core.style.setProperty('--core-y',(x*18)+'deg');
},{passive:true});
stage.addEventListener('pointerleave',()=>{targetYaw=targetPitch=0;core.style.setProperty('--core-x','0deg');core.style.setProperty('--core-y','0deg')});
document.querySelectorAll('.service-card').forEach(card=>{
 card.addEventListener('pointermove',e=>{if(paused||!fine.matches)return;const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;card.style.setProperty('--tilt-x',((.5-y)*8)+'deg');card.style.setProperty('--tilt-y',((x-.5)*10)+'deg');card.style.setProperty('--shine-x',(x*100)+'%');card.style.setProperty('--shine-y',(y*100)+'%')},{passive:true});
 card.addEventListener('pointerleave',()=>{card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg')});
});
let scrollScheduled=false;
function scroll(){const max=document.documentElement.scrollHeight-innerHeight;body.style.setProperty('--scroll-progress',max>0?scrollY/max:0);scrollScheduled=false}
addEventListener('scroll',()=>{if(!scrollScheduled){scrollScheduled=true;requestAnimationFrame(scroll)}},{passive:true});scroll();
function makeRenderer(){
 const gl=canvas.getContext('webgl',{alpha:true,antialias:true,powerPreference:'low-power',depth:false,preserveDrawingBuffer:false});if(!gl)return null;
 const vertex=`attribute vec3 aPosition;attribute vec3 aColor;uniform float uTime;uniform float uAspect;uniform vec2 uPointer;uniform float uPointSize;varying vec4 vColor;
 mat3 rx(float t){float c=cos(t),s=sin(t);return mat3(1.,0.,0.,0.,c,s,0.,-s,c);}mat3 ry(float t){float c=cos(t),s=sin(t);return mat3(c,0.,-s,0.,1.,0.,s,0.,c);}
 void main(){vec3 p=rx(.28+uPointer.y)*ry(uTime*.13+uPointer.x)*aPosition;float depth=clamp((p.z+2.2)/4.4,0.,1.);gl_Position=vec4(p.x*1.65/uAspect,p.y*1.65+.10,0.,3.8-p.z);gl_PointSize=uPointSize*(.6+depth);vColor=vec4(aColor*(.65+depth*.5),.16+depth*.57);}`;
 const fragment=`precision mediump float;varying vec4 vColor;uniform float uPoints;void main(){float a=vColor.a;if(uPoints>.5){float d=length(gl_PointCoord-.5);a*=1.-smoothstep(.15,.5,d);}gl_FragColor=vec4(vColor.rgb,a);}`;
 function shader(type,src){const sh=gl.createShader(type);gl.shaderSource(sh,src);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS)){gl.deleteShader(sh);return null}return sh}
 const vs=shader(gl.VERTEX_SHADER,vertex),fs=shader(gl.FRAGMENT_SHADER,fragment);if(!vs||!fs)return null;
 const program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))return null;
 const lines=[],dots=[];
 const rotate=(p,ax,az)=>{let[x,y,z]=p;let cy=Math.cos(ax),sy=Math.sin(ax),yy=y*cy-z*sy,zz=y*sy+z*cy;return[x*Math.cos(az)-yy*Math.sin(az),x*Math.sin(az)+yy*Math.cos(az),zz]};
 const add=(arr,p,c)=>arr.push(...p,...c);
 const mobile=innerWidth<700,segments=mobile?100:160;
 const rings=[{r:1.58,t:.032,x:.62,z:.1,c:[.84,.70,.37]},{r:1.64,t:.021,x:1.40,z:.98,c:[.46,.68,.81]},{r:1.50,t:.030,x:1.14,z:-.9,c:[.90,.76,.43]}];
 rings.forEach(r=>{
  const point=(a,b)=>rotate([(r.r+r.t*Math.cos(b))*Math.cos(a),(r.r+r.t*Math.cos(b))*Math.sin(a),r.t*Math.sin(b)],r.x,r.z);
  for(let lane=0;lane<4;lane++)for(let i=0;i<segments;i++){const a=i/segments*Math.PI*2,b=lane/4*Math.PI*2;add(lines,point(a,b),r.c);add(lines,point((i+1)/segments*Math.PI*2,b),r.c)}
  for(let i=0;i<segments;i+=5)for(let lane=0;lane<4;lane++){add(lines,point(i/segments*Math.PI*2,lane/4*Math.PI*2),r.c);add(lines,point(i/segments*Math.PI*2,(lane+1)/4*Math.PI*2),r.c)}
 });
 const count=mobile?85:160,golden=Math.PI*(3-Math.sqrt(5));
 for(let i=0;i<count;i++){const y=1-(i/(count-1))*2,r=Math.sqrt(1-y*y),a=golden*i;add(dots,[Math.cos(a)*r*2.03,y*2.03,Math.sin(a)*r*2.03],i%4===0?[.82,.71,.42]:[.33,.48,.68])}
 function buffer(data){const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);return b}
 const lineBuffer=buffer(lines),dotBuffer=buffer(dots),pos=gl.getAttribLocation(program,'aPosition'),color=gl.getAttribLocation(program,'aColor');
 const uniforms={time:gl.getUniformLocation(program,'uTime'),aspect:gl.getUniformLocation(program,'uAspect'),pointer:gl.getUniformLocation(program,'uPointer'),points:gl.getUniformLocation(program,'uPoints'),size:gl.getUniformLocation(program,'uPointSize')};
 gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.disable(gl.DEPTH_TEST);let aspect=1,ratio=1;
 function resize(){const rect=canvas.getBoundingClientRect();ratio=Math.min(devicePixelRatio||1,mobile?1.5:2);canvas.width=Math.max(1,Math.round(rect.width*ratio));canvas.height=Math.max(1,Math.round(rect.height*ratio));aspect=rect.width/Math.max(1,rect.height);gl.viewport(0,0,canvas.width,canvas.height)}
 function draw(time,yaw,pitch){gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(program);gl.uniform1f(uniforms.time,time);gl.uniform1f(uniforms.aspect,aspect);gl.uniform2f(uniforms.pointer,yaw,pitch);gl.uniform1f(uniforms.size,2.4*ratio);gl.enableVertexAttribArray(pos);gl.enableVertexAttribArray(color);
  [[lineBuffer,lines.length/6,gl.LINES,0],[dotBuffer,dots.length/6,gl.POINTS,1]].forEach(([b,n,type,point])=>{gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.vertexAttribPointer(pos,3,gl.FLOAT,false,24,0);gl.vertexAttribPointer(color,3,gl.FLOAT,false,24,12);gl.uniform1f(uniforms.points,point);gl.drawArrays(type,0,n)})
 }
 resize();stage.classList.add('webgl-ready');return{resize,draw};
}
function tick(now){frame=0;if(paused||!visible||document.hidden||contextLost)return;const interval=innerWidth<700?1000/30:1000/45;if(!last)last=now;if(now-last>=interval){elapsed+=Math.min((now-last)/1000,.06);last=now;yaw+=(targetYaw-yaw)*.06;pitch+=(targetPitch-pitch)*.06;renderer.draw(elapsed,yaw,pitch)}frame=requestAnimationFrame(tick)}
try{renderer=makeRenderer()}catch{stage.classList.remove('webgl-ready')}
addEventListener('resize',()=>{scroll();if(renderer){renderer.resize();renderer.draw(elapsed,yaw,pitch)}},{passive:true});
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();contextLost=true;stage.classList.remove('webgl-ready');cancelAnimationFrame(frame);frame=0});
canvas.addEventListener('webglcontextrestored',()=>{contextLost=false;try{renderer=makeRenderer();sync()}catch{stage.classList.remove('webgl-ready')}});
sync();
})();
