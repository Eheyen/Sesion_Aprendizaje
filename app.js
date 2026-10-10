/* =========================================================
   01. CONFIGURACIÓN DEL SIMULADOR
   Cada fracción representa una cantidad entre 0 y 1.
   Cambia MAX_DENOMINATOR para permitir más divisiones.
   ========================================================= */
"use strict";
const MAX_DENOMINATOR = 12;
const initialFractions = { a: { numerator: 1, denominator: 2 }, b: { numerator: 2, denominator: 4 } };
const controls = {};
const result = document.querySelector("#resultado");

/* 02. OPCIONES · se crean con nodos DOM, sin HTML dinámico. */
function fillOptions(select, first, last, selected) {
  select.replaceChildren();
  for (let value = first; value <= last; value += 1) {
    const option = document.createElement("option");
    option.value = String(value);
    option.textContent = String(value);
    select.append(option);
  }
  select.value = String(selected);
}

/* 03. DIBUJO · ambas barras tienen el mismo ancho: la misma unidad. */
function drawFraction(key) {
  const { numerator, denominator } = controls[key];
  const n = Number(numerator.value);
  const d = Number(denominator.value);
  const bar = document.querySelector("#bar-" + key);
  bar.replaceChildren();
  for (let part = 0; part < d; part += 1) {
    const segment = document.createElement("i");
    segment.setAttribute("aria-hidden", "true");
    if (part < n) segment.classList.add("selected");
    bar.append(segment);
  }
  bar.setAttribute("aria-label", n + " de " + d + " partes iguales coloreadas");
  document.querySelector("#value-" + key).textContent = n + "/" + d;
  return { n, d };
}

/* 04. COMPARACIÓN · producto cruzado para evitar errores de decimales. */
function updateComparison() {
  const a = drawFraction("a");
  const b = drawFraction("b");
  const left = a.n * b.d;
  const right = b.n * a.d;
  const equivalent = left === right;
  document.querySelector("#compare-symbol").textContent = equivalent ? "=" : left > right ? ">" : "<";
  result.classList.toggle("different", !equivalent);
  result.textContent = equivalent
    ? a.n + "/" + a.d + " y " + b.n + "/" + b.d + " representan la misma cantidad. " + a.n + " × " + b.d + " = " + b.n + " × " + a.d + " = " + left + "."
    : a.n + "/" + a.d + (left > right ? " es mayor que " : " es menor que ") + b.n + "/" + b.d + ". Ajusta los valores para encontrar una equivalencia.";
}

/* 05. EVENTOS · al cambiar el denominador se conserva un numerador válido. */
for (const key of ["a", "b"]) {
  const numerator = document.querySelector("#num-" + key);
  const denominator = document.querySelector("#den-" + key);
  controls[key] = { numerator, denominator };
  denominator.addEventListener("change", () => {
    const maximum = Number(denominator.value);
    fillOptions(numerator, 0, maximum, Math.min(Number(numerator.value), maximum));
    updateComparison();
  });
  numerator.addEventListener("change", updateComparison);
}
function resetSimulation() {
  for (const key of ["a", "b"]) {
    const initial = initialFractions[key];
    fillOptions(controls[key].denominator, 1, MAX_DENOMINATOR, initial.denominator);
    fillOptions(controls[key].numerator, 0, initial.denominator, initial.numerator);
  }
  updateComparison();
}
document.querySelector("#reiniciar").addEventListener("click", resetSimulation);
/* 06. IMPRESIÓN · reutiliza contenido actual para evitar duplicar la tabla y la ficha. */
function preparePrintDocument() {
  const table = document.querySelector(".curriculum-table").cloneNode(true);
  table.className = "document-table";
  table.querySelectorAll("a").forEach(link => link.remove());
  document.querySelector("#print-curriculum").replaceChildren(table);
  const worksheet = document.querySelector("#ficha-trabajo").cloneNode(true);
  worksheet.removeAttribute("id");
  worksheet.querySelectorAll("a, .eyebrow, h2").forEach(node => node.remove());
  worksheet.querySelector("p")?.remove();
  document.querySelector("#print-worksheet").replaceChildren(worksheet);
}
document.querySelector("#imprimir").addEventListener("click", () => {
  preparePrintDocument();
  window.print();
});
window.addEventListener("beforeprint", preparePrintDocument);
preparePrintDocument();
resetSimulation();
