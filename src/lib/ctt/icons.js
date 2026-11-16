const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
/** Shared original instructional SVG illustration renderer. Trademark/licensing caveat in /sources/ */
export function iconSvg(symbol,options={}){
  const {glyph:g}=symbol;
  const common=`stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke-width="3.2"`;
  const wrap=contents=>`<svg class="icon-svg" viewBox="0 0 100 100" role="img" aria-label="${escapeHtml(symbol.title)}" xmlns="http://www.w3.org/2000/svg"><g ${common}>${contents}</g></svg>`;
  const cross=(x1=14,y1=11,x2=86,y2=84)=>`<path d="M${x1} ${y1} L${x2} ${y2} M${x2} ${y1} L${x1} ${y2}" stroke-width="3.8"/>`;
  const bars=n=>n?`${Array.from({length:n},(_,i)=>`<path d="M25 ${79+i*7} H75"/>`).join('')}`:'';
  const dots=(n,cx=50,cy=51)=>{
    const coords=n<=3?Array.from({length:n},(_,i)=>[cx+(i-(n-1)/2)*16,cy]):Array.from({length:n},(_,i)=>[cx+(i%3-1)*16,cy+((Math.floor(i/3))-.5)*14]);
    return coords.map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3.7" fill="currentColor" stroke="none"/>`).join('');
  };
  let content='';
  if(g.type==='wash'){
    content=`<path d="M13 23 Q22 18 30 23 Q38 28 47 23 Q56 18 65 23 Q74 28 87 23 L80 65 Q79 69 74 69 H26 Q21 69 20 65 Z"/>`;
    if(g.mode==='none') content+=cross(24,27,76,66);
    else if(g.mode==='hand'){
      content+=`<path d="M52 62 L52 45 Q52 40 55 40 Q58 40 58 44 V34 Q58 30 61 30 Q65 30 65 34 V43 Q67 39 70 41 Q73 43 71 48 L68 59 Q63 68 57 68" stroke-width="2.5"/>`;
      if(g.ambient)content+=`<text x="36" y="54" text-anchor="middle" stroke="none" fill="currentColor" font-size="10" font-weight="800">20–30</text>`;
      else if(g.temp)content+=`<text x="38" y="53" text-anchor="middle" stroke="none" fill="currentColor" font-size="12" font-weight="800">${g.temp}</text>`;
    } else if(g.dots)content+=dots(g.dots,50,48);
    else if(g.temp)content+=`<text x="50" y="54" text-anchor="middle" stroke="none" fill="currentColor" font-family="Arial,sans-serif" font-weight="800" font-size="24">${g.temp}°</text>`;
    content+=bars(g.bars||0);
  }else if(g.type==='bleach'){
    content+=`<path d="M50 14 L88 78 H12 Z"/>`;
    if(g.mode==='none')content+=cross(17,18,83,84);
    if(g.mode==='oxygen')content+=`<path d="M42 66 L59 42 M53 69 L67 49" stroke-width="3.6"/>`;
  }else if(g.type==='tumble'){
    content+=`<rect x="16" y="14" width="68" height="68" rx="1"/><circle cx="50" cy="48" r="24" ${g.fill?'fill="currentColor" stroke="none"':''}/>`;
    if(g.heat==='none')content+=cross(17,12,83,83);
    else if(g.dots)content+=dots(g.dots,50,48);
    content+=bars(g.bars||0);
  }else if(g.type==='natural'){
    content+=`<rect x="16" y="15" width="68" height="68" rx="1"/>`;
    if(g.mode==='line')content+=`<path d="M50 28 V71"/>`;
    if(g.mode==='drip-line')content+=`<path d="M41 28 V71 M59 28 V71"/>`;
    if(g.mode==='flat')content+=`<path d="M27 50 H73"/>`;
    if(g.mode==='drip-flat')content+=`<path d="M27 42 H73 M27 59 H73"/>`;
    if(g.shade)content+=`<path d="M17 38 L40 15" stroke-width="3.5"/>`;
  }else if(g.type==='iron'){
    content+=`<path d="M19 71 Q18 62 22 49 L31 33 Q36 25 48 25 H67 Q75 25 78 32 L84 58 L87 71 Z M20 71 H87"/>`;
    if(g.mode==='none')content+=cross(19,18,82,78);
    else {
      if(g.dots)content+=dots(g.dots,50,56);
      if(g.mode==='no-steam')content+=`<path d="M27 15 Q23 10 29 6 M40 15 Q36 10 42 6" stroke-width="2.7"/><path d="M18 7 L51 19" stroke-width="2.3"/>`;
    }
  }else if(g.type==='dryclean'||g.type==='wetclean'){
    content+=`<circle cx="50" cy="47" r="30"/>`;
    if(g.mode==='none')content+=cross(20,18,80,79);
    else content+=`<text x="50" y="59" text-anchor="middle" stroke="none" fill="currentColor" font-family="Arial,sans-serif" font-size="36" font-weight="700">${g.letter}</text>`;
    content+=bars(g.bars||0);
  }else if(g.type==='extras'){
    if(g.mode==='no-wring')content+=`<path d="M20 44 C25 24 75 24 80 44 C83 56 68 65 50 63 C37 62 34 52 43 48 C51 43 59 50 55 56 M18 24 L82 79 M82 24 L18 79"/>`;
    else content+=`<rect x="18" y="19" width="64" height="62"/><path d="M18 19 H82 M18 26 L82 75 M82 26 L18 75"/>`;
  }
  return wrap(content);
}
