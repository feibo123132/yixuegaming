export const cards = [
  {
    id: "ecg",
    name: "12 导联 ECG",
    type: "检查",
    cost: 1,
    shortText: "快速捕捉 ST 段改变。",
  },
  {
    id: "troponin",
    name: "肌钙蛋白",
    type: "检查",
    cost: 1,
    shortText: "确认心肌坏死，但早期可能阴性。",
  },
  {
    id: "echo",
    name: "床旁超声",
    type: "检查",
    cost: 1,
    shortText: "观察室壁运动和右室负荷。",
  },
  {
    id: "cta",
    name: "主动脉 CTA",
    type: "检查",
    cost: 2,
    shortText: "排除高危夹层。",
  },
  {
    id: "stemi-diagnosis",
    name: "锁定 STEMI",
    type: "诊断",
    cost: 1,
    shortText: "将胸痛链条收束到再灌注路径。",
  },
  {
    id: "aspirin",
    name: "阿司匹林",
    type: "治疗",
    cost: 1,
    shortText: "抗血小板基础治疗。",
  },
  {
    id: "p2y12",
    name: "P2Y12 受体拮抗剂",
    type: "治疗",
    cost: 1,
    shortText: "双联抗血小板。",
  },
  {
    id: "heparin",
    name: "肝素",
    type: "治疗",
    cost: 1,
    shortText: "抗凝，降低血栓进展。",
  },
  {
    id: "nitro",
    name: "硝酸甘油",
    type: "治疗",
    cost: 1,
    shortText: "缓解缺血疼痛，低血压/右室梗死慎用。",
  },
  {
    id: "pci",
    name: "急诊 PCI",
    type: "治疗",
    cost: 2,
    shortText: "开通罪犯血管。",
  },
];

export const initialCase = {
  patientName: "周立，58 岁",
  chiefComplaint: "突发胸骨后压榨样疼痛 40 分钟，伴大汗、恶心。",
  queueLabel: "胸痛 / 40 min",
  narrative:
    "夜班刚开始，分诊台推来一位脸色苍白的中年男性。监护仪提示血压偏低，疼痛仍在持续。",
  metrics: {
    stability: 58,
    ischemia: 64,
    uncertainty: 78,
    bleedingRisk: 8,
    time: 0,
    actionPoints: 7,
    systolicBp: 92,
    heartRate: 108,
    spo2: 95,
  },
  flags: {
    ecgDone: false,
    dissectionExcluded: false,
    stemiDiagnosed: false,
    earlyAntiplatelet: false,
    anticoagulated: false,
    reperfused: false,
    nitroTrap: false,
    rvInfarctSuspected: true,
  },
};

export const examPointCatalog = {
  stemiPath: "STEMI 一旦由症状和 ECG 支持，应尽快进入再灌注路径。",
  markerWindow: "肌钙蛋白存在时间窗，早期阴性不能排除急性心梗。",
  dissectionRisk: "胸痛伴高危线索时需警惕主动脉夹层，抗栓前要有风险意识。",
  rvNitro: "右室梗死或低血压时硝酸酯可进一步降低前负荷，需慎用。",
};
