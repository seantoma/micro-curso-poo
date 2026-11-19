import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PLANTILLAS } from "../src/content/plantillas.js";
import { FORMATOS } from "../src/content/normas.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "plantillas");
mkdirSync(root, { recursive: true });

function escape(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function page(plantilla) {
  const route = plantilla.route.map((step, index) => `<li><span>${index + 1}</span>${escape(step)}</li>`).join("");
  const example = plantilla.example
    .map(([label, value]) => `<tr><th>${escape(label)}</th><td>${escape(value)}</td></tr>`)
    .join("");
  const blank = plantilla.blank
    .map((label) => `<tr><th>${escape(label)}</th><td class="blank"></td></tr>`)
    .join("");
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Semana ${plantilla.week} · ${escape(plantilla.title)}</title>
  <style>
    body { font-family: "Segoe UI", sans-serif; color: #0f172a; margin: 0; background: #f8fafc; }
    main { max-width: 820px; margin: 0 auto; padding: 2rem 1.2rem 3rem; }
    h1 { font-size: 1.7rem; margin-bottom: 0.2rem; }
    h2 { font-size: 1.15rem; margin-top: 1.8rem; }
    p, li { line-height: 1.45; }
    .kicker { color: #1d4ed8; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; }
    ol { list-style: none; padding: 0; }
    ol li { display: flex; gap: 0.7rem; margin: 0.45rem 0; }
    ol span { width: 1.6rem; height: 1.6rem; border-radius: 999px; background: #dbeafe; color: #1d4ed8; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; flex: none; }
    table { width: 100%; border-collapse: collapse; background: white; }
    th, td { border: 1px solid #cbd5e1; text-align: left; vertical-align: top; padding: 0.55rem 0.7rem; }
    th { width: 34%; background: #f1f5f9; }
    td.blank { height: 2.6rem; }
    a { color: #1d4ed8; }
    @media print { body { background: white; } main { padding: 0; } }
  </style>
</head>
<body>
  <main>
    <p class="kicker">Semana ${plantilla.week} · hoja de ruta y formato</p>
    <h1>${escape(plantilla.title)}</h1>
    <p>${escape(plantilla.syllabus)}</p>
    <h2>Hoja de ruta</h2>
    <ol>${route}</ol>
    <h2>Ejemplo resuelto · préstamo de un ejemplar</h2>
    <table>${example}</table>
    <h2>Formato en blanco</h2>
    <p>Completa la misma ruta con otro caso. Imprime la hoja o edita una copia.</p>
    <table>${blank}</table>
    <p><a href="./index.html">Volver a las plantillas</a></p>
  </main>
</body>
</html>`;
}

function index() {
  const items = PLANTILLAS.map(
    (plantilla) =>
      `<li><a href="./semana-0${plantilla.week}.html">Semana ${plantilla.week} · ${escape(plantilla.title)}</a><br />${escape(plantilla.syllabus)}</li>`,
  ).join("");
  const words = FORMATOS.map(
    (formato) =>
      `<li><a href="./word/${formato.file}">${escape(formato.id)} · ${escape(formato.title)}</a><br />${escape(formato.norm)} — ${escape(formato.normName)}</li>`,
  ).join("");
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Plantillas · Desarrollo de Software Orientado a Objetos</title>
  <style>
    body { font-family: "Segoe UI", sans-serif; color: #0f172a; margin: 0; background: #f8fafc; }
    main { max-width: 760px; margin: 0 auto; padding: 2rem 1.2rem 3rem; }
    a { color: #1d4ed8; font-weight: 600; }
    li { margin: 0.9rem 0; }
  </style>
</head>
<body>
  <main>
    <h1>Plantillas y hojas de ruta</h1>
    <p>Cada hoja trae la ruta de la semana, un ejemplo resuelto del préstamo y un formato en blanco.</p>
    <ol>${items}</ol>
    <h2>Plantillas Word</h2>
    <p>Cada archivo trae control de documento, la norma que ordena el formato y tablas para completar. No copian el texto oficial de la norma.</p>
    <ol>${words}</ol>
    <p><a href="../">Volver al curso</a></p>
  </main>
</body>
</html>`;
}

for (const plantilla of PLANTILLAS) {
  writeFileSync(join(root, `semana-0${plantilla.week}.html`), page(plantilla), "utf8");
}
writeFileSync(join(root, "index.html"), index(), "utf8");
console.log(`Plantillas escritas en ${root}`);
