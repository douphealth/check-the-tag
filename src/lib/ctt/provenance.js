/** Editorial source-check ledger; no independent or professional certification is claimed. */
export const LAST_REVIEWED='2026-11-01';
export const SOURCES=Object.freeze({
  iso:{name:'ISO 3758:2023',edition:'4th edition · December 2023',authority:'International Organization for Standardization',url:'https://www.iso.org/standard/74401.html',note:'Authoritative publication and scope; complete standard may require purchase.'},
  ginetex:{name:'GINETEX symbol guide',edition:'Public descriptions for ISO 3758:2023',authority:'GINETEX',url:'https://www.ginetex.net/gb/labelling/care-symbols.asp',note:'Public meanings and treatment limits. Original diagrams here are not a trademark or reproduction-rights clearance.'},
  ftc:{name:'U.S. FTC-hosted ASTM care chart',edition:'Historical ASTM D5489-96c convention',authority:'Federal Trade Commission',url:'https://www.ftc.gov/system/files/documents/rules/care-labeling-textile-wearing-apparel-certain-piece-goods/astm_care_symbols_chart.pdf',note:'Public U.S. reference, not the full content of ASTM D5489-25.'},
  astm:{name:'ASTM D5489-25',edition:'Active 2025 edition (status only)',authority:'ASTM International',url:'https://store.astm.org/d5489-25.html',note:'Current ASTM edition verified. Full paid content has not been licensed or reproduced here.'},
  woolmark:{name:'Woolmark wool drying guidance',edition:'Garment-specific advice',authority:'Woolmark',url:'https://www.woolmark.com/care/how-to-dry-wool/',note:'Supplementary wool guidance; always defer to finished garment label.'},
});
export function referencesFor(standard,fabric='unknown'){
 const ids=standard==='us'?['ftc','astm']:['iso','ginetex'];
 if(fabric==='wool')ids.push('woolmark');
 return ids.map(id=>({id,...SOURCES[id]}));
}
export function referenceForSymbol(symbol){return symbol?.standard==='us'?SOURCES.ftc:SOURCES.ginetex;}
export function reviewAgeDays(now=new Date()){
 const stamp=Date.parse(`${LAST_REVIEWED}T00:00:00Z`);
 return Number.isFinite(now?.getTime?.())?Math.max(0,Math.floor((now.getTime()-stamp)/86400000)):0;
}
