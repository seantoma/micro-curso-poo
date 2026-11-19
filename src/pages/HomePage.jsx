import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { COURSE, WEEKS } from "../content/weeks.js";
import { FORMATOS } from "../content/normas.js";
import { isWeekDone } from "../storage.js";

export default function HomePage({ missing = false }) {
  const [done, setDone] = useState([]);

  useEffect(() => {
    document.title = COURSE.title;
    setDone(WEEKS.filter((week) => isWeekDone(week.week)).map((week) => week.week));
  }, []);

  const next = WEEKS.find((week) => !done.includes(week.week)) || WEEKS[0];

  return (
    <div className="atelier">
      {missing ? (
        <p className="callout note">Esa ruta no corresponde a una semana. El taller está en las ocho estaciones.</p>
      ) : null}
      <section className="desk">
        <div>
          <p className="kicker">Taller · ejemplar E-204</p>
          <h1>Ocho semanas alrededor de un préstamo.</h1>
          <p className="lede">
            El curso no abre con una lista de temas. Abre con un ejemplar concreto: código E-204,
            título «Cien años de soledad», estado disponible. Cada semana le agrega una capa,
            desde el nombre del objeto hasta el error que impide prestarlo dos veces.
          </p>
          <p className="progress-line">
            {done.length} de {WEEKS.length} estaciones revisadas
          </p>
          <div
            className="meter"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={WEEKS.length}
            aria-valuenow={done.length}
            aria-label="Semanas revisadas"
          >
            <span style={{ width: `${(done.length / WEEKS.length) * 100}%` }} />
          </div>
          <Link className="enter" to={`/semana/${next.week}`}>
            {done.includes(next.week) ? "Volver a la semana 1" : `Entrar a la semana ${next.week}`}
          </Link>
        </div>
        <aside className="library-card" aria-label="Ficha del ejemplar que recorre el curso">
          <p>Biblioteca · ficha de ejemplar</p>
          <strong>E-204</strong>
          <em>Cien años de soledad</em>
          <dl>
            <div>
              <dt>Clase</dt>
              <dd>Ejemplar</dd>
            </div>
            <div>
              <dt>Estado</dt>
              <dd>disponible</dd>
            </div>
            <div>
              <dt>Mensaje</dt>
              <dd>prestar()</dd>
            </div>
            <div>
              <dt>No es</dt>
              <dd>una variable suelta</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section>
        <h2 className="path-title">Recorrido</h2>
        <ol className="path">
          {WEEKS.map((week) => (
            <li key={week.week}>
              <Link to={`/semana/${week.week}`} className={done.includes(week.week) ? "station done" : "station"}>
                <span className="station-index">{String(week.week).padStart(2, "0")}</span>
                <strong>{week.title}</strong>
                <span>{week.syllabus[0]}</span>
                <small>~ {week.minutes} min{done.includes(week.week) ? " · revisada" : ""}</small>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="drawer">
        <div>
          <p className="kicker">Cajón de formatos</p>
          <h2>Guías Word con la estructura de la norma, no con su texto.</h2>
          <p className="lede">
            Cada archivo trae control de documento, el ejemplo del préstamo y filas en blanco.
            Las normas ordenan el formato: vocabulario, diseño, UML, requisitos, ítems de información y casos de validación.
          </p>
          <a className="text-link" href="/plantillas/index.html">
            Ver hojas de ruta y todas las plantillas
          </a>
        </div>
        <ul className="norm-grid">
          {FORMATOS.map((formato) => (
            <li key={formato.id}>
              <a href={`/plantillas/word/${formato.file}`}>
                <span>{formato.norm}</span>
                <strong>{formato.title}</strong>
                <small>Semana {formato.week} · {formato.id}</small>
              </a>
            </li>
          ))}
        </ul>
      </section>
      <p className="hint home-note">{COURSE.title}</p>
    </div>
  );
}
