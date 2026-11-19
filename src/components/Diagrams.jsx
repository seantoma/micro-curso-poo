import {
  ActivityDiagram,
  Association,
  ClassNode,
  Generalization,
  ObjectDiagram,
  PackageDiagram,
  SequenceDiagram,
  StateDiagram,
  UseCaseDiagram,
  splitMembers,
} from "./UmlFigures.jsx";

function Message({ block }) {
  return (
    <SequenceDiagram
      lifelines={[`${block.from.name} : ${block.from.type}`, `${block.to.name} : ${block.to.type}`]}
      messages={[
        { from: 0, to: 1, label: block.message },
        { from: 1, to: 0, label: block.to.state || "respuesta", kind: "return" },
      ]}
    />
  );
}

function Hierarchy({ block }) {
  return <Generalization parent={block.parent} children={block.children} />;
}

function Links({ block }) {
  return (
    <div className="d-col">
      <div className="assoc-chain">
        {block.boxes.map((box, index) => (
          <div key={box.name} className="chain-item">
            {index > 0 ? (
              <span className="chain-mult">{block.boxes[index - 1].detail} —— {box.detail}</span>
            ) : null}
            <ClassNode name={box.name} attributes={[`multiplicidad ${box.detail}`]} />
          </div>
        ))}
      </div>
      {block.note ? <p className="d-note">{block.note}</p> : null}
    </div>
  );
}

function UmlClass({ block }) {
  return (
    <ClassNode
      name={block.className}
      attributes={block.attributes}
      methods={block.methods}
      abstract={Boolean(block.abstract)}
    />
  );
}

function InterfaceDiagram({ block }) {
  return (
    <div className="d-col">
      <Association
        kind="dependencia"
        label="usa"
        leftNode={<ClassNode name={block.client} />}
        rightNode={<ClassNode name={block.contract} stereotype="«interfaz»" />}
      />
      {block.implementations.map((name) => (
        <Association
          key={name}
          kind="realización"
          label="«realización»"
          leftNode={<ClassNode name={name} />}
          rightNode={<ClassNode name={block.contract} stereotype="«interfaz»" />}
        />
      ))}
    </div>
  );
}

function Flow({ block }) {
  return <ActivityDiagram steps={block.steps} guard={block.guard} />;
}

function Sequence({ block }) {
  return <SequenceDiagram lifelines={block.lifelines} messages={block.messages} />;
}

function Objects({ block }) {
  return <ObjectDiagram objects={block.objects} link={block.link} />;
}

function Linked({ block }) {
  const left = splitMembers(block.left.members || []);
  const right = splitMembers(block.right.members || []);
  return (
    <Association
      kind={block.edge}
      label={block.label}
      leftMult={block.leftMult}
      rightMult={block.rightMult}
      leftNode={<ClassNode name={block.left.name} attributes={left.attributes} methods={left.methods} abstract={block.left.abstract} />}
      rightNode={<ClassNode name={block.right.name} attributes={right.attributes} methods={right.methods} />}
    />
  );
}

function States({ block }) {
  return <StateDiagram states={block.states} transitions={block.transitions} />;
}

function Packages({ block }) {
  return <PackageDiagram packages={block.packages} />;
}

const KINDS = {
  message: Message,
  hierarchy: Hierarchy,
  links: Links,
  uml: UmlClass,
  interface: InterfaceDiagram,
  flow: Flow,
  sequence: Sequence,
  objects: Objects,
  association: Linked,
  state: States,
  packages: Packages,
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
