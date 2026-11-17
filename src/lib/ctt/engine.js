import {FABRICS, SYMBOL_BY_ID, STANDARDS} from './catalog';

export const ALLOWED_GROUPS = Object.freeze(['wash','bleach','tumble','natural','iron','dryclean','wetclean']);
export const MAX_SELECTIONS = 12;
export const fabricIds = new Set(FABRICS.map(x=>x.id));
export const CARE_CATEGORIES = Object.freeze([
  {id:'wash',label:'Washing',groups:['wash']},
  {id:'bleach',label:'Bleaching',groups:['bleach']},
  {id:'dry',label:'Drying',groups:['tumble','natural']},
  {id:'iron',label:'Ironing',groups:['iron']},
  {id:'professional',label:'Professional care',groups:['dryclean','wetclean']}
]);
export const CATEGORY_STATES = Object.freeze(['absent','unreadable']);
export function normalizeCategoryStates(value) {
  const out={};
  if(!value||typeof value!=='object'||Array.isArray(value))return out;
  for(const category of CARE_CATEGORIES) {
    if(CATEGORY_STATES.includes(value[category.id]))out[category.id]=value[category.id];
  }
  return out;
}

/** Preserve known selections only; never trust IDs or the standard from URL/localStorage. */
export function normalizeSelection(value, standard='iso') {
  const out = [];
  for(const id of (Array.isArray(value)?value:[])) {
    const symbol = SYMBOL_BY_ID.get(id);
    if(!symbol || symbol.standard!==standard || out.includes(id)) continue;
    if(symbol.group!=='extras' && out.some(existing=>{
      const prev=SYMBOL_BY_ID.get(existing);
      if(prev.group!==symbol.group)return false;
      if(!!prev.glyph.modifier===!!symbol.glyph.modifier)return true;
      if([prev.glyph.mode,symbol.glyph.mode].includes('none') || [prev.glyph.heat,symbol.glyph.heat].includes('none'))return true;
      if(symbol.group==='wash' && [prev.glyph.mode,symbol.glyph.mode].includes('hand'))return true;
      return false;
    })) continue;
    if(out.length>=MAX_SELECTIONS) break;
    out.push(id);
  }
  return out;
}
export function toggleSymbol(selection, id, standard) {
  const symbol = SYMBOL_BY_ID.get(id);
  if(!symbol || symbol.standard!==standard) return normalizeSelection(selection,standard);
  const current = normalizeSelection(selection,standard);
  if(current.includes(id)) return current.filter(s=>s!==id);
  const withoutSameGroup = symbol.group==='extras'?current:current.filter(id=>{
    const prev=SYMBOL_BY_ID.get(id);
    if(prev.group!==symbol.group)return true;
    if(!!prev.glyph.modifier===!!symbol.glyph.modifier)return false;
    // A no-wash, do-not-tumble or do-not-iron mark cannot coexist with a cycle/steam modifier.
    if(symbol.glyph.mode==='none'||prev.glyph.mode==='none'||symbol.glyph.heat==='none'||prev.glyph.heat==='none')return false;
    // Hand washing and a machine-wash modifier also cannot coexist.
    if((symbol.group==='wash')&&(symbol.glyph.mode==='hand'||prev.glyph.mode==='hand'))return false;
    return true;
  });
  return withoutSameGroup.length>=MAX_SELECTIONS?withoutSameGroup:[...withoutSameGroup,id];
}
const byGroup = (symbols,group) => symbols.find(s=>s.group===group);
const desc = s=>s?.meaning??'';
function shortWash(s) {
  if(!s) return '';
  const g=s.glyph;
  if(g.mode==='none') return 'Do not wash';
  if(g.mode==='hand') return g.ambient?'Hand wash at ambient temperature (about 20–30°C)':g.temp?`Hand wash at up to ${g.temp}°C`:'Hand wash gently';
  if(g.mode==='machine') {
    const cycle=g.bars===2?'very gentle':g.bars===1?'mild':'normal';
    return g.temp?`Machine wash at up to ${g.temp}°C on a ${cycle} cycle`:`Machine wash on a ${cycle==='normal'?'normal':cycle} cycle (temperature unspecified)`;
  }
  return desc(s).replace(/\.$/,'');
}
function shortBleach(s) {
  if(!s) return '';
  return s.glyph.mode==='none'?'Do not bleach':s.glyph.mode==='oxygen'?'Use only non-chlorine bleach if needed':'Bleach allowed if needed';
}
function shortTumble(s) {
  if(!s) return '';
  const heat=s.glyph.heat;
  return heat==='none'?'Do not tumble dry':heat==='no-heat'?'Tumble dry on air-only / no heat':
    heat==='low'?'Tumble dry on low heat':heat==='medium'?'Tumble dry on medium heat':heat==='high'?'Tumble dry on high heat':
    s.glyph.bars===2?'Tumble dry on a gentle cycle':s.glyph.bars===1?'Tumble dry on permanent press':
    heat==='normal'?'Tumble dry at normal heat':'Tumble dry (heat unspecified)';
}
function shortNatural(s) {
  if(!s) return '';
  const g=s.glyph;
  const base=g.mode==='line'?'Line dry':g.mode==='drip-line'?'Drip line dry (without spinning)':g.mode==='flat'?'Dry flat':'Drip dry flat (without spinning)';
  return base+(g.shade?' in shade':'');
}
function shortIron(s,standard) {
  if(!s) return '';
  const g=s.glyph;
  if(g.mode==='none') return 'Do not iron';
  if(g.mode==='no-steam') return g.temp?`Iron at no more than ${g.temp}°C without steam`:'Do not use steam (iron heat not specified)';
  return `Iron at up to ${g.temp}°C`;
}
function shortPro(s) {
  if(!s) return '';
  if(s.glyph.mode==='none') return s.group==='wetclean'?'No professional wet cleaning':'No professional dry cleaning';
  const prefix=s.group==='wetclean'?'Professional wet cleaning':'Professional dry cleaning';
  return `${prefix} ${s.glyph.letter} permitted${s.glyph.bars===2?' (very mild)':s.glyph.bars===1?' (mild)':''}`;
}
const cautionForFiber = {
  wool: {
    title:'Wool / cashmere',
    message:'Wool knits can felt or lose shape with excess friction and heat. A flat drying surface is often helpful, unless the actual care label directs otherwise.',
    source:'Woolmark'
  },
  silk:{title:'Silk',message:'Silk dyes and finishes can be sensitive to water, friction and high heat. Follow the finished garment’s label, not generic silk advice.',source:'Fabric guidance'},
  linen:{title:'Linen',message:'Some linen garments shrink or crease with heat; follow the label and smooth gently when allowed.',source:'Fabric guidance'},
  cotton:{title:'Cotton',message:'Cotton garments may shrink or bleed dye. Read the maximum treatment on the label rather than assuming hot washing is suitable.',source:'Fabric guidance'},
  denim:{title:'Denim',message:'Denim colours can fade with abrasion or repeated hot washing. Separate colours and follow the actual label.',source:'Fabric guidance'},
  activewear:{title:'Stretch / activewear',message:'Elastane, bonded details and technical finishes can be heat-sensitive; the complete garment label sets the safe process.',source:'Fabric guidance'},
  polyester:{title:'Polyester / nylon',message:'Synthetic fibres and heat-applied graphics can be damaged by excessive heat. Follow the ironing and drying limits on the label.',source:'Fabric guidance'},
  viscose:{title:'Viscose / rayon',message:'Some viscose fabrics are weaker and prone to distortion when wet. Avoid aggressive wringing and use the specified cycle.',source:'Fabric guidance'},
  blend:{title:'Blends / trims',message:'The printed care label applies to the whole article, including lining, trims, dyes and finishes — not just the main fabric.',source:'GINETEX'}
};

export function decodeCare(ids=[],standard='iso',fabric='unknown',categoryStates={}) {
  const safeStandard=STANDARDS[standard]?standard:'iso';
  const chosen=normalizeSelection(ids,safeStandard).map(id=>SYMBOL_BY_ID.get(id));
  const requestedStates=normalizeCategoryStates(categoryStates);
  const washBase=chosen.find(s=>s.group==='wash'&&!s.glyph.modifier);
  const washModifier=chosen.find(s=>s.group==='wash'&&s.glyph.modifier);
  const wash=washBase||washModifier,bleach=byGroup(chosen,'bleach');
  const tumbleBase=chosen.find(s=>s.group==='tumble'&&!s.glyph.modifier);
  const tumbleModifier=chosen.find(s=>s.group==='tumble'&&s.glyph.modifier);
  const tumble=tumbleBase||tumbleModifier,natural=byGroup(chosen,'natural');
  const ironBase=chosen.find(s=>s.group==='iron'&&!s.glyph.modifier);
  const ironModifier=chosen.find(s=>s.group==='iron'&&s.glyph.modifier);
  const iron=ironBase||ironModifier,dryclean=byGroup(chosen,'dryclean'),wetclean=byGroup(chosen,'wetclean');
  const extra=chosen.filter(s=>s.group==='extras');
  const phrases=[];
  const details=[];
  const addPhrase=(group,label,text,symbol)=>{phrases.push(text);details.push({group,label,text,symbolId:symbol?.id||null});};
  if(wash){
    let washPhrase=shortWash(wash);
    if(washBase?.glyph.mode==='machine'&&washModifier){
      washPhrase=washBase.glyph.temp?`Machine wash at up to ${washBase.glyph.temp}°C on a ${washModifier.glyph.bars===2?'gentle':'permanent-press'} cycle`:
        shortWash(washModifier);
    }
    addPhrase('wash','Washing',washPhrase,washBase||washModifier);
  }
  if(bleach) addPhrase('bleach','Bleaching',shortBleach(bleach),bleach);
  if(tumble){
    if(tumbleBase)addPhrase('tumble','Machine drying',shortTumble(tumbleBase),tumbleBase);
    if(tumbleModifier)addPhrase('tumble','Dryer cycle',tumbleModifier.glyph.bars===2?'Use a delicate/gentle tumble-dry cycle':'Use a permanent-press tumble-dry cycle',tumbleModifier);
  }
  if(natural) addPhrase('natural','Air drying',shortNatural(natural),natural);
  if(ironBase) addPhrase('iron','Ironing',shortIron(ironBase,safeStandard),ironBase);
  if(ironModifier) addPhrase('iron','Steam restriction','Do not use steam',ironModifier);
  if(dryclean) addPhrase('dryclean','Dry cleaning',shortPro(dryclean),dryclean);
  if(wetclean) addPhrase('wetclean','Wet cleaning',shortPro(wetclean),wetclean);
  for(const item of extra) {
    if(item.glyph.mode==='no-wring') addPhrase('extras','Extra caution','Do not wring',item);
    if(item.glyph.mode==='no-dry') addPhrase('extras','Extra caution','Do not dry; check the full printed label',item);
  }
  const sentence=phrases.length?phrases.join('; ').replace(/^./,c=>c.toUpperCase())+'.':'';
  const categoryMap={wash,bleach,dry:tumble||natural,iron:ironBase,professional:dryclean||wetclean};
  const provided=CARE_CATEGORIES.filter(c=>!!categoryMap[c.id]).map(c=>c.id);
  const absent=CARE_CATEGORIES.filter(c=>!categoryMap[c.id]&&requestedStates[c.id]==='absent').map(c=>c.id);
  const unreadable=CARE_CATEGORIES.filter(c=>!categoryMap[c.id]&&requestedStates[c.id]==='unreadable').map(c=>c.id);
  const missing=CARE_CATEGORIES.filter(c=>!categoryMap[c.id]&&!requestedStates[c.id]).map(c=>c.id);
  const states=Object.fromEntries(CARE_CATEGORIES.map(c=>[c.id,categoryMap[c.id]?'provided':requestedStates[c.id]||'unknown']));
  const risks=[];
  const pushRisk=(title,message,level='caution')=>{ if(message&&!risks.some(x=>x.message===message)) risks.push({title,message,level}); };
  if(wash?.glyph.mode==='none') pushRisk('Do not wash means do not wash',wash.risk,'important');
  if(bleach?.glyph.mode==='none') pushRisk('Skip every kind of bleach',bleach.risk,'important');
  if(bleach?.glyph.mode==='oxygen') pushRisk('No chlorine bleach',bleach.risk,'important');
  if(tumble?.glyph.heat==='none') pushRisk('Keep it out of the dryer',tumble.risk,'important');
  if(tumble?.glyph.heat==='no-heat') pushRisk('No dryer heat',tumble.risk,'important');
  if(iron?.glyph.mode==='none') pushRisk('Do not iron',iron.risk,'important');
  if(iron?.glyph.mode==='no-steam'||ironModifier) pushRisk('Steam restriction',(ironModifier||iron).risk,'important');
  if(dryclean?.glyph.mode==='none') pushRisk('Do not dry clean',dryclean.risk,'important');
  if(wetclean?.glyph.mode==='none') pushRisk('No professional wet cleaning',wetclean.risk,'important');
  if(natural?.glyph.mode.includes('drip')) pushRisk('Avoid spin extraction','A drip-drying mark means the garment should not be spin-extracted before drying.');
  if(natural?.glyph.shade) pushRisk('Keep out of direct sun','The shade line means dry out of direct sunlight.');
  if(natural?.glyph.mode==='flat') pushRisk('Support the garment while drying','Hanging a wet article marked “dry flat” can pull it out of shape.');
  if(wash?.glyph.mode==='machine' && (wash.glyph.bars===2||washModifier?.glyph.bars===2)) pushRisk('Very gentle means very gentle','Use substantially reduced agitation; a regular wash cycle does not match this mark.');
  if(wash && tumble && wash.glyph.mode==='none'&&tumble.glyph.heat!=='none') pushRisk('Double-check your tag','“Do not wash” next to a tumble-dry permission is unusual. Check that both symbols belong to the same garment.','check');
  if(extra.some(s=>s.glyph.mode==='no-dry') && (tumble?.glyph.heat!=='none'&&!!tumble || !!natural)) pushRisk('Possible conflicting marks','A “do not dry” warning appears with another drying instruction. Recheck the original label.','check');
  let fibreNote = fabricIds.has(fabric)&&fabric!=='unknown'?cautionForFiber[fabric]:null;
  const hasUnspecifiedTemp = !!wash && wash.glyph.mode==='machine' && !washBase?.glyph.temp;
  const notices=[];
  if(hasUnspecifiedTemp) notices.push('The selected wash-cycle mark does not specify water temperature. Check for dots or written instructions.');
  if(ironModifier&&!ironBase) notices.push('A “no steam” mark does not specify whether ironing is allowed or its maximum temperature; inspect the remaining tag.');
  if(tumbleModifier&&!tumbleBase) notices.push('The chosen dryer-cycle mark does not specify a heat setting; consult the complete label.');
  if(!tumble&&!natural&&chosen.length&&!requestedStates.dry) notices.push('No drying method entered. This guide does not assume the garment is dryer-safe.');
  if(unreadable.length) notices.push(`Unreadable: ${unreadable.map(id=>CARE_CATEGORIES.find(c=>c.id===id).label).join(', ')}. No instruction is inferred for ${unreadable.length===1?'this category':'these categories'}.`);
  if(absent.length) notices.push(`Marked not on the label: ${absent.map(id=>CARE_CATEGORIES.find(c=>c.id===id).label).join(', ')}. Absence is not treated as permission.`);
  if(!chosen.length) notices.push('Pick the marks you can see. Nothing is inferred from unselected symbols.');
  return {
    standard:safeStandard,selected:chosen,count:chosen.length,sentence,
    fragments:phrases,details,missing,provided,absent,unreadable,states,risks,notices,fibreNote,
    coverage:provided.length,
    groups:{wash,bleach,tumble,natural,iron,dryclean,wetclean}
  };
}
export function serializeShare(ids,standard,fabric,categoryStates={}) {
  const safeStandard=STANDARDS[standard]?standard:'iso';
  const safeFabric=fabricIds.has(fabric)?fabric:'unknown';
  const params=new URLSearchParams();
  params.set('system',safeStandard);
  const clean=normalizeSelection(ids,safeStandard);
  if(clean.length) params.set('symbols',clean.join(','));
  if(safeFabric!=='unknown') params.set('fabric',safeFabric);
  const states=normalizeCategoryStates(categoryStates);
  const absent=CARE_CATEGORIES.filter(c=>states[c.id]==='absent').map(c=>c.id);
  const unreadable=CARE_CATEGORIES.filter(c=>states[c.id]==='unreadable').map(c=>c.id);
  if(absent.length)params.set('absent',absent.join(','));
  if(unreadable.length)params.set('unreadable',unreadable.join(','));
  return params;
}
export function parseShare(search) {
  let params;
  try { params=new URLSearchParams(String(search||'').replace(/^\?/,'')); }
  catch { return null; }
  const legacy=!params.has('system')&&!params.has('symbols')&&(params.has('std')||params.has('s')||params.has('f'));
  if(!legacy&&!params.has('system')&&!params.has('symbols')&&!params.has('fabric')&&!params.has('absent')&&!params.has('unreadable')) return null;
  const standardValue=legacy?params.get('std'):params.get('system');
  const standard=STANDARDS[standardValue]?standardValue:'iso';
  const fabricValue=legacy?params.get('f'):params.get('fabric');
  const fabric=fabricIds.has(fabricValue)?fabricValue:'unknown';
  const symbolValue=legacy?params.get('s'):params.get('symbols');
  const selected=normalizeSelection((symbolValue||'').slice(0,400).split(','),standard);
  const requested={};
  for(const id of (params.get('absent')||'').split(','))if(CARE_CATEGORIES.some(c=>c.id===id))requested[id]='absent';
  for(const id of (params.get('unreadable')||'').split(','))if(CARE_CATEGORIES.some(c=>c.id===id))requested[id]='unreadable';
  return {standard,fabric,selected,states:normalizeCategoryStates(requested),demo:params.get('demo')==='1'&&selected.length>0};
}
