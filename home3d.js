import * as THREE from './vendor/three.module.min.js';
// A lightweight, illustrative service map. No ongoing rendering when idle.
export async function initHouse(host,currentRoom){
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;
 host.append(renderer.domElement);renderer.domElement.setAttribute('aria-hidden','true');
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(38,1,.1,60),house=new THREE.Group();scene.add(house);
 camera.position.set(9,10,12);camera.lookAt(0,0,0);
 scene.add(new THREE.HemisphereLight(0xc6eaff,0x15243a,2.6));const light=new THREE.DirectionalLight(0xfff0c5,3.5);light.position.set(5,10,3);scene.add(light);
 const mat=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.55,metalness:.2,...extra});
 const wall=mat(0x7692ad),white=mat(0xe0e7ea),navy=mat(0x1b2a4a),gold=mat(0xc9a84c),blue=mat(0x40729c),wood=mat(0x886c43);
 function box(w,h,d,x,y,z,material,parent=house){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);mesh.position.set(x,y,z);parent.add(mesh);return mesh}
 box(8.35,.3,6.65,0,-.25,0,navy);box(8.5,.06,6.8,0,-.42,0,gold);
 const roomData=[['kitchen',-2,-1.6,0x32546b],['bathroom',2,-1.6,0x39606c],['living',-2,1.6,0x45516b],['bedroom',2,1.6,0x4b4e62]];
 const floors=[];const groups={};
 roomData.forEach(([key,x,z,color])=>{const group=new THREE.Group();group.position.set(x,0,z);group.userData.room=key;house.add(group);groups[key]=group;const floor=box(3.88,.13,3.08,0,-.035,0,mat(color),group);floor.userData.room=key;floor.userData.base=color;floors.push(floor);
 const edge=new THREE.LineSegments(new THREE.EdgesGeometry(floor.geometry),new THREE.LineBasicMaterial({color:0x75cfff,transparent:true,opacity:.65}));edge.position.copy(floor.position);group.add(edge);
 });
 // Low cutaway walls preserve visibility and direct room selection.
 box(8.1,1.45,.12,0,.72,-3.18,wall);box(.12,1.45,6.3,-4,.72,0,wall);box(.1,.48,6.3,0,.24,0,wall);box(8,.48,.1,0,.24,0,wall);box(.12,.48,6.3,4,.24,0,wall);
 // Kitchen: cabinets, countertop, sink and cooktop.
 const kitchen=groups.kitchen;box(3.35,.8,.62,0,.4,-1.1,navy,kitchen);box(3.5,.09,.75,0,.85,-1.1,white,kitchen);box(.55,.04,.4,-.65,.91,-1.1,blue,kitchen);box(.65,.04,.43,.7,.91,-1.1,navy,kitchen);
 box(1.5,.65,.7,.1,.33,.5,wood,kitchen);box(1.65,.08,.8,.1,.7,.5,white,kitchen);
 [-.9,.9].forEach(x=>box(.04,.04,.42,x,.48,-.76,gold,kitchen));
 // Bathroom: tub, vanity and toilet.
 const bathroom=groups.bathroom;box(1.45,.46,.75,.65,.23,-.95,white,bathroom);box(1.18,.02,.5,.65,.475,-.95,blue,bathroom);box(.8,.73,.55,-1,.36,-1,navy,bathroom);box(.85,.07,.6,-1,.76,-1,white,bathroom);box(.6,.04,.4,-1,.805,-1,blue,bathroom);box(.5,.48,.65,.9,.24,.7,white,bathroom);box(.5,.75,.16,.9,.375,.35,white,bathroom);
 // Living room: sofa, table and media console.
 const living=groups.living;box(2.2,.38,.85,-.2,.28,.7,white,living);box(2.2,.55,.18,-.2,.67,1.08,blue,living);[-1.3,.9].forEach(x=>box(.2,.6,.85,x,.48,.7,blue,living));box(1.15,.32,.58,-.2,.16,-.4,wood,living);box(1.6,.42,.36,-.2,.21,-1.23,navy,living);
 // Bedroom: bed, headboard and nightstands.
 const bedroom=groups.bedroom;box(1.6,.33,2,0,.19,0,wood,bedroom);box(1.55,.18,1.95,0,.445,0,white,bedroom);box(1.56,.06,1.2,0,.56,.36,blue,bedroom);box(1.7,.9,.15,0,.45,-1.08,navy,bedroom);[-.4,.4].forEach(x=>box(.58,.12,.4,x,.58,-.62,white,bedroom));[-1.3,1.3].forEach(x=>box(.5,.5,.5,x,.25,-.7,wood,bedroom));
 const grid=new THREE.GridHelper(15,30,0x406181,0x203650);grid.position.y=-.48;scene.add(grid);
 const ring=new THREE.Mesh(new THREE.RingGeometry(5.9,5.93,80),new THREE.MeshBasicMaterial({color:0xc9a84c,side:THREE.DoubleSide,transparent:true,opacity:.5}));ring.rotation.x=-Math.PI/2;ring.position.y=-.46;scene.add(ring);
 let visible=true,frame=0,lost=false;let yaw=-.14;house.rotation.y=yaw;
 function draw(){frame=0;if(visible&&!document.hidden&&!lost)renderer.render(scene,camera)}
 function requestDraw(){if(!frame)frame=requestAnimationFrame(draw)}
 function resize(){const r=host.getBoundingClientRect();renderer.setSize(Math.max(r.width,1),Math.max(r.height,1),false);camera.aspect=r.width/Math.max(r.height,1);camera.updateProjectionMatrix();requestDraw()}
 function select(key){floors.forEach(f=>{f.material.color.setHex(f.userData.room===key?0xb99a48:f.userData.base);f.material.emissive.setHex(f.userData.room===key?0x3b2705:0x000000)});requestDraw()}
 document.addEventListener('grs-room-selected',e=>select(e.detail));select(currentRoom());
 const controls=['house-left','house-reset','house-right'];controls.forEach(id=>document.getElementById(id).addEventListener('click',()=>{yaw=id==='house-reset'?-.14:yaw+(id==='house-left'?-.3:.3);house.rotation.y=yaw;requestDraw()}));
 const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();let drag=null;
 renderer.domElement.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,last:e.clientX,moved:false};renderer.domElement.setPointerCapture(e.pointerId)});
 renderer.domElement.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;if(Math.abs(e.clientX-drag.x)+Math.abs(e.clientY-drag.y)>8)drag.moved=true;if(drag.moved){yaw+=(e.clientX-drag.last)*.008;house.rotation.y=yaw;requestDraw();}drag.last=e.clientX});
 renderer.domElement.addEventListener('pointerup',e=>{if(!drag||e.pointerId!==drag.id)return;if(!drag.moved){const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(Object.values(groups),true)[0];if(hit){let obj=hit.object;while(obj&&!obj.userData.room)obj=obj.parent;if(obj)document.dispatchEvent(new CustomEvent('grs-room-picked',{detail:obj.userData.room}));}}drag=null;});
 renderer.domElement.addEventListener('pointercancel',()=>drag=null);
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;cancelAnimationFrame(frame);frame=0;document.getElementById('house-status').textContent=document.documentElement.lang==='es'?'Vista 3D interrumpida. Los botones de espacios siguen disponibles.':'3D view interrupted. Room buttons are still available.'});
 renderer.domElement.addEventListener('webglcontextrestored',()=>{lost=false;resize()});
 new ResizeObserver(resize).observe(host);new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(visible)requestDraw();else{cancelAnimationFrame(frame);frame=0}}).observe(host);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0}else requestDraw()});
 document.addEventListener('grs-motion-change',requestDraw);
 function language(){const status=document.getElementById('house-status');status.replaceChildren();const s=document.createElement('span');s.dataset.grsEn='Drag to rotate. Tap a room or use the buttons.';s.dataset.grsEs='Arrastra para girar. Toca un espacio o usa los botones.';s.textContent=document.documentElement.lang==='es'?s.dataset.grsEs:s.dataset.grsEn;status.append(s)}language();resize();
}
