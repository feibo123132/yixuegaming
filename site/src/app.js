import { createInitialState, getAvailableCards, gradeCase, playCard } from "./battle-engine.js";

const nodes = {
  cover: document.querySelector(".cover-panel"),
  battle: document.querySelector("#battleScreen"),
  startRun: document.querySelector("#startRun"),
  resetRun: document.querySelector("#resetRun"),
  closeDebrief: document.querySelector("#closeDebrief"),
  queueLabel: document.querySelector("#queueLabel"),
  patientName: document.querySelector("#patientName"),
  chiefComplaint: document.querySelector("#chiefComplaint"),
  caseNarrative: document.querySelector("#caseNarrative"),
  caseTime: document.querySelector("#caseTime"),
  systolicBp: document.querySelector("#systolicBp"),
  heartRate: document.querySelector("#heartRate"),
  spo2: document.querySelector("#spo2"),
  actionPoints: document.querySelector("#actionPoints"),
  stabilityValue: document.querySelector("#stabilityValue"),
  ischemiaValue: document.querySelector("#ischemiaValue"),
  uncertaintyValue: document.querySelector("#uncertaintyValue"),
  bleedingValue: document.querySelector("#bleedingValue"),
  stabilityMeter: document.querySelector("#stabilityMeter"),
  ischemiaMeter: document.querySelector("#ischemiaMeter"),
  uncertaintyMeter: document.querySelector("#uncertaintyMeter"),
  bleedingMeter: document.querySelector("#bleedingMeter"),
  ecgReport: document.querySelector("#ecgReport"),
  troponinReport: document.querySelector("#troponinReport"),
  imagingReport: document.querySelector("#imagingReport"),
  actionLog: document.querySelector("#actionLog"),
  cardHand: document.querySelector("#cardHand"),
  debriefPanel: document.querySelector("#debriefPanel"),
  gradeBadge: document.querySelector("#gradeBadge"),
  debriefTitle: document.querySelector("#debriefTitle"),
  debriefSummary: document.querySelector("#debriefSummary"),
  mistakeList: document.querySelector("#mistakeList"),
  examPointList: document.querySelector("#examPointList"),
};

let state = createInitialState();

nodes.startRun.addEventListener("click", () => {
  nodes.cover.classList.add("is-hidden");
  nodes.battle.classList.remove("is-hidden");
  render();
});

nodes.resetRun.addEventListener("click", restart);
nodes.closeDebrief.addEventListener("click", restart);

function restart() {
  state = createInitialState();
  nodes.debriefPanel.classList.add("is-hidden");
  nodes.cover.classList.add("is-hidden");
  nodes.battle.classList.remove("is-hidden");
  render();
}

function play(cardId) {
  state = playCard(state, cardId);
  render();

  if (state.flags.reperfused || state.metrics.actionPoints <= 0) {
    window.setTimeout(showDebrief, 360);
  }
}

function render() {
  nodes.queueLabel.textContent = state.queueLabel;
  nodes.patientName.textContent = state.patientName;
  nodes.chiefComplaint.textContent = state.chiefComplaint;
  nodes.caseNarrative.textContent = state.narrative;
  nodes.caseTime.textContent = `${String(state.metrics.time).padStart(2, "0")} min`;
  nodes.systolicBp.textContent = `${state.metrics.systolicBp}`;
  nodes.heartRate.textContent = `${state.metrics.heartRate}`;
  nodes.spo2.textContent = `${state.metrics.spo2}%`;
  nodes.actionPoints.textContent = state.metrics.actionPoints;

  renderMeter("stability", state.metrics.stability);
  renderMeter("ischemia", state.metrics.ischemia);
  renderMeter("uncertainty", state.metrics.uncertainty);
  renderMeter("bleeding", state.metrics.bleedingRisk);

  nodes.ecgReport.textContent = state.reports.ecg || "尚未检查";
  nodes.troponinReport.textContent = state.reports.troponin || "尚未检查";
  nodes.imagingReport.textContent = state.reports.cta || state.reports.echo || "尚未检查";

  nodes.actionLog.replaceChildren(
    ...state.log.map((entry) => {
      const item = document.createElement("li");
      item.className = entry.tone;
      item.textContent = entry.text;
      return item;
    }),
  );

  nodes.cardHand.replaceChildren(
    ...getAvailableCards(state).map((card) => {
      const button = document.createElement("button");
      button.className = "action-card";
      button.type = "button";
      button.dataset.type = card.type;
      button.disabled = card.disabled;
      button.innerHTML = `
        <span class="card-type">${card.type}</span>
        <strong>${card.name}</strong>
        <p>${card.shortText}</p>
        <span class="cost">行动点 ${card.cost}</span>
      `;
      button.addEventListener("click", () => play(card.id));
      return button;
    }),
  );
}

function renderMeter(name, value) {
  nodes[`${name}Value`].textContent = value;
  nodes[`${name}Meter`].value = value;
}

function showDebrief() {
  const result = gradeCase(state);
  nodes.gradeBadge.textContent = result.grade;
  nodes.debriefTitle.textContent = result.title;
  nodes.debriefSummary.textContent = result.summary;

  const mistakes = result.mistakes.length > 0 ? result.mistakes : ["关键路径完整，没有明显失误。"];
  nodes.mistakeList.replaceChildren(...mistakes.map(renderListItem));
  nodes.examPointList.replaceChildren(...result.examPoints.map(renderListItem));
  nodes.debriefPanel.classList.remove("is-hidden");
}

function renderListItem(text) {
  const item = document.createElement("li");
  item.textContent = text;
  return item;
}
