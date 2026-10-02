import pickle,collections,json,re,os
a=pickle.load(open('places.pkl','rb'))
G={}
def put(g,*bcs):
    for b in bcs: G[b]=g
put('r','restaurant','fast_food_restaurant','food_truck_stand')
put('b','bar','lounge')
put('n','dance_club','nightlife_venue','music_venue')
put('c','cafe','coffee_shop','smoothie_juice_bar','non_alcoholic_beverage_venue')
put('h','hotel','bed_and_breakfast','lodging')
put('a','museum','art_gallery','historic_site','monument','theatre_venue','performing_arts_venue','movie_theater','arts_and_entertainment','cultural_center','park','gaming_venue','stadium_arena','public_plaza','playground','event_venue','library','garden','zoo','aquarium','amusement_park','landmark_and_historical_building','tour_operator','botanical_garden','observatory')
put('s','gym','sport_or_fitness_facility','fitness_studio','sports_and_recreation','sport_or_recreation_club','swimming_pool','sports_club_and_league','recreational_equipment_rental')
CASUAL_R={'tapas_bar','gastropub','diner','bistro','fondue_restaurant','friterie','flatbread_shop','bagel_shop','sandwich_shop','delicatessen'}
CASUAL_C={'bakery','ice_cream_shop','dessert_shop','chocolatier','gelato_shop','donut_shop','cupcake_shop','frozen_yogurt_shop','pie_shop','macaron_shop','candy_store','pretzel_shop','japanese_confectionery_shop'}
SCHOOL={'music_school','art_school','cooking_school','drama_school','photography_class','sports_school','circus_school','bartending_school','language_school','specialty_school'}
WELL={'spa','day_spa','massage_therapy','health_spa','sauna','public_bath_house','meditation_center','onsen','float_spa','hammam'}
DIET=[('kosher','casher'),('jewish','casher'),('halal','halal'),('vegan','vegan'),('vegetarian','vegetarien'),('gluten','sans-gluten')]
KW=[(re.compile(r'\b(kosher|casher|cacher|koscher|kasher|glatt|beth din)\b',re.I),'casher'),(re.compile(r'\bhalal\b',re.I),'halal'),(re.compile(r'\bvegan|végan',re.I),'vegan')]
GENERIC={'restaurant','hotel','htel','bar','cafe','caf','pizzeria','brasserie','boulangerie','pub','spa','gym','restaurante','ristorante','hostel','museum','park','parc','bistro','bistrot','snack','kebab','sushi','pizza','coffee','coffeeshop','bakery','bckerei','hotelrestaurant'}
out=collections.defaultdict(list); seen=set(); types=collections.Counter()
for r in a:
    if r['operating_status']=='permanently_closed': continue
    nm=(r['names'] or {}).get('primary')
    if not nm: continue
    if re.sub(r'[^a-z]','',nm.lower()) in GENERIC: continue
    bc=r['basic_category']; tx=r['taxonomy'] or {}; pr=tx.get('primary') or bc
    alts=tx.get('alternates') or []
    g=G.get(bc)
    if bc=='casual_eatery': g='r' if pr in CASUAL_R else ('c' if pr in CASUAL_C else None)
    if bc=='specialty_school' and pr in SCHOOL: g='k'
    if bc in('wellness_service','personal_or_beauty_service') and pr in WELL: g='w'
    if bc=='sport_or_fitness_facility' and pr=='dance_studio': g='k'
    if bc=='shopping_mall' or bc=='department_store': g='a'
    if not g: continue
    conf=r['confidence'] or 0
    if conf<(0.4 if g=='h' else 0.5): continue
    key=(r['city'],nm.lower().strip(),round(r['y'],3),round(r['x'],3))
    if key in seen: continue
    seen.add(key)
    ad=(r['addresses'] or [{}])[0] or {}
    addr=ad.get('freeform') or ''
    pc=ad.get('postcode') or ''
    tags=set()
    for t in [pr]+alts:
        for k,v in DIET:
            if t and k in t: tags.add(v)
    for rx,v in KW:
        if rx.search(nm): tags.add(v)
    web=(r['websites'] or [None])[0] or ''
    web=re.sub(r'^https?://(www\.)?','',web).rstrip('/') if len(web)<120 else ''
    soc=''
    if not web:
        for s in r['socials'] or []:
            if 'instagram' in s or 'facebook' in s: soc=s;break
    ph=(r['phones'] or [''])[0] or ''
    types[pr]+=1
    out[r['city']].append([nm,g,pr,round(r['y'],5),round(r['x'],5),addr,pc,web or soc,ph,','.join(sorted(tags))])
os.makedirs('dir',exist_ok=True)
for c,L in out.items():
    tl=sorted({e[2] for e in L}); ti={t:i for i,t in enumerate(tl)}
    rows=[[e[0],e[1],ti[e[2]],e[3],e[4],e[5],e[6],e[7],e[8],e[9]] for e in L]
    rows.sort(key=lambda e:(e[1],e[0].lower()))
    s=json.dumps({"v":1,"city":c,"types":tl,"rows":rows},ensure_ascii=False,separators=(',',':'))
    s=s.replace('\ufffd','')
    open(f'dir/{c}.json','w').write(s)
    cnt=collections.Counter(e[1] for e in L)
    print(c,len(L),f"{len(s)/1e6:.1f}MB",dict(cnt),'casher',sum('casher' in e[9] for e in L))
json.dump(sorted(types),open('alltypes.json','w'))
print(len(types))
