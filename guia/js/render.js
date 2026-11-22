// Capa de presentación: convierte los datos (data.js) en HTML.
const esc=s=>s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

// Ícono de Material Symbols (decorativo: el texto de al lado ya dice qué es).
const icon=name=>`<span class="mi" aria-hidden="true">${name}</span>`;
const NEWTAB=`<span class="sr-only"> (se abre en otra pestaña)</span>`;
const plural=(n,one,many)=>`${n} ${n===1?one:many}`;

// El verde marca lo oficial (wiki o documentación del autor); lo demás queda neutro.
const isOfficial=label=>/^(Wiki|Documentación)/.test(label);
function linkHtml([label,url]){
  return `<li><a${isOfficial(label)?' class="is-official"':""} href="${url}" target="_blank" rel="noopener noreferrer">${esc(label)}${NEWTAB}</a></li>`;
}

function videoHtml([id,title,lang,channel]){
  const en=lang==="EN";
  return `<li><a class="vid" href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener noreferrer">`+
    `<span class="thumb"><img loading="lazy" alt="" src="https://i.ytimg.com/vi/${id}/mqdefault.jpg"></span>`+
    `<span class="cap"${en?' lang="en"':""}>${esc(title)}<em class="ch"> ${esc(channel)}${en?" · en inglés":""}</em>${NEWTAB}</span></a></li>`;
}

function modHtml(m){
  const vids=m.v.length
    ? `<ul class="vids">${m.v.map(videoHtml).join("")}</ul>`
    : "";
  return `<article class="mod" data-c="${m.c}">`+
    `<h3>${m.i?`<img class="mod-icon" src="${m.i}" alt="" width="28" height="28" loading="lazy">`:""}<span>${esc(m.n)}</span></h3><p class="mod-desc">${esc(m.d)}</p>`+
    `<ul class="links">${m.l.map(linkHtml).join("")}</ul>${vids}</article>`;
}

// Mods que cumplen la búsqueda, agrupados por categoría.
function matches(cat,text){
  return CATS.map(([k,name,desc,ic])=>({k,name,desc,ic,items:M.filter(m=>m.c===k&&(cat==="all"||cat===k)&&(!text||(m.n+" "+m.d+" "+name).toLowerCase().includes(text)))}))
             .filter(g=>g.items.length);
}

function listHtml(groups){
  return groups.map(g=>
    `<div class="cathead" data-c="${g.k}"><h2>${esc(g.name)}</h2></div>`+
    g.items.map(modHtml).join("")).join("");
}
