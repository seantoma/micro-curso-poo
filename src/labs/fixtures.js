export function methodBody(source) {
  const text = source || "";
  const java = text.match(/prestar\s*\([^)]*\)\s*\{/);
  if (java) {
    const start = java.index + java[0].length;
    let depth = 1;
    let index = start;
    while (index < text.length && depth > 0) {
      if (text[index] === "{") depth += 1;
      else if (text[index] === "}") depth -= 1;
      index += 1;
    }
    return text.slice(start, index - 1);
  }
  const python = text.match(/def\s+prestar\s*\([^)]*\)\s*:\s*\n/);
  if (python) return text.slice(python.index + python[0].length);
  return "";
}

function conditionHolds(raw, state) {
  const negative = /!/.test(raw) || /!=/.test(raw) || /\bnot\b/.test(raw);
  if (/disponible/.test(raw)) return negative ? state !== "disponible" : state === "disponible";
  if (/prestado/.test(raw)) return negative ? state !== "prestado" : state === "prestado";
  return false;
}

function assignState(line, state) {
  const match = line.match(/(?:self\.)?_?estado\s*=\s*["'](\w+)["']/);
  return match ? match[1] : state;
}

export function executeLoan(body, start) {
  const lines = (body || "").split("\n").filter((line) => {
    const trimmed = line.trim();
    return trimmed && !trimmed.startsWith("//") && !trimmed.startsWith("#");
  });
  let state = start;
  let error = false;
  let index = 0;

  while (index < lines.length && !error) {
    const raw = lines[index];
    const line = raw.trim();
    const javaIf = line.match(/^if\s*\((.*)\)\s*\{?$/);
    const pythonIf = line.match(/^if\s+(.+):\s*$/);
    if (javaIf || pythonIf) {
      const condition = (javaIf || pythonIf)[1];
      const baseIndent = raw.match(/^\s*/)[0].length;
      index += 1;
      const thenLines = [];
      const elseLines = [];
      let branch = "then";
      if (javaIf) {
        let depth = line.includes("{") ? 1 : 0;
        while (index < lines.length) {
          const current = lines[index];
          if (/^\s*else\b/.test(current)) {
            branch = "else";
            index += 1;
            continue;
          }
          const opens = (current.match(/\{/g) || []).length;
          const closes = (current.match(/\}/g) || []).length;
          if (depth === 0 && opens === 0) break;
          depth += opens - closes;
          if (depth <= 0) {
            index += 1;
            break;
          }
          (branch === "then" ? thenLines : elseLines).push(current);
          index += 1;
        }
      } else {
        while (index < lines.length) {
          const current = lines[index];
          const indent = current.match(/^\s*/)[0].length;
          if (indent <= baseIndent) break;
          if (/^else:/.test(current.trim()) || /^elif\b/.test(current.trim())) {
            branch = "else";
            index += 1;
            continue;
          }
          (branch === "then" ? thenLines : elseLines).push(current);
          index += 1;
        }
      }
      const chosen = conditionHolds(condition, state) ? thenLines : elseLines;
      const inner = executeLoan(chosen.join("\n"), state);
      state = inner.state;
      error = inner.error;
      continue;
    }
    if (/^(throw|raise)\b/.test(line)) {
      error = true;
      break;
    }
    state = assignState(line, state);
    index += 1;
  }

  return { state, error };
}

function keepsIdentity(body) {
  return !/new\s+Ejemplar\b/.test(body) && !/Ejemplar\s*\(/.test(body);
}

function isEncapsulated(source) {
  if (/global\s+_?estado/.test(source)) return false;
  if (/private\s+String\s+_?estado/.test(source)) return true;
  if (/self\._estado/.test(source)) return true;
  return false;
}

export function runLoanFixtures(source, cases) {
  const body = methodBody(source);
  const sameObject = keepsIdentity(body);
  const encapsulated = isEncapsulated(source);
  const rows = cases.map((item) => {
    const got = executeLoan(body, item.start);
    const problems = [];
    if (got.state !== item.state) {
      problems.push(`Estado obtenido: ${got.state}. Se esperaba ${item.state}.`);
    }
    if (Boolean(got.error) !== Boolean(item.error)) {
      problems.push(item.error
        ? "Esta prueba tenía que avisar el error y dejar el ejemplar como estaba."
        : "Esta prueba no debía lanzar un error.");
    }
    if (item.sameObject && !sameObject) problems.push("El método construye otro ejemplar.");
    if (item.encapsulated && !encapsulated) problems.push("El estado no queda oculto en el objeto.");
    return { label: item.label, ok: problems.length === 0, problems, got };
  });
  return {
    ok: rows.every((row) => row.ok),
    notes: rows.flatMap((row) => row.problems.map((problem) => `${row.label}: ${problem}`)),
    rows,
  };
}
