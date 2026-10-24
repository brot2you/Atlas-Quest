'use strict';
/* ATLAS QUEST — browser-only, offline-capable after download. */
const STORAGE='ATLAS_QUEST_ENGLAND_V1';
const get = id=>document.getElementById(id);
const esc = s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const chapters=Object.fromEntries(CHAPTERS.map(c=>[c.id,c]));
const gameLabels={passport:'Border Control',four_nations:'Four Nations Puzzle',landmark_hunt:'Landmark Hunt',memory:'London Memory',shop:'Pay at the Stall',market_dialogue:'Talk to Sam',timeline:'Time Traveller',vocab_fill:'Museum Words',globe_dialogue:'On the Stage',scramble:'Word Workshop',geo_puzzle:'Map Mystery',postcard:'Write a Postcard'};
const gameIcons={passport:'🧭',four_nations:'🧩',landmark_hunt:'🔎',memory:'🃏',shop:'🪙',market_dialogue:'💬',timeline:'⏳',vocab_fill:'✒',globe_dialogue:'🎭',scramble:'🔠',geo_puzzle:'🧭',postcard:'✉'};
// Clickable points on original pixel-art scenes. Buttons remain accessible from the clue list too.
const SCENE_SPOTS={
 airport:[[33,49],[66,45],[80,72],[17,72]],
 london:[[53,40],[82,66],[21,59],[72,40]],
 market:[[15,50],[37,68],[59,49],[84,67]],
 museum:[[18,42],[51,54],[81,46],[67,73]],
 globe:[[21,43],[49,66],[77,48],[61,37]],
 beyond:[[19,37],[54,45],[75,58],[45,76]]
};

const quizData={
 passport:[
 ['Which city is the capital of England AND the UK?',['London','Edinburgh','Cardiff'],0,'London is both the capital of England and of the UK.'],
 ['Which flag belongs to England?',['A red cross on white','A white diagonal cross on blue','A red dragon on green and white'],0,'The English flag is the Cross of St George.'],
 ['One country in the UK is ...',['Northern Ireland','the Republic of Ireland','France'],0,'Northern Ireland is part of the UK; the Republic of Ireland is not.']],
 four_nations:[
 ['Great Britain is ...',['England + Scotland + Wales','England + Northern Ireland','the entire island of Ireland'],0,'Great Britain is an island containing three countries.'],
 ['The United Kingdom includes ...',['Great Britain and Northern Ireland','England only','Great Britain and the Republic of Ireland'],0,'The UK has four constituent countries.'],
 ['Where is the capital, London?',['In England','In Scotland','In Wales'],0,'London is in England.']],
 landmark_hunt:[
 ['Find the GREAT BELL, not the name of the tower.',['Big Ben','Buckingham Palace','Tower Bridge','London Eye'],0,'Big Ben is the name of the Great Bell.'],
 ['Find the bridge whose road can lift for ships.',['London Eye','Tower Bridge','Buckingham Palace','Big Ben'],1,'Tower Bridge has two towers and an opening roadway.'],
 ['Find an official royal residence in London.',['Tower Bridge','London Eye','Buckingham Palace','Elizabeth Tower'],2,'Buckingham Palace is an official London royal residence.'],
 ['Find the observation wheel on the South Bank.',['The London Eye','Tower Bridge','Buckingham Palace','The Globe'],0,'The London Eye stands on the south bank of the Thames.']],
 market_dialogue:[
 ['Sam: “Hello! Can I help you?”',['Yes, how much is this notebook?','Give me this, now.','No, I am yesterday.'],0,'“Can I help you?” invites you to ask a polite question.'],
 ['Sam: “It’s four pounds fifty.” What does that mean?',['£4.50','£45.00','45p'],0,'Four pounds and fifty pence is £4.50.'],
 ['Sam gives you your purchase. You say ...',['Thank you!','Where is England?','Yesterday, please.'],0,'“Thank you” is a polite way to end the exchange.']],
 vocab_fill:[
 ['A building where people work with machines is a ...',['factory','palace','canal'],0,'A factory is a place of production.'],
 ['An object shown in a museum is an ...',['exhibit','ticket','island'],0,'An exhibit is something displayed for visitors.'],
 ['The people who live in an area form a ...',['community','wheel','bridge'],0,'Community is a useful word when talking about people and history.']],
 globe_dialogue:[
 ['Rowan: “Welcome to the Globe! Where are we?”',['On Bankside in London','In York','In Edinburgh'],0,'Shakespeare’s Globe is on Bankside in London.'],
 ['Rowan: “Who wrote Macbeth?”',['William Shakespeare','Jane Austen','Charles Dickens'],0,'William Shakespeare wrote Macbeth.'],
 ['Rowan: “What makes a live performance special?”',['The actors and audience share a moment.','Nobody is watching.','The stage is a railway.'],0,'At the Globe, the audience is part of the experience.']],
 geo_puzzle:[
 ['Find the historic city in NORTHERN England.',['York','Bath','The Lake District'],0,'York is a city in northern England.'],
 ['Find the city famous for its Roman baths, in the SOUTH-WEST.',['The Lake District','Bath','York'],1,'Bath is in south-west England.'],
 ['Find the national park in Cumbria in the NORTH-WEST.',['Bath','York','The Lake District'],2,'The Lake District is in north-west England.']]
};
const shopRounds=[
 {item:'A souvenir notebook',price:750,given:1000,choices:[250,350,150]},
 {item:'A postcard',price:420,given:500,choices:[70,80,180]},
 {item:'A handmade badge',price:375,given:500,choices:[125,225,115]}
];
const timelineItems=[{id:'modern',date:'Today',label:'A diverse, changing society'},{id:'industrial',date:'Late 1700s',label:'Industrialisation transforms work'},{id:'roman',date:'AD 43',label:'Roman rule begins in much of Britain'}];
const scrambleWords=[{word:'STAGE',prompt:'Where do actors perform?'},{word:'ACTOR',prompt:'Who performs in a play?'},{word:'PLAY',prompt:'What do we call a drama written for theatre?'}];
function fresh(){return {version:1,avatar:0,bag:'notebook',started:false,miles:0,seen:[],wins:[],cards:[],stamps:[],fr:false,postcard:'',lastChapter:'airport'}}
function normalize(obj){
 if(!obj||typeof obj!=='object'||Array.isArray(obj))throw Error('Invalid save file');
 const d=fresh(),x={...d,...obj};
 for(const key of ['seen','wins','cards','stamps']) x[key]=Array.isArray(obj[key])? [...new Set(obj[key])].slice(0,300):[];
 x.cards=x.cards.map(Number).filter(n=>Number.isInteger(n)&&n>=0&&n<CARDS.length);
 x.seen=x.seen.filter(id=>CHAPTERS.some(c=>c.discoveries.some(d=>d.id===id)));
 x.wins=x.wins.filter(id=>Object.keys(gameLabels).includes(id));
 x.stamps=x.stamps.filter(id=>chapters[id]);
 x.avatar=Number.isInteger(obj.avatar)&&obj.avatar>=0&&obj.avatar<4?obj.avatar:0;
 x.bag=['notebook','camera','phrasebook'].includes(obj.bag)?obj.bag:'notebook';
 x.fr=!!obj.fr; x.started=!!obj.started;
 x.miles=Math.max(0,Math.min(1000000,Number(obj.miles)||0));
 x.postcard=String(obj.postcard||'').slice(0,700);
 x.lastChapter=chapters[obj.lastChapter]?obj.lastChapter:'airport';
 return x;
}
let saveData;
try{saveData=normalize(JSON.parse(localStorage.getItem(STORAGE)||'null')||fresh())}catch(err){saveData=fresh()}
let view='home', openChapter='airport', selectedDisc=null,game=null, feedback=null, shuffleSerial=0;
function persist(){try{localStorage.setItem(STORAGE,JSON.stringify(saveData))}catch(err){notify('Storage is full or unavailable. Use Export Save to keep your progress.',true)}}
function grant(key,amount){if(key.startsWith('disc:')){const id=key.slice(5);if(saveData.seen.includes(id))return false;saveData.seen.push(id)}
 else if(key.startsWith('game:')){const id=key.slice(5);if(saveData.wins.includes(id))return false;saveData.wins.push(id)}
 else if(key.startsWith('stamp:')){const id=key.slice(6);if(saveData.stamps.includes(id))return false;saveData.stamps.push(id)}
 saveData.miles+=amount;persist();return true}
function earnCard(i){if(!Number.isInteger(i)||saveData.cards.includes(i))return;saveData.cards.push(i);persist();notify('New card unlocked: '+CARDS[i][0]+'!',false)}
function notify(msg,error=false){let toast=get('toast');if(!toast)return;toast.textContent=msg;toast.className='toast shown '+(error?'bad':'');clearTimeout(notify.t);notify.t=setTimeout(()=>{if(get('toast'))get('toast').className='toast'},3700)}
function chapterSeen(c){return c.discoveries.filter(d=>saveData.seen.includes(d.id)).length}
function chapterReady(c){return chapterSeen(c)===c.discoveries.length}
function chapterDone(c){return c.games.every(g=>saveData.wins.includes(g))}
function unlock(c){if(c.id==='airport')return true;const i=CHAPTERS.indexOf(c);return chapterDone(CHAPTERS[i-1])}
function home(){view='home';game=null;selectedDisc=null;render()}
function go(v){view=v;game=null;selectedDisc=null;render();window.scrollTo({top:0,behavior:'instant'})}
function chapter(id){const c=chapters[id];if(!c)return;if(!unlock(c)){notify('Finish the previous destination first.',true);return}openChapter=id;saveData.lastChapter=id;persist();go('chapter')}
function header(){return `<header class="topbar"><button data-action="home" class="brand" aria-label="Atlas Quest home"><span class="brand-emblem">✦</span> ATLAS <strong>QUEST</strong></button><div class="statbar"><span class="stat">✈ <strong>${saveData.miles}</strong> <small>miles</small></span><span class="stat">🃏 <strong>${saveData.cards.length}/${CARDS.length}</strong></span><span class="stat">▣ <strong>${saveData.stamps.length}/6</strong></span></div><button class="pill tiny" data-action="toggle-fr" aria-pressed="${saveData.fr}">${saveData.fr?'FR ✓':'FR ?'}</button></header>`}
function nav(){return `<nav class="dock" aria-label="Main navigation"><button data-action="world">🧭 <span>WORLD</span></button><button data-action="england">🗺 <span>ENGLAND</span></button><button data-action="london-map">🏙 <span>LONDON</span></button><button data-action="passport-view">📘 <span>PASSPORT</span></button><button data-action="album">🃏 <span>CARDS</span></button><button data-action="bag-view">🎒 <span>BAG</span></button><button data-action="help">⚙ <span>OPTIONS</span></button></nav>`}
function scene(name){return `style="background-image:linear-gradient(180deg,rgba(14,30,53,.05),rgba(9,22,42,.46)),url('assets/scenes/${name}.png')"`}
function homeView(){return `<section class="hero" ${scene('airport')}><div class="hero-inner"><div class="eyebrow">THE WORLD IS WAITING</div><h1>ATLAS <span>QUEST</span></h1><p class="hero-sub">EXPLORE • DISCOVER • SPEAK ENGLISH</p><p class="hero-text">Your passport to the English-speaking world. Discover places, meet people and collect memories!</p><div class="hero-actions"><button class="btn primary big" data-action="${saveData.started?'england':'create'}">${saveData.started?'✈ CONTINUE ADVENTURE':'✈ START YOUR JOURNEY'} →</button><button class="btn glass" data-action="album">🃏 MY CARD COLLECTION</button></div></div><div class="hero-avatars">${[0,1,2,3].map(i=>`<img alt="Explorer ${i+1}" src="assets/avatars/avatar${i+1}.png"/>`).join('')}</div></section><section class="home-teasers"><article><span>🗺</span><h3>Explore real places</h3><p>Walk through London, travel beyond the capital and learn real history.</p></article><article><span>🎮</span><h3>Play to remember</h3><p>Shopping, conversations, hidden clues, memory challenges and more.</p></article><article><span>🃏</span><h3>Grow your collection</h3><p>Unlock cards, stamp your passport and earn miles once per success.</p></article></section>`}
function creationView(){return `<div class="panel intro"><div class="eyebrow">BEFORE DEPARTURE · STEP 1 OF 2</div><h2>Choose your explorer</h2><p>Your adventure is yours. Pick the character you want to play.</p><div class="avatar-grid">${['Alex','Noor','Robin','Jamie'].map((n,i)=>`<button class="avatar-option ${saveData.avatar===i?'selected':''}" data-action="avatar" data-i="${i}" aria-pressed="${saveData.avatar===i}"><img src="assets/avatars/avatar${i+1}.png" alt=""/><strong>${n}</strong></button>`).join('')}</div><div class="eyebrow" style="margin-top:24px">STEP 2 OF 2</div><h2>Pack your bag</h2><p>Choose one travel companion item. You can switch it later.</p><div class="bag-grid">${[['notebook','📓','Travel notebook'],['camera','📷','Pocket camera'],['phrasebook','📖','Mini phrasebook']].map(([k,i,n])=>`<button class="bag-pick ${saveData.bag===k?'selected':''}" data-action="pack" data-item="${k}"><span>${i}</span><strong>${n}</strong></button>`).join('')}</div><button class="btn primary big" data-action="depart">✈ BOARD THE PLANE →</button></div>`}
function pillFlag(){return `<img src="assets/england_flag.png" alt="Flag of England: red cross on white" class="flag"/>`}
function worldView(){return `<section class="page-head"><span class="eyebrow">BOARDING PASS</span><h2>Choose a destination</h2><p>Your first adventure starts in England. Other English-speaking destinations will join the map in future updates.</p></section><div class="world-grid"><button class="destination-card featured" data-action="england"><img src="assets/scenes/england_map.png" alt="Illustrated overview of England"/><span class="destination-desc">${pillFlag()} <span><strong>ENGLAND</strong><small>6 chapters · 12 games · 24 cards</small></span></span><span class="destination-cta">${saveData.stamps.length?'CONTINUE':'EXPLORE'} →</span></button><div class="future-card"><span>🌎</span><h3>More destinations ahead</h3><p>Scotland, Wales, Ireland, Canada, Australia and others: planned, not yet playable.</p><span class="badge muted">COMING SOON</span></div></div>`}
function mapPin(ch,x,y,label,mode='chapter'){
 const c=chapters[ch];const ready=unlock(c); const finished=chapterDone(c);
 return `<button class="map-pin ${!ready?'locked':''} ${finished?'complete':''}" style="left:${x}%;top:${y}%" data-action="${mode}" data-ch="${ch}" aria-label="${esc(label)}${!ready?' locked':''}" ${!ready?'disabled':''}><span class="pin-orb">${finished?'✓':ready?'✦':'🔒'}</span><span class="pin-label">${esc(label)}</span></button>`}
function englandView(){return `<section class="page-head compact"><span class="eyebrow">WORLD MAP / ENGLAND</span><h2>${pillFlag()} England Adventure</h2><p>An illustrated travel map, not a scale atlas. Start in London, then explore beyond the capital.</p></section><div class="map-frame"><div class="map-art" ${scene('england_map')}>${mapPin('airport',63,80,'London · Arrival')}${mapPin('beyond',50,28,'Lake District')}${mapPin('beyond',56,43,'York')}${mapPin('beyond',45,84,'Bath')}</div><div class="map-footer"><div><strong>ENGLAND</strong><br><small>Capital: London · Currency: pound sterling (£)</small></div><button class="btn secondary" data-action="london-map">🏙 OPEN LONDON MAP →</button></div></div><div class="region-guide"><span class="badge">IN THE UK</span> England ≠ Great Britain ≠ the United Kingdom. Discover the differences at the airport.</div>`}
function londonView(){return `<section class="page-head compact"><span class="eyebrow">ENGLAND / LONDON</span><h2>London City Map</h2><p>Westminster, the London Eye, Camden and Bankside are all in London. Pins show approximate areas on this stylised map.</p></section><div class="map-frame"><div class="map-art" ${scene('london_map')}>${mapPin('london',29,56,'Westminster')}${mapPin('london',43,86,'London Eye')}${mapPin('market',32,13,'Camden Market')}${mapPin('museum',59,34,'History Gallery')}${mapPin('globe',68,88,'The Globe')}${mapPin('london',85,56,'Tower Bridge')}${mapPin('london',16,46,'Buckingham')}</div><div class="map-footer"><div><strong>THE THAMES</strong><br><small>North bank / South Bank · London, England</small></div><button class="btn secondary" data-action="england">← ENGLAND MAP</button></div></div><div class="region-guide">🚇 Camden Market: north London · 🎭 Shakespeare’s Globe: Bankside, south of the Thames · 🏰 Tower Bridge: east of Westminster.</div>`}
function cardImg(i){return `assets/cards/card${String(i).padStart(2,'0')}.png`}
function discoveryButton(d){return `<button class="clue ${saveData.seen.includes(d.id)?'seen':''}" data-action="discover" data-disc="${d.id}"><span class="clue-glyph">${saveData.seen.includes(d.id)?'✓':'?'}</span><span><strong>${esc(d.title)}</strong><small>${saveData.seen.includes(d.id)?'Discovered · Read again':'Tap to discover · +15 miles'}</small></span><span class="arrow">›</span></button>`}
function discoveryPanel(c){const d=c.discoveries.find(x=>x.id===selectedDisc);if(!d)return `<div class="narration"><span class="guide-avatar">${c.id==='globe'?'🎭':'🧭'}</span><div><small class="guide-name">${esc(c.friend)}</small><p>${esc(c.intro)}</p>${saveData.fr?`<p class="translation">🇫🇷 ${esc(c.introFr)}</p>`:''}</div></div>`;
 return `<div class="discovery-detail">${d.card!==undefined?`<img src="${cardImg(d.card)}" alt="Pixel art illustration of ${esc(d.title)}" class="detail-card"/>`:''}<div><span class="eyebrow">CULTURAL DISCOVERY · ${esc(d.word[0]).toUpperCase()}</span><h3>${esc(d.title)}</h3><p>${esc(d.text)}</p><div class="wordchip">📖 <strong>${esc(d.word[0])}</strong> — ${esc(d.word[1])}</div>${saveData.fr?`<p class="translation">🇫🇷 ${esc(d.fr)}</p>`:''}${d.card!==undefined&&saveData.cards.includes(d.card)?`<span class="badge gold">🃏 CARD ADDED TO ALBUM</span>`:''}</div></div>`}
function chapterView(){const c=chapters[openChapter];if(!c)return worldView(); const n=chapterSeen(c); const completed=chapterDone(c);
 return `<section class="chapter-banner" ${scene(c.scene)}><div class="chapter-banner-text"><div class="eyebrow">ENGLAND / CHAPTER ${c.number} OF 6</div><h2>${esc(c.name)}</h2><p>${esc(c.place)}</p><div class="chapter-status"><span>🔎 ${n}/4 discoveries</span><span>🎮 ${c.games.filter(id=>saveData.wins.includes(id)).length}/2 missions</span>${completed?'<span>✓ STAMP EARNED</span>':''}</div></div><img class="guide-profile" src="assets/avatars/avatar${(c.number%4)+1}.png" alt=""/></section><section class="scene-explore"><div class="scene-explore-head"><strong>✦ INTERACTIVE EXPLORATION</strong><span>Tap the glowing objects to uncover cultural clues.</span></div><div class="explore-art" ${scene(c.scene)}>${c.discoveries.map((d,i)=>`<button class="scene-spot ${saveData.seen.includes(d.id)?'found':''}" style="left:${SCENE_SPOTS[c.id][i][0]}%;top:${SCENE_SPOTS[c.id][i][1]}%" data-action="discover" data-disc="${d.id}" aria-label="Explore: ${esc(d.title)}" title="${esc(d.title)}">${saveData.seen.includes(d.id)?'✓':'✦'}</button>`).join('')}</div></section><div class="chapter-layout"><section class="panel"><div class="section-title"><h3>Explore & discover</h3><span class="badge">TAP EACH CLUE</span></div><div class="clue-list">${c.discoveries.map(discoveryButton).join('')}</div>${discoveryPanel(c)}</section><section class="panel missions"><div class="section-title"><h3>Adventure challenges</h3><span class="badge ${chapterReady(c)?'green':''}">${chapterReady(c)?'READY':'EXPLORE FIRST'}</span></div><p>Learn about all four discoveries first. The games reuse what you have found.</p>${c.games.map(id=>`<button class="mission ${saveData.wins.includes(id)?'won':''}" data-action="game" data-game="${id}" ${!chapterReady(c)?'disabled':''}><span class="mission-symbol">${gameIcons[id]}</span><span><strong>${gameLabels[id]}</strong><small>${saveData.wins.includes(id)?'Completed · Replay anytime':'Play after exploring · +60 miles'}</small></span><span>${saveData.wins.includes(id)?'✓':'→'}</span></button>`).join('')}${completed?`<div class="completed-box"><strong>🎉 Chapter complete!</strong><p>A passport stamp and a special card are yours.</p><button class="btn primary" data-action="${c.next?'next-chapter':'passport-view'}" data-next="${c.next||''}">${c.next?'NEXT STOP →':'SEE MY PASSPORT →'}</button></div>`:''}${game?gameView(c):''}</section></div>`}
function gameView(c){const id=game.id;if(!c.games.includes(id))return '';
 let body='';
 if(quizData[id]){
  const q=quizData[id][game.step]; if(!q)return '';
  body=`<p class="question-tag">QUESTION ${game.step+1} OF ${quizData[id].length}</p><h4>${esc(q[0])}</h4><div class="answer-grid">${q[1].map((v,i)=>`<button class="answer" data-action="quiz-answer" data-i="${i}">${esc(v)}</button>`).join('')}</div>`;
 }else if(id==='shop'){
  const r=shopRounds[game.step];body=`<p class="question-tag">CUSTOMER ${game.step+1} OF 3</p><h4>${r.item}</h4><div class="shop-visual"><span>🛍 PRICE <b>${money(r.price)}</b></span><span>💷 YOU PAY <b>${money(r.given)}</b></span></div><p>How much change must Sam give back?</p><div class="answer-grid">${r.choices.map((v,i)=>`<button class="answer" data-action="shop-answer" data-i="${i}">${money(v)}</button>`).join('')}</div>`;
 }else if(id==='timeline'){
  const chosen=game.picked||[];
  body=`<p class="question-tag">TIME TRAVELLER · TAP OLDEST TO MOST RECENT</p><h4>Put the three discoveries in chronological order.</h4><div class="timeline-answer">${chosen.map((x,i)=>`<div class="timeline-step">${i+1}. ${esc(timelineItems.find(t=>t.id===x).date)}</div>`).join('')}</div><div class="answer-grid">${timelineItems.filter(x=>!chosen.includes(x.id)).map(x=>`<button class="answer" data-action="timeline-answer" data-item="${x.id}"><b>${esc(x.date)}</b><small>${esc(x.label)}</small></button>`).join('')}</div><button class="btn outline" data-action="timeline-reset">↶ START AGAIN</button>`;
 }else if(id==='memory'){
  body=`<p class="question-tag">MATCH THE PAIRS · ${game.matched.length/2}/3 PAIRS</p><h4>Match each London clue with its answer.</h4><div class="memory-grid">${game.tiles.map((tile,i)=>`<button class="memory-tile ${game.matched.includes(i)?'matched':''}" data-action="memory-flip" data-i="${i}" ${game.matched.includes(i)||game.busy?'disabled':''}>${game.open.includes(i)||game.matched.includes(i)?esc(tile.label):'✦'}</button>`).join('')}</div>`;
 }else if(id==='scramble'){
  const spec=scrambleWords[game.step];const picked=game.letters||[];
  body=`<p class="question-tag">WORD ${game.step+1} OF ${scrambleWords.length}</p><h4>${esc(spec.prompt)}</h4><div class="spell">${picked.map(n=>esc(game.letterTiles[n].value)).join('')||'_ _ _ _ _'}</div><p>Tap letters in order to build the English word.</p><div class="letter-row">${game.letterTiles.map((a,i)=>`<button class="letter" data-action="letter" data-i="${i}" ${picked.includes(i)?'disabled':''}>${esc(a.value)}</button>`).join('')}</div><button class="btn outline" data-action="letter-reset">↶ CLEAR</button>`;
 }else if(id==='postcard'){
  body=`<p class="question-tag">FINAL CHALLENGE · MY POSTCARD</p><h4>Send a postcard from your trip</h4><p>Choose facts you discovered, then write an optional extra sentence.</p><label class="input-label">I visited <select id="postal-place"><option value="York">York</option><option value="Bath">Bath</option><option value="the Lake District">the Lake District</option></select></label><label class="input-label">I saw <select id="postal-saw"><option value="a historic cathedral">a historic cathedral</option><option value="the Roman baths">the Roman baths</option><option value="lakes and hills">lakes and hills</option></select></label><label class="input-label">It was <select id="postal-feeling"><option value="wonderful">wonderful</option><option value="interesting">interesting</option><option value="exciting">exciting</option></select></label><label class="input-label">My own sentence (optional)<textarea id="postal-note" maxlength="180" placeholder="My favourite place was ..."></textarea></label><button class="btn primary" data-action="send-postcard">✉ SEND POSTCARD</button>`;
 }
 return `<div id="game-box" class="game-box"><div class="game-title"><h3>${gameIcons[id]} ${esc(gameLabels[id])}</h3><button class="xbtn" aria-label="Close game" data-action="close-game">✕</button></div>${body}${feedback?`<div role="status" class="feedback ${feedback.ok?'success':'fail'}"><strong>${feedback.ok?'✓ Correct!':'Try again!'}</strong> ${esc(feedback.msg)} ${!feedback.ok?`<p class="translation">${esc(feedback.fr||'Read the discovery again. You can retry.')}</p>`:''}</div>`:''}</div>`}
function money(p){return p>=100?'£'+(p/100).toFixed(2):p+'p'}
function gameStart(id){const c=chapters[openChapter];if(!c.games.includes(id)||!chapterReady(c))return;
 feedback=null;game={id,step:0};
 if(id==='timeline')game.picked=[];
 if(id==='memory'){const labels=[['Big Ben',0],['The Great Bell',0],['Tower Bridge',1],['A lifting bridge',1],['London Eye',2],['A giant observation wheel',2]];game.tiles=labels.map(([label,pair])=>({label,pair})).sort(()=>Math.random()-.5);game.open=[];game.matched=[];game.busy=false}
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
function timelineAnswer(id){const sequence=['roman','industrial','modern'];if(sequence[(game.picked||[]).length]!==id){incorrect('Look at the dates: AD 43 came long before the late 1700s. Today comes last.');return}game.picked.push(id);feedback={ok:true,msg:'Good: that event is in the right place.'};if(game.picked.length===3){finishGame();return}render()}
function memoryFlip(i){if(game.busy||game.matched.includes(i)||game.open.includes(i))return;game.open.push(i);feedback=null;
 if(game.open.length===2){const [a,b]=game.open;if(game.tiles[a].pair===game.tiles[b].pair){game.matched.push(a,b);game.open=[];if(game.matched.length===6){finishGame();return}}
 else{game.busy=true;const serial=++shuffleSerial;setTimeout(()=>{if(game&&game.id==='memory'&&serial===shuffleSerial){game.open=[];game.busy=false;feedback={ok:false,msg:'These two cards do not match. Look for a landmark and its correct clue.'};render()}},850)}}render()}
function letterPick(i){if(game.letters.includes(i))return;game.letters.push(i);const built=game.letters.map(n=>game.letterTiles[n].value).join('');const expected=scrambleWords[game.step].word;
 if(!expected.startsWith(built)){game.letters=[];incorrect('Think of the spelling of '+expected.toLowerCase()+'. Try the first letter again.');return}
 if(built===expected){game.step++;if(game.step===scrambleWords.length){finishGame();return}setLetters();feedback={ok:true,msg:'You spelt it correctly! Next word.'};render();return}feedback=null;render()}
function sendPostcard(){const place=get('postal-place')?.value,saw=get('postal-saw')?.value,feeling=get('postal-feeling')?.value,personal=(get('postal-note')?.value||'').trim();
 const valid={'York':'a historic cathedral','Bath':'the Roman baths','the Lake District':'lakes and hills'};
 if(!valid[place]||valid[place]!==saw){incorrect('Match your destination with what can really be seen there: York / cathedral, Bath / Roman baths, Lake District / lakes and hills.');return}
 saveData.postcard=`Hello from England!\nI visited ${place}. I saw ${saw}. It was ${feeling}.\n${personal.slice(0,180)}\nSee you soon!`;persist();finishGame()}
function albumView(){const commons=CARDS.filter(c=>c[1]==='common').length;
 return `<section class="page-head"><span class="eyebrow">YOUR TREASURE COLLECTION</span><h2>My Travel Cards</h2><p>Each card has its own pixel illustration and cultural fact. Common cards appear after exploring; special and gold cards reward completed chapters.</p><div class="rarity-row"><span class="badge">COMMON · ${commons}</span><span class="badge silver">SPECIAL · ${CARDS.filter(c=>c[1]==='special').length}</span><span class="badge gold">GOLD · ${CARDS.filter(c=>c[1]==='gold').length}</span></div></section><div class="card-grid">${CARDS.map((c,i)=>`<button class="collect-card ${c[1]} ${!saveData.cards.includes(i)?'unknown':''}" data-action="card-detail" data-i="${i}" aria-label="${saveData.cards.includes(i)?c[0]:'Locked card '+(i+1)}"><div class="card-art">${saveData.cards.includes(i)?`<img loading="lazy" src="${cardImg(i)}" alt=""/>`:'<span>?</span>'}</div><div class="card-label"><small>${c[1].toUpperCase()}</small><strong>${saveData.cards.includes(i)?esc(c[0]):'???'}</strong></div></button>`).join('')}</div>`}
function passportView(){return `<section class="page-head"><span class="eyebrow">WORLD EXPLORER</span><h2>My Passport</h2><p>Culture cards, miles and stamps celebrate discoveries. They do not measure CEFR proficiency.</p></section><div class="passport-layout"><div class="passport-cover"><div class="passport-inner"><span class="eyebrow">ATLAS QUEST</span><h2>TRAVEL<br>PASSPORT</h2><div class="passport-star">✦</div><p>ENGLAND EDITION</p><img src="assets/avatars/avatar${saveData.avatar+1}.png" alt="Your explorer"/></div></div><div class="panel"><h3>England travel stamps</h3><div class="stamp-grid">${CHAPTERS.map(c=>`<div class="stamp ${saveData.stamps.includes(c.id)?'earned':''}"><span>${saveData.stamps.includes(c.id)?'✦':'◇'}</span><strong>${esc(c.name)}</strong><small>${saveData.stamps.includes(c.id)?'VISITED':'NOT YET STAMPED'}</small></div>`).join('')}</div><div class="pass-facts"><span>✈ ${saveData.miles} miles</span><span>🃏 ${saveData.cards.length} cards</span><span>✓ ${saveData.stamps.length} completed chapters</span></div>${saveData.postcard?`<div class="postcard-display"><h3>✉ My postcard</h3><pre>${esc(saveData.postcard)}</pre></div>`:''}</div></div>`}
function bagView(){return `<section class="page-head"><span class="eyebrow">TRAVEL EQUIPMENT</span><h2>My Adventure Bag</h2><p>Everything you need to become a curious explorer.</p></section><div class="panel"><h3>Current item</h3><div class="bag-grid">${[['notebook','📓','Travel notebook'],['camera','📷','Pocket camera'],['phrasebook','📖','Mini phrasebook']].map(([key,icon,name])=>`<button class="bag-pick ${saveData.bag===key?'selected':''}" data-action="pack" data-item="${key}"><span>${icon}</span><strong>${name}</strong><small>${saveData.bag===key?'PACKED':'TAP TO PACK'}</small></button>`).join('')}</div><p class="minor">Your bag item is cosmetic in this edition: no hidden learning advantage. Every explorer can complete the same challenges.</p><div class="tipbox">📌 Tip: On a discovery page, tap <b>FR ?</b> if you need optional French help.</div></div>`}
function helpView(){return `<section class="page-head"><span class="eyebrow">SETTINGS & TEACHER NOTES</span><h2>Travel Options</h2><p>No account, no server, no subscription. Your save stays in this browser until you export or clear it.</p></section><div class="panel"><h3>Save your journey</h3><div class="utility-grid"><button class="btn secondary" data-action="export">⬇ EXPORT SAVE (.JSON)</button><button class="btn secondary" data-action="import">⬆ IMPORT SAVE (.JSON)</button><input type="file" id="save-import" accept=".json,application/json" hidden/><button class="btn danger" data-action="reset">↶ RESET PROGRESS</button><button class="btn secondary" data-action="toggle-fr">${saveData.fr?'✓ FRENCH HELP ON':'TURN ON FRENCH HELP'}</button></div><div class="tipbox"><b>Important:</b> On shared classroom devices, use Export Save and keep your file privately. Browser storage is device-specific and can be cleared.</div><h3>Learning focus</h3><p>Short interactions combine cultural discovery with contextual vocabulary, reading, simple dialogue, money, place descriptions and chronology. This is a practice game, <b>not</b> a CEFR assessment.</p><h3>Sources used for England</h3><div class="sources">${SOURCES.map(s=>`<a href="${esc(s[1])}" target="_blank" rel="noopener noreferrer">${esc(s[0])} ↗</a>`).join('')}</div><p class="minor">The illustrated maps are stylised teaching maps (not survey-accurate). Real flags and factual names must remain correct. Visual assets are original pixel drawings created for this app.</p></div>`}
function detailView(i){const c=CARDS[i],got=saveData.cards.includes(i);return `<div class="shade" data-action="close-modal"><div class="modal" role="dialog" aria-modal="true" aria-label="Travel card"><button class="xbtn modal-close" data-action="close-modal">✕</button><img src="${got?cardImg(i):'assets/cards/card00.png'}" alt="${got?esc(c[0]):'Hidden card'}"/><div><span class="badge ${c[1]==='gold'?'gold':c[1]==='special'?'silver':''}">${c[1].toUpperCase()}</span><h2>${got?esc(c[0]):'MYSTERY CARD'}</h2><p>${got?esc(c[2]):'Explore all locations and complete games to unlock more cards.'}</p><button class="btn primary" data-action="close-modal">CLOSE</button></div></div></div>`}
let modal=null;
function render(){get('app').innerHTML=`<div class="shell">${header()}<main id="main">${view==='home'?homeView():view==='create'?creationView():view==='world'?worldView():view==='england'?englandView():view==='london-map'?londonView():view==='chapter'?chapterView():view==='album'?albumView():view==='passport'?passportView():view==='bag'?bagView():helpView()}</main>${nav()}<footer>ATLAS QUEST · ENGLAND ADVENTURE · OFFLINE-FRIENDLY · MADE FOR CURIOUS EXPLORERS</footer></div><div id="toast" class="toast" role="status" aria-live="polite"></div>${modal!==null?detailView(modal):''}`;}
function download(data,name,type){const blob=new Blob([data],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500)}
async function importSave(file){if(!file||file.size>200000){notify('Please choose a small Atlas Quest JSON save.',true);return}try{const candidate=normalize(JSON.parse(await file.text()));if(!confirm('Replace your current progress with this saved journey?'))return;saveData=candidate;persist();modal=null;home();notify('Your saved adventure was imported.')}catch(err){notify('This does not look like a valid Atlas Quest save.',true)}}
get('app').addEventListener('change',e=>{if(e.target.id==='save-import'){importSave(e.target.files?.[0]);e.target.value=''}});
get('app').addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(!b||b.disabled)return;
 const act=b.dataset.action;const i=Number(b.dataset.i);
 if(act==='home')home();
 else if(act==='world')go('world');
 else if(act==='england')go('england');
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
 else if(act==='card-detail'){if(saveData.cards.includes(i)){modal=i;render()}else notify('This card is not unlocked yet. Keep exploring!')}
 else if(act==='close-modal'){modal=null;render()}
 else if(act==='export')download(JSON.stringify(saveData,null,2),'atlas-quest-save.json','application/json');
 else if(act==='import')get('save-import')?.click();
 else if(act==='reset'){if(confirm('Delete all progress in this browser? Export a save first if you need it.')){saveData=fresh();persist();modal=null;home()}}
});
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal!==null){modal=null;render()}});
render();
