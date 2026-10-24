/* Country encounters are separate from the engine: future countries may register more. */
window.ATLAS_COMICS={england:{
 airport:{speaker:'Ava',role:'Airport welcome guide',portrait:1,panels:[
  {speaker:'Ava',line:'Welcome! You have landed in England. Are you ready for your journey?',fr:'Bienvenue ! Tu es arrivé en Angleterre. Prêt pour le voyage?'},
  {speaker:'Explorer',line:'Yes! Is England the same as the United Kingdom?',fr:'L’Angleterre est-elle la même chose que le Royaume-Uni?'},
  {speaker:'Ava',line:'Not quite! England is one of the four nations of the UK. London is the capital of both England and the UK.',fr:'L’Angleterre est l’une des quatre nations du Royaume-Uni. Londres est la capitale des deux.'}],
 choices:[['So Scotland, Wales and Northern Ireland are the other three?','Exactly! Great question.',true],['So the Republic of Ireland is part of the UK?','Not quite: Northern Ireland is part of the UK, but the Republic of Ireland is independent.',false]],cue:'Now inspect the clues before your border-control challenge.'},
 london:{speaker:'Maya',role:'London walking guide',portrait:2,panels:[
  {speaker:'Maya',line:'Follow the Thames with me! Which bridge do you recognise?',fr:'Suis la Tamise avec moi ! Quel pont reconnais-tu?'},
  {speaker:'Explorer',line:'I can see a bridge with two towers. Is that London Bridge?',fr:'Je vois un pont à deux tours. Est-ce London Bridge ?'},
  {speaker:'Maya',line:'That is Tower Bridge. London Bridge is a different bridge. Look carefully at the river!',fr:'C’est Tower Bridge. London Bridge est un autre pont.'}],
 choices:[['Can its roadway open for boats?','Yes. The central bascules can lift to let ships pass.',true],['Does Big Ben name the whole tower?','People often say that, but Big Ben is the Great Bell inside Elizabeth Tower.',false]],cue:'Explore the monuments, then play Landmark Hunt.'},
 market:{speaker:'Sam',role:'Camden Market stallholder',portrait:3,panels:[
  {speaker:'Sam',line:'Hi! Welcome to Camden Market, here in north London. Looking for a souvenir?',fr:'Bienvenue à Camden Market, dans le nord de Londres !'},
  {speaker:'Explorer',line:'Yes, please. How much is that badge?',fr:'Oui, s’il vous plaît. Combien coûte ce badge ?'},
  {speaker:'Sam',line:'It is three pounds fifty. We use pounds and pence here.',fr:'Il coûte trois livres cinquante. On utilise les livres et les pence.'}],
 choices:[['Here is five pounds. Can I have my change, please?','Of course! Five pounds minus three pounds fifty leaves one pound fifty.',true],['Here is five euros.','We use pounds sterling in the UK. Look at the coins and try again.',false]],cue:'Discover the coins and prices before shopping.'},
 museum:{speaker:'Nia',role:'Museum educator',portrait:2,panels:[
  {speaker:'Nia',line:'A museum is full of objects, but every object has more than one story.',fr:'Un musée regorge d’objets, mais chacun peut raconter plusieurs histoires.'},
  {speaker:'Explorer',line:'Can we explore England’s history together?',fr:'Pouvons-nous découvrir ensemble l’histoire de l’Angleterre ?'},
  {speaker:'Nia',line:'Yes. Find clues from Roman Britain to the Industrial Revolution. Think about whose voices we hear.',fr:'Cherche des indices de la Bretagne romaine à la révolution industrielle. Demande-toi quelles voix sont représentées.'}],
 choices:[['Can people have different experiences of the same event?','Absolutely. Historical evidence can tell different stories.',true],['Did everyone experience industrialisation in the same way?','No. It brought change and opportunities, but also difficult working conditions.',false]],cue:'Investigate the gallery before rebuilding the timeline.'},
 globe:{speaker:'Rowan',role:'Globe theatre performer',portrait:0,panels:[
  {speaker:'Rowan',line:'Welcome to Shakespeare’s Globe on Bankside, in London!',fr:'Bienvenue au Shakespeare’s Globe, à Bankside, à Londres !'},
  {speaker:'Explorer',line:'Is this the exact theatre Shakespeare performed in?',fr:'Est-ce exactement le théâtre où jouait Shakespeare ?'},
  {speaker:'Rowan',line:'No. This reconstruction opened in 1997, inspired by the original Globe built in 1599.',fr:'Non. Cette reconstruction date de 1997 et s’inspire du Globe original de 1599.'}],
 choices:[['Can the audience stand in the open yard?','Yes! Some audience members stand and others sit in galleries.',true],['Was the Globe built in York?','No, the Globe is in London, on the south bank of the Thames.',false]],cue:'Learn about the stage and audience, then join the theatre challenge.'},
 beyond:{speaker:'Jamie',role:'Rail travel companion',portrait:3,panels:[
  {speaker:'Jamie',line:'Time to explore beyond London! Shall we travel by train?',fr:'Partons découvrir l’Angleterre au-delà de Londres !'},
  {speaker:'Explorer',line:'Where can we see old streets, Roman baths and beautiful lakes?',fr:'Où trouve-t-on des rues anciennes, des bains romains et de beaux lacs ?'},
  {speaker:'Jamie',line:'Try York in the north, Bath in the south-west, and the Lake District in Cumbria.',fr:'Découvre York au nord, Bath au sud-ouest et le Lake District en Cumbria.'}],
 choices:[['Is the Lake District in north-west England?','Yes, in Cumbria. Enjoy the landscapes!',true],['Is Bath a neighbourhood of London?','No, Bath is a city in south-west England.',false]],cue:'Explore these places, then write your travel postcard.'}
}};
