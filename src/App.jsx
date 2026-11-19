import { useEffect, useState } from "react";
import { NavLink, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { COURSE, WEEKS } from "./content/weeks.js";
import HomePage from "./pages/HomePage.jsx";
import WeekPage from "./pages/WeekPage.jsx";
import { readTheme, writeTheme } from "./storage.js";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Layout() {
  const { pathname } = useLocation();
  const [theme, setTheme] = useState(readTheme);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? Math.min(window.scrollY / height, 1) : 0);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    writeTheme(next);
    setTheme(next);
  }

  return (
    <>
      <a className="skip" href="#contenido">
        Saltar al contenido
      </a>
      <header className="topbar">
        <div className="scroll-progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${progress})` }} />
        </div>
        <NavLink to="/" className="brand" end>
          <strong>{COURSE.title}</strong>
          <span>{COURSE.subtitle}</span>
        </NavLink>
        <nav className="weeknav" aria-label="Semanas">
          <NavLink to="/" end>
            Inicio
          </NavLink>
          {WEEKS.map((week) => (
            <NavLink key={week.week} to={`/semana/${week.week}`}>
              S{week.week}
            </NavLink>
          ))}
          <button type="button" onClick={toggleTheme}>
            {theme === "dark" ? "Claro" : "Oscuro"}
          </button>
        </nav>
      </header>
      <main id="contenido">
        <Outlet />
      </main>
      <footer className="foot">
        <span>{COURSE.title}</span>
      </footer>
    </>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="semana/:weekId" element={<WeekPage />} />
          <Route path="*" element={<HomePage missing />} />
        </Route>
      </Routes>
    </>
  );
}
