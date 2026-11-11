'use strict';

const THEMES = [
  {id:'land',no:'01',era:'LAND AND AGRICULTURE',title:'Changing the land',short:'How did people adapt their surroundings to build new opportunities?',brief:'Investigate drainage projects, farming and efforts to change the landscape. Consider their benefits as well as environmental costs.',image:'orchards.webp',icon:'♧',questions:['What environmental or farming challenge were people trying to solve?','What methods or organisations helped make change possible?','What benefits and environmental costs followed?'],resources:['land','community']},
  {id:'community',no:'02',era:'1900s ONWARDS',title:'Kibbutzim and community',short:'Could working together help build an entirely new way of life?',brief:'Explore how collective settlements organised work, agriculture and society, and how their role changed over time.',image:'orchards.webp',icon:'♙',questions:['Why did the first kibbutzim emerge?','How did shared responsibility help communities overcome difficulties?','How and why did the kibbutz movement change?'],resources:['community','land']},
  {id:'early',no:'03',era:'AFTER INDEPENDENCE',title:'A country under pressure',short:'How did Israel face shortages while absorbing new immigrants?',brief:'Explore the challenges of independence, immigration and the rationing system, known as tzena.',image:'austerity.webp',icon:'◷',questions:['Why were rationing and austerity introduced?','What difficulties did families and new immigrants face?','How did the country respond, and what were the trade offs?'],resources:['early','community']},
  {id:'water',no:'04',era:'1950s AND 1960s',title:'Water and solar power',short:'How did limited natural resources encourage new ideas?',brief:'Find out how water scarcity and energy shortages inspired practical innovations, including solar heating and drip irrigation.',image:'irrigation.webp',icon:'☀',questions:['What problems did water and energy shortages create?','How did solar heating and drip irrigation work?','How did these ideas spread or help people elsewhere?'],resources:['water','land']},
  {id:'breakthroughs',no:'05',era:'1970s TO 1990s',title:'Everyday breakthroughs',short:'How did Israeli inventors solve problems beyond farming?',brief:'Explore Afimilk, Epilady and Quicktionary. What turns a clever idea into a useful product?',image:'milk.webp',icon:'✺',questions:['What everyday problem did each invention address?','Who developed it and how did the idea reach users?','What makes one invention successful while another fades?'],resources:['breakthroughs','water']},
  {id:'global',no:'06',era:'2000s AND BEYOND',title:'Ideas that travel',short:'Can one invention make a difference far beyond Israel?',brief:'Research medical and consumer technologies, such as PillCam and ReWalk, and ask how their impact can be measured.',image:'pillcam.webp',icon:'✦',questions:['Which need did an invention try to meet?','How did scientists, engineers or businesses develop the solution?','What evidence shows its benefits and limitations?'],resources:['global','breakthroughs']}
];
const COLUMNS = [
  {id:'challenge',title:'The challenge',question:'What problem needed solving?',color:'#d7688e',number:'01'},
  {id:'breakthrough',title:'The breakthrough',question:'What was the new idea?',color:'#19a9d6',number:'02'},
  {id:'people',title:'The people',question:'Who made it happen?',color:'#a77ad2',number:'03'},
  {id:'impact',title:'The impact',question:'Who did it help?',color:'#55ae78',number:'04'},
  {id:'secret',title:'The secret',question:'What does it reveal?',color:'#d69336',number:'05'}
];
const SOURCE_LINKS = [
  {label:'Israel Innovation Authority',url:'https://innovationisrael.org.il/en/',topics:['global','breakthroughs','water']},
  {label:'Netafim: Our story',url:'https://www.netafim.com/en/netafim-irrigation-company-about-us/',topics:['water','land']},
  {label:'National Library of Israel: Austerity',url:'https://www.nli.org.il/en/discover/israel-culture-and-society/israeli-food/tzena',topics:['early','community']},
  {label:'Jewish National Fund: History',url:'https://www.jnf.org/our-history',topics:['land','community']}
];
const STORAGE_BOARD='explore_secret_board_v1',STORAGE_GALLERY='explore_secret_gallery_v1',STORAGE_TIMER='explore_secret_timer_v1';
const DURATION=1800;
let board=null,gallery=[],presented=null,presentationSource='local',presentationIndex=-1,selectedTheme='land',editingId=null,activeResource='land';
let timer={remaining:DURATION,running:false,endAt:0};
const $=s=>document.querySelector(s),$$=s=>Array.from(document.querySelectorAll(s));
const uid=()=>{try{return crypto.randomUUID()}catch{return String(Date.now())+String(Math.random()).slice(2)}};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const imageFor=src=>window.SECRET_ASSET_MAP?.[src]||`assets/${src}`;
const themeById=id=>THEMES.find(t=>t.id===id)||THEMES[0];
const articleById=id=>(window.SECRET_RESEARCH||[]).find(a=>a.id===id);
const fmtTime=seconds=>`${Math.floor(seconds/60).toString().padStart(2,'0')}:${(seconds%60).toString().padStart(2,'0')}`;
const safeUrl=value=>{try{const u=new URL(String(value));return ['https:','http:'].includes(u.protocol)?u.href:''}catch{return''}};
const boardShape=b=>b&&typeof b==='object'&&typeof b.team==='string'&&THEMES.some(t=>t.id===b.theme)&&Array.isArray(b.cards)&&b.cards.length<=200;
const capped=(v,n)=>String(v??'').slice(0,n);
function cleanBoard(candidate){
  if(!boardShape(candidate))throw Error('This does not appear to be a valid thought board.');
  return {id:capped(candidate.id,90)||uid(),team:capped(candidate.team,65),members:capped(candidate.members,200),theme:candidate.theme,conclusion:capped(candidate.conclusion,850),savedAt:Number(candidate.savedAt)||Date.now(),cards:candidate.cards.slice(0,100).map(c=>({id:capped(c.id,90)||uid(),col:COLUMNS.some(k=>k.id===c.col)?c.col:'challenge',title:capped(c.title,110),detail:capped(c.detail,650),source:capped(c.source,150),url:safeUrl(c.url)}))};
}
function readStorage(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
function writeStorage(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch{toast('Storage is unavailable. Download a backup before leaving.');return false}}
let toastTimeout;
function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>el.classList.remove('show'),3900)}
function saveBoard(){if(!board)return;board.savedAt=Date.now();writeStorage(STORAGE_BOARD,board);$('#save-status').textContent='Saved on this device'}
function setView(view){
 if(view==='workspace'&&!board){toast('Choose a mission to begin.');view='home';}
 $$('.view').forEach(v=>v.classList.toggle('hidden',v.id!==`view-${view}`));
 $$('.nav-button').forEach(n=>n.classList.toggle('active',n.dataset.nav===view));
 $('#mobile-links').classList.add('hidden');$('#mobile-menu').setAttribute('aria-expanded','false');
 if(view==='workspace')renderWorkspace();
 if(view==='teacher'){renderGallery();updateTimerUI()}
 window.scrollTo({top:0,behavior:'instant'});
 const target={home:'#home',workspace:'#workspace',teacher:'#teacher',present:'#present'}[view];
 if(target){try{history.replaceState(null,'',location.pathname+location.search+target)}catch{}}
}
function renderMissions(){
 $('#mission-grid').innerHTML=THEMES.map(t=>`<article class="mission-tile"><div class="mission-img" style="background-image:url('${imageFor(t.image)}')"><span class="mission-nr">MISSION ${t.no}</span><span class="mission-icon" aria-hidden="true">${t.icon}</span></div><div class="mission-tile-body"><div class="mission-era">${esc(t.era)}</div><h3>${esc(t.title)}</h3><p>${esc(t.short)}</p><button type="button" class="mission-start" data-theme="${t.id}">START INVESTIGATION <span>→</span></button></div></article>`).join('');
 $$('.mission-start').forEach(b=>b.addEventListener('click',()=>openSetup(b.dataset.theme)));
}
function openSetup(id){
 selectedTheme=id;const t=themeById(id);
 $('#setup-title').textContent=t.title;$('#setup-subtitle').textContent=t.short;
 $('#setup-cover').style.backgroundImage=`linear-gradient(90deg,#091f3866,#091f3822),url('${imageFor(t.image)}')`;
 $('#team-name').value=board?.theme===id?board.team:'';
 $('#team-members').value=board?.theme===id?board.members:'';
 $('#setup-dialog').showModal();$('#team-name').focus();
}
function openDialog(id){$(id).showModal()}
function closeDialog(id){const d=$(id);if(d?.open)d.close()}
function beginMission(event){event.preventDefault();
 const team=$('#team-name').value.trim();if(!team){toast('Please enter your team name.');return}
 if(board&&board.cards.length&&board.theme!==selectedTheme&&!confirm('Start a new mission? The current board will be replaced on this device. Download a backup first if you want to keep it.'))return;
 if(board&&board.theme===selectedTheme&&board.team===team){board.members=$('#team-members').value.trim().slice(0,200)}
 else board={id:uid(),team:team.slice(0,65),members:$('#team-members').value.trim().slice(0,200),theme:selectedTheme,cards:[],conclusion:'',savedAt:Date.now()};
 saveBoard();closeDialog('#setup-dialog');setView('workspace');toast('Mission started. Your thought board is ready.');
}
function renderWorkspace(){
 if(!board)return;
 const t=themeById(board.theme);
 $('#board-heading').textContent=t.title;$('#board-team-name').textContent=board.team;$('#board-members').textContent=board.members||'Team research lab';$('#sidebar-photo').style.backgroundImage=`url('${imageFor(t.image)}')`;
 $('#sidebar-theme').textContent=t.title;$('#sidebar-brief').textContent=t.brief;
 $('#question-list').innerHTML=t.questions.map(q=>`<li>${esc(q)}</li>`).join('');
 $('#sidebar-resource-list').innerHTML=t.resources.map(r=>{const a=articleById(r);return a?`<button class="mini-resource" data-resource="${r}" type="button"><img alt="" src="${imageFor(a.image)}"><span>${esc(a.title)}<small>Read supplied material ↗</small></span></button>`:''}).join('');
 $$('#sidebar-resource-list [data-resource]').forEach(b=>b.addEventListener('click',()=>showResources(b.dataset.resource)));
 $('#conclusion-input').value=board.conclusion;$('#conclusion-count').textContent=`${board.conclusion.length} / 850`;
 renderColumns();
}
function renderColumns(){if(!board)return;
 $('#board-columns').innerHTML=COLUMNS.map(c=>{
  const notes=board.cards.filter(n=>n.col===c.id);
  return `<section class="thought-column" data-col="${c.id}" style="--accent:${c.color}" aria-label="${c.title}"><div class="thought-col-head"><span class="thought-col-number">${c.number} / 05</span><h3>${c.title}</h3><p>${c.question}</p></div><div class="note-list">${notes.length?notes.map(n=>renderNote(n)).join(''):'<div class="empty-note">Your discoveries will appear here.</div>'}</div><button class="add-to-column" type="button" data-add-column="${c.id}">+ ADD A NOTE</button></section>`;
 }).join('');
 const used=new Set(board.cards.filter(n=>n.title.trim()).map(n=>n.col));
 $('#board-progress').textContent=`${used.size} of 5 stages explored`;
 $$('[data-add-column]').forEach(b=>b.addEventListener('click',()=>openNote(b.dataset.addColumn)));
 $$('.edit-note').forEach(b=>b.addEventListener('click',()=>openNote(null,b.dataset.edit)));
 $$('[data-move]').forEach(b=>b.addEventListener('click',()=>moveNote(b.dataset.id,Number(b.dataset.move))));
 $$('.sticky-note').forEach(n=>n.addEventListener('dragstart',e=>{e.dataTransfer.setData('text/plain',n.dataset.noteId);e.dataTransfer.effectAllowed='move'}));
 $$('.thought-column').forEach(c=>{
  c.addEventListener('dragover',e=>{e.preventDefault();c.classList.add('drag-over')});
  c.addEventListener('dragleave',e=>{if(!c.contains(e.relatedTarget))c.classList.remove('drag-over')});
  c.addEventListener('drop',e=>{e.preventDefault();c.classList.remove('drag-over');let n=board.cards.find(a=>a.id===e.dataTransfer.getData('text/plain'));if(n){n.col=c.dataset.col;saveBoard();renderColumns();toast('Discovery moved.')}});
 });
}
function renderNote(n){
 const cidx=COLUMNS.findIndex(c=>c.id===n.col);const link=safeUrl(n.url);
 return `<article class="sticky-note" draggable="true" data-column="${n.col}" data-note-id="${esc(n.id)}"><button type="button" data-edit="${esc(n.id)}" class="edit-note" title="Edit discovery" aria-label="Edit discovery">✎</button><h4>${esc(n.title)}</h4><p>${esc(n.detail)}</p>${n.source?`<div class="sticky-source">SOURCE: ${link?`<a href="${esc(link)}" target="_blank" rel="noopener noreferrer">${esc(n.source)} ↗</a>`:esc(n.source)}</div>`:''}<div class="note-card-actions"><button type="button" data-move="-1" data-id="${esc(n.id)}" ${cidx===0?'disabled':''} title="Move note left" aria-label="Move note left">←</button><button type="button" data-move="1" data-id="${esc(n.id)}" ${cidx===COLUMNS.length-1?'disabled':''} title="Move note right" aria-label="Move note right">→</button></div></article>`;
}
function openNote(col='challenge',id=null){
 editingId=id;
 const n=id?board.cards.find(x=>x.id===id):null;
 $('#note-dialog-kicker').textContent=n?'EDIT YOUR DISCOVERY':'ADD A DISCOVERY';
 $('#note-column').innerHTML=COLUMNS.map(c=>`<option value="${c.id}">${c.title}</option>`).join('');
 $('#note-column').value=n?.col||col||'challenge';$('#note-title').value=n?.title||'';$('#note-detail').value=n?.detail||'';
 $('#note-source').value=n?.source||'';$('#note-source-url').value=n?.url||'';
 $('#note-delete').classList.toggle('hidden',!n);
 $('#note-dialog').showModal();$('#note-title').focus();
}
function saveNote(e){e.preventDefault();
 if(!board)return;
 const title=$('#note-title').value.trim(),detail=$('#note-detail').value.trim();
 if(!title||!detail){toast('Add a title and a short explanation.');return}
 if(!editingId&&board.cards.length>=70){toast('This board has reached its note limit.');return}
 const value={id:editingId||uid(),col:$('#note-column').value,title:title.slice(0,110),detail:detail.slice(0,650),source:$('#note-source').value.trim().slice(0,150),url:safeUrl($('#note-source-url').value)};
 if($('#note-source-url').value.trim()&&!value.url){toast('Enter a link beginning with https:// or leave the link blank.');return}
 if(editingId){const i=board.cards.findIndex(x=>x.id===editingId);if(i>=0)board.cards[i]=value}
 else board.cards.push(value);
 saveBoard();closeDialog('#note-dialog');renderColumns();toast(editingId?'Discovery updated.':'Discovery added.');editingId=null;
}
function deleteNote(){if(!editingId)return;if(!confirm('Delete this discovery?'))return;board.cards=board.cards.filter(c=>c.id!==editingId);saveBoard();closeDialog('#note-dialog');renderColumns();editingId=null;toast('Discovery deleted.');}
function moveNote(id,step){const n=board?.cards.find(c=>c.id===id);if(!n)return;const i=COLUMNS.findIndex(x=>x.id===n.col);const next=COLUMNS[i+step];if(next){n.col=next.id;saveBoard();renderColumns()}}
function showResources(id){activeResource=id||board?.theme||'land';renderResources();openDialog('#resource-dialog')}
function renderResources(){
 const articles=window.SECRET_RESEARCH||[];const selected=articleById(activeResource)||articles[0];if(!selected)return;
 $('#resource-list-full').innerHTML=articles.map(a=>`<button type="button" class="resource-select ${a.id===selected.id?'active':''}" data-open-article="${a.id}"><img src="${imageFor(a.image)}" alt=""><span>${esc(a.title)}</span></button>`).join('');
 $$('[data-open-article]').forEach(b=>b.addEventListener('click',()=>{activeResource=b.dataset.openArticle;renderResources()}));
 $('#resource-content').innerHTML=`<div class="reader-cover" style="background-image:url('${imageFor(selected.image)}')"></div><h2>${esc(selected.title)}</h2><p class="reader-source">SUPPLIED WORKSHOP RESEARCH MATERIAL · ${esc(selected.filename)}</p><div class="reader-notice"><strong>Research starting point.</strong> This text is adapted from the resources supplied for the workshop, not an independently verified reference. Check important claims against other reliable sources and include publication dates in your notes.</div>${selected.paragraphs.map(p=>`<p class="reader-paragraph">${esc(p)}</p>`).join('')}<div class="reader-external"><h3>Look further and check your sources</h3>${SOURCE_LINKS.filter(s=>s.topics.includes(selected.id)).map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)} ↗</a>`).join('')||SOURCE_LINKS.map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)} ↗</a>`).join('')}</div>`;
 $('#resource-content').scrollTop=0;
}
function setGallery(next){gallery=next;writeStorage(STORAGE_GALLERY,gallery);renderGallery()}
function addToGallery(b){
 const snap=cleanBoard(b);const exists=gallery.findIndex(x=>x.id===snap.id);if(exists>=0)gallery[exists]=snap;else gallery.push(snap);
 setGallery(gallery);toast(`Added ${snap.team} to the class gallery.`);
}
function renderGallery(){
 $('#gallery-count').textContent=String(gallery.length);
 const el=$('#teacher-gallery');
 if(!gallery.length){el.innerHTML='<div class="empty-gallery"><strong>No teams added yet</strong><p>Paste a team link above and their board will appear here.</p></div>';return}
 el.innerHTML=gallery.map((b,i)=>`<div class="gallery-row"><span class="gallery-avatar">${themeById(b.theme).icon}</span><div class="gallery-description"><strong>${esc(b.team)}</strong><span>${esc(themeById(b.theme).title)} · ${b.cards.length} discoveries</span></div><div class="gallery-actions"><button type="button" class="btn btn-subtle" data-present-gallery="${i}">Present</button><button type="button" class="gallery-remove" data-remove-gallery="${i}" aria-label="Remove ${esc(b.team)} from gallery">×</button></div></div>`).join('');
 $$('[data-present-gallery]').forEach(b=>b.addEventListener('click',()=>presentFromGallery(Number(b.dataset.presentGallery))));
 $$('[data-remove-gallery]').forEach(b=>b.addEventListener('click',()=>{const i=Number(b.dataset.removeGallery);if(confirm(`Remove ${gallery[i].team} from this gallery?`)){gallery.splice(i,1);setGallery(gallery)}}));
}
function presentFromGallery(i){if(!gallery[i])return;presentationIndex=i;presentationSource='gallery';presented=cleanBoard(gallery[i]);renderPresentation();setView('present')}
function presentLocal(){if(!board){toast('There is no saved thought board yet.');return}presentationSource='local';presentationIndex=-1;presented=cleanBoard(board);renderPresentation();setView('present')}
function renderPresentation(){if(!presented)return;
 const theme=themeById(presented.theme);
 $('#present-title').textContent=theme.title;$('#present-team').textContent=`${presented.team}${presented.members?' · '+presented.members:''}`;
 $('#present-columns').innerHTML=COLUMNS.map(c=>`<section class="present-col" style="--accent:${c.color}"><div class="present-col-head">${esc(c.title)}</div>${presented.cards.filter(n=>n.col===c.id).length?presented.cards.filter(n=>n.col===c.id).map(n=>`<div class="present-note"><strong>${esc(n.title)}</strong><p>${esc(n.detail)}</p>${n.source?`<small>Source: ${esc(n.source)}</small>`:''}</div>`).join(''):'<p class="present-blank">No findings added</p>'}</section>`).join('');
 $('#present-conclusion-text').textContent=presented.conclusion||'Our team is still working on its answer.';
 const fromGallery=presentationSource==='gallery';
 $('#presentation-count').textContent=fromGallery?`TEAM ${presentationIndex+1} OF ${gallery.length}`:'TEAM SHOWCASE';
 $('#presentation-nav-label').textContent=fromGallery?`${presentationIndex+1} of ${gallery.length}`:'Your team';
 $('#previous-board').disabled=!fromGallery||presentationIndex<=0;$('#next-board').disabled=!fromGallery||presentationIndex>=gallery.length-1;
 $('#present-gallery-add').classList.toggle('hidden',fromGallery);
}
function backFromPresentation(){if(presentationSource==='local'&&board)setView('workspace');else setView('teacher')}
function stepPresentation(step){if(presentationSource==='gallery')presentFromGallery(presentationIndex+step)}
async function encodeBoard(b){
 const bytes=new TextEncoder().encode(JSON.stringify({v:1,board:cleanBoard(b)}));let packed=bytes,prefix='b';
 if('CompressionStream' in window){try{const stream=new Blob([bytes]).stream().pipeThrough(new CompressionStream('gzip'));packed=new Uint8Array(await new Response(stream).arrayBuffer());prefix='g'}catch{packed=bytes}}
 let raw='';for(let i=0;i<packed.length;i+=16000)raw+=String.fromCharCode(...packed.slice(i,i+16000));
 return prefix+'.'+btoa(raw).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
async function decodeBoard(data){
 if(typeof data!=='string'||data.length>500000)throw Error('This link is too large.');
 const [prefix,encoded]=[data.slice(0,2),data.slice(2)];if(!['g.','b.'].includes(prefix))throw Error('This link is not supported.');
 const raw=atob(encoded.replace(/-/g,'+').replace(/_/g,'/')+'='.repeat((4-encoded.length%4)%4));
 let bytes=Uint8Array.from(raw,c=>c.charCodeAt(0));
 if(prefix==='g.'){if(!('DecompressionStream' in window))throw Error('This browser cannot read this compressed board.');const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));bytes=new Uint8Array(await new Response(stream).arrayBuffer())}
 const decoded=JSON.parse(new TextDecoder().decode(bytes));if(decoded.v!==1)throw Error('Unknown board format.');return cleanBoard(decoded.board);
}
async function parseBoardLink(text){
 const link=text.trim();if(link.startsWith('g.')||link.startsWith('b.'))return decodeBoard(link);
 const url=new URL(link);const encoded=url.searchParams.get('board');if(!encoded)throw Error('The link has no board data.');return decodeBoard(encoded);
}
async function makeShareLink(b){const data=await encodeBoard(b);const url=new URL(location.href);url.search='';url.hash='';url.searchParams.set('board',data);return url.toString()}
async function openShare(){
 if(!board){toast('Make a board first.');return}
 openDialog('#share-dialog');$('#share-link').value='Preparing link…';$('#copy-share').disabled=true;
 if(location.protocol==='file:'){$('#share-link').value='Publish the files to GitHub Pages before sharing a link. You can download a backup now.';toast('A public website address is needed for share links.');return}
 try{const url=await makeShareLink(board);$('#share-link').value=url;$('#copy-share').disabled=false;if(url.length>12000)toast('This link is long. Consider downloading a backup as well.')}catch(e){$('#share-link').value='Could not generate a link. Please download a board backup.';toast(e.message)}
}
async function copyText(text){try{await navigator.clipboard.writeText(text);toast('Link copied. Send it to your teacher.')}catch{const field=$('#share-link');field.focus();field.select();try{document.execCommand('copy');toast('Link copied.')}catch{toast('Select the link above and copy it manually.')}}}
function downloadBoard(b){
 if(!b){toast('There is no board to download.');return}
 const blob=new Blob([JSON.stringify({format:'explore-secret-board',version:1,board:cleanBoard(b)},null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;
 a.download=`${(b.team||'team').toLowerCase().replace(/[^a-z0-9]+/g,'_').slice(0,40)}_thought_board.json`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Board backup downloaded.');
}
function loadTimer(){const saved=readStorage(STORAGE_TIMER,null);if(saved&&Number.isFinite(saved.remaining)&&saved.remaining>=0&&saved.remaining<=DURATION){timer=saved;if(timer.running)timer.remaining=Math.max(0,Math.ceil((timer.endAt-Date.now())/1000));if(timer.remaining===0)timer.running=false}}
function storeTimer(){writeStorage(STORAGE_TIMER,timer)}
function tickTimer(){if(!timer.running)return;timer.remaining=Math.max(0,Math.ceil((timer.endAt-Date.now())/1000));if(timer.remaining===0){timer.running=false;storeTimer();toast('Time is up. Prepare to present your discoveries.')}updateTimerUI()}
function updateTimerUI(){if(timer.running)timer.remaining=Math.max(0,Math.ceil((timer.endAt-Date.now())/1000));$('#timer-readout').textContent=fmtTime(timer.remaining);$('#timer-bar').style.width=`${(timer.remaining/DURATION)*100}%`;$('#timer-toggle').textContent=timer.running?'Ⅱ Pause timer':timer.remaining===0?'▶ Start again':'▶ Start timer'}
function toggleTimer(){if(timer.running){timer.remaining=Math.max(0,Math.ceil((timer.endAt-Date.now())/1000));timer.running=false}else{if(timer.remaining===0)timer.remaining=DURATION;timer.running=true;timer.endAt=Date.now()+timer.remaining*1000}storeTimer();updateTimerUI()}
function resetTimer(){timer={remaining:DURATION,running:false,endAt:0};storeTimer();updateTimerUI()}
async function importGalleryLink(){const url=$('#import-url').value.trim();if(!url){toast('Paste a board link first.');return}try{const b=await parseBoardLink(url);addToGallery(b);$('#import-url').value=''}catch(e){toast(e.message||'Unable to open that board link.')}}
async function importGalleryFile(file){if(!file)return;if(file.size>300000){toast('This board file is too large.');return}try{const data=JSON.parse(await file.text());addToGallery(data.board||data)}catch(e){toast('Could not import that file. '+(e.message||''))}}
async function loadSharedLink(){
 const encoded=new URLSearchParams(location.search).get('board');if(!encoded)return false;
 try{presented=await decodeBoard(encoded);presentationSource='shared';presentationIndex=-1;renderPresentation();setView('present');toast('You are viewing a shared team board.');return true}catch(e){toast('This shared link could not be opened. '+(e.message||''));return false}
}
function bindEvents(){
 $$('[data-nav]').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.nav)));
 $('#mobile-menu').addEventListener('click',()=>{const menu=$('#mobile-links');const isHidden=menu.classList.toggle('hidden');$('#mobile-menu').setAttribute('aria-expanded',String(!isHidden))});
 $('#setup-form').addEventListener('submit',beginMission);$('#note-form').addEventListener('submit',saveNote);$('#note-delete').addEventListener('click',deleteNote);
 $$('[data-close]').forEach(b=>b.addEventListener('click',()=>closeDialog('#'+b.dataset.close)));
 $$('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d)d.close()}));
 $('#conclusion-input').addEventListener('input',e=>{if(board){board.conclusion=e.target.value.slice(0,850);$('#conclusion-count').textContent=`${board.conclusion.length} / 850`;saveBoard()}});
 $('#open-resources').addEventListener('click',()=>showResources(board?.theme));$('#all-research').addEventListener('click',()=>showResources(board?.theme));
 $('#add-new').addEventListener('click',()=>openNote());$('#new-mission').addEventListener('click',()=>{setView('home');$('#missions').scrollIntoView({behavior:'smooth'})});
 $('#preview-board').addEventListener('click',presentLocal);$('#finish-board').addEventListener('click',presentLocal);
 $('#open-share').addEventListener('click',openShare);$('#copy-share').addEventListener('click',()=>copyText($('#share-link').value));
 $('#download-from-share').addEventListener('click',()=>downloadBoard(board));$('#export-json').addEventListener('click',()=>downloadBoard(board));
 $('#share-print').addEventListener('click',()=>{closeDialog('#share-dialog');presentLocal();window.print()});
 $('#timer-toggle').addEventListener('click',toggleTimer);$('#timer-reset').addEventListener('click',resetTimer);
 $('#import-link').addEventListener('click',importGalleryLink);$('#import-url').addEventListener('keydown',e=>{if(e.key==='Enter')importGalleryLink()});
 $('#gallery-refresh').addEventListener('click',renderGallery);$('#add-local-board').addEventListener('click',()=>board?addToGallery(board):toast('No board is saved on this device.'));
 $('#import-file').addEventListener('change',e=>{importGalleryFile(e.target.files?.[0]);e.target.value=''});
 $('#present-back').addEventListener('click',backFromPresentation);$('#present-gallery-add').addEventListener('click',()=>{if(presented)addToGallery(presented)});
 $('#present-fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await $('#presentation-sheet').requestFullscreen()}catch{toast('Fullscreen is not supported here.')}});
 $('#present-print').addEventListener('click',()=>window.print());$('#previous-board').addEventListener('click',()=>stepPresentation(-1));$('#next-board').addEventListener('click',()=>stepPresentation(1));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.fullscreenElement)document.exitFullscreen();if(!$('#view-present').classList.contains('hidden')&&!e.target.closest('input,textarea')){if(e.key==='ArrowRight')stepPresentation(1);if(e.key==='ArrowLeft')stepPresentation(-1)}});
}
async function init(){
 try{const b=readStorage(STORAGE_BOARD,null);if(b)board=cleanBoard(b)}catch{}
 try{const a=readStorage(STORAGE_GALLERY,[]);gallery=Array.isArray(a)?a.slice(0,100).filter(boardShape).map(cleanBoard):[]}catch{}
 loadTimer();renderMissions();bindEvents();renderGallery();updateTimerUI();setInterval(tickTimer,500);
 if(board)$('#save-status').textContent='Board saved on this device';
 if(await loadSharedLink())return;
 const initial=(location.hash||'').replace('#','');setView(['workspace','teacher'].includes(initial)?initial:'home');
}
init();
