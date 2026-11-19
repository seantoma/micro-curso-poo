import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CodeLab, DiagramLab } from "./Labs.jsx";
import { readJson, writeJson } from "../storage.js";
import Diagram from "./Diagrams.jsx";
import { gradeDecision } from "../content/decisionGrade.js";
import { gradeDossier } from "../labs/grade.js";
import { Association, ClassNode, Generalization, SequenceDiagram, UseCaseDiagram } from "./UmlFigures.jsx";

function Paragraphs({ block }) {
  return (
    <div className="prose">
      {block.paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}

function BeatFigure({ figure }) {
  if (figure.kind === "class") {
    return (
      <ClassNode
        name={figure.name}
        attributes={figure.attributes}
        methods={figure.methods}
        abstract={figure.abstract}
        stereotype={figure.stereotype}
      />
    );
  }
  if (figure.kind === "sequence") {
    return <SequenceDiagram lifelines={figure.lifelines} messages={figure.messages} />;
  }
  if (figure.kind === "assoc") {
    return (
      <Association
        left={figure.left}
        right={figure.right}
        kind={figure.kindName}
        label={figure.label}
        leftMult={figure.leftMult}
        rightMult={figure.rightMult}
      />
    );
  }
  if (figure.kind === "gen") return <Generalization parent={figure.parent} children={figure.children} />;
  if (figure.kind === "usecase") {
    return (
      <UseCaseDiagram
        actors={[figure.actor]}
        system={figure.system}
        cases={figure.cases}
        links={figure.cases}
        relations={figure.relations || []}
      />
    );
  }
  if (figure.kind === "pills") {
    return (
      <div className="state-row">
        {figure.states.map((state, index) => (
          <div key={state} className={index === figure.at ? "state-node is-here" : "state-node"}>{state}</div>
        ))}
      </div>
    );
  }
  return <pre className="beat-code">{figure.text}</pre>;
}

function Recorrido({ block }) {
  const railRef = useRef(null);
  const [cursor, setCursor] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [token, setToken] = useState({ top: 10, left: 12 });
  const last = block.beats.length - 1;
  const beat = block.beats[cursor];

  useEffect(() => {
    if (!playing || cursor >= last) {
      if (playing && cursor >= last) setPlaying(false);
      return undefined;
    }
    const timer = setTimeout(() => setCursor((value) => Math.min(value + 1, last)), 1400);
    return () => clearTimeout(timer);
  }, [playing, cursor, last]);

  useLayoutEffect(() => {
    const rail = railRef.current;
    const node = rail?.querySelector(`[data-stop="beat-${cursor}"]`);
    if (!rail || !node) return;
    const railBox = rail.getBoundingClientRect();
    const box = node.getBoundingClientRect();
    setToken({
      top: box.top - railBox.top + box.height / 2 - 7,
      left: box.left - railBox.left + 14,
    });
  }, [cursor, block.beats]);

  return (
    <section className="block recorrido">
      <h3>{block.title}</h3>
      <p className="hint">{block.intro}</p>
      <div className="recorrido-rail" ref={railRef}>
        {block.beats.map((item, index) => (
          <button
            key={item.title}
            type="button"
            data-stop={`beat-${index}`}
            className={index === cursor ? "on" : ""}
            onClick={() => {
              setPlaying(false);
              setCursor(index);
            }}
          >
            <span className="kicker">Parada {index + 1}</span>
            {item.title}
          </button>
        ))}
        <span className="flow-token" style={{ top: token.top, left: token.left }} aria-hidden="true" />
      </div>
      <div className="recorrido-stage">
        <div className="recorrido-figure">
          <BeatFigure figure={beat.figure} />
        </div>
        <div>
          <p>{beat.body}</p>
          <p className="recorrido-tip">{beat.tip}</p>
        </div>
      </div>
      <div className="flow-controls">
        <button type="button" onClick={() => setPlaying((value) => !value)}>{playing ? "Pausa" : "Reproducir"}</button>
        <button type="button" onClick={() => { setPlaying(false); setCursor((value) => Math.min(value + 1, last)); }}>Paso</button>
        <button type="button" onClick={() => { setPlaying(false); setCursor(0); }}>Reiniciar</button>
      </div>
    </section>
  );
}

function Decision({ week, block }) {
  const storageKey = `decision:${week}:${block.id}`;
  const [picks, setPicks] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    const saved = readJson(storageKey, null);
    if (saved?.picks) setPicks(saved.picks);
    if (saved?.result) setResult(saved.result);
  }, [storageKey]);

  function select(stepId, optionId) {
    const next = { ...picks, [stepId]: optionId };
    setPicks(next);
    setResult(null);
    writeJson(storageKey, { picks: next, result: null });
  }

  function close() {
    const graded = gradeDecision(block, picks);
    setResult(graded);
    writeJson(storageKey, { picks, result: graded });
  }

  const taken = block.steps.filter((step) => picks[step.id]).length;

  return (
    <section className="block decision">
      <h3>{block.title}</h3>
      <p>{block.brief}</p>
      <ul className="decision-constraints">
        {block.constraints.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <div className="decision-layout">
        <div className="decision-steps">
          {block.steps.map((step, index) => {
            const chosen = step.options.find((option) => option.id === picks[step.id]);
            const tone = result && chosen ? (chosen.fault ? "is-fault" : "is-ok") : "";
            return (
              <fieldset key={step.id} className={tone}>
                <legend>
                  <span className="kicker">Decisión {index + 1}</span>
                  {step.ask}
                </legend>
                <p className="hint">{step.tension}</p>
                <div className="decision-options">
                  {step.options.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={picks[step.id] === option.id}
                      className={picks[step.id] === option.id ? "on" : ""}
                      onClick={() => select(step.id, option.id)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {chosen ? <p className="decision-effect">{chosen.effect}</p> : null}
                {result && chosen?.fault ? <p className="feedback">{chosen.fault}</p> : null}
              </fieldset>
            );
          })}
        </div>
        <aside className="decision-acta">
          <p className="kicker">Lo que el diseño afirma</p>
          <ol>
            {block.steps.map((step) => {
              const chosen = step.options.find((option) => option.id === picks[step.id]);
              return <li key={step.id}>{chosen ? chosen.effect : "Esta decisión sigue abierta."}</li>;
            })}
          </ol>
          <p className="hint">{taken} de {block.steps.length} decisiones tomadas</p>
          <button type="button" onClick={close}>Cerrar la decisión</button>
          {result ? (
            <div className={result.ok ? "feedback ok" : "feedback"}>
              <p>{result.verdict}</p>
              {result.notes.length ? (
                <ul>
                  {result.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}
        </aside>
      </div>
    </section>
  );
}

function Oficio({ block }) {
  const [index, setIndex] = useState(0);
  const [detail, setDetail] = useState(false);
  const item = block.items[index];
  return (
    <section className="block oficio">
      <p className="hint">{block.intro}</p>
      <div className="oficio-layout">
        <div className="oficio-rail" role="tablist" aria-label="Oficio de la semana">
          {block.items.map((entry, entryIndex) => (
            <button
              key={entry.title}
              type="button"
              role="tab"
              aria-selected={entryIndex === index}
              className={entryIndex === index ? "on" : ""}
              onClick={() => {
                setIndex(entryIndex);
                setDetail(false);
              }}
            >
              <span className="kicker">{entry.kind}</span>
              {entry.title}
            </button>
          ))}
        </div>
        <article className="oficio-panel" role="tabpanel">
          <p>{item.lead}</p>
          <div className="oficio-split">
            <div className="oficio-bad">
              <span className="kicker">Así se rompe</span>
              <pre>{item.bad}</pre>
              <p>{item.badWhy}</p>
            </div>
            <div className="oficio-good">
              <span className="kicker">Así se sostiene</span>
              <pre>{item.good}</pre>
              <p>{item.goodWhy}</p>
            </div>
          </div>
          <p className="oficio-rule">{item.rule}</p>
          <button type="button" className="oficio-more" aria-expanded={detail} onClick={() => setDetail((value) => !value)}>
            {detail ? "Ocultar el detalle técnico" : "Abrir el detalle técnico"}
          </button>
          {detail ? <p className="oficio-detail">{item.detail}</p> : null}
        </article>
      </div>
    </section>
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
        <UseCaseDiagram actors={block.actors} system={block.system} cases={block.cases} relations={block.relations} />
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
      {block.code ? (
        <pre className="trace-code">
          <code>{block.code}</code>
        </pre>
      ) : null}
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

function Dossier({ week, block }) {
  const storageKey = `dossier:${week}:${block.id}`;
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    const saved = readJson(storageKey, null);
    if (saved?.text) setText(saved.text);
    if (saved?.result) setResult(saved.result);
  }, [storageKey]);

  function edit(value) {
    setText(value);
    setResult(null);
    writeJson(storageKey, { text: value, result: null });
  }

  function check() {
    const graded = gradeDossier(text);
    setResult(graded);
    writeJson(storageKey, { text, result: graded });
  }

  return (
    <section className="block">
      <h3>{block.title}</h3>
      <p>{block.prompt}</p>
      <ol className="rubric">
        {block.criteria.map((criterion) => (
          <li key={criterion}>{criterion}</li>
        ))}
      </ol>
      <label className="dossier-label" htmlFor={storageKey}>
        Párrafo de cierre
        <textarea id={storageKey} value={text} onChange={(event) => edit(event.target.value)} />
      </label>
      <button type="button" onClick={check}>Revisar el párrafo</button>
      {result ? (
        <div className={result.ok ? "feedback ok" : "feedback"}>
          <p>{result.ok ? "El párrafo cubre los cuatro criterios." : "Todavía falta justificar alguna decisión."}</p>
          {result.notes.length ? (
            <ul>
              {result.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
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
  dossier: Dossier,
  oficio: Oficio,
  recorrido: Recorrido,
  decision: Decision,
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
