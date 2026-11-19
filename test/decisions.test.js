import test from "node:test";
import assert from "node:assert/strict";
import { decisionFor } from "../src/content/decisiones.js";
import { gradeDecision } from "../src/content/decisionGrade.js";

test("cada semana trae un reto de tres decisiones y el veredicto distingue el conjunto", () => {
  for (let week = 1; week <= 8; week += 1) {
    const block = decisionFor(week).find((item) => item.type === "decision");
    assert.equal(block.steps.length, 3);
    assert.ok(block.brief.length > 80);
    assert.ok(block.pass.length > 40 && block.fail.length > 40);
    assert.ok(block.rules.length >= 1);

    for (const step of block.steps) {
      assert.equal(step.options.length, 3);
      assert.equal(step.options.filter((option) => option.solution).length, 1);
      assert.ok(step.ask.length > 20 && step.tension.length > 20);
      assert.ok(step.options.every((option) => option.effect.length > 20 && (option.solution || option.fault.length > 30)));
    }

    const solution = Object.fromEntries(
      block.steps.map((step) => [step.id, step.options.find((option) => option.solution).id]),
    );
    const closed = gradeDecision(block, solution);
    assert.equal(closed.ok, true, `semana ${week}`);
    assert.equal(closed.verdict, block.pass);

    const open = gradeDecision(block, {});
    assert.equal(open.ok, false);
    assert.equal(open.notes.length, 3);

    const trap = block.traps[0];
    const failed = gradeDecision(block, trap.picks);
    assert.equal(failed.ok, false, `trampa semana ${week}`);
    assert.ok(
      failed.notes.some((note) => note.includes(trap.excerpt)),
      `semana ${week}: ${failed.notes.join(" | ")}`,
    );
  }
});
