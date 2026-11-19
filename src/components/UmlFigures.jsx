import { useId } from "react";

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
          <g key={name}>
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

export function UseCaseDiagram({ actors = [], system = "Sistema", cases = [], relations = [] }) {
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

export function StateDiagram({ states, transitions, initial }) {
  const prefix = useId().replace(/:/g, "");
  return (
    <div className="state-row">
      <span className="state-initial" aria-hidden="true" />
      {states.map((state, index) => (
        <div key={state} className="state-step">
          {index === 0 ? <span className="state-link" /> : null}
          <div className="state-node">{state}</div>
          {transitions[index] ? (
            <svg className="state-arrow" viewBox="0 0 92 36" aria-label={transitions[index]}>
              <Markers prefix={`${prefix}${index}`} />
              <line x1="4" y1="22" x2="78" y2="22" className="uml-solid" markerEnd={`url(#${markerId(`${prefix}${index}`, "open")})`} />
              <text x="46" y="14" textAnchor="middle">{transitions[index]}</text>
            </svg>
          ) : null}
        </div>
      ))}
      {initial ? null : null}
    </div>
  );
}

export function ActivityDiagram({ steps }) {
  return (
    <ol className="activity">
      <li className="activity-start" aria-hidden="true" />
      {steps.filter(Boolean).map((step) => (
        <li key={step} className="activity-node">{step}</li>
      ))}
      <li className="activity-end" aria-hidden="true" />
    </ol>
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
