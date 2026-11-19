import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";

function markerId(prefix, name) {
  return `${prefix}-${name}`;
}

function Markers({ prefix }) {
  const arrow = markerId(prefix, "arrow");
  const hollow = markerId(prefix, "hollow");
  const open = markerId(prefix, "open");
  return (
    <defs>
      <marker id={arrow} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M 0 1.2 L 9 5 L 0 8.8 z" className="uml-filled" />
      </marker>
      <marker id={open} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
        <path d="M 1 1.5 L 9 5 L 1 8.5" className="uml-stroke" />
      </marker>
      <marker id={hollow} viewBox="0 0 12 12" refX="11" refY="6" markerWidth="10" markerHeight="10" orient="auto-start-reverse">
        <path d="M 1 1.5 L 11 6 L 1 10.5 z" className="uml-hollow" />
      </marker>
    </defs>
  );
}

export function splitMembers(members = []) {
  const attributes = [];
  const methods = [];
  for (const line of members) {
    if (line.includes("(")) methods.push(line);
    else attributes.push(line);
  }
  return { attributes, methods };
}

export function ClassNode({ name, attributes = [], methods = [], abstract = false, stereotype }) {
  return (
    <div className={abstract ? "class-node abstract" : "class-node"}>
      {stereotype ? <em className="stereotype">{stereotype}</em> : null}
      <strong>{name}</strong>
      <ul>
        {attributes.length ? attributes.map((line) => <li key={line}>{line}</li>) : <li className="muted-line">—</li>}
      </ul>
      <ul>
        {methods.length ? methods.map((line) => <li key={line}>{line}</li>) : <li className="muted-line">—</li>}
      </ul>
    </div>
  );
}

export function SequenceDiagram({ lifelines, messages }) {
  const prefix = useId().replace(/:/g, "");
  const boxW = 158;
  const col = boxW + 48;
  const width = col * (lifelines.length + 1);
  const height = 78 + messages.length * 46;
  return (
    <svg className="uml-svg" viewBox={`0 0 ${width} ${height}`} role="img">
      <Markers prefix={prefix} />
      {lifelines.map((name, index) => {
        const x = col * (index + 1);
        return (
          <g key={`${name}-${index}`}>
            <rect x={x - boxW / 2} y="8" width={boxW} height="34" rx="6" className="uml-panel" />
            <text x={x} y="30" textAnchor="middle">{name}</text>
            <line x1={x} y1="42" x2={x} y2={height - 8} className="uml-dashed" />
          </g>
        );
      })}
      {messages.map((message, index) => {
        const y = 72 + index * 46;
        const x1 = col * (message.from + 1);
        const x2 = col * (message.to + 1);
        const direction = x2 >= x1 ? 1 : -1;
        const end = x2 - direction * 10;
        const dashed = message.kind === "return";
        return (
          <g key={`${message.label}-${index}`}>
            {dashed ? null : (
              <rect x={x2 - 5} y={y - 8} width="10" height="36" className="uml-activation" />
            )}
            <line
              x1={x1}
              y1={y}
              x2={end}
              y2={y}
              className={dashed ? "uml-dashed" : "uml-solid"}
              markerEnd={`url(#${markerId(prefix, dashed ? "open" : "arrow")})`}
            />
            <text x={(x1 + x2) / 2} y={y - 8} textAnchor="middle">{message.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function Association({ left, right, kind = "asociación", leftMult = "", rightMult = "", label = "", leftNode, rightNode }) {
  const prefix = useId().replace(/:/g, "");
  const dashed = kind === "dependencia" || kind === "realización";
  const triangle = kind === "herencia" || kind === "generalización" || kind === "realización";
  const diamond = kind === "composición" || kind === "agregación";
  return (
    <div className="assoc">
      {leftNode || <ClassNode name={left} />}
      <svg className="uml-edge" viewBox="0 0 210 78" role="img" aria-label={label || kind}>
        <Markers prefix={prefix} />
        <Markers prefix={prefix} />
        {diamond ? (
          <polygon
            points="18,39 32,31 46,39 32,47"
            className={kind === "composición" ? "uml-filled" : "uml-hollow"}
          />
        ) : null}
        <line
          x1={diamond ? 46 : 12}
          y1="39"
          x2={triangle ? 176 : 190}
          y2="39"
          className={dashed ? "uml-dashed" : "uml-solid"}
          markerEnd={triangle ? `url(#${markerId(prefix, "hollow")})` : kind === "dependencia" ? `url(#${markerId(prefix, "open")})` : undefined}
        />
        <text x="18" y="24">{leftMult}</text>
        <text x="105" y="22" textAnchor="middle">{label || kind}</text>
        <text x="176" y="24">{rightMult}</text>
      </svg>
      {rightNode || <ClassNode name={right} />}
    </div>
  );
}

export function Generalization({ parent, children }) {
  const parentParts = splitMembers(parent.members);
  return (
    <div className="gen">
      <ClassNode
        name={parent.name}
        abstract={Boolean(parent.abstract)}
        stereotype={parent.stereotype || (parent.abstract ? "«abstracta»" : undefined)}
        attributes={parentParts.attributes}
        methods={parentParts.methods}
      />
      <svg className="gen-bridge" viewBox="0 0 100 36" preserveAspectRatio="none" aria-hidden="true">
        <line x1="50" y1="0" x2="50" y2="14" className="uml-solid" />
        <polygon points="50,2 43,14 57,14" className="uml-hollow" />
        <line x1="12" y1="14" x2="88" y2="14" className="uml-solid" />
        <line x1="12" y1="14" x2="12" y2="36" className="uml-solid" />
        <line x1="88" y1="14" x2="88" y2="36" className="uml-solid" />
        {children.length > 2 ? <line x1="50" y1="14" x2="50" y2="36" className="uml-solid" /> : null}
      </svg>
      <div className="gen-children">
        {children.map((child) => {
          const parts = splitMembers(child.members);
          return (
            <ClassNode
              key={child.name}
              name={child.name}
              attributes={parts.attributes}
              methods={parts.methods}
            />
          );
        })}
      </div>
    </div>
  );
}

export function ActorFigure({ name }) {
  return (
    <div className="actor-fig">
      <svg viewBox="0 0 48 64" className="actor-svg" aria-hidden="true">
        <circle cx="24" cy="10" r="7" className="uml-stroke" />
        <line x1="24" y1="17" x2="24" y2="38" className="uml-solid" />
        <line x1="10" y1="26" x2="38" y2="26" className="uml-solid" />
        <line x1="24" y1="38" x2="12" y2="58" className="uml-solid" />
        <line x1="24" y1="38" x2="36" y2="58" className="uml-solid" />
      </svg>
      <span>{name}</span>
    </div>
  );
}

export function UseCaseDiagram({ actors = [], system = "Sistema", cases = [], relations = [], links = [] }) {
  const prefix = useId().replace(/:/g, "");
  const extra = relations.map((item) => item.to).filter((name) => name && !cases.includes(name));
  const shown = [...cases.filter(Boolean), ...extra];
  return (
    <div className="usecase-draw">
      <div className="actor-col">
        {actors.filter(Boolean).map((actor) => (
          <ActorFigure key={actor} name={actor} />
        ))}
      </div>
      <div className="system-frame">
        <span className="system-name">{system || "Sistema"}</span>
        <div className="oval-grid">
          {shown.map((item) => (
            <div key={item} className="oval">{item}</div>
          ))}
        </div>
        {links.length ? (
          <ul className="uc-links">
            {links.map((name) => (
              <li key={name}>
                <span>{actors[0] || "Actor"}</span>
                <svg className="uc-arrow" viewBox="0 0 88 24" aria-hidden="true">
                  <line x1="2" y1="14" x2="86" y2="14" className="uml-solid" />
                </svg>
                <span>{name}</span>
              </li>
            ))}
          </ul>
        ) : null}
        {relations.length ? (
          <ul className="uc-rels">
            {relations.map((item, index) => (
              <li key={`${item.from}-${item.to}`}>
                <span>{item.from}</span>
                <svg className="uc-arrow" viewBox="0 0 148 32" aria-label={item.kind}>
                  <Markers prefix={`${prefix}uc${index}`} />
                  <line x1="4" y1="22" x2="132" y2="22" className="uml-dashed" markerEnd={`url(#${markerId(`${prefix}uc${index}`, "open")})`} />
                  <text x="74" y="14" textAnchor="middle">{item.kind}</text>
                </svg>
                <span>{item.to}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

export function StateDiagram({ states = [], transitions = [] }) {
  const prefix = useId().replace(/:/g, "");
  const rootRef = useRef(null);
  const signature = states.join("|");
  const [cursor, setCursor] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [token, setToken] = useState({ top: 0, left: 0 });
  const last = Math.max(states.length - 1, 0);

  useEffect(() => {
    setCursor(0);
    setPlaying(false);
  }, [signature]);

  useEffect(() => {
    if (!playing || cursor >= last) {
      if (playing && cursor >= last) setPlaying(false);
      return undefined;
    }
    const timer = setTimeout(() => setCursor((value) => Math.min(value + 1, last)), 900);
    return () => clearTimeout(timer);
  }, [playing, cursor, last, signature]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const node = root?.querySelector(`[data-stop="state-${cursor}"]`);
    if (!root || !node) return;
    const rootBox = root.getBoundingClientRect();
    const box = node.getBoundingClientRect();
    setToken({
      top: box.top - rootBox.top + box.height / 2 - 7,
      left: box.left - rootBox.left + box.width / 2 - 7,
    });
  }, [cursor, signature]);

  const state = states[cursor] || "";
  const via = transitions[cursor];
  const line = state
    ? via
      ? `E-204 está en «${state}». ${via} es el mensaje que mueve el proceso.`
      : `E-204 queda en «${state}». El proceso se detiene ahí.`
    : "";

  return (
    <div className="flow-stage" ref={rootRef}>
      <div className="state-row">
        <span className="state-initial" aria-hidden="true" />
        {states.map((name, index) => (
          <div key={name} className="state-step">
            {index === 0 ? <span className="state-link" /> : null}
            <div className={index === cursor ? "state-node is-here" : "state-node"} data-stop={`state-${index}`}>{name}</div>
            {transitions[index] ? (
              <svg className="state-arrow" viewBox="0 0 92 36" aria-label={transitions[index]}>
                <Markers prefix={`${prefix}${index}`} />
                <line x1="4" y1="22" x2="78" y2="22" className="uml-solid" markerEnd={`url(#${markerId(`${prefix}${index}`, "open")})`} />
                <text x="46" y="14" textAnchor="middle">{transitions[index]}</text>
              </svg>
            ) : null}
          </div>
        ))}
      </div>
      <span className="flow-token" style={{ top: token.top, left: token.left }} aria-hidden="true" />
      <FlowControls
        playing={playing}
        onPlay={() => setPlaying((value) => !value)}
        onStep={() => {
          setPlaying(false);
          setCursor((value) => Math.min(value + 1, last));
        }}
        onReset={() => {
          setPlaying(false);
          setCursor(0);
        }}
      />
      <p className="flow-now" aria-live="polite">{line}</p>
    </div>
  );
}

function route(items, decisionIndex, branch) {
  const ids = ["start"];
  items.forEach((_, index) => {
    ids.push(`step-${index}`);
    if (index === decisionIndex) ids.push("decision");
  });
  if (decisionIndex < 0) return [...ids, "end"];
  const cut = ids.indexOf("decision");
  const head = ids.slice(0, cut + 1);
  if (branch === "si") return [...head, "success", "end-si"];
  if (branch === "no") return [...ids, "end"];
  return head;
}

function narrate(id, items, branch) {
  if (id === "start") return "El testigo está en el inicio. El proceso todavía no toca a E-204.";
  if (id === "decision") return "El rombo detiene el proceso: hay que saber si el estado permite prestar.";
  if (id === "success") return "Está disponible. El mismo ejemplar pasa a prestado.";
  if (id === "end-si") return "El flujo termina: el préstamo quedó hecho.";
  if (id === "end") {
    return branch === "no"
      ? "El flujo termina. El ejemplar no cambió y quien llama ya conoce el motivo."
      : "El flujo llega al fin.";
  }
  const index = Number(String(id).replace("step-", ""));
  return `El proceso entra en «${items[index] || "este paso"}».`;
}

function FlowControls({ playing, onPlay, onStep, onReset }) {
  return (
    <div className="flow-controls">
      <button type="button" onClick={onPlay}>{playing ? "Pausa" : "Reproducir"}</button>
      <button type="button" onClick={onStep}>Paso</button>
      <button type="button" onClick={onReset}>Reiniciar</button>
    </div>
  );
}

export function ActivityDiagram({ steps, guard }) {
  const items = (steps || []).filter(Boolean);
  const decisionIndex = guard ? items.findIndex((step) => /valid/i.test(step)) : -1;
  const signature = `${items.join("|")}|${guard || ""}`;
  const rootRef = useRef(null);
  const [cursor, setCursor] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [branch, setBranch] = useState(null);
  const [token, setToken] = useState({ top: 0, left: 0 });
  const path = route(items, decisionIndex, branch);
  const here = path[Math.min(cursor, path.length - 1)] || "start";

  useEffect(() => {
    setCursor(0);
    setBranch(null);
    setPlaying(false);
  }, [signature]);

  useEffect(() => {
    if (!playing) return undefined;
    if ((here === "decision" && !branch) || cursor >= path.length - 1) {
      setPlaying(false);
      return undefined;
    }
    const timer = setTimeout(() => setCursor((value) => value + 1), 900);
    return () => clearTimeout(timer);
  }, [playing, cursor, branch, here, path.length, signature]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const node = root?.querySelector(`[data-stop="${here}"]`);
    if (!root || !node) return;
    const rootBox = root.getBoundingClientRect();
    const box = node.getBoundingClientRect();
    setToken({
      top: box.top - rootBox.top + box.height / 2 - 7,
      left: box.left - rootBox.left + box.width / 2 - 7,
    });
  }, [here, signature, branch]);

  function choose(next) {
    setBranch(next);
    setCursor((value) => value + 1);
    setPlaying(true);
  }

  return (
    <div className="flow-stage" ref={rootRef}>
      <ol className="activity" aria-label="Flujo del proceso">
        <li className="activity-start" data-stop="start" aria-hidden="true" />
        {items.map((step, index) => {
          const skipped = branch === "si" && decisionIndex >= 0 && index > decisionIndex;
          return (
            <li key={`${step}-${index}`} className="activity-wrap">
              <div
                className={`activity-node${here === `step-${index}` ? " is-here" : ""}${skipped ? " is-skipped" : ""}`}
                data-stop={`step-${index}`}
              >
                {step}
              </div>
              {index === decisionIndex ? (
                <div className="activity-fork">
                  <div className="activity-no">
                    <div className={`activity-decision${here === "decision" ? " is-here" : ""}`} data-stop="decision">
                      <span>{guard}</span>
                    </div>
                    <span className="activity-branch-label">no</span>
                  </div>
                  <div className="activity-yes">
                    <span className="activity-branch-label">sí</span>
                    <div className={`activity-node activity-side${here === "success" ? " is-here" : ""}`} data-stop="success">
                      Marcar prestado
                    </div>
                    <span className={`activity-end activity-side-end${here === "end-si" ? " is-here" : ""}`} data-stop="end-si" />
                  </div>
                </div>
              ) : null}
            </li>
          );
        })}
        <li className={`activity-end${here === "end" ? " is-here" : ""}`} data-stop="end" aria-hidden="true" />
      </ol>
      <span className="flow-token" style={{ top: token.top, left: token.left }} aria-hidden="true" />
      <FlowControls
        playing={playing}
        onPlay={() => setPlaying((value) => !value)}
        onStep={() => {
          if (here === "decision" && !branch) return;
          setPlaying(false);
          setCursor((value) => Math.min(value + 1, path.length - 1));
        }}
        onReset={() => {
          setPlaying(false);
          setBranch(null);
          setCursor(0);
        }}
      />
      {here === "decision" && !branch ? (
        <div className="flow-choice">
          <button type="button" onClick={() => choose("si")}>Disponible: marcar prestado</button>
          <button type="button" onClick={() => choose("no")}>Inválido: no cambiar y avisar</button>
        </div>
      ) : null}
      <p className="flow-now" aria-live="polite">{narrate(here, items, branch)}</p>
    </div>
  );
}

export function ObjectDiagram({ objects, link = "conoce" }) {
  const prefix = useId().replace(/:/g, "");
  return (
    <div className="assoc">
      {objects.map((object, index) => (
        <div key={object.name} className="object-wrap">
          {index > 0 ? (
            <svg className="uml-edge" viewBox="0 0 120 48" aria-hidden="true">
              <Markers prefix={`${prefix}${index}`} />
              <line x1="8" y1="24" x2="108" y2="24" className="uml-solid" />
              <text x="60" y="16" textAnchor="middle">{link}</text>
            </svg>
          ) : null}
          <div className="class-node">
            <strong className="object-name">{object.name} : {object.type}</strong>
            <ul>
              {object.slots.map((slot) => (
                <li key={slot}>{slot}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

export function PackageDiagram({ packages }) {
  return (
    <div className="package-row">
      {packages.map((item) => (
        <div key={item.name} className="package-fig">
          <span>{item.name}</span>
          <ul>
            {item.classes.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
