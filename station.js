/* MENTE MATEMÁTICA · controles de Componentes 3 y 4; sin almacenamiento docente */
"use strict";

/* COMPONENTE 3 · recorrido de las siete sesiones */
const slides = [...document.querySelectorAll(".session-slide")];
const dots = [...document.querySelectorAll("[data-session-target]")];
let activeSession = 1;
function showSession(index) {
  activeSession = Math.max(1, Math.min(7, index));
  slides.forEach(slide => { const active = Number(slide.dataset.session) === activeSession; slide.hidden = !active; slide.classList.toggle("active", active); });
  dots.forEach(dot => dot.setAttribute("aria-selected", String(Number(dot.dataset.sessionTarget) === activeSession)));
  document.querySelector("#session-counter").textContent = "Sesión " + activeSession + " de 7";
  document.querySelector("#session-prev").disabled = activeSession === 1;
  document.querySelector("#session-next").disabled = activeSession === 7;
}
document.querySelector("#session-prev").addEventListener("click", () => showSession(activeSession - 1));
document.querySelector("#session-next").addEventListener("click", () => showSession(activeSession + 1));
dots.forEach(dot => dot.addEventListener("click", () => showSession(Number(dot.dataset.sessionTarget))));
document.querySelectorAll(".session-media img").forEach(image => image.addEventListener("error", () => { image.hidden = true; image.parentElement.classList.add("image-pending"); }));
showSession(1);

/* COMPONENTE 4 · vista pública: cuatro retos progresivos */
const completed = new Set();
function feedback(id, text, ok) {
  const node = document.querySelector(id);
  node.textContent = text; node.classList.toggle("is-success", ok); node.classList.toggle("is-error", !ok);
}
function updateStages() {
  document.querySelector("#score").textContent = completed.size + " / 4";
  for (let i = 1; i <= 4; i += 1) {
    const unlocked = i === 1 || completed.has(i - 1);
    const done = completed.has(i);
    const card = document.querySelector('.public-stage[data-stage="' + i + '"]');
    const label = document.querySelector('[data-stage-status="' + i + '"]');
    card.hidden = !unlocked; card.classList.toggle("locked", !unlocked); card.classList.toggle("completed", done);
    label.className = "stage-status " + (done ? "completed" : unlocked ? "available" : "locked");
    label.textContent = i + " · " + (done ? "Completado" : unlocked ? "Disponible" : "Bloqueado");
  }
  document.querySelector("#challenge-complete").hidden = completed.size !== 4;
}
function completeStage(number) { completed.add(number); updateStages(); }
document.querySelector("#check-code").addEventListener("click", () => {
  const code = document.querySelector("#secret-code").value.replace(/\D/g, "");
  document.querySelector("#secret-code").value = code;
  if (code === "854") {
    completeStage(1); document.querySelector('.public-stage[data-stage="1"]').classList.add("unlocked");
    feedback("#code-feedback", "¡CAJA FUERTE DESBLOQUEADA! El Reto 2 ya está disponible.", true);
  } else feedback("#code-feedback", "El código no abre la caja. Vuelve a relacionar las tres condiciones e inténtalo otra vez.", false);
});
const hints = ["Sustituye A y B en la ecuación de la suma para trabajar con una sola variable.","La relación queda: 2C + (C + 1) + C = 17.","Agrupa los términos con C antes de despejar la variable."];
document.querySelectorAll(".hint-button").forEach(button => button.addEventListener("click", () => {
  const index = Number(button.dataset.hint) - 1; feedback("#hint-feedback", hints[index], true); button.disabled = true;
}));
document.querySelector("#check-pattern").addEventListener("click", () => {
  const value = document.querySelector("#pattern-answer").value.trim(), reason = document.querySelector("#pattern-reason").value.trim();
  if (value === "42" && reason.length >= 15) { completeStage(2); feedback("#pattern-feedback", "Patrón validado. El Reto 3 ya está disponible.", true); }
  else if (value === "42") feedback("#pattern-feedback", "El resultado es correcto; ahora explica la regla que usaste.", false);
  else feedback("#pattern-feedback", "Revisa cómo cambia cada producto de números consecutivos.", false);
});
document.querySelector("#check-odd").addEventListener("click", () => {
  const choice = document.querySelector('input[name="odd-answer"]:checked')?.value, explanation = document.querySelector("#odd-proof").value.trim();
  if (choice === "verdadero" && explanation.length >= 25) { completeStage(3); feedback("#odd-feedback", "Respuesta registrada. El Reto 4 ya está disponible.", true); }
  else feedback("#odd-feedback", "Elige una respuesta y justifícala con ejemplos o una expresión general.", false);
});
document.querySelector("#check-counterexample").addEventListener("click", () => {
  const choice = document.querySelector('input[name="error-answer"]:checked')?.value, explanation = document.querySelector("#counterexample").value.trim();
  if (choice === "no" && explanation.length >= 25) { completeStage(4); feedback("#counterexample-feedback", "Análisis registrado.", true); }
  else feedback("#counterexample-feedback", "Indica si el razonamiento es válido y explica por qué los ejemplos no bastan.", false);
});
document.querySelector("#reset-challenges").addEventListener("click", () => {
  completed.clear(); document.querySelectorAll(".challenge-section input, .challenge-section textarea").forEach(field => { if (field.type !== "radio") field.value = ""; else field.checked = false; });
  document.querySelectorAll(".feedback, .hint-feedback").forEach(node => { node.textContent = ""; node.classList.remove("is-success","is-error"); });
  document.querySelectorAll(".hint-button").forEach(button => button.disabled = false);
  document.querySelector('.public-stage[data-stage="1"]').classList.remove("unlocked"); updateStages();
});
updateStages();

/* PANEL DOCENTE · aviso: control visual, no seguridad criptográfica. */
const accessDialog = document.querySelector("#teacher-access-dialog"), panelDialog = document.querySelector("#teacher-panel-dialog"), accessButton = document.querySelector("#open-teacher-access"), keyInput = document.querySelector("#teacher-key");
accessButton.addEventListener("click", () => { keyInput.value = ""; feedback("#teacher-access-feedback", "", true); accessDialog.showModal(); });
function closeAccess() { accessDialog.close(); accessButton.focus(); }
document.querySelector("#close-teacher-access").addEventListener("click", closeAccess);
document.querySelector("#cancel-teacher-access").addEventListener("click", closeAccess);
document.querySelector("#toggle-teacher-key").addEventListener("click", event => { const show = keyInput.type === "password"; keyInput.type = show ? "text" : "password"; event.currentTarget.textContent = show ? "Ocultar" : "Mostrar"; });
document.querySelector("#enter-teacher-panel").addEventListener("click", () => {
  if (keyInput.value === "1405") { accessDialog.close(); panelDialog.showModal(); showTeacherSolution(1); }
  else feedback("#teacher-access-feedback", "Clave incorrecta. Intenta nuevamente.", false);
});
keyInput.addEventListener("keydown", event => { if (event.key === "Enter") { event.preventDefault(); document.querySelector("#enter-teacher-panel").click(); } });
function showTeacherSolution(number) {
  document.querySelectorAll("[data-teacher-solution-panel]").forEach(panel => panel.hidden = Number(panel.dataset.teacherSolutionPanel) !== number);
  document.querySelectorAll("[data-teacher-solution]").forEach(button => button.classList.toggle("active", Number(button.dataset.teacherSolution) === number));
}
document.querySelectorAll("[data-teacher-solution]").forEach(button => button.addEventListener("click", () => showTeacherSolution(Number(button.dataset.teacherSolution))));
function logoutTeacher() { panelDialog.close(); keyInput.value = ""; accessButton.focus(); }
document.querySelector("#logout-teacher").addEventListener("click", logoutTeacher);
document.querySelector("#teacher-logout-button").addEventListener("click", logoutTeacher);

/* Componentes conservados: reflexión, guía y cronómetro de 10 minutos */
const reflection = document.querySelector("#reflection"), reflectionMessage = document.querySelector("#reflection-message");
try { reflection.value = localStorage.getItem("mente-matematica-reflexion") || ""; } catch {}
document.querySelector("#reflection-form").addEventListener("submit", event => { event.preventDefault(); if (!reflection.value.trim()) { reflectionMessage.textContent = "Escribe una reflexión antes de guardarla."; return; } try { localStorage.setItem("mente-matematica-reflexion", reflection.value.trim()); reflectionMessage.textContent = "Reflexión guardada en este navegador."; } catch { reflectionMessage.textContent = "La reflexión está lista, pero no puede guardarse aquí."; } });
const guide = document.querySelector("#guide-dialog"), guideButton = document.querySelector("#open-guide");guideButton.addEventListener("click",()=>guide.showModal());document.querySelector("#close-guide").addEventListener("click",()=>guide.close());guide.addEventListener("close",()=>guideButton.focus());
const TIMER_TOTAL=600000;let remaining=TIMER_TOTAL,end=0,handle=null,announced=-1;const clock=document.querySelector("#timer-clock"),stage=document.querySelector("#timer-stage"),detail=document.querySelector("#timer-detail"),fill=document.querySelector("#timer-progress"),alertNode=document.querySelector("#timer-alert"),start=document.querySelector("#timer-start"),pause=document.querySelector("#timer-pause");
function renderTimer(announce){const secs=Math.ceil(remaining/1000),elapsed=TIMER_TOTAL-remaining,index=elapsed<240000?0:elapsed<480000?1:2,info=[["Etapa 1 · Presentación","0:00 – 4:00 · contextualización y conceptos"],["Etapa 2 · Resolución del reto","4:00 – 8:00 · código secreto y procedimiento"],["Etapa 3 · Intercambio y retroalimentación","8:00 – 10:00 · solución y reflexión"]][index];clock.textContent=String(Math.floor(secs/60)).padStart(2,"0")+":"+String(secs%60).padStart(2,"0");stage.textContent=remaining?info[0]:"Estación finalizada";detail.textContent=remaining?info[1]:"10:00 · cierre";fill.style.width=(elapsed/TIMER_TOTAL*100)+"%";if(announce&&index!==announced&&remaining){alertNode.textContent="Comienza "+info[0];announced=index;}}
function tick(){remaining=Math.max(0,end-Date.now());renderTimer(true);if(!remaining){clearInterval(handle);handle=null;start.disabled=true;pause.disabled=true;alertNode.textContent="Tiempo finalizado. Cierra con la reflexión.";}}
start.addEventListener("click",()=>{if(!remaining)return;end=Date.now()+remaining;start.disabled=true;pause.disabled=false;announced=-1;tick();handle=setInterval(tick,250);});pause.addEventListener("click",()=>{tick();clearInterval(handle);handle=null;start.disabled=false;pause.disabled=true;alertNode.textContent="Cronómetro pausado.";});document.querySelector("#timer-reset").addEventListener("click",()=>{clearInterval(handle);handle=null;remaining=TIMER_TOTAL;announced=-1;start.disabled=false;pause.disabled=true;renderTimer(false);alertNode.textContent="Cronómetro reiniciado.";});renderTimer(false);