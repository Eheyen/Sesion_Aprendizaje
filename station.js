/* MENTE MATEMÁTICA · desafíos, puntaje, reflexión y guía */
"use strict";
const cards = [...document.querySelectorAll(".challenge-card")];
const scoreNode = document.querySelector("#score");
const resetButton = document.querySelector("#reset-challenges");
const solved = new Set();

function paintScore() {
  scoreNode.textContent = solved.size + " / " + cards.length;
}
function answerChallenge(button) {
  const card = button.closest(".challenge-card");
  if (card.dataset.solved === "true") return;
  const isCorrect = button.dataset.option === card.dataset.answer;
  const feedback = card.querySelector(".feedback");
  card.querySelectorAll(".answers button").forEach(item => {
    item.disabled = true;
    if (item.dataset.option === card.dataset.answer) item.classList.add("correct");
  });
  if (isCorrect) {
    solved.add(card);
    feedback.textContent = "¡Correcto! +1 punto.";
  } else {
    button.classList.add("incorrect");
    feedback.textContent = "Casi. Revisa la solución y piensa en la regla general.";
  }
  card.dataset.solved = "true";
  paintScore();
}
cards.forEach(card => card.querySelectorAll(".answers button").forEach(button => {
  button.addEventListener("click", () => answerChallenge(button));
}));
resetButton.addEventListener("click", () => {
  solved.clear();
  cards.forEach(card => {
    delete card.dataset.solved;
    card.querySelector(".feedback").textContent = "";
    card.querySelectorAll(".answers button").forEach(button => {
      button.disabled = false;
      button.classList.remove("correct", "incorrect");
    });
  });
  paintScore();
});
paintScore();

const reflectionForm = document.querySelector("#reflection-form");
const reflection = document.querySelector("#reflection");
const reflectionMessage = document.querySelector("#reflection-message");
const reflectionKey = "mente-matematica-reflexion";
try { reflection.value = localStorage.getItem(reflectionKey) || ""; } catch {}
reflectionForm.addEventListener("submit", event => {
  event.preventDefault();
  const text = reflection.value.trim();
  if (!text) {
    reflectionMessage.textContent = "Escribe una reflexión antes de guardarla.";
    return;
  }
  try {
    localStorage.setItem(reflectionKey, text);
    reflectionMessage.textContent = "Reflexión guardada en este navegador.";
  } catch {
    reflectionMessage.textContent = "La reflexión está lista, pero este navegador no puede guardarla.";
  }
});

const guide = document.querySelector("#guide-dialog");
const guideButton = document.querySelector("#open-guide");
guideButton.addEventListener("click", () => guide.showModal());
document.querySelector("#close-guide").addEventListener("click", () => guide.close());
guide.addEventListener("close", () => guideButton.focus());