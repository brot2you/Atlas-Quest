'use strict';
/* ATLAS QUEST — browser-only, offline-capable after download. */
const STORAGE='ATLAS_QUEST_V2';
const LEGACY_STORAGE='ATLAS_QUEST_ENGLAND_V1';
const get=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let activeId='england';
let active=window.ATLAS_COUNTRIES.england;
let CHAPTERS=active.chapters,CARDS=active.cards,REWARD_CARD=active.rewardCards,SOURCES=active.sources,SCENE_SPOTS=active.sceneSpots;
let chapters=Object.fromEntries(CHAPTERS.map(c=>[c.id,c]));
let gameLabels,gameIcons,quizData,shopRounds,timelineItems,scrambleWords,memoryPairs,timelineOrder,postcardSpec;
// Country content stays independent of the explorer account and save structure.
function freshCountryProgress(){return {miles:0,seen:[],wins:[],cards:[],stamps:[],postcard:'',lastChapter:'airport',conversations:[]}}
function fresh(){return {schema:'atlas-quest',version:2,avatar:0,bag:'notebook',started:false,fr:false,activeCountry:'england',countries:{england:freshCountryProgress()}}}
function cleanCountryProgress(raw,content){
 const d=freshCountryProgress(); const x={...d,...(raw||{})};
 const validChapters=content.chapters;
 const knownDiscs=new Set(validChapters.flatMap(c=>c.discoveries.map(item=>item.id)));
 const knownGames=new Set(validChapters.flatMap(c=>c.games));
 const knownChapters=new Set(validChapters.map(c=>c.id));
 const cleanArray=(items,allowed)=>Array.isArray(items)?[...new Set(items.filter(id=>typeof id==='string'&&allowed.has(id)))]:[];
 x.conversations=cleanArray(x.conversations,new Set(Object.keys(window.ATLAS_COMICS?.[content.id]||{})));
 x.seen=cleanArray(x.seen,knownDiscs);x.wins=cleanArray(x.wins,knownGames);x.stamps=cleanArray(x.stamps,knownChapters);
 x.cards=Array.isArray(x.cards)?[...new Set(x.cards.filter(n=>Number.isInteger(n)&&n>=0&&n<content.cards.length))]:[];
 x.miles=Math.max(0,Math.min(1000000,Number(x.miles)||0));
 x.postcard=String(x.postcard||'').slice(0,700);
 x.lastChapter=knownChapters.has(x.lastChapter)?x.lastChapter:validChapters[0]?.id||'';
 return x;
}
function normalize(obj){
 if(!obj||typeof obj!=='object'||Array.isArray(obj))throw Error('Invalid save file');
 if(obj.version!==1&&obj.version!==2)throw Error('Unknown save version');
 const x=fresh();
 x.avatar=Number.isInteger(obj.avatar)&&obj.avatar>=0&&obj.avatar<4?obj.avatar:0;
 x.bag=['notebook','camera','phrasebook'].includes(obj.bag)?obj.bag:'notebook';
 x.fr=!!obj.fr; x.started=!!obj.started;
 if(obj.version===1){x.countries.england=cleanCountryProgress(obj,window.ATLAS_COUNTRIES.england);return x}
 if(obj.schema!=='atlas-quest'||!obj.countries||typeof obj.countries!=='object')throw Error('Invalid Atlas Quest save');
 for(const d of DESTINATIONS){const content=window.ATLAS_COUNTRIES[d.id];
  if(content&&d.status==='playable') x.countries[d.id]=cleanCountryProgress(obj.countries[d.id],content);
  else if(obj.countries[d.id]&&typeof obj.countries[d.id]==='object'&&!Array.isArray(obj.countries[d.id]))x.countries[d.id]=obj.countries[d.id];
 }
 x.activeCountry=window.ATLAS_COUNTRIES[obj.activeCountry]&&DESTINATIONS.some(d=>d.id===obj.activeCountry&&d.status==='playable')?obj.activeCountry:'england';
 return x;
}
let saveData;
try{const stored=localStorage.getItem(STORAGE); const legacy=!stored?localStorage.getItem(LEGACY_STORAGE):null;saveData=normalize(JSON.parse(stored||legacy||'null')||fresh())}catch(err){saveData=fresh()}
let progress;
function switchCountryData(id){
 const descriptor=DESTINATIONS.find(d=>d.id===id);const pack=window.ATLAS_COUNTRIES[id];
 if(!descriptor||descriptor.status!=='playable'||!pack)return false;
 activeId=id;active=pack; CHAPTERS=pack.chapters;CARDS=pack.cards;REWARD_CARD=pack.rewardCards;SOURCES=pack.sources;SCENE_SPOTS=pack.sceneSpots;
 chapters=Object.fromEntries(CHAPTERS.map(c=>[c.id,c]));
 ({gameLabels,gameIcons,quizData,shopRounds,timelineItems,scrambleWords,memoryPairs,timelineOrder}=pack);postcardSpec=pack.postcard;
 if(!saveData.countries[id])saveData.countries[id]=cleanCountryProgress({},pack);
 progress=saveData.countries[id];saveData.activeCountry=id;return true;
}
switchCountryData(saveData.activeCountry);
// Migration is local and automatic. Keep the original V1 key untouched as a fallback.
try{localStorage.setItem(STORAGE,JSON.stringify(saveData))}catch(err){}
function allStats(){let miles=0,cards=0,stamps=0,totalCards=0,totalStamps=0;for(const d of DESTINATIONS){if(d.status!=='playable'||!window.ATLAS_COUNTRIES[d.id])continue;const p=saveData.countries[d.id]||freshCountryProgress(); const pack=window.ATLAS_COUNTRIES[d.id];miles+=p.miles;cards+=p.cards.length;stamps+=p.stamps.length;totalCards+=pack.cards.length;totalStamps+=pack.chapters.length}return {miles,cards,stamps,totalCards,totalStamps}}
let comicState=null;
let view='home', openChapter='airport', selectedDisc=null,game=null, feedback=null, shuffleSerial=0;
function persist(){try{localStorage.setItem(STORAGE,JSON.stringify(saveData))}catch(err){notify('Storage is full or unavailable. Use Export Save to keep your progress.',true)}}
function grant(key,amount){if(key.startsWith('disc:')){const id=key.slice(5);if(progress.seen.includes(id))return false;progress.seen.push(id)}
 else if(key.startsWith('game:')){const id=key.slice(5);if(progress.wins.includes(id))return false;progress.wins.push(id)}
 else if(key.startsWith('stamp:')){const id=key.slice(6);if(progress.stamps.includes(id))return false;progress.stamps.push(id)}
 progress.miles+=amount;persist();return true}
function earnCard(i){if(!Number.isInteger(i)||progress.cards.includes(i))return;progress.cards.push(i);persist();notify('New card unlocked: '+CARDS[i][0]+'!',false)}
function notify(msg,error=false){let toast=get('toast');if(!toast)return;toast.textContent=msg;toast.className='toast shown '+(error?'bad':'');clearTimeout(notify.t);notify.t=setTimeout(()=>{if(get('toast'))get('toast').className='toast'},3700)}
function chapterSeen(c){return c.discoveries.filter(d=>progress.seen.includes(d.id)).length}
function chapterReady(c){return chapterSeen(c)===c.discoveries.length}
function chapterDone(c){return c.games.every(g=>progress.wins.includes(g))}
function unlock(c){if(c.id===CHAPTERS[0].id)return true;const i=CHAPTERS.indexOf(c);return chapterDone(CHAPTERS[i-1])}
function home(){comicState=null;view='home';game=null;selectedDisc=null;render()}
function go(v){comicState=null;view=v;game=null;selectedDisc=null;render();window.scrollTo({top:0,behavior:'instant'})}
function chapter(id){const c=chapters[id];if(!c)return;if(!unlock(c)){notify('Finish the previous destination first.',true);return}openChapter=id;progress.lastChapter=id;persist();go('chapter')}
function header(){const t=allStats();return `<header class="topbar"><button data-action="home" class="brand" aria-label="Atlas Quest home"><span class="brand-emblem">✦</span> ATLAS <strong>QUEST</strong></button><div class="statbar"><span class="stat">✈ <strong>${t.miles}</strong> <small>miles</small></span><span class="stat">🃏 <strong>${t.cards}/${t.totalCards}</strong></span><span class="stat">▣ <strong>${t.stamps}/${t.totalStamps}</strong></span></div><button class="pill tiny" data-action="toggle-fr" aria-pressed="${saveData.fr}">${saveData.fr?'FR ✓':'FR ?'}</button></header>`}
function nav(){return `<nav class="dock" aria-label="Main navigation"><button data-action="world">🧭 <span>WORLD</span></button><button data-action="england">🗺 <span>${esc(activeId==='england'?'ENGLAND':'COUNTRY')}</span></button>${active.maps.city?`<button data-action="london-map">🏙 <span>${esc(active.maps.city.navName)}</span></button>`:''}<button data-action="passport-view">📘 <span>PASSPORT</span></button><button data-action="album">🃏 <span>CARDS</span></button><button data-action="bag-view">🎒 <span>BAG</span></button><button data-action="help">⚙ <span>OPTIONS</span></button></nav>`}
function scene(name){return `style="background-image:linear-gradient(180deg,rgba(14,30,53,.05),rgba(9,22,42,.46)),url('${active.assetRoot}scenes/${name}.png')"`}
function homeView(){return `<section class="hero" ${scene('airport')}><div class="hero-inner"><div class="eyebrow">THE WORLD IS WAITING</div><h1>ATLAS <span>QUEST</span></h1><p class="hero-sub">EXPLORE • DISCOVER • SPEAK ENGLISH</p><p class="hero-text">Your passport to the English-speaking world. Discover places, meet people and collect memories!</p><div class="hero-actions"><button class="btn primary big" data-action="${saveData.started?'world':'create'}">${saveData.started?'✈ CONTINUE ADVENTURE':'✈ START YOUR JOURNEY'} →</button><button class="btn glass" data-action="album">🃏 MY CARD COLLECTION</button></div></div><div class="hero-avatars">${[0,1,2,3].map(i=>`<img alt="Explorer ${i+1}" src="assets/avatars/avatar${i+1}.png"/>`).join('')}</div></section><section class="home-teasers"><article><span>🗺</span><h3>Explore real places</h3><p>Walk through London, travel beyond the capital and learn real history.</p></article><article><span>🎮</span><h3>Play to remember</h3><p>Shopping, conversations, hidden clues, memory challenges and more.</p></article><article><span>🃏</span><h3>Grow your collection</h3><p>Unlock cards, stamp your passport and earn miles once per success.</p></article></section>`}
function creationView(){return `<div class="panel intro"><div class="eyebrow">BEFORE DEPARTURE · STEP 1 OF 2</div><h2>Choose your explorer</h2><p>Your adventure is yours. Pick the character you want to play.</p><div class="avatar-grid">${['Alex','Noor','Robin','Jamie'].map((n,i)=>`<button class="avatar-option ${saveData.avatar===i?'selected':''}" data-action="avatar" data-i="${i}" aria-pressed="${saveData.avatar===i}"><img src="assets/avatars/avatar${i+1}.png" alt=""/><strong>${n}</strong></button>`).join('')}</div><div class="eyebrow" style="margin-top:24px">STEP 2 OF 2</div><h2>Pack your bag</h2><p>Choose one travel companion item. You can switch it later.</p><div class="bag-grid">${[['notebook','📓','Travel notebook'],['camera','📷','Pocket camera'],['phrasebook','📖','Mini phrasebook']].map(([k,i,n])=>`<button class="bag-pick ${saveData.bag===k?'selected':''}" data-action="pack" data-item="${k}"><span>${i}</span><strong>${n}</strong></button>`).join('')}</div><button class="btn primary big" data-action="depart">✈ BOARD THE PLANE →</button></div>`}
function pillFlag(){const d=DESTINATIONS.find(x=>x.id===activeId);return d.flag?`<img src="${esc(d.flag)}" alt="Verified flag of ${esc(d.name)}" class="flag"/>`:''}
function worldView(){
 const d=DESTINATIONS.find(x=>x.id==='england');const countryProgress=saveData.countries.england||freshCountryProgress();
 const soon=DESTINATIONS.filter(x=>x.status==='planned');
 return `<section class="page-head"><span class="eyebrow">WORLD EXPLORER · DEPARTURES</span><h2>Choose your next journey</h2><p>One world, many voices. Explore a place in depth; each new destination will have its own story, local culture, language and rewards.</p></section><div class="world-grid"><button class="destination-card featured" data-action="select-destination" data-country="england"><img src="assets/scenes/england_map.png" alt="Illustrated adventure map of England"/><span class="destination-desc"><img class="flag" src="${d.flag}" alt="Flag of England: red cross on white"/><span><strong>ENGLAND</strong><small>${window.ATLAS_COUNTRIES.england.chapters.length} chapters · 12 games · ${window.ATLAS_COUNTRIES.england.cards.length} cards</small></span></span><span class="destination-cta">${countryProgress.stamps.length?'CONTINUE YOUR JOURNEY':'EXPLORE NOW'} →</span></button><div class="world-welcome"><span class="eyebrow">EXPLORE THE WORLD</span><h3>YOUR WORLD PASSPORT</h3><p>Keep the same avatar, travel bag and passport everywhere. Every country gets its own chapters, collection and stamps.</p><strong>✈ ${allStats().miles} miles earned</strong><p class="minor">Other journeys are planned, not yet playable.</p></div></div><h3 class="world-section-title">NEXT DESTINATIONS · IN PREPARATION</h3><div class="journey-grid">${soon.map(x=>`<article class="journey-preview" aria-label="${esc(x.name)} — future journey"><div class="journey-icon" aria-hidden="true">✧</div><div><small>${esc(x.region)}</small><h3>${esc(x.name)}</h3><p>${esc(x.description)}</p><span class="badge muted">COMING LATER</span></div></article>`).join('')}</div><p class="journey-footnote">Geography matters: England, Scotland, Wales and Northern Ireland are constituent countries of the UK. Ireland is a separate sovereign state. The English-speaking world is multilingual; each journey will show local realities without stereotypes.</p>`
}
function mapPin(ch,x,y,label,mode='chapter'){
 const c=chapters[ch];if(!c)return '';const ready=unlock(c); const finished=chapterDone(c);
 return `<button class="map-pin ${!ready?'locked':''} ${finished?'complete':''}" style="left:${x}%;top:${y}%" data-action="${mode}" data-ch="${ch}" aria-label="${esc(label)}${!ready?' locked':''}" ${!ready?'disabled':''}><span class="pin-orb">${finished?'✓':ready?'✦':'🔒'}</span><span class="pin-label">${esc(label)}</span></button>`}
function renderCountryMap(kind){const m=active.maps[kind];if(!m)return worldView();const city=kind==='city';const d=DESTINATIONS.find(x=>x.id===activeId);return `<section class="page-head compact"><span class="eyebrow">WORLD / ${esc(d.name.toUpperCase())}${city?' / '+esc(m.name.toUpperCase()):''}</span><h2>${!city?pillFlag():''} ${esc(m.name)}</h2><p>${esc(m.description)}</p></section><div class="map-frame"><div class="map-art" ${scene(m.scene)}>${m.pins.map(([ch,x,y,label])=>mapPin(ch,x,y,label)).join('')}</div><div class="map-footer"><div><strong>${esc(d.name.toUpperCase())}</strong><br><small>${esc(m.info)}</small></div><button class="btn secondary" data-action="${city?'england':active.maps.city?'london-map':'world'}">${city?'← COUNTRY MAP':active.maps.city?'🏙 EXPLORE '+esc(active.maps.city.navName)+' →':'← WORLD MAP'}</button></div></div><div class="region-guide">${esc(m.note)}</div>`}
function englandView(){return renderCountryMap('country')}
function londonView(){return renderCountryMap('city')}
function cardImg(i){return `${active.assetRoot}cards/card${String(i).padStart(2,'0')}.png`}
function discoveryButton(d){return `<button class="clue ${progress.seen.includes(d.id)?'seen':''}" data-action="discover" data-disc="${d.id}"><span class="clue-glyph">${progress.seen.includes(d.id)?'✓':'?'}</span><span><strong>${esc(d.title)}</strong><small>${progress.seen.includes(d.id)?'Discovered · Read again':'Tap to discover · +15 miles'}</small></span><span class="arrow">›</span></button>`}
function discoveryPanel(c){const d=c.discoveries.find(x=>x.id===selectedDisc);if(!d)return `<div class="narration"><span class="guide-avatar">${c.id==='globe'?'🎭':'🧭'}</span><div><small class="guide-name">${esc(c.friend)}</small><p>${esc(c.intro)}</p>${saveData.fr?`<p class="translation">🇫🇷 ${esc(c.introFr)}</p>`:''}</div></div>`;
 return `<div class="discovery-detail">${d.card!==undefined?`<img src="${cardImg(d.card)}" alt="Pixel art illustration of ${esc(d.title)}" class="detail-card"/>`:''}<div><span class="eyebrow">CULTURAL DISCOVERY · ${esc(d.word[0]).toUpperCase()}</span><h3>${esc(d.title)}</h3><p>${esc(d.text)}</p><div class="wordchip">📖 <strong>${esc(d.word[0])}</strong> — ${esc(d.word[1])}</div>${saveData.fr?`<p class="translation">🇫🇷 ${esc(d.fr)}</p>`:''}${d.card!==undefined&&progress.cards.includes(d.card)?`<span class="badge gold">🃏 CARD ADDED TO ALBUM</span>`:''}</div></div>`}
function comicEncounter(){return window.ATLAS_COMICS?.[activeId]?.[openChapter]||null}
function startComic(){const c=comicEncounter();if(!c)return;comicState={step:0,answered:false,choice:null};render();}
function comicChoice(i){const c=comicEncounter();if(!comicState||!c||comicState.step<c.panels.length)return;comicState.choice=i;comicState.answered=true;
 if(!progress.conversations)progress.conversations=[];
 if(!progress.conversations.includes(openChapter)){progress.conversations.push(openChapter);progress.miles=Math.min(1000000,progress.miles+10);persist();}
 render();}
function comicOverlay(){if(!comicState)return '';const c=comicEncounter();if(!c)return '';const count=c.panels.length,step=comicState.step,p=c.panels[Math.min(step,count-1)];const final=step>=count;
 return `<div class="comic-shade"><section class="comic-book" role="dialog" aria-modal="true" aria-label="Pixel art interactive comic dialogue"><header class="comic-top"><span>▣ PIXEL COMIC · ${esc(chapters[openChapter]?.name||'TRAVEL STORY')}</span><button class="comic-close" data-action="comic-close" aria-label="Close conversation">✕</button></header><div class="comic-panels">${c.panels.slice(0,Math.min(step+1,count)).map((panel,i)=>`<article class="comic-panel ${i===Math.min(step,count-1)?'comic-current':''}"><div class="comic-visual" style="background-image:linear-gradient(0deg,#101b31aa,#101b3111),url('${active.assetRoot}scenes/${esc(chapters[openChapter].scene)}.png')"><img alt="Pixel art portrait" src="assets/avatars/avatar${(panel.speaker==='Explorer'?saveData.avatar:c.portrait)+1}.png"></div><div class="comic-balloon"><strong>${esc(panel.speaker)}</strong><p>${esc(panel.line)}</p>${saveData.fr?`<small>${esc(panel.fr)}</small>`:''}</div></article>`).join('')}</div>${!final?`<div class="comic-bottom"><span>SCENE ${step+1} / ${count}</span><button class="comic-btn" data-action="comic-next">NEXT PANEL ▶</button></div>`:!comicState.answered?`<div class="comic-choices"><h3>What would you say?</h3>${c.choices.map(([choice],i)=>`<button class="comic-option" data-action="comic-choice" data-i="${i}">${esc(choice)}</button>`).join('')}</div>`:`<div class="comic-ending"><p><strong>${c.choices[comicState.choice][2]?'GREAT QUESTION!':'GOOD TO KNOW!'}</strong> ${esc(c.choices[comicState.choice][1])}</p><p>${esc(c.cue)}</p><div class="comic-bottom"><span>+10 MILES ON FIRST CONVERSATION</span><button class="comic-btn" data-action="comic-close">BACK TO EXPLORE ▶</button></div></div>`}</section></div>`;
}
function chapterView(){const c=chapters[openChapter];if(!c)return worldView(); const n=chapterSeen(c); const completed=chapterDone(c);
 return `<section class="chapter-banner" ${scene(c.scene)}><div class="chapter-banner-text"><div class="eyebrow">${esc(DESTINATIONS.find(x=>x.id===activeId)?.name.toUpperCase()||activeId)} / CHAPTER ${c.number} OF ${CHAPTERS.length}</div><h2>${esc(c.name)}</h2><p>${esc(c.place)}</p><div class="chapter-status"><span>🔎 ${n}/${c.discoveries.length} discoveries</span><span>🎮 ${c.games.filter(id=>progress.wins.includes(id)).length}/${c.games.length} missions</span>${completed?'<span>✓ STAMP EARNED</span>':''}</div></div><img class="guide-profile" src="assets/avatars/avatar${(c.number%4)+1}.png" alt=""/></section><section class="comic-entry" aria-label="Character encounter"><img src="assets/avatars/avatar${(comicEncounter()?.portrait??0)+1}.png" alt="Pixel art character"><div><span class="eyebrow">STORY ENCOUNTER · PIXEL COMIC</span><h3>Meet ${esc(comicEncounter()?.speaker||'your guide')}</h3><p>${esc(comicEncounter()?.role||'Local companion')} · ${progress.conversations?.includes(c.id)?'Conversation discovered · Replay anytime':'Discover a story in English'}</p></div><button class="btn primary" data-action="comic-open">💬 TALK</button></section><section class="scene-explore"><div class="scene-explore-head"><strong>✦ INTERACTIVE EXPLORATION</strong><span>Tap the glowing objects to uncover cultural clues.</span></div><div class="explore-art" ${scene(c.scene)}>${c.discoveries.map((d,i)=>`<button class="scene-spot ${progress.seen.includes(d.id)?'found':''}" style="left:${(SCENE_SPOTS?.[c.id]?.[i]?.[0]??50)}%;top:${(SCENE_SPOTS?.[c.id]?.[i]?.[1]??50)}%" data-action="discover" data-disc="${d.id}" aria-label="Explore: ${esc(d.title)}" title="${esc(d.title)}">${progress.seen.includes(d.id)?'✓':'✦'}</button>`).join('')}</div></section><div class="chapter-layout"><section class="panel"><div class="section-title"><h3>Explore & discover</h3><span class="badge">TAP EACH CLUE</span></div><div class="clue-list">${c.discoveries.map(discoveryButton).join('')}</div>${discoveryPanel(c)}</section><section class="panel missions"><div class="section-title"><h3>Adventure challenges</h3><span class="badge ${chapterReady(c)?'green':''}">${chapterReady(c)?'READY':'EXPLORE FIRST'}</span></div><p>Learn about all discoveries first. The games reuse what you have found.</p>${c.games.map(id=>`<button class="mission ${progress.wins.includes(id)?'won':''}" data-action="game" data-game="${id}" ${!chapterReady(c)?'disabled':''}><span class="mission-symbol">${gameIcons[id]}</span><span><strong>${gameLabels[id]}</strong><small>${progress.wins.includes(id)?'Completed · Replay anytime':'Play after exploring · +60 miles'}</small></span><span>${progress.wins.includes(id)?'✓':'→'}</span></button>`).join('')}${completed?`<div class="completed-box"><strong>🎉 Chapter complete!</strong><p>A passport stamp and a special card are yours.</p><button class="btn primary" data-action="${c.next?'next-chapter':'passport-view'}" data-next="${c.next||''}">${c.next?'NEXT STOP →':'SEE MY PASSPORT →'}</button></div>`:''}${game?gameView(c):''}</section></div>`}
function gameView(c){const id=game.id;if(!c.games.includes(id))return '';
 let body='';
 if(quizData[id]){
  const q=quizData[id][game.step]; if(!q)return '';
  body=`<p class="question-tag">QUESTION ${game.step+1} OF ${quizData[id].length}</p><h4>${esc(q[0])}</h4><div class="answer-grid">${q[1].map((v,i)=>`<button class="answer" data-action="quiz-answer" data-i="${i}">${esc(v)}</button>`).join('')}</div>`;
 }else if(id==='shop'){
  const r=shopRounds[game.step];body=`<p class="question-tag">CUSTOMER ${game.step+1} OF 3</p><h4>${r.item}</h4><div class="shop-visual"><span>🛍 PRICE <b>${money(r.price)}</b></span><span>💷 YOU PAY <b>${money(r.given)}</b></span></div><p>How much change should the shopkeeper give back?</p><div class="answer-grid">${r.choices.map((v,i)=>`<button class="answer" data-action="shop-answer" data-i="${i}">${money(v)}</button>`).join('')}</div>`;
 }else if(id==='timeline'){
  const chosen=game.picked||[];
  body=`<p class="question-tag">TIME TRAVELLER · TAP OLDEST TO MOST RECENT</p><h4>Put the discoveries in chronological order.</h4><div class="timeline-answer">${chosen.map((x,i)=>`<div class="timeline-step">${i+1}. ${esc(timelineItems.find(t=>t.id===x).date)}</div>`).join('')}</div><div class="answer-grid">${timelineItems.filter(x=>!chosen.includes(x.id)).map(x=>`<button class="answer" data-action="timeline-answer" data-item="${x.id}"><b>${esc(x.date)}</b><small>${esc(x.label)}</small></button>`).join('')}</div><button class="btn outline" data-action="timeline-reset">↶ START AGAIN</button>`;
 }else if(id==='memory'){
  body=`<p class="question-tag">MATCH THE PAIRS · ${game.matched.length/2}/${memoryPairs.length} PAIRS</p><h4>Match each London clue with its answer.</h4><div class="memory-grid">${game.tiles.map((tile,i)=>`<button class="memory-tile ${game.matched.includes(i)?'matched':''}" data-action="memory-flip" data-i="${i}" ${game.matched.includes(i)||game.busy?'disabled':''}>${game.open.includes(i)||game.matched.includes(i)?esc(tile.label):'✦'}</button>`).join('')}</div>`;
 }else if(id==='scramble'){
  const spec=scrambleWords[game.step];const picked=game.letters||[];
  body=`<p class="question-tag">WORD ${game.step+1} OF ${scrambleWords.length}</p><h4>${esc(spec.prompt)}</h4><div class="spell">${picked.map(n=>esc(game.letterTiles[n].value)).join('')||'_ _ _ _ _'}</div><p>Tap letters in order to build the English word.</p><div class="letter-row">${game.letterTiles.map((a,i)=>`<button class="letter" data-action="letter" data-i="${i}" ${picked.includes(i)?'disabled':''}>${esc(a.value)}</button>`).join('')}</div><button class="btn outline" data-action="letter-reset">↶ CLEAR</button>`;
 }else if(id==='postcard'){
  body=`<p class="question-tag">FINAL CHALLENGE · MY POSTCARD</p><h4>Send a postcard from your trip</h4><p>Choose facts you discovered, then write an optional extra sentence.</p><label class="input-label">I visited <select id="postal-place">${postcardSpec.choices.map(([place])=>`<option value="${esc(place)}">${esc(place)}</option>`).join('')}</select></label><label class="input-label">I saw <select id="postal-saw">${postcardSpec.choices.map(([,saw])=>`<option value="${esc(saw)}">${esc(saw)}</option>`).join('')}</select></label><label class="input-label">It was <select id="postal-feeling"><option value="wonderful">wonderful</option><option value="interesting">interesting</option><option value="exciting">exciting</option></select></label><label class="input-label">My own sentence (optional)<textarea id="postal-note" maxlength="180" placeholder="My favourite place was ..."></textarea></label><button class="btn primary" data-action="send-postcard">✉ SEND POSTCARD</button>`;
 }
 return `<div id="game-box" class="game-box"><div class="game-title"><h3>${gameIcons[id]} ${esc(gameLabels[id])}</h3><button class="xbtn" aria-label="Close game" data-action="close-game">✕</button></div>${body}${feedback?`<div role="status" class="feedback ${feedback.ok?'success':'fail'}"><strong>${feedback.ok?'✓ Correct!':'Try again!'}</strong> ${esc(feedback.msg)} ${!feedback.ok?`<p class="translation">${esc(feedback.fr||'Read the discovery again. You can retry.')}</p>`:''}</div>`:''}</div>`}
function money(p){const c=active.currency||{code:'GBP',symbol:'£',minorPerMajor:100,minorLabel:'p'};const per=Math.max(1,Number(c.minorPerMajor)||100);const places=per===1?0:String(per-1).length;return p>=per?`${c.symbol}${(p/per).toFixed(places)}`:`${p}${c.minorLabel||''}`}
function gameStart(id){const c=chapters[openChapter];if(!c.games.includes(id)||!chapterReady(c))return;
 feedback=null;game={id,step:0};
 if(id==='timeline')game.picked=[];
 if(id==='memory'){const labels=memoryPairs.flatMap(([a,b],pair)=>[[a,pair],[b,pair]]);game.tiles=labels.map(([label,pair])=>({label,pair})).sort(()=>Math.random()-.5);game.open=[];game.matched=[];game.busy=false}
 if(id==='scramble')setLetters();
 render();setTimeout(()=>get('game-box')?.scrollIntoView({behavior:'smooth',block:'start'}),10)
}
function setLetters(){const word=scrambleWords[game.step].word;game.letters=[];game.letterTiles=word.split('').map((v,i)=>({value:v,i})).sort(()=>Math.random()-.5)}
function quizAnswer(ix){const q=quizData[game.id]?.[game.step];if(!q)return;if(ix===q[2])correct(q[3],quizData[game.id].length);else incorrect(q[3]);}
function correct(msg,total){feedback={ok:true,msg};game.step++;if(game.step>=total){finishGame();return}render();}
function incorrect(hint){feedback={ok:false,msg:hint,fr:'Use the facts from your travel discoveries and try another answer.'};render()}
function finishGame(){const id=game.id;const c=chapters[openChapter];const freshWin=grant('game:'+id,60);game=null;feedback=null;
 if(chapterDone(c)){const freshStamp=grant('stamp:'+c.id,100);if(freshStamp)earnCard(REWARD_CARD[c.id]);if(c.id==='beyond'&&freshStamp)notify('🎉 England adventure completed! Open your passport.');else if(freshStamp)notify('Chapter complete! +100 miles and a special card.');}
 else notify(freshWin?'Mission completed! +60 miles.':'Mission replayed. Your reward was already collected.');render();}
function reveal(did){const c=chapters[openChapter],d=c.discoveries.find(d=>d.id===did);if(!d)return;selectedDisc=did;const earned=grant('disc:'+did,15);if(earned&&d.card!==undefined)earnCard(d.card);render()}
function shopAnswer(i){const r=shopRounds[game.step];if(!r)return;const chosen=r.choices[i];if(chosen===r.given-r.price)correct(`${money(r.given)} minus ${money(r.price)} = ${money(chosen)}.`,shopRounds.length);else incorrect(`You paid ${money(r.given)} for an item costing ${money(r.price)}. Subtract to find the change.`)}
function timelineAnswer(id){const sequence=timelineOrder;if(sequence[(game.picked||[]).length]!==id){incorrect('Look at the dates: AD 43 came long before the late 1700s. Today comes last.');return}game.picked.push(id);feedback={ok:true,msg:'Good: that event is in the right place.'};if(game.picked.length===timelineOrder.length){finishGame();return}render()}
function memoryFlip(i){if(game.busy||game.matched.includes(i)||game.open.includes(i))return;game.open.push(i);feedback=null;
 if(game.open.length===2){const [a,b]=game.open;if(game.tiles[a].pair===game.tiles[b].pair){game.matched.push(a,b);game.open=[];if(game.matched.length===game.tiles.length){finishGame();return}}
 else{game.busy=true;const serial=++shuffleSerial;setTimeout(()=>{if(game&&game.id==='memory'&&serial===shuffleSerial){game.open=[];game.busy=false;feedback={ok:false,msg:'These two cards do not match. Look for a landmark and its correct clue.'};render()}},850)}}render()}
function letterPick(i){if(game.letters.includes(i))return;game.letters.push(i);const built=game.letters.map(n=>game.letterTiles[n].value).join('');const expected=scrambleWords[game.step].word;
 if(!expected.startsWith(built)){game.letters=[];incorrect('Think of the spelling of '+expected.toLowerCase()+'. Try the first letter again.');return}
 if(built===expected){game.step++;if(game.step===scrambleWords.length){finishGame();return}setLetters();feedback={ok:true,msg:'You spelt it correctly! Next word.'};render();return}feedback=null;render()}
function sendPostcard(){const place=get('postal-place')?.value,saw=get('postal-saw')?.value,feeling=get('postal-feeling')?.value,personal=(get('postal-note')?.value||'').trim();
 const valid=Object.fromEntries(postcardSpec.choices);
 if(!valid[place]||valid[place]!==saw){incorrect('Look at the places you explored. Match each destination with something you can find there.');return}
 progress.postcard=`${postcardSpec.greeting}\nI visited ${place}. I saw ${saw}. It was ${feeling}.\n${personal.slice(0,180)}\n${postcardSpec.signoff}`;persist();finishGame()}
function albumView(){const commons=CARDS.filter(c=>c[1]==='common').length;
 return `<section class="page-head"><span class="eyebrow">YOUR TREASURE COLLECTION</span><h2>${esc(DESTINATIONS.find(x=>x.id===activeId)?.name)} Travel Cards</h2><p>Each card has its own pixel illustration and cultural fact. Common cards appear after exploring; special and gold cards reward completed chapters.</p><div class="rarity-row"><span class="badge">COMMON · ${commons}</span><span class="badge silver">SPECIAL · ${CARDS.filter(c=>c[1]==='special').length}</span><span class="badge gold">GOLD · ${CARDS.filter(c=>c[1]==='gold').length}</span></div></section><div class="card-grid">${CARDS.map((c,i)=>`<button class="collect-card ${c[1]} ${!progress.cards.includes(i)?'unknown':''}" data-action="card-detail" data-i="${i}" aria-label="${progress.cards.includes(i)?c[0]:'Locked card '+(i+1)}"><div class="card-art">${progress.cards.includes(i)?`<img loading="lazy" src="${cardImg(i)}" alt=""/>`:'<span>?</span>'}</div><div class="card-label"><small>${c[1].toUpperCase()}</small><strong>${progress.cards.includes(i)?esc(c[0]):'???'}</strong></div></button>`).join('')}</div>`}
function passportView(){return `<section class="page-head"><span class="eyebrow">WORLD EXPLORER</span><h2>My Passport</h2><p>Culture cards, miles and stamps celebrate discoveries. They do not measure CEFR proficiency.</p></section><div class="passport-layout"><div class="passport-cover"><div class="passport-inner"><span class="eyebrow">ATLAS QUEST</span><h2>TRAVEL<br>PASSPORT</h2><div class="passport-star">✦</div><p>WORLD EXPLORER EDITION</p><img src="assets/avatars/avatar${saveData.avatar+1}.png" alt="Your explorer"/></div></div><div class="panel"><h3>${esc(DESTINATIONS.find(x=>x.id===activeId)?.name)} travel stamps</h3><div class="stamp-grid">${CHAPTERS.map(c=>`<div class="stamp ${progress.stamps.includes(c.id)?'earned':''}"><span>${progress.stamps.includes(c.id)?'✦':'◇'}</span><strong>${esc(c.name)}</strong><small>${progress.stamps.includes(c.id)?'VISITED':'NOT YET STAMPED'}</small></div>`).join('')}</div><div class="pass-facts"><span>✈ ${allStats().miles} total miles</span><span>🃏 ${allStats().cards} total cards</span><span>✓ ${allStats().stamps} total stamps</span></div>${progress.postcard?`<div class="postcard-display"><h3>✉ My postcard</h3><pre>${esc(progress.postcard)}</pre></div>`:''}</div></div>`}
function bagView(){return `<section class="page-head"><span class="eyebrow">TRAVEL EQUIPMENT</span><h2>My Adventure Bag</h2><p>Everything you need to become a curious explorer.</p></section><div class="panel"><h3>Current item</h3><div class="bag-grid">${[['notebook','📓','Travel notebook'],['camera','📷','Pocket camera'],['phrasebook','📖','Mini phrasebook']].map(([key,icon,name])=>`<button class="bag-pick ${saveData.bag===key?'selected':''}" data-action="pack" data-item="${key}"><span>${icon}</span><strong>${name}</strong><small>${saveData.bag===key?'PACKED':'TAP TO PACK'}</small></button>`).join('')}</div><p class="minor">Your bag item is cosmetic in this edition: no hidden learning advantage. Every explorer can complete the same challenges.</p><div class="tipbox">📌 Tip: On a discovery page, tap <b>FR ?</b> if you need optional French help.</div></div>`}
function helpView(){return `<section class="page-head"><span class="eyebrow">SETTINGS & TEACHER NOTES</span><h2>Travel Options</h2><p>No account, no server, no subscription. Your save stays in this browser until you export or clear it.</p></section><div class="panel"><h3>Save your journey</h3><div class="utility-grid"><button class="btn secondary" data-action="export">⬇ EXPORT SAVE (.JSON)</button><button class="btn secondary" data-action="import">⬆ IMPORT SAVE (.JSON)</button><input type="file" id="save-import" accept=".json,application/json" hidden/><button class="btn danger" data-action="reset">↶ RESET PROGRESS</button><button class="btn secondary" data-action="toggle-fr">${saveData.fr?'✓ FRENCH HELP ON':'TURN ON FRENCH HELP'}</button></div><div class="tipbox"><b>Important:</b> On shared classroom devices, use Export Save and keep your file privately. Browser storage is device-specific and can be cleared.</div><h3>Learning focus</h3><p>Short interactions combine cultural discovery with contextual vocabulary, reading, simple dialogue, money, place descriptions and chronology. This is a practice game, <b>not</b> a CEFR assessment.</p><h3>Verified cultural sources for ${esc(DESTINATIONS.find(x=>x.id===activeId)?.name)}</h3><div class="sources">${SOURCES.map(s=>`<a href="${esc(s[1])}" target="_blank" rel="noopener noreferrer">${esc(s[0])} ↗</a>`).join('')}</div><p class="minor">The illustrated maps are stylised teaching maps (not survey-accurate). Real flags and factual names must remain correct. Visual assets are original pixel drawings created for this app.</p></div>`}
function detailView(i){const c=CARDS[i],got=progress.cards.includes(i);return `<div class="shade" data-action="close-modal"><div class="modal" role="dialog" aria-modal="true" aria-label="Travel card"><button class="xbtn modal-close" data-action="close-modal">✕</button><img src="${got?cardImg(i):'assets/cards/card00.png'}" alt="${got?esc(c[0]):'Hidden card'}"/><div><span class="badge ${c[1]==='gold'?'gold':c[1]==='special'?'silver':''}">${c[1].toUpperCase()}</span><h2>${got?esc(c[0]):'MYSTERY CARD'}</h2><p>${got?esc(c[2]):'Explore all locations and complete games to unlock more cards.'}</p><button class="btn primary" data-action="close-modal">CLOSE</button></div></div></div>`}
let modal=null;
function render(){get('app').innerHTML=`<div class="shell">${header()}<main id="main">${view==='home'?homeView():view==='create'?creationView():view==='world'?worldView():view==='england'?englandView():view==='london-map'?londonView():view==='chapter'?chapterView():view==='album'?albumView():view==='passport'?passportView():view==='bag'?bagView():helpView()}</main>${nav()}<footer>ATLAS QUEST · WORLD EXPLORER · OFFLINE-FRIENDLY · MADE FOR CURIOUS EXPLORERS</footer></div><div id="toast" class="toast" role="status" aria-live="polite"></div>${modal!==null?detailView(modal):''}${comicOverlay()}`;}
function download(data,name,type){const blob=new Blob([data],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500)}
async function importSave(file){if(!file||file.size>200000){notify('Please choose a small Atlas Quest JSON save.',true);return}try{const candidate=normalize(JSON.parse(await file.text()));if(!confirm('Replace your current progress with this saved journey?'))return;saveData=candidate;switchCountryData(saveData.activeCountry);persist();modal=null;home();notify('Your saved adventure was imported.')}catch(err){notify('This does not look like a valid Atlas Quest save.',true)}}
get('app').addEventListener('change',e=>{if(e.target.id==='save-import'){importSave(e.target.files?.[0]);e.target.value=''}});
get('app').addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(!b||b.disabled)return;
 const act=b.dataset.action;const i=Number(b.dataset.i);
 if(act==='comic-open')startComic();
 else if(act==='comic-next'&&comicState){comicState.step=Math.min(comicEncounter().panels.length,comicState.step+1);render()}
 else if(act==='comic-choice'&&comicState)comicChoice(i);
 else if(act==='comic-close'){comicState=null;render()}
 else if(act==='home')home();
 else if(act==='world')go('world');
 else if(act==='england')go('england');
 else if(act==='select-destination'){if(switchCountryData(b.dataset.country)){persist();go('england')}else notify('This destination is not available yet.',true)}
 else if(act==='london-map')go('london-map');
 else if(act==='london-entry'){if(!unlock(chapters.london)){notify('Finish the airport missions first.',true)}else go('london-map')}
 else if(act==='album')go('album');
 else if(act==='passport-view')go('passport');
 else if(act==='bag-view')go('bag');
 else if(act==='help')go('help');
 else if(act==='create')go('create');
 else if(act==='toggle-fr'){saveData.fr=!saveData.fr;persist();render()}
 else if(act==='avatar'){saveData.avatar=i;persist();render()}
 else if(act==='pack'){saveData.bag=b.dataset.item;persist();render()}
 else if(act==='depart'){saveData.started=true;persist();chapter('airport')}
 else if(act==='chapter'){chapter(b.dataset.ch)}
 else if(act==='next-chapter'){chapter(b.dataset.next)}
 else if(act==='discover')reveal(b.dataset.disc);
 else if(act==='game')gameStart(b.dataset.game);
 else if(act==='close-game'){game=null;feedback=null;render()}
 else if(act==='quiz-answer'&&game)quizAnswer(i);
 else if(act==='shop-answer'&&game?.id==='shop')shopAnswer(i);
 else if(act==='timeline-answer'&&game?.id==='timeline')timelineAnswer(b.dataset.item);
 else if(act==='timeline-reset'&&game?.id==='timeline'){game.picked=[];feedback=null;render()}
 else if(act==='memory-flip'&&game?.id==='memory')memoryFlip(i);
 else if(act==='letter'&&game?.id==='scramble')letterPick(i);
 else if(act==='letter-reset'&&game?.id==='scramble'){game.letters=[];feedback=null;render()}
 else if(act==='send-postcard'&&game?.id==='postcard')sendPostcard();
 else if(act==='card-detail'){if(progress.cards.includes(i)){modal=i;render()}else notify('This card is not unlocked yet. Keep exploring!')}
 else if(act==='close-modal'){modal=null;render()}
 else if(act==='export')download(JSON.stringify(saveData,null,2),'atlas-quest-world-save.json','application/json');
 else if(act==='import')get('save-import')?.click();
 else if(act==='reset'){if(confirm('Delete all progress in this browser? Export a save first if you need it.')){saveData=fresh();switchCountryData('england');persist();modal=null;home()}}
});
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&comicState){comicState=null;render()}else if(e.key==='Escape'&&modal!==null){modal=null;render()}});
render();
