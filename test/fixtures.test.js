import test from "node:test";
import assert from "node:assert/strict";
import { gradeDossier } from "../src/labs/grade.js";
import { runLoanFixtures } from "../src/labs/fixtures.js";
import { WEEKS } from "../src/content/weeks.js";

const loan = [
  { label: "E-204 está disponible", start: "disponible", state: "prestado", error: false },
  { label: "E-204 ya está prestado", start: "prestado", state: "prestado", error: true },
];

const javaLends = `class Ejemplar {
    String estado = "prestado";
    void prestar() {
        if (!estado.equals("disponible")) {
            throw new IllegalStateException("El ejemplar no está disponible");
        }
        estado = "prestado";
    }
}`;

const pythonLends = `class Ejemplar:
    def __init__(self):
        self.estado = "prestado"
    def prestar(self):
        if self.estado != "disponible":
            raise ValueError("El ejemplar no está disponible")
        self.estado = "prestado"
`;

test("prestar válido cambia el ejemplar libre y rechaza el que ya está prestado", () => {
  for (const source of [javaLends, pythonLends]) {
    const result = runLoanFixtures(source, loan);
    assert.equal(result.ok, true, result.notes.join(" "));
  }
});

test("un método vacío no presta y un parche a disponible no avisa", () => {
  const empty = runLoanFixtures(`void prestar() {\n}\n`, [loan[0]]);
  assert.equal(empty.ok, false);
  const patch = runLoanFixtures(`void prestar() {\n    estado = "disponible";\n}\n`, loan);
  assert.equal(patch.ok, false);
});

test("crear otro ejemplar rompe la identidad", () => {
  const source = `void prestar() {\n    Ejemplar otro = new Ejemplar();\n    estado = "prestado";\n}\n`;
  const result = runLoanFixtures(source, [
    { label: "mismo objeto", start: "disponible", state: "prestado", error: false, sameObject: true },
  ]);
  assert.equal(result.ok, false);
  assert.match(result.notes.join(" "), /otro ejemplar/);
});

test("el estado privado del objeto no es una variable global", () => {
  const hidden = runLoanFixtures(
    `class Ejemplar {\n    private String estado = "disponible";\n    public void prestar() {\n        estado = "prestado";\n    }\n}\n`,
    [{ label: "oculto", start: "disponible", state: "prestado", error: false, encapsulated: true }],
  );
  assert.equal(hidden.ok, true, hidden.notes.join(" "));
  const global = runLoanFixtures(
    `estado = "disponible"\ndef prestar():\n    global estado\n    estado = "prestado"\n`,
    [{ label: "oculto", start: "disponible", state: "prestado", error: false, encapsulated: true }],
  );
  assert.equal(global.ok, false);
});

test("el dossier pide relación, contrato y validación con palabras del estudiante", () => {
  const short = gradeDossier("Usa interfaz.");
  assert.equal(short.ok, false);
  const full = gradeDossier(
    "Biblioteca compone los ejemplares y Prestamo solo se asocia, porque el ejemplar sigue si se borra el préstamo. Catalogo es el contrato: el servicio llama apartar sin conocer la lista. Si el ejemplar no está disponible, prestar valida y avisa sin cambiar el estado.",
  );
  assert.equal(full.ok, true, full.notes.join(" "));
});

test("las semanas de calidad traen repaso, transferencia, revisión, traza y dossier", () => {
  const has = (week, type, id) => week.blocks.some((block) => block.type === type && block.id === id);
  assert.ok(has(WEEKS[1], "codePick", "t2-transfer"));
  assert.ok(has(WEEKS[3], "section", "repaso"));
  assert.ok(has(WEEKS[3], "quiz", "c4-revision"));
  assert.ok(has(WEEKS[3], "quiz", "t4-transfer"));
  assert.ok(has(WEEKS[5], "section", "repaso"));
  assert.ok(has(WEEKS[5], "quiz", "c6-revision"));
  assert.ok(has(WEEKS[7], "section", "repaso"));
  assert.ok(has(WEEKS[7], "quiz", "s8-traza"));
  assert.ok(has(WEEKS[7], "dossier", "s8-dossier"));
  const rubric = WEEKS[7].blocks.find((block) => block.id === "s8-dossier");
  assert.equal(rubric.criteria.length, 4);
});
