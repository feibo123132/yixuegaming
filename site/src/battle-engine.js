import { cards, examPointCatalog, initialCase } from "./game-data.js";

const cardById = new Map(cards.map((card) => [card.id, card]));

export function createInitialState() {
  return {
    ...structuredClone(initialCase),
    reports: {},
    playedCards: [],
    log: [
      {
        tone: "info",
        text: "患者进入胸痛通道。你需要在有限时间内明确诊断并处理再灌注。",
      },
    ],
  };
}

export function getAvailableCards(state) {
  return cards.map((card) => ({
    ...card,
    disabled: state.metrics.actionPoints < card.cost || state.flags.reperfused,
  }));
}

export function playCard(state, cardId) {
  const card = cardById.get(cardId);
  if (!card) return addLog(state, "warning", `未知卡牌：${cardId}`);
  if (state.metrics.actionPoints < card.cost) {
    return addLog(state, "warning", "行动点不足，无法执行该医嘱。");
  }
  if (state.flags.reperfused) {
    return addLog(state, "info", "患者已完成关键再灌注，进入复盘阶段。");
  }

  const next = structuredClone(state);
  next.metrics.actionPoints -= card.cost;
  next.metrics.time += card.cost * 5;
  next.playedCards.push(cardId);

  switch (cardId) {
    case "ecg":
      next.flags.ecgDone = true;
      next.reports.ecg = "II、III、aVF 导联 ST 段抬高，提示下壁 STEMI；需结合血压警惕右室受累。";
      next.metrics.uncertainty = clamp(next.metrics.uncertainty - 38);
      next.metrics.ischemia = clamp(next.metrics.ischemia + 4);
      push(next, "success", "ECG 抓到了 ST 段抬高，诊断方向明显收束。");
      break;
    case "troponin":
      next.reports.troponin = next.metrics.time < 20 ? "肌钙蛋白暂未升高，仍不能排除早期心梗。" : "肌钙蛋白升高，支持心肌坏死。";
      next.metrics.uncertainty = clamp(next.metrics.uncertainty - 12);
      push(next, "info", next.reports.troponin);
      break;
    case "echo":
      next.reports.echo = "床旁超声提示下壁运动减弱，右室充盈偏差。";
      next.flags.rvInfarctSuspected = true;
      next.metrics.uncertainty = clamp(next.metrics.uncertainty - 10);
      push(next, "info", "床旁超声强化了右室受累风险。");
      break;
    case "cta":
      next.flags.dissectionExcluded = true;
      next.reports.cta = "未见主动脉夹层征象。";
      next.metrics.uncertainty = clamp(next.metrics.uncertainty - 16);
      push(next, "success", "高危夹层被排除，抗栓路径更清晰。");
      break;
    case "stemi-diagnosis":
      if (!next.flags.ecgDone) {
        next.metrics.uncertainty = clamp(next.metrics.uncertainty + 6);
        push(next, "warning", "没有 ECG 证据就锁定 STEMI，诊断依据不足。");
      } else {
        next.flags.stemiDiagnosed = true;
        next.metrics.uncertainty = clamp(next.metrics.uncertainty - 18);
        push(next, "success", "诊断锁定：STEMI。再灌注倒计时开始变得刺眼。");
      }
      break;
    case "aspirin":
      next.flags.earlyAntiplatelet = true;
      next.metrics.ischemia = clamp(next.metrics.ischemia - 8);
      if (!next.flags.dissectionExcluded) {
        next.metrics.bleedingRisk = clamp(next.metrics.bleedingRisk + 18);
        push(next, "warning", "抗血小板已启动，但夹层风险尚未完全排除，出血风险上升。");
      } else {
        push(next, "success", "抗血小板治疗启动，血栓进展被压住了一些。");
      }
      break;
    case "p2y12":
      next.metrics.ischemia = clamp(next.metrics.ischemia - 7);
      next.metrics.bleedingRisk = clamp(next.metrics.bleedingRisk + 8);
      push(next, "info", "双联抗血小板完成，准备进入介入路径。");
      break;
    case "heparin":
      next.flags.anticoagulated = true;
      next.metrics.ischemia = clamp(next.metrics.ischemia - 7);
      next.metrics.bleedingRisk = clamp(next.metrics.bleedingRisk + 6);
      push(next, "info", "抗凝已给，冠脉血栓继续扩大的风险下降。");
      break;
    case "nitro":
      if (next.metrics.systolicBp < 90 || next.flags.rvInfarctSuspected) {
        next.flags.nitroTrap = true;
        next.metrics.stability = clamp(next.metrics.stability - 18);
        next.metrics.systolicBp = Math.max(68, next.metrics.systolicBp - 14);
        push(next, "danger", "硝酸酯降低前负荷，低血压/右室受累场景下病情变差。");
      } else {
        next.metrics.ischemia = clamp(next.metrics.ischemia - 10);
        push(next, "success", "胸痛缓解，但仍不能替代再灌注。");
      }
      break;
    case "pci":
      if (!next.flags.stemiDiagnosed) {
        next.metrics.uncertainty = clamp(next.metrics.uncertainty + 8);
        push(next, "warning", "介入室被提前呼叫，但诊断链条还没有闭合。");
      } else {
        next.flags.reperfused = true;
        next.metrics.stability = clamp(next.metrics.stability + 24);
        next.metrics.ischemia = clamp(next.metrics.ischemia - 34);
        next.metrics.systolicBp = Math.max(next.metrics.systolicBp, 104);
        push(next, "success", "罪犯血管开通，患者逐步稳定。");
      }
      break;
    default:
      push(next, "warning", `卡牌 ${cardId} 还没有效果。`);
  }

  if (!next.flags.reperfused && next.metrics.time >= 25) {
    next.metrics.ischemia = clamp(next.metrics.ischemia + 5);
    next.metrics.stability = clamp(next.metrics.stability - 3);
  }

  return next;
}

export function gradeCase(state) {
  let score = 55;
  if (state.flags.reperfused) score += 28;
  if (state.flags.ecgDone) score += 8;
  if (state.flags.stemiDiagnosed) score += 8;
  if (state.flags.anticoagulated) score += 4;
  if (state.flags.nitroTrap) score -= 18;
  if (state.metrics.bleedingRisk > 24) score -= 8;
  if (state.metrics.time > 30) score -= 6;
  if (!state.flags.reperfused) score -= 18;

  const grade = score >= 92 ? "S" : score >= 82 ? "A" : score >= 70 ? "B" : score >= 58 ? "C" : score >= 45 ? "D" : "F";

  const mistakes = [];
  if (!state.flags.ecgDone) mistakes.push("未优先获取 ECG，胸痛路径缺少关键证据。");
  if (!state.flags.stemiDiagnosed) mistakes.push("没有明确锁定 STEMI，导致治疗路径不够果断。");
  if (!state.flags.reperfused) mistakes.push("没有完成再灌注，缺血进展未被真正逆转。");
  if (state.flags.nitroTrap) mistakes.push("低血压或右室受累时使用硝酸酯，血流动力学恶化。");
  if (state.metrics.bleedingRisk > 24) mistakes.push("夹层风险未排除前抗栓，出血风险被放大。");

  return {
    grade,
    score,
    title: state.flags.reperfused ? "患者进入稳定复盘" : "夜班复盘：关键路径未闭合",
    summary:
      grade === "S" || grade === "A"
        ? "你完成了胸痛通道的关键动作：ECG 证据、STEMI 诊断、抗栓准备与再灌注。"
        : "这局暴露了胸痛路径中的薄弱环节，下一轮要更快拿到证据并避开禁忌。",
    mistakes,
    examPoints: [
      examPointCatalog.stemiPath,
      examPointCatalog.markerWindow,
      examPointCatalog.dissectionRisk,
      examPointCatalog.rvNitro,
    ],
  };
}

function addLog(state, tone, text) {
  const next = structuredClone(state);
  push(next, tone, text);
  return next;
}

function push(state, tone, text) {
  state.log.push({ tone, text });
}

function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}
