/* ATLAS QUEST — editable cultural content. No external APIs. */
const CHAPTERS = [
 {
  id:'airport', number:1, name:'Welcome to England', place:'The Airport', scene:'airport', symbol:'✈', intro:'Your flight has landed! Meet Maya, your local guide, and collect the facts you need for your journey.', introFr:'Ton avion a atterri ! Découvre les premiers repères avec Maya.', friend:'Maya · travel guide', next:'london',
  discoveries:[
   {id:'england',title:'England is a country',text:'England is one of the four countries that make up the United Kingdom. It is on the island of Great Britain, alongside Scotland and Wales.',fr:'L’Angleterre est un des quatre pays constitutifs du Royaume-Uni. Elle partage l’île de Grande-Bretagne avec l’Écosse et le pays de Galles.',word:['country','pays'],card:0},
   {id:'capital',title:'London is the capital',text:'London is the capital of both England and the United Kingdom. The River Thames runs through the city.',fr:'Londres est la capitale de l’Angleterre et du Royaume-Uni. La Tamise traverse la ville.',word:['capital','capitale'],card:1},
   {id:'nations',title:'Britain is not the UK',text:'Great Britain is the island made up of England, Scotland and Wales. The United Kingdom includes these three countries and Northern Ireland.',fr:'Grande-Bretagne = Angleterre, Écosse et pays de Galles ; Royaume-Uni = ces trois pays et l’Irlande du Nord.',word:['island','île'],card:2},
   {id:'flag',title:'The English flag',text:'England’s flag is a red cross on white: the Cross of St George. It is NOT the same as the Union Flag, which represents the UK.',fr:'Le drapeau anglais porte la croix de saint Georges rouge sur fond blanc. Le Union Flag représente le Royaume-Uni.',word:['cross','croix']}
  ],
  games:['passport','four_nations']
 },
 {
  id:'london',number:2,name:'London Landmarks',place:'Westminster & the Thames',scene:'london',symbol:'🏰',intro:'Explore London with Noor. The city has clues everywhere: a famous bell, a royal palace and an unusual bridge.',introFr:'Découvre les monuments de Londres avec Noor.',friend:'Noor · London resident',next:'market',
  discoveries:[
   {id:'elizabeth',title:'Elizabeth Tower & Big Ben',text:'Elizabeth Tower stands beside the Palace of Westminster. Big Ben is the nickname of the GREAT BELL inside the tower, not the tower itself.',fr:'Elizabeth Tower est la tour de l’horloge du palais de Westminster. Big Ben désigne la grande cloche.',word:['bell','cloche'],card:3},
   {id:'towerbridge',title:'Tower Bridge',text:'Tower Bridge crosses the River Thames in east-central London. Its central roadway can lift to let tall vessels pass. It is not London Bridge.',fr:'Tower Bridge est un pont levant de Londres, distinct de London Bridge.',word:['bridge','pont'],card:4},
   {id:'buckingham',title:'Buckingham Palace',text:'Buckingham Palace is an official London residence of the British monarch. The Changing of the Guard is a ceremonial tradition, not an everyday event at a fixed hour.',fr:'Buckingham Palace est une résidence officielle du souverain britannique à Londres.',word:['palace','palais'],card:5},
   {id:'eye',title:'The London Eye',text:'The London Eye is a giant observation wheel on the SOUTH BANK of the Thames, opposite the Palace of Westminster. Its capsules offer views across the city.',fr:'Le London Eye est sur la rive sud de la Tamise, face au palais de Westminster.',word:['wheel','grande roue']}
  ],games:['landmark_hunt','memory']
 },
 {
  id:'market',number:3,name:'Camden Market',place:'Camden Town · London',scene:'market',symbol:'🛍',intro:'Walk along Regent’s Canal and meet Sam at a market stall. Learn to ask prices, recognise coins and pay in pounds.',introFr:'Camden Market se trouve dans le nord de Londres, près de Regent’s Canal.',friend:'Sam · market trader',next:'museum',
  discoveries:[
   {id:'camden',title:'Camden is in London',text:'Camden Market is in Camden Town, NORTH London, close to Regent’s Canal. Its stalls sell food, fashion, crafts and other goods.',fr:'Camden Market est à Camden Town, dans le nord de Londres, près de Regent’s Canal.',word:['stall','étal'],card:7},
   {id:'pound',title:'Pounds and pence',text:'The currency is the pound sterling (£). One pound equals 100 pence (p). Ask: “How much is it?” and answer: “It is five pounds.”',fr:'La monnaie utilisée est la livre sterling (£), divisée en 100 pence.',word:['change','monnaie rendue'],card:8},
   {id:'canal',title:'Regent’s Canal',text:'Regent’s Canal runs beside parts of Camden Market. People walk along the towpath, and narrowboats use the waterway.',fr:'Regent’s Canal longe certaines parties du marché ; on peut y voir des péniches.',word:['canal','canal'],card:9},
   {id:'coins',title:'Coins and banknotes',text:'Common UK coins are 1p, 2p, 5p, 10p, 20p, 50p, £1 and £2. Bank of England notes are £5, £10, £20 and £50. Both King Charles III and Elizabeth II notes may circulate.',fr:'Huit valeurs de pièces courantes et quatre valeurs de billets émis par la Bank of England.',word:['banknote','billet']}
  ],games:['shop','market_dialogue']
 },
 {
  id:'museum',number:4,name:'A Journey Through Time',place:'The History Gallery · London',scene:'museum',symbol:'🏛',intro:'Visit a fictional history gallery inspired by museum collections. Meet Asha, who helps you put four centuries of history in order.',introFr:'Galerie pédagogique fictive : les repères historiques, eux, sont réels.',friend:'Asha · history guide',next:'globe',
  discoveries:[
   {id:'museum',title:'What museums tell us',text:'Museums display objects, artworks and stories. They also ask questions about how objects were collected and whose voices are represented.',fr:'Les musées présentent des objets et des histoires, mais interrogent aussi la provenance des collections.',word:['exhibit','objet exposé'],card:11},
   {id:'roman',title:'Roman Britain',text:'Roman rule in much of what is now England began in AD 43. Bath is famous for its Roman baths, built around natural hot springs.',fr:'L’occupation romaine d’une grande partie de l’actuelle Angleterre commence en 43 après J.-C.',word:['ancient','ancien'],card:12},
   {id:'industry',title:'Industry and change',text:'From the late 1700s, industrialisation transformed parts of Britain through factories, machines and railways. Growth also brought difficult working and living conditions.',fr:'L’industrialisation transforme la Grande-Bretagne à partir de la fin du XVIIIe siècle, avec des conséquences sociales contrastées.',word:['factory','usine'],card:13},
   {id:'modern',title:'A changing society',text:'People have moved to England from many parts of the world over centuries. Their experiences have shaped food, music, language and communities, including through migration linked to the British Empire.',fr:'Les migrations, notamment dans le contexte de l’Empire britannique, ont contribué à façonner la société anglaise contemporaine.',word:['community','communauté']}
  ],games:['timeline','vocab_fill']
 },
 {
  id:'globe',number:5,name:'Shakespeare’s Globe',place:'Bankside · London',scene:'globe',symbol:'🎭',intro:'Cross to Bankside. Meet Rowan, a theatre performer, and learn how actors and audiences bring stories to life.',introFr:'Le Globe est à Bankside, au sud de la Tamise, à Londres.',friend:'Rowan · theatre performer',next:'beyond',
  discoveries:[
   {id:'globe',title:'An open-air theatre',text:'The modern Shakespeare’s Globe opened in 1997 on Bankside, London. It is a reconstruction inspired by the original Globe built in 1599.',fr:'Le Globe actuel, ouvert en 1997 à Bankside, s’inspire du théâtre de 1599.',word:['stage','scène'],card:14},
   {id:'will',title:'William Shakespeare',text:'Shakespeare was an English playwright and actor, born in Stratford-upon-Avon in 1564. He wrote plays such as Romeo and Juliet, Macbeth and A Midsummer Night’s Dream.',fr:'William Shakespeare naît à Stratford-upon-Avon en 1564 et écrit de nombreuses pièces.',word:['playwright','dramaturge'],card:15},
   {id:'audience',title:'The audience matters',text:'At the Globe, some spectators stand in the open yard and others sit in galleries. Actors speak directly to the audience, whose reactions are part of the experience.',fr:'Le théâtre comporte une cour centrale ouverte et des galeries ; le public participe par ses réactions.',word:['audience','public'],card:16},
   {id:'culture',title:'Many voices on stage',text:'The original Globe was a place of public entertainment in Elizabethan and Jacobean London. Today, theatre companies reinterpret plays with different casts, staging and perspectives.',fr:'Le théâtre fait vivre les œuvres différemment selon les interprétations et les publics.',word:['performance','représentation']}
  ],games:['globe_dialogue','scramble']
 },
 {
  id:'beyond',number:6,name:'Beyond London',place:'York · Bath · Lake District',scene:'beyond',symbol:'🚂',intro:'Your rail journey takes you outside the capital. Explore very different English places before sending your postcard home.',introFr:'Découvre des lieux situés en Angleterre, en dehors de Londres.',friend:'Jamie · train explorer',next:null,
  discoveries:[
   {id:'york',title:'York · northern England',text:'York is a historic city in northern England, known for York Minster and its medieval streets. People have lived in and around the city for centuries.',fr:'York est une ville historique du nord de l’Angleterre, connue pour sa cathédrale et ses rues anciennes.',word:['cathedral','cathédrale'],card:17},
   {id:'bath',title:'Bath · south-west England',text:'Bath is in south-west England. The city is known for its Roman baths and Georgian architecture. Its Roman remains help us understand an earlier period of British history.',fr:'Bath, dans le sud-ouest de l’Angleterre, est connue pour ses bains romains et son architecture géorgienne.',word:['spring','source d’eau'],card:18},
   {id:'lakes',title:'The Lake District · north-west England',text:'The Lake District is in Cumbria, in north-west England. This national park has lakes, mountains, villages and walking trails. Local landscapes inspired writers and artists.',fr:'Le Lake District se situe en Cumbria, dans le nord-ouest de l’Angleterre.',word:['landscape','paysage'],card:19},
   {id:'rail',title:'Travel by train',text:'A train journey is one way to explore England beyond London. York lies north of London, Bath lies west of London, and the Lake District is in the north-west.',fr:'Le train permet de relier différentes régions ; York est au nord, Bath à l’ouest, le Lake District au nord-ouest.',word:['railway','chemin de fer']}
  ],games:['geo_puzzle','postcard']
 }
];
const CARDS=[
 ['The Cross of St George','common','The English national flag has a red cross on white.'],
 ['Capital City','common','London is the capital of England and the UK.'],
 ['Four Nations','common','The United Kingdom contains England, Scotland, Wales and Northern Ireland.'],
 ['Elizabeth Tower','common','Big Ben is the Great Bell inside Elizabeth Tower.'],
 ['Tower Bridge','common','A movable bridge across the Thames, different from London Bridge.'],
 ['Buckingham Palace','common','An official London royal residence.'],
 ['London Eye','special','The observation wheel stands on the South Bank of the Thames.'],
 ['Camden Town','common','Camden Market is in northern London.'],
 ['Pound Sterling','common','One pound (£1) is 100 pence.'],
 ['Regent’s Canal','common','A London canal that passes by Camden.'],
 ['Smart Shopper','special','You asked politely and calculated the correct change.'],
 ['History Gallery','common','Objects can show history from different perspectives.'],
 ['Roman Bath','common','Bath is famous for its Roman baths.'],
 ['Industrial Change','common','Industrialisation brought machines and major social changes.'],
 ['The Globe','common','The current reconstructed theatre opened in 1997.'],
 ['William Shakespeare','common','An English playwright born in 1564.'],
 ['The Audience','common','Spectators help make every performance different.'],
 ['York','common','A historic city in northern England.'],
 ['Bath','common','A historic city in south-west England.'],
 ['Lake District','common','A national park in north-west England.'],
 ['Rail Explorer','gold','You explored English places beyond London.'],
 ['Travel Passport','special','You can distinguish England, Great Britain and the United Kingdom.'],
 ['Theatre Star','gold','You completed the Globe challenges.'],
 ['History Detective','special','You connected evidence and historical events.']
];
const REWARD_CARD={airport:21,london:6,market:10,museum:23,globe:22,beyond:20};
const SOURCES=[
 ['Office for National Statistics · UK geography','https://service-manual.ons.gov.uk/content/language/countries-and-regions'],
 ['UK Parliament / Visit London · Big Ben','https://www.visitlondon.com/things-to-do/sightseeing/london-attraction/big-ben'],
 ['Shakespeare’s Globe · About the Globe','https://www.shakespearesglobe.com/discover/about-us/globe-theatre/'],
 ['Camden Market · Visit','https://camdenmarket.com/visit-us'],
 ['The Royal Mint · UK coins','https://www.royalmint.com/corporate/circulating-coin/uk-currency/mintages/'],
 ['Bank of England · Current banknotes','https://www.bankofengland.co.uk/banknotes/current-banknotes'],
 ['Éduscol · Langues vivantes au collège','https://eduscol.education.gouv.fr/4758/ressources-d-accompagnement-pour-les-langues-vivantes-etrangeres-et-regionales-au-college']
];
