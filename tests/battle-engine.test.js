import test from "node:test";
import assert from "node:assert/strict";
import { createInitialState, gradeCase, playCard } from "../site/src/battle-engine.js";

test("ECG reveals ST elevation and lowers diagnostic uncertainty", () => {
  let state = createInitialState();

  state = playCard(state, "ecg");

  assert.equal(state.reports.ecg.includes("ST 段抬高"), true);
  assert.equal(state.flags.ecgDone, true);
  assert.equal(state.metrics.uncertainty < 55, true);
});

test("aspirin before excluding dissection increases bleeding risk", () => {
  let state = createInitialState();

  state = playCard(state, "aspirin");

  assert.equal(state.flags.earlyAntiplatelet, true);
  assert.equal(state.metrics.bleedingRisk >= 24, true);
  assert.equal(state.log.at(-1).tone, "warning");
});

test("nitroglycerin during hypotension or RV infarct worsens stability", () => {
  let state = createInitialState();
  state.metrics.systolicBp = 86;
  state.flags.rvInfarctSuspected = true;

  state = playCard(state, "nitro");

  assert.equal(state.metrics.stability < 58, true);
  assert.equal(state.flags.nitroTrap, true);
});

test("PCI after STEMI diagnosis stabilizes patient and earns a strong grade", () => {
  let state = createInitialState();

  for (const cardId of ["ecg", "stemi-diagnosis", "aspirin", "p2y12", "heparin", "pci"]) {
    state = playCard(state, cardId);
  }

  const result = gradeCase(state);

  assert.equal(state.flags.reperfused, true);
  assert.equal(state.metrics.stability >= 76, true);
  assert.equal(["S", "A"].includes(result.grade), true);
  assert.equal(result.examPoints.some((point) => point.includes("STEMI")), true);
});
