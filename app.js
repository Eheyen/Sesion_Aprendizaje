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
  prepareSavedRoster();
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

/* 07. DATOS DE LA SESIÓN · localStorage y texto seguro para impresión.
   Cancelar o Escape descarta la edición; guardar actualiza la plantilla. */
const SETTINGS_KEY = "sesion-fracciones-datos-v1";
const sessionKeys = ["institucion", "docente", "seccion", "fecha"];
const limits = { institucion: 120, docente: 100, seccion: 30, fecha: 10 };
function normalizeSessionData(input) {
  const data = {};
  for (const key of sessionKeys) {
    data[key] = typeof input?.[key] === "string" ? input[key].trim().slice(0, limits[key]) : "";
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.fecha)) data.fecha = "";
  return data;
}
let sessionData = normalizeSessionData({});
try { sessionData = normalizeSessionData(JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}")); } catch { /* El formulario funciona incluso sin almacenamiento. */ }
const settingsDialog = document.querySelector("#datos-dialog");
const settingsForm = document.querySelector("#datos-form");
const settingsButton = document.querySelector("#configurar-datos");
const settingsStatus = document.querySelector("#datos-status");
let statusTimer;
function applySessionData() {
  for (const key of sessionKeys) {
    let value = sessionData[key];
    if (key === "fecha" && value) value = value.split("-").reverse().join(" / ");
    const placeholder = key === "fecha" ? "____ / ____ / ______" : "____________________________";
    document.querySelectorAll('[data-session-field="' + key + '"]').forEach(cell => {
      cell.textContent = value || placeholder;
    });
  }
}
settingsButton.addEventListener("click", () => {
  for (const key of sessionKeys) settingsForm.elements.namedItem(key).value = sessionData[key];
  settingsDialog.showModal();
});
document.querySelector("#cancelar-datos").addEventListener("click", () => settingsDialog.close());
settingsDialog.addEventListener("close", () => settingsButton.focus());
settingsForm.addEventListener("submit", event => {
  event.preventDefault();
  if (!settingsForm.reportValidity()) return;
  const values = {};
  for (const key of sessionKeys) values[key] = settingsForm.elements.namedItem(key).value;
  sessionData = normalizeSessionData(values);
  let message = "✓ Datos guardados. Ya aparecerán al imprimir.";
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(sessionData)); }
  catch { message = "Datos aplicados a la impresión. Este navegador no permite conservarlos al cerrar."; }
  applySessionData();
  settingsDialog.close();
  clearTimeout(statusTimer);
  settingsStatus.textContent = message;
  statusTimer = setTimeout(() => { settingsStatus.textContent = ""; }, 6500);
});
applySessionData();

/* 08. RECURSOS EN VENTANAS · mantiene valores y devuelve el foco al cerrar. */
for (const modal of document.querySelectorAll(".resource-dialog")) {
  let opener;
  document.querySelectorAll('[data-open-resource="' + modal.id + '"]').forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      opener = link;
      modal.showModal();
    });
  });
  modal.querySelector("[data-close-resource]").addEventListener("click", () => modal.close());
  modal.addEventListener("close", () => opener?.focus());
  modal.querySelectorAll('a[href^="#"]:not([data-open-resource])').forEach(link => {
    link.addEventListener("click", () => modal.close());
  });
}
document.querySelectorAll("[data-print-session]").forEach(button => {
  button.addEventListener("click", () => {
    button.closest("dialog").close();
    document.querySelector("#imprimir").click();
  });
});

/* 09. LISTA GUARDADA · leer al imprimir para recoger cambios desde otra pestaña.
   Se crea con textContent para tratar los nombres como texto, nunca como HTML. */
function prepareSavedRoster() {
  const container = document.querySelector("#print-saved-roster");
  if (!container) return;
  let rows = [];
  try {
    const saved = JSON.parse(localStorage.getItem("sesion-fracciones-cotejo-v1") || "null");
    if (Array.isArray(saved?.rows)) rows = saved.rows.slice(0,200).filter(row => row && typeof row.name === "string");
  } catch { /* Sin datos guardados, imprimir una lista en blanco. */ }
  if (!rows.length) rows = Array.from({length:20}, () => ({name:"",marks:[],notes:""}));
  container.replaceChildren();
  const criteria = ["C1: Representa unidades iguales y partes del mismo tamaño.", "C2: Identifica y explica numerador y denominador.", "C3: Construye equivalencias aplicando el mismo factor.", "C4: Justifica con gráficos y procedimientos numéricos."];
  for (let start = 0; start < rows.length; start += 12) {
    const page = document.createElement("section");
    page.className = "print-page roster-print-page";
    const header = document.createElement("header"); header.className = "document-header";
    const title = document.createElement("h2"); title.textContent = "LISTA DE COTEJO · FRACCIONES EQUIVALENTES";
    header.append(title); page.append(header);
    const meta = document.createElement("p");
    const readField = key => document.querySelector('[data-session-field="' + key + '"]')?.textContent || "________";
    meta.textContent = "Institución: " + readField("institucion") + " · Docente: " + readField("docente") + " · 1.° de secundaria · Sección: " + readField("seccion") + " · Fecha: " + readField("fecha");
    page.append(meta);
    const list = document.createElement("ul");
    criteria.forEach(text => { const li = document.createElement("li"); li.textContent = text; list.append(li); });
    page.append(list);
    const note = document.createElement("p"); note.textContent = "Sí / No / No observado. Evidencia: ficha de trabajo y explicación del estudiante."; page.append(note);
    const table = document.createElement("table"); table.className = "document-table saved-roster-table";
    const thead = document.createElement("thead"); const heading = document.createElement("tr");
    ["N.°","Apellidos y nombres","C1","C2","C3","C4","Observaciones"].forEach(text => { const th = document.createElement("th"); th.scope = "col"; th.textContent = text; heading.append(th); });
    thead.append(heading); table.append(thead);
    const tbody = document.createElement("tbody");
    rows.slice(start,start+12).forEach((row,i) => {
      const tr = document.createElement("tr");
      const marks = Array.from({length:4}, (_,c) => ["Sí","No","No observado"].includes(row.marks?.[c]) ? row.marks[c] : "");
      [String(start+i+1),row.name.slice(0,180),...marks,typeof row.notes === "string" ? row.notes.slice(0,250) : ""].forEach(text => { const td = document.createElement("td"); td.textContent = text; tr.append(td); });
      tbody.append(tr);
    });
    table.append(tbody); page.append(table);
    const footer = document.createElement("footer"); footer.textContent = "MATEMÁTICA · Lista de cotejo · " + (start/12+1) + " de " + Math.ceil(rows.length/12); page.append(footer);
    container.append(page);
  }
}
