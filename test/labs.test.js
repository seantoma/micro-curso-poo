import test from "node:test";
import assert from "node:assert/strict";
import { gradeCode, gradeDiagram } from "../src/labs/grade.js";
import { WEEKS } from "../src/content/weeks.js";

test("el diagrama de mensaje distingue un envío de una asignación directa", () => {
  const lab = {
    kind: "message",
    expect: { from: "Usuario", message: "prestar()", to: "Ejemplar" },
  };
  assert.equal(gradeDiagram(lab, lab.expect).ok, true);
  const wrong = gradeDiagram(lab, { from: "Programa", message: "estado = prestado", to: "Ejemplar" });
  assert.equal(wrong.ok, false);
  assert.ok(wrong.notes.length > 0);
});

test("la caja de clase exige el conjunto de atributos y métodos", () => {
  const lab = {
    kind: "classbox",
    expect: { name: "Ejemplar", attributes: ["codigo", "estado"], methods: ["prestar()", "devolver()"] },
  };
  assert.equal(gradeDiagram(lab, lab.expect).ok, true);
  const swapped = gradeDiagram(lab, {
    name: "Ejemplar",
    attributes: ["prestar()", "estado"],
    methods: ["codigo", "devolver()"],
  });
  assert.equal(swapped.ok, false);
});

test("la relación comprueba clases, tipo y multiplicidad", () => {
  const lab = {
    kind: "relation",
    expect: { left: "Biblioteca", right: "Ejemplar", kind: "asociación", leftMult: "1", rightMult: "*" },
  };
  assert.equal(gradeDiagram(lab, lab.expect).ok, true);
  assert.equal(gradeDiagram(lab, { ...lab.expect, rightMult: "1" }).ok, false);
});

test("la jerarquía rechaza un hijo que no es un tipo del padre", () => {
  const lab = {
    kind: "hierarchy",
    expect: { parent: "Material", abstract: true, children: ["Libro", "Revista"] },
    forbidChildren: ["Prestamo"],
  };
  assert.equal(gradeDiagram(lab, lab.expect).ok, true);
  const extra = gradeDiagram(lab, { parent: "Material", abstract: true, children: ["Libro", "Revista", "Prestamo"] });
  assert.equal(extra.ok, false);
  assert.match(extra.notes.join(" "), /Prestamo/);
});

test("el caso de uso no acepta un control de pantalla como caso", () => {
  const lab = {
    kind: "usecase",
    expect: { actor: "Usuario", system: "Biblioteca", cases: ["Prestar ejemplar", "Devolver ejemplar"] },
    forbidCases: ["Botón prestar"],
  };
  assert.equal(gradeDiagram(lab, lab.expect).ok, true);
  const widget = gradeDiagram(lab, {
    actor: "Usuario",
    system: "Biblioteca",
    cases: ["Prestar ejemplar", "Botón prestar"],
  });
  assert.equal(widget.ok, false);
});

test("el flujo de error exige el orden del tratamiento", () => {
  const order = ["Validar", "No cambiar", "Avisar"];
  const lab = { kind: "flow", expect: order };
  assert.equal(gradeDiagram(lab, { steps: order }).ok, true);
  assert.equal(gradeDiagram(lab, { steps: ["Avisar", "Validar", "No cambiar"] }).ok, false);
});

test("el código vacío no aprueba y un catch vacío tampoco", () => {
  const lab = {
    need: [{ regex: "throw", hint: "Lanza el error." }],
    forbid: [{ regex: "catch\\s*\\([^)]*\\)\\s*\\{\\s*\\}", hint: "No tragues la excepción." }],
  };
  assert.equal(gradeCode(lab, "   ").ok, false);
  assert.equal(gradeCode(lab, "throw new IllegalStateException(\"prestado\");").ok, true);
  const swallowed = gradeCode(lab, "try { prestar(); } catch (Exception e) { }");
  assert.equal(swallowed.ok, false);
  assert.match(swallowed.notes.join(" "), /tragues/);
});

test("cada semana abre con teoría general y cierra el laboratorio con diagrama y código", () => {
  for (const week of WEEKS) {
    assert.ok(week.blocks.some((block) => block.type === "section" && block.id === "teoria"));
    assert.ok(week.blocks.some((block) => block.type === "section" && block.id === "laboratorio"));
    assert.ok(week.blocks.some((block) => block.type === "diagramLab"));
    assert.ok(week.blocks.some((block) => block.type === "codeLab"));
    const close = week.blocks.find((block) => block.type === "checklist");
    assert.ok(close.items.some((item) => item.id === "lab"));
    const diagram = week.blocks.find((block) => block.type === "diagramLab");
    const code = week.blocks.find((block) => block.type === "codeLab");
    assert.equal(gradeDiagram(diagram, diagram.solution).ok, true, `diagrama semana ${week.week}`);
    for (const language of ["java", "python"]) {
      const sample = code.languages[language];
      assert.equal(gradeCode(sample, sample.solution).ok, true, `${language} semana ${week.week}`);
      assert.equal(gradeCode(sample, sample.starter).ok, false, `el inicio de ${language} semana ${week.week} no debe aprobar`);
    }
  }
});
