export function gradeDecision(challenge, picks = {}) {
  const notes = [];
  let open = false;

  for (const step of challenge.steps) {
    const chosen = step.options.find((option) => option.id === picks[step.id]);
    if (!chosen) {
      open = true;
      notes.push(`Falta decidir: ${step.ask}`);
      continue;
    }
    if (chosen.fault) notes.push(chosen.fault);
  }

  if (!open) {
    for (const rule of challenge.rules || []) {
      const hit = Object.entries(rule.when).every(([stepId, optionId]) => picks[stepId] === optionId);
      if (hit) notes.push(rule.note);
    }
  }

  const ok = notes.length === 0;
  let verdict = challenge.fail;
  if (ok) verdict = challenge.pass;
  else if (open) verdict = "La decisión sigue abierta: faltan pasos.";

  return { ok, notes, verdict };
}
