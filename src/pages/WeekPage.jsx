import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { COURSE, getWeek } from "../content/weeks.js";
import { isWeekDone, setWeekDone } from "../storage.js";
import BlockList from "../components/Blocks.jsx";

export default function WeekPage() {
  const { weekId } = useParams();
  const week = getWeek(Number(weekId));
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!week) {
      document.title = COURSE.title;
      return;
    }
    document.title = `Semana ${week.week} · ${COURSE.title}`;
    setDone(isWeekDone(week.week));
  }, [week]);

  if (!week) {
    return (
      <div className="stack">
        <p className="callout note">Semana no encontrada.</p>
        <Link to="/" className="text-link">
          Volver al contenido
        </Link>
      </div>
    );
  }

  const previous = week.week > 1 ? week.week - 1 : null;
  const next = week.week < 8 ? week.week + 1 : null;
  const sections = week.blocks.filter((block) => block.type === "section");

  function toggleDone() {
    const value = !done;
    setWeekDone(week.week, value);
    setDone(value);
  }

  return (
    <article className="stack">
      <header className="week-head">
        <p className="crumb">
          <Link to="/">Inicio</Link>
          <span aria-hidden="true"> / </span>
          Semana {week.week}
        </p>
        <div className="week-head-row">
          <div>
            <p className="kicker">Contenido de la semana</p>
            <ul className="syllabus plain">
              {week.syllabus.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <h1>{week.title}</h1>
            <p className="lede">{week.summary}</p>
          </div>
          <div className="week-actions">
            <span className="badge">~ {week.minutes} min</span>
            <button type="button" className={done ? "done" : ""} onClick={toggleDone}>
              {done ? "Quitar marca de revisada" : "Marcar semana como revisada"}
            </button>
          </div>
        </div>
        <nav className="section-nav" aria-label="Partes de la semana">
          {sections.map((section) => (
            <a key={section.id} href={`#${section.id}`}>
              {section.title}
            </a>
          ))}
        </nav>
        <h2 className="small-title">Objetivos</h2>
        <ul className="objectives">
          {week.objectives.map((objective) => (
            <li key={objective}>{objective}</li>
          ))}
        </ul>
      </header>
      <BlockList week={week.week} blocks={week.blocks} />
      <nav className="pager" aria-label="Semanas contiguas">
        {previous ? <Link to={`/semana/${previous}`}>← Semana {previous}</Link> : <span />}
        {next ? <Link to={`/semana/${next}`}>Semana {next} →</Link> : <Link to="/">Volver al inicio</Link>}
      </nav>
    </article>
  );
}
