import { useEffect, useState } from "react";
import { CodeLab, DiagramLab } from "./Labs.jsx";
import { readJson, writeJson } from "../storage.js";
import Diagram from "./Diagrams.jsx";
import { ClassNode, UseCaseDiagram } from "./UmlFigures.jsx";

function Paragraphs({ block }) {
  return (
    <div className="prose">
      {block.paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}

function Callout({ block }) {
  return (
    <aside className={`callout ${block.tone || "note"}`}>
      <strong>{block.title}</strong>
      <p>{block.body}</p>
    </aside>
  );
}

function Cards({ block }) {
  return (
    <section className="block">
      <h3>{block.title}</h3>
      <ul className="card-grid">
        {block.items.map((item) => (
          <li key={item.title} className="info-card">
            <span className="kicker">{item.kicker}</span>
            <h4>{item.title}</h4>
            <p>{item.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Compare({ block }) {
  return (
    <section className="block">
      <h3>{block.title}</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{block.leftTitle}</th>
              <th>{block.rightTitle}</th>
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row) => (
              <tr key={row[0]}>
                <td>{row[0]}</td>
                <td>{row[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Flip({ block }) {
  const [open, setOpen] = useState({});
  return (
    <section className="block">
      <h3>{block.title}</h3>
      <p className="hint">{block.hint}</p>
      <ul className="flip-grid">
        {block.cards.map((card) => {
          const shown = Boolean(open[card.front]);
          return (
            <li key={card.front}>
              <button
                type="button"
                className={shown ? "flip on" : "flip"}
                aria-pressed={shown}
                onClick={() => setOpen((current) => ({ ...current, [card.front]: !current[card.front] }))}
              >
                <span className="flip-inner">
                  <span className="flip-face front">
                    <span className="kicker">Frente</span>
                    {card.front}
                  </span>
                  <span className="flip-face back">
                    <span className="kicker">Reverso</span>
                    {card.back}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Trail({ week, block }) {
  const storageKey = `trail:${week}:${block.title}`;
  const [open, setOpen] = useState(null);
  const [seen, setSeen] = useState({});

  useEffect(() => {
    setSeen(readJson(storageKey, {}));
  }, [storageKey]);

  function toggle(id) {
    setOpen((current) => (current === id ? null : id));
    setSeen((current) => {
      const next = { ...current, [id]: true };
      writeJson(storageKey, next);
      return next;
    });
  }

  const total = block.items.length;
  const count = block.items.filter((item) => seen[item.id]).length;

  return (
    <section className="block">
      <h3>{block.title}</h3>
      <p className="hint">{block.hint}</p>
      <p className="progress-line">
        {count} de {total} piezas abiertas
      </p>
      <div className="meter" aria-hidden="true">
        <span style={{ width: `${total ? (count / total) * 100 : 0}%` }} />
      </div>
      <ul className="trail">
        {block.items.map((item) => {
          const isOpen = open === item.id;
          return (
            <li key={item.id} className={seen[item.id] ? "seen" : ""}>
              <button type="button" aria-expanded={isOpen} onClick={() => toggle(item.id)}>
                <span>{item.title}</span>
                <span aria-hidden="true">{isOpen ? "–" : "+"}</span>
              </button>
              {isOpen ? <p>{item.body}</p> : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Steps({ block }) {
  const [index, setIndex] = useState(0);
  const step = block.steps[index];
  return (
    <section className="block">
      <h3>{block.title}</h3>
      <ol className="step-rail">
        {block.steps.map((item, stepIndex) => (
          <li key={item.title}>
            <button
              type="button"
              aria-current={stepIndex === index ? "step" : undefined}
              onClick={() => setIndex(stepIndex)}
            >
              {stepIndex + 1}
              <span>{item.title}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="step-card" key={step.title}>
        <h4>{step.title}</h4>
        <p>{step.body}</p>
      </div>
      <div className="row-actions">
        <button type="button" onClick={() => setIndex((value) => value - 1)} disabled={index === 0}>
          Anterior
        </button>
        <button
          type="button"
          onClick={() => setIndex((value) => value + 1)}
          disabled={index === block.steps.length - 1}
        >
          Siguiente
        </button>
      </div>
    </section>
  );
}

function CodeBlock({ block }) {
  return (
    <section className="block">
      <h3>{block.title}</h3>
      <pre>
        <code>{block.code}</code>
      </pre>
    </section>
  );
}

function ClassDiagram({ block }) {
  return (
    <section className="block">
      <h3>{block.title}</h3>
      {block.caption ? <p className="hint">{block.caption}</p> : null}
      <div className="class-grid">
        {block.classes.map((item) => (
          <ClassNode key={item.name} name={item.name} attributes={item.attributes} methods={item.methods} />
        ))}
      </div>
      <ul className="edge-list">
        {block.relations.map((relation) => (
          <li key={relation}>
            <EdgeGlyph text={relation} />
            <span>{relation}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function EdgeGlyph({ text }) {
  const kind = text.includes("composición")
    ? "composition"
    : text.includes("generalización")
      ? "generalization"
      : text.includes("agregación")
        ? "aggregation"
        : "association";
  return <span className={`edge-glyph ${kind}`} aria-hidden="true" />;
}

function UseCase({ block }) {
  return (
    <section className="block">
      <h3>{block.title}</h3>
      <div className="diagram" role="img" aria-label={block.title}>
        <UseCaseDiagram actors={block.actors} system={block.system} cases={block.cases} />
      </div>
      <ul className="relation-list">
        {block.notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </section>
  );
}

function Links({ block }) {
  return (
    <section className="block">
      <h3>{block.title}</h3>
      <ul className="link-list">
        {block.items.map((item) => (
          <li key={item.href}>
            <a href={item.href} target="_blank" rel="noreferrer">
              {item.name} ↗
            </a>
            <p>{item.note}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SortChallenge({ week, block }) {
  const storageKey = `sort:${week}:${block.id}`;
  const [order, setOrder] = useState(block.items.map((item) => item.id));
  const [result, setResult] = useState("");

  useEffect(() => {
    const saved = readJson(storageKey, null);
    if (saved?.order) setOrder(saved.order);
    if (saved?.result) setResult(saved.result);
  }, [storageKey]);

  function persist(nextOrder, nextResult) {
    writeJson(storageKey, { order: nextOrder, result: nextResult });
  }

  function move(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= order.length) return;
    const next = [...order];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    setOrder(next);
    setResult("");
    persist(next, "");
  }

  function check() {
    const ok = order.every((id, index) => id === block.correct[index]);
    const message = ok ? block.success : "El orden todavía no coincide. Revisa el primer paso que se salta.";
    setResult(message);
    persist(order, message);
  }

  function reset() {
    const initial = block.items.map((item) => item.id);
    setOrder(initial);
    setResult("");
    persist(initial, "");
  }

  const byId = Object.fromEntries(block.items.map((item) => [item.id, item.label]));

  return (
    <section className="block">
      <h3>{block.title}</h3>
      <p className="hint">{block.instructions}</p>
      <ol className="sort-list">
        {order.map((id, index) => (
          <li key={id}>
            <span>
              {index + 1}. {byId[id]}
            </span>
            <span className="row-actions">
              <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label={`Subir ${byId[id]}`}>
                Subir
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === order.length - 1}
                aria-label={`Bajar ${byId[id]}`}
              >
                Bajar
              </button>
            </span>
          </li>
        ))}
      </ol>
      <div className="row-actions">
        <button type="button" onClick={check}>
          Comprobar orden
        </button>
        <button type="button" onClick={reset}>
          Volver al inicio
        </button>
      </div>
      {result ? <p className={result === block.success ? "feedback ok" : "feedback"}>{result}</p> : null}
    </section>
  );
}

function Quiz({ week, block }) {
  const storageKey = `quiz:${week}:${block.id}`;
  const [choice, setChoice] = useState(null);

  useEffect(() => {
    setChoice(readJson(storageKey, null));
  }, [storageKey]);

  function select(id) {
    setChoice(id);
    writeJson(storageKey, id);
  }

  const selected = block.options.find((option) => option.id === choice);

  return (
    <section className="block">
      <h3>{block.title}</h3>
      <p>{block.prompt}</p>
      <ul className="quiz">
        {block.options.map((option) => (
          <li key={option.id}>
            <button
              type="button"
              className={choice === option.id ? (option.ok ? "picked ok" : "picked") : ""}
              aria-pressed={choice === option.id}
              onClick={() => select(option.id)}
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>
      {selected ? <p className={selected.ok ? "feedback ok" : "feedback"}>{selected.why}</p> : null}
    </section>
  );
}

function Checklist({ week, block }) {
  const storageKey = `check:${week}:${block.id}`;
  const [checked, setChecked] = useState({});

  useEffect(() => {
    setChecked(readJson(storageKey, {}));
  }, [storageKey]);

  function toggle(id) {
    setChecked((current) => {
      const next = { ...current, [id]: !current[id] };
      writeJson(storageKey, next);
      return next;
    });
  }

  const total = block.items.length;
  const count = block.items.filter((item) => checked[item.id]).length;

  return (
    <section className="block">
      <h3>{block.title}</h3>
      <p className="hint">
        {count} de {total}
      </p>
      <ul className="checks">
        {block.items.map((item) => (
          <li key={item.id}>
            <label>
              <input type="checkbox" checked={Boolean(checked[item.id])} onChange={() => toggle(item.id)} />
              <span>{item.label}</span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}

function CodePane({ label, code }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="code-pane">
      <div className="code-pane-bar">
        <span>{label}</span>
        <button type="button" onClick={copy}>
          {copied ? "Copiado" : "Copiar"}
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}

function CodePair({ block }) {
  const [language, setLanguage] = useState("java");
  const code = language === "java" ? block.java : block.python;
  return (
    <section className="block">
      <h3>{block.title}</h3>
      {block.caption ? <p className="hint">{block.caption}</p> : null}
      <div className="code-split">
        <CodePane label="Java" code={block.java} />
        <CodePane label="Python" code={block.python} />
      </div>
      <div className="lang-switch code-tabs" role="tablist" aria-label="Lenguaje">
        <button type="button" role="tab" aria-selected={language === "java"} onClick={() => setLanguage("java")}>
          Java
        </button>
        <button type="button" role="tab" aria-selected={language === "python"} onClick={() => setLanguage("python")}>
          Python
        </button>
      </div>
      <div className="code-single">
        <CodePane label={language === "java" ? "Java" : "Python"} code={code} />
      </div>
    </section>
  );
}

function CodePick({ week, block }) {
  const storageKey = `pick:${week}:${block.id}`;
  const [choice, setChoice] = useState(null);

  useEffect(() => {
    setChoice(readJson(storageKey, null));
  }, [storageKey]);

  function select(id) {
    setChoice(id);
    writeJson(storageKey, id);
  }

  const selected = block.options.find((option) => option.id === choice);

  return (
    <section className="block">
      <h3>{block.title}</h3>
      <p>{block.prompt}</p>
      <ul className="quiz code-pick">
        {block.options.map((option) => (
          <li key={option.id} className={choice === option.id ? (option.ok ? "picked ok" : "picked") : ""}>
            <button type="button" aria-pressed={choice === option.id} onClick={() => select(option.id)}>
              {option.label}
            </button>
            <pre>
              <code>{option.code}</code>
            </pre>
          </li>
        ))}
      </ul>
      {selected ? <p className={selected.ok ? "feedback ok" : "feedback"}>{selected.why}</p> : null}
    </section>
  );
}

function Match({ week, block }) {
  const storageKey = `match:${week}:${block.id}`;
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState("");
  const options = [...block.pairs].reverse().map((pair) => pair.right);

  useEffect(() => {
    const saved = readJson(storageKey, null);
    if (saved?.answers) setAnswers(saved.answers);
    if (saved?.result) setResult(saved.result);
  }, [storageKey]);

  function choose(left, right) {
    const next = { ...answers, [left]: right };
    setAnswers(next);
    setResult("");
    writeJson(storageKey, { answers: next, result: "" });
  }

  function check() {
    const ok = block.pairs.every((pair) => answers[pair.left] === pair.right);
    const message = ok
      ? "Emparejamiento completo."
      : "Hay filas que no coinciden. Revisa la que cambia el sentido del término.";
    setResult(message);
    writeJson(storageKey, { answers, result: message });
  }

  return (
    <section className="block">
      <h3>{block.title}</h3>
      <p className="hint">{block.prompt}</p>
      <ul className="match">
        {block.pairs.map((pair) => (
          <li key={pair.left}>
            <span>{pair.left}</span>
            <select
              aria-label={`Complemento de ${pair.left}`}
              value={answers[pair.left] || ""}
              onChange={(event) => choose(pair.left, event.target.value)}
            >
              <option value="">Elegir</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </li>
        ))}
      </ul>
      <button type="button" onClick={check}>
        Comprobar emparejamiento
      </button>
      {result ? <p className={result.startsWith("Emparejamiento") ? "feedback ok" : "feedback"}>{result}</p> : null}
    </section>
  );
}

function Downloads({ block }) {
  return (
    <section className="block">
      <h3>{block.title}</h3>
      <ul className="link-list">
        {block.items.map((item) => (
          <li key={item.href}>
            <strong>{item.name}</strong>
            <p>{item.note}</p>
            <span className="row-actions">
              <a href={item.href} target="_blank" rel="noreferrer">
                Abrir
              </a>
              <a href={item.href} download>
                Descargar
              </a>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

const RENDERERS = {
  paragraphs: Paragraphs,
  callout: Callout,
  cards: Cards,
  compare: Compare,
  flip: Flip,
  trail: Trail,
  steps: Steps,
  code: CodeBlock,
  classDiagram: ClassDiagram,
  usecase: UseCase,
  links: Links,
  sort: SortChallenge,
  quiz: Quiz,
  checklist: Checklist,
  diagram: Diagram,
  codePair: CodePair,
  codePick: CodePick,
  downloads: Downloads,
  match: Match,
  diagramLab: DiagramLab,
  codeLab: CodeLab,
};

export default function BlockList({ week, blocks }) {
  return (
    <div className="stack">
      {blocks.map((block, index) => {
        if (block.type === "section") {
          return (
            <h2 key={block.id} id={block.id} className="section-title">
              {block.title}
            </h2>
          );
        }
        const Renderer = RENDERERS[block.type];
        if (!Renderer) return null;
        return <Renderer key={block.id || `${block.type}-${index}`} week={week} block={block} />;
      })}
    </div>
  );
}
