function Box({ name, lines = [], italic = false }) {
  return (
    <div className={italic ? "d-box italic" : "d-box"}>
      <strong>{name}</strong>
      {lines.length ? (
        <ul>
          {lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function Message({ block }) {
  return (
    <div className="d-row">
      <Box name={`${block.from.name} : ${block.from.type}`} />
      <div className="d-arrow">
        <span>{block.message}</span>
        <svg viewBox="0 0 120 24" aria-hidden="true">
          <line x1="0" y1="12" x2="104" y2="12" />
          <polyline points="96,4 116,12 96,20" />
        </svg>
      </div>
      <Box name={`${block.to.name} : ${block.to.type}`} lines={[block.to.state]} />
    </div>
  );
}

function Hierarchy({ block }) {
  return (
    <div className="hier">
      <Box name={block.parent.name} lines={block.parent.members} italic={Boolean(block.parent.abstract)} />
      <div className="hier-children">
        {block.children.map((child) => (
          <Box key={child.name} name={child.name} lines={child.members} />
        ))}
      </div>
    </div>
  );
}

function Links({ block }) {
  return (
    <div className="d-col">
      <div className="d-row">
        {block.boxes.map((box) => (
          <Box key={box.name} name={box.name} lines={[box.detail]} />
        ))}
      </div>
      <p className="d-note">{block.note}</p>
    </div>
  );
}

function UmlClass({ block }) {
  return <Box name={block.className} lines={[...block.attributes, "—", ...block.methods]} />;
}

function InterfaceDiagram({ block }) {
  return (
    <div className="d-col">
      <div className="d-row">
        <Box name={block.client} />
        <div className="d-arrow">
          <span>usa</span>
          <svg viewBox="0 0 120 24" aria-hidden="true">
            <line x1="0" y1="12" x2="104" y2="12" />
            <polyline points="96,4 116,12 96,20" />
          </svg>
        </div>
        <Box name={`«interfaz» ${block.contract}`} italic />
      </div>
      <div className="hier-children">
        {block.implementations.map((name) => (
          <Box key={name} name={name} lines={[`implementa ${block.contract}`]} />
        ))}
      </div>
    </div>
  );
}

function Flow({ block }) {
  return (
    <ol className="d-flow">
      {block.steps.map((step, index) => (
        <li key={step}>
          <span>{index + 1}</span>
          {step}
        </li>
      ))}
    </ol>
  );
}

const KINDS = {
  message: Message,
  hierarchy: Hierarchy,
  links: Links,
  uml: UmlClass,
  interface: InterfaceDiagram,
  flow: Flow,
};

export default function Diagram({ block }) {
  const Kind = KINDS[block.kind];
  if (!Kind) return null;
  return (
    <section className="block">
      <h3>{block.title}</h3>
      {block.caption ? <p className="hint">{block.caption}</p> : null}
      <div className="diagram" role="img" aria-label={block.title}>
        <Kind block={block} />
      </div>
    </section>
  );
}
