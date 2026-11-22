// Capa de comportamiento: filtros, buscador y contador.
(function(){
  const $=id=>document.getElementById(id);
  const list=$("list"),q=$("q"),chips=$("chips"),count=$("count"),empty=$("empty"),emptyMsg=$("emptyMsg");
  let cat="all";

  // Categorías: en pantalla ancha el botón minimiza la columna (solo íconos) y se recuerda;
  // en angosta pliega la lista y arranca plegada.
  const shell=$("shell"),tog=$("railToggle"),now=$("railNow"),panelIc=tog.querySelector(".ic-panel"),
        wide=matchMedia("(min-width:56rem)"),KEY="guia-rail-min";
  const saved=()=>{try{return localStorage.getItem(KEY)==="1"}catch(e){return false}};
  function setMin(min,remember){
    shell.toggleAttribute("data-min",min);
    tog.setAttribute("aria-expanded",!min);
    panelIc.textContent=min?"left_panel_open":"left_panel_close";
    buttons.forEach(b=>{min&&wide.matches?b.title=b.querySelector("span:nth-child(2)").textContent:b.removeAttribute("title")});
    if(remember&&wide.matches){try{localStorage.setItem(KEY,min?"1":"0")}catch(e){}}
  }
  // Angosto: el menú de categorías abre a pantalla completa (el resto de la página queda inerte).
  const menuBtn=$("menuBtn"),menuClose=$("menuClose"),panel=$("panel"),mainEl=$("main");
  function setMenu(open){
    panel.toggleAttribute("data-open",open);
    menuBtn.setAttribute("aria-expanded",open);
    mainEl.inert=open;
    document.body.style.overflow=open?"hidden":"";
    (open?menuClose:menuBtn).focus();
  }
  menuBtn.onclick=()=>setMenu(true);
  menuClose.onclick=()=>setMenu(false);
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&panel.hasAttribute("data-open"))setMenu(false)});
  tog.onclick=()=>setMin(!shell.hasAttribute("data-min"),true);
  wide.addEventListener("change",()=>{if(panel.hasAttribute("data-open"))setMenu(false);setMin(wide.matches?saved():true,false)});

  // Los botones se crean una sola vez; así no pierden el foco al filtrar.
  const buttons=[["all","Todo","apps"],...CATS.map(c=>[c[0],c[1],c[3]])].map(([k,t,ic])=>{
    const li=document.createElement("li"),b=document.createElement("button");
    b.className="chip";b.type="button";b.dataset.cat=k;if(k!=="all")b.dataset.c=k;
    b.innerHTML=`${icon(ic)}<span>${esc(t)}</span><span class="n"></span>`;
    b.onclick=()=>{cat=k;update();if(!wide.matches)setMenu(false)};
    li.appendChild(b);chips.appendChild(li);
    return b;
  });

  function paint(){
    const text=q.value.trim().toLowerCase();
    // Los números de cada categoría respetan la búsqueda; así se ve dónde hay resultados.
    const all=matches("all",text);
    const perCat=Object.fromEntries(all.map(g=>[g.k,g.items.length]));
    const total=all.reduce((s,g)=>s+g.items.length,0);
    buttons.forEach(b=>{
      b.setAttribute("aria-pressed",b.dataset.cat===cat);
      b.querySelector(".n").textContent=b.dataset.cat==="all"?total:(perCat[b.dataset.cat]||0);
    });
    now.textContent=buttons.find(b=>b.dataset.cat===cat).querySelector("span:nth-child(2)").textContent;
    const groups=matches(cat,text);
    const shown=groups.reduce((s,g)=>s+g.items.length,0);
    list.innerHTML=listHtml(groups);
    empty.style.display=shown?"none":"block";
    const term=q.value.trim();
    emptyMsg.textContent=term?`No hay mods para “${term}”${cat==="all"?"":" en esta categoría"}.`:"No hay mods en esta categoría.";
    count.textContent=shown?`Mostrando ${plural(shown,"mod","mods")}${term?` para “${term}”`:""}.`:"";
  }

  // View Transitions: las tarjetas se mueven, aparecen y salen con animación.
  // Sin soporte del navegador, el cambio es el mismo pero sin animación.
  function update(){
    if(document.startViewTransition)document.startViewTransition(paint).finished.catch(()=>{}); // una transición nueva cancela la anterior: no es un error
    else paint();
  }

  $("clear").onclick=()=>{q.value="";cat="all";update();q.focus()};
  q.addEventListener("input",update);
  setMin(wide.matches?saved():true,false);
  paint();
})();
