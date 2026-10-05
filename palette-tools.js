/* Local search and wallpaper geometry. No model, tracking, or remote renderer. */
(() => {
  'use strict';
  const normalize = value => String(value).normalize('NFKC').toLowerCase().trim();
  const families = {
    red: ['red','crimson','scarlet','แดง','สีแดง','红','红色','紅色'],
    black: ['black','ดำ','สีดำ','黑','黑色'],
    white: ['white','ivory','cream','ขาว','สีขาว','白','白色'],
    gray: ['gray','grey','neutral','เทา','สีเทา','灰','灰色'],
    blue: ['blue','navy','indigo','น้ำเงิน','สีน้ำเงิน','ฟ้า','สีฟ้า','蓝','蓝色','藍色'],
    green: ['green','olive','เขียว','สีเขียว','绿','绿色','綠色'],
    yellow: ['yellow','gold','เหลือง','สีเหลือง','黄','黄色','黃色'],
    orange: ['orange','ส้ม','สีส้ม','橙','橙色'],
    brown: ['brown','beige','tan','น้ำตาล','สีน้ำตาล','棕','棕色','米色'],
    violet: ['violet','purple','lavender','ม่วง','สีม่วง','紫','紫色'],
    rose: ['rose','pink','blush','romantic','romance','ชมพู','สีชมพู','โรแมนติก','粉红','粉色','粉紅','浪漫'],
    turquoise: ['turquoise','teal','cyan','เทอร์ควอยซ์','青','青色'],
    quiet: ['quiet','calm','calming','peace','peaceful','relax','relaxing','serene','serenity','zen','minimal','minimalist','minimalism','soft','muted','pastel','gentle','subtle','สงบ','ผ่อนคลาย','นุ่ม','เรียบง่าย','安静','平静','宁静','柔和','极简','粉彩'],
    loud: ['loud','electric','bold','energetic','playful','fun','happy','joy','cheerful','summer','colourful','colorful','punk','bright','vivid','festival','สดใส','สนุก','พังก์','强烈','活泼','朋克','快乐'],
    warm: ['warm','earth','earthy','autumn','sunset','cozy','cosy','comfort','vintage','retro','อบอุ่น','แสงแดด','温暖','复古','秋天'],
    cool: ['cool','water','ocean','sea','beach','winter','fresh','nature','natural','เย็น','ทะเล','น้ำ','ธรรมชาติ','冷静','海洋','自然'],
    dark: ['dark','night','moody','dramatic','goth','gothic','luxury','elegant','classy','dangerous','มืด','กลางคืน','หรู','深色','夜晚','优雅'],
    light: ['light','day','daylight','airy','spring','wedding','สว่าง','กลางวัน','浅色','白昼','婚礼'],
    interface: ['interface','website','web','app','dashboard','ui','ux','เว็บ','แอป','เว็บไซต์','界面','网站','应用'],
    editorial: ['editorial','book','reading','essay','magazine','หนังสือ','อ่าน','书','阅读'],
    poster: ['poster','print','branding','brand','logo','โปสเตอร์','海报','品牌'],
    interior: ['interior','home','room','living','bedroom','บ้าน','ห้อง','室内','家居'],
    fashion: ['fashion','clothing','outfit','แฟชั่น','时尚'],
    botanical: ['botanical','garden','forest','สวน','ป่า','植物','森林']
  };
  const aliases = new Map(Object.entries(families).flatMap(([key,values])=>values.map(value=>[value,key])));
  const stopwords = new Set('a an the and or with for to of in on i want need some palette palettes color colors colour colours scheme schemes combination combinations please feeling feel make me my it look looking like'.split(' '));
  const documents=new WeakMap();
  const parsedTerms=new Map();
  const colourFamilies=new Set(['red','black','white','gray','blue','green','yellow','orange','brown','violet','rose','turquoise']);
  function closeWord(word, candidate) {
    if (word.length < 4 || Math.abs(word.length-candidate.length)>1) return false;
    let previous = Array.from({length:candidate.length+1},(_,i)=>i);
    for (let i=0;i<word.length;i++) {
      const row=[i+1];
      for(let j=0;j<candidate.length;j++) row.push(Math.min(row[j]+1,previous[j+1]+1,previous[j]+(word[i]===candidate[j]?0:1)));
      previous=row;
    }
    return previous.at(-1)<=1;
  }
  function termsFor(query) {
    if(parsedTerms.has(query)) return parsedTerms.get(query);
    let text = normalize(query);
    // Thai and Chinese queries need not put spaces between colour names.
    [...aliases].filter(([word])=>/[^\x00-\x7f]/.test(word)).sort((a,b)=>b[0].length-a[0].length).forEach(([word,key])=>{text=text.split(word).join(' '+key+' ');});
    const result=[...new Set(text.split(/[\s,+/&–—-]+/).filter(Boolean).filter(word=>!stopwords.has(word)).map(word=>{
      if(aliases.has(word)) return aliases.get(word);
      if(word.endsWith('s') && aliases.has(word.slice(0,-1))) return aliases.get(word.slice(0,-1));
      const nearby=[...aliases.keys()].filter(value=>/^[a-z]+$/.test(value)&&closeWord(word,value));
      return nearby.length===1?aliases.get(nearby[0]):word;
    }))];
    if(parsedTerms.size>2000) parsedTerms.clear();
    parsedTerms.set(query,result);
    return result;
  }
  function search(palettes, query) {
    const text=normalize(query);
    const number=text.match(/^(?:plate\s*[-#]?\s*)?(\d{1,3})$/);
    if(number) return {results:palettes.filter(p=>p.id===Number(number[1])),related:false,terms:[text]};
    const terms=termsFor(text);
    if(!terms.length) return {results:palettes,related:false,terms};
    const scored=palettes.map(p=>{
      if(!documents.has(p)) documents.set(p,new Set(p.tags.flatMap(tag=>termsFor(tag))));
      const words=documents.get(p);
      const names=p.colors.map(c=>normalize(c.name)).join(' ');
      const hexes=p.colors.flatMap(c=>[normalize(c.hex),normalize(c.hex).slice(1)]);
      const matches=terms.filter(term=>words.has(term)||(!colourFamilies.has(term)&&names.includes(term))||hexes.includes(term)).length;
      return {p,matches};
    }).filter(x=>x.matches>0).sort((a,b)=>b.matches-a.matches||a.p.id-b.p.id);
    const exact=scored.filter(x=>x.matches===terms.length);
    return {results:(exact.length?exact:scored).map(x=>x.p),related:!exact.length&&scored.length>0,terms};
  }
  const sizes={phone:{width:1440,height:3120},tablet:{width:2048,height:2732},desktop:{width:3840,height:2160}};
  function wallpaperPlan(palette, device) {
    const size=sizes[device];
    if(!size) throw new Error('Unknown wallpaper device');
    const weights=palette.colors.length===2?[1.618,1]:palette.colors.length===3?[1.45,.9,.65]:[1.55,.85,.7,.55];
    const portrait=size.height>size.width;
    const extent=portrait?size.height:size.width;
    const total=weights.reduce((a,b)=>a+b,0);
    let start=0;
    const fields=palette.colors.map((color,i)=>{
      const end=i===weights.length-1?extent:Math.round(extent*weights.slice(0,i+1).reduce((a,b)=>a+b,0)/total);
      const field={color,x:portrait?0:start,y:portrait?start:0,width:portrait?size.width:end-start,height:portrait?end-start:size.height};
      start=end; return field;
    });
    return {...size,fields};
  }
  const typeLibrary = {
    reading: {
      display: "Source Serif 4",
      body: "Source Serif 4",
      displayStack: '"Source Serif 4", Georgia, serif',
      bodyStack: '"Source Serif 4", Georgia, serif',
      tracking: "0",
      transform: "none",
      leading: "1.05",
      size: "clamp(1.75rem, 4.2vw, 4.2rem)",
      weight: "600",
      reason: "The names are read on a quiet ground. One text family does both roles."
    },
    warm: {
      display: "Source Serif 4",
      body: "Source Sans 3",
      displayStack: '"Source Serif 4", Georgia, serif',
      bodyStack: '"Source Sans 3", Arial, sans-serif',
      tracking: "0",
      transform: "none",
      leading: "1.05",
      size: "clamp(1.75rem, 4.2vw, 4.2rem)",
      weight: "600",
      reason: "Serif for the short title. Sans for the names, so the serif is not a label face."
    },
    signal: {
      display: "Archivo Narrow",
      body: "Source Sans 3",
      displayStack: '"Archivo Narrow", Arial, sans-serif',
      bodyStack: '"Source Sans 3", Arial, sans-serif',
      tracking: "-0.045em",
      transform: "uppercase",
      leading: "0.88",
      size: "clamp(2rem, 5.6vw, 6.4rem)",
      weight: "400",
      reason: "Narrow caps for the short title. Names stay a text grotesque so they are not condensed."
    },
    instrument: {
      display: "JetBrains Mono",
      body: "JetBrains Mono",
      displayStack: '"JetBrains Mono", ui-monospace, monospace',
      bodyStack: '"JetBrains Mono", ui-monospace, monospace',
      tracking: "0",
      transform: "none",
      leading: "1.15",
      size: "clamp(1.25rem, 3vw, 2.8rem)",
      weight: "600",
      reason: "The names sit with the hex values. One mono family."
    }
  };
  const typeByUse = {
    "archival room": "reading",
    "quiet editorial": "reading",
    "botanical study": "reading",
    "mineral calm": "reading",
    "domestic warmth": "warm",
    "civic daylight": "signal",
    "electric argument": "signal",
    "confectionery shock": "signal",
    "night instrument": "instrument"
  };
  function typePair(palette) {
    const id = typeByUse[palette && palette.use] || "signal";
    return {
      id,
      use: palette ? palette.use : "",
      ...typeLibrary[id],
      note: "Deterministic suggestion for this plate. Not a Wada typeface. Not a user test. Latin only."
    };
  }
  const api={search,termsFor,wallpaperPlan,sizes,typePair,typeByUse};
  if(typeof module!=='undefined') module.exports=api;
  if(typeof window!=='undefined') window.PALETTE_TOOLS=api;
})();
