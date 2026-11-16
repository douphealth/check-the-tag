/** Pure, deterministic wash-day grouping; not a guarantee that garments are compatible. */
import {decodeCare} from './engine';
const COLORS={dark:'Darks',light:'Lights & whites',bright:'Bright colours'};
export function classify(item,color){const r=decodeCare(item.selected,item.standard,item.fabric);const wash=r.groups.wash;const hasModifiers=r.selected.filter(x=>x.group==='wash'&&x.glyph.modifier);let reason='';if(!wash)reason='No washing permission on this saved label';else if(wash.glyph.mode==='none')reason='Do not wash';else if(wash.glyph.mode==='hand')reason='Hand wash — not a machine load';else if(wash.glyph.mode!=='machine')reason='Washing method is not clear';else if(!Number.isFinite(wash.glyph.temp))reason='Water temperature is not specified';else if(!COLORS[color])reason='Choose a colour group first';
 const gentle=Math.max(wash?.glyph.bars||0,...hasModifiers.map(x=>x.glyph.bars||0));
 const sensitive=['wool','silk','viscose'].includes(item.fabric)||gentle===2;
 return {item,color,eligible:!reason,reason,limit:wash?.glyph.temp||0,cycle:gentle,kind:sensitive?'delicates':'general',standard:item.standard};}
export function computePlan(items,choices){const rows=items.map(it=>classify(it,choices[it.id]||''));const pending=rows.filter(x=>!x.eligible),valid=rows.filter(x=>x.eligible);const by=new Map();for(const row of valid){const key=`${row.color}|${row.kind}`;if(!by.has(key))by.set(key,[]);by.get(key).push(row);}
 const batches=[...by.entries()].map(([key,group])=>({key,colour:COLORS[group[0].color],kind:group[0].kind,maxTemp:Math.min(...group.map(x=>x.limit)),cycle:Math.max(...group.map(x=>x.cycle)),items:group.map(x=>x.item.name),limits:group.map(x=>x.limit)}));return {pending,batches,total:items.length,ready:valid.length};}
