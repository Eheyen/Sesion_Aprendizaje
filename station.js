/* MENTE MATEMÁTICA · escape room: validación, razonamiento y demostración */
"use strict";
const scoreNode = document.querySelector("#score");
const progressNode = document.querySelector("#progress");
const earned = new Set();
const totalPoints = 5;
function updateScore() {
  scoreNode.textContent = earned.size + " / " + totalPoints;
  progressNode.textContent = Math.round((earned.size / totalPoints) * 100) + "%";
}
function award(key) { earned.add(key); updateScore(); }
function message(id, text, ok) {
  const node = document.querySelector(id);
  node.textContent = text;
  node.classList.toggle("is-error", !ok);
  node.classList.toggle("is-success", Boolean(ok));
}
function normalized(id) { return document.querySelector(id).value.trim().toLowerCase(); }

/* Reto 1 · código de la caja y pistas progresivas */
const codeInput = document.querySelector("#secret-code");
const solutionButton = document.querySelector("#show-code-solution");
document.querySelector("#check-code").addEventListener("click", () => {
  const code = codeInput.value.replace(/\D/g, "");
  codeInput.value = code;
  solutionButton.disabled = false;
  if (code === "854") {
    award("code");
    message("#code-feedback", "¡Caja desbloqueada! 854 cumple las tres pistas.", true);
    document.querySelector(".safe-challenge").classList.add("unlocked");
  } else {
    message("#code-feedback", "Aún no se abre. Revisa la relación entre A, B y C antes de intentar otra vez.", false);
  }
});
const hints = [
  "Sustituye A y B en la ecuación de la suma; quedará una sola variable.",
  "Después de sustituir: 2C + (C + 1) + C = 17.",
  "Agrupa términos: 4C + 1 = 17. ¿Cuánto vale C?"
];
document.querySelectorAll(".hint-button").forEach(button => button.addEventListener("click", () => {
  const index = Number(button.dataset.hint) - 1;
  message("#hint-feedback", hints[index], true);
  button.disabled = true;
}));
solutionButton.addEventListener("click", () => {
  document.querySelector("#code-solution").hidden = false;
  solutionButton.textContent = "Resolución mostrada";
  solutionButton.disabled = true;
});
document.querySelector("#check-argument").addEventListener("click", () => {
  const text = normalized("#code-argument");
  if (text.length < 70) return message("#argument-feedback", "Desarrolla más tu justificación: menciona las tres condiciones o el valor único de C.", false);
  const hasReason = /condici|ecuaci|comprob|únic|unico|c = 4|variable/.test(text);
  if (hasReason) { award("argument"); message("#argument-feedback", "Justificación registrada: relacionas procedimiento y comprobación.", true); }
  else message("#argument-feedback", "Incluye cómo las ecuaciones y las tres condiciones justifican la respuesta.", false);
});

/* Retos complementarios · evalúan respuesta y explicación */
document.querySelector("#check-pattern").addEventListener("click", () => {
  const answer = normalized("#pattern-answer");
  const reason = normalized("#pattern-reason");
  if (answer === "42" && reason.length >= 18) { award("pattern"); message("#pattern-feedback", "¡Correcto! Identificaste 6 × 7 y justificaste una regularidad.", true); }
  else if (answer === "42") message("#pattern-feedback", "42 es correcto. Falta explicar la regla de productos consecutivos.", false);
  else message("#pattern-feedback", "Observa: 1×2, 2×3, 3×4, 4×5 y 5×6. ¿Cuál sigue?", false);
});
document.querySelector("#check-odd").addEventListener("click", () => {
  const proof = normalized("#odd-proof");
  const algebra = /2a|2b|2\(.+\)|múltip|multip|par/.test(proof);
  if (proof.length >= 45 && algebra) { award("odd"); message("#odd-feedback", "Demostración registrada: partes de una forma general, no solo de ejemplos.", true); }
  else message("#odd-feedback", "Incluye dos impares generales (2a + 1 y 2b + 1) y muestra que su suma es múltiplo de 2.", false);
});
document.querySelector("#check-counterexample").addEventListener("click", () => {
  const text = normalized("#counterexample");
  const hasCounterexample = /41|1763|43|contraejemplo|compuesto/.test(text);
  if (text.length >= 45 && hasCounterexample) { award("counterexample"); message("#counterexample-feedback", "Buen análisis: un contraejemplo basta para cuestionar una afirmación universal.", true); }
  else message("#counterexample-feedback", "Incluye un contraejemplo. Puedes analizar n² + n + 41 cuando n = 41: 41 × 43 = 1763.", false);
});

/* Reinicio seguro de toda la experiencia */
document.querySelector("#reset-challenges").addEventListener("click", () => {
  earned.clear(); updateScore();
  document.querySelectorAll(".challenge-section input, .challenge-section textarea").forEach(field => field.value = "");
  document.querySelectorAll(".feedback, .hint-feedback").forEach(node => { node.textContent = ""; node.classList.remove("is-error", "is-success"); });
  document.querySelectorAll(".hint-button").forEach(button => button.disabled = false);
  document.querySelector("#code-solution").hidden = true;
  solutionButton.disabled = true; solutionButton.textContent = "Ver resolución paso a paso";
  document.querySelector(".safe-challenge").classList.remove("unlocked");
});

/* Reflexión y guía del equipo anfitrión */
const reflection = document.querySelector("#reflection");
const reflectionMessage = document.querySelector("#reflection-message");
try { reflection.value = localStorage.getItem("mente-matematica-reflexion") || ""; } catch {}
document.querySelector("#reflection-form").addEventListener("submit", event => {
  event.preventDefault();
  if (!reflection.value.trim()) { reflectionMessage.textContent = "Escribe una reflexión antes de guardarla."; return; }
  try { localStorage.setItem("mente-matematica-reflexion", reflection.value.trim()); reflectionMessage.textContent = "Reflexión guardada en este navegador."; }
  catch { reflectionMessage.textContent = "La reflexión está lista, pero no puede guardarse en este navegador."; }
});
const guide = document.querySelector("#guide-dialog"), guideButton = document.querySelector("#open-guide");
guideButton.addEventListener("click", () => guide.showModal());
document.querySelector("#close-guide").addEventListener("click", () => guide.close());
guide.addEventListener("close", () => guideButton.focus());
updateScore();
/* INTEGRACIÓN · conecta propiedad, algoritmo y sesión del curso */
document.querySelector("#check-integration").addEventListener("click", () => {
  const q1 = normalized("#integration-q1"), q2 = normalized("#integration-q2"), q3 = normalized("#integration-q3");
  const property = /divisib|entre 2|múltip|multip/.test(q1);
  const session = /5|cinco|informát|informatic|tecnolog/.test(q2);
  const reasoning = /justif|propiedad|lógica|logica|procedimiento|explic/.test(q3);
  if (property && session && reasoning) message("#integration-feedback", "Excelente conexión: la divisibilidad entre 2 fundamenta el algoritmo y la sesión 5 explica su vínculo con la informática.", true);
  else message("#integration-feedback", "Revisa: la propiedad es la divisibilidad entre 2; se vincula principalmente con la sesión 5 y debe explicarse la lógica usada.", false);
});

/* CRONÓMETRO · 10 minutos reales, calculados con marcas de tiempo. */
const TIMER_TOTAL = 10 * 60 * 1000;
const stageInfo = [
  { until: 4 * 60 * 1000, title: "Etapa 1 · Presentación", detail: "0:00 – 4:00 · contextualización y conceptos" },
  { until: 8 * 60 * 1000, title: "Etapa 2 · Resolución del reto", detail: "4:00 – 8:00 · código secreto y procedimiento" },
  { until: TIMER_TOTAL, title: "Etapa 3 · Intercambio y retroalimentación", detail: "8:00 – 10:00 · solución y reflexión" }
];
let remainingTime = TIMER_TOTAL, timerEnd = 0, timerHandle = null, announcedStage = -1;
const timerClock = document.querySelector("#timer-clock"), timerStage = document.querySelector("#timer-stage"), timerDetail = document.querySelector("#timer-detail"), timerFill = document.querySelector("#timer-progress"), timerAlert = document.querySelector("#timer-alert");
const startTimer = document.querySelector("#timer-start"), pauseTimer = document.querySelector("#timer-pause");
function currentStage(elapsed) { return elapsed < 240000 ? 0 : elapsed < 480000 ? 1 : 2; }
function drawTimer(announce) {
  const seconds = Math.ceil(remainingTime / 1000);
  timerClock.textContent = String(Math.floor(seconds / 60)).padStart(2, "0") + ":" + String(seconds % 60).padStart(2, "0");
  const elapsed = TIMER_TOTAL - remainingTime, index = currentStage(elapsed), stage = stageInfo[index];
  timerStage.textContent = remainingTime <= 0 ? "Estación finalizada" : stage.title;
  timerDetail.textContent = remainingTime <= 0 ? "10:00 · cierre de la estación" : stage.detail;
  timerFill.style.width = Math.min(100, elapsed / TIMER_TOTAL * 100) + "%";
  if (announce && index !== announcedStage && remainingTime > 0) { timerAlert.textContent = "Comienza " + stage.title; announcedStage = index; }
}
function stopTimer(finished) {
  clearInterval(timerHandle); timerHandle = null; startTimer.disabled = finished; pauseTimer.disabled = true;
  if (finished) { timerAlert.textContent = "Tiempo finalizado. Cierra con la reflexión."; }
}
function tickTimer() {
  remainingTime = Math.max(0, timerEnd - Date.now());
  drawTimer(true);
  if (remainingTime <= 0) stopTimer(true);
}
startTimer.addEventListener("click", () => {
  if (remainingTime <= 0) return;
  timerEnd = Date.now() + remainingTime; startTimer.disabled = true; pauseTimer.disabled = false;
  announcedStage = currentStage(TIMER_TOTAL - remainingTime) - 1; tickTimer(); timerHandle = setInterval(tickTimer, 250);
});
pauseTimer.addEventListener("click", () => {
  tickTimer(); clearInterval(timerHandle); timerHandle = null; startTimer.disabled = false; pauseTimer.disabled = true; timerAlert.textContent = "Cronómetro pausado.";
});
document.querySelector("#timer-reset").addEventListener("click", () => {
  clearInterval(timerHandle); timerHandle = null; remainingTime = TIMER_TOTAL; announcedStage = -1; startTimer.disabled = false; pauseTimer.disabled = true; drawTimer(false); timerAlert.textContent = "Cronómetro reiniciado a 10 minutos.";
});
drawTimer(false);