import { patchProfile } from "./pkl-state";

const RUN_DURATION_SECONDS = 45;
const TICK_MS = 50;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatSeconds(value) {
  return `${Math.max(0, Math.ceil(value))}s`;
}

export function createGameplayController({
  $w,
  ids,
  profile,
  onBackToMap,
  onTelemetry,
  onStatus,
}) {
  let tickHandle = null;
  let lastClutchReleaseAt = 0;
  let sessionOver = false;

  const state = {
    speed: 0,
    rpm: 1200,
    steer: 0,
    lean: 0,
    score: 0,
    combo: 0,
    status: "Ready to ride",
    timeLeft: RUN_DURATION_SECONDS,
    controls: {
      throttle: false,
      brake: false,
      clutch: false,
    },
  };

  function has(selector) {
    try {
      return Boolean($w(selector));
    } catch (_) {
      return false;
    }
  }

  function setText(selector, value) {
    if (!has(selector)) {
      return;
    }
    $w(selector).text = value;
  }

  function setLabel(selector, value) {
    if (!has(selector)) {
      return;
    }
    $w(selector).label = value;
  }

  function show(selector) {
    if (!has(selector)) {
      return;
    }
    try {
      $w(selector).show("fade", { duration: 160 });
    } catch (_) {
      $w(selector).show();
    }
  }

  function hide(selector) {
    if (!has(selector)) {
      return;
    }
    try {
      $w(selector).hide("fade", { duration: 100 });
    } catch (_) {
      $w(selector).hide();
    }
  }

  function setStatus(text) {
    state.status = text;
    setText(ids.statusText, text);
    if (typeof onStatus === "function") {
      onStatus(text);
    }
  }

  function updateHud() {
    setText(ids.speedText, `${Math.round(state.speed)} km/h`);
    setText(ids.rpmText, `${Math.round(state.rpm)} rpm`);
    setText(ids.scoreText, `${state.score}`);
    setText(ids.comboText, `x${state.combo}`);
    setText(ids.timerText, formatSeconds(state.timeLeft));
  }

  function basePhysicsStep(dt) {
    const throttleForce = state.controls.throttle ? 26 : 0;
    const brakeForce = state.controls.brake ? 34 : 0;
    const dragForce = 8;
    const clutchPenalty = state.controls.clutch ? 0.55 : 1;

    const netAccel = throttleForce * clutchPenalty - brakeForce - dragForce;
    state.speed = clamp(state.speed + netAccel * dt, 0, 220);

    const targetLean = clamp(state.steer * 0.95, -1, 1);
    state.lean += (targetLean - state.lean) * 0.2;

    const rpmFloor = 1100;
    const rpmFromSpeed = state.speed * 63;
    const throttleBump = state.controls.throttle ? 1100 : 0;
    state.rpm = clamp(rpmFloor + rpmFromSpeed + throttleBump, 1100, 14500);
  }

  function scoreTick(dt) {
    const activeRideBonus = state.speed > 30 ? 2 : 0;
    const controlBonus = Math.abs(state.lean) > 0.35 && state.speed > 45 ? 3 : 0;
    const comboBonus = state.combo > 0 ? state.combo : 0;
    state.score += Math.round((activeRideBonus + controlBonus + comboBonus) * dt * 20);
  }

  function evaluateTrick(name) {
    if (sessionOver) {
      return;
    }

    const now = Date.now();
    const hardLean = Math.abs(state.lean) > 0.7;
    const mediumLean = Math.abs(state.lean) > 0.5;
    const hasSpeed = state.speed > 35;

    let success = false;
    let points = 0;
    let feedback = "Too early";

    if (name === "wheelie") {
      const clutchPopWindowMs = 450;
      const clutchPop = now - lastClutchReleaseAt < clutchPopWindowMs;
      success = hasSpeed && state.controls.throttle && clutchPop;
      points = 140;
      feedback = success ? "Wheelie clean lift" : "Need throttle + clutch pop timing";
    } else if (name === "drift") {
      success = state.controls.brake && mediumLean && state.speed > 55;
      points = 180;
      feedback = success ? "Drift entry locked" : "Need speed + brake + lean";
    } else if (name === "stoppie") {
      success = state.controls.brake && !state.controls.throttle && state.speed > 70;
      points = 200;
      feedback = success ? "Stoppie balance held" : "Brake harder at higher speed";
    } else if (name === "kneeDown") {
      success = hardLean && state.speed > 65 && state.speed < 140;
      points = 160;
      feedback = success ? "Knee-down contact!" : "Need cleaner corner angle";
    }

    if (success) {
      state.combo += 1;
      state.score += points + state.combo * 25;
      setStatus(`Perfect: ${feedback}`);
    } else {
      state.combo = 0;
      state.score = Math.max(0, state.score - 35);
      setStatus(`Miss: ${feedback}`);
    }
    updateHud();
  }

  function endRun() {
    if (sessionOver) {
      return;
    }
    sessionOver = true;
    if (tickHandle) {
      clearInterval(tickHandle);
      tickHandle = null;
    }

    const bestScore = Math.max(profile.progression.bestScore || 0, state.score);
    patchProfile({
      progression: {
        bestScore,
        onboardingComplete: true,
      },
    });

    setText(ids.resultTitle, "Run Complete");
    setText(
      ids.resultBody,
      `Score ${state.score} • Best ${bestScore} • Top combo x${state.combo}`
    );
    show(ids.resultBox);
    setStatus("Session complete");
  }

  function tick() {
    if (sessionOver) {
      return;
    }
    const dt = TICK_MS / 1000;
    state.timeLeft -= dt;
    basePhysicsStep(dt);
    scoreTick(dt);
    updateHud();

    if (typeof onTelemetry === "function") {
      onTelemetry({
        speed: state.speed,
        rpm: state.rpm,
        steer: state.steer,
        lean: state.lean,
        score: state.score,
        combo: state.combo,
        timeLeft: state.timeLeft,
        status: state.status,
      });
    }

    if (state.timeLeft <= 0) {
      endRun();
    }
  }

  function setControl(name, pressed) {
    if (sessionOver) {
      return;
    }
    state.controls[name] = pressed;
    if (name === "clutch" && !pressed) {
      lastClutchReleaseAt = Date.now();
    }
  }

  function setSteer(normalized) {
    if (sessionOver) {
      return;
    }
    state.steer = clamp(normalized, -1, 1);
  }

  function restart() {
    if (tickHandle) {
      clearInterval(tickHandle);
    }
    state.speed = 0;
    state.rpm = 1200;
    state.steer = 0;
    state.lean = 0;
    state.score = 0;
    state.combo = 0;
    state.timeLeft = RUN_DURATION_SECONDS;
    state.controls = {
      throttle: false,
      brake: false,
      clutch: false,
    };
    sessionOver = false;
    hide(ids.resultBox);
    setStatus("Run restarted");
    updateHud();
    tickHandle = setInterval(tick, TICK_MS);
  }

  function boot() {
    setText(ids.bikeText, `Bike: ${profile.bike?.name || "Unknown"}`);
    setText(ids.zoneText, `Zone: ${profile.map?.selectedZone || "A"}`);
    setLabel(ids.throttleBtn, "Throttle");
    setLabel(ids.brakeBtn, "Brake");
    setLabel(ids.clutchBtn, "Clutch");
    hide(ids.resultBox);
    updateHud();
    setStatus("Controls ready");
    tickHandle = setInterval(tick, TICK_MS);
  }

  function dispose() {
    if (tickHandle) {
      clearInterval(tickHandle);
      tickHandle = null;
    }
  }

  return {
    boot,
    restart,
    dispose,
    setControl,
    setSteer,
    trick: evaluateTrick,
    endRun,
    backToMap: onBackToMap,
  };
}
