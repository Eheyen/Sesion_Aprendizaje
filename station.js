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
  const hasCounterexample = /41|1681|contraejemplo|compuesto/.test(text);
  if (text.length >= 45 && hasCounterexample) { award("counterexample"); message("#counterexample-feedback", "Buen análisis: un contraejemplo basta para cuestionar una afirmación universal.", true); }
  else message("#counterexample-feedback", "Incluye un contraejemplo. Puedes analizar n² + n + 41 cuando n = 41.", false);
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