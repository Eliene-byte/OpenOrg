// OpenOrg — frontend 100% estático (GitHub Pages). Catálogo: /data/index.json
const OWNER='Eliene-byte',REPO='OpenOrg',BRANCH='main';
const $=s=>document.querySelector(s),RAW=`https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}`;
let items=[],filter='all',PAGE=12,shown=PAGE,sel=[];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ext= p=>p.split('.').pop().toLowerCase();
const kind=p=>{const e=ext(p);return ['png','jpg','jpeg','gif','webp','svg','avif'].includes(e)?'img':['mp4','webm','mov'].includes(e)?'video':['mp3','wav','ogg','m4a'].includes(e)?'audio':['pdf'].includes(e)?'pdf':['txt','md','json','csv','xml','html','css','js','py','java','c','cpp','rs','go','ts','tsx','yml','yaml','log'].includes(e)?'text':'file'};
const ICON={img:'🖼️',video:'🎬',audio:'🎵',pdf:'📄',text:'📝',file:'📦'};
const fmt=n=>n<1024?n+' B':n<1048576?(n/1024).toFixed(1)+' KB':(n/1048576).toFixed(1)+' MB';
const url=p=>p.startsWith('http')?p:RAW+'/'+p.replace(/^\//,'');
async function sha256(buf){const h=await crypto.subtle.digest('SHA-256',buf);return[...new Uint8Array(h)].map(b=>b.toString(16).padStart(2,'0')).join('')}
async function load(){try{items=await(await fetch('data/index.json?'+Date.now())).json()}catch{items=[]}
 if(!Array.isArray(items))items=[];render()}
function filtered(){let q=$('#q').value.trim().toLowerCase(),list=items.filter(i=>(filter==='all'||i.kind===filter||i.collection===filter)&&( !q||JSON.stringify(i).toLowerCase().includes(q)));
 const s=$('#sort').value;list.sort((a,b)=>s==='title'?a.title.localeCompare(b.title):s==='size'?b.size-a.size:s==='downloads'?(b.downloads||0)-(a.downloads||0):new Date(b.date)-new Date(a.date));return list}
function render(){const kinds=['all',...new Set(items.map(i=>i.kind))],tags=['all',...new Set(items.map(i=>i.collection).filter(Boolean))];
 $('#chips').innerHTML=['all',...kinds.slice(1),...tags.slice(1)].map(k=>`<button class="chip ${filter===k?'on':''}" data-f="${esc(k)}">${esc(k==='all'?'Tudo':k)}</button>`).join('');
 document.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{filter=c.dataset.f;shown=PAGE;render()});
 $('#stats').innerHTML=`<span><b>${items.length}</b>arquivos</span><span><b>${fmt(items.reduce((a,i)=>a+(i.size||0),0))}</b>armazenados</span><span><b>${new Set(items.map(i=>i.collection).filter(Boolean)).size}</b>coleções</span><span><b>${items.reduce((a,i)=>a+(i.downloads||0),0)}</b>downloads</span>`;
 const list=filtered(),view=list.slice(0,shown);
 $('#grid').innerHTML=view.map(i=>`<article class="item" data-id="${i.id}"><div class="thumb">${i.kind==='img'?`<img loading="lazy" src="${esc(url(i.path))}" alt="">`:i.kind==='video'?`<video src="${esc(url(i.path))}#t=0.1" muted preload="metadata"></video>`:`<span>${ICON[i.kind]||'📦'}</span>`}</div><div class="b"><h3>${esc(i.title)}</h3><div class="muted">${esc(i.author||'—')} · ${new Date(i.date).toLocaleDateString('pt-BR')}</div><div class="meta"><span class="tag">${esc(i.kind)}</span><span class="tag">${fmt(i.size||0)}</span><span class="tag">⬇ ${i.downloads||0}</span>${(i.tags||[]).map(t=>`<span class="tag">#${esc(t)}</span>`).join('')}</div></div></article>`).join('');
 $('#empty').hidden=list.length>0;$('#moreWrap').hidden=list.length<=shown;$('#more').onclick=()=>{shown+=PAGE;render()};
 document.querySelectorAll('.item').forEach(el=>el.onclick=()=>open(items.find(i=>i.id===el.dataset.id)));
 const cols=[...new Set(items.map(i=>i.collection).filter(Boolean))];
 $('#collections').innerHTML=cols.length?cols.map(c=>{const n=items.filter(i=>i.collection===c).length;return `<div class="card" data-c="${esc(c)}" style="cursor:pointer"><h3>🗂️ ${esc(c)}</h3><p class="muted">${n} arquivo${n>1?'s':''}</p></div>`}).join(''):'<p class="muted">Nenhuma coleção ainda.</p>';
 document.querySelectorAll('[data-c]').forEach(el=>el.onclick=()=>{filter=el.dataset.c;shown=PAGE;render();$('#biblioteca').scrollIntoView({behavior:'smooth'})})}
function open(i){if(!i)return;i.downloads=(i.downloads||0)+1;const u=url(i.path);let body='';
 if(i.kind==='img')body=`<img src="${esc(u)}">`;else if(i.kind==='video')body=`<video src="${esc(u)}" controls autoplay></video>`;
 else if(i.kind==='audio')body=`<audio src="${esc(u)}" controls style="width:100%"></audio>`;
 else if(i.kind==='pdf')body=`<iframe src="${esc(u)}"></iframe>`;
 else if(i.kind==='text')body=`<pre class="mono" style="white-space:pre-wrap;max-height:60vh;overflow:auto">${esc('carregando…')}</pre>`;
 else body=`<p class="muted">Pré-visualização não disponível para este tipo.</p>`;
 $('#vBody').innerHTML=`${body}<h2>${esc(i.title)}</h2><p>${esc(i.desc||'')}</p><div class="meta"><span class="tag">${esc(i.author||'—')}</span><span class="tag">${fmt(i.size||0)}</span>${i.sha256?`<span class="tag mono">SHA256 ${esc(i.sha256.slice(0,12))}…</span>`:''}</div><div style="margin-top:16px;display:flex;gap:10px"><a class="btn primary" href="${esc(u)}" download target="_blank" rel="noopener">⬇ Baixar</a><a class="btn" href="${esc(u)}" target="_blank" rel="noopener">Abrir original</a></div>`;
 show('#viewer');if(i.kind==='text')fetch(u).then(r=>r.text()).then(t=>{const p=$('#vBody pre');if(p)p.textContent=t.slice(0,200000)})}
// --- Admin: upload via GitHub Contents API (nada local, tudo no GitHub) ---
const api=(method,path,body)=>fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`,{method,headers:{Authorization:'Bearer '+($('#token').value.trim()),Accept:'application/vnd.github+json','Content-Type':'application/json'},body:body?JSON.stringify(body):undefined}).then(async r=>{if(!r.ok)throw new Error(r.status+' '+(await r.text()).slice(0,300));return r.json()});
const b64=buf=>{let s='';const b=new Uint8Array(buf);for(let i=0;i<b.length;i+=0x8000)s+=String.fromCharCode(...b.subarray(i,i+0x8000));return btoa(s)};
async function put(path,buf,msg){const sha=await api('GET',path+'?ref='+BRANCH).then(r=>r.sha).catch(()=>null);return api('PUT',path,{message:msg,content:b64(buf),sha,branch:BRANCH})}
const safe=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9._-]/g,'_');
$('#adminBtn').onclick=()=>{$('#token').value=localStorage.getItem('oo_token')||'';show('#admin')};
$('#token').oninput=e=>localStorage.setItem('oo_token',e.target.value);
const pick=()=>$('#files').click();$('#drop').onclick=pick;
$('#files').onchange=e=>{sel=[...e.target.files];$('#drop').textContent=sel.length?sel.map(f=>f.name).join(', '):'Arraste arquivos aqui ou clique para escolher'};
$('#drop').ondragover=e=>{e.preventDefault();$('#drop').classList.add('over')};$('#drop').ondragleave=()=>$('#drop').classList.remove('over');
$('#drop').ondrop=e=>{e.preventDefault();sel=[...e.dataTransfer.files];$('#files').value='';$('#drop').textContent=sel.map(f=>f.name).join(', ')};
$('#publish').onclick=async()=>{if(!sel.length)return $('#log').textContent='Selecione ao menos um arquivo.';
 $('#barWrap').hidden=false;const log=m=>$('#log').textContent=m;try{log('Lendo catálogo…');let cat=items;
 for(let n=0;n<sel.length;n++){const f=sel[n],buf=await f.arrayBuffer(),path='files/'+safe(f.name);$('#bar').style.width=((n)/sel.length*100)+'%';log(`Enviando ${f.name} (${fmt(f.size)}) → ${path}…`);
  await put(path,buf,`Add ${f.name} via OpenOrg`);const id='f'+Date.now().toString(36)+n;
  cat=[{id,title:$('#fTitle').value||f.name.replace(/\.[^.]+$/,''),author:$('#fAuthor').value, collection:$('#fCol').value||'Geral',tags:$('#fTags').value.split(',').map(s=>s.trim()).filter(Boolean),desc:$('#fDesc').value,path,size:f.size,kind:kind(f.name),date:new Date().toISOString(),downloads:0,sha256:await sha256(buf)},...cat.filter(i=>i.path!==path)];}
 $('#bar').style.width='100%';log('Atualizando /data/index.json…');await put('data/index.json',new TextEncoder().encode(JSON.stringify(cat,null,2)),'Update catalog via OpenOrg');
 log('✅ Publicado! O GitHub Actions vai validar e publicar no Pages.');items=cat;render()}catch(e){log('❌ '+e.message)}};
function show(s){$(s).hidden=false}document.querySelectorAll('[data-close]').forEach(b=>b.onclick=e=>e.target.closest('.modal').hidden=true);
document.querySelectorAll('.modal').forEach(m=>m.onclick=e=>{if(e.target===m)m.hidden=true});
document.addEventListener('keydown',e=>{if(e.key==='/'&&document.activeElement.tagName!=='INPUT'&&document.activeElement.tagName!=='TEXTAREA'){e.preventDefault();$('#q').focus()}if(e.key==='Escape')document.querySelectorAll('.modal').forEach(m=>m.hidden=true)});
$('#q').oninput=()=>{shown=PAGE;render()};$('#sort').onchange=render;$('#year').textContent=new Date().getFullYear();load();
