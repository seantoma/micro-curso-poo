function notesOf(ok, notes) {
  return { ok, notes };
}

function sameSet(got, expected) {
  if (!Array.isArray(got) || got.length !== expected.length) return false;
  return expected.every((item) => got.includes(item));
}

function sameList(got, expected) {
  return Array.isArray(got) && got.length === expected.length && got.every((item, index) => item === expected[index]);
}

function gradeMessage(lab, answer) {
  const notes = [];
  if (answer.from !== lab.expect.from) notes.push("Quien envía el mensaje no es un objeto del problema.");
  if (answer.message !== lab.expect.message) notes.push("Eso no es un mensaje: es una instrucción que manipula el dato desde fuera.");
  if (answer.to !== lab.expect.to) notes.push("El mensaje tiene que llegar al objeto que guarda el estado.");
  return notesOf(notes.length === 0, notes);
}

function gradeClassbox(lab, answer) {
  const notes = [];
  if (answer.name !== lab.expect.name) notes.push("El nombre de la caja es la clase, no un dato ni otro objeto.");
  if (!sameSet(answer.attributes, lab.expect.attributes)) {
    notes.push("Los atributos no coinciden con lo que la clase recuerda.");
  }
  if (!sameSet(answer.methods, lab.expect.methods)) {
    notes.push("Los métodos no coinciden con el comportamiento de la clase.");
  }
  return notesOf(notes.length === 0, notes);
}

function gradeRelation(lab, answer) {
  const notes = [];
  const expect = lab.expect;
  if (answer.left !== expect.left || answer.right !== expect.right) {
    notes.push("Las clases de los extremos no son las de esta asociación.");
  }
  if (answer.kind !== expect.kind) notes.push("El tipo de relación no corresponde al vínculo.");
  if (answer.leftMult !== expect.leftMult || answer.rightMult !== expect.rightMult) {
    notes.push("La multiplicidad no dice cuántos objetos participan.");
  }
  return notesOf(notes.length === 0, notes);
}

function gradeHierarchy(lab, answer) {
  const notes = [];
  if (answer.parent !== lab.expect.parent) notes.push("El padre de la generalización es otro.");
  if (Boolean(answer.abstract) !== Boolean(lab.expect.abstract)) {
    notes.push(lab.expect.abstract
      ? "Esta clase no se instancia: tiene que quedar marcada como abstracta."
      : "En esta semana la generalización no se marca como abstracta.");
  }
  const children = Array.isArray(answer.children) ? answer.children : [];
  for (const banned of lab.forbidChildren || []) {
    if (children.includes(banned)) notes.push(`${banned} no es un tipo de ${lab.expect.parent}.`);
  }
  if (!sameSet(children, lab.expect.children)) {
    notes.push("Los hijos tienen que ser exactamente los tipos que sí son un caso del padre.");
  }
  return notesOf(notes.length === 0, notes);
}

function gradeUsecase(lab, answer) {
  const notes = [];
  if (answer.actor !== lab.expect.actor) notes.push("El actor es quien tiene la meta, no un botón ni el sistema.");
  if (answer.system !== lab.expect.system) notes.push("El borde del sistema no es una clase interna.");
  const cases = Array.isArray(answer.cases) ? answer.cases : [];
  for (const banned of lab.forbidCases || []) {
    if (cases.includes(banned)) notes.push(`${banned} es un control de pantalla, no un caso de uso.`);
  }
  if (!sameSet(cases, lab.expect.cases)) notes.push("Dentro del sistema van las metas del actor, completas y sin controles.");
  return notesOf(notes.length === 0, notes);
}

function gradeFlow(lab, answer) {
  if (sameList(answer.steps, lab.expect)) return notesOf(true, []);
  return notesOf(false, ["El tratamiento quedó en otro orden. Validar va antes de avisar, y el estado no cambia si la validación falla."]);
}

export function gradeDiagram(lab, answer) {
  if (!answer) return notesOf(false, ["Arma el diagrama antes de comprobar."]);
  if (lab.kind === "message") return gradeMessage(lab, answer);
  if (lab.kind === "classbox") return gradeClassbox(lab, answer);
  if (lab.kind === "relation") return gradeRelation(lab, answer);
  if (lab.kind === "hierarchy") return gradeHierarchy(lab, answer);
  if (lab.kind === "usecase") return gradeUsecase(lab, answer);
  if (lab.kind === "flow") return gradeFlow(lab, answer);
  return notesOf(false, ["Este laboratorio no tiene corrector."]);
}

function matches(rule, text) {
  if (rule.regex) return new RegExp(rule.regex, rule.flags || "").test(text);
  return text.includes(rule.text);
}

export function gradeCode(lab, source) {
  const text = (source || "").trim();
  if (!text) return notesOf(false, ["Escribe el fragmento antes de comprobar."]);
  const notes = [];
  for (const rule of lab.need || []) {
    if (!matches(rule, text)) notes.push(rule.hint);
  }
  for (const rule of lab.forbid || []) {
    if (matches(rule, text)) notes.push(rule.hint);
  }
  return notesOf(notes.length === 0, notes);
}
