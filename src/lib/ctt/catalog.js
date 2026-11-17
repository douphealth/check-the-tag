/**
 * Check The Tag — editorial symbol interpretation data.
 * Reference systems: ISO 3758:2023 / GINETEX descriptions, and the FTC-hosted
 * ASTM Guide to Care Symbols (US).  These are plain-language descriptions and
 * original instructional diagrams, NOT official licensed care-mark artwork.
 * Checked: 2026-10-31. See SOURCES.md for source links and use limitations.
 */
export const STANDARDS = Object.freeze({
  iso: { short: 'International', name: 'ISO 3758:2023', region: 'International care labels', ironing: [120,160,210] },
  us: { short: 'United States', name: 'FTC / ASTM D5489-96c', region: 'U.S. care labels', ironing: [110,150,200] }
});
export const STEPS = Object.freeze([
  {id:'wash', label:'Washing', short:'Wash', number:'01', caption:'Tub marks tell you how warm and how gentle.'},
  {id:'bleach', label:'Bleaching', short:'Bleach', number:'02', caption:'The triangle governs bleach — including chlorine.'},
  {id:'dry', label:'Drying', short:'Dry', number:'03', caption:'Choose each drying method shown. Tumble and air drying are separate subcategories.'},
  {id:'iron', label:'Ironing', short:'Iron', number:'04', caption:'Dots set the maximum soleplate temperature.'},
  {id:'professional', label:'Professional care', short:'Pro care', number:'05', caption:'Dry cleaning and wet cleaning are separate; select both if both appear.'},
  {id:'extras', label:'Optional extra warnings', short:'Extras', number:'+', caption:'Optional U.S. warnings are not part of the five-category progress count.'}
]);
export const FABRICS = Object.freeze([
  {id:'unknown', title:'Not sure', hint:'Read the tag only'},
  {id:'wool', title:'Wool / cashmere', hint:'Felting and shape'},
  {id:'silk', title:'Silk', hint:'Dyes and finishes'},
  {id:'linen', title:'Linen', hint:'Shrinkage and creases'},
  {id:'cotton', title:'Cotton', hint:'Shrinkage and colour'},
  {id:'denim', title:'Denim', hint:'Colour and abrasion'},
  {id:'activewear', title:'Stretch / activewear', hint:'Heat and elasticity'},
  {id:'polyester', title:'Polyester / nylon', hint:'Heat sensitivity'},
  {id:'viscose', title:'Viscose / rayon', hint:'Wet distortion'},
  {id:'blend', title:'Blends / trims', hint:'Most fragile component'}
]);

const data = [];
const put = (standard, group, key, title, meaning, config={}, risk='') => {
  data.push(Object.freeze({ id:`${standard}-${group}-${key}`, standard, group, title, meaning, risk,
    glyph: Object.freeze({type:group,...config}) }));
};
const tempRisk = 'Hotter washing or stronger agitation than the label allows may change size, colour or finish.';
const washModes = [
  [30,'normal'],[30,'mild'],[30,'very-mild'],[40,'normal'],[40,'mild'],[40,'very-mild'],
  [60,'normal'],[60,'mild'],[70,'normal'],[95,'normal']
];
for(const [temp,cycle] of washModes) {
  const cycleLabel = cycle === 'normal' ? 'normal cycle' : cycle === 'mild' ? 'mild cycle' : 'very mild cycle';
  const bars = cycle === 'normal'?0:cycle === 'mild'?1:2;
  put('iso','wash',`${temp}-${cycle}`,`${temp}°C · ${cycleLabel}`,`Machine wash at no more than ${temp}°C on a ${cycleLabel}.`,{mode:'machine',temp,bars},tempRisk);
}
put('iso','wash','hand-40','Hand wash · up to 40°C','Hand wash gently in water no warmer than 40°C; do not rub or wring.',{mode:'hand',temp:40},'Machine washing or forceful wringing may damage a hand-wash-only article.');
put('iso','wash','hand-ambient','Hand wash · ambient','Hand wash gently at ambient water temperature, about 20–30°C; do not rub or wring.',{mode:'hand',ambient:true},'Using hot water or machine agitation may damage a delicate article.');
put('iso','wash','none','Do not wash','Do not wash the article at home; inspect any professional-care instructions.',{mode:'none'},'Domestic washing may permanently distort, shrink or otherwise damage the item.');

for(const std of ['iso','us']) {
  put(std,'bleach','any','Any bleach allowed','Chlorine or non-chlorine bleach may be used when needed and suitable for the garment.',{mode:'any'},'Bleach is optional, not required; follow the product directions and test colourfastness when appropriate.');
  put(std,'bleach','oxygen','Oxygen / non-chlorine only','Use only non-chlorine (oxygen-based) bleach when needed; do not use chlorine bleach.',{mode:'oxygen'},'Chlorine bleach is not permitted and may harm dyes, fibres or finishes.');
  put(std,'bleach','none','Do not bleach','Do not use bleach, including oxygen-based bleach.',{mode:'none'},'Bleaching may damage the colour, fibres or finish; choose a bleach-free detergent.');
}

for(const [key,title,meaning,config,risk] of [
  ['normal','Tumble dry · normal','Tumble drying is allowed at normal heat (ISO exhaust-air temperature up to 80°C).',{heat:'normal',dots:2},'Do not use a hotter setting than the care label permits.'],
  ['low','Tumble dry · low heat','Tumble dry on a low-heat setting (ISO exhaust-air temperature up to 60°C).',{heat:'low',dots:1},'Excess dryer heat can shrink, distort or weaken sensitive materials.'],
  ['none','Do not tumble dry','Do not place this garment in a tumble dryer.',{heat:'none'},'Tumbling or dryer heat may shrink, warp, weaken or otherwise damage the garment.']
]) put('iso','tumble',key,title,meaning,config,risk);
for(const [key,name,mode,shade] of [
  ['line','Line dry','line',false],['drip-line','Drip line dry','drip-line',false],
  ['flat','Dry flat','flat',false],['drip-flat','Drip dry flat','drip-flat',false],
  ['line-shade','Line dry in shade','line',true],['drip-line-shade','Drip line dry in shade','drip-line',true],
  ['flat-shade','Dry flat in shade','flat',true],['drip-flat-shade','Drip dry flat in shade','drip-flat',true]
]) {
  const phrase = mode==='line'?'Hang the garment to dry':mode==='drip-line'?'Hang wet without spin-extracting':mode==='flat'?'Lay flat to dry':'Lay flat to drip dry without spin-extracting';
  put('iso','natural',key,name,`${phrase}${shade?', out of direct sunlight':''}.`,{mode,shade},
    mode.includes('drip')?'Avoid the spin cycle when the label specifies drip drying.':
    shade?'Direct sunlight can affect colour or finish when shaded drying is specified.':
    mode==='flat'?'Hanging a wet garment marked “dry flat” can stretch it out of shape.':'Follow the exact drying position shown on your label.');
}
for(const [dots,temp] of [[1,120],[2,160],[3,210]]) {
  put('iso','iron',`dots-${dots}`,`${dots} dot${dots>1?'s':''} · max ${temp}°C`,
    `Iron with soleplate temperature no higher than ${temp}°C${dots===1?'; steam may damage some items':''}.`,
    {mode:'heat',dots,temp},'A hotter iron can scorch, glaze, melt or mark fibres and finishes.');
}
put('iso','iron','no-steam','Iron · no steam · 120°C','Iron at no more than 120°C without steam.',{mode:'no-steam',dots:1,temp:120},'Steam may cause irreversible damage to this article.');
put('iso','iron','none','Do not iron','Do not iron or press with a hot iron.',{mode:'none'},'Iron heat or pressure may permanently damage this garment.');
for(const [key,letter,bars,meaning] of [
  ['p','P',0,'Professional dry cleaning with the solvents specified for P is permitted (normal process).'],
  ['p-mild','P',1,'Professional dry cleaning with P-compatible solvents is permitted using a mild process.'],
  ['f','F',0,'Professional dry cleaning with F-compatible hydrocarbon solvents is permitted (normal process).'],
  ['f-mild','F',1,'Professional dry cleaning with F-compatible hydrocarbon solvents is permitted using a mild process.']
]) put('iso','dryclean',key,`${letter} · ${bars?'mild':'normal'} dry cleaning`,meaning,{letter,bars},'Professional-care letters specify solvent classes; do not substitute home washing or solvents.');
put('iso','dryclean','none','Do not dry clean','Do not use professional solvent-based dry cleaning.',{mode:'none'},'Solvent-based cleaning or stain removers may damage this item.');
for(const [key,bars,title,meaning] of [
  ['w',0,'W · wet cleaning','Professional wet cleaning is permitted with a normal process.'],
  ['w-mild',1,'W · mild wet cleaning','Professional wet cleaning is permitted with a mild process.'],
  ['w-very-mild',2,'W · very mild wet cleaning','Professional wet cleaning is permitted with a very mild process.']
]) put('iso','wetclean',key,title,meaning,{letter:'W',bars},'Professional wet cleaning uses specialist methods; it is not the same as machine washing at home.');
put('iso','wetclean','none','Do not wet clean','Do not use a professional wet-cleaning process.',{letter:'W',mode:'none'},'This restriction applies to professional wet cleaning; it does not automatically prohibit every home wash.');

// The American ASTM chart uses dots instead of temperatures in the wash tub.
for(const [dots,temp] of [[1,30],[2,40],[3,50],[4,60],[5,70],[6,95]]) {
  put('us','wash',`dots-${dots}`,`${dots} dot${dots>1?'s':''} · ${temp}°C max`,
    `Machine wash at no more than ${temp}°C (${dots} dot${dots>1?'s':''}, normal cycle).`,
    {mode:'machine',temp,dots,bars:0},tempRisk);
}
put('us','wash','press','One underline · permanent press','Machine wash on permanent-press cycle; temperature is not specified by this standalone mark.',{mode:'machine',bars:1,modifier:true},'Use the gentle-cycle marking, and check any dots or words for the water temperature.');
put('us','wash','gentle','Two underlines · gentle','Machine wash on a delicate/gentle cycle; temperature is not specified by this standalone mark.',{mode:'machine',bars:2,modifier:true},'Avoid normal-cycle agitation when the care tag specifies gentle.');
put('us','wash','hand','Hand wash','Hand wash only, using a gentle action; consult any written temperature instruction.',{mode:'hand'},'Machine washing may damage this hand-wash-only article.');
put('us','wash','none','Do not wash','Do not wash the article; check its dry-cleaning instructions.',{mode:'none'},'Washing may cause irreversible damage to the garment.');
for(const [key,title,meaning,config,risk] of [
  ['any','Tumble dry · any heat','Tumble drying permitted; this marking does not set a specific heat limit.',{heat:'any',dots:0},'Choose the correct programme and follow other text or markings on the label.'],
  ['high','Tumble dry · high','Tumble drying at high heat is permitted.',{heat:'high',dots:3},'High heat can damage certain finishes even where permitted; follow other label instructions.'],
  ['medium','Tumble dry · medium','Tumble dry at medium heat.',{heat:'medium',dots:2},'Do not use high dryer heat when medium is specified.'],
  ['low','Tumble dry · low','Tumble dry at low heat.',{heat:'low',dots:1},'Higher dryer heat can change the fit or damage heat-sensitive fibres.'],
  ['no-heat','Tumble dry · air only','Tumble dry with no heat (air-only setting).',{heat:'no-heat',fill:true},'A heated dryer cycle is not permitted by this mark.'],
  ['press','Tumble dry · permanent press','Use the permanent-press tumble-drying cycle.',{heat:'unspecified',bars:1,modifier:true},'Choose the specified cycle; additional temperature information may also be present.'],
  ['gentle','Tumble dry · gentle','Use the delicate/gentle tumble-drying cycle.',{heat:'unspecified',bars:2,modifier:true},'Do not use normal or high-agitation tumble settings.'],
  ['none','Do not tumble dry','Do not place the article in a tumble dryer.',{heat:'none'},'Dryer tumbling or heat may distort or damage the garment.']
]) put('us','tumble',key,title,meaning,config,risk);
for(const [key,title,mode,shade] of [
  ['line','Line dry','line',false], ['drip','Drip dry','drip-line',false],
  ['flat','Dry flat','flat',false], ['line-shade','Line dry in shade','line',true],
  ['flat-shade','Dry flat in shade','flat',true]
]) put('us','natural',key,title,mode==='line'?`Hang the garment on a line to dry${shade?', out of direct sunlight':''}.`:
    mode==='drip-line'?'Hang to drip dry; do not wring or spin-extract.':`Lay flat to dry${shade?', out of direct sunlight':''}.`,
    {mode,shade},mode==='flat'?'Hanging wet may stretch an item marked “dry flat”.':shade?'Avoid direct sun when the shade mark is present.':'Follow the specified drying process.');
for(const [dots,temp] of [[1,110],[2,150],[3,200]]) {
  put('us','iron',`dots-${dots}`,`${dots} dot${dots>1?'s':''} · max ${temp}°C`,
    `Iron or steam at no more than ${temp}°C.`,{mode:'heat',dots,temp},'Hotter ironing can scorch, melt or permanently mark the article.');
}
put('us','iron','no-steam','Do not steam','Iron only if otherwise allowed by the label; do not use steam.',{mode:'no-steam',steamOnly:true,modifier:true},'Steam can damage fibres or finishes when this restriction is shown.');
put('us','iron','none','Do not iron','Do not iron or use a heated press.',{mode:'none'},'Ironing heat may cause irreversible damage.');
for(const [key,letter,meaning] of [
  ['a','A','Professional dry cleaning with any solvent (older U.S. ASTM designation) is permitted.'],
  ['p','P','Professional dry cleaning using solvents other than trichloroethylene is permitted.'],
  ['f','F','Professional dry cleaning using petroleum solvents is permitted.']
]) put('us','dryclean',key,`${letter} · dry clean`,meaning,{letter},'Professional solvent codes are intended for cleaners, not a DIY solvent choice.');
put('us','dryclean','none','Do not dry clean','Do not use professional solvent-based dry cleaning.',{mode:'none'},'Solvent-based dry cleaning is not permitted.');
put('us','extras','no-wring','Do not wring','Do not twist or wring the wet garment.',{mode:'no-wring'},'Wringing can stretch, distort or damage delicate materials.');
put('us','extras','no-dry','Do not dry','The older U.S. warning indicates do not dry; this is commonly paired with “do not wash.” Confirm the full label wording.',{mode:'no-dry'},'The exact handling depends on the rest of the label; seek professional advice.');

export const SYMBOLS = Object.freeze(data);
export const SYMBOL_BY_ID = new Map(SYMBOLS.map(x=>[x.id,x]));
export const sourceUrls = Object.freeze({
  iso: 'https://www.iso.org/standard/74401.html',
  ginetex: 'https://www.ginetex.net/gb/labelling/care-symbols.asp',
  astm: 'https://www.ftc.gov/system/files/documents/rules/care-labeling-textile-wearing-apparel-certain-piece-goods/astm_care_symbols_chart.pdf',
  woolmark: 'https://www.woolmark.com/care/how-to-dry-wool/',
  licensing: 'https://www.ginetex.net/en/care-labelling/'
});
export function getSymbols(standard, stepId) {
  const groups=stepId==='professional'?['dryclean','wetclean']:stepId==='dry'?['tumble','natural']:[stepId];
  return SYMBOLS.filter(s=>s.standard===standard && groups.includes(s.group));
}
export function getSteps(standard){return STEPS.filter(s=>standard==='us'||s.id!=='extras');}
