/* Project locations live in the ordinary links below the map. Add a link with
   state FIPS + town coordinates and its state/cluster lights up automatically. */
(() => {
  const map = document.querySelector('.project-map');
  if (!map) return;
  const ns = 'http://www.w3.org/2000/svg';
  const states = [...map.querySelectorAll('.map-state')];
  const projects = [...map.querySelectorAll('[data-map-project]')];
  const buttons = [...map.querySelectorAll('[data-map-view]')];
  const national = map.querySelector('#map-us');
  const local = map.querySelector('#map-local');
  const detail = map.querySelector('#map-local-svg');
  const status = map.querySelector('#map-status');
  const hint = map.querySelector('#map-hint');
  const byState = new Map();
  let selectedState = projects[0]?.dataset.state;
  let view = 'us';

  // Matches US Atlas' d3.geoAlbersUsa().scale(1300).translate([487.5,305]).
  // The three branches also support future projects in Alaska and Hawaii.
  function project(lon, lat) {
    const radians = Math.PI / 180;
    const settings = lat > 50 ? {p:[55,65],r:154,c:[-2,58.5],k:455,t:[487.5 - 399.1,305 + 261.3]}
      : lon < -140 ? {p:[8,18],r:157,c:[-3,19.9],k:1300,t:[487.5 - 266.5,305 + 275.6]}
      : {p:[29.5,45.5],r:96,c:[-.6,38.7],k:1300,t:[487.5,305]};
    const [p0,p1]=settings.p.map(v=>v*radians);
    const n=(Math.sin(p0)+Math.sin(p1))/2, c=1+Math.sin(p0)*(2*n-Math.sin(p0));
    const raw=(lambda,phi)=>{const rho=Math.sqrt(c-2*n*Math.sin(phi))/n;return [rho*Math.sin(lambda*n),Math.sqrt(c)/n-rho*Math.cos(lambda*n)]};
    const origin=raw(settings.c[0]*radians,settings.c[1]*radians);
    const longitude=((lon+settings.r+180)%360+360)%360-180;
    const point=raw(longitude*radians,lat*radians);
    return [settings.t[0]+settings.k*(point[0]-origin[0]),settings.t[1]-settings.k*(point[1]-origin[1])];
  }
  function svg(tag, attrs, text) {
    const element = document.createElementNS(ns, tag);
    for (const [key,value] of Object.entries(attrs || {})) element.setAttribute(key, String(value));
    if (text !== undefined) element.textContent = text;
    return element;
  }
  for (const [index,link] of projects.entries()) {
    const state=states.find(s=>s.dataset.state===link.dataset.state);
    const lon=Number(link.dataset.lon),lat=Number(link.dataset.lat);
    if (!state || !Number.isFinite(lon) || !Number.isFinite(lat)) continue;
    const item={link,index,state:state.dataset.state,name:link.dataset.label,city:link.dataset.city,point:project(lon,lat)};
    if (!byState.has(item.state)) byState.set(item.state,[]);
    byState.get(item.state).push(item);
  }
  if (!byState.size) return;
  if (!byState.has(selectedState)) selectedState=byState.keys().next().value;
  const stateName = id => states.find(s=>s.dataset.state===id)?.dataset.name || '';
  const reach=byState.size===1?`${stateName(selectedState)}, for now.`:`${byState.size} states. Growing.`;
  const light=document.createElement('i');light.setAttribute('aria-hidden','true');
  map.querySelector('.map-live').replaceChildren(light,document.createTextNode(reach));
  function readout(name, description) {
    status.replaceChildren(document.createTextNode(name), Object.assign(document.createElement('span'),{textContent:description}));
  }
  function resetReadout() {
    const items=byState.get(selectedState);
    readout(stateName(selectedState),`${items.length} website concept${items.length===1?'':'s'}`);
  }
  function highlight(item) {
    map.querySelectorAll('.is-selected').forEach(el=>el.classList.remove('is-selected'));
    if (!item) { resetReadout(); return; }
    item.link.classList.add('is-selected');
    map.querySelectorAll(`[data-project-index="${item.index}"]`).forEach(el=>el.classList.add('is-selected'));
    readout(item.name,`${item.city}, ${stateName(item.state)} · Explore website ↗`);
  }
  function bindHighlight(element,item) {
    element.addEventListener('pointerenter',()=>highlight(item));
    element.addEventListener('focus',()=>highlight(item));
    element.addEventListener('pointerleave',()=>{if(!map.contains(document.activeElement)||!document.activeElement.closest('[data-project-index],[data-map-project]'))highlight(null)});
    element.addEventListener('blur',()=>highlight(null));
  }
  function node(item,x,y,radius=22) {
    const a=svg('a',{href:item.link.getAttribute('href'),class:'map-node','data-project-index':item.index,'aria-label':`${item.name}, ${item.city}. Explore website concept.`});
    a.append(svg('title',{},`${item.name} · ${item.city}`),svg('circle',{cx:x,cy:y,r:radius,class:'map-node-hit'}),svg('circle',{cx:x,cy:y,r:12,class:'map-pin-ring'}),svg('circle',{cx:x,cy:y,r:5,class:'map-pin-core'}));
    bindHighlight(a,item);return a;
  }
  function renderDetail(id) {
    const state=states.find(s=>s.dataset.state===id), items=byState.get(id);
    const [left,top,right,bottom]=state.dataset.bounds.split(',').map(Number);
    const scale=Math.min(540/(right-left),270/(bottom-top));
    const tx=(640-(right-left)*scale)/2-left*scale,ty=(360-(bottom-top)*scale)/2-top*scale;
    detail.replaceChildren();detail.setAttribute('aria-label',`${stateName(id)} website concepts. Locations approximate, shown by town.`);
    detail.append(svg('use',{href:`/assets/map/us-states.svg#state-${id}`,class:'map-local-base',transform:`translate(${tx} ${ty+6}) scale(${scale})`}),svg('use',{href:`/assets/map/us-states.svg#state-${id}`,class:'map-local-shape',transform:`translate(${tx} ${ty}) scale(${scale})`}));
    detail.append(svg('text',{x:320,y:365,'text-anchor':'middle',class:'map-local-label'},stateName(id).toUpperCase()));
    const points=items.map(item=>({item,x:item.point[0]*scale+tx,y:item.point[1]*scale+ty,ox:item.point[0]*scale+tx,oy:item.point[1]*scale+ty}));
    // Nearby towns and same-town projects fan out, with leaders back to the town.
    // Larger transparent targets keep each point usable on a phone.
    const minimum=54;
    for(let iteration=0;iteration<60;iteration++) for(let i=0;i<points.length;i++) for(let j=i+1;j<points.length;j++) {
      const a=points[i],b=points[j];let dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);
      if(d>=minimum)continue;
      if(d<.01){dx=1;dy=0;d=1;}
      const move=(minimum-d)/2;a.x-=dx/d*move;a.y-=dy/d*move;b.x+=dx/d*move;b.y+=dy/d*move;
    }
    for(const p of points){p.x=Math.max(30,Math.min(610,p.x));p.y=Math.max(30,Math.min(330,p.y));
      if(Math.hypot(p.x-p.ox,p.y-p.oy)>2)detail.append(svg('path',{d:`M${p.ox},${p.oy}L${p.x},${p.y}`,class:'map-leader'}),svg('circle',{cx:p.ox,cy:p.oy,r:2,class:'map-origin'}));
      detail.append(node(p.item,p.x,p.y,27));
      detail.append(svg('text',{x:p.x>390?p.x-22:p.x+22,y:p.y+5,'text-anchor':p.x>390?'end':'start',class:'map-town'},p.item.name));
    }
  }
  function selectView(next, id=selectedState) {
    if(!byState.has(id))return;
    selectedState=id;view=next;
    if(view==='local')renderDetail(id);
    national.hidden=view!=='us';local.hidden=view!=='local';
    buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.mapView===view)));
    buttons[1].replaceChildren(document.createTextNode(stateName(id)+' ↗'));
    hint.textContent=view==='us'?'Select a lit point to look closer.':'Select a point to open its site.';
    resetReadout();
  }
  const markers=svg('g',{id:'map-national-nodes'});
  for(const [id,items] of byState){
    const x=items.reduce((sum,item)=>sum+item.point[0],0)/items.length,y=items.reduce((sum,item)=>sum+item.point[1],0)/items.length;
    if(items.length===1){markers.append(node(items[0],x,y));continue;}
    const cluster=svg('a',{href:'#map-projects',class:'map-node map-cluster',role:'button','aria-label':`${stateName(id)}, ${items.length} website concepts. Open closer map.`});
    cluster.append(svg('circle',{cx:x,cy:y,r:34,class:'map-node-hit'}),svg('circle',{cx:x,cy:y,r:30,class:'map-pin-ring'}),svg('circle',{cx:x,cy:y,r:18,class:'map-pin-core'}),svg('text',{x,y:y+.5,class:'map-cluster-count'},items.length),svg('text',{x:x-34,y:y-38,'text-anchor':'end',class:'map-cluster-label'},stateName(id)));
    const open=e=>{e.preventDefault();selectView('local',id);buttons[1].focus({preventScroll:true})};
    cluster.addEventListener('click',open);cluster.addEventListener('keydown',e=>{if(e.key===' ')open(e)});
    cluster.addEventListener('focus',()=>{states.find(s=>s.dataset.state===id).classList.add('is-focused');readout(stateName(id),`${items.length} website concepts`)});
    cluster.addEventListener('blur',()=>states.find(s=>s.dataset.state===id).classList.remove('is-focused'));
    markers.append(cluster);
  }
  map.querySelector('#map-national-nodes').replaceWith(markers);
  states.forEach(state=>{
    state.classList.toggle('has-projects',byState.has(state.dataset.state));
    state.addEventListener('pointerenter',()=>{
      const n=byState.get(state.dataset.state)?.length || 0;
      readout(state.dataset.name,n?`${n} website concept${n===1?'':'s'}`:'A new place for a future story.');
    });
    state.addEventListener('pointerleave',resetReadout);
    if(byState.has(state.dataset.state))state.addEventListener('click',()=>{selectView('local',state.dataset.state);buttons[1].focus({preventScroll:true})});
  });
  for(const items of byState.values())for(const item of items)bindHighlight(item.link,item);
  buttons.forEach(button=>button.addEventListener('click',()=>selectView(button.dataset.mapView)));
  map.querySelector('.map-switch').hidden=false;
  national.querySelector('svg').setAttribute('aria-label',`United States map. ${projects.length} location-based website concepts. Select a highlighted point to explore.`);
  selectView('us');
})();
