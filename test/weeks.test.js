import test from "node:test";
import assert from "node:assert/strict";
import { WEEKS } from "../src/content/weeks.js";

const OFFICIAL = [
  ["Comprende conceptos clave de la POO."],
  [
    "Conoce los elementos propios de la POO.",
    "Define las técnicas de programación orientada a objetos (POO).",
  ],
  [
    "Utiliza herramienta de modelado.",
    "Aplica las técnicas de programación orientada a objetos.",
  ],
  [
    "Conoce el uso de las aplicaciones orientadas a objetos.",
    "Realiza el modelamiento de Clases.",
  ],
  [
    "Emplea los conceptos del lenguaje UML.",
    "Establece elementos en común de cómo funciona el paradigma de la POO.",
  ],
  [
    "Aplica los diagramas de casos de uso.",
    "Utiliza el diseño de aplicaciones con un correcto uso de las clases Interfaces.",
  ],
  [
    "Recursos web sobre el uso de una herramienta CASE en particular.",
    "Reconoce los conceptos relacionados con clases abstractas.",
  ],
  [
    "Construye el proceso de tratamiento de errores.",
    "Implementa los procesos de validaciones y depuraciones.",
  ],
];

test("el curso tiene las ocho frases oficiales de la malla", () => {
  assert.equal(WEEKS.length, 8);
  WEEKS.forEach((week, index) => {
    assert.equal(week.week, index + 1);
    assert.deepEqual(week.syllabus, OFFICIAL[index]);
    assert.ok(week.title.length > 8);
    assert.ok(week.summary.length > 40);
    assert.ok(week.minutes >= 40 && week.minutes <= 90);
    assert.ok(week.objectives.length >= 2);
    assert.ok(week.blocks.some((block) => block.type === "checklist"));
    assert.ok(week.blocks.some((block) => block.type === "codePair"));
    assert.ok(week.blocks.some((block) => block.type === "diagram"));
    assert.ok(week.blocks.some((block) => block.type === "codePick"));
    assert.ok(week.blocks.some((block) => block.type === "downloads"));
    assert.ok(week.blocks.some((block) => block.type === "match"));
    assert.ok(week.blocks.some((block) => block.type === "downloads" && block.items.some((item) => item.href.endsWith(".docx"))));
    const close = week.blocks.find((block) => block.type === "checklist");
    assert.ok(close.items.some((item) => item.id === "plantilla"));
    assert.ok(week.blocks.filter((block) => block.type !== "section").length >= 4);
  });
});

test("los identificadores de actividades no se repiten", () => {
  const ids = [];
  for (const week of WEEKS) {
    for (const block of week.blocks) {
      if (block.id) ids.push(`${week.week}:${block.id}`);
    }
  }
  assert.equal(new Set(ids).size, ids.length);
});
