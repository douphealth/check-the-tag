/** Device-only garment vault. Validates all stored objects before use. */
import {STANDARDS,FABRICS} from './catalog';
import {normalizeSelection} from './engine';

export const MAX_GARMENTS=24;
const wardrobeAllowedFabrics=new Set(FABRICS.map(f=>f.id));
const cleanName=(value)=>String(value??'').replace(/[\u0000-\u001f\u007f<>]/g,'').trim().slice(0,58);
export function normalizeGarments(value){
  if(!Array.isArray(value))return [];
  const output=[],ids=new Set();
  for(const raw of value.slice(0,100)){
    if(!raw || typeof raw!=='object' || !STANDARDS[raw.standard])continue;
    const name=cleanName(raw.name),id=String(raw.id||'').slice(0,90);
    const selected=normalizeSelection(raw.selected,raw.standard);
    if(!name||!id||ids.has(id)||!selected.length||/[<>]/.test(String(raw.name)))continue;
    ids.add(id);
    const created=typeof raw.created==='string' && /^\d{4}-\d\d-\d\dT/.test(raw.created)?raw.created.slice(0,30):'';
    output.push({id,name,standard:raw.standard,fabric:wardrobeAllowedFabrics.has(raw.fabric)?raw.fabric:'unknown',selected,created});
    if(output.length>=MAX_GARMENTS)break;
  }
  return output;
}
export function addGarment(items,raw){
  const current=normalizeGarments(items);
  const name=cleanName(raw?.name);
  if(!name)return {items:current,error:'Please give this garment a name.'};
  if(current.length>=MAX_GARMENTS)return {items:current,error:`Your local wardrobe holds up to ${MAX_GARMENTS} garments. Remove an older item to add another.`};
  const standard=STANDARDS[raw?.standard]?raw.standard:'iso';
  const selected=normalizeSelection(raw?.selected,standard);
  if(!selected.length)return {items:current,error:'Select at least one care symbol first.'};
  const item={id:String(raw.id||'').slice(0,90),name,standard,fabric:wardrobeAllowedFabrics.has(raw.fabric)?raw.fabric:'unknown',selected,created:String(raw.created||'')};
  if(!item.id)return {items:current,error:'Could not create a garment ID.'};
  return {items:normalizeGarments([item,...current.filter(x=>x.id!==item.id)]),error:null};
}
export const removeGarment=(items,id)=>normalizeGarments(items).filter(x=>x.id!==id);
