const PREFIX = "poo-course:";

export function readTheme() {
  const saved = localStorage.getItem(PREFIX + "theme");
  if (saved === "dark" || saved === "light") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function writeTheme(mode) {
  localStorage.setItem(PREFIX + "theme", mode);
  document.documentElement.classList.toggle("dark", mode === "dark");
}

export function applyTheme(mode) {
  document.documentElement.classList.toggle("dark", mode === "dark");
}

export function isWeekDone(week) {
  return localStorage.getItem(PREFIX + "done:" + week) === "1";
}

export function setWeekDone(week, done) {
  localStorage.setItem(PREFIX + "done:" + week, done ? "1" : "0");
}

export function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJson(key, value) {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
}
