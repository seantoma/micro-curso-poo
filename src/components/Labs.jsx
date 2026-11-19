import { useEffect, useState } from "react";
import { gradeCode, gradeDiagram } from "../labs/grade.js";
import { runLoanFixtures } from "../labs/fixtures.js";
import { readJson, writeJson } from "../storage.js";
import {
  ActivityDiagram,
  Association,
  ClassNode,
  Generalization,
  SequenceDiagram,
  UseCaseDiagram,
} from "./UmlFigures.jsx";

function Feedback({ result, okText }) {
  if (!result) return null;
  return (
    <div className={result.ok ? "feedback ok" : "feedback"}>
      <p>{result.ok ? okText : "Todavía no cierra."}</p>
      {result.notes.length ? (
        <ul>
          {result.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function Chip({ label, on, onClick }) {
  return (
    <button type="button" className={on ? "chip on" : "chip"} aria-pressed={on} onClick={onClick}>
      {label}
    </button>
  );
}

function Reading({ lines }) {
  if (!lines.length) return null;
  return (
    <aside className="diagram-read">
      <p className="kicker">Cómo se lee</p>
      <ul>
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </aside>
  );
}

function ClassPreview({ answer }) {
  return (
    <ClassNode
      name={answer.name || "Clase"}
      attributes={answer.attributes || []}
      methods={answer.methods || []}
    />
  );
}

export function DiagramLab({ week, block }) {
  const storageKey = `lab:${week}:${block.id}`;
  const [answer, setAnswer] = useState(() => initialDiagram(block));
  const [slot, setSlot] = useState("attributes");
  const [result, setResult] = useState(null);

  useEffect(() => {
    const saved = readJson(storageKey, null);
    if (saved?.answer) setAnswer(saved.answer);
    if (saved?.result) setResult(saved.result);
  }, [storageKey]);

  function update(next) {
    setAnswer(next);
    setResult(null);
    writeJson(storageKey, { answer: next, result: null });
  }

  function check() {
    const graded = gradeDiagram(block, answer);
    setResult(graded);
    writeJson(storageKey, { answer, result: graded });
  }

  return (
    <section className="block lab">
      <h3>{block.title}</h3>
      <p className="hint">{block.prompt}</p>
      {block.kind === "message" ? <MessageBoard block={block} answer={answer} update={update} /> : null}
      {block.kind === "classbox" ? (
        <ClassBoard block={block} answer={answer} update={update} slot={slot} setSlot={setSlot} />
      ) : null}
      {block.kind === "relation" ? <RelationBoard block={block} answer={answer} update={update} /> : null}
      {block.kind === "hierarchy" ? <HierarchyBoard block={block} answer={answer} update={update} /> : null}
      {block.kind === "usecase" ? <UsecaseBoard block={block} answer={answer} update={update} /> : null}
      {block.kind === "flow" ? <FlowBoard answer={answer} update={update} /> : null}
      <button type="button" onClick={check}>
        Comprobar diagrama
      </button>
      <Feedback result={result} okText="El diagrama cumple el reto." />
    </section>
  );
}

function MessageBoard({ block, answer, update }) {
  const names = block.lifelines || {};
  const lifelines = [answer.from, answer.to].map((name) => (name ? names[name] || name : "?"));
  const messages = [{ from: 0, to: 1, label: answer.message || "mensaje" }];
  if (answer.reply) messages.push({ from: 1, to: 0, label: answer.reply, kind: "return" });
  const lines = [];
  if (answer.from && answer.to) {
    lines.push(`${lifelines[0]} y ${lifelines[1]} son objetos, no clases. La línea punteada es la vida de ese mismo objeto.`);
  }
  if (answer.message) {
    lines.push(`La flecha llena es el mensaje ${answer.message}. La barra sobre quien recibe es la activación: ahí corre el método.`);
  }
  if (answer.reply) {
    lines.push(`La flecha punteada devuelve «${answer.reply}». Es la respuesta del mismo objeto, no un ejemplar nuevo.`);
  }
  return (
    <div className="lab-grid">
      {["from", "message", "to", "reply"].map((field) => (
        <div key={field}>
          <p className="kicker">
            {field === "from" ? "Emisor" : field === "message" ? "Mensaje" : field === "to" ? "Receptor" : "Respuesta"}
          </p>
          <div className="chip-bank">
            {(block.options[field] || []).map((option) => (
              <Chip key={option} label={option} on={answer[field] === option} onClick={() => update({ ...answer, [field]: option })} />
            ))}
          </div>
        </div>
      ))}
      <div className="lab-preview">
        <SequenceDiagram lifelines={lifelines} messages={messages} />
        <Reading lines={lines} />
      </div>
    </div>
  );
}

function ClassBoard({ block, answer, update, slot, setSlot }) {
  const placed = new Set([answer.name, ...answer.attributes, ...answer.methods].filter(Boolean));

  function toggle(chip) {
    const next = {
      name: answer.name === chip ? "" : answer.name,
      attributes: answer.attributes.filter((item) => item !== chip),
      methods: answer.methods.filter((item) => item !== chip),
    };
    const wasPlaced = answer.name === chip || answer.attributes.includes(chip) || answer.methods.includes(chip);
    if (!wasPlaced) {
      if (slot === "name") next.name = chip;
      else next[slot] = [...next[slot], chip];
    }
    update(next);
  }

  return (
    <div className="lab-grid">
      <div className="slot-switch" role="group" aria-label="Compartimento de la clase">
        {[
          ["name", "Nombre"],
          ["attributes", "Atributos"],
          ["methods", "Métodos"],
        ].map(([id, label]) => (
          <button key={id} type="button" className={slot === id ? "chip on" : "chip"} aria-pressed={slot === id} onClick={() => setSlot(id)}>
            {label}
          </button>
        ))}
      </div>
      <div className="chip-bank">
        {block.bank.map((chip) => (
          <Chip key={chip} label={chip} on={placed.has(chip)} onClick={() => toggle(chip)} />
        ))}
      </div>
      <ClassPreview answer={answer} />
      <Reading lines={readClass(answer)} />
    </div>
  );
}

function RelationBoard({ block, answer, update }) {
  const fields = [
    ["left", "Extremo izquierdo"],
    ["kind", "Vínculo"],
    ["right", "Extremo derecho"],
    ["role", "Nombre del vínculo"],
    ["leftMult", "Multiplicidad izquierda"],
    ["rightMult", "Multiplicidad derecha"],
  ];
  return (
    <div className="lab-grid">
      {fields.map(([field, label]) => (
        <label key={field} className="lab-field">
          <span>{label}</span>
          <select value={answer[field] || ""} onChange={(event) => update({ ...answer, [field]: event.target.value })}>
            <option value="">Elegir</option>
            {block.options[field].map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
      ))}
      <Association
        left={answer.left || "?"}
        right={answer.right || "?"}
        kind={answer.kind || "asociación"}
        label={answer.role}
        leftMult={answer.leftMult}
        rightMult={answer.rightMult}
        leftNode={profileNode(block, answer.left)}
        rightNode={profileNode(block, answer.right)}
      />
      <Reading lines={readRelation(answer)} />
    </div>
  );
}

function HierarchyBoard({ block, answer, update }) {
  function toggleChild(child) {
    const children = answer.children.includes(child)
      ? answer.children.filter((item) => item !== child)
      : [...answer.children, child];
    update({ ...answer, children });
  }

  return (
    <div className="lab-grid">
      <div>
        <p className="kicker">Padre</p>
        <div className="chip-bank">
          {block.parents.map((parent) => (
            <Chip key={parent} label={parent} on={answer.parent === parent} onClick={() => update({ ...answer, parent })} />
          ))}
        </div>
      </div>
      <label className="check-line">
        <input
          type="checkbox"
          checked={Boolean(answer.abstract)}
          onChange={(event) => update({ ...answer, abstract: event.target.checked })}
        />
        La clase padre es abstracta
      </label>
      <div>
        <p className="kicker">Hijos</p>
        <div className="chip-bank">
          {block.children.map((child) => (
            <Chip key={child} label={child} on={answer.children.includes(child)} onClick={() => toggleChild(child)} />
          ))}
        </div>
      </div>
      <Generalization
        parent={{
          name: answer.parent || "Padre",
          abstract: answer.abstract,
          members: (block.catalog && block.catalog[answer.parent]) || [],
        }}
        children={(answer.children || []).map((name) => ({
          name,
          members: (block.catalog && block.catalog[name]) || [],
        }))}
      />
      <Reading lines={readHierarchy(answer)} />
    </div>
  );
}

function UsecaseBoard({ block, answer, update }) {
  function toggleCase(item) {
    const cases = answer.cases.includes(item)
      ? answer.cases.filter((entry) => entry !== item)
      : [...answer.cases, item];
    update({ ...answer, cases });
  }

  return (
    <div className="lab-grid">
      <div>
        <p className="kicker">Actor</p>
        <div className="chip-bank">
          {block.actors.map((actor) => (
            <Chip key={actor} label={actor} on={answer.actor === actor} onClick={() => update({ ...answer, actor })} />
          ))}
        </div>
      </div>
      <div>
        <p className="kicker">Sistema</p>
        <div className="chip-bank">
          {block.systems.map((system) => (
            <Chip key={system} label={system} on={answer.system === system} onClick={() => update({ ...answer, system })} />
          ))}
        </div>
      </div>
      <div>
        <p className="kicker">Dentro del sistema</p>
        <div className="chip-bank">
          {block.cases.map((item) => (
            <Chip key={item} label={item} on={answer.cases.includes(item)} onClick={() => toggleCase(item)} />
          ))}
        </div>
      </div>
      <UseCaseDiagram
        actors={[answer.actor || "Actor"]}
        system={answer.system || "Sistema"}
        cases={answer.cases || []}
        links={answer.cases || []}
        relations={chosenRelation(block, answer) ? [chosenRelation(block, answer)] : []}
      />
      <div>
        <p className="kicker">Relación entre casos</p>
        <div className="chip-bank">
          {(block.relations || []).map((item) => (
            <Chip
              key={item.id}
              label={`${item.kind}: ${item.from} → ${item.to}`}
              on={answer.relation === item.id}
              onClick={() => update({ ...answer, relation: item.id })}
            />
          ))}
        </div>
      </div>
      <Reading lines={readUseCase(answer, chosenRelation(block, answer))} />
    </div>
  );
}

function FlowBoard({ answer, update }) {
  function move(index, direction) {
    const next = index + direction;
    if (next < 0 || next >= answer.steps.length) return;
    const steps = [...answer.steps];
    const [item] = steps.splice(index, 1);
    steps.splice(next, 0, item);
    update({ steps });
  }

  return (
    <div className="lab-grid">
      <ActivityDiagram steps={answer.steps} guard="¿el estado es válido?" />
      <Reading lines={[
        "Reproducir mueve el testigo por el orden que armaste. En el rombo el proceso se detiene y eliges la rama.",
        "Disponible marca prestado y termina. Inválido sigue hacia abajo: no cambia el ejemplar, avisa y deja la decisión arriba.",
      ]} />
      <ol className="flow-lab">
        {answer.steps.map((step, index) => (
          <li key={step}>
            <span>{index + 1}. {step}</span>
            <span className="row-actions">
              <button type="button" onClick={() => move(index, -1)} disabled={index === 0}>Subir</button>
              <button type="button" onClick={() => move(index, 1)} disabled={index === answer.steps.length - 1}>Bajar</button>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function CodeLab({ week, block }) {
  const storageKey = `lab:${week}:${block.id}`;
  const [language, setLanguage] = useState("java");
  const [drafts, setDrafts] = useState({
    java: block.languages.java.starter,
    python: block.languages.python.starter,
  });
  const [result, setResult] = useState(null);

  useEffect(() => {
    const saved = readJson(storageKey, null);
    if (saved?.drafts) setDrafts(saved.drafts);
    if (saved?.language) setLanguage(saved.language);
    if (saved?.result) setResult(saved.result);
  }, [storageKey]);

  function edit(value) {
    const next = { ...drafts, [language]: value };
    setDrafts(next);
    setResult(null);
    writeJson(storageKey, { drafts: next, language, result: null });
  }

  function switchLanguage(nextLanguage) {
    setLanguage(nextLanguage);
    setResult(null);
    writeJson(storageKey, { drafts, language: nextLanguage, result: null });
  }

  function check() {
    const graded = gradeCode(block.languages[language], drafts[language]);
    const fixtures = block.fixtures ? runLoanFixtures(drafts[language], block.fixtures) : null;
    const next = {
      ok: graded.ok && (fixtures ? fixtures.ok : true),
      notes: graded.notes,
      rows: fixtures?.rows || [],
    };
    setResult(next);
    writeJson(storageKey, { drafts, language, result: next });
  }

  return (
    <section className="block lab">
      <h3>{block.title}</h3>
      <p className="hint">{block.prompt}</p>
      <div className="lang-tabs" role="tablist" aria-label="Lenguaje del laboratorio">
        {["java", "python"].map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={language === item}
            className={language === item ? "chip on" : "chip"}
            onClick={() => switchLanguage(item)}
          >
            {item === "java" ? "Java" : "Python"}
          </button>
        ))}
      </div>
      <textarea
        className="code-lab"
        spellCheck="false"
        aria-label={`Código en ${language}`}
        value={drafts[language]}
        onChange={(event) => edit(event.target.value)}
      />
      <button type="button" onClick={check}>
        Comprobar código
      </button>
      {block.fixtures ? (
        <p className="hint">Las pruebas simulan prestar() con dos estados iniciales del ejemplar. No compilan Java ni Python.</p>
      ) : null}
      {result?.rows?.length ? (
        <ul className="fixture-list">
          {result.rows.map((row) => (
            <li key={row.label} className={row.ok ? "ok" : ""}>
              <strong>{row.label}</strong>
              <span>{row.ok ? "Cumple la prueba." : row.problems[0]}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <Feedback result={result} okText="El fragmento cumple las condiciones del laboratorio." />
    </section>
  );
}

function initialDiagram(block) {
  if (block.kind === "message") return { from: "", message: "", to: "", reply: "" };
  if (block.kind === "classbox") return { name: "", attributes: [], methods: [] };
  if (block.kind === "relation") return { left: "", right: "", kind: "", role: "", leftMult: "", rightMult: "" };
  if (block.kind === "hierarchy") return { parent: "", abstract: false, children: [] };
  if (block.kind === "usecase") return { actor: "", system: "", cases: [], relation: "" };
  return { steps: [...block.start] };
}

function profileNode(block, name) {
  const profile = block.profiles?.[name];
  if (!name || !profile) return undefined;
  return <ClassNode name={name} attributes={profile.attributes} methods={profile.methods} />;
}

function readClass(answer) {
  const lines = [];
  if (answer.name) lines.push(`${answer.name} es la clase: el molde. El ejemplar concreto no se dibuja en esta caja.`);
  for (const attribute of answer.attributes || []) {
    const visibility = attribute.startsWith("-")
      ? "El signo menos lo oculta: solo la clase lo usa."
      : attribute.startsWith("+")
        ? "El signo más lo publica."
        : "Está en el compartimento de atributos: es estado que el objeto recuerda.";
    lines.push(`${attribute}. ${visibility}`);
  }
  for (const method of answer.methods || []) {
    const visibility = method.startsWith("+")
      ? "El signo más la ofrece como mensaje."
      : "Está en el compartimento de operaciones: otra clase la pide, no reescribe el dato.";
    lines.push(`${method}. ${visibility}`);
  }
  return lines;
}

const RELATION_READ = {
  asociación: "Línea simple: se conocen y cada uno puede seguir si el otro desaparece.",
  composición: "Rombo lleno en el todo: la parte no vive fuera de él.",
  agregación: "Rombo vacío: el todo reúne partes que pueden salir.",
  herencia: "Triángulo vacío hacia el general. Se lee «es un», no «tiene un».",
  generalización: "Triángulo vacío hacia el general. Se lee «es un», no «tiene un».",
  dependencia: "Flecha punteada: lo usa un momento y no lo guarda como atributo.",
};

function readRelation(answer) {
  if (!answer.left && !answer.kind) return [];
  const kind = answer.kind || "vínculo";
  return [
    `${answer.leftMult || "?"} ${answer.left || "?"} ${kind} ${answer.role || ""} ${answer.rightMult || "?"} ${answer.right || "?"}.`.replace(/\s+/g, " "),
    RELATION_READ[kind] || "El tipo de línea cambia el significado del vínculo.",
    answer.role ? `«${answer.role}» es el nombre del vínculo: dice para qué se conocen, no cómo se implementan.` : "",
  ].filter(Boolean);
}

function readHierarchy(answer) {
  const lines = [];
  if (answer.parent) {
    lines.push(answer.abstract
      ? `${answer.parent} va en cursiva y con «abstracta»: no se construye con new. Los hijos sí.`
      : `${answer.parent} es el general. Esta semana todavía se puede pensar como clase concreta.`);
  }
  if (answer.children?.length) {
    lines.push(`${answer.children.join(" y ")} son un ${answer.parent || "padre"}. La operación común baja; cada hijo puede responder distinto.`);
  }
  return lines;
}

function chosenRelation(block, answer) {
  return (block.relations || []).find((item) => item.id === answer.relation && item.id !== "ninguna");
}

function readUseCase(answer, relation) {
  const lines = [];
  if (answer.actor || answer.system) {
    lines.push(`${answer.actor || "El actor"} queda fuera del borde. ${answer.system || "El sistema"} es el límite, no una clase interna.`);
  }
  if (answer.cases?.length) {
    lines.push(`Cada óvalo es una meta: ${answer.cases.join(", ")}. La línea simple los une al actor. Un botón o una tabla no entran ahí.`);
  }
  if (relation) {
    lines.push(`${relation.kind} de ${relation.from} hacia ${relation.to}. Include siempre ocurre. Extend solo si se cumple una condición, como el retraso.`);
  }
  return lines;
}
