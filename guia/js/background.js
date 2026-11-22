// Capa de fondo: si el video no puede reproducirse, se oculta y queda el color liso.
(function(){
  const v=document.querySelector(".layer-video");
  if(!v)return;
  const off=()=>v.classList.add("is-off");
  v.addEventListener("error",off);
  const p=v.play&&v.play();
  if(p&&p.catch)p.catch(off);
})();
