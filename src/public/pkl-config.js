export const PKL_ROUTES = {
  home: "/",
  character: "/character-customization",
  garage: "/garage",
  map: "/map",
  play: "/play",
};

export const PKL_IDS = {
  shell: {
    navHome: "#btnNavHome",
    navCharacter: "#btnNavCharacter",
    navGarage: "#btnNavGarage",
    navMap: "#btnNavMap",
    navPlay: "#btnNavPlay",
  },
  home: {
    title: "#txtHeroTitle",
    subtitle: "#txtHeroSubtitle",
    start: "#btnStartRide",
    continueBtn: "#btnContinueRide",
    introStrip: "#boxIntroStrip",
  },
  character: {
    maleCard: "#btnMale",
    femaleCard: "#btnFemale",
    helmetLeft: "#btnHelmetPrev",
    helmetRight: "#btnHelmetNext",
    jacketLeft: "#btnJacketPrev",
    jacketRight: "#btnJacketNext",
    glovesLeft: "#btnGlovesPrev",
    glovesRight: "#btnGlovesNext",
    shoesLeft: "#btnShoesPrev",
    shoesRight: "#btnShoesNext",
    previewImage: "#imgRiderPreview",
    previewTitle: "#txtRiderTitle",
    previewStats: "#txtRiderStats",
    saveBtn: "#btnSaveCharacter",
  },
  garage: {
    repeater: "#rptBikes",
    previewImage: "#imgBikePreview",
    previewName: "#txtBikeName",
    previewMeta: "#txtBikeMeta",
    selectedChip: "#txtSelectedBikeChip",
    selectBtn: "#btnSelectBike",
  },
  map: {
    hotspotA: "#boxZoneA",
    hotspotB: "#boxZoneB",
    hotspotC: "#boxZoneC",
    detailBox: "#boxZoneDetail",
    detailTitle: "#txtZoneTitle",
    detailBody: "#txtZoneBody",
    detailMeta: "#txtZoneMeta",
    startBtn: "#btnStartFromZone",
  },
  play: {
    htmlComponent: "#htmlPlayCanvas",
    speedText: "#txtHudSpeed",
    rpmText: "#txtHudRpm",
    scoreText: "#txtHudScore",
    comboText: "#txtHudCombo",
    statusText: "#txtHudStatus",
    timerText: "#txtHudTimer",
    bikeText: "#txtHudBike",
    zoneText: "#txtHudZone",
    steerPad: "#boxSteerPad",
    throttleBtn: "#btnThrottle",
    brakeBtn: "#btnBrake",
    clutchBtn: "#btnClutch",
    wheelieBtn: "#btnTrickWheelie",
    driftBtn: "#btnTrickDrift",
    stoppieBtn: "#btnTrickStoppie",
    kneeDownBtn: "#btnTrickKneeDown",
    retryBtn: "#btnRetryRun",
    backToMapBtn: "#btnBackToMap",
    resultBox: "#boxRunResult",
    resultTitle: "#txtRunResultTitle",
    resultBody: "#txtRunResultBody",
  },
};

export const PKL_THEME = {
  primary: "#00a9ff",
  secondary: "#03121d",
  accent: "#ff9f1c",
  text: "#eef8ff",
  panel: "#0a2233",
};

export const DEFAULT_PROFILE = {
  character: {
    gender: "male",
    gear: {
      helmet: 0,
      jacket: 0,
      gloves: 0,
      shoes: 0,
    },
  },
  bike: {
    id: "street-150",
    name: "Street 150",
    handling: "balanced",
  },
  map: {
    selectedZone: "A",
    unlockedZones: ["A"],
  },
  progression: {
    onboardingComplete: false,
    bestScore: 0,
  },
};

export const GARAGE_BIKES = [
  {
    id: "street-150",
    name: "Street 150",
    handling: "balanced",
    tier: "basic",
    description: "Easy control and stable corner entry for warm-up sessions.",
    image: "",
  },
  {
    id: "neo-300",
    name: "Neo 300",
    handling: "corner",
    tier: "basic",
    description: "Sharper turn response with medium acceleration curve.",
    image: "",
  },
  {
    id: "track-450",
    name: "Track 450",
    handling: "accel",
    tier: "advanced",
    description: "Aggressive throttle profile built for fast transitions.",
    image: "",
  },
  {
    id: "stunt-500",
    name: "Stunt 500",
    handling: "trick",
    tier: "advanced",
    description: "High stunt potential with sensitive body-balance behavior.",
    image: "",
  },
];

export const MAP_ZONES = {
  A: {
    title: "A - Footrest Line",
    body: "Train body position and smooth corner entry. Good place for learning knee-down timing.",
    meta: "Difficulty: Easy • Focus: Line and posture",
  },
  B: {
    title: "B - Escape Area",
    body: "Safe recovery area. Practice emergency brake and lane correction.",
    meta: "Difficulty: Medium • Focus: Braking control",
  },
  C: {
    title: "C - Tire / Stunt Zone",
    body: "Skill zone for controlled wheelie, drift entry, and stoppie feedback loops.",
    meta: "Difficulty: Hard • Focus: Stunt chain",
  },
};

export const GEAR_LIMITS = {
  helmet: 5,
  jacket: 5,
  gloves: 5,
  shoes: 5,
};
