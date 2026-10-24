from PIL import Image, ImageDraw
import random, math, os
random.seed(18)
ROOT=os.path.dirname(__file__)
W,H=480,270
C={'ink':'#17233e','sky':'#63c4ff','sea':'#1599bd','grass':'#7cbf68','wood':'#ab724e','gold':'#f5c76b'}
def poly(d,p,c):d.polygon(p,fill=c)
def rect(d,box,c):
 x0,y0,x1,y1=box; d.rectangle((min(x0,x1),min(y0,y1),max(x0,x1),max(y0,y1)),fill=c)
def line(d,xy,c,width=1):d.line(xy,fill=c,width=width,joint='curve')
def circle(d,x,y,r,c):d.ellipse((x-r,y-r,x+r,y+r),fill=c)
def newscene(tone='day'):
 im=Image.new('RGB',(W,H));d=ImageDraw.Draw(im)
 for y in range(H):
  if tone=='night': rgb=(int(18+y*.06),int(39+y*.11),int(75+y*.16))
  else:rgb=(int(79+y*.23),int(168+y*.22),min(255,int(218+y*.12)))
  line(d,[(0,y),(W,y)],rgb)
 if tone!='night':
  circle(d,406,42,21,'#fff2aa');circle(d,410,40,14,'#fffae0')
  for x,y in [(35,47),(139,29),(285,65),(387,91)]:
   for a,b,r in [(0,0,11),(12,-4,15),(26,1,9)]:circle(d,x+a,y+b,r,'#e6f8ff')
   rect(d,(x-5,y+3,x+33,y+10),'#e6f8ff')
 return im,d
def patchgrass(d,y=170):
 poly(d,[(0,y),(45,y-14),(120,y+5),(175,y-11),(245,y+6),(322,y-8),(390,y+3),(480,y-10),(480,270),(0,270)],'#5a9860')
 for i in range(170):
  x=random.randrange(480); yy=random.randrange(y+10,270)
  c=random.choice(['#6cac5f','#8fd171','#4e8b5a','#e4c570'])
  rect(d,(x,yy,x+random.randrange(1,4),yy+2),c)
def tree(d,x,y,s=1):
 x=int(x);y=int(y);s=int(s)
 rect(d,(x-2*s,y-12*s,x+2*s,y+3*s),'#704b3f')
 for ox,oy,rs,col in [(-6,-16,7,'#356b53'),(5,-18,8,'#398b5a'),(0,-24,10,'#51a366')]:circle(d,x+ox*s,y+oy*s,rs*s,col)
 for i in range(5):rect(d,(x+random.randrange(-7,8)*s,y-random.randrange(17,27)*s,x+random.randrange(-7,8)*s+2,y-15*s),'#92ce73')
def window(d,x,y,w=6,h=8):rect(d,(x,y,x+w,y+h),'#284f70');rect(d,(x+1,y+1,x+w-1,y+3),'#e4c877')
def house(d,x,y,w=44,h=40,color='#d9b88b'):
 rect(d,(x,y-h,x+w,y),color);poly(d,[(x-5,y-h),(x+w//2,y-h-20),(x+w+5,y-h)],'#a45451')
 for i in range(2):window(d,x+9+i*(w//2),y-h+8,6,9)
 rect(d,(x+w//2-4,y-13,x+w//2+5,y),'#674e4d')
def person(d,x,y,colors=None,scale=1):
 s=scale; colors=colors or ['#6b3a32','#efc19a','#1b8295']
 circle(d,x,y-14*s,5*s,colors[1]);rect(d,(x-5*s,y-20*s,x+5*s,y-16*s),colors[0]);rect(d,(x-5*s,y-8*s,x+5*s,y+4*s),colors[2]);line(d,[(x-3*s,y+4*s),(x-4*s,y+10*s)],'#253650',2*s);line(d,[(x+3*s,y+4*s),(x+5*s,y+10*s)],'#253650',2*s)
def clocktower(d,x,y,s=1):
 s=int(s);rect(d,(x,y-94*s,x+29*s,y),'#b99c67');rect(d,(x+3*s,y-100*s,x+26*s,y-93*s),'#d6be81');poly(d,[(x-4*s,y-101*s),(x+14*s,y-116*s),(x+33*s,y-101*s)],'#324a6a');rect(d,(x+11*s,y-128*s,x+18*s,y-114*s),'#c19b55')
 for h in range(3):window(d,x+10*s,y-(24+h*21)*s,10*s,11*s)
 circle(d,x+14*s,y-87*s,10*s,'#283a61');circle(d,x+14*s,y-87*s,7*s,'#fff3c3');line(d,[(x+14*s,y-87*s),(x+14*s,y-92*s)],'#182843',2*s);line(d,[(x+14*s,y-87*s),(x+18*s,y-85*s)],'#182843',2*s)
def ferris(d,x,y,r=34):
 circle(d,x,y,r,'#e8f9ff');circle(d,x,y,r-2,'#77bcd3')
 for i in range(12):
  ang=i*math.pi/6; tx=int(x+math.cos(ang)*r);ty=int(y+math.sin(ang)*r)
  line(d,[(x,y),(tx,ty)],'#d9f5e8',2);rect(d,(tx-3,ty-2,tx+3,ty+4),'#f6bd72')
 poly(d,[(x,y),(x-21,y+r+12),(x+21,y+r+12)],'#d9f5e8')
def bridge(d,x,y,scale=1):
 s=scale
 for tx in (x,x+92*s):
  rect(d,(tx,y-50*s,tx+22*s,y+13*s),'#ceaf77');rect(d,(tx+3*s,y-61*s,tx+19*s,y-48*s),'#e1c89c');poly(d,[(tx,y-61*s),(tx+11*s,y-74*s),(tx+22*s,y-61*s)],'#3d6381');window(d,tx+7*s,y-34*s,7*s,13*s)
 rect(d,(x-8*s,y+7*s,x+122*s,y+16*s),'#6492b0')
 line(d,[(x+11*s,y-40*s),(x+103*s,y-40*s)],'#e3d5ac',4*s)
 for k in range(8):
  xx=x+11*s+k*13*s;line(d,[(xx,y-40*s),(xx,y+7*s)],'#e4d2a8',1*s)
def building(d,x,base,w,h,color,roof='#a55250'):
 rect(d,(x,base-h,x+w,base),color);poly(d,[(x-4,base-h),(x+w//2,base-h-14),(x+w+4,base-h)],roof)
 for xx in range(x+6,x+w-5,13):
  for yy in range(base-h+10,base-5,16):window(d,xx,yy,5,8)
def lamp(d,x,y):line(d,[(x,y),(x,y-29)],'#384a56',3);circle(d,x,y-30,5,'#ffe8a3')
def save(im,name,sub='scenes',scale=2):
 dest=os.path.join(ROOT,'assets',sub,name+'.png');im.resize((im.width*scale,im.height*scale),Image.Resampling.NEAREST).save(dest,optimize=True)
# terminal
im,d=newscene();rect(d,(0,142,480,270),'#6c8193');rect(d,(0,184,480,270),'#d4b886')
for i in range(0,481,48):line(d,[(i,0),(i,175)],'#516c8a',4)
for y in (65,143,179):line(d,[(0,y),(480,y)],'#516c8a',4)
# airplane
poly(d,[(235,126),(277,119),(360,120),(413,129),(379,136),(276,134)],'#fcfaf2');poly(d,[(303,129),(328,156),(354,159),(333,132)],'#d3e8ed');poly(d,[(286,120),(293,94),(309,96),(303,124)],'#f8f5ef');rect(d,(356,127,397,130),'#1e6186')
for x in range(289,352,13):rect(d,(x,123,x+6,126),'#327397')
for x in range(0,480,44):rect(d,(x,196,x+25,199),'#ad9773')
rect(d,(15,196,165,242),'#27496a');rect(d,(25,203,152,217),'#3c7d85');rect(d,(25,224,150,231),'#f8d68c')
for x in [199,233,275,310,364]:person(d,x,225,['#342c40','#bc825b',random.choice(['#e09a55','#e65e67','#4da2a3'])],2)
save(im,'airport')
# scenic London Westminster
im,d=newscene();rect(d,(0,185,480,270),'#268dae');rect(d,(0,202,480,207),'#83c2d1');
for x in range(5,480,36): building(d,x,189,29,random.randint(36,76),random.choice(['#e7cda8','#b7bbad','#d8b6ad']))
rect(d,(12,168,275,196),'#b6a482')
for x in range(22,266,16):rect(d,(x,151,x+7,184),'#d4c39e');poly(d,[(x,152),(x+3,140),(x+7,152)],'#85746b')
clocktower(d,235,185)
poly(d,[(0,226),(0,270),(480,270),(480,230),(394,214),(290,227),(220,214),(140,238)],'#b2ab89')
for x in range(35,480,73):lamp(d,x,254)
for x in range(31,480,53):person(d,x,244,scale=1)
save(im,'london')
# market
im,d=newscene();patchgrass(d,184)
for xx in range(0,480,91):
 rect(d,(xx,109,xx+87,208),'#945d57');rect(d,(xx+4,133,xx+82,206),'#d9af81');poly(d,[(xx-5,132),(xx+89,132),(xx+79,109),(xx+5,109)],'#cc5a5a')
 for k in range(6):rect(d,(xx+k*15,109,xx+k*15+7,132),'#f8e1a3')
 rect(d,(xx+6,168,xx+79,178),'#785347')
 for k in range(4):
  c=random.choice(['#e8756d','#64add1','#77b988','#ddbf65']);rect(d,(xx+11+k*16,150,xx+19+k*16,167),c)
 for k in range(2):rect(d,(xx+24+k*31,181,xx+29+k*31,202),'#544e57')
for x in range(21,480,52):person(d,x,231,scale=2)
rect(d,(0,249,480,270),'#b7aa87')
save(im,'market')
# Museum interior
im,d=Image.new('RGB',(W,H),'#d7b78c'),None;d=ImageDraw.Draw(im)
rect(d,(0,0,480,26),'#806350');rect(d,(0,26,480,176),'#d8c49b');rect(d,(0,179,480,270),'#9e795b')
for x in range(34,480,90):rect(d,(x,21,x+23,200),'#f0d9ae');rect(d,(x-7,29,x+30,35),'#9d784f');rect(d,(x-8,187,x+32,200),'#9d784f')
for x in range(9,480,49):line(d,[(x,270),(195+(x-235)//3,187)],'#c6a078',1)
for x,y in [(82,120),(248,125),(392,119)]:
 rect(d,(x-25,y-26,x+26,y+37),'#916d4e');rect(d,(x-19,y-20,x+19,y+29),'#e8cc89');
 for k in range(9):rect(d,(x-17+random.randrange(34),y-19+random.randrange(46),x-14+random.randrange(34),y-17+random.randrange(46)),random.choice(['#a56d55','#e5a963','#698f82']))
for x in [143,322]:rect(d,(x,167,x+37,206),'#f1d3a7');circle(d,x+18,154,15,'#d5cfac');rect(d,(x+7,160,x+28,177),'#d5cfac')
for x in (88,241,390):person(d,x,224,scale=2)
save(im,'museum')
# Globe exterior inside
im,d=newscene('night');rect(d,(0,206,480,270),'#725f4e')
poly(d,[(41,92),(133,45),(346,44),(436,92),(427,206),(50,206)],'#c4a481');poly(d,[(21,99),(128,35),(355,34),(460,99),(446,114),(355,57),(125,58),(39,114)],'#634846')
poly(d,[(69,116),(410,116),(391,193),(88,193)],'#4a2c40')
rect(d,(140,118,340,200),'#77513d');rect(d,(146,125,332,185),'#d5ad69')
for x in range(73,416,27):
 rect(d,(x,82,x+11,195),'#e6c38c');rect(d,(x,92,x+11,98),'#5b4254')
for y in (110,141,174):line(d,[(69,y),(415,y)],'#765041',5)
for xx in range(93,400,17):person(d,xx,220,scale=1)
for xx in (181,252,315):person(d,xx,178,['#4a322c','#f1ba87','#d35b65'],2)
save(im,'globe')
# Northern england
im,d=newscene();patchgrass(d,184)
poly(d,[(0,189),(65,98),(103,154),(192,72),(268,163),(349,97),(480,175),(480,220),(0,230)],'#7a9ca0')
poly(d,[(0,190),(65,99),(103,156),(192,73),(268,162),(348,98),(480,175)],'#527c74')
poly(d,[(57,111),(65,99),(103,156),(190,77),(200,89)],'#e4e4ce')
poly(d,[(0,201),(90,174),(192,200),(302,167),(480,199),(480,270),(0,270)],'#6eb67a')
poly(d,[(0,240),(90,222),(166,236),(252,208),(331,230),(480,208),(480,256),(0,270)],'#3a97b2')
for x in (32,94,145,310,407,456):tree(d,x,242,random.choice([1,2]))
for x in (70,248,392):house(d,x,218,36,30)
for x in (165,345):person(d,x,243,scale=2)
save(im,'beyond')
# Britain airport map - precise England silhouette as stylised, not claiming georeferenced accuracy
im,d=Image.new('RGB',(W,H),'#207eaa'),None;d=ImageDraw.Draw(im)
for y in range(H):line(d,[(0,y),(W,y)],(int(23+y*.05),int(122+y*.04),int(162+y*.05)))
for i in range(155):
 x=random.randrange(W);y=random.randrange(H);line(d,[(x,y),(x+random.randrange(4,14),y)],random.choice(['#2c96b7','#3a91ac','#69bbcc']),1)
# north at top center, England as long north south with southwest peninsula; shape intentionally stylized
coast=[(259,17),(282,25),(276,45),(296,56),(286,77),(299,91),(285,113),(293,133),(310,146),(303,171),(319,190),(318,211),(305,227),(286,223),(260,235),(237,226),(217,230),(188,239),(151,247),(133,243),(138,232),(160,229),(183,219),(205,207),(223,198),(224,178),(210,161),(220,142),(212,130),(224,112),(215,95),(229,80),(221,62),(238,45),(231,33)]
poly(d,[(x+4,y+5) for x,y in coast],'#1a627e');poly(d,coast,'#5da46d')
for i in range(350):
 x=random.randint(125,316);y=random.randint(20,245)
 # use mask by pixel
 if im.getpixel((x,y))==(93,164,109):rect(d,(x,y,x+random.randrange(1,4),y+1),random.choice(['#7abb76','#81c582','#418c61']))
# hills north, rural fields, south
for x,y in [(249,49),(263,73),(238,92),(242,127),(278,153),(238,185),(270,208),(194,225),(155,236)]:
 circle(d,x,y,7,'#3b8b62');circle(d,x+8,y-4,6,'#86c36d')
# roads route continuous
road=[(266,34),(248,84),(254,122),(280,171),(286,202),(273,217),(201,223),(156,238)]
line(d,road,'#f5ddab',4)
for x,y in [(266,34),(248,84),(254,122),(280,171),(286,202),(273,217),(201,223),(156,238)]:circle(d,x,y,4,'#fff5ce');circle(d,x,y,2,'#c27f57')
for x,y in [(270,198),(251,84),(235,151),(199,222),(160,238)]:
 rect(d,(x-6,y-10,x+7,y+2),'#d9b48d');poly(d,[(x-8,y-10),(x,y-18),(x+9,y-10)],'#965c5b')
# trees in panorama corners (not geographic claims)
for x,y in [(88,49),(62,90),(388,79),(411,196)]:circle(d,x,y,16,'#5ba2ad')
save(im,'england_map')
# London city map geographic stylization River Thames west-east goes top? Westminster west of Globe & Tower Bridge; Thames traverses west-to-east
im,d=Image.new('RGB',(W,H),'#79b67b'),None;d=ImageDraw.Draw(im)
for y in range(H):line(d,[(0,y),(480,y)],(int(114+y*.035),int(178+y*.06),int(113+y*.04)))
# neighborhoods + blocks
for i in range(190):
 x=random.randrange(10,470);y=random.randrange(12,256)
 if random.random()<.65:
  rect(d,(x,y,x+random.randrange(6,16),y+random.randrange(5,12)),random.choice(['#d7bf9a','#dbad90','#e4ceb0','#8aab89']))
# Thames west->east, through Westminster to bankside Globe and Tower Bridge
river=[(0,180),(70,190),(120,184),(163,164),(215,157),(268,176),(316,182),(362,166),(414,150),(480,170)]
line(d,river,'#ebdca7',34);line(d,river,'#4c9abc',30);line(d,river,'#77cbe0',19)
# site locations roughly Camden (N), buckingham west, Westminster west bank N, Eye South river, museum center N, globe south of central Thames, Tower Bridge east
# trees / parks
for x,y in [(44,108),(61,114),(81,87),(101,112),(129,42),(160,76),(194,35),(330,41),(440,82),(370,229),(65,229)]:tree(d,x,y)
# Buckingham west upper
building(d,30,133,67,42,'#e7c68c','#cfa678')
# Westminster northern river
clocktower(d,122,170)
# London eye southern river
ferris(d,198,218,29)
# British museum center north
rect(d,(223,75,284,106),'#ead6ad');poly(d,[(220,76),(254,56),(286,76)],'#c6a17d')
for x in range(231,282,10):rect(d,(x,81,x+4,103),'#fff0bf')
# Camden market north center/west
for x in (124,142,160):rect(d,(x,30,x+14,59),'#ce8a73');poly(d,[(x-3,32),(x+7,23),(x+17,32)],'#d95e63')
# Globe south east
circle(d,318,221,32,'#794a37');circle(d,318,221,25,'#e3c799');circle(d,318,221,13,'#814e39')
# Tower Bridge east (two towers straddle crossing over the river)
rect(d,(403,113,414,178),'#8baea1');rect(d,(397,122,421,131),'#d8bd86');rect(d,(399,157,419,168),'#d8bd86')
# road path icons
for x,y in [(82,124),(133,149),(191,217),(255,91),(318,216),(408,146),(146,42)]:circle(d,x,y,5,'#ffe69b');circle(d,x,y,3,'#be684c')
save(im,'london_map')
# flag of England stand-alone art exactly red cross on white
im=Image.new('RGB',(200,120),'#ffffff');d=ImageDraw.Draw(im);rect(d,(0,47,200,73),'#c8102e');rect(d,(86,0,114,120),'#c8102e');im.save(os.path.join(ROOT,'assets','england_flag.png'))
# avatars portraits with real custom pixel drawing, not emoji
skins=['#e9b38c','#ae6e4d','#a97758','#e1aa83'];hair=['#573d36','#282f40','#342e4a','#c78b44'];tops=['#2b978e','#d46e78','#865fb0','#4687bd']
for i in range(4):
 im=Image.new('RGBA',(48,48),(0,0,0,0));d=ImageDraw.Draw(im)
 rect(d,(6,40,43,48),'#324b64');poly(d,[(10,48),(12,30),(20,26),(32,26),(39,35),(43,48)],tops[i]);rect(d,(22,27,28,35),skins[i]);
 circle(d,25,19,14,hair[i]);rect(d,(12,12,38,28),hair[i]);rect(d,(15,17,36,30),skins[i]);
 if i==1:
  circle(d,12,19,7,hair[i]);circle(d,37,20,7,hair[i])
 if i==2:
  for x,y in [(10,10),(17,6),(32,7),(40,13),(7,20),(41,22)]:circle(d,x,y,6,hair[i])
 if i==3:poly(d,[(10,17),(14,8),(24,5),(38,11),(35,19),(28,16),(21,19),(15,16)],hair[i])
 rect(d,(19,21,21,22),'#27324b');rect(d,(30,21,32,22),'#27324b');rect(d,(24,27,28,28),'#b66b65');rect(d,(14,34,18,45),'#e4b76d')
 save(im,f'avatar{i+1}','avatars',4)
# cards 24 individual scenes - subject-specific artwork not repeated as same cropped image
subjects=['england','london','uk','westminster','tower','palace','eye','camden','pound','canal','coins','museum','roman','industry','globe','shakespeare','theatre','york','bath','lakes','rail','flag','actor','traveler']
def themed_icon(d,subject):
 if subject in ('england','uk','flag'):
  rect(d,(55,44,121,87),'#ffffff');rect(d,(55,70,121,77),'#c8102e');rect(d,(84,44,93,87),'#c8102e');line(d,[(57,88),(57,130)],'#805c49',4)
  if subject=='uk':
   # Four constituent nations: use four connected heraldic-free tiles instead of an approximate Union Flag.
   rect(d,(39,46,131,124),'#1c3853')
   for j,col in enumerate(['#8ab888','#dbad6d','#7c9bbd','#d4b48d']):
    xx=45+(j%2)*42;yy=51+(j//2)*33
    rect(d,(xx,yy,xx+34,yy+26),col);circle(d,xx+17,yy+13,7,'#e9e2cc')
   line(d,[(45,128),(130,128)],'#f2de9e',3)
 elif subject in ('london','westminster'):clocktower(d,67,158)
 elif subject=='tower':bridge(d,24,143)
 elif subject=='palace':building(d,36,147,104,72,'#dcc18a','#9d7964')
 elif subject=='eye':ferris(d,83,100,46)
 elif subject in ('camden','canal'): 
  for x in (31,80,129):house(d,x,142,38,39)
  if subject=='canal':rect(d,(20,150,160,188),'#389ebc')
 elif subject in ('pound','coins'):
  for x,y,r in [(52,97,25),(112,103,30),(87,71,29)]:circle(d,x,y,r,'#ae8348');circle(d,x,y,r-4,'#f2cf80');circle(d,x,y,r-13,'#c19b52')
 elif subject=='roman':
  for x in range(33,160,25):rect(d,(x,65,x+12,147),'#dfc49c');rect(d,(x-3,63,x+15,69),'#a98872')
 elif subject=='industry':
  for x in (29,66,114):rect(d,(x,65,x+19,147),'#a4755c');rect(d,(x+5,43,x+13,64),'#79534d')
  for x in (36,81,129):circle(d,x,29,12,'#ddd2bd')
 elif subject in ('globe','theatre','actor','shakespeare'):
  poly(d,[(30,139),(40,65),(89,42),(139,65),(150,139)],'#d7b285');poly(d,[(24,67),(89,26),(157,67)],'#7b5550');rect(d,(54,82,119,138),'#543a4b')
  if subject=='shakespeare':person(d,88,123,scale=3)
 elif subject=='york':building(d,32,148,107,80,'#c3b79e','#605c75')
 elif subject=='bath':
  for x in range(27,155,18):rect(d,(x,70,x+8,147),'#e4d1a6');rect(d,(x-3,66,x+12,71),'#d7b98f')
 elif subject=='lakes':
  poly(d,[(18,128),(60,58),(87,104),(119,49),(163,139)],'#638c83');rect(d,(20,139,162,189),'#469cbd')
 elif subject=='rail':
  rect(d,(31,103,146,146),'#c34845');rect(d,(41,108,136,132),'#ffe8a1');
  for x in (51,118):circle(d,x,146,10,'#31465c')
 else:person(d,89,125,scale=3)
for i,subject in enumerate(subjects):
 im=Image.new('RGB',(178,210),'#14253b');d=ImageDraw.Draw(im)
 bg=random.choice(['#41638a','#537e84','#745d7f','#7d877a','#bc8d65'])
 rect(d,(5,5,173,205),bg)
 for y in range(12,205):
  if y%4==0:line(d,[(11,y),(168,y)],'#ffffff25' if False else random.choice(['#496a85','#567e87','#768a84']),1)
 circle(d,137,45,20,'#ffdb91')
 themed_icon(d,subject)
 for i2 in range(7):
  x=random.randrange(14,160);y=random.randrange(151,197);rect(d,(x,y,x+3,y+3),'#f5c77b')
 rect(d,(4,4,173,11),'#efc679');rect(d,(4,201,173,209),'#b98557');rect(d,(4,4,10,209),'#d5b073');rect(d,(169,4,175,209),'#d5b073')
 save(im,f'card{i:02d}','cards',2)
print('generated')
