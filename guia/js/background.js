// Capa de fondo: si ninguno de los formatos del video se puede reproducir, se oculta y queda el color liso.
(function(){
  const v=document.querySelector(".layer-video");
  if(!v)return;
  // El error de una fuente no sube al <video>; se escucha en la última (si falla, ya no hay otra).
  const sources=v.querySelectorAll("source");
  const last=sources[sources.length-1];
  if(last)last.addEventListener("error",()=>v.classList.add("is-off"));
  v.addEventListener("error",()=>v.classList.add("is-off"));
  // Si el navegador bloquea el autoplay, el video queda en su primer cuadro y no pasa nada más.
  const p=v.play&&v.play();
  if(p&&p.catch)p.catch(()=>{});
})();
